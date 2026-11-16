import { Link } from "react-router-dom";
import {
    Plane,
    Package,
    Search,
    CircleUser,
    PanelLeftClose,
    PanelLeftOpen,
    Menu,
    X,
} from "lucide-react";

// import trajetGo from "@shared/assets/logo.png";
import Avatar from "@shared/components/ui/Avatar";
import { useAuth } from "@shared/contexts/auth.context";
import { AUTH_URL } from "@shared/services/api";

import NotificationBell from "../components/notifications/NotificationBell";

import "../styles/common/Header.scss";

export default function Header({
    isCollapsed,
    isMobile,
    isMobileOpen,
    onToggleSidebar,
    onOpenUserMenu,
}) {
    const { isAuthenticated, user } = useAuth();

    // Choisir l'icône selon le contexte
    let ToggleIcon;
    let toggleLabel;

    if (isMobile) {
        ToggleIcon = isMobileOpen ? X : Menu;
        toggleLabel = isMobileOpen ? "Fermer le menu" : "Ouvrir le menu";
    } else {
        ToggleIcon = isCollapsed ? PanelLeftOpen : PanelLeftClose;
        toggleLabel = isCollapsed ? "Déployer le menu" : "Réduire le menu";
    }

    return (
        <header className="app-header">
            <div className="app-header__container">
                <button
                    type="button"
                    className="app-header__toggle"
                    onClick={onToggleSidebar}
                    aria-label={toggleLabel}
                    aria-expanded={isMobile ? isMobileOpen : !isCollapsed}
                >
                    <ToggleIcon size={20} />
                </button>

                {/* Brand */}
                <Link to="/" className="app-header__brand">
                    <span className="app-header__brand-name">Trajet</span>
                    <span className="app-header__brand-accent">Go</span>
                </Link>

                {/* Nav */}
                <nav className="app-header__nav" aria-label="Navigation principale">
                    <Link to="/trips" className="app-header__nav-link">
                        <Plane size={18} />
                        <span>Voyages</span>
                    </Link>

                    <Link to="/packages" className="app-header__nav-link">
                        <Package size={18} />
                        <span>Colis</span>
                    </Link>

                    <Link to="/search" className="app-header__nav-link">
                        <Search size={18} />
                        <span>Rechercher</span>
                    </Link>
                </nav>

                {/* Actions */}
                <div className="app-header__actions">
                    {isAuthenticated ? (
                        <>
                            <NotificationBell />
                            <Avatar
                                size="md"
                                src={user?.avatar}
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