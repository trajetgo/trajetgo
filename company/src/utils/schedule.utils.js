export const INITIAL_SCHEDULE_FORM = {
    routeId: "",
    departureAgencyId: "",
    arrivalAgencyId: "",
    departures: [
        {
            id: "dep-1",
            busId: "",
            departureTime: "",
        },
    ],
    daysOfWeek: [],
    startDate: "",
    endDate: "",
    autoGenerate: true,
};

export const SCHEDULE_STEPS = [
    {
        key: "route",
        title: "Ligne",
        description: "Choisissez la ligne",
        fields: ["routeId"],       // ✅ plus de busId
    },
    {
        key: "agencies",
        title: "Agences",
        description: "Départ et arrivée",
        fields: ["departureAgencyId", "arrivalAgencyId"],
    },
    {
        key: "departures",
        title: "Départs",
        description: "Bus et heures de départs",
        fields: ["departures"],
    },
    {
        key: "period",
        title: "Période",
        description: "Jours et période de circulation",
        fields: ["daysOfWeek", "startDate", "endDate"],
    },
    {
        key: "summary",
        title: "Récapitulatif",
        description: "Vérifiez avant de créer",
        fields: ["autoGenerate"],
    },
];

/* ------------------------------------------------------------------ */
/* Jours de la semaine                                                 */
/* ------------------------------------------------------------------ */

export const DAYS = [
    { value: "MONDAY", label: "L" },
    { value: "TUESDAY", label: "M" },
    { value: "WEDNESDAY", label: "M" },
    { value: "THURSDAY", label: "J" },
    { value: "FRIDAY", label: "V" },
    { value: "SATURDAY", label: "S" },
    { value: "SUNDAY", label: "D" },
];

export const DAYS_FULL = {
    MONDAY: "Lundi",
    TUESDAY: "Mardi",
    WEDNESDAY: "Mercredi",
    THURSDAY: "Jeudi",
    FRIDAY: "Vendredi",
    SATURDAY: "Samedi",
    SUNDAY: "Dimanche",
};

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