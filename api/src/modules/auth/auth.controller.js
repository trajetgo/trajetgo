const crypto = require('crypto');
const ApiResponse = require("../../utils/ApiResponse");
const asyncHandler = require("../../utils/asyncHandler");
const { setSessionCookie, clearSessionCookie } = require("../../utils/sessionCookie");
const service = require('./auth.service');

// Derrière un proxy (Nginx, Render...) : app.set('trust proxy', 1) pour que req.ip soit juste
const requestMeta = (req) => ({
    ip: req.ip,
    userAgent: req.get("user-agent"),
});

class AuthController {
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
};

module.exports = new AuthController();