const prisma = require("../../config/database");

class NotificationRepository {
    // ---------------------------------------------
    // NOTIFICATIONS
    // ---------------------------------------------

    create = async (data) => {
        return prisma.notification.create({
            data
        });
    };

    findById = async (id, userId) => {
        return prisma.notification.findFirst({
            where: {
                id,
                userId
            }
        });
    };

    findByDeduplicationKey = async (userId, deduplicationKey) => {
        if (!deduplicationKey) return null;

        return prisma.notification.findUnique({
            where: {
                userId_deduplicationKey: {
                    userId,
                    deduplicationKey
                }
            }
        });
    };

    findAllByUser = async ({
        userId,
        category,
        unreadOnly = false,
        includeArchived = false,
        skip = 0,
        take = 20
    }) => {
        const where = {
            userId,
            ...(category && { category }),
            ...(!includeArchived && { archivedAt: null }),
            ...(unreadOnly && { readAt: null })
        };

        return prisma.notification.findMany({
            where,
            orderBy: {
                createdAt: "desc"
            },
            skip,
            take
        });
    };

    countByUser = async ({
        userId,
        category,
        unreadOnly = false,
        includeArchived = false
    }) => {
        return prisma.notification.count({
            where: {
                userId,
                ...(category && { category }),
                ...(!includeArchived && { archivedAt: null }),
                ...(unreadOnly && { readAt: null })
            }
        });
    };

    countUnreadByUser = async (userId) => {
        return prisma.notification.count({
            where: {
                userId,
                readAt: null,
                archivedAt: null
            }
        });
    };

    markAsRead = async (id, userId) => {
        return prisma.notification.updateMany({
            where: {
                id,
                userId,
                readAt: null
            },
            data: {
                readAt: new Date()
            }
        });
    };

    markAllAsRead = async (userId) => {
        return prisma.notification.updateMany({
            where: {
                userId,
                readAt: null,
                archivedAt: null
            },
            data: {
                readAt: new Date()
            }
        });
    };

    archive = async (id, userId) => {
        return prisma.notification.updateMany({
            where: {
                id,
                userId,
                archivedAt: null
            },
            data: {
                archivedAt: new Date()
            }
        });
    };

    // ---------------------------------------------
    // NOTIFICATION DELIVERIES
    // ---------------------------------------------

    createDeliveries = async (notificationId, deliveries) => {
        if (!deliveries?.length) {
            return { count: 0 };
        }

        return prisma.notificationDelivery.createMany({
            data: deliveries.map((delivery) => ({
                ...delivery,
                notificationId
            }))
        });
    };

    createDelivery = async (data) => {
        return prisma.notificationDelivery.create({
            data
        });
    };

    updateDelivery = async (id, data) => {
        return prisma.notificationDelivery.update({
            where: { id },
            data
        });
    };

    // ---------------------------------------------
    // PUSH SUBSCRIPTIONS
    // ---------------------------------------------

    findActivePushSubscriptions = async (userId, application) => {
        const now = new Date();

        return prisma.pushSubscription.findMany({
            where: {
                userId,
                revokedAt: null,
                ...(application && { application }),
                OR: [
                    { expiresAt: null },
                    { expiresAt: { gt: now } }
                ]
            }
        });
    };

    // ---------------------------------------------
    // NOTIFICATION PREFERENCES
    // ---------------------------------------------

    findPreferences = async (userId, category) => {
        return prisma.notificationPreference.findMany({
            where: {
                userId,
                ...(category && { category })
            }
        });
    };
}

module.exports = NotificationRepository;
