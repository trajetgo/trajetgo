import {
    Armchair, BarChart3, Home,
    Settings, Ticket, Users, BusFront,
} from "lucide-react";
import { NavLink } from "react-router-dom";

import { useAuth } from "@shared/contexts/auth.context";
import trajetGo from "@shared/assets/logo.png";
import Avatar from "@shared/components/ui/Avatar";

import "../styles/common/Sidebar.scss";

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
    // {
    //     path: "/agencies",
    //     label: "Agences",
    //     icon: Building2,
    // },
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

export default function Sidebar({
    isCollapsed = false,
    isMobile = false,
    isMobileOpen = false,
    onClose,
}) {
    const {user} = useAuth();

    /**
    * En mobile, `isCollapsed` est forcé à false :
    * le drawer affiche toujours les libellés.
    */
    const collapsed = !isMobile && isCollapsed;

    const classes = [
        "sidebar",
        collapsed ? "sidebar--collapsed" : "",
        isMobile ? "sidebar--mobile" : "",
        isMobile && isMobileOpen ? "sidebar--open" : "",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <>
            <aside
                className={classes}
                aria-label="Navigation latérale"
                aria-hidden={isMobile && !isMobileOpen}
            >
                {/* Bouton fermer visible uniquement en mobile */}
                {isMobile && (
                    <button
                        type="button"
                        className="sidebar__close"
                        onClick={onClose}
                        aria-label="Fermer le menu"
                    >
                        {/* icône X */}
                        <svg width="20" height="20" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor"
                            strokeWidth="2" strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                )}

                <div className="sidebar__brand">
                    <img
                        src={trajetGo}
                        alt="Trajet Go"
                        className="sidebar__brand-mark"
                    />

                    {!isCollapsed && (
                        <div className="sidebar__brand-content">
                            <strong>Trajet Go</strong>
                            <span>Administration</span>
                        </div>
                    )}
                </div>

                <nav className="sidebar__nav">
                    {!isCollapsed && (
                        <p className="sidebar__section-title">Gestion</p>
                    )}

                    <div className="sidebar__menu">
                        {navItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    end={item.path === "/"}
                                    title={isCollapsed ? item.label : undefined}
                                    className={({ isActive }) =>
                                        `sidebar__link ${isActive ? "sidebar__link--active" : ""
                                        }`
                                    }
                                >
                                    <Icon size={19} />
                                    {!isCollapsed && <span>{item.label}</span>}
                                </NavLink>
                            );
                        })}
                    </div>
                </nav>

                <div className="sidebar__footer">
                    <div className="sidebar__company">
                        <Avatar
                            src={user.company?.logo}
                            name={user.company?.name}
                            size="sm"
                            className="sidebar__company-avatar"
                        />
                        {!isCollapsed && (
                            <div>
                                <strong>{user.agency?.name}</strong>
                                <span>Compte Agence</span>
                            </div>
                        )}
                    </div>
                </div>
            </aside>
        </>
    );
}