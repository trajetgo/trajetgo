import { useState } from "react";
import { Outlet } from "react-router-dom";

import { useAuth } from "@shared/contexts/auth.context";
import { useToast } from "@shared/contexts/toast.context";
import UserMenuModal from "@shared/components/user/UserMenuModal";
import Confirm from "@shared/components/feedback/Confirm";

import AppFooter from "../common/AppFooter";
import AppHeader from "../common/AppHeader";

import service from "../services/auth.service";

import "../styles/layouts/app.scss";

export default function AppLayout() {
    const { showToast } = useToast();
    const { refreshUser } = useAuth();

    const [showUserModal, setShowUserModal] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleLogout = async () => {
        try {
            await service.logout();
            showToast("success", "Vous avez été déconnecté avec succès.");
            refreshUser();
            setShowConfirm(false);
        } catch (error) {
            showToast("error", "Une erreur est survenue lors de la déconnexion.");
        }
    }

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
                onLogout={() => setShowConfirm(true)}
            />

            <Confirm
                open={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={handleLogout}
                title="Déconnexion"
                message="Êtes-vous sûr de vouloir vous déconnecter ?"
                confirmLabel="Se déconnecter"
                cancelLabel="Annuler"
            />

        </div>
    );
}