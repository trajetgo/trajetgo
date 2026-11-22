const crypto = require('crypto');
const UAParser = require('ua-parser-js');
const { generateAccessToken, generateRefreshToken } = require('../../shared/jwt/jwt.utils.js');
const ApiError = require('../../utils/ApiError');
const {
    hashPassword,
    verifyPassword,
    credentialNeedsRehash,
    CURRENT_ALGORITHM,
    dummyVerify,
} = require('../../utils/password');
const userRepository = require('../users/user.repository');
const repository = require('./auth.repository');
const auditService = require('../audit/audit.service');
const { generateOtp, hashOtp, compareOtp, hashVerificationToken, generateVerificationToken, compareVerificationToken } = require('../../utils/otp.utils');
const orangeSmsService = require('../../services/orange-sms.service');
const { parseIdentifier, normalizePhone } = require('../../utils/identifiers');
const { generateSessionToken, hashToken } = require('../../utils/tokens.js');
const notificationService = require('../notifications/notification.service.js');
const emailService = require('../notifications/channels/email/email.service.js');
const loginAttemptRepository = require('./loginAttempt.repository.js');
const securityNotificationService = require('./securityNotification.service.js');
const riskService = require('./risk.service.js');

const DAY_MS = 24 * 60 * 60 * 1000;
const SESSION_TTL_MS = 1 * DAY_MS;
const SESSION_TTL_REMEMBER_MS =
    Number(process.env.SESSION_REMEMBER_DAYS || 30) * DAY_MS;

// Message identique pour "compte inconnu" et "mauvais mot de passe"
const INVALID_CREDENTIALS = 'Identifiants invalides.';

class AuthService {
    whoami = async (userId) => {
        const user = await userRepository.findById(userId);

        if (!user) {
            throw new ApiError(404, 'Utilisateur introuvable.');
        }

        return user;
    };

    register = async (data, meta = {}) => {
        const { email, phone, password } = data;

        if (!password || !phone) {
            throw new ApiError(
                400,
                "Le téléphone et le mot de passe sont obligatoires."
            );
        }

        /* ---------- Unicité ---------- */

        const existingUser = await repository.findByEmailAndPhone(email, phone);

        if (existingUser) {
            throw new ApiError(
                400,
                "Impossible de créer un compte avec ces informations."
            );
        }

        /* ---------- Création utilisateur ---------- */

        const passwordHash = await hashPassword(password);

        const newUser = await userRepository.create({
            phone,
            email,
            firstName: data.firstName,
            lastName: data.lastName,
            fullName: `${data.firstName} ${data.lastName}`,
            password: {
                create: {
                    hash: passwordHash,
                    algorithm: CURRENT_ALGORITHM,
                },
            },
            phoneVerified: false,
            emailVerified: false,
            role: "PASSENGER",
        });

        /* ---------- 1. Token email (lien) ---------- */

        if (email) {
            const emailToken = generateVerificationToken();

            const emailExpiresAt = new Date(
                Date.now() +
                Number(process.env.EMAIL_VERIFICATION_EXPIRATION_HOURS || 24) *
                60 * 60 * 1000
            );

            const emailVerification = await repository.createVerification({
                userId: newUser.id,
                purpose: "VERIFY_EMAIL",
                channel: "EMAIL",
                target: email,
                codeHash: hashVerificationToken(emailToken),
                expiresAt: emailExpiresAt,
            });

            // emailVerification.id est un cuid opaque (ex. "clx1a2b3c4d5e6f7g8h9i0j")
            const verificationUrl = `${process.env.AUTH_URL}/verify-email?token=${emailToken}&vid=${emailVerification.id}`;

            await emailService.sendEmail({
                to: newUser.email,
                template: "email-verification",
                data: {
                    fullName: newUser.fullName,
                    verificationUrl: verificationUrl,
                    expiresInHours:
                        Number(process.env.EMAIL_VERIFICATION_EXPIRATION_HOURS) || 24,
                },
                subject: "Vérification de votre adresse e-mail - Trajet Go",
            });
        }

        await auditService.log({
            userId: newUser.id,
            event: 'register.success',
            ip: meta.ip,
            userAgent: meta.userAgent,
            device: meta.device,
            os: meta.os,
            metadata: { email: newUser.email, phone: newUser.phone },
        });

        /* ---------- 2. Retour ---------- */

        return {
            id: newUser.id,
            phone: newUser.phone,
            phoneVerified: false,
            emailVerified: false,
            verificationRequired: true,
        };
    };

