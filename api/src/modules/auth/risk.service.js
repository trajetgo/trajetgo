const loginAttemptRepository = require("./loginAttempt.repository");

const FAILURE_WINDOW_MS = 15 * 60 * 1000;
const FAILURE_THRESHOLD = 5;

class RiskService {

    /**
 * Évalue le risque d'une tentative de connexion.
 *
 * @returns {{
 *   level: "low" | "medium" | "high",
 *   reasons: string[],
 *   knownDevice: boolean,
 *   recentFailures: number,
 * }}
 */
    accessLoginRisk = async ({ userId, identifier, userAgent, ip }) => {
        const reasons = [];

        /* ---------- Échecs récents ---------- */

        const recentFailures = await loginAttemptRepository.countRecentFailures(
            identifier,
            FAILURE_WINDOW_MS
        );

        if (recentFailures >= FAILURE_THRESHOLD) {
            reasons.push("too_many_failures");
        }

        /* ---------- Nouvel appareil ---------- */

        const knownUserAgents = await loginAttemptRepository.findKnownUserAgents(userId);
        const knownDevice = userAgent ? knownUserAgents.has(userAgent) : true;

        if (!knownDevice) {
            reasons.push("new_device");
        }

        /* ---------- Nouvelle IP (comparaison à la dernière réussie) ---------- */

        const lastSuccess = await loginAttemptRepository.findLastSuccess(userId);

        if (lastSuccess?.ip && ip && lastSuccess.ip !== ip) {
            reasons.push("new_ip");
        }


        /* ---------- Niveau ---------- */

        let level = "low";

        if (reasons.includes("too_many_failures")) {
            level = "high";
        } else if (!knownDevice || reasons.includes("new_ip")) {
            level = "medium";
        }
        return { 
            level, 
            reasons, 
            knownDevice, 
            recentFailures 
        };
    }

};

module.exports = new RiskService();