
import {
    CalendarCheck,
    CreditCard,
    Bus,
    Ticket,
    UserRound,
    ShieldAlert,
    Info,
    Megaphone,
} from "lucide-react";

export const NOTIFICATION_CONFIG = {
    BOOKING: {
        icon: CalendarCheck,
        color: "#2563eb",
        bg: "#eff6ff",
    },
    PAYMENT: {
        icon: CreditCard,
        color: "#16a34a",
        bg: "#f0fdf4",
    },
    TRIP: {
        icon: Bus,
        color: "#9333ea",
        bg: "#faf5ff",
    },
    BOARDING: {
        icon: Ticket,
        color: "#0891b2",
        bg: "#ecfeff",
    },
    ACCOUNT: {
        icon: UserRound,
        color: "#64748b",
        bg: "#f8fafc",
    },
    SECURITY: {
        icon: ShieldAlert,
        color: "#dc2626",
        bg: "#fef2f2",
    },
    SYSTEM: {
        icon: Info,
        color: "#475569",
        bg: "#f1f5f9",
    },
    MARKETING: {
        icon: Megaphone,
        color: "#d97706",
        bg: "#fffbeb",
    },
};

export const DEFAULT_NOTIFICATION_CONFIG = {
    icon: Info,
    color: "#64748b",
    bg: "#f8fafc",
};

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

// Adaptateur de compatibilité entre l'ancien frontend
// et le nouveau modèle Notification Prisma.
export const mapNotification = (notification) => ({
    ...notification,
    category: notification.category || notification.type,
    message: notification.body || notification.message,
    isRead: notification.readAt
        ? true
        : Boolean(notification.isRead),
    data: {
        ...(notification.data || {}),
        url: notification.actionUrl || notification.data?.url,
    },
});
