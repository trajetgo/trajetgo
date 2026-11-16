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

/**
 * Formate un prix en FCFA avec séparateur de milliers.
 * Ex : 7500 → "7 500 FCFA"
 */
export function formatPrice(value) {
    const num = Number(value);

    if (!Number.isFinite(num)) return "—";

    return `${new Intl.NumberFormat("fr-FR").format(num)} FCFA`;
}