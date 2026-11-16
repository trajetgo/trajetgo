
const webPush = require("../push.config");

class WebPushProvider {
    /**
     * Envoie une notification à un abonnement navigateur.
     *
     * @param {Object} subscription
     * @param {Object} payload
     */
    async send(subscription, payload) {
        const pushSubscription = {
            endpoint: subscription.endpoint,
            keys: {
                p256dh: subscription.p256dh,
                auth: subscription.auth
            }
        };

        return webPush.sendNotification(
            pushSubscription,
            JSON.stringify(payload),
            {
                TTL: 60,
                urgency: "normal"
            }
        );
    }
}

module.exports = new WebPushProvider();