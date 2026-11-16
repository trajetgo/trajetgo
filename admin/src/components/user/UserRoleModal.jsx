import { useState, useEffect } from "react";
import {
    ShieldCheck,
    Building2,
    Bus,
    UserCog,
    AlertTriangle,
    Info,
} from "lucide-react";

import Modal from "@shared/components/ui/Modal";
import Button from "@shared/components/ui/Button";

import {
    getUserFullName,
    getUserRole,
} from "../../utils/user.utils";

import "../../styles/components/user/UserRoleModal.scss";

/* ------------------------------------------------------------------ */
/* Config des rôles                                                    */
/* ------------------------------------------------------------------ */

const ROLE_OPTIONS = [
    {
        value: "COMPANY_ADMIN",
        label: "Administrateur compagnie",
        description:
            "Accès complet à la gestion de la compagnie (bus, lignes, agences, personnel, rapports).",
        icon: ShieldCheck,
        variant: "primary",
    },
    {
        value: "AGENCY_AGENT",
        label: "Agent d'agence",
        description:
            "Gestion des ventes, réservations et opérations d'une agence spécifique.",
        icon: Building2,
        variant: "info",
    },
    {
        value: "CONTROLLER",
        label: "Contrôleur",
        description:
            "Validation des billets et contrôle d'embarquement à bord des bus.",
        icon: Bus,
        variant: "warning",
    },
];

/* ------------------------------------------------------------------ */
/* Avertissements selon la transition                                  */
/* ------------------------------------------------------------------ */

function getRoleChangeWarning(currentRole, targetRole) {
    /* ---------- Pas de changement ---------- */

    if (currentRole === targetRole) {
        return {
            variant: "info",
            icon: Info,
            message: "Aucun changement de rôle n'est effectué.",
        };
    }

    /* ---------- Promotion admin ---------- */

    if (targetRole === "COMPANY_ADMIN") {
        return {
            variant: "danger",
            icon: AlertTriangle,
            message:
                "Ce membre obtiendra un accès complet à la gestion de votre compagnie. Assurez-vous de lui faire confiance.",
        };
    }

    /* ---------- Rétrogradation depuis admin ---------- */

    if (currentRole === "COMPANY_ADMIN") {
        return {
            variant: "warning",
            icon: AlertTriangle,
            message:
                "Ce membre perdra son accès administrateur. Il conservera uniquement les droits de son nouveau rôle.",
        };
    }

    /* ---------- Changement vers contrôleur ---------- */

    if (targetRole === "CONTROLLER") {
        return {
            variant: "info",
            icon: Info,
            message:
                "Le membre pourra uniquement valider des billets. Aucune donnée sensible ne sera accessible.",
        };
    }

    /* ---------- Changement d'agence ---------- */

    if (targetRole === "AGENCY_AGENT") {
        return {
            variant: "info",
            icon: Info,
            message:
                "Le membre pourra gérer les ventes de son agence. Assurez-vous qu'une agence lui est bien assignée.",
        };
    }

    return null;
}

/* ------------------------------------------------------------------ */

export default function UserRoleModal({
    open,
    user,
    loading = false,
    onClose,
    onConfirm,
}) {
    /* ---------- État local ---------- */

    const [selectedRole, setSelectedRole] = useState(
        user?.role ?? "AGENCY_AGENT"
    );

    /* ---------- Sync avec le user ---------- */

    useEffect(() => {
        if (user?.role) {
            setSelectedRole(user.role);
        }
    }, [user?.id, user?.role]);

    /* ---------- Guard ---------- */

    if (!user) return null;

    /* ---------- Données dérivées ---------- */

    const fullName = getUserFullName(user);
    const currentRoleMeta = getUserRole(user.role);
    const hasChanged = selectedRole !== user.role;
    const warning = getRoleChangeWarning(user.role, selectedRole);

    /* ---------- Handlers ---------- */

    const handleSelect = (role) => {
        if (loading) return;
        setSelectedRole(role);
    };

    const handleConfirm = () => {
        if (loading || !hasChanged) return;
        onConfirm?.(selectedRole);
    };

    /* ---------- Rendu ---------- */

    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            title="Changer le rôle"
            size="md"
        >
            <div className="user-role-modal">
                {/* =====================================================
                    Rappel du membre
                ===================================================== */}

                <div className="user-role-modal__user">
                    <div className="user-role-modal__avatar">
                        {user.avatar ? (
                            <img src={user.avatar} alt={fullName} />
                        ) : (
                            <span>
                                {user.firstName?.charAt(0) ?? ""}
                                {user.lastName?.charAt(0) ?? ""}
                            </span>
                        )}
                    </div>

                    <div className="user-role-modal__user-info">
                        <strong>{fullName}</strong>
                        <span>
                            Rôle actuel :{" "}
                            <b>{currentRoleMeta.label}</b>
                        </span>
                    </div>
                </div>

                {/* =====================================================
                    Choix du rôle
                ===================================================== */}

                <div className="user-role-modal__section">
                    <h3 className="user-role-modal__section-title">
                        <UserCog size={14} aria-hidden="true" />
                        Nouveau rôle
                    </h3>

                    <ul
                        className="user-role-modal__options"
                        role="radiogroup"
                        aria-label="Choix du rôle"
                    >
                        {ROLE_OPTIONS.map((option) => {
                            const {
                                value,
                                label,
                                description,
                                icon: Icon,
                                variant,
                            } = option;

                            const isSelected = selectedRole === value;
                            const isCurrent = user.role === value;

                            return (
                                <li key={value}>
                                    <button
                                        type="button"
                                        role="radio"
                                        aria-checked={isSelected}
                                        className={`user-role-modal__option user-role-modal__option--${variant} ${
                                            isSelected
                                                ? "user-role-modal__option--selected"
                                                : ""
                                        }`}
                                        onClick={() => handleSelect(value)}
                                        disabled={loading}
                                    >
                                        <span className="user-role-modal__option-icon">
                                            <Icon size={20} />
                                        </span>

                                        <span className="user-role-modal__option-content">
                                            <span className="user-role-modal__option-header">
                                                <strong>{label}</strong>

                                                {isCurrent && (
                                                    <span className="user-role-modal__option-badge">
                                                        Actuel
                                                    </span>
                                                )}
                                            </span>

                                            <span className="user-role-modal__option-description">
                                                {description}
                                            </span>
                                        </span>

                                        <span
                                            className="user-role-modal__option-check"
                                            aria-hidden="true"
                                        >
                                            {isSelected && "✓"}
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* =====================================================
                    Avertissement
                ===================================================== */}

                {warning && (
                    <div
                        className={`user-role-modal__warning user-role-modal__warning--${warning.variant}`}
                        role="alert"
                    >
                        <warning.icon size={16} aria-hidden="true" />
                        <span>{warning.message}</span>
                    </div>
                )}

                {/* =====================================================
                    Actions
                ===================================================== */}

                <footer className="user-role-modal__actions">
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
                        variant="primary"
                        onClick={handleConfirm}
                        loading={loading}
                        disabled={loading || !hasChanged}
                    >
                        {hasChanged
                            ? "Confirmer le changement"
                            : "Aucun changement"}
                    </Button>
                </footer>
            </div>
        </Modal>
    );
}