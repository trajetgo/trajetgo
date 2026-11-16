import { useState } from "react";
import { Outlet } from "react-router-dom";

import Header from "../common/Header";

import "../styles/layouts/app.scss";

export default function AppLayout() {
    const [showUserModal, setShowUserModal] = useState(false);

    return (
        <div className="app-layout">

            <div className="app-layout__main">

                <Header onOpenUserMenu={() => setShowUserModal(true)} />

                <div className="app-layout__content">
                    <Outlet />
                </div>

            </div>

        </div>
    )
}
