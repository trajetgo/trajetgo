import {
    Route as RouteIcon,
    BusFront,
} from "lucide-react";

import Table from "@shared/components/ui/Table";
import HighlightText from "@shared/components/ui/HighlightText";
import { formatDate } from "@shared/utils/date.utils";

import ScheduleActions from "./ScheduleActions";

import { formatDuration, formatPrice } from "../../utils/schedule.utils";

import "../../styles/components/schedule/ScheduleTable.scss";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/**
 * Formate les jours en abrégé : "L M M J V S D" avec ceux actifs en gras.
 */
function formatDays(days = []) {
    return days.length === 7
        ? "Tous les jours"
        : `${days.length} jour${days.length > 1 ? "s" : ""}`;
}

/* ------------------------------------------------------------------ */

export default function ScheduleTable({
    schedules,
    search,
    sort,
    onSort,
    setSelectedAction,
    setSelectedSchedule,
}) {
    /* =========================================================
       Colonnes
    ========================================================= */

    const columns = [
        /* -------- Ligne -------- */
        {
            key: "route",
            label: "Ligne",
            sortable: true,
            render: (_, schedule) => {
                const route = schedule.route;

                return (
                    <div className="schedule-table__route">
                        <div className="schedule-table__route-icon">
                            <RouteIcon size={18} aria-hidden="true" />
                        </div>

                        <div className="schedule-table__route-info">
                            <div className="schedule-table__route-cities">
                                <HighlightText
                                    text={route?.origin ?? "—"}
                                    search={search}
                                    as="strong"
                                />

                                <span
                                    className="schedule-table__arrow"
                                    aria-hidden="true"
                                >
                                    →
                                </span>

                                <HighlightText
                                    text={route?.destination ?? "—"}
                                    search={search}
                                    as="strong"
                                />
                            </div>

                            {route?.distanceKm && (
                                <span className="schedule-table__route-meta">
                                    {route.distanceKm} km
                                </span>
                            )}
                        </div>
                    </div>
                );
            },
        },

        /* -------- Agences -------- */
        {
            key: "agencies",
            label: "Agences",
            sortable: false,
            render: (_, schedule) => {
                const departure = schedule.departureAgency;
                const arrival = schedule.arrivalAgency;

                if (!departure && !arrival) {
                    return <span className="schedule-table__empty">—</span>;
                }

                return (
                    <div className="schedule-table__agencies">
                        <span className="schedule-table__agency">
                            <HighlightText
                                text={departure?.name ?? "—"}
                                search={search}
                                as="span"
                            />
                        </span>

                        <span
                            className="schedule-table__agency-arrow"
                            aria-hidden="true"
                        >
                            →
                        </span>

                        <span className="schedule-table__agency">
                            <HighlightText
                                text={arrival?.name ?? "—"}
                                search={search}
                                as="span"
                            />
                        </span>
                    </div>
                );
            },
        },

        /* -------- Départs -------- */
        {
            key: "departures",
            label: "Départs",
            sortable: false,
            render: (_, schedule) => {
                const departures = schedule.departures ?? [];

                if (departures.length === 0) {
                    return <span className="schedule-table__empty">—</span>;
                }

                return (
                    <div className="schedule-table__departures">
                        {departures.slice(0, 3).map((dep) => (
                            <span
                                key={dep.id}
                                className="schedule-table__departure-badge"
                            >
                                {dep.departureTime}
                            </span>
                        ))}

                        {departures.length > 3 && (
                            <span className="schedule-table__departure-badge schedule-table__departure-badge--more">
                                +{departures.length - 3}
                            </span>
                        )}
                    </div>
                );
            },
        },

        /* -------- Jours -------- */
        {
            key: "daysOfWeek",
            label: "Jours",
            sortable: false,
            render: (_, schedule) => (
                <span className="schedule-table__days">
                    {formatDays(schedule.daysOfWeek)}
                </span>
            ),
        },

        /* -------- Période -------- */
        {
            key: "startDate",
            label: "Période",
            sortable: true,
            render: (_, schedule) => {
                const start = schedule.startDate
                    ? formatDate(schedule.startDate, 'dd MMM yyyy')
                    : null;

                const end = schedule.endDate
                    ? formatDate(schedule.endDate, 'dd MMM yyyy')
                    : null;

                return (
                    <div className="schedule-table__period">
                        {start ? (
                            <>
                                <span>{start}</span>
                                {end ? (
                                    <>
                                        <span className="schedule-table__period-separator">
                                            →
                                        </span>
                                        <span>{end}</span>
                                    </>
                                ) : (
                                    <span className="schedule-table__period-ongoing">
                                        en cours
                                    </span>
                                )}
                            </>
                        ) : (
                            <span className="schedule-table__empty">—</span>
                        )}
                    </div>
                );
            },
        },

        /* -------- Bus -------- */
        {
            key: "buses",
            label: "Bus",
            sortable: false,
            render: (_, schedule) => {
                const departures = schedule.departures ?? [];

                // Dédoublonnage par id, en ignorant les départs sans bus
                const uniqueBuses = new Map();

                departures.forEach((dep) => {
                    if (dep.bus?.id && !uniqueBuses.has(dep.bus.id)) {
                        uniqueBuses.set(dep.bus.id, dep.bus);
                    }
                });

                const buses = Array.from(uniqueBuses.values());

                if (buses.length === 0) {
                    return <span className="schedule-table__empty">—</span>;
                }

                return (
                    <div className="schedule-table__buses">
                        <BusFront size={14} aria-hidden="true" />

                        <div className="schedule-table__bus-badges">
                            {buses.slice(0, 2).map((bus) => (
                                <span
                                    key={bus.id}
                                    className="schedule-table__bus-badge"
                                    title={bus.registrationNumber ?? bus.name}
                                >
                                    {bus.name ?? bus.registrationNumber ?? "—"}
                                </span>
                            ))}

                            {buses.length > 2 && (
                                <span className="schedule-table__bus-badge schedule-table__bus-badge--more">
                                    +{buses.length - 2}
                                </span>
                            )}
                        </div>
                    </div>
                );
            },
        },

        /* -------- Durée -------- */
        {
            key: "durationMinutes",
            label: "Durée",
            sortable: true,
            render: (_, schedule) =>
                schedule.durationMinutes ? (
                    <span className="schedule-table__duration">
                        {formatDuration(schedule.durationMinutes)}
                    </span>
                ) : (
                    <span className="schedule-table__empty">—</span>
                ),
        },

        /* -------- Prix -------- */
        {
            key: "price",
            label: "Prix",
            sortable: true,
            render: (_, schedule) => (
                <span className="schedule-table__price">
                    {formatPrice(schedule.price)}
                </span>
            ),
        },

        /* -------- Statut -------- */
        {
            key: "active",
            label: "Statut",
            sortable: true,
            render: (_, schedule) => (
                <span
                    className={`schedule-table__status ${schedule.active
                        ? "schedule-table__status--active"
                        : "schedule-table__status--inactive"
                        }`}
                >
                    {schedule.active ? "Active" : "Inactive"}
                </span>
            ),
        },

        /* -------- Actions -------- */
        {
            key: "actions",
            label: "Actions",
            sortable: false,
            render: (_, schedule) => (
                <ScheduleActions
                    schedule={schedule}
                    onView={setSelectedSchedule}
                    setSelectedSchedule={setSelectedSchedule}
                    setSelectedAction={setSelectedAction}
                />
            ),
        },
    ];

    /* =========================================================
       Rendu
    ========================================================= */

    return (
        <Table
            className="schedule-table"
            selectable={false}
            columns={columns}
            data={schedules}
            sortable
            onSort={onSort}
            defaultSort={sort}
            emptyMessage="Aucune programmation trouvée."
            hoverable
            bordered
        />
    );
}