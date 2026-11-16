/* =========================================================
   RÔLES
   ========================================================= */

export const USER_ROLE = {
    SUPER_ADMIN: {
        value: "SUPER_ADMIN",
        label: "Super administrateur",
        shortLabel: "Super Admin",
        className: "super-admin",
    },
    COMPANY_ADMIN: {
        value: "COMPANY_ADMIN",
        label: "Administrateur compagnie",
        shortLabel: "Admin Co.",
        className: "company-admin",
    },
    AGENCY_AGENT: {
        value: "AGENCY_AGENT",
        label: "Agent d'agence",
        shortLabel: "Agent",
        className: "agency-agent",
    },
    CONTROLLER: {
        value: "CONTROLLER",
        label: "Contrôleur",
        shortLabel: "Contrôleur",
        className: "controller",
    },
};

export const USER_ROLE_FILTERS = [
    { value: "ALL", label: "Tous les rôles" },
    { value: "COMPANY_ADMIN", label: "Admins compagnie" },
    { value: "AGENCY_AGENT", label: "Agents d'agence" },
    { value: "CONTROLLER", label: "Contrôleurs" },
];

/* =========================================================
   STATUTS
   ========================================================= */

export const USER_STATUS = {
    ACTIVE: {
        value: "ACTIVE",
        label: "Actif",
        shortLabel: "Actif",
        className: "active",
    },
    INACTIVE: {
        value: "INACTIVE",
        label: "Inactif",
        shortLabel: "Inactif",
        className: "inactive",
    },
    SUSPENDED: {
        value: "SUSPENDED",
        label: "Suspendu",
        shortLabel: "Suspendu",
        className: "suspended",
    },
    INVITED: {
        value: "INVITED",
        label: "Invité",
        shortLabel: "Invité",
        className: "invited",
    },
};

export const USER_STATUS_FILTERS = [
    { value: "ALL", label: "Tous les statuts" },
    { value: "ACTIVE", label: "Actifs" },
    { value: "INACTIVE", label: "Inactifs" },
    { value: "SUSPENDED", label: "Suspendus" },
    { value: "INVITED", label: "Invités" },
];

/* =========================================================
   HELPERS
   ========================================================= */

export function getUserRole(role) {
    return (
        USER_ROLE[role] ?? {
            value: role,
            label: role,
            shortLabel: role,
            className: "unknown",
        }
    );
}

export function getUserStatus(status) {
    return (
        USER_STATUS[status] ?? {
            value: status,
            label: status,
            shortLabel: status,
            className: "unknown",
        }
    );
}

export function getUserFullName(user) {
    if (!user) return "—";
    return `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "—";
}

/* =========================================================
   TRANSITIONS AUTORISÉES
   ========================================================= */

export function getAllowedUserTransitions(currentStatus) {
    switch (currentStatus) {
        case "ACTIVE":
            return ["INACTIVE", "SUSPENDED"];
        case "INACTIVE":
            return ["ACTIVE", "SUSPENDED"];
        case "SUSPENDED":
            return ["ACTIVE"];
        case "INVITED":
            return ["ACTIVE", "INACTIVE"];
        default:
            return [];
    }
}