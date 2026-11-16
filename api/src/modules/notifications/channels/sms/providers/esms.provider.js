const ApiError = require("../../../../../utils/ApiError");


const API_URL = process.env.ESMS_API_URL;
const API_KEY = process.env.ESMS_API_KEY;

class EsmsProvider {
    send = async ({ to, text, senderId, idempotencyKey }) => {
        if (!API_KEY) {
            throw new ApiError(
                "La clé API eSMS n'est pas configurée.",
                500
            );
        }

        if (!to || !text) {
            throw new ApiError(
                "Le numéro et le contenu du SMS sont obligatoires.",
                400
            );
        }

        const response = await fetch(`${API_URL}/messages/send`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
                ...(idempotencyKey && {
                    "Idempotency-Key": idempotencyKey
                })
            },
            body: JSON.stringify({
                to,
                text,
                ...(senderId && { sender_id: senderId })
            })
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new ApiError(
                result.message || result.error ||
                "Échec de l'envoi du SMS.",
                response.status
            );
        }

        return {
            provider: "ESMS",
            messageId: result.id,
            status: result.status,
            environment: result.environment,
            livemode: result.livemode,
            segments: result.segments,
            raw: result
        };
    };
}

module.exports = new EsmsProvider();