    loginWithIdentifier = async ({ identifier, password, rememberMe = false }, meta = {}) => {
        const parsed = parseIdentifier(identifier);
        const normalized = parsed?.value ?? String(identifier).trim().toLowerCase();

        const account = parsed
            ? await userRepository.findForLogin(parsed)
            : null;

        const credential = account?.password;

        /* ---------- Compte inconnu ---------- */

        if (!account || !credential) {
            await dummyVerify(password);

            await loginAttemptRepository.create({
                identifier: normalized,
                success: false,
                reason: "unknown_account",
                ip: meta.ip,
                userAgent: meta.userAgent,
            });

            await auditService.log({
                event: "login.failed",
                ip: meta.ip,
                userAgent: meta.userAgent,
                device: meta.deviceName,
                os: meta.os,
                metadata: { reason: "unknown_account" },
            });

            throw new ApiError(401, INVALID_CREDENTIALS);
        }

        /* ---------- Mot de passe incorrect ---------- */

        const valid = await verifyPassword(credential, password);

        if (!valid) {
            await loginAttemptRepository.create({
                identifier: normalized,
                userId: account.id,
                success: false,
                reason: "bad_password",
                ip: meta.ip,
                userAgent: meta.userAgent,
            });

            await auditService.log({
                userId: account.id,
                event: "login.failed",
                ip: meta.ip,
                userAgent: meta.userAgent,
                device: meta.device,
                os: meta.os,
                metadata: { reason: "bad_password" },
            });

            throw new ApiError(401, INVALID_CREDENTIALS);
        }

        /* ---------- Statut ---------- */

        if (account.status === "INACTIVE") {
            throw new ApiError(401, INVALID_CREDENTIALS);
        }

        if (account.status === "SUSPENDED") {
            await auditService.log({
                userId: account.id,
                event: "login.blocked",
                ip: meta.ip,
                userAgent: meta.userAgent,
                device: meta.device,
                os: meta.os,
                metadata: { reason: "suspended" },
            });
            throw new ApiError(403, "Ce compte est suspendu.");
        }

        /* ---------- Détection de risque ---------- */

        const risk = await riskService.accessLoginRisk({
            userId: account.id,
            identifier: normalized,
            userAgent: meta.userAgent,
            ip: meta.ip,
        });

        if (risk.level === "high") {
            await auditService.log({
                userId: account.id,
                event: "login.blocked",
                ip: meta.ip,
                userAgent: meta.userAgent,
                device: meta.device,
                os: meta.os,
                metadata: { reason: "too_many_failures", risk: risk.reasons },
            });

            throw new ApiError(
                429,
                "Trop de tentatives échouées. Réessayez dans quelques minutes."
            );
        }

        /* ---------- Rehash progressif ---------- */

        if (credentialNeedsRehash(credential)) {
            const newHash = await hashPassword(password);
            await repository.updatePasswordCredential(account.id, {
                hash: newHash,
                algorithm: CURRENT_ALGORITHM,
            });
        }

        /* ---------- Création session ---------- */

        const token = generateSessionToken();
        const now = new Date();
        const expiresAt = new Date(
            now.getTime() + (rememberMe ? SESSION_TTL_REMEMBER_MS : SESSION_TTL_MS)
        );

        await repository.createSession({
            userId: account.id,
            tokenHash: hashToken(token),
            authTime: now,
            amr: ["pwd"],
            mfaLevel: 0,
            ip: meta.ip,
            userAgent: meta.userAgent,
            deviceName: meta.device?.device?.model ?? null,
            os: meta.os?.name ?? null,
            expiresAt,
        });

        await userRepository.touchLastLogin(account.id);

        /* ---------- Enregistrer la connexion réussie ---------- */

        await loginAttemptRepository.create({
            identifier: normalized,
            userId: account.id,
            success: true,
            ip: meta.ip,
            userAgent: meta.userAgent,
        });

        /* ---------- Audit enrichi ---------- */

        await auditService.log({
            userId: account.id,
            event: "login.success",
            ip: meta.ip,
            userAgent: meta.userAgent,
            device: meta.device,
            os: meta.os,
            metadata: {
                risk: risk.level,
                riskReasons: risk.reasons,
                knownDevice: risk.knownDevice,
            },
        });

        /* ---------- Notification si nouvel appareil ---------- */

        if (!risk.knownDevice) {
            // Envoi asynchrone : on ne bloque pas la réponse au client.
            securityNotificationService
                .notifyNewDevice(account, {
                    ip: meta.ip,
                    userAgent: meta.userAgent,
                    deviceName: meta.deviceName,
                    os: meta.os,
                    browser: meta.browser,
                })
                .catch((err) => {
                    console.error("Échec notification nouvel appareil:", err);
                });
        }

        /* ---------- Retour ---------- */

        const user = await userRepository.findById(account.id);

        return {
            user,
            session: {
                token,
                expiresAt,
                persistent: Boolean(rememberMe),
            },
            risk: {
                level: risk.level,
                newDevice: !risk.knownDevice,
            },
        };
    };

    sendOtp = async (phone, meta = {}) => {
        const normalizedPhone = normalizePhone(phone);

        if (!/^\+225\d{10}$/.test(normalizedPhone)) {
            throw new ApiError(400, "Numéro de téléphone invalide.");
        }

        const user = await repository.findUserByPhone(normalizedPhone);

        if (!user) {
            // Message générique pour éviter l'énumération de numéros.
            // On retourne 200 pour ne pas révéler l'absence de compte.
            return {
                phone: normalizedPhone,
                sent: true,
            };
        }

        /* ---------- Rate-limiting basique ---------- */

        const recent = await repository.findRecentVerification({
            target: normalizedPhone,
            purpose: "VERIFY_PHONE",
            since: new Date(Date.now() - 60 * 1000), // 60 s
        });

        if (recent) {
            throw new ApiError(
                429,
                "Veuillez attendre avant de demander un nouveau code."
            );
        }

        /* ---------- Générer et stocker l'OTP ---------- */

        const otp = generateOtp();

        const expiresAt = new Date(
            Date.now() +
            Number(process.env.OTP_EXPIRATION_MINUTES || 5) * 60 * 1000
        );

        await repository.createVerification({
            userId: user.id,
            purpose: "VERIFY_PHONE",
            channel: "SMS",
            target: normalizedPhone,
            codeHash: hashOtp(otp),
            expiresAt,
        });

        /* ---------- Envoi ---------- */

        const isDevelopment = process.env.NODE_ENV !== "production";

        if (isDevelopment) {
            console.info(`[DEV] OTP généré pour ${normalizedPhone}.`);
        } else {
            await orangeSmsService.sendVerificationCode(normalizedPhone, otp);
        }

        return {
            phone: normalizedPhone,
            sent: true,
            ...(isDevelopment && { devOtp: otp }),
        };
    }

    verifyPhone = async (data, meta = {}) => {
        const { phone, code } = data;

        const normalizedPhone = normalizePhone(phone);

        const verification = await repository.findActiveVerification(
            normalizedPhone,
            "VERIFY_PHONE"
        );

        if (!verification) {
            throw new ApiError(
                400,
                "Code invalide ou expiré. Demandez un nouveau code."
            );
        }

        if (!compareOtp(code, verification.codeHash)) {
            await repository.incrementAttempts(verification.id);

            if (verification.attempts + 1 >= verification.maxAttempts) {
                throw new ApiError(
                    429,
                    "Trop de tentatives. Demandez un nouveau code."
                );
            }

            throw new ApiError(400, "Code invalide.");
        }

        await repository.consumeVerification(verification.id);

        const user = await userRepository.markPhoneVerified(verification.userId);

        return user;
    };

    verifyEmail = async (token, verificationId, meta = {}) => {
        /* ---------- Validation ---------- */

        if (!token || typeof token !== "string") {
            throw new ApiError(400, "Token manquant.");
        }

        /* ---------- Recherche par hash ---------- */

        const tokenHash = hashVerificationToken(token);

        const verification = await repository.findActiveVerificationByHash(
            tokenHash,
            "VERIFY_EMAIL"
        );

        if (!verification) {
            throw new ApiError(
                400,
                "Lien invalide ou expiré. Demandez un nouvel email."
            );
        }

        // Défense en profondeur : si vid est fourni, il doit correspondre
        if (verificationId && verification.id !== verificationId) {
            throw new ApiError(400, "Lien invalide ou expiré.");
        }

        /* ---------- Comparaison à temps constant ---------- */

        if (!compareVerificationToken(token, verification.codeHash)) {
            throw new ApiError(400, "Lien invalide.");
        }

        /* ---------- Consommation ---------- */

        await repository.consumeVerification(verification.id);

        /* ---------- Marquage ---------- */

        const user = await userRepository.markEmailVerified(
            verification.userId
        );

        await auditService.log({
            userId: user.id,
            event: 'email.verified',
            ip: meta.ip,
            userAgent: meta.userAgent,
            device: meta.device,
            os: meta.os,
            metadata: { email: user.email },
        });

        return user;
    };

    resendVerificationEmail = async (verificationId) => {
        /* ---------- Recherche de la vérification ---------- */

        const verification = await repository.findVerificationById(verificationId);

        if (!verification) {
            throw new ApiError(400, "Demande invalide.");
        }

        /* ---------- Vérifications ---------- */

        if (verification.purpose !== "VERIFY_EMAIL") {
            throw new ApiError(400, "Demande invalide.");
        }

        if (verification.channel !== "EMAIL") {
            throw new ApiError(400, "Demande invalide.");
        }

        /* ---------- L'utilisateur est-il déjà vérifié ? ---------- */

        const user = await repository.findUserById(verification.userId);

        if (!user) {
            throw new ApiError(400, "Demande invalide.");
        }

        if (user.emailVerified) {
            throw new ApiError(400, "Cette adresse e-mail est déjà vérifiée.");
        }

        /* ---------- Rate-limiting ---------- */

        const recent = await repository.findRecentVerification({
            target: verification.target,
            purpose: "VERIFY_EMAIL",
            since: new Date(Date.now() - 5 * 60 * 1000), // 5 min
        });

        if (recent) {
            throw new ApiError(
                429,
                "Veuillez attendre 5 minutes avant de demander un nouveau lien."
            );
        }

        /* ---------- Nouvelle vérification ---------- */

        const newToken = generateVerificationToken();

        const expiresAt = new Date(
            Date.now() +
            Number(process.env.EMAIL_VERIFICATION_EXPIRATION_HOURS || 24) *
            60 * 60 * 1000
        );

        const newVerification = await repository.createVerification({
            userId: user.id,
            purpose: "VERIFY_EMAIL",
            channel: "EMAIL",
            target: verification.target,
            codeHash: hashVerificationToken(newToken),
            expiresAt,
        });

        /* ---------- Envoi ---------- */
        const verificationUrl = `${process.env.AUTH_URL}/verify-email?token=${newToken}&vid=${newVerification.id}`;

        await emailService.sendEmail({
            to: verification.target,
            template: "email-verification",
            data: {
                fullName: user.fullName,
                verificationUrl: verificationUrl,
                expiresInHours:
                    Number(process.env.EMAIL_VERIFICATION_EXPIRATION_HOURS) || 24,
            },
            subject: "Vérification de votre adresse e-mail - Trajet Go",
        });

        return { sent: true };
    };

    forgotPassword = async (identifier, meta = {}) => {
        const parsed = parseIdentifier(identifier);

        if (!parsed) {
            // Identifiant mal formé : on retourne quand même "sent" pour
            // ne pas révéler que le format est invalide.
            return { sent: true };
        }

        const { type, value } = parsed;

        const account = await repository.findByIdentifier({ type, value });

        if (!account) {
            return { sent: true };
        }

        /* ---------- Rate-limiting ---------- */

        const recent = await repository.findRecentVerification({
            target: value,
            purpose: "RESET_PASSWORD",
            since: new Date(Date.now() - 60 * 1000),
        });

        if (recent) {
            throw new ApiError(
                429,
                "Veuillez attendre avant de demander un nouveau lien."
            );
        }

        /* ---------- Durée de validité ---------- */

        const expiresAt = new Date(
            Date.now() +
            Number(process.env.PASSWORD_RESET_EXPIRATION_MINUTES || 60) * 60 * 1000
        );

        /* ---------- Email : token + lien ---------- */

        if (type === "email") {
            const token = generateVerificationToken();

            const verification = await repository.createVerification({
                userId: account.id,
                purpose: "RESET_PASSWORD",
                channel: "EMAIL",
                target: account.email,
                codeHash: hashVerificationToken(token),
                expiresAt,
            });

            // ✅ On utilise l'id de LA vérification créée, pas `recent`
            const resetUrl = `${process.env.AUTH_URL}/reset-password?token=${token}&vid=${verification.id}`;

            await emailService.sendEmail({
                to: account.email,
                template: "reset-password",
                data: {
                    fullName: account.fullName,
                    resetUrl,
                    expiresInMinutes:
                        Number(process.env.PASSWORD_RESET_EXPIRATION_MINUTES) || 60,
                },
                subject: "Réinitialisation de votre mot de passe - Trajet Go",
            });

            await auditService.log({
                userId: account.id,
                event: 'password.reset.requested',
                ip: meta.ip,
                userAgent: meta.userAgent,
                device: meta.device,
                os: meta.os,
                metadata: { email: account.email },
            });

            return { sent: true };
        }

        /* ---------- SMS : OTP uniquement ---------- */

        const otp = generateOtp();

        await repository.createVerification({
            userId: account.id,
            purpose: "RESET_PASSWORD",
            channel: "SMS",
            target: account.phone,
            codeHash: hashOtp(otp),
            expiresAt,
        });

        const isDev = process.env.NODE_ENV !== "production";

        if (isDev) {
            console.info(`[DEV] OTP reset pour ${value} : ${otp}`);
        } else {
            await orangeSmsService.sendVerificationCode(value, otp);
        }

        await auditService.log({
            userId: account.id,
            event: 'password.reset.requested',
            ip: meta.ip,
            userAgent: meta.userAgent,
            device: meta.device,
            os: meta.os,
            metadata: { phone: account.phone },
        });

        return { sent: true };
    };

    validateResetToken = async (token) => {
        if (!token) return false;

        const tokenHash = hashVerificationToken(token);

        const verification = await repository.findActiveVerificationByHash(
            tokenHash,
            "RESET_PASSWORD"
        );

        return Boolean(verification);
    };

    resetPassword = async ({ token, verificationId, newPassword }) => {
        const tokenHash = hashVerificationToken(token);

        const verification = await repository.findActiveVerificationByHash(
            tokenHash,
            "RESET_PASSWORD"
        );

        if (!verification) {
            throw new ApiError(400, "Lien invalide ou expiré.");
        }

        // Défense en profondeur : si vid est fourni, il doit correspondre
        if (verificationId && verification.id !== verificationId) {
            throw new ApiError(400, "Lien invalide ou expiré.");
        }

        /* ---------- Mise à jour du mot de passe ---------- */

        const hash = await hashPassword(newPassword);

        await repository.updatePasswordCredential(verification.userId, {
            hash,
            algorithm: CURRENT_ALGORITHM,
        });

        /* ---------- Consommation du token ---------- */

        await repository.consumeVerification(verification.id);

        /* ---------- Révocation de toutes les sessions ---------- */

        await repository.revokeSessions(verification.userId);

        return { userId: verification.userId };
    };

    logout = async (userId, token, meta = {}) => {
        if (!token) {
            // Pas de token : rien à révoquer. On retourne success quand même
            // (le client va nettoyer son cookie de son côté).
            return { success: true };
        }

        const tokenHash = hashToken(token);

        const result = await repository.revokeSessionByToken(tokenHash);

        await auditService.log({
            userId,
            event: result.count > 0
                ? "logout.success"
                : "logout.already_revoked",
            ip: meta.ip,
            userAgent: meta.userAgent,
            device: meta.device,
            os: meta.os,
        });

        return { success: true };
    };
};

module.exports = new AuthService();