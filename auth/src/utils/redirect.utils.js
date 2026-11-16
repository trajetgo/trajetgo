import {
    PASSENGER_URL,
    COMPANY_URL,
    AGENCY_URL,
    CONTROLLER_URL,
    ADMIN_URL
} from "@shared/services/api";


const ALLOWED_REDIRECT_ORIGINS = [
    new URL(PASSENGER_URL).origin,
    new URL(COMPANY_URL).origin,
    new URL(AGENCY_URL).origin,
    new URL(CONTROLLER_URL).origin,
    new URL(ADMIN_URL).origin,
];


export function getSafeContinueUrl(url) {
    if (!url) {
        return null;
    }

    try {
        const parsedUrl = new URL(url);

        if (
            ALLOWED_REDIRECT_ORIGINS.includes(
                parsedUrl.origin
            )
        ) {
            return parsedUrl.href;
        }

        return null;

    } catch {
        return null;
    }
}


const ALLOWED_REDIRECT_URLS = [
    PASSENGER_URL,
    COMPANY_URL,
    AGENCY_URL,
    CONTROLLER_URL,
    ADMIN_URL,
].filter(Boolean);

function isAllowedRedirect(url) {
    if (!url) return false;

    try {
        const parsed = new URL(url);
        const origin = parsed.origin;   // "http://localhost:3002"

        return ALLOWED_REDIRECT_URLS.some((allowed) => {
            try {
                return new URL(allowed).origin === origin;
            } catch {
                return false;
            }
        });
    } catch {
        return false;
    }
}

/**
 * Résout la redirection post-login.
 * @param {string | null} continueUrl
 * @returns {string}  URL absolue sûre
 */
export function resolveRedirect(continueUrl) {
    if (continueUrl && isAllowedRedirect(continueUrl)) {
        return continueUrl;
    }

    return PASSENGER_URL ?? "/";
}

/**
 * Renvoie l'URL par défaut selon le rôle.
 * @param {{ role?: string } | null} user
 */
export function getDefaultRedirect(user) {
    switch (user?.role) {
        case "SUPER_ADMIN":
            return ADMIN_URL ?? PASSENGER_URL;
        case "COMPANY_ADMIN":
            return COMPANY_URL ?? PASSENGER_URL;
        case "AGENCY_AGENT":
            return AGENCY_URL ?? PASSENGER_URL;
        case "CONTROLLER":
            return CONTROLLER_URL ?? PASSENGER_URL;
        default:
            return PASSENGER_URL ?? "/";
    }
}
