import {
    AlertTriangle,
    CheckCircle2,
    XCircle,
} from "lucide-react";

import Modal from "@shared/components/ui/Modal";
import Button from "@shared/components/ui/Button";
import ActivityIndicator from "@shared/components/ui/ActivityIndicator";

import "../../styles/components/agency/AgencyStatusModal.scss";

const ACTION_CONFIG = {
    ACTIVATE: {
        title: "Activer l'agence",
        icon: CheckCircle2,
        iconClass: "success",
        description: (agency) =>
            `L'agence « ${agency?.name} » sera de nouveau active et pourra être utilisée pour les opérations de la compagnie.`,
        confirmLabel: "Activer l'agence",
        confirmClass: "primary",
    },

    DEACTIVATE: {
        title: "Désactiver l'agence",
        icon: XCircle,
        iconClass: "warning",
        description: (agency) =>
            `L'agence « ${agency?.name} » sera désactivée. Elle ne pourra plus être utilisée pour les nouvelles opérations tant qu'elle reste inactive.`,
        confirmLabel: "Désactiver",
        confirmClass: "warning",
    },

    CLOSE: {
        title: "Fermer l'agence",
        icon: AlertTriangle,
        iconClass: "danger",
        description: (agency) =>
            `L'agence « ${agency?.name} » sera définitivement marquée comme fermée. Son historique restera conservé.`,
        confirmLabel: "Fermer l'agence",
        confirmClass: "danger",
    },
};

export default function AgencyStatusModal({
    open,
    agency,
    action,
    onClose,
    onConfirm,
    loading = false,
}) {
    const config = ACTION_CONFIG[action];

    if (!config) {
        return null;
    }

    const Icon = config.icon;

    const handleConfirm = async () => {
        await onConfirm?.();
    };

    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            title={config.title}
        >
            <div className="agency-status-modal">

                <div
                    className={`agency-status-modal__icon agency-status-modal__icon--${config.iconClass}`}
                >
                    <Icon size={24} />
                </div>

                <div className="agency-status-modal__content">

                    <h3>
                        {config.title}
                    </h3>

                    <p>
                        {config.description(agency)}
                    </p>

                    {agency && (
                        <div className="agency-status-modal__agency">
                            <strong>
                                {agency.name}
                            </strong>

                            {agency.code && (
                                <span>
                                    Code : {agency.code}
                                </span>
                            )}
                        </div>
                    )}

                </div>

                <div className="agency-status-modal__actions">

                    <Button
                        type="button"
                        variant="secondary"
                        size="medium"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Annuler
                    </Button>

                    <Button
                        type="button"
                        variant={config.confirmClass}
                        size="medium"
                        onClick={handleConfirm}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator
                                size={14}
                                type="dots"
                                color="white"
                            />
                        ) : (
                            config.confirmLabel
                        )}
                    </Button>

                </div>

            </div>
        </Modal>
    );
}