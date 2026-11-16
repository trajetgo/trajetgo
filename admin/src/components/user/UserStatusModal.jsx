import {
    Power,
    RotateCcw,
    Ban,
    AlertTriangle,
} from "lucide-react";

import Modal from "@shared/components/ui/Modal";
import Button from "@shared/components/ui/Button";

import {
    getUserFullName,
    getUserRole,
    getUserStatus,
} from "../../utils/user.utils";

import "../../styles/components/user/UserStatusModal.scss";

/* ------------------------------------------------------------------ */
/* Config des actions                                                  */
/* ------------------------------------------------------------------ */

const ACTION_CONFIG = {
    ACTIVATE: {
        title: "Réactiver ce membre",
        description:
            "Le membre pourra à nouveau se connecter et accéder à ses fonctionnalités.",
        targetStatus: "ACTIVE",
        variant: "primary",
        icon: RotateCcw,
        confirmLabel: "Réactiver",
    },

    DEACTIVATE: {
        title: "Désactiver ce membre",
        description:
            "Le membre ne pourra plus se connecter tant qu'il n'est pas réactivé. Ses données sont conservées.",
        targetStatus: "INACTIVE",
        variant: "warning",
        icon: Power,
        confirmLabel: "Désactiver",
    },

    SUSPEND: {
        title: "Suspendre ce membre",
        description:
            "Le compte sera suspendu immédiatement. Le membre perdra l'accès à toutes ses fonctionnalités jusqu'à réactivation par un administrateur.",
        targetStatus: "SUSPENDED",
        variant: "danger",
        icon: Ban,
        confirmLabel: "Suspendre",
    },
};

/* ------------------------------------------------------------------ */

export default function UserStatusModal({
    open,
    user,
    action,
    loading = false,
    onClose,
    onConfirm,
}) {
    /* ---------- Guard ---------- */

    if (!user) return null;

    const config = ACTION_CONFIG[action];

    if (!config) {
        console.warn(`[UserStatusModal] Action inconnue : ${action}`);
        return null;
    }

    const Icon = config.icon;
    const fullName = getUserFullName(user);
    const role = getUserRole(user.role);
    const currentStatus = getUserStatus(user.status);

    /* ---------- Handlers ---------- */

    const handleConfirm = () => {
        if (loading) return;
        onConfirm?.(config.targetStatus);
    };

    /* ---------- Rendu ---------- */

    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            title={config.title}
            size="sm"
        >
            <div
                className={`user-status-modal user-status-modal--${config.variant}`}
            >
                {/* ---------- Icône ---------- */}

                <div className="user-status-modal__icon">
                    <Icon size={28} aria-hidden="true" />
                </div>

                {/* ---------- Description ---------- */}

                <p className="user-status-modal__description">
                    {config.description}
                </p>

                {/* ---------- Rappel du membre ---------- */}

                <div className="user-status-modal__user">
                    <div className="user-status-modal__avatar">
                        {user.avatar ? (
                            <img src={user.avatar} alt={fullName} />
                        ) : (
                            <span>
                                {user.firstName?.charAt(0) ?? ""}
                                {user.lastName?.charAt(0) ?? ""}
                            </span>
                        )}
                    </div>

                    <div className="user-status-modal__user-info">
                        <strong>{fullName}</strong>
                        <span>{role.label}</span>
                    </div>

                    <span
                        className={`user-status-modal__current-status user-status-modal__current-status--${currentStatus.className}`}
                    >
                        {currentStatus.label}
                    </span>
                </div>

                {/* ---------- Avertissement (danger) ---------- */}

                {config.variant === "danger" && (
                    <div className="user-status-modal__warning" role="alert">
                        <AlertTriangle size={16} aria-hidden="true" />
                        <span>
                            Cette action est réversible, mais le membre
                            sera immédiatement déconnecté.
                        </span>
                    </div>
                )}

                {/* ---------- Actions ---------- */}

                <footer className="user-status-modal__actions">
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
                        onClick={handleConfirm}
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