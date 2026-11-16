import {
    Bell,
    CalendarCheck,
    CalendarX,
    CircleDollarSign,
    CreditCard,
    MessageCircle,
    Package,
    Plane,
    ShieldAlert,
    ShieldCheck,
    TriangleAlert,
} from "lucide-react";

export const TYPE_CONFIG = {
    // ─────────────────────────────────────
    // Réservations
    // ─────────────────────────────────────
    BOOKING_CREATED: {
        icon: Package,
        color: "#185FA5",
        bg: "#E6F1FB",
    },

    BOOKING_ARRIVED: {
        icon: Package,
        color: "#185FA5",
        bg: "#E6F1FB",
    },

    BOOKING_PAID: {
        icon: CreditCard,
        color: "#1D9E75",
        bg: "#E1F5EE",
    },

    BOOKING_CONFIRMED: {
        icon: CalendarCheck,
        color: "#1D9E75",
        bg: "#E1F5EE",
    },

    BOOKING_CANCELLED: {
        icon: CalendarX,
        color: "#A32D2D",
        bg: "#FCEBEB",
    },

    // ─────────────────────────────────────
    // Paiements
    // ─────────────────────────────────────
    PAYMENT_SUCCESS: {
        icon: CircleDollarSign,
        color: "#1D9E75",
        bg: "#E1F5EE",
    },

    PAYMENT_FAILED: {
        icon: TriangleAlert,
        color: "#A32D2D",
        bg: "#FCEBEB",
    },

    PAYMENT_REFUNDED: {
        icon: ShieldAlert,
        color: "#BA7517",
        bg: "#FAEEDA",
    },

    // ─────────────────────────────────────
    // Voyages
    // ─────────────────────────────────────
    TRIP_PUBLISHED: {
        icon: Plane,
        color: "#185FA5",
        bg: "#E6F1FB",
    },

    TRIP_SUSPENDED: {
        icon: TriangleAlert,
        color: "#BA7517",
        bg: "#FAEEDA",
    },

    // ─────────────────────────────────────
    // Litiges
    // ─────────────────────────────────────
    DISPUTE_OPENED: {
        icon: ShieldAlert,
        color: "#BA7517",
        bg: "#FAEEDA",
    },

    DISPUTE_RESOLVED: {
        icon: ShieldCheck,
        color: "#1D9E75",
        bg: "#E1F5EE",
    },

    // Messages
    MESSAGE_SENT: {
        icon: MessageCircle,
        color: " #8b9dc3",
        bg: "#E1F5EE",
    },

    // ─────────────────────────────────────
    // Système
    // ─────────────────────────────────────
    SYSTEM: {
        icon: Bell,
        color: "#5F5E5A",
        bg: "#F1EFE8",
    },
};

// Fallback si le type n'est pas reconnu
export const DEFAULT_NOTIFICATION_CONFIG = TYPE_CONFIG.SYSTEM;