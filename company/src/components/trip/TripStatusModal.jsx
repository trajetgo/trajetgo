import { AlertTriangle, CheckCircle2, Play } from "lucide-react";

import Modal from "@shared/components/ui/Modal";
import Button from "@shared/components/ui/Button";

import "../../styles/components/agency/TripStatusModal.scss";

/* ------------------------------------------------------------------ */
/* Config des actions                                                  */
/* ------------------------------------------------------------------ */

const ACTION_CONFIG = {
    START_BOARDING: {
        title: "Démarrer l'embarquement",
        description:
            "L'embarquement de ce voyage va être ouvert. Les passagers pourront monter à bord.",
        targetStatus: "BOARDING",
        variant: "primary",
        icon: Play,
        confirmLabel: "Ouvrir l'embarquement",
    },

    DEPART: {
        title: "Marquer comme parti",
        description:
            "Le voyage sera marqué comme ayant quitté l'agence de départ.",
        targetStatus: "DEPARTED",
        variant: "primary",
        icon: Play,
        confirmLabel: "Confirmer le départ",
    },

    ARRIVE: {
        title: "Marquer comme arrivé",
        description:
            "Le voyage sera marqué comme arrivé à destination. Cette action est définitive.",
        targetStatus: "ARRIVED",
        variant: "primary",
        icon: CheckCircle2,
        confirmLabel: "Confirmer l'arrivée",
    },

    CANCEL: {
        title: "Annuler le voyage",
        description:
            "Les nouvelles réservations seront bloquées et le voyage sera marqué comme annulé. Les passagers déjà inscrits devront être remboursés.",
        targetStatus: "CANCELLED",
        variant: "danger",
        icon: AlertTriangle,
        confirmLabel: "Annuler le voyage",
    },
};

/* ------------------------------------------------------------------ */

export default function TripStatusModal({
    open,
    trip,
    action,
    loading = false,
    onClose,
    onConfirm,
}) {
    if (!trip) return null;

    const config = ACTION_CONFIG[action];

    if (!config) {
        console.warn(`[TripStatusModal] Action inconnue : ${action}`);
        return null;
    }

    const Icon = config.icon;

    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            title={config.title}
            size="sm"
        >
            <div className={`trip-status-modal trip-status-modal--${config.variant}`}>
                {/* Icône + description */}
                <div className="trip-status-modal__icon">
                    <Icon size={28} aria-hidden="true" />
                </div>

                <p className="trip-status-modal__description">
                    {config.description}
                </p>

                {/* Récapitulatif du voyage */}
                <div className="trip-status-modal__trip">
                    <div className="trip-status-modal__trip-route">
                        <strong>{trip.departure?.city ?? "—"}</strong>
                        <span aria-hidden="true">→</span>
                        <strong>{trip.arrival?.city ?? "—"}</strong>
                    </div>

                    {trip.departure?.time && (
                        <p className="trip-status-modal__trip-date">
                            Départ prévu :{" "}
                            {new Date(trip.departure.time).toLocaleString(
                                "fr-FR",
                                {
                                    dateStyle: "long",
                                    timeStyle: "short",
                                }
                            )}
                        </p>
                    )}
                </div>

                {/* Actions */}
                <footer className="trip-status-modal__actions">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Annuler
                    </Button>

                    <Button
                        type="button"
                        variant={config.variant}
                        onClick={onConfirm}
                        loading={loading}
                        disabled={loading}
                    >
                        {config.confirmLabel}
                    </Button>
                </footer>
            </div>
        </Modal>
    );
}
