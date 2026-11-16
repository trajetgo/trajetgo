const ApiError = require('../../utils/ApiError');
const repository = require('./notification.repository');

class NotificationService {
    // ---------------------------------------------
    // CREATE NOTIFICATION
    // ---------------------------------------------

    createForUser = async ({
        userId,
        category,
        eventKey,
        title,
        body,
        data,
        actionUrl,
        priority = "NORMAL",
        deduplicationKey,
        expiresAt
    }) => {
        if (!userId || !category || !eventKey || !title || !body) {
            throw new ApiError(
                "Les informations obligatoires de la notification sont manquantes.",
                400
            );
        }

        // Vérification de l'idempotence métier.
        if (deduplicationKey) {
            const existing =
                await repository.findByDeduplicationKey(
                    userId,
                    deduplicationKey
                );

            if (existing) return existing;
        }

        try {
            return await repository.create({
                userId,
                category,
                eventKey,
                title,
                body,
                ...(data !== undefined && { data }),
                ...(actionUrl && { actionUrl }),
                priority,
                ...(deduplicationKey && { deduplicationKey }),
                ...(expiresAt && { expiresAt })
            });
        } catch (error) {
            // Deux événements identiques peuvent arriver simultanément.
            // La contrainte unique PostgreSQL protège contre ce cas.
            if (error.code === "P2002" && deduplicationKey) {
                const existing =
                    await repository.findByDeduplicationKey(
                        userId,
                        deduplicationKey
                    );

                if (existing) return existing;
            }

            throw error;
        }
    };

    // ---------------------------------------------
    // GET NOTIFICATIONS
    // ---------------------------------------------

    getUserNotifications = async ({
        userId,
        category,
        unreadOnly = false,
        includeArchived = false,
        page = 1,
        limit = 20
    }) => {
        if (!userId) {
            throw new ApiError("Utilisateur non identifié.", 401);
        }

        page = Math.max(1, Number(page) || 1);
        limit = Math.min(100, Math.max(1, Number(limit) || 20));

        const skip = (page - 1) * limit;

        const filters = {
            userId,
            category,
            unreadOnly,
            includeArchived
        };

        const [notifications, total] = await Promise.all([
            repository.findAllByUser({
                ...filters,
                skip,
                take: limit
            }),
            repository.countByUser(filters)
        ]);

        return {
            notifications,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    };

    // ---------------------------------------------
    // UNREAD COUNT
    // ---------------------------------------------

    getUnreadCount = async (userId) => {
        if (!userId) {
            throw new ApiError("Utilisateur non identifié.", 401);
        }

        return repository.countUnreadByUser(userId);
    };

    // ---------------------------------------------
    // MARK AS READ
    // ---------------------------------------------

    markAsRead = async (id, userId) => {
        if (!id) {
            throw new ApiError("Identifiant de notification invalide.", 400);
        }

        const result = await repository.markAsRead(
            id,
            userId
        );

        if (result.count > 0) {
            return repository.findById(id, userId);
        }

        // Une notification déjà lue reste une ressource valide.
        const existing = await repository.findById(
            id,
            userId
        );

        if (!existing) {
            throw new ApiError("Notification introuvable.", 404);
        }

        return existing;
    };

    // ---------------------------------------------
    // MARK ALL AS READ
    // ---------------------------------------------

    markAllAsRead = async (userId) => {
        if (!userId) {
            throw new ApiError("Utilisateur non identifié.", 401);
        }

        const result =
            await repository.markAllAsRead(userId);

        return {
            updatedCount: result.count
        };
    };

    // ---------------------------------------------
    // ARCHIVE
    // ---------------------------------------------

    archive = async (id, userId) => {
        if (!id) {
            throw new ApiError("Identifiant de notification invalide.", 400);
        }

        const result = await repository.archive(
            id,
            userId
        );

        if (result.count > 0) {
            return repository.findById(id, userId);
        }

        const existing = await repository.findById(
            id,
            userId
        );

        if (!existing) {
            throw new ApiError("Notification introuvable.", 404);
        }

        return existing;
    };
};

module.exports = new NotificationService();