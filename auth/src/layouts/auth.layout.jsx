import { Link, useLocation } from "react-router-dom";
import { Outlet } from 'react-router-dom';
import {
    ChevronLeft,
    KeyRound,
    LogIn,
    MailCheck,
    Smartphone,
    UserPlus
} from 'lucide-react';

import { POLICY_URL, SUPPORT_URL } from "@shared/services/api";
import { APP_CONFIG } from "@shared/config/app.config";
import { getCopyrightYears } from "@shared/utils/copyright.utils";

import '../styles/layouts/auth.scss';

export default function AuthLayout() {
    const { pathname } = useLocation();

    const authPages = {
        "/login": {
            action: {
                label: "Créer un compte",
                to: "/register",
                icon: UserPlus,
            },
        },

        "/register": {
            action: {
                label: "Se connecter",
                to: "/login",
                icon: LogIn,
            },
        },

        "/forgot-password": {
            action: {
                label: "Connexion",
                to: "/login",
                icon: LogIn,
            },
        },

        "/reset-password": {
            action: {
                label: "Connexion",
                to: "/login",
                icon: KeyRound,
            },
        },

        "/verify-email": {
            action: {
                label: "Connexion",
                to: "/login",
                icon: MailCheck,
            },
        },

        "/verify-phone": {
            action: {
                label: "Connexion",
                to: "/login",
                icon: Smartphone,
            },
        },
    };

    const currentPage = authPages[pathname];
    const ActionIcon = currentPage?.action?.icon;

    return (

        <main className="auth-layout">
            <header className="auth-header">
                <div className="auth-header__left">
                    <Link
                        to="/"
                        className="auth-header__action"
                    >
                        <ChevronLeft size={18} />
                        <span>Accueil</span>
                    </Link>
                </div>

                <div className="auth-header__right">
                    {currentPage && (
                        <Link
                            to={currentPage.action.to}
                            className="auth-header__action"
                        >
                            <ActionIcon size={18} />
                            <span>{currentPage.action.label}</span>
                        </Link>
                    )}
                </div>
            </header>

            <Outlet />

            <footer className="auth-footer">
                <nav className="login-footer__links">
                    <Link to={`${SUPPORT_URL}/help-center`}>
                        Centre d'aide
                    </Link>

                    <Link to={`${SUPPORT_URL}/contact`}>
                        Contact
                    </Link>
                </nav>

                <nav className="auth-footer__legal">
                    <Link to={`${POLICY_URL}/terms/passengers`}>
                        Conditions d'utilisation
                    </Link>

                    <Link to={`${POLICY_URL}/privacy`}>
                        Politique de confidentialité
                    </Link>

                    <Link to={`${POLICY_URL}/cookies`}>
                        Cookies
                    </Link>
                </nav>

                <p className="auth-footer__copyright">
                    © {getCopyrightYears()} {APP_CONFIG.name}. Tous droits réservés.
                </p>
            </footer>
        </main>
    )
}