const ApiResponse = require("../../utils/ApiResponse");
const asyncHandler = require("../../utils/asyncHandler");
const { setSessionCookie, clearSessionCookie } = require("../../utils/sessionCookie");
const service = require('./auth.service');
const emailService = require('../notifications/channels/email/email.service');
const ApiError = require('../../utils/ApiError');
const requestMeta = require("../../utils/requestMeta");

class AuthController {

    testEmail = asyncHandler(async (req, res) => {
        const { to, subject, template, data } = req.body;

        const result = await emailService.sendEmail({
            to,
            subject,
            template,
            data
        });

        return ApiResponse.success(
            res,
            result,
            "Email envoyé avec succès."
        );
    })

    whoami = asyncHandler(async (req, res) => {
        const user = await service.whoami(req.user.id);

        return ApiResponse.success(
            res,
            user,
            'Utilisateur récupéré avec succès.'
        )
    });

    register = asyncHandler(async (req, res) => {
        const newUser = await service.register(
            req.body,
            requestMeta(req)
        );

        return ApiResponse.created(
            res,
            newUser,
            'Compte créé avec succès. En attente de vérification.'
        )
    });

    loginWithIdentifier = asyncHandler(async (req, res) => {
        const { user, session } = await service.loginWithIdentifier(
            req.body,
            requestMeta(req)
        );

        // Le jeton de session ne voyage que dans le cookie HttpOnly, jamais dans le JSON
        setSessionCookie(res, session.token, session);

        return ApiResponse.success(
            res,
            user,
            "Connexion réussie"
        );
    });

    sendOtp = asyncHandler(async (req, res) => {
        const { phone } = req.body;

        const result = await service.sendOtp(
            phone,
            requestMeta(req)
        );

        return ApiResponse.success(
            res,
            result,
            "Code de vérification envoyé."
        );
    });

    verifyPhone = asyncHandler(async (req, res) => {

        const user = await service.verifyPhone(
            req.body,
            requestMeta(req)
        );

        return ApiResponse.success(
            res,
            user,
            "Téléphone vérifié avec succès."
        );
    });

    verifyEmail = asyncHandler(async (req, res) => {
        const { token, verificationId } = req.query;

        if (!token) {
            throw new ApiError(400, "Token manquant.");
        }

        const user = await service.verifyEmail(
            token,
            verificationId,
            requestMeta(req)
        );

        return ApiResponse.success(
            res,
            user,
            "Adresse e-mail vérifiée avec succès."
        );
    });

    resendVerification = asyncHandler(async (req, res) => {
        const { verificationId } = req.body;

        if (!verificationId) {
            throw new ApiError(400, "Identifiant de vérification manquant.");
        }

        await service.resendVerificationEmail(verificationId);

        return ApiResponse.success(
            res,
            null,
            "Un nouveau lien de vérification vous a été envoyé."
        );
    });

    forgotPassword = asyncHandler(async (req, res) => {
        const { identifier } = req.body;

        await service.forgotPassword(
            identifier,
            requestMeta(req)
        );

        // Réponse toujours identique (200), même si l'identifiant n'existe pas
        return ApiResponse.success(
            res,
            null,
            "Si un compte existe, un lien de réinitialisation a été envoyé."
        );
    });

    validateResetToken = asyncHandler(async (req, res) => {
        const { token } = req.query;

        const valid = await service.validateResetToken(
            token
        );

        if (!valid) {
            throw new ApiError(400, "Lien invalide ou expiré.");
        }

        return ApiResponse.success(
            res,
            { valid: true },
            "Lien valide."
        );
    });

    resetPassword = asyncHandler(async (req, res) => {
        const { token, verificationId, newPassword } = req.body;

        const { userId } = await service.resetPassword({
            token,
            verificationId,
            newPassword
        });

        return ApiResponse.success(
            res,
            { userId },
            "Mot de passe réinitialisé avec succès."
        );
    });

    logout = asyncHandler(async (req, res) => {
        await service.logout(
            req.user.id, 
            req.session.token,
            requestMeta(req)
        );

        clearSessionCookie(res);

        return ApiResponse.success(
            res,
            null,
            "Déconnexion réussie."
        );
    });
};

module.exports = new AuthController();