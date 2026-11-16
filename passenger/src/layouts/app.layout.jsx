import { useState } from "react";
import { Outlet } from "react-router-dom";

import UserMenuModal from "@shared/components/user/UserMenuModal";
import AppFooter from "../common/AppFooter";
import AppHeader from "../common/AppHeader";

import "../styles/layouts/app.scss";

export default function AppLayout() {
    const [showUserModal, setShowUserModal] = useState(false);

    return (
        <div
            className={`app-layout`}
        >


            <div className="app-layout__main">

                <AppHeader
                    onOpenModal={() => setShowUserModal(true)}
                />

                <main className="app-layout__content">
                    <Outlet />
                </main>

                <AppFooter />

            </div>

            <UserMenuModal
                open={showUserModal}
                onClose={() => setShowUserModal(false)}
                onLogout={() => { }}
            />

        </div>
    );
}