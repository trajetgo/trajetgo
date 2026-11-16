export const CREATE_TICKET_STEPS = [
   { key: "trip", title: "Voyage", description: "Sélectionnez un départ disponible" },
   { key: "seat", title: "Siège", description: "Choisissez un siège libre" },
   { key: "passenger", title: "Passager", description: "Identité du passager" },
   { key: "payment", title: "Paiement", description: "Encaisser et confirmer" },
];

export const CREATE_TICKET_STEP_FIELDS = {
   trip: ["tripId"],
   seat: ["seatId"],
   passenger: ["firstName", "lastName", "phone", "email"],
   payment: ["paymentMethod"],
};

export const TICKET_INITAL_FORM = {
    tripId: "",
    seatId: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    paymentMethod: "CASH",
};

export const TICKET_STATUS = {
    ACTIVE: {
        value: "ACTIVE",
        label: "Actif",
        shortLabel: "Actif",
        className: "active",
    },

    USED: {
        value: "USED",
        label: "Utilisé",
        shortLabel: "Utilisé",
        className: "used"
    },

    CANCELLED: {
        value: "CANCELLED",
        label: "Annulé",
        shortLabel: "Annulé",
        className: "cancelled"
    },

    EXPIRED: {
        value: "EXPIRED",
        label: "Expiré",
        shortLabel: "Expiré",
        className: "expired"
    },
};

/* Tableau dérivé — utile pour valider côté front */
export const TICKET_STATUS_VALUES = Object.values(TICKET_STATUS).map(
    (s) => s.value
);

export const TICKET_STATUS_FILTERS = [
    {
        value: "ALL",
        label: "Tous les statuts",
    },
    {
        value: "ACTIVE",
        label: "Valides",
    },
    {
        value: "USED",
        label: "Utilisés",
    },
    {
        value: "CANCELLED",
        label: "Annulés",
    },
    {
        value: "EXPIRED",
        label: "Expirés",
    },
];

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
        TICKET_STATUS[status] ?? {
            value: status,
            label: status,
            shortLabel: status,
            className: "unknown",
        }
    );
}