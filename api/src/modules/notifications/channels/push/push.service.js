const { StatusCodes } = require("http-status-codes");
const ApiError = require("../../../../utils/ApiError");
const subscriptionRepository = require("../../subscriptions/subscription.repository");
const webPushProvider = require("./providers/web-push.provider");

const APPLICATIONS = [
    "PASSENGER",
    "COMPANY",
    "AGENCY",
    "CONTROLLER",
    "ADMIN"
];

class PushService {
    /**
     * Enregistre ou actualise un abonnement Web Push.
     */
    async subscribe({
        userId,
        subscription,
        application,
        deviceLabel,
        userAgent
    }) {
        if (!userId) {
            throw new ApiError(
                StatusCodes.UNAUTHORIZED,
                "Utilisateur non authentifié."
            );
        }

        if (!subscription?.endpoint ||
            !subscription?.keys?.p256dh ||
            !subscription?.keys?.auth) {
            throw new ApiError(
                StatusCodes.BAD_REQUEST,
                "Abonnement Push invalide."
            );
        }

        if (!APPLICATIONS.includes(application)) {
            throw new ApiError(
                StatusCodes.BAD_REQUEST,
                "Application Push invalide."
            );
        }

        const existing =
            await subscriptionRepository.findByEndpoint(
                subscription.endpoint
            );

        const expiresAt = subscription.expirationTime
            ? new Date(subscription.expirationTime)
            : null;

        const data = {
            userId,
            endpoint: subscription.endpoint,
            p256dh: subscription.keys.p256dh,
            auth: subscription.keys.auth,
            application,
            deviceLabel: deviceLabel || null,
            userAgent: userAgent || null,
            expiresAt,
            revokedAt: null
        };

        if (existing) {
            // Un endpoint existant ne doit pas être transféré
            // silencieusement vers un autre utilisateur.
            if (existing.userId !== userId) {
                throw new ApiError(
                    StatusCodes.CONFLICT,
                    "Cet abonnement est déjà associé à un autre compte."
                );
            }

            return subscriptionRepository.update(
                existing.id,
                data
            );
        }

        return subscriptionRepository.create(data);
    }

    /**
     * Révoque un abonnement appartenant à l'utilisateur.
     */
    async unsubscribe({ userId, subscriptionId }) {
        if (!userId || !subscriptionId) {
            throw new ApiError(
                StatusCodes.BAD_REQUEST,
                "Utilisateur ou abonnement invalide."
            );
        }

        const subscription =
            await subscriptionRepository.findByIdAndUser(
                subscriptionId,
                userId
            );

        if (!subscription) {
            throw new ApiError(
                StatusCodes.NOT_FOUND,
                "Abonnement Push introuvable."
            );
        }

        if (subscription.revokedAt) {
            return { revoked: true };
        }

        await subscriptionRepository.revokeById(
            subscriptionId,
            userId
        );

        return { revoked: true };
    }

    /**
     * Récupère les abonnements actifs d'un utilisateur.
     */
    async getActiveSubscriptions(userId, application) {
        if (!userId) {
            throw new ApiError(
                StatusCodes.BAD_REQUEST,
                "Identifiant utilisateur obligatoire."
            );
        }

        if (
            application &&
            !APPLICATIONS.includes(application)
        ) {
            throw new ApiError(
                StatusCodes.BAD_REQUEST,
                "Application Push invalide."
            );
        }

        return subscriptionRepository.findActiveByUser(
            userId,
            application
        );
    }

    /**
     * Envoie une notification à tous les appareils actifs
     * de l'utilisateur.
     */
    async sendToUser({ userId, payload, application }) {
        if (!userId || !payload?.title || !payload?.body) {
            throw new ApiError(
                StatusCodes.BAD_REQUEST,
                "Données de notification invalides."
            );
        }

        const subscriptions = await this.getActiveSubscriptions(
            userId,
            application
        );

        if (!subscriptions.length) {
            return {
                total: 0,
                sent: 0,
                failed: 0,
                revoked: 0,
                results: []
            };
        }

        const results = await Promise.all(
            subscriptions.map((subscription) =>
                this.sendToSubscription(subscription, payload)
            )
        );

        return {
            total: subscriptions.length,
            sent: results.filter((result) => result.status === "SENT").length,
            failed: results.filter((result) => result.status === "FAILED").length,
            revoked: results.filter((result) => result.status === "REVOKED").length,
            results
        };
    }

    /**
     * Envoie une notification à un appareil.
     */
    async sendToSubscription(subscription, payload) {
        try {
            await webPushProvider.send(subscription, payload);

            await subscriptionRepository.updateLastUsed(
                subscription.id
            );

            return {
                subscriptionId: subscription.id,
                status: "SENT"
            };
        } catch (error) {
            const statusCode = error.statusCode;

            // L'abonnement n'existe plus chez le fournisseur Push.
            if ([404, 410].includes(statusCode)) {
                await subscriptionRepository.revokeById(
                    subscription.id,
                    subscription.userId
                );

                return {
                    subscriptionId: subscription.id,
                    status: "REVOKED",
                    errorCode: statusCode
                };
            }

            // Les erreurs temporaires ne révoquent pas l'abonnement.
            return {
                subscriptionId: subscription.id,
                status: "FAILED",
                errorCode: statusCode || "PUSH_ERROR",
                message: error.message
            };
        }
    }
};

module.exports = new PushService();