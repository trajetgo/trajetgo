export const BOOKINGS_STATUS_FILTERS = {
    PENDING: {
        value: "PENDING",
        label: "En attente",
        class: "pending",
        description: "Réservation créée, en attente de confirmation.",
    },
    CONFIRMED: {
        value: "CONFIRMED",
        label: "Confirmée",
        class: "confirmed",
        description: "Réservation confirmée et payée.",
    },
    CANCELLED: {
        value: "CANCELLED",
        label: "Annulée",
        class: "cancelled",
        description: "Réservation annulée par le voyageur ou la compagnie.",
    },
    EXPIRED: {
        value: "EXPIRED",
        label: "Expirée",
        class: "expired",
        description: "Réservation non confirmée dans le délai imparti.",
    },
    BOARDED: {
        value: "BOARDED",
        label: "Embarqué",
        class: "boarded",
        description: "Le voyageur a embarqué dans le bus.",
    },
    COMPLETED: {
        value: "COMPLETED",
        label: "Terminée",
        class: "completed",
        description: "Voyage effectué et réservation clôturée.",
    },
    NO_SHOW: {
        value: "NO_SHOW",
        label: "Non présenté",
        class: "no-show",
        description: "Le voyageur ne s'est pas présenté à l'embarquement.",
    },
};

/**
 * Ordre d'affichage logique (cycle de vie d'une réservation).
 * Utilisez-le pour trier les filtres dans l'UI au lieu de l'ordre
 * d'itération de l'objet (qui dépend de l'ordre de déclaration).
 */
export const BOOKING_STATUS_ORDER = [
    "PENDING",
    "CONFIRMED",
    "BOARDED",
    "COMPLETED",
    "CANCELLED",
    "EXPIRED",
    "NO_SHOW",
];

/**
 * Statuts considérés comme « actifs » (réservation en cours de vie).
 * Utile pour les compteurs, les badges, ou les requêtes `_count`.
 */
export const ACTIVE_BOOKING_STATUSES = [
    "PENDING",
    "CONFIRMED",
    "BOARDED",
];

/**
 * Statuts considérés comme « terminaux » (réservation close).
 */
export const TERMINAL_BOOKING_STATUSES = [
    "COMPLETED",
    "CANCELLED",
    "EXPIRED",
    "NO_SHOW",
];

/**
 * Retourne la config d'un statut, avec fallback sur PENDING
 * si le statut est inconnu (ex. donnée legacy).
 */
export function getBookingStatusConfig(status) {
    return BOOKINGS_STATUS_FILTERS[status] ?? BOOKINGS_STATUS_FILTERS.PENDING;
}

/**
 * Retourne la liste des filtres dans l'ordre logique,
 * prête à être rendue dans un `<select>` ou une barre d'onglets.
 */
export function getBookingStatusFilters() {
    return BOOKING_STATUS_ORDER.map((status) => BOOKINGS_STATUS_FILTERS[status]);
}