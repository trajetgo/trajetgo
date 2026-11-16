import { 
    format, 
    formatDistanceToNowStrict, 
    parseISO, 
    isValid 
} from "date-fns";
import { fr } from "date-fns/locale";

/* ------------------------------------------------------------------ */
/* Patterns autorisés                                                  */
/* ------------------------------------------------------------------ */

const FORMAT_PATTERNS = {
    /* ---- Date seule ---- */
    "dd/MM/yyyy": "dd/MM/yyyy",             // 31/08/2026
    "dd-MM-yyyy": "dd-MM-yyyy",             // 31-08-2026
    "dd MMMM yyyy": "dd MMMM yyyy",         // 31 août 2026
    "dd MMM yyyy": "dd MMM yyyy",           // 31 août 2026
    "dd/MMMM/yyyy": "dd/MMMM/yyyy",         // 31/août/2026
    "EEEE dd MMMM yyyy": "EEEE dd MMMM yyyy", // lundi 31 août 2026
    "yyyy-MM-dd": "yyyy-MM-dd",             // 2026-08-31 (ISO)

    /* ---- Heure seule ---- */
    "HH:mm": "HH:mm",                       // 14:30
    "HH:mm:ss": "HH:mm:ss",                 // 14:30:00
    "HH'h'mm": "HH'h'mm",                   // 14h30

    /* ---- Date + heure ---- */
    "dd/MM/yyyy HH:mm": "dd/MM/yyyy HH:mm",         // 31/08/2026 14:30
    "dd/MM/yyyy HH:mm:ss": "dd/MM/yyyy HH:mm:ss",   // 31/08/2026 14:30:00
    "dd/MM/yyyy à HH:mm": "dd/MM/yyyy 'à' HH:mm",   // 31/08/2026 à 14:30
    "dd MMMM yyyy à HH:mm": "dd MMMM yyyy 'à' HH:mm", // 31 août 2026 à 14:30
    "dd MMM yyyy · HH:mm": "dd MMM yyyy '·' HH:mm",   // 31 août 2026 · 14:30
    "EEEE dd MMMM yyyy à HH:mm": "EEEE dd MMMM yyyy 'à' HH:mm",
    "dd/MM/yyyy HH:mm:ss.SSS": "dd/MM/yyyy HH:mm:ss.SSS",
    "yyyy-MM-dd HH:mm": "yyyy-MM-dd HH:mm",         // 2026-08-31 14:30
    "yyyy-MM-dd'T'HH:mm": "yyyy-MM-dd'T'HH:mm",
};

const DEFAULT_PATTERN = "dd/MM/yyyy HH:mm";

/* ------------------------------------------------------------------ */
/* Helper principal                                                    */
/* ------------------------------------------------------------------ */

/**
 * Formate une date (string ISO ou Date) avec un pattern autorisé.
 *
 * @param {string | Date | null | undefined} dateStr
 * @param {string} [displays]   Clé de FORMAT_PATTERNS (ex: "dd/MM/yyyy HH:mm")
 * @returns {string}            Chaîne formatée, ou "" si invalide
 */
function formatDate(dateStr, displays) {
    if (!dateStr) return "";

    // 1. Parse robuste
    let date;
    if (dateStr instanceof Date) {
        date = dateStr;
    } else if (typeof dateStr === "string") {
        // ISO : "2026-08-31T14:30:00.000Z"
        date = parseISO(dateStr);
    } else if (typeof dateStr === "number") {
        // timestamp
        date = new Date(dateStr);
    } else {
        return "";
    }

    // 2. Validation
    if (!isValid(date)) return "";

    // 3. Pattern (allowlist)
    const pattern = FORMAT_PATTERNS[displays] ?? DEFAULT_PATTERN;

    // 4. Format avec locale FR
    try {
        return format(date, pattern, { locale: fr });
    } catch {
        return "";
    }
}

/**
 * Formate une date au format relatif court (ex: "À l'instant", "15 min", "2 h", "3 j", "1 sem", "2 mois", "1 an")
 */
function formatTimeAgo(dateStr) {
    if (!dateStr) return '';
    const date = typeof dateStr === 'string' ? parseISO(dateStr) : new Date(dateStr);
    if (!isValid(date)) return '';

    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    // Moins de 60 secondes : À l'instant
    if (diffInSeconds < 60) {
        return "À l'instant";
    }

    // Utilisation du format strict de date-fns
    const distance = formatDistanceToNowStrict(date, { locale: fr, addSuffix: false });
    const [value, unit] = distance.split(' ');

    // Abréviations personnalisées
    const shortUnits = {
        second: 's',
        seconds: 's',
        minute: 'min',
        minutes: 'min',
        hour: 'h',
        hours: 'h',
        day: 'j.',
        days: 'j.',
        month: 'mois',
        months: 'mois',
        year: 'an',
        years: 'ans'
    };

    // Gestion spécifique des semaines
    if (unit.startsWith('day') && parseInt(value, 10) >= 7) {
        const weeks = Math.floor(parseInt(value, 10) / 7);
        return `${weeks} sem.`;
    }

    return `${value} ${shortUnits[unit] || unit}`;
}

export { formatDate, formatTimeAgo };