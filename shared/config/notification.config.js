
export const NOTIFICATION_APPLICATIONS = {
    PASSENGER: "PASSENGER",
    COMPANY: "COMPANY",
    AGENCY: "AGENCY",
    CONTROLLER: "CONTROLLER",
    ADMIN: "ADMIN",
};

export const getNotificationApplication = (application) => {
    const value = NOTIFICATION_APPLICATIONS[application];

    if (!value) {
        throw new Error(
            `Application de notification inconnue : ${application}`
        );
    }

    return value;
};
