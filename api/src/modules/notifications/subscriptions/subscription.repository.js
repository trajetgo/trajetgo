const prisma = require("../../../config/database");

class SubscriptionRepository{
    indByEndpoint(endpoint) {
        return prisma.pushSubscription.findUnique({
            where: { endpoint }
        });
    }

    create(data) {
        return prisma.pushSubscription.create({
            data
        });
    }

    update(id, data) {
        return prisma.pushSubscription.update({
            where: { id },
            data
        });
    }

    findActiveByUser(userId, application) {
        return prisma.pushSubscription.findMany({
            where: {
                userId,
                ...(application ? { application } : {}),
                revokedAt: null,
                OR: [
                    { expiresAt: null },
                    { expiresAt: { gt: new Date() } }
                ]
            }
        });
    }

    findByIdAndUser(id, userId) {
        return prisma.pushSubscription.findFirst({
            where: { id, userId }
        });
    }

    revokeById(id, userId) {
        return prisma.pushSubscription.updateMany({
            where: {
                id,
                userId,
                revokedAt: null
            },
            data: {
                revokedAt: new Date()
            }
        });
    }

    revokeByEndpoint(endpoint, userId) {
        return prisma.pushSubscription.updateMany({
            where: {
                endpoint,
                userId,
                revokedAt: null
            },
            data: {
                revokedAt: new Date()
            }
        });
    }

    updateLastUsed(id) {
        return prisma.pushSubscription.update({
            where: { id },
            data: {
                lastUsedAt: new Date()
            }
        });
    }
};

module.exports = new SubscriptionRepository();