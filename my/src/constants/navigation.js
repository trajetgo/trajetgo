
import {
    LayoutDashboard,
    Ticket,
    CalendarDays,
    ShieldCheck,
    User,
} from "lucide-react";

export const NAV_ITEMS = [
    {
        path: "/",
        label: "Aperçu",
        icon: LayoutDashboard,
        end: true
    },
    {
        path: "/bookings",
        label: "Mes réservations",
        icon: CalendarDays,
    },
    {
        path: "/tickets",
        label: "Mes billets",
        icon: Ticket,
    },
    {
        path: "/profile",
        label: "Mon profil",
        icon: User,
    },
    {
        path: "/security",
        label: "Sécurité",
        icon: ShieldCheck,
    },
];
