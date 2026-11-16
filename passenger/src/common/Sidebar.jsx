import {
    Armchair,
    BarChart3,
    Building2,
    Home,
    Settings,
    Ticket,
    Users,
    BusFront,
} from "lucide-react";
import "../styles/common/Sidebar.scss";

import { NavLink } from "react-router-dom";

const navItems = [
    {
        path: "/",
        label: "Tableau de bord",
        icon: Home,
    },
    {
        path: "/ticketing",
        label: "Billetterie",
        icon: Ticket,
    },
    {
        path: "/trips",
        label: "Voyages",
        icon: BusFront,
    },
    {
        path: "/buses",
        label: "Bus & Sièges",
        icon: Armchair,
    },
    {
        path: "/agencies",
        label: "Agences",
        icon: Building2,
    },
    {
        path: "/teams",
        label: "Équipes",
        icon: Users,
    },
    {
        path: "/reports",
        label: "Rapports",
        icon: BarChart3,
    },
    {
        path: "/settings",
        label: "Paramètres",
        icon: Settings,
    },
];

export default function Sidebar({ isToggled }) {
    return (
        <aside
            className={`sidebar ${isToggled
                ? "sidebar--collapsed"
                : ""
                }`}
        >
            {/* Logo / identité */}
            <div className="sidebar__brand">
                <div className="sidebar__brand-mark">
                    TG
                </div>

                {!isToggled && (
                    <div className="sidebar__brand-content">
                        <strong>Trajet Go</strong>
                        <span>Administration</span>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="sidebar__nav">
                {!isToggled && (
                    <p className="sidebar__section-title">
                        Gestion
                    </p>
                )}

                <div className="sidebar__menu">
                    {navItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === "/"}
                                title={isToggled ? item.label : undefined}
                                className={({ isActive }) =>
                                    `sidebar__link ${isActive
                                        ? "sidebar__link--active"
                                        : ""
                                    }`
                                }
                            >
                                <Icon size={19} />

                                {!isToggled && (
                                    <span>
                                        {item.label}
                                    </span>
                                )}
                            </NavLink>
                        );
                    })}
                </div>
            </nav>

            {/* Footer sidebar */}
            <div className="sidebar__footer">

                <div className="sidebar__company">

                    <div className="sidebar__company-avatar">
                        U
                    </div>

                    {!isToggled && (
                        <div>
                            <strong>UTB</strong>
                            <span>Compte compagnie</span>
                        </div>
                    )}

                </div>

            </div>
        </aside>
    );
}