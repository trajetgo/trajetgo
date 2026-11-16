import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";

import UserMenuModal from "@shared/components/user/UserMenuModal";
import useMediaQuery from "@shared/hooks/useMediaQuery";

import Header from "../common/Header";
import Sidebar from "../common/Sidebar";
import Footer from "../common/Footer";

import "../styles/layouts/app.scss";

export default function AppLayout() {
    const isMobile = useMediaQuery("(max-width: 900px)");
    const location = useLocation();

    // 🖥️ Desktop : collapsed ou non
    const [isCollapsed, setIsCollapsed] = useState(false);

    // 📱 Mobile : drawer ouvert ou fermé
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const [showUserModal, setShowUserModal] = useState(false);

    /** Toggle qui s'adapte au contexte */
    const toggleSidebar = () => {
        if (isMobile) {
            setIsMobileOpen((v) => !v);
        } else {
            setIsCollapsed((v) => !v);
        }
    };

    const closeMobileSidebar = () => setIsMobileOpen(false);

    // 🔄 Fermer le drawer mobile à chaque changement de route
    useEffect(() => {
        if (isMobile) closeMobileSidebar();
    }, [location.pathname, isMobile]);

    // 🔄 Si on passe de mobile → desktop, s'assurer que l'overlay est fermé
    useEffect(() => {
        if (!isMobile) setIsMobileOpen(false);
    }, [isMobile]);

    // 🔒 Bloquer le scroll du body quand le drawer mobile est ouvert
    useEffect(() => {
        if (isMobile && isMobileOpen) {
            const original = document.body.style.overflow;
            document.body.style.overflow = "hidden";
            return () => {
                document.body.style.overflow = original;
            };
        }
    }, [isMobile, isMobileOpen]);

    // ⌨️ Fermer avec Escape en mobile
    useEffect(() => {
        if (!isMobile || !isMobileOpen) return;

        const onKey = (e) => {
            if (e.key === "Escape") closeMobileSidebar();
        };

        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isMobile, isMobileOpen]);

    return (
        <div
            className={[
                "app-layout",
                isCollapsed ? "app-layout--collapsed" : "",
                isMobileOpen ? "app-layout--mobile-open" : "",
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {/* Overlay mobile */}
            {isMobile && isMobileOpen && (
                <div
                    className="app-layout__overlay"
                    onClick={closeMobileSidebar}
                    aria-hidden="true"
                />
            )}

            <Sidebar
                isCollapsed={!isMobile && isCollapsed}
                isMobile={isMobile}
                isMobileOpen={isMobileOpen}
                onClose={closeMobileSidebar}
            />

            <div className="app-layout__main">
                <Header
                    isCollapsed={isCollapsed}
                    isMobile={isMobile}
                    isMobileOpen={isMobileOpen}
                    onToggleSidebar={toggleSidebar}
                    onOpenUserMenu={() => setShowUserModal(true)}
                />

                <div className="app-layout__content">
                    <Outlet />
                </div>

                <Footer />
            </div>

            <UserMenuModal
                open={showUserModal}
                onClose={() => setShowUserModal(false)}
                onLogout={() => { }}
            />
        </div>
    );
}