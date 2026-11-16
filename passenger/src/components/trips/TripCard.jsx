import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { AMENITIES } from "@shared/constants/amenities";
import Modal from "@shared/components/ui/Modal";

import "../../styles/components/trips/TripCard.scss";

export default function TripCard({
    trip,
    adults,
    children,
}) {
    const navigate = useNavigate();
    const [openModal, setOpenModal] = useState(false);

    const {
        id,
        route,
        departure,
        arrival,
        bus,
        durationLabel,
        availableSeats,
        totalSeats,
        price,
        currency,
    } = trip;

    const totalPassengers = adults + children.length;

    const amenities = bus?.amenities ?? [];
    const visibleAmenities = amenities.slice(0, 5);
    const remainingAmenities = amenities.length - visibleAmenities.length;

    /* ✅ Params propres */
    const params = new URLSearchParams({
        tripId: id,
        from: departure?.city?.id ?? "",
        fromName: departure?.city?.name ?? "",
        to: arrival?.city?.id ?? "",
        toName: arrival?.city?.name ?? "",
        date: departure?.at ? departure.at.split("T")[0] : "",
        adults: String(adults),
    });

    if (children.length > 0) {
        params.set("children", children.join(","));
    }

    const formatPrice = (value) =>
        new Intl.NumberFormat("fr-FR").format(value);

    /* ✅ Formatage heure */
    const formatTime = (iso) =>
        iso ? new Date(iso).toISOString().slice(11, 16) : "—";

    return (
        <>
            <article className="trip-card">
                {/* Header */}
                <div className="trip-card__header">
                    <div className="trip-card__company">
                        <div className="trip-card__logo">
                            {route?.company?.logo ? (
                                <img
                                    src={route.company.logo}
                                    alt={route.company.name}
                                />
                            ) : (
                                <span>
                                    {route?.company?.name?.charAt(0) ?? "?"}
                                </span>
                            )}
                        </div>

                        <div>
                            <h3 className="trip-card__company-name">
                                {route?.company?.name ?? "—"}
                            </h3>
                            <p className="trip-card__bus">
                                {bus?.name ?? "—"}
                            </p>
                        </div>
                    </div>

                    <span className="trip-card__status">Disponible</span>
                </div>

                {/* Route */}
                <div className="trip-card__route">
                    {/* Départ */}
                    <div className="trip-card__location">
                        <span className="trip-card__time">
                            {formatTime(departure?.at)}
                        </span>

                        <div className="trip-card__point trip-card__point--departure" />

                        <div className="trip-card__city">
                            <strong>{departure?.city?.name ?? "—"}</strong>
                            <span>{departure?.agency?.name ?? "—"}</span>
                        </div>
                    </div>

                    {/* Ligne */}
                    <div className="trip-card__connection">
                        <span>{durationLabel ?? "—"}</span>

                        <div className="trip-card__line">
                            <span className="trip-card__line-dot" />
                            <span className="trip-card__line-path" />
                            <span className="trip-card__line-dot" />
                        </div>
                    </div>

                    {/* Arrivée */}
                    <div className="trip-card__location">
                        <span className="trip-card__time">
                            {formatTime(arrival?.at)}
                        </span>

                        <div className="trip-card__point trip-card__point--arrival" />

                        <div className="trip-card__city">
                            <strong>{arrival?.city?.name ?? "—"}</strong>
                            <span>{arrival?.agency?.name ?? "—"}</span>
                        </div>
                    </div>
                </div>

                {/* Amenities */}
                <div className="trip-card__amenities">
                    {visibleAmenities.map((amenity) => {
                        const config = AMENITIES[amenity];
                        if (!config) return null;
                        const Icon = config.icon;

                        return (
                            <span
                                key={amenity}
                                className="trip-card__amenity"
                                title={config.label}
                                onClick={() => setOpenModal(true)}
                            >
                                <Icon size={14} strokeWidth={1.8} />
                            </span>
                        );
                    })}

                    {remainingAmenities > 0 && (
                        <span className="trip-card__amenity trip-card__amenity--more">
                            +{remainingAmenities}
                        </span>
                    )}
                </div>

                {/* Footer */}
                <div className="trip-card__footer">
                    <div className="trip-card__info">
                        <div className="trip-card__seats">
                            <span className="trip-card__seats-icon">
                                💺
                            </span>
                            <span>
                                {availableSeats} places disponibles
                            </span>
                        </div>

                        <span className="trip-card__separator">•</span>

                        <span>{totalSeats} places</span>
                    </div>

                    <div className="trip-card__price">
                        <strong>
                            {formatPrice(price * totalPassengers)}{" "}
                            {currency === "XOF" ? "FCFA" : currency}
                        </strong>

                        <span>
                            {totalPassengers > 1
                                ? `Pour ${totalPassengers} voyageurs`
                                : "Pour 1 voyageur"}
                        </span>
                    </div>

                    <button
                        type="button"
                        className="trip-card__button"
                        onClick={() =>
                            navigate(`/seats?${params.toString()}`)
                        }
                    >
                        Choisir
                    </button>
                </div>
            </article>

            {/* Modal amenities */}
            <Modal
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
                title="Commodités"
            >
                <div className="trip-card__amenities">
                    {amenities.map((amenity) => {
                        const config = AMENITIES[amenity];
                        if (!config) return null;
                        const Icon = config.icon;

                        return (
                            <span
                                key={amenity}
                                className="trip-card__amenity"
                                title={config.label}
                            >
                                <Icon size={14} strokeWidth={1.8} />
                                <span>{config.label}</span>
                            </span>
                        );
                    })}
                </div>
            </Modal>
        </>
    );
}