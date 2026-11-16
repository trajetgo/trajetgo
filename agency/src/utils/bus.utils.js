import { Armchair, Lightbulb, Luggage, Plug, Snowflake, Toilet, Tv, Usb, Wifi } from "lucide-react";

/* =========================================================
   STATUTS BUS — source de vérité
   ========================================================= */

export const BUS_STATUS = {
    ACTIVE: {
        value: "ACTIVE",
        label: "Actif",
        shortLabel: "Actif",
        className: "active",
    },
    INACTIVE: {
        value: "INACTIVE",
        label: "Désactivé",
        shortLabel: "Désactivé",
        className: "inactive",
    },
    MAINTENANCE: {
        value: "MAINTENANCE",
        label: "En maintenance",
        shortLabel: "Maintenance",
        className: "maintenance",
    },
    RETIRED: {
        value: "RETIRED",
        label: "Réformé",
        shortLabel: "Réformé",
        className: "retired",
    },
};

/* Tableau dérivé — utile pour valider côté front */
export const BUS_STATUS_VALUES = Object.values(BUS_STATUS).map(
    (s) => s.value
);

/* =========================================================
   FILTRES UI (selects)
   ========================================================= */

export const BUS_STATUS_FILTERS = [
    { value: "ALL", label: "Tous les statuts" },
    { value: "ACTIVE", label: "Actifs" },
    { value: "INACTIVE", label: "Désactivés" },
    { value: "MAINTENANCE", label: "En maintenance" },
    { value: "RETIRED", label: "Réformés" },
];

/* =========================================================
   HELPERS
   ========================================================= */

/**
 * Retourne les infos d'un statut avec fallback sûr.
 * @param {string | null | undefined} status
 */
export function getBusStatus(status) {
    if (!status) {
        return {
            value: "UNKNOWN",
            label: "Inconnu",
            shortLabel: "—",
            className: "unknown",
        };
    }

    return (
        BUS_STATUS[status] ?? {
            value: status,
            label: status,
            shortLabel: status,
            className: "unknown",
        }
    );
}

/**
 * Vérifie qu'un statut est valide.
 * @param {string} status
 */
export function isValidBusStatus(status) {
    return BUS_STATUS_VALUES.includes(status);
}

/**
 * Retourne les transitions de statut autorisées.
 * @param {string} currentStatus
 * @returns {string[]}
 */
export function getAllowedTransitions(currentStatus) {
    switch (currentStatus) {
        case "ACTIVE":
            return ["INACTIVE", "MAINTENANCE", "RETIRED"];
        case "INACTIVE":
            return ["ACTIVE", "RETIRED"];
        case "MAINTENANCE":
            return ["ACTIVE"];
        case "RETIRED":
            return []; // terminal
        default:
            return [];
    }
}

/* ------------------------------------------------------------------ */
/* Config                                                              */
/* ------------------------------------------------------------------ */

export const INITIAL_FORM_DATA = {
    registrationNumber: "",
    fleetNumber: "",
    name: "",

    brand: "",
    model: "",
    year: "",

    busType: "COACH",
    capacity: "",

    status: "ACTIVE",

    amenities: [],
};

export const ALLOWED_STATUSES = [
    "ACTIVE",
    "INACTIVE",
    "MAINTENANCE",
];

export const ALLOWED_BUS_TYPES = [
    "COACH",
    "MINIBUS",
    "BUS",
    "VAN",
    "OTHER",
];

export const REGISTRATION_REGEX = /^[A-Z0-9\- ]{3,20}$/i;

export const FLEET_NUMBER_REGEX = /^[A-Z0-9\- ]{1,30}$/i;

export const MIN_CAPACITY = 1;
export const MAX_CAPACITY = 100;

export const MIN_YEAR = 1950;
export const MAX_YEAR = new Date().getFullYear() + 1;

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

export const normalizeRegistration = (value) =>
    String(value ?? "")
        .trim()
        .toUpperCase();

export const normalizeFleetNumber = (value) =>
    String(value ?? "")
        .trim()
        .toUpperCase();

export const BUS_TYPE_OPTIONS = [
    {
        value: "COACH",
        label: "Autocar",
    },
    {
        value: "MINIBUS",
        label: "Minibus",
    },
    {
        value: "BUS",
        label: "Bus",
    },
    {
        value: "VAN",
        label: "Van",
    },
    {
        value: "OTHER",
        label: "Autre",
    },
];

export const STATUS_OPTIONS = [
    {
        value: "ACTIVE",
        label: "Actif",
    },
    {
        value: "INACTIVE",
        label: "Inactif",
    },
    {
        value: "MAINTENANCE",
        label: "En maintenance",
    },
];

// ============================================================
// AMENITIES
// ============================================================

export const ALLOWED_AMENITIES = [
    "AIR_CONDITIONING",
    "WIFI",
    "USB_CHARGING",
    "POWER_OUTLET",
    "TOILET",
    "TV",
    "RECLINING_SEATS",
    "READING_LIGHT",
    "LUGGAGE_SPACE",
];

export const AMENITY_OPTIONS = {
    AIR_CONDITIONING: { label: "Climatisation", icon: Snowflake },
    WIFI:             { label: "Wi-Fi",         icon: Wifi },
    USB_CHARGING:     { label: "Prises USB",    icon: Usb },
    POWER_OUTLET:     { label: "Prises élec.",  icon: Plug },
    TOILET:           { label: "Toilettes",     icon: Toilet },
    TV:               { label: "TV",            icon: Tv },
    RECLINING_SEATS:  { label: "Sièges inclin.", icon: Armchair },
    READING_LIGHT:    { label: "Lampe lecture", icon: Lightbulb },
    LUGGAGE_SPACE:    { label: "Bagages",       icon: Luggage },
};

/* Tableau dérivé — utile pour les checkboxes du formulaire */
export const AMENITY_LIST = Object.entries(AMENITY_OPTIONS).map(
    ([value, config]) => ({
        value,
        label: config.label,
        icon: config.icon,
    })
);

/* Helper optionnel pour les composants qui préfèrent une fonction */
export function getAmenity(value) {
    return AMENITY_OPTIONS[value] ?? null;
}

export const STEPS = [
    {
        key: "identity",
        title: "Identification",
        description: "Identification du bus",
    },
    {
        key: "vehicle",
        title: "Véhicule",
        description: "Informations techniques du véhicule",
    },
    {
        key: "operation",
        title: "Exploitation",
        description: "Capacité et statut",
    },
    {
        key: "amenities",
        title: "Équipements",
        description: "Services disponibles à bord",
    },
];