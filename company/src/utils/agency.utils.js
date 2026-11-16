export const STATUS_FILTERS = [
    {
        value: "ALL",
        label: "Toutes",
    },
    {
        value: "ACTIVE",
        label: "Actives",
    },
    {
        value: "INACTIVE",
        label: "Inactives",
    },
    {
        value: "CLOSED",
        label: "Fermées",
    },
];

export const AGENCY_STATUS = {
    ACTIVE: {
        class: "active",
        label: "Actif",
    },
    INACTIVE: {
        class: "inactive",
        label: "Inactif",
    },
    CLOSED: {
        class: "closed",
        label: "Fermé",
    },
};

export const STEPS = [
    {
        key: "identity",
        title: "Identité",
        description: "Le nom de l'agence",
        fields: ["name", "companyId"],
    },
    {
        key: "contact",
        title: "Contact",
        description: "Coordonnées de l'agence",
        fields: ["email", "phone"],
    },
    {
        key: "location",
        title: "Localisation",
        description: "Adresse de l'agence",
        fields: ["address", "cityId"],
    },
];

export const ALLOWED_STATUSES = ["ACTIVE", "INACTIVE", "CLOSED"];