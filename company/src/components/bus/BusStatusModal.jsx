import { Power, RotateCcw, Wrench, AlertTriangle } from "lucide-react";

import Modal from "@shared/components/ui/Modal";
import Button from "@shared/components/ui/Button";

import "../../styles/components/bus/BusStatusModal.scss";

/* ------------------------------------------------------------------ */

const STATUS_OPTIONS = [
    {
        value: "INACTIVE",
        label: "Désactiver",
        description:
            "Le bus ne pourra plus être assigné à de nouveaux voyages.",
        icon: Power,
        variant: "warning",
    },
    {
        value: "ACTIVE",
        label: "Réactiver",
        description: "Le bus redeviendra disponible pour les voyages.",
        icon: RotateCcw,
        variant: "primary",
    },
    {
        value: "MAINTENANCE",
        label: "Mettre en maintenance",
        description:
            "Le bus sera temporairement indisponible pour cause de maintenance.",
        icon: Wrench,
        variant: "warning",
    },
    {
        value: "RETIRED",
        label: "Réformer le bus",
        description:
            "Le bus sera définitivement retiré de la flotte. Cette action est irréversible.",
        icon: AlertTriangle,
        variant: "danger",
    },
];

/* ------------------------------------------------------------------ */

export default function BusStatusModal({
    open,
    bus,
    loading = false,
    onClose,
    onConfirm,
}) {
    if (!bus) return null;

    // Déterminer l'action proposée selon l'état actuel
    const currentStatus = bus.status;

    let primaryOption;

    if (currentStatus === "ACTIVE") {
        primaryOption = STATUS_OPTIONS.find((o) => o.value === "INACTIVE");
    } else if (currentStatus === "INACTIVE") {
        primaryOption = STATUS_OPTIONS.find((o) => o.value === "ACTIVE");
    } else if (currentStatus === "MAINTENANCE") {
        primaryOption = STATUS_OPTIONS.find((o) => o.value === "ACTIVE");
    } else {
        return null; // RETIRED : pas d'action possible
    }

    const Icon = primaryOption.icon;

    return (
        <Modal isOpen={open} onClose={onClose} title={primaryOption.label} size="sm">
            <div className={`bus-status-modal bus-status-modal--${primaryOption.variant}`}>
                <div className="bus-status-modal__icon">
                    <Icon size={28} aria-hidden="true" />
                </div>

                <p className="bus-status-modal__description">
                    {primaryOption.description}
                </p>

                <div className="bus-status-modal__bus">
                    <strong>
                        {bus.name || bus.registrationNumber}
                    </strong>
                    <span>
                        {bus.capacity} places · {bus.registrationNumber}
                    </span>
                </div>

                <footer className="bus-status-modal__actions">
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
                        variant={primaryOption.variant}
                        onClick={() => onConfirm?.(primaryOption.value)}
                        loading={loading}
                        disabled={loading}
                    >
                        {primaryOption.label}
                    </Button>
                </footer>
            </div>
        </Modal>
    );
}