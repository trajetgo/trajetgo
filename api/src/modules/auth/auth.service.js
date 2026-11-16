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
const { generateOtp, hashOtp, compareOtp } = require('../../utils/otp.utils');
const orangeSmsService = require('../../services/orange-sms.service');
const { parseIdentifier, normalizePhone } = require('../../utils/identifiers');
const { generateSessionToken, hashToken } = require('../../utils/tokens.js');
const notificationService = require('../notifications/notification.service.js');

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

        const existingUser = await repository.findByEmailAndPhone(
            email,
            phone
        );

        if (existingUser) {
            throw new ApiError(
                400,
                "Impossible de créer un compte avec ces informations."
            );
        }

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
                    algorithm: CURRENT_ALGORITHM
                }
            },
            phoneVerified: false,
            role: "PASSENGER",
        });

        const otp = generateOtp();

        const expiresAt = new Date(
            Date.now() +
            Number(process.env.OTP_EXPIRATION_MINUTES || 5) * 60 * 1000
        );

        await repository.createVerification({
            userId: newUser.id,
            purpose: "VERIFY_PHONE",
            channel: "SMS",
            target: phone,
            codeHash: hashOtp(otp),
            expiresAt,
        });

        const isDevelopment = process.env.NODE_ENV !== "production";

        // En production, l'envoi SMS sera activé lorsque le service sera prêt.
        if (isDevelopment) {
            console.info(
                `[DEV] OTP généré pour le compte ${newUser.id}.`
            );
        } else {
            await orangeSmsService.sendVerificationCode(phone, otp);
        }

        return {
            id: newUser.id,
            phone: newUser.phone,
            phoneVerified: false,
            verificationRequired: true,
            ...(isDevelopment && { devOtp: otp }),
        };
    };

    loginWithIdentifier = async ({ identifier, password, rememberMe = false }, meta = {}) => {
        const parsed = parseIdentifier(identifier);

        const account = parsed ? await userRepository.findForLogin(parsed) : null;
        const credential = account?.password;


        if (!account || !credential) {
            await dummyVerify(password); // même durée de réponse qu'un vrai compte
            await auditService.log({
                event: 'login.failed',
                ip: meta.ip,
                userAgent: meta.userAgent,
                metadata: { reason: 'unknown_account' },
            });
            throw new ApiError(401, INVALID_CREDENTIALS);
        }

        const valid = await verifyPassword(credential, password);

        if (!valid) {
            await auditService.log({
                userId: account.id,
                event: 'login.failed',
                ip: meta.ip,
                userAgent: meta.userAgent,
                metadata: { reason: 'bad_password' },
            });
            throw new ApiError(401, INVALID_CREDENTIALS);
        }

        // Le statut n'est révélé qu'après un mot de passe correct
        if (account.status === 'INACTIVE') {
            throw new ApiError(401, INVALID_CREDENTIALS);
        }
        if (account.status === 'SUSPENDED') {
            await auditService.log({
                userId: account.id,
                event: 'login.blocked',
                ip: meta.ip,
                userAgent: meta.userAgent,
                metadata: { reason: 'suspended' },
            });
            throw new ApiError(403, 'Ce compte est suspendu.');
        }

        // Migration progressive des anciens hash (bcrypt...) vers Argon2id
        if (credentialNeedsRehash(credential)) {
            const newHash = await hashPassword(password);
            await repository.updatePasswordCredential(account.id, {
                hash: newHash,
                algorithm: CURRENT_ALGORITHM,
            });
        }

        // Nouvelle session SSO (nouveau jeton à chaque connexion)
        const token = generateSessionToken();
        const now = new Date();
        const expiresAt = new Date(
            now.getTime() + (rememberMe ? SESSION_TTL_REMEMBER_MS : SESSION_TTL_MS)
        );

        await repository.createSession({
            userId: account.id,
            tokenHash: hashToken(token),
            authTime: now,
            amr: ['pwd'],
            mfaLevel: 0,
            ip: meta.ip,
            userAgent: meta.userAgent,
            expiresAt,
        });

        await userRepository.touchLastLogin(account.id);

        await auditService.log({
            userId: account.id,
            event: 'login.success',
            ip: meta.ip,
            userAgent: meta.userAgent,
        });

        const user = await userRepository.findById(account.id);

        return { user, session: { token, expiresAt, persistent: Boolean(rememberMe) } };
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
};

module.exports = new AuthService();