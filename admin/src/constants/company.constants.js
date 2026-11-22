import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";

export const COMPANY_STATUS = {
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
};

export const formatStatus = (status) => {
    return (
        COMPANY_STATUS[status] || {
            class: "unknown",
            label: "Inconnu",
        }
    );
};