import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
    ArrowRight,
    BusFront,
    ChevronDown,
    ChevronUp,
    Users
} from "lucide-react";

import { formatDate } from "@shared/utils/date.utils";
import Loading from "@shared/components/Loading";
import { CHECKOUT_URL } from "@shared/services/api";

import useTrip from "../../hooks/useTrip";
import SeatSelection from "../../components/seats/SeatSelection";

import '../../styles/pages/public/Seats.scss';

export default function Seats() {
    const [searchParams] = useSearchParams();

    const [selectedSeats, setSelectedSeats] = useState([]);

    const [dropDownTrip, setDropDownTrip] = useState(false);

    const tripId = searchParams.get("tripId");
    const from = searchParams.get("from");
    const fromName = searchParams.get("fromName");   // ✅
    const to = searchParams.get("to");
    const toName = searchParams.get("toName");        // ✅
    const date = searchParams.get("date");

    const adults = Number(searchParams.get("adults") || 1);
    const children = (searchParams.get("children") || "")
        .split(",")
        .filter(Boolean)
        .map(Number);

    const totalPassengers = adults + children.length;

    const {
        loading,
        trip,
        serverError,
        refresh,
    } = useTrip(tripId);

    const departureLabel =
        trip?.departure?.city?.name ?? fromName ?? "Départ";
    const arrivalLabel =
        trip?.arrival?.city?.name ?? toName ?? "Arrivée";

    const toggleTripDetails = () => {
        setDropDownTrip((previous) => !previous);
    };

    if (loading) return <Loading message="Chargement du trajet..." />

    if (serverError) {
        return (
            <div className="seats seats--error">
                <div className="seats__error">
                    <h1>Trajet introuvable</h1>

                    <p>
                        {serverError}
                    </p>

                    <button
                        type="button"
                        onClick={refresh}
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    const availableSeats = trip?.seats?.available ?? 0;

    if (totalPassengers > availableSeats) {
        return (
            <div className="seats seats--error">
                <div className="seats__error">
                    <h1>Plus assez de places</h1>
                    <p>
                        Il ne reste que <strong>{availableSeats}</strong>{" "}
                        place{availableSeats > 1 ? "s" : ""} disponible
                        {availableSeats > 1 ? "s" : ""}.
                    </p>
                </div>
            </div>
        );
    }

    const isSelectionComplete =
        selectedSeats.length === totalPassengers &&
        selectedSeats.every(
            (seat) => !trip?.unavailableSeatIds?.includes(seat.id)
        );

    const remaining = totalPassengers - selectedSeats.length;

    /* ---------- Handlers ---------- */

    const handleContinue = () => {
        if (!isSelectionComplete) return;

        /**
         * ✅ On prépare les données à transmettre au checkout.
         *
         * Deux canaux :
         *  1. Query params → lisibles, bookmarkables, mais limités en taille
         *  2. sessionStorage → plus riche, mais on doit le partager entre domaines
         *
         * Le plus simple : tout passer en query params.
         */

        const params = new URLSearchParams({
            tripId,
            from: from ?? "",
            to: to ?? "",
            date: date ?? "",
            adults: String(adults),
            children: children.join(","),
            seats: selectedSeats.map((s) => s.id).join(","),
            seatNumbers: selectedSeats.map((s) => s.number).join(","),
            // Optionnel : total calculé pour éviter un recalcul au checkout
            totalPrice: String((trip?.price ?? 0) * selectedSeats.length),
        });

        // ✅ Navigation cross-domain
        window.location.href = `${CHECKOUT_URL}/cart?${params.toString()}`;
    };

    return (
        <div className="seats">

            {/* Récapitulatif du trajet */}
            <section className="seats__card seats__card--trip">

                <div className="seats__trip-header">

                    <div className="seats__trip-main">

                        <div className="seats__trip-icon">
                            <BusFront size={24} />
                        </div>

                        <div className="seats__trip-info">

                            <h1 className="seats__title">
                                <span>{departureLabel}</span>
                                <span className="seats__arrow" aria-hidden="true">→</span>
                                <span>{arrivalLabel}</span>
                            </h1>

                            <div className="seats__meta">

                                <span>
                                    {formatDate(
                                        date,
                                        "dd MMMM yyyy"
                                    )}
                                </span>

                                <span
                                    className="seats__separator"
                                    aria-hidden="true"
                                >
                                    •
                                </span>

                                <span>
                                    {totalPassengers}{" "}
                                    {totalPassengers > 1
                                        ? "voyageurs"
                                        : "voyageur"
                                    }
                                </span>

                            </div>

                        </div>

                    </div>

                    <button
                        type="button"
                        className="seats__trip-toggle"
                        onClick={toggleTripDetails}
                        aria-expanded={dropDownTrip}
                        aria-label={
                            dropDownTrip
                                ? "Masquer les détails du trajet"
                                : "Afficher les détails du trajet"
                        }
                    >
                        {dropDownTrip ? (
                            <ChevronUp size={20} />
                        ) : (
                            <ChevronDown size={20} />
                        )}
                    </button>

                </div>

                {dropDownTrip && (
                    <div className="seats__trip-details">

                        <div className="trip-card__company">
                            <div className="trip-card__logo">
                                {trip?.company?.logo ? (
                                    <img
                                        src={trip?.company?.logo}
                                        alt={trip?.company?.name}
                                    />
                                ) : (
                                    <span>
                                        {trip?.company?.name?.charAt(0)}
                                    </span>
                                )}
                            </div>

                            <div>
                                <h3 className="trip-card__company-name">
                                    {trip?.company?.name}
                                </h3>

                                <p className="trip-card__bus">
                                    {trip?.bus?.name}
                                </p>
                            </div>
                        </div>

                        <div className="trip-card__route">
                            {/* Départ */}
                            <div className="trip-card__location">
                                <span className="trip-card__time">
                                    {formatDate(trip?.departure?.time, 'dd MMM yyyy')}{" à "}
                                    {formatDate(trip?.departure?.time, 'HH:mm')}
                                </span>

                                <div className="trip-card__point trip-card__point--departure" />

                                <div className="trip-card__city">
                                    <strong>
                                        {trip?.departure?.city?.name}
                                    </strong>

                                    <span>
                                        {trip?.departure?.agency?.name}
                                    </span>
                                </div>
                            </div>

                            {/* Ligne */}
                            <div className="trip-card__connection">
                                <span>{trip?.duration}</span>

                                <div className="trip-card__line">
                                    <span className="trip-card__line-dot" />
                                    <span className="trip-card__line-path" />
                                    <span className="trip-card__line-dot" />
                                </div>
                            </div>

                            {/* Arrivée */}
                            <div className="trip-card__location">
                                <span className="trip-card__time">
                                    {formatDate(trip?.arrival?.time, 'dd MMM yyyy')}{" à "}
                                    {formatDate(trip?.arrival?.time, 'HH:mm')}
                                </span>

                                <div className="trip-card__point trip-card__point--arrival" />

                                <div className="trip-card__city">
                                    <strong>
                                        {trip?.arrival?.city?.name}
                                    </strong>

                                    <span>
                                        {trip?.arrival?.agency?.name}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>


            {/* Sélection des places */}
            <section className="seats__card seats__card--place">

                <div className="seats__place-header">
                    <div>
                        <h2>
                            Choisissez vos places
                        </h2>

                        <p>
                            Sélectionnez{" "}
                            {totalPassengers > 1
                                ? `${totalPassengers} places`
                                : "votre place"}
                            {" "}pour votre trajet.
                        </p>
                    </div>
                </div>

                <SeatSelection
                    seatLayout={trip?.bus?.seatLayout}
                    unavailableSeatIds={trip?.unavailableSeatIds ?? []}
                    passengers={totalPassengers}
                    value={selectedSeats}
                    onChange={setSelectedSeats}
                />
            </section>

            {/* ---------- Barre d'action (sticky) ---------- */}

            <footer className="seats__actions">
                <div className="seats__actions-summary">
                    <span className="seats__actions-count">
                        <Users size={16} aria-hidden="true" />
                        {selectedSeats.length} / {totalPassengers}{" "}
                        {totalPassengers > 1 ? "places" : "place"}
                    </span>

                    {selectedSeats.length > 0 && (
                        <span className="seats__actions-seats">
                            Sièges :{" "}
                            {selectedSeats
                                .map((s) => s.number)
                                .join(", ")}
                        </span>
                    )}
                </div>

                <button
                    type="button"
                    className="seats__continue"
                    disabled={!isSelectionComplete}
                    onClick={handleContinue}
                >
                    {isSelectionComplete ? (
                        <>
                            Renseigner les passagers
                            <ArrowRight size={16} />
                        </>
                    ) : (
                        <>
                            Choisissez encore {remaining} place
                            {remaining > 1 ? "s" : ""}
                        </>
                    )}
                </button>
            </footer>
        </div>
    );
}