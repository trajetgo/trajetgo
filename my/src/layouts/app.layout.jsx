import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Header from "../common/Header";
import Sidebar from "../common/Sidebar";
import Footer from "../common/Footer";

import UserMenuModal from "@shared/components/user/UserMenuModal";
import useMediaQuery from "@shared/hooks/useMediaQuery";

import "../styles/layouts/app.scss";

export default function AppLayout() {
    const isMobile = useMediaQuery("(max-width: 900px)");
    const location = useLocation();

    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [showUserModal, setShowUserModal] = useState(false);

    const toggleSidebar = () => {
        setIsMobileOpen((previous) => !previous);
    };

    const closeMobileSidebar = () => {
        setIsMobileOpen(false);
    };

    // Fermer le drawer à chaque changement de route
    useEffect(() => {
        setIsMobileOpen(false);
    }, [location.pathname]);

    // Fermer le drawer lorsqu'on passe en desktop
    useEffect(() => {
        if (!isMobile) {
            setIsMobileOpen(false);
        }
    }, [isMobile]);

    // Bloquer le scroll lorsque le drawer est ouvert
    useEffect(() => {
        if (!isMobile || !isMobileOpen) return;

        const originalOverflow = document.body.style.overflow;

        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [isMobile, isMobileOpen]);

    // Fermer avec Escape
    useEffect(() => {
        if (!isMobile || !isMobileOpen) return;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                closeMobileSidebar();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isMobile, isMobileOpen]);

    return (
        <div
            className={[
                "app-layout",
                isMobileOpen ? "app-layout--mobile-open" : "",
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {isMobile && isMobileOpen && (
                <div
                    className="app-layout__overlay"
                    onClick={closeMobileSidebar}
                    aria-hidden="true"
                />
            )}

            <Sidebar
                isMobile={isMobile}
                isMobileOpen={isMobileOpen}
                onClose={closeMobileSidebar}
            />

            <div className="app-layout__main">
                <Header
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
                onLogout={() => {}}
            />
        </div>
    );
}
