function parsePositiveInt(value, fallback = 1) {
    const n = Number.parseInt(value, 10);
    return Number.isFinite(n) && n > 0 ? n : fallback;
}

function parseChildren(value) {
    if (!value) return [];
    return value
        .split(",")
        .map((v) => Number.parseInt(v, 10))
        .filter((n) => Number.isFinite(n) && n >= 0);
}

function isValidDate(value) {
    return /^\d{4}-\d{2}-\d{2}$/.test(value ?? "");
}

export const STATUS_FILTERS = [
    {
        value: "ALL",
        label: "Tous",
    },
    {
        value: "SCHEDULED",
        label: "Programmés",
    },
    {
        value: "BOARDING",
        label: "Embarquement",
    },
    {
        value: "DEPARTED",
        label: "En route",
    },
    {
        value: "ARRIVED",
        label: "Arrivés",
    },
    {
        value: "CANCELLED",
        label: "Annulés",
    },
];

export const TRIP_STATUS = {
    SCHEDULED: {
        class: "scheduled",
        label: "Programmé"
    },
    BOARDING: {
        class: "boarding",
        label: "Embarquement"
    },
    DEPARTED: {
        class: "departed",
        label: "En route"
    },
    ARRIVED: {
        class: "arrived",
        label: "Arrivé"
    },
    CANCELLED: {
        class: "cancelled",
        label: "Annulé"
    },
}

export {
    isValidDate,
    parseChildren,
    parsePositiveInt,
}