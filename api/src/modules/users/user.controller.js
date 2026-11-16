const ApiResponse = require("../../utils/ApiResponse");
const asyncHandler = require("../../utils/asyncHandler");
const service = require("./user.service");

// Derrière un proxy (Nginx, Render...) : app.set('trust proxy', 1) pour que req.ip soit juste
const requestMeta = (req) => ({
    ip: req.ip,
    userAgent: req.get("user-agent"),
});

class UserController {
    /* =========================================================
       LIST
    ========================================================= */

    getUsers = asyncHandler(async (req, res) => {
        const result = await service.getUsers(
            req.query,
            req.user,
            requestMeta(req)
        );

        return ApiResponse.success(
            res,
            result,
            "Personnel récupéré avec succès."
        );
    });

    /* =========================================================
       UPDATE STATUS
    ========================================================= */

    updateStatus = asyncHandler(async (req, res) => {
        const user = await service.updateStatus(
            req.params,
            req.body,
            req.user
        );

        return ApiResponse.success(
            res,
            user,
            "Statut modifié avec succès."
        );
    });

    /* =========================================================
       UPDATE ROLE
    ========================================================= */

    updateRole = asyncHandler(async (req, res) => {
        const user = await service.updateRole(
            req.params,
            req.body,
            req.user
        );

        return ApiResponse.success(
            res,
            user,
            "Rôle modifié avec succès."
        );
    });

    inviteUser = asyncHandler(async (req, res) => {
        const user = await service.inviteUser(req.body, req.user);

        return ApiResponse.created(
            res,
            user,
            "Invitation envoyée avec succès."
        );
    });

    updateProfile =asyncHandler(async (req, res) => {
        const updatedUser = await service.updateProfile(
            req.body,
            req.user.id,
            requestMeta(req)
        );

        return ApiResponse.success(
            res,
            updatedUser,
            "Profile mis à jour avec succès"
        );
    });

    getSessions = asyncHandler(async (req, res) => { 
        const sessions = await service.getSessions(
            req.user.id,
            requestMeta(req)
        );

        return ApiResponse.success(
            res,
            sessions,
            "Les sessions actives récupérées avec succès."
        );
    });
}

module.exports = new UserController();