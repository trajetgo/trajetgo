import { AlertCircle, CheckCircle2, CircleFadingPlus, XCircle } from "lucide-react";

export const TEAM_STATUS = {
    ACTIVE: {
        class: "active",
        label: "Actif",
        icon: CheckCircle2
    },
    INACTIVE: {
        class: "inactive",
        label: "Inactif",
        icon: AlertCircle
    },
    SUSPENDED: {
        class: "suspended",
        label: "Suspendu",
        icon: XCircle
    },
    INVITED: {
        class: "invited",
        label: "Invité",
        icon: CircleFadingPlus
    },
};

export const TEAM_ROLES = {
    COMPANY_ADMIN: {
        label: "Administrateur",
        class: "admin",
        icon: ""
    },
    AGENCY_AGENT: {
        label: "Chef de gare",
        class: "agent",
        icon: ""
    },
    CONTROLLER: {
        label: "Contrôleur",
        class: "controller",
        icon: "",
    },
}

export const formatStatus = (status) => {
    return (
        TEAM_STATUS[status] || {
            class: "unknown",
            label: "Inconnu",
        }
    );
};

export const formatRole = (role) => {
    return (
        TEAM_ROLES[role] || {
            label: "Inconnu",
            class: "unknown",
        }
    )
}