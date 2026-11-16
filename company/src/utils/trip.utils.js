export const parsePositiveInt = (value, fallback = 1) => {
    const n = Number.parseInt(value, 10);
    return Number.isFinite(n) && n > 0 ? n : fallback;
}

export const parseChildren = (value) => {
    if (!value) return [];
    return value
        .split(",")
        .map((v) => Number.parseInt(v, 10))
        .filter((n) => Number.isFinite(n) && n >= 0);
}

export const isValidDate = (value) => {
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

/* =========================================================
   CONFIG TRIP
   ========================================================= */

export const INITIAL_TRIP_FORM = {
    routeId: "",
    busId: "",
    departureAgencyId: "",
    arrivaAgencyId: "",
    departureDate: "",
    departureTime: "",
    arrivalDate: "",
    arrivalTime: "",
    price: "",
};

/* ------------------------------------------------------------------ */
/* Étapes                                                              */
/* ------------------------------------------------------------------ */

export const TRIP_STEPS = [
    {
        key: "route",
        title: "Ligne",
        description: "Choisissez la ligne et le bus",
        fields: ["routeId", "busId"],
    },
    {
        key: "agencies",
        title: "Agences",
        description: "Départ et arrivée",
        fields: ["departureLocationId", "arrivalLocationId"],
    },
    {
        key: "schedule",
        title: "Horaires",
        description: "Date et heure du voyage",
        fields: [
            "departureDate",
            "departureTime",
            "arrivalDate",
            "arrivalTime",
        ],
    },
    {
        key: "price",
        title: "Tarif",
        description: "Prix du billet",
        fields: ["price"],
    },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

export const MIN_PRICE = 100;
export const MAX_PRICE = 1_000_000;

/**
 * Fusionne date + heure en ISO string.
 * @returns {string|null}
 */
export function toISOString(date, time) {
    if (!date || !time) return null;

    const dt = new Date(`${date}T${time}:00`);

    if (isNaN(dt.getTime())) return null;

    return dt.toISOString();
}

/**
 * Ajoute `durationMin` minutes à une date.
 * @returns {{ date: string, time: string } | null}
 */
export function addMinutes(date, time, durationMin) {
    if (!date || !time || !durationMin) return null;

    const departure = new Date(`${date}T${time}`);

    if (isNaN(departure.getTime())) return null;

    const arrival = new Date(
        departure.getTime() + durationMin * 60 * 1000
    );

    return {
        date: arrival.toISOString().split("T")[0],
        time: arrival.toTimeString().slice(0, 5),
    };
}

/**
 * Formate un prix en FCFA.
 */
export function formatPrice(value) {
    const num = Number(value);
    if (!Number.isFinite(num)) return "—";
    return `${new Intl.NumberFormat("fr-FR").format(num)} FCFA`;
}

/**
 * Formate une durée en minutes → "4h30".
 */
export function formatDuration(minutes) {
    if (!minutes || minutes <= 0) return "—";

    const h = Math.floor(minutes / 60);
    const m = minutes % 60;

    if (h === 0) return `${m} min`;
    if (m === 0) return `${h}h`;
    return `${h}h${String(m).padStart(2, "0")}`;
}

/**
 * Retourne la liste des champs par étape (index).
 */
export function getStepFields(stepIndex) {
    return TRIP_STEPS[stepIndex]?.fields ?? [];
}


/**
 * Calcule la date et l'heure d'arrivée à partir du départ + durée.
 *
 * @param {string} departureDate  "YYYY-MM-DD"
 * @param {string} departureTime  "HH:mm"
 * @param {number} durationMin    Durée en minutes
 * @returns {{ date: string, time: string, crossesDay: boolean } | null}
 */
export function computeArrival(
    departureDate,
    departureTime,
    durationMin
) {
    if (
        !departureDate ||
        !departureTime ||
        !Number.isFinite(Number(durationMin)) ||
        Number(durationMin) <= 0
    ) {
        return null;
    }

    const departure = new Date(
        `${departureDate}T${departureTime}:00`
    );

    if (Number.isNaN(departure.getTime())) {
        return null;
    }

    const arrival = new Date(
        departure.getTime() +
        Number(durationMin) * 60 * 1000
    );

    const pad = (value) =>
        String(value).padStart(2, "0");

    const date = [
        arrival.getFullYear(),
        pad(arrival.getMonth() + 1),
        pad(arrival.getDate()),
    ].join("-");

    const time = [
        pad(arrival.getHours()),
        pad(arrival.getMinutes()),
    ].join(":");

    return {
        date,
        time,
        crossesDay: date !== departureDate,
    };
}

/**
 * Calcule la durée entre deux dates (ISO).
 * @returns {string} "4h30", "45 min", "2h", ou "—"
 */
export function computeDuration(departureAt, arrivalAt) {
    if (!departureAt || !arrivalAt) return "—";

    const dep = new Date(departureAt);
    const arr = new Date(arrivalAt);

    if (isNaN(dep.getTime()) || isNaN(arr.getTime())) return "—";

    const min = Math.round((arr - dep) / 60000);

    if (min < 0) return "—";

    const h = Math.floor(min / 60);
    const m = min % 60;

    if (h === 0) return `${m} min`;
    if (m === 0) return `${h}h`;
    return `${h}h${String(m).padStart(2, "0")}`;
}