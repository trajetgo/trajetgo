import { APP_CONFIG } from "../config/app.config";

/**
 * Retourne la plage de copyright.
 * - Si année actuelle = année de création → "2026"
 * - Sinon → "2026 - 2027"
 */
export function getCopyrightYears() {
    const currentYear = new Date().getFullYear();
    const { foundedYear } = APP_CONFIG;

    if (currentYear <= foundedYear) {
        return `${foundedYear}`;
    }

    return `${foundedYear} - ${currentYear}`;
}

/**
 * Retourne la ligne de copyright complète.
 */
export function getCopyrightLine() {
    return `© ${getCopyrightYears()} ${APP_CONFIG.name}. Tous droits réservés.`;
}