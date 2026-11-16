
const NotificationCategory = {
    BOOKING: "BOOKING",
    PAYMENT: "PAYMENT",
    TRIP: "TRIP",
    BOARDING: "BOARDING",
    ACCOUNT: "ACCOUNT",
    SECURITY: "SECURITY",
    SYSTEM: "SYSTEM",
    MARKETING: "MARKETING",
};

const NotificationChannel = {
    IN_APP: "IN_APP",
    PUSH: "PUSH",
    SMS: "SMS",
    EMAIL: "EMAIL",
};

const NotificationPriority = {
    LOW: "LOW",
    NORMAL: "NORMAL",
    HIGH: "HIGH",
    URGENT: "URGENT",
};

const NOTIFICATION_POLICIES = Object.freeze({
    // BOOKING
    BOOKING_CREATED: {
        category: NotificationCategory.BOOKING,
        channels: [
            NotificationChannel.IN_APP,
            NotificationChannel.PUSH,
            NotificationChannel.SMS,
        ],
        priority: NotificationPriority.NORMAL,
    },

    BOOKING_CONFIRMED: {
        category: NotificationCategory.BOOKING,
        channels: [
            NotificationChannel.IN_APP,
            NotificationChannel.PUSH,
            NotificationChannel.SMS,
            NotificationChannel.EMAIL,
        ],
        priority: NotificationPriority.HIGH,
    },

    BOOKING_CANCELLED: {
        category: NotificationCategory.BOOKING,
        channels: [
            NotificationChannel.IN_APP,
            NotificationChannel.PUSH,
            NotificationChannel.SMS,
        ],
        priority: NotificationPriority.HIGH,
    },

    // PAYMENT
    PAYMENT_SUCCESS: {
        category: NotificationCategory.PAYMENT,
        channels: [
            NotificationChannel.IN_APP,
            NotificationChannel.PUSH,
            NotificationChannel.SMS,
            NotificationChannel.EMAIL,
        ],
        priority: NotificationPriority.HIGH,
    },

    PAYMENT_FAILED: {
        category: NotificationCategory.PAYMENT,
        channels: [
            NotificationChannel.IN_APP,
            NotificationChannel.PUSH,
        ],
        priority: NotificationPriority.HIGH,
    },

    // TRIP
    TRIP_UPDATED: {
        category: NotificationCategory.TRIP,
        channels: [
            NotificationChannel.IN_APP,
            NotificationChannel.PUSH,
            NotificationChannel.SMS,
        ],
        priority: NotificationPriority.NORMAL,
    },

    TRIP_CANCELLED: {
        category: NotificationCategory.TRIP,
        channels: [
            NotificationChannel.IN_APP,
            NotificationChannel.PUSH,
            NotificationChannel.SMS,
            NotificationChannel.EMAIL,
        ],
        priority: NotificationPriority.URGENT,
    },

    // BOARDING
    BOARDING_OPENED: {
        category: NotificationCategory.BOARDING,
        channels: [
            NotificationChannel.IN_APP,
            NotificationChannel.PUSH,
        ],
        priority: NotificationPriority.NORMAL,
    },

    BOARDING_CONFIRMED: {
        category: NotificationCategory.BOARDING,
        channels: [
            NotificationChannel.IN_APP,
            NotificationChannel.PUSH,
        ],
        priority: NotificationPriority.NORMAL,
    },

    // ACCOUNT
    ACCOUNT_UPDATED: {
        category: NotificationCategory.ACCOUNT,
        channels: [
            NotificationChannel.IN_APP,
            NotificationChannel.PUSH,
            NotificationChannel.EMAIL,
        ],
        priority: NotificationPriority.NORMAL,
    },

    // SECURITY
    SECURITY_LOGIN_ALERT: {
        category: NotificationCategory.SECURITY,
        channels: [
            NotificationChannel.IN_APP,
            NotificationChannel.PUSH,
            NotificationChannel.SMS,
            NotificationChannel.EMAIL,
        ],
        priority: NotificationPriority.HIGH,
    },

    // SYSTEM
    SYSTEM_ANNOUNCEMENT: {
        category: NotificationCategory.SYSTEM,
        channels: [
            NotificationChannel.IN_APP,
            NotificationChannel.PUSH,
        ],
        priority: NotificationPriority.NORMAL,
    },
});

const getNotificationPolicy = (eventKey) => {
    const policy = NOTIFICATION_POLICIES[eventKey];

    if (!policy) {
        throw new Error(
            `Aucune politique de notification définie pour : ${eventKey}`
        );
    }

    return policy;
};

module.exports = {
    NotificationCategory,
    NotificationChannel,
    NotificationPriority,
    NOTIFICATION_POLICIES,
    getNotificationPolicy,
};
