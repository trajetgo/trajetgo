import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";

export const AGENCY_STATUS = {
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
    CLOSED: {
        class: "closed",
        label: "Fermé",
        icon: XCircle
    },
};

export const formatStatus = (status) => {
    return (
        AGENCY_STATUS[status] || {
            class: "unknown",
            label: "Inconnu",
        }
    );
};