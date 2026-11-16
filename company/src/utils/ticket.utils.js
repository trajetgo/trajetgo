export const TICKET_STATUS = {
    ACTIVE: {
        class: "active",
        label: "Valide",
    },

    USED: {
        class: "used",
        label: "Utilisé",
    },

    CANCELLED: {
        class: "cancelled",
        label: "Annulé",
    },

    EXPIRED: {
        class: "expired",
        label: "Expiré",
    },
};

export const STATUS_FILTERS = [
    {
        value: "ALL",
        label: "Tous",
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