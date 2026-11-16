import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { Outlet } from 'react-router-dom';
import { ChevronLeft, KeyRound, LogIn, MailCheck, Smartphone, UserPlus } from 'lucide-react';
import '../styles/layouts/auth.scss';

export default function AuthLayout() {
    const { pathname } = useLocation();

    const authPages = {
        "/auth/login": {
            action: {
                label: "Créer un compte",
                to: "/auth/register",
                icon: UserPlus,
            },
        },

        "/auth/register": {
            action: {
                label: "Se connecter",
                to: "/auth/login",
                icon: LogIn,
            },
        },

        "/auth/forgot-password": {
            action: {
                label: "Connexion",
                to: "/auth/login",
                icon: LogIn,
            },
        },

        "/auth/reset-password": {
            action: {
                label: "Connexion",
                to: "/auth/login",
                icon: KeyRound,
            },
        },

        "/auth/verify-email": {
            action: {
                label: "Connexion",
                to: "/auth/login",
                icon: MailCheck,
            },
        },

        "/auth/verify-phone": {
            action: {
                label: "Connexion",
                to: "/auth/login",
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
                    <Link to="/support/help">
                        Centre d'aide
                    </Link>

                    <Link to="/support/contact">
                        Contact
                    </Link>
                </nav>

                <nav className="auth-footer__legal">
                    <Link to="/legal/terms">
                        Conditions d'utilisation
                    </Link>

                    <Link to="/legal/privacy">
                        Politique de confidentialité
                    </Link>

                    <Link to="/legal/cookies">
                        Cookies
                    </Link>
                </nav>

                <p className="auth-footer__copyright">
                    © {new Date().getFullYear()} Trajet Go. Tous droits réservés.
                </p>
            </footer>
        </main>
    )
}