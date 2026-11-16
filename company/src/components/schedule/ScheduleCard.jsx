import {
    Clock,
    Calendar,
    MapPin,
    Bus,
    Wallet,
    MoreHorizontal,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const DAYS_LABELS = {
    MONDAY: "Lun",
    TUESDAY: "Mar",
    WEDNESDAY: "Mer",
    THURSDAY: "Jeu",
    FRIDAY: "Ven",
    SATURDAY: "Sam",
    SUNDAY: "Dim",
};

const DAYS_ORDER = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
];

const STATUS_CONFIG = {
    ACTIVE: { label: "Active", className: "active" },
    PAUSED: { label: "En pause", className: "paused" },
    EXPIRED: { label: "Expirée", className: "expired" },
};

/* ------------------------------------------------------------------ */

export default function ScheduleCard({ schedule, onView }) {
    if (!schedule) return null;

    const {
        id,
        route,
        departureAgency,
        arrivalAgency,
        bus,
        departureTime,
        durationMinutes,
        price,
        daysOfWeek = [],
        startDate,
        endDate,
        status,
    } = schedule;

    const statusConfig = STATUS_CONFIG[status] ?? STATUS_CONFIG.ACTIVE;

    /* ---------- Formatage ---------- */

    const sortedDays = [...daysOfWeek].sort(
        (a, b) => DAYS_ORDER.indexOf(a) - DAYS_ORDER.indexOf(b)
    );

    const durationLabel = (() => {
        if (!durationMinutes) return "—";
        const hours = Math.floor(durationMinutes / 60);
        const minutes = durationMinutes % 60;
        return minutes > 0 ? `${hours}h${String(minutes).padStart(2, "0")}` : `${hours}h`;
    })();

    const priceLabel = new Intl.NumberFormat("fr-FR").format(price ?? 0);

    const dateRange = (() => {
        if (!startDate) return "—";
        const start = new Date(startDate).toLocaleDateString("fr-FR");
        if (!endDate) return `À partir du ${start}`;
        const end = new Date(endDate).toLocaleDateString("fr-FR");
        return `Du ${start} au ${end}`;
    })();

    /* ---------- Rendu ---------- */

    return (
        <article className="schedule-card">
            {/* ---------- En-tête ---------- */}

            <header className="schedule-card__header">
                <div className="schedule-card__route">
                    <MapPin size={16} aria-hidden="true" />
                    <strong>{route?.originCity?.name ?? "—"}</strong>
                    <span aria-hidden="true">→</span>
                    <strong>{route?.destinationCity?.name ?? "—"}</strong>
                </div>

                <span
                    className={`schedule-card__status schedule-card__status--${statusConfig.className}`}
                >
                    {statusConfig.label}
                </span>
            </header>

            {/* ---------- Horaires ---------- */}

            <div className="schedule-card__time">
                <Clock size={16} aria-hidden="true" />
                <span className="schedule-card__time-value">
                    {departureTime ?? "—"}
                </span>
                <span className="schedule-card__time-duration">
                    · {durationLabel}
                </span>
            </div>

            {/* ---------- Agences ---------- */}

            <div className="schedule-card__agencies">
                <div>
                    <span className="schedule-card__agency-label">
                        Départ
                    </span>
                    <span>{departureAgency?.name ?? "—"}</span>
                </div>

                <div>
                    <span className="schedule-card__agency-label">
                        Arrivée
                    </span>
                    <span>{arrivalAgency?.name ?? "—"}</span>
                </div>
            </div>

            {/* ---------- Jours ---------- */}

            <div className="schedule-card__days">
                {DAYS_ORDER.map((day) => (
                    <span
                        key={day}
                        className={`schedule-card__day ${sortedDays.includes(day)
                                ? "schedule-card__day--active"
                                : ""
                            }`}
                    >
                        {DAYS_LABELS[day]}
                    </span>
                ))}
            </div>

            {/* ---------- Période ---------- */}

            <div className="schedule-card__period">
                <Calendar size={14} aria-hidden="true" />
                <span>{dateRange}</span>
            </div>

            {/* ---------- Footer ---------- */}

            <footer className="schedule-card__footer">
                <div className="schedule-card__bus">
                    <Bus size={14} aria-hidden="true" />
                    <span>{bus?.name ?? "—"}</span>
                </div>

                <div className="schedule-card__price">
                    <Wallet size={14} aria-hidden="true" />
                    <strong>{priceLabel} FCFA</strong>
                </div>

                <button
                    type="button"
                    className="schedule-card__more"
                    onClick={() => onView?.(schedule)}
                    aria-label="Voir les détails"
                >
                    <MoreHorizontal size={18} />
                </button>
            </footer>
        </article>
    );
}