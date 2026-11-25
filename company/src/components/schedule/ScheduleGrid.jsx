import {
    Route as RouteIcon,
    BusFront,
    Clock,
    ArrowRight,
    CalendarDays,
    Wallet,
} from "lucide-react";

import HighlightText from "@shared/components/ui/HighlightText";
import { formatDate } from "@shared/utils/date.utils";

import ScheduleActions from "./ScheduleActions";

import {
    formatDuration,
    formatPrice,
} from "../../utils/schedule.utils";

import "../../styles/components/schedule/ScheduleGrid.scss";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function formatDays(days = []) {
    if (days.length === 7) return "Tous les jours";
    if (days.length === 0) return "—";

    return `${days.length} jour${days.length > 1 ? "s" : ""}`;
}

/* ------------------------------------------------------------------ */

export default function ScheduleGrid({
    schedules,
    search,
    setSelectedAction,
    setSelectedSchedule,
}) {
    if (!schedules || schedules.length === 0) return null;

    return (
        <ul className="schedule-grid">
            {schedules.map((schedule) => (
                <ScheduleGridCard
                    key={schedule.id}
                    schedule={schedule}
                    search={search}
                    setSelectedAction={setSelectedAction}
                    setSelectedSchedule={setSelectedSchedule}
                />
            ))}
        </ul>
    );
}

/* ------------------------------------------------------------------ */

function ScheduleGridCard({
    schedule,
    search,
    setSelectedAction,
    setSelectedSchedule,
}) {
    const handleView = () => {
        setSelectedSchedule?.(schedule);
        setSelectedAction?.("VIEW");
    };

    const departures = schedule.departures ?? [];
    const uniqueBuses = new Map();

    departures.forEach((dep) => {
        if (dep.bus?.id && !uniqueBuses.has(dep.bus.id)) {
            uniqueBuses.set(dep.bus.id, dep.bus);
        }
    });

    const buses = Array.from(uniqueBuses.values());

    const start = schedule.startDate
        ? formatDate(schedule.startDate, "dd MMM yyyy")
        : null;

    const end = schedule.endDate
        ? formatDate(schedule.endDate, "dd MMM yyyy")
        : null;

    return (
        <li className="schedule-grid__item">
            <article className="schedule-card">

                {/* ---------- En-tête ---------- */}

                <header className="schedule-card__header">
                    <div className="schedule-card__route-icon">
                        <RouteIcon size={20} />
                    </div>

                    <div className="schedule-card__route">
                        <h3>
                            <HighlightText
                                text={schedule.route?.origin ?? "—"}
                                search={search}
                                as="span"
                            />
                            <ArrowRight size={13} aria-hidden="true" />
                            <HighlightText
                                text={schedule.route?.destination ?? "—"}
                                search={search}
                                as="span"
                            />
                        </h3>

                        {schedule.route?.distanceKm && (
                            <span className="schedule-card__distance">
                                {schedule.route.distanceKm} km
                            </span>
                        )}
                    </div>

                    <span
                        className={`schedule-card__status ${schedule.active
                            ? "schedule-card__status--active"
                            : "schedule-card__status--inactive"
                            }`}
                    >
                        {schedule.active ? "Active" : "Inactive"}
                    </span>
                </header>

                {/* ---------- Agences ---------- */}

                <div className="schedule-card__agencies">
                    <span>
                        <HighlightText
                            text={schedule.departureAgency?.name ?? "—"}
                            search={search}
                            as="span"
                        />
                    </span>

                    <ArrowRight size={12} aria-hidden="true" />

                    <span>
                        <HighlightText
                            text={schedule.arrivalAgency?.name ?? "—"}
                            search={search}
                            as="span"
                        />
                    </span>
                </div>

                {/* ---------- Départs ---------- */}

                {departures.length > 0 && (
                    <div className="schedule-card__departures">
                        <Clock size={13} aria-hidden="true" />

                        <div className="schedule-card__badges">
                            {departures.slice(0, 3).map((dep) => (
                                <span
                                    key={dep.id}
                                    className="schedule-card__time-badge"
                                >
                                    {dep.departureTime}
                                </span>
                            ))}

                            {departures.length > 3 && (
                                <span className="schedule-card__time-badge schedule-card__time-badge--more">
                                    +{departures.length - 3}
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* ---------- Détails ---------- */}

                <dl className="schedule-card__meta">
                    <div>
                        <dt>
                            <CalendarDays size={12} aria-hidden="true" />
                            Jours
                        </dt>
                        <dd>{formatDays(schedule.daysOfWeek)}</dd>
                    </div>

                    <div>
                        <dt>
                            <CalendarDays size={12} aria-hidden="true" />
                            Période
                        </dt>
                        <dd>
                            {start ? (
                                end ? (
                                    `${start} → ${end}`
                                ) : (
                                    `Depuis ${start}`
                                )
                            ) : (
                                "—"
                            )}
                        </dd>
                    </div>

                    <div>
                        <dt>
                            <BusFront size={12} aria-hidden="true" />
                            Bus
                        </dt>
                        <dd>
                            {buses.length > 0
                                ? buses.map((b) => b.name ?? b.registrationNumber ?? "—").join(", ")
                                : "—"}
                        </dd>
                    </div>

                    <div>
                        <dt>
                            <Clock size={12} aria-hidden="true" />
                            Durée
                        </dt>
                        <dd>
                            {schedule.durationMinutes
                                ? formatDuration(schedule.durationMinutes)
                                : "—"}
                        </dd>
                    </div>
                </dl>

                {/* ---------- Pied ---------- */}

                <footer className="schedule-card__footer">
                    <div className="schedule-card__price">
                        <Wallet size={14} aria-hidden="true" />
                        <strong>{formatPrice(schedule.price)}</strong>
                    </div>

                    <div className="schedule-card__actions">
                        <button
                            type="button"
                            className="schedule-card__view"
                            onClick={handleView}
                        >
                            Détails
                        </button>

                        <ScheduleActions
                            schedule={schedule}
                            onView={handleView}
                            setSelectedAction={setSelectedAction}
                            setSelectedSchedule={setSelectedSchedule}
                        />
                    </div>
                </footer>

            </article>
        </li>
    );
}