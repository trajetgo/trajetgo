import {
    Eye,
    Play,
    CheckCircle2,
    XCircle,
    Flag,
} from "lucide-react";
import "../../styles/components/trip/TripActions.scss";

export default function TripActions({
    trip,
    onView,
    setSelectedAction,
}) {
    const handleAction = (action) => {
        setSelectedAction({
            trip,
            action,
        });
    };

    return (
        <div className="trip-actions">

            {/* ================================================
                Voir
            ================================================= */}

            <button
                type="button"
                className="
                    trip-actions__btn
                    trip-actions__btn--neutral
                "
                title="Voir les détails"
                aria-label={`Voir les détails du voyage`}
                onClick={() => onView?.(trip)}
            >
                <Eye size={16} />
            </button>


            {/* ================================================
                SCHEDULED
                → Démarrer l'embarquement
                → Annuler
            ================================================= */}

            {trip.status === "SCHEDULED" && (
                <>
                    <button
                        type="button"
                        className="
                            trip-actions__btn
                            trip-actions__btn--primary
                        "
                        title="Démarrer l'embarquement"
                        aria-label="Démarrer l'embarquement"
                        onClick={() =>
                            handleAction(
                                "START_BOARDING"
                            )
                        }
                    >
                        <Play size={16} />
                    </button>

                    <button
                        type="button"
                        className="
                            trip-actions__btn
                            trip-actions__btn--danger
                        "
                        title="Annuler le voyage"
                        aria-label="Annuler le voyage"
                        onClick={() =>
                            handleAction(
                                "CANCEL"
                            )
                        }
                    >
                        <XCircle size={16} />
                    </button>
                </>
            )}


            {/* ================================================
                BOARDING
                → Marquer comme parti
                → Annuler
            ================================================= */}

            {trip.status === "BOARDING" && (
                <>
                    <button
                        type="button"
                        className="
                            trip-actions__btn
                            trip-actions__btn--success
                        "
                        title="Marquer le voyage comme parti"
                        aria-label="Marquer le voyage comme parti"
                        onClick={() =>
                            handleAction(
                                "DEPART"
                            )
                        }
                    >
                        <CheckCircle2 size={16} />
                    </button>

                    <button
                        type="button"
                        className="
                            trip-actions__btn
                            trip-actions__btn--danger
                        "
                        title="Annuler le voyage"
                        aria-label="Annuler le voyage"
                        onClick={() =>
                            handleAction(
                                "CANCEL"
                            )
                        }
                    >
                        <XCircle size={16} />
                    </button>
                </>
            )}


            {/* ================================================
                DEPARTED
                → Marquer comme arrivé
            ================================================= */}

            {trip.status === "DEPARTED" && (
                <button
                    type="button"
                    className="
                        trip-actions__btn
                        trip-actions__btn--success
                    "
                    title="Marquer comme arrivé"
                    aria-label="Marquer comme arrivé"
                    onClick={() =>
                        handleAction(
                            "ARRIVE"
                        )
                    }
                >
                    <Flag size={16} />
                </button>
            )}

        </div>
    );
}