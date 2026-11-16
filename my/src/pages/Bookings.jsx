import { useMemo, useState } from "react";
import { CalendarDays, Plus, Search, X } from "lucide-react";

import Loading from "@shared/components/Loading";
import Empty from "@shared/components/feedback/Empty";

import useBookings from "../hooks/useBookings";
import {
    BOOKINGS_STATUS_FILTERS,
    getBookingStatusConfig,
} from "../constants/bookings.constants";

import "../styles/pages/Bookings.scss";

/* ------------------------------------------------------------------ */
/* Badge de statut                                                     */
/* ------------------------------------------------------------------ */

function BookingStatusBadge({ status }) {
    const config = getBookingStatusConfig(status);

    return (
        <span className={`booking-badge booking-badge--${config.class}`}>
            {config.label}
        </span>
    );
}

/* ------------------------------------------------------------------ */
/* Toolbar                                                             */
/* ------------------------------------------------------------------ */

function Toolbar({ search, onSearchChange, statusFilter, onStatusChange }) {
    return (
        <section className="bookings__toolbar">
            <div className="bookings__search">
                <Search size={18} aria-hidden="true" />

                <input
                    type="search"
                    placeholder="Rechercher une réservation..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    aria-label="Rechercher une réservation"
                />

                {search && (
                    <button
                        type="button"
                        className="bookings__search-clear"
                        onClick={() => onSearchChange("")}
                        aria-label="Effacer la recherche"
                    >
                        <X size={15} />
                    </button>
                )}
            </div>

            <div className="bookings__filter">
                <select
                    value={statusFilter}
                    onChange={(e) => onStatusChange(e.target.value)}
                    aria-label="Filtrer les réservations par statut"
                >
                    <option value="">Tous les statuts</option>

                    {Object.values(BOOKINGS_STATUS_FILTERS).map((filter) => (
                        <option key={filter.value} value={filter.value}>
                            {filter.label}
                        </option>
                    ))}
                </select>
            </div>
        </section>
    );
}

/* ------------------------------------------------------------------ */
/* Liste                                                               */
/* ------------------------------------------------------------------ */

function BookingRow({ booking }) {
    return (
        <li className="bookings__row">
            <div className="bookings__row-main">
                <strong>
                    {booking.trip?.originCity ?? "—"} →{" "}
                    {booking.trip?.destinationCity ?? "—"}
                </strong>

                <span>
                    {booking.reference ?? booking.id.slice(0, 8)}
                </span>
            </div>

            <BookingStatusBadge status={booking.status} />

            <div className="bookings__row-price">
                {new Intl.NumberFormat("fr-FR").format(booking.totalPrice ?? 0)}{" "}
                FCFA
            </div>
        </li>
    );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Bookings() {
    const {
        loading,
        bookings,
        serverError,
        refresh,
    } = useBookings();

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const filteredBookings = useMemo(() => {
        let data = [...bookings];

        if (statusFilter) {
            data = data.filter((b) => b.status === statusFilter);
        }

        if (search.trim()) {
            const term = search.trim().toLowerCase();

            data = data.filter((b) => {
                const reference = (b.reference ?? b.id ?? "").toLowerCase();
                const origin = (b.trip?.originCity ?? "").toLowerCase();
                const destination = (b.trip?.destinationCity ?? "").toLowerCase();

                return (
                    reference.includes(term) ||
                    origin.includes(term) ||
                    destination.includes(term)
                );
            });
        }

        return data;
    }, [bookings, statusFilter, search]);

    if (loading) {
        return <Loading message="Chargement des réservations..." />;
    }

    const isEmpty = bookings.length === 0;

    return (
        <main className="bookings">
            <header className="bookings__header">
                <div>
                    <h1>Mes réservations</h1>
                    <p>Gérez les voyages de votre compagnie.</p>
                </div>

                <button
                    type="button"
                    className="bookings__create-button"
                    onClick={() => {
                        // TODO : ouvrir le modal de création
                    }}
                >
                    <Plus size={18} />
                    Faire une réservation
                </button>
            </header>

            {serverError && (
                <div className="bookings__error" role="alert">
                    {serverError}
                    <button type="button" onClick={refresh}>
                        Réessayer
                    </button>
                </div>
            )}

            {!serverError && isEmpty ? (
                <Empty
                    className="bookings__empty"
                    Icon={CalendarDays}
                    title="Aucune réservation"
                    text="Commencez par faire une réservation."
                />
            ) : (
                <>
                    <Toolbar
                        search={search}
                        onSearchChange={setSearch}
                        statusFilter={statusFilter}
                        onStatusChange={setStatusFilter}
                    />

                    {filteredBookings.length === 0 ? (
                        <Empty
                            className="bookings__empty"
                            Icon={CalendarDays}
                            title="Aucun résultat"
                            text="Aucune réservation ne correspond à vos critères."
                        />
                    ) : (
                        <ul className="bookings__list">
                            {filteredBookings.map((booking) => (
                                <BookingRow key={booking.id} booking={booking} />
                            ))}
                        </ul>
                    )}
                </>
            )}
        </main>
    );
}