// src/pages/Home.jsx
import { Link } from "react-router-dom";
import {
    CalendarCheck,
    Ticket,
    Clock,
    MapPin,
    ArrowRight,
    TrendingUp,
    Wallet,
    Bus,
} from "lucide-react";

import { useAuth } from "@shared/contexts/auth.context";
import { formatDate } from "@shared/utils/date.utils";

import "../styles/pages/Home.scss";

/* ------------------------------------------------------------------ */
/* Données mockées — remplacer par vos hooks                            */
/* ------------------------------------------------------------------ */

const UPCOMING_TRIPS = [
    {
        id: "trip-1",
        origin: "Abidjan",
        destination: "Bouaké",
        departureAt: "2026-11-20T07:00:00.000Z",
        arrivalAt: "2026-11-20T11:00:00.000Z",
        company: "UTB",
        seats: ["A1"],
        price: 7000,
    },
];

const RECENT_BOOKINGS = [
    {
        id: "b-1",
        origin: "Abidjan",
        destination: "Yamoussoukro",
        date: "2026-11-05T08:00:00.000Z",
        status: "CONFIRMED",
        price: 5000,
    },
    {
        id: "b-2",
        origin: "Bouaké",
        destination: "Abidjan",
        date: "2026-10-28T15:30:00.000Z",
        status: "COMPLETED",
        price: 7000,
    },
    {
        id: "b-3",
        origin: "Abidjan",
        destination: "San-Pédro",
        date: "2026-10-15T09:00:00.000Z",
        status: "CANCELLED",
        price: 8000,
    },
];

const STATS = {
    totalTrips: 12,
    totalSpent: 84000,
    upcomingCount: 1,
};

const STATUS_LABELS = {
    PENDING: "En attente",
    CONFIRMED: "Confirmée",
    COMPLETED: "Terminée",
    CANCELLED: "Annulée",
};

/* ------------------------------------------------------------------ */

function formatPrice(value) {
    return new Intl.NumberFormat("fr-FR").format(value ?? 0);
}

export default function Home() {
    const { user } = useAuth();

    const firstName = user?.firstName ?? "voyageur";

    return (
        <div className="home">
            {/* ---------- En-tête ---------- */}

            <header className="home__header">
                <div>
                    <h1 className="home__title">
                        Bonjour, {firstName} 👋
                    </h1>
                    <p className="home__subtitle">
                        Voici un aperçu de vos voyages et réservations.
                    </p>
                </div>
            </header>

            {/* ---------- Statistiques ---------- */}

            <section className="home__stats" aria-label="Statistiques personnelles">
                <article className="home__stat">
                    <div className="home__stat-icon">
                        <Bus size={20} />
                    </div>
                    <div>
                        <strong>{STATS.totalTrips}</strong>
                        <span>Voyages effectués</span>
                    </div>
                </article>

                <article className="home__stat">
                    <div className="home__stat-icon">
                        <Ticket size={20} />
                    </div>
                    <div>
                        <strong>{STATS.upcomingCount}</strong>
                        <span>À venir</span>
                    </div>
                </article>

                <article className="home__stat">
                    <div className="home__stat-icon">
                        <Wallet size={20} />
                    </div>
                    <div>
                        <strong>{formatPrice(STATS.totalSpent)} FCFA</strong>
                        <span>Total dépensé</span>
                    </div>
                </article>

                <article className="home__stat">
                    <div className="home__stat-icon">
                        <TrendingUp size={20} />
                    </div>
                    <div>
                        <strong>{STATS.totalTrips > 0 ? "+1" : "0"}</strong>
                        <span>Ce mois-ci</span>
                    </div>
                </article>
            </section>

            {/* ---------- Prochains voyages ---------- */}

            <section className="home__section">
                <div className="home__section-header">
                    <h2>Prochains voyages</h2>
                    <Link to="/bookings" className="home__link">
                        Voir tout
                        <ArrowRight size={15} />
                    </Link>
                </div>

                {UPCOMING_TRIPS.length === 0 ? (
                    <p className="home__empty">Aucun voyage à venir.</p>
                ) : (
                    <ul className="home__trips">
                        {UPCOMING_TRIPS.map((trip) => (
                            <li key={trip.id} className="home__trip">
                                <div className="home__trip-icon">
                                    <Bus size={20} />
                                </div>

                                <div className="home__trip-main">
                                    <strong>
                                        {trip.origin} → {trip.destination}
                                    </strong>
                                    <div className="home__trip-meta">
                                        <span>
                                            <Clock size={13} />
                                            {formatDate(trip.departureAt, "dd MMM yyyy · HH:mm")}
                                        </span>
                                        <span>
                                            <MapPin size={13} />
                                            Siège {trip.seats.join(", ")}
                                        </span>
                                    </div>
                                </div>

                                <div className="home__trip-price">
                                    {formatPrice(trip.price)} FCFA
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {/* ---------- Réservations récentes ---------- */}

            <section className="home__section">
                <div className="home__section-header">
                    <h2>Réservations récentes</h2>
                    <Link to="/bookings" className="home__link">
                        Voir tout
                        <ArrowRight size={15} />
                    </Link>
                </div>

                <ul className="home__bookings">
                    {RECENT_BOOKINGS.map((booking) => (
                        <li key={booking.id} className="home__booking">
                            <div className="home__booking-main">
                                <strong>
                                    {booking.origin} → {booking.destination}
                                </strong>
                                <span>
                                    {formatDate(booking.date, "dd MMM yyyy")}
                                </span>
                            </div>

                            <span
                                className={`home__badge home__badge--${booking.status.toLowerCase()}`}
                            >
                                {STATUS_LABELS[booking.status] ?? booking.status}
                            </span>

                            <div className="home__booking-price">
                                {formatPrice(booking.price)} FCFA
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}