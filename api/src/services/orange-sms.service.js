const TOKEN_URL = "https://api.orange.com/oauth/v3/token";

const SMS_BASE_URL = "https://api.orange.com/smsmessaging/v1";

let cachedToken = null;
let tokenExpiresAt = 0;

class OrangeSmsService {
    /**
     * Obtient un jeton OAuth auprès d'Orange.
     * Le jeton est conservé en mémoire jusqu'à son expiration.
     */
    async getAccessToken() {
        if (
            cachedToken &&
            Date.now() < tokenExpiresAt
        ) {
            return cachedToken;
        }

        const clientId = process.env.ORANGE_SMS_CLIENT_ID;
        const clientSecret = process.env.ORANGE_SMS_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
            throw new Error(
                "Les identifiants Orange SMS ne sont pas configurés."
            );
        }

        const authorization = Buffer
            .from(`${clientId}:${clientSecret}`)
            .toString("base64");

        const response = await fetch(TOKEN_URL, {
            method: "POST",
            headers: {
                Authorization: `Basic ${authorization}`,
                "Content-Type": "application/x-www-form-urlencoded",
                Accept: "application/json",
            },
            body: new URLSearchParams({
                grant_type: "client_credentials",
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                `Échec de l'authentification Orange : HTTP ${response.status}`
            );
        }

        cachedToken = data.access_token;

        // Renouvellement anticipé du jeton.
        const expiresIn = Number(data.expires_in || 3600);

        tokenExpiresAt =
            Date.now() + Math.max(expiresIn - 60, 0) * 1000;

        return cachedToken;
    }

    /**
     * Envoie un SMS à un numéro ivoirien.
     *
     * Exemple du destinataire : +2250700000000
     */
    async sendSms(phone, message) {
        const token = await this.getAccessToken();

        const senderNumber =
            process.env.ORANGE_SMS_SENDER_NUMBER || "2250000";

        const senderAddress = `tel:+${senderNumber}`;

        const encodedSenderAddress =
            encodeURIComponent(senderAddress);

        const url =
            `${SMS_BASE_URL}/outbound/` +
            `${encodedSenderAddress}/requests`;

        const payload = {
            outboundSMSMessageRequest: {
                address: `tel:${phone}`,
                senderAddress,
                outboundSMSTextMessage: {
                    message,
                },
            },
        };

        const response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(payload),
        });

        const responseText = await response.text();

        if (!response.ok) {
            // Ne pas journaliser les identifiants ou le contenu du SMS.
            throw new Error(
                `Échec de l'envoi du SMS Orange : HTTP ${response.status}`
            );
        }

        let result = null;

        if (responseText) {
            try {
                result = JSON.parse(responseText);
            } catch {
                result = null;
            }
        }

        return {
            success: true,
            data: result,
        };
    }

    /**
     * Envoie un code OTP de vérification.
     */
    async sendVerificationCode(phone, code) {
        if (process.env.OTP_TEST_MODE === "true") {
            console.log("\n========== OTP TEST MODE ==========");
            console.log("Téléphone :", phone);
            console.log("Code OTP  :", code);
            console.log("Expiration :", `${process.env.OTP_EXPIRATION_MINUTES || 5} minutes`);
            console.log("===================================\n");

            return {
                success: true,
                testMode: true,
            };
        }

        const message =
            `TrajetGo CI : votre code de vérification est ${code}. ` +
            `Il expire dans ${process.env.OTP_EXPIRATION_MINUTES || 5} minutes. ` +
            `Ne le partagez avec personne.`;

        return this.sendSms(phone, message);
    }
}

module.exports = new OrangeSmsService();