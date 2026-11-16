import {
    Clock,
    Bus,
    Users,
    Armchair,
    ChevronUp,
    ChevronDown,
    BusFront,
    Wallet,
} from "lucide-react";
import { useState } from "react";

import { formatDate } from "../../utils/date.utils";

import "../../styles/components/cart/TripSummary.scss";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function formatPrice(value) {
    return new Intl.NumberFormat("fr-FR").format(value ?? 0);
}

/* ------------------------------------------------------------------ */

export default function TripSummary({ trip, cart }) {
    const [expanded, setExpanded] = useState(false);

    const toggle = () => setExpanded((v) => !v);

    /* ---------- Garde-fous ---------- */

    if (!trip) return null;

    /* ---------- Données dérivées ---------- */

    const passengersCount = cart?.totalPassengers ?? 0;
    const seatNumbers = cart?.seatNumbers ?? [];
    const price = trip.price ?? 0;
    const totalPrice = price * passengersCount;

    return (
        <section className="trip-summary">
            {/* ============================================
                HEADER (toujours visible)
            ============================================ */}

            <header className="trip-summary__header">
                <div className="trip-summary__main">
                    <div className="trip-summary__icon">
                        <BusFront size={22} aria-hidden="true" />
                    </div>

                    <div className="trip-summary__info">
                        <h2 className="trip-summary__title">
                            <span>{trip.departure?.city?.name ?? "—"}</span>
                            <span
                                className="trip-summary__arrow"
                                aria-hidden="true"
                            >
                                →
                            </span>
                            <span>{trip.arrival?.city?.name ?? "—"}</span>
                        </h2>

                        <div className="trip-summary__meta">
                            <span>
                                {formatDate(cart?.date, "dd MMM yyyy")}
                            </span>
                            <span aria-hidden="true">•</span>
                            <span>
                                {formatDate(trip.departure?.time, "dd MMM yyyy") ?? "—"}
                            </span>
                            <span aria-hidden="true">•</span>
                            <span>
                                {passengersCount}{" "}
                                {passengersCount > 1
                                    ? "voyageurs"
                                    : "voyageur"}
                            </span>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    className="trip-summary__toggle"
                    onClick={toggle}
                    aria-expanded={expanded}
                    aria-controls="trip-summary-details"
                    aria-label={
                        expanded
                            ? "Masquer les détails du trajet"
                            : "Afficher les détails du trajet"
                    }
                >
                    {expanded ? (
                        <ChevronUp size={20} />
                    ) : (
                        <ChevronDown size={20} />
                    )}
                </button>
            </header>

            {/* ============================================
                DÉTAILS (dépliables)
            ============================================ */}

            {expanded && (
                <div
                    className="trip-summary__details"
                    id="trip-summary-details"
                >
                    {/* ---------- Compagnie & bus ---------- */}

                    <div className="trip-summary__company">
                        <div className="trip-summary__logo">
                            {trip.company?.logo ? (
                                <img
                                    src={trip.company.logo}
                                    alt={trip.company.name ?? "Compagnie"}
                                />
                            ) : (
                                <span>
                                    {trip.company?.name?.charAt(0) ?? "?"}
                                </span>
                            )}
                        </div>

                        <div>
                            <strong>
                                {trip.company?.name ?? "—"}
                            </strong>
                            <span>{trip.bus?.name ?? "—"}</span>
                        </div>
                    </div>

                    {/* ---------- Itinéraire ---------- */}

                    <div className="trip-summary__route">
                        {/* Départ */}
                        <div className="trip-summary__point">
                            <span className="trip-summary__time">
                                {formatDate(trip.departure?.time,  "dd MMMM yyyy à HH:mm") ?? "—"}
                            </span>
                            <strong>
                                {trip.departure?.city?.name ?? "—"}
                            </strong>
                            <span className="trip-summary__agency">
                                {trip.departure?.agency?.name ?? "—"}
                            </span>
                        </div>

                        {/* Ligne */}
                        <div className="trip-summary__connection">
                            <span>{trip.duration ?? "—"}</span>
                            <div className="trip-summary__line">
                                <span className="trip-summary__line-dot" />
                                <span className="trip-summary__line-path" />
                                <span className="trip-summary__line-dot" />
                            </div>
                        </div>

                        {/* Arrivée */}
                        <div className="trip-summary__point">
                            <span className="trip-summary__time">
                                {formatDate(trip.arrival?.time,  "dd MMMM yyyy à HH:mm") ?? "—"}
                            </span>
                            <strong>
                                {trip.arrival?.city?.name ?? "—"}
                            </strong>
                            <span className="trip-summary__agency">
                                {trip.arrival?.agency?.name ?? "—"}
                            </span>
                        </div>
                    </div>

                    {/* ============================================
                        SIÈGES SÉLECTIONNÉS
                    ============================================ */}

                    <div className="trip-summary__seats">
                        <div className="trip-summary__seats-header">
                            <Armchair size={16} aria-hidden="true" />
                            <strong>
                                Siège{seatNumbers.length > 1 ? "s" : ""}{" "}
                                sélectionné
                                {seatNumbers.length > 1 ? "s" : ""}
                            </strong>
                        </div>

                        {seatNumbers.length > 0 ? (
                            <ul className="trip-summary__seats-list">
                                {seatNumbers.map((number) => (
                                    <li
                                        key={number}
                                        className="trip-summary__seat"
                                    >
                                        {number}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="trip-summary__seats-empty">
                                Aucun siège sélectionné.
                            </p>
                        )}
                    </div>

                    {/* ============================================
                        DÉTAILS TECHNIQUES (grid)
                    ============================================ */}

                    <dl className="trip-summary__grid">
                        <div>
                            <dt>
                                <Clock size={14} aria-hidden="true" />
                                Date
                            </dt>
                            <dd>
                                {formatDate(cart?.date, "dd MMMM yyyy")}
                            </dd>
                        </div>

                        <div>
                            <dt>
                                <Bus size={14} aria-hidden="true" />
                                Bus
                            </dt>
                            <dd>{trip.bus?.name ?? "—"}</dd>
                        </div>

                        <div>
                            <dt>
                                <Users size={14} aria-hidden="true" />
                                Passagers
                            </dt>
                            <dd>{passengersCount}</dd>
                        </div>

                        <div>
                            <dt>
                                <Wallet size={14} aria-hidden="true" />
                                Prix unitaire
                            </dt>
                            <dd>{formatPrice(price)} FCFA</dd>
                        </div>
                    </dl>

                    {/* ============================================
                        TOTAL
                    ============================================ */}

                    <div className="trip-summary__total">
                        <span>
                            Total ({passengersCount} ×{" "}
                            {formatPrice(price)} FCFA)
                        </span>
                        <strong>{formatPrice(totalPrice)} FCFA</strong>
                    </div>
                </div>
            )}
        </section>
    );
}