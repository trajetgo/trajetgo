import { Link, NavLink } from "react-router-dom";
import { CircleUser, Menu, X } from "lucide-react";

import trajetGo from "@shared/assets/logo.png";
import Avatar from "@shared/components/ui/Avatar";
import { useAuth } from "@shared/contexts/auth.context";
import { AUTH_URL } from "@shared/services/api";

import NotificationBell from "../components/notifications/NotificationBell";
import { NAV_ITEMS } from "../constants/navigation";

import "../styles/common/Header.scss";

export default function Header({
    isMobile,
    isMobileOpen,
    onToggleSidebar,
    onOpenUserMenu,
}) {
    const { isAuthenticated, user } = useAuth();

    return (
        <header className="app-header">
            <div className="app-header__container">

                {isMobile && (
                    <button
                        type="button"
                        className="app-header__toggle"
                        onClick={onToggleSidebar}
                        aria-label={
                            isMobileOpen ? "Fermer le menu" : "Ouvrir le menu"
                        }
                        aria-expanded={isMobileOpen}
                    >
                        {isMobileOpen ? (
                            <X size={20} />
                        ) : (
                            <Menu size={20} />
                        )}
                    </button>
                )}

                <Link to="/" className="app-header__brand">
                    <img
                        className="app-header__brand-image"
                        src={trajetGo}
                        alt="Trajet Go"
                    />
                    {/* <span className="app-header__brand-name">Trajet</span> */}
                    {/* <span className="app-header__brand-accent">Go</span> */}
                </Link>

                <nav
                    className="app-header__nav"
                    aria-label="Navigation principale"
                >
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
                                <span> {item.label} </span>
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="app-header__actions">
                    {isAuthenticated ? (
                        <>
                            <NotificationBell />

                            <Avatar
                                size="md"
                                status="busy"
                                shape="circle"
                                src={user?.avatarUrl}
                                name={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`}
                                onClick={onOpenUserMenu}
                            />
                        </>
                    ) : (
                        <a
                            href={`${AUTH_URL}/login?utm_source=${window.location.origin}`}
                            className="app-header__login"
                        >
                            <CircleUser size={20} />
                            <span>Connexion</span>
                        </a>
                    )}
                </div>
            </div>
        </header>
    );
}