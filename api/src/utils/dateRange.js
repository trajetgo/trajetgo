/**
 * Normalise une date (string "YYYY-MM-DD" ou Date) en composants locaux.
 */
function toLocalParts(input) {
    if (input instanceof Date) {
        return {
            y: input.getFullYear(),
            m: input.getMonth(),
            d: input.getDate(),
        };
    }

    if (typeof input === "string") {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(input)) {
            throw new Error(`Date invalide : ${input}`);
        }

        const [y, m, d] = input.split("-").map(Number);

        return { y, m: m - 1, d };
    }

    throw new Error("Date invalide : attendu Date ou 'YYYY-MM-DD'");
}

/**
 * Intervalle [start, end] d'une journée.
 *
 * options.excludePast (défaut true) :
 *   - true  : si la date est aujourd'hui, start = max(minuit, now)
 *             → pour searchTrips (on ne veut pas les départs passés)
 *   - false : start = minuit, quelle que soit la date
 *             → pour getTodayDepartures (on veut tous les départs du jour)
 */
function getDayRange(input, options = {}) {
    const { excludePast = true, now = new Date() } = options;

    const { y, m, d } = toLocalParts(input);

    const start = new Date(y, m, d, 0, 0, 0, 0);
    const end = new Date(y, m, d, 23, 59, 59, 999);

    const isToday =
        now.getFullYear() === y &&
        now.getMonth() === m &&
        now.getDate() === d;

    if (excludePast && isToday && now > start) {
        return { start: now, end, isToday };
    }

    return { start, end, isToday };
}

module.exports = { getDayRange };