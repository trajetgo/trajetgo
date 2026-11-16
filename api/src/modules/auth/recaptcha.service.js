
const VERIFY_URL = process.env.RECAPTCHA_VERIFY_URL;
const SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
const MIN_SCORE = Number(process.env.RECAPTCHA_MIN_SCORE ?? 0.5);

class RecaptchaService {
    verify = async (token, expectedAction) => {
        if (!SECRET_KEY || !VERIFY_URL) {
            throw new Error(
                "Configuration reCAPTCHA manquante."
            );
        }

        if (typeof token !== "string" || !token.trim()) {
            return false;
        }

        const body = new URLSearchParams({
            secret: SECRET_KEY,
            response: token,
        });

        let response;

        try {
            response = await fetch(VERIFY_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body,
                signal: AbortSignal.timeout(5000),
            });
        } catch (error) {
            // Erreur réseau ou timeout : ne pas autoriser la requête.
            throw new Error("Service reCAPTCHA indisponible.");
        }

        if (!response.ok) {
            throw new Error("Échec de la vérification reCAPTCHA.");
        }

        const result = await response.json();

        if (!result.success) {
            return false;
        }

        // reCAPTCHA v3 : vérifier l'action et le score.
        if (result.action !== expectedAction) {
            return false;
        }

        if (
            typeof result.score !== "number" ||
            result.score < MIN_SCORE
        ) {
            return false;
        }

        return true;
    }
};

module.exports = new RecaptchaService();