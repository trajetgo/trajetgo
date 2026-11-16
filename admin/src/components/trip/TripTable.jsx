import Table from "@shared/components/ui/Table";
import HighlightText from "@shared/components/ui/HighlightText";
import { formatDate } from "@shared/utils/date.utils";

import TripActions from "./TripActions";
import { TRIP_STATUS, computeDuration } from "../../utils/trip.utils";

import "../../styles/components/trip/TripTable.scss";

export default function TripTable({
    trips,
    search,
    sort,
    onSort,
    setSelectedAction,
    setSelectedTrip,
}) {
    const formatStatus = (status) => {
        return (
            TRIP_STATUS[status] || {
                class: "unknown",
                label: "Inconnu",
            }
        );
    };

    const formatPrice = (price) => {
        if (price === null || price === undefined) {
            return "—";
        }

        return `${new Intl.NumberFormat("fr-FR").format(
            price
        )} FCFA`;
    };

    const columns = [
        {
            key: "route",
            label: "Voyage",
            sortable: true,
            render: (_, trip) => (
                <div className="trip-table__route">

                    <HighlightText
                        text={
                            trip.departure?.city ||
                            "—"
                        }
                        search={search}
                        as="strong"
                    />

                    <span
                        className="trip-table__arrow"
                        aria-hidden="true"
                    >
                        →
                    </span>

                    <HighlightText
                        text={
                            trip.arrival?.city ||
                            "—"
                        }
                        search={search}
                        as="strong"
                    />

                </div>
            ),
        },

        {
            key: "departure",
            label: "Départ",
            sortable: true,
            render: (_, trip) => (
                <div className="trip-table__date">
                    <HighlightText
                        text={trip.departure?.agency || "—"}
                        search={search}
                        as="strong"
                    />
                    <span className="trip-table__date-meta">
                        {formatDate(trip.departure.time, "dd MMM yyyy")} à{" "}
                        {formatDate(trip.departure.time, "HH:mm")}
                    </span>
                </div>
            ),
        },

        {
            key: "arrival",
            label: "Arrivée",
            sortable: true,
            render: (_, trip) => (
                <div className="trip-table__date">
                    <HighlightText
                        text={trip.arrival?.agency || "—"}
                        search={search}
                        as="strong"
                    />
                    <span className="trip-table__date-meta">
                        {formatDate(trip.arrival.time, "dd MMM yyyy")} à{" "}
                        {formatDate(trip.arrival.time, "HH:mm")}
                    </span>
                </div>
            ),
        },

        {
            key: "duration",
            label: "Durée",
            sortable: true,
            render: (_, trip) => (
                <span className="trip-table__duration">
                    {computeDuration(trip.departure?.time, trip.arrival?.time)}
                </span>
            ),
        },

        {
            key: "bus",
            label: "Bus",
            sortable: true,
            render: (_, trip) => (
                <div className="trip-table__bus">

                    <HighlightText
                        text={
                            trip.bus?.name
                        }
                        search={search}
                        as="strong"
                    />

                    {trip.bus?.capacity && (
                        <span>
                            {trip.bus.capacity} places
                        </span>
                    )}

                </div>
            ),
        },

        {
            key: "availableSeats",
            label: "Places",
            sortable: true,
            render: (_, trip) => {
                const total = trip.seats?.total ?? trip.bus?.capacity ?? 0;
                const booked = trip.seats?.booked ?? 0;
                const available = Math.max(0, total - booked);

                return (
                    <span className="trip-table__seats">
                        <strong>{available}</strong>
                        <small> / {total}</small>
                    </span>
                );
            },
        },

        {
            key: "price",
            label: "Prix",
            sortable: true,
            render: (_, trip) => (
                <span className="trip-table__price">
                    {formatPrice(trip.price)}
                </span>
            ),
        },

        {
            key: "status",
            label: "Statut",
            sortable: true,
            render: (_, trip) => {
                const status =
                    formatStatus(trip.status);

                return (
                    <span
                        className={`trip-table__badge trip-table__badge--${status.class}`}
                    >
                        {status.label}
                    </span>
                );
            },
        },

        {
            key: "actions",
            label: "Actions",
            sortable: false,
            render: (_, trip) => (
                <TripActions
                    trip={trip}
                    onView={setSelectedTrip}
                    setSelectedTrip={setSelectedTrip}
                    setSelectedAction={setSelectedAction}
                />
            ),
        },
    ];

    return (
        <Table
            className="trip-table"
            selectable={false}
            columns={columns}
            data={trips}
            sortable
            onSort={onSort}
            defaultSort={sort}
            emptyMessage="Aucun voyage trouvé."
            hoverable
            bordered
        />
    );
}