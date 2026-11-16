import { X } from "lucide-react";
import { NavLink } from "react-router-dom";

import trajetGo from "@shared/assets/logo.png";
import { useAuth } from "@shared/contexts/auth.context";
import Avatar from "@shared/components/ui/Avatar";

import { NAV_ITEMS } from "../utils/nav.utils";

import "../styles/common/Sidebar.scss";

export default function Sidebar({
    isMobile = false,
    isMobileOpen = false,
    onClose,
}) {
    const { user } = useAuth();

    const classes = [
        "sidebar",
        isMobile ? "sidebar--mobile" : "",
        isMobile && isMobileOpen ? "sidebar--open" : "",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <aside
            className={classes}
            aria-label="Navigation latérale"
            aria-hidden={isMobile && !isMobileOpen}
        >
            {isMobile && (
                <button
                    type="button"
                    className="sidebar__close"
                    onClick={onClose}
                    aria-label="Fermer le menu"
                >
                    <X size={20} />
                </button>
            )}

            <div className="sidebar__brand">
                <img
                    src={trajetGo}
                    alt="Trajet Go"
                    className="sidebar__brand-mark"
                />

                <div className="sidebar__brand-content">
                    <strong>Trajet Go</strong>
                    <span>Administration</span>
                </div>
            </div>

            <nav className="sidebar__nav">
                <p className="sidebar__section-title">
                    Navigation
                </p>

                <div className="sidebar__menu">
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === "/"}
                                title={item.label}
                                className={({ isActive }) =>
                                    `sidebar__link ${isActive ? "sidebar__link--active" : ""
                                    }`
                                }
                            >
                                <Icon size={19} />
                                <span>{item.label}</span>
                            </NavLink>
                        );
                    })}
                </div>
            </nav>

            <div className="sidebar__footer">
                <div className="sidebar__company">
                    <Avatar
                        name={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`}
                        size="sm"
                        src={user?.avatar}
                    />

                    <div>
                        <strong>
                            {user?.firstName} {user?.lastName}
                        </strong>
                        <span>Compte Admin</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}