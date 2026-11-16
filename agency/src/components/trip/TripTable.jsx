import Table from "@shared/components/ui/Table";
import HighlightText from "@shared/components/ui/HighlightText";
import { formatDate } from "@shared/utils/date.utils";

import TripActions from "./TripActions";
import { TRIP_STATUS } from "../../utils/trip.utils";

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
                    <span>
                        {formatDate(trip.departure.time, "dd MMM yyyy")}
                    </span>

                    <span>
                        à
                    </span>

                    <span>
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
                    <span>
                        {formatDate(trip.arrival.time, "dd MMM yyyy")}
                    </span>

                    <span>
                        à
                    </span>

                    <span>
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
                    {trip.duration}
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
            render: (_, trip) => (
                <span className="trip-table__seats">
                    {trip.seats?.booked ?? 0} / {trip.seats?.total ?? trip.bus?.capacity ?? 0}
                </span>
            ),
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
                        className={`badge badge--${status.class}`}
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
                    setSelectedAction={
                        setSelectedAction
                    }
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