import { CalendarDays } from "lucide-react";

import "../../styles/components/trips/DateStrip.scss";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const DAY_LABELS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

function formatPrice(value) {
    if (value == null) return "—";
    return new Intl.NumberFormat("fr-FR").format(value);
}

function formatDayLabel(dateStr) {
    const date = new Date(`${dateStr}T00:00:00`);
    return DAY_LABELS[date.getDay()];
}

function formatDayNumber(dateStr) {
    const date = new Date(`${dateStr}T00:00:00`);
    return date.getDate();
}

/* ✅ Fallback 5 jours centrés sur la date sélectionnée */
function buildEmptyPrices(selectedDate, range = 2) {
    if (!selectedDate) return [];

    const center = new Date(`${selectedDate}T00:00:00`);
    const result = [];

    for (let offset = -range; offset <= range; offset++) {
        const d = new Date(center);
        d.setDate(d.getDate() + offset);

        result.push({
            date: d.toISOString().split("T")[0],
            minPrice: null,
        });
    }

    return result;
}

/* ------------------------------------------------------------------ */

export default function DateStrip({
    prices = [],
    selectedDate,
    loading = false,
    onSelectDate,
    onOpenCalendar,
}) {
    const displayPrices =
        prices.length > 0 ? prices : buildEmptyPrices(selectedDate, 2);

    return (
        <section className="date-strip" aria-label="Choisir une date">
            {/* Bouton calendrier */}
            <button
                type="button"
                className="date-strip__calendar-btn"
                onClick={onOpenCalendar}
                aria-label="Ouvrir le calendrier"
            >
                <CalendarDays size={20} />
            </button>

            {/* Liste des jours */}
            <ul
                className={`date-strip__list ${
                    loading ? "date-strip__list--loading" : ""
                }`}
                role="list"
            >
                {displayPrices.map((item) => {
                    const isSelected = item.date === selectedDate;

                    return (
                        <li key={item.date} className="date-strip__item">
                            <button
                                type="button"
                                className={`date-strip__day ${
                                    isSelected
                                        ? "date-strip__day--selected"
                                        : ""
                                }`}
                                onClick={() => onSelectDate(item.date)}
                                aria-pressed={isSelected}
                            >
                                <span className="date-strip__day-label">
                                    {formatDayLabel(item.date)}
                                </span>

                                <span className="date-strip__day-number">
                                    {formatDayNumber(item.date)}
                                </span>

                                <span
                                    className={`date-strip__day-price ${
                                        item.minPrice == null
                                            ? "date-strip__day-price--empty"
                                            : ""
                                    }`}
                                >
                                    {formatPrice(item.minPrice)}
                                </span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}