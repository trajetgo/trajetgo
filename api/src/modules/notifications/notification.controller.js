
const asyncHandler = require("../../utils/asyncHandler");
const ApiResponse = require("../../utils/ApiResponse");
const service = require("./notification.service");

class NotificationController {
    // GET /notifications
    getAll = asyncHandler(async (req, res) => {
        const result =
            await service.getUserNotifications({
                userId: req.user.id,
                ...req.query
            });

        return ApiResponse.success(
            res,
            result,
            "Notifications récupérées avec succès."
        );
    });

    // GET /notifications/unread-count
    getUnreadCount = asyncHandler(async (req, res) => {
        const count =
            await service.getUnreadCount(
                req.user.id
            );

        return ApiResponse.success(
            res,
            { count },
            "Nombre de notifications non lues récupéré."
        );
    });

    // PATCH /notifications/:id/read
    markAsRead = asyncHandler(async (req, res) => {
        const notification =
            await service.markAsRead(
                req.params.id,
                req.user.id
            );

        return ApiResponse.success(
            res,
            notification,
            "Notification marquée comme lue."
        );
    });

    // PATCH /notifications/read-all
    markAllAsRead = asyncHandler(async (req, res) => {
        const result =
            await service.markAllAsRead(
                req.user.id
            );

        return ApiResponse.success(
            res,
            result,
            "Toutes les notifications ont été marquées comme lues."
        );
    });

    // PATCH /notifications/:id/archive
    archive = asyncHandler(async (req, res) => {
        const notification =
            await service.archive(
                req.params.id,
                req.user.id
            );

        return ApiResponse.success(
            res,
            notification,
            "Notification archivée avec succès."
        );
    });
}

module.exports = new NotificationController();