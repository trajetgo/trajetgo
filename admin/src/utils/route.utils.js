
/* =========================================================
   CONFIG LIGNES
   ========================================================= */

export const INITIAL_ROUTE_FORM = {
    companyId: "",
    originCityId: "",
    destinationCityId: "",
    distanceKm: "",
    durationMin: "",
    basePrice: "",         
    active: true,
};

/* ------------------------------------------------------------------ */
/* Bornes                                                             */
/* ------------------------------------------------------------------ */

/* ✅ Prix : 100 FCFA à 1 000 000 FCFA */
export const MIN_BASE_PRICE = 100;
export const MAX_BASE_PRICE = 1_000_000;

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

/**
 * Formate un prix en FCFA avec séparateur de milliers.
 * Ex : 7500 → "7 500 FCFA"
 */
export function formatPrice(value) {
    const num = Number(value);

    if (!Number.isFinite(num)) return "—";

    return `${new Intl.NumberFormat("fr-FR").format(num)} FCFA`;
}

/* computeDistanceKm, formatDuration, etc. inchangés */


/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

export const MIN_DISTANCE = 1;
export const MAX_DISTANCE = 3000;

export const MIN_DURATION = 5;      // minutes
export const MAX_DURATION = 48 * 60; // 48 heures

/**
 * Calcule la distance approximative entre 2 points (Haversine).
 * @returns {number|null} Distance en km arrondie, ou null si invalide.
 */
export function computeDistanceKm(lat1, lon1, lat2, lon2) {
    if (
        lat1 == null ||
        lon1 == null ||
        lat2 == null ||
        lon2 == null
    ) {
        return null;
    }

    const R = 6371; // Rayon terrestre en km
    const toRad = (deg) => (deg * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) *
            Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.asin(Math.sqrt(a));

    return Math.round(R * c);
}

/**
 * Formate une durée en minutes → "4h30"
 */
export function formatDuration(minutes) {
    if (!minutes || minutes <= 0) return "—";

    const h = Math.floor(minutes / 60);
    const m = minutes % 60;

    if (h === 0) return `${m} min`;
    if (m === 0) return `${h}h`;
    return `${h}h${String(m).padStart(2, "0")}`;
}

/* ------------------------------------------------------------------ */
/* Statuts                                                            */
/* ------------------------------------------------------------------ */

export const ROUTE_STATUS_FILTERS = [
    { value: "ALL", label: "Toutes les lignes" },
    { value: "ACTIVE", label: "Actives" },
    { value: "INACTIVE", label: "Inactives" },
];

export const ROUTE_STATUS = {
    ACTIVE: {
        value: "ACTIVE",
        label: "Active",
        className: "active",
    },
    INACTIVE: {
        value: "INACTIVE",
        label: "Inactive",
        className: "inactive",
    },
};

export function getRouteStatus(active) {
    return active ? ROUTE_STATUS.ACTIVE : ROUTE_STATUS.INACTIVE;
}
