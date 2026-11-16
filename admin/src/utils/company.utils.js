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
        value: "SUSPENDED",
        label: "Suspendues",
    },
];

export const COMPANY_STATUS = {
    ACTIVE: {
        class: "active",
        label: "Actif",
    },
    INACTIVE: {
        class: "inactive",
        label: "Inactif",
    },
    SUSPENDED: {
        class: "suspended",
        label: "Suspendu",
    },
};

/* Définition des étapes */
export const STEPS = [
    {
        key: "identity",
        title: "Identité",
        description: "Le nom de votre compagnie",
        fields: ["name", "legalName"],
    },
    {
        key: "legal",
        title: "Informations légales",
        description: "RCCM et identifiant unique",
        fields: ["rccm", "idu"],
    },
    {
        key: "contact",
        title: "Contact",
        description: "Coordonnées de la compagnie",
        fields: ["email", "phone", "website"],
    },
    {
        key: "location",
        title: "Localisation",
        description: "Siège et logo",
        fields: ["address", "cityId", "logo"],
    },
];

export const ALLOWED_STATUSES = ["ACTIVE", "INACTIVE", "SUSPENDED"];
export const URL_REGEX = /^https?:\/\/[^\s]+$/i;