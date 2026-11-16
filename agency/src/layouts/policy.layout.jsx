import React from "react";
import { Outlet, Link, NavLink } from "react-router-dom";
import logo from '../assets/logo.png';
import "../styles/layouts/policy.scss";

export default function PolicyLayout() {

    return (
        <main className="legal-layout">

            <header className="legal-layout__header">

                <Link
                    to="/"
                    className="legal-layout__logo"
                >
                    <img src={logo} alt={logo} />

                    <div className="legal-layout__brand">
                        <span id="kilo" className="kilo">Trajet</span>
                        <span id="go" className="go">Go</span>
                    </div>
                </Link>

                <nav className="legal-layout__nav">

                    <NavLink
                        to="/legal/terms"
                        className={({ isActive }) => isActive ? "active" : ""}
                    >
                        Conditions
                    </NavLink>

                    <NavLink
                        to="/legal/privacy"
                        className={({ isActive }) => isActive ? "active" : ""}
                    >
                        Confidentialité
                    </NavLink>

                    <NavLink
                        to="/legal/cookies"
                        className={({ isActive }) => isActive ? "active" : ""}
                    >
                        Cookies
                    </NavLink>

                    <NavLink
                        to="/legal/refunds"
                        className={({ isActive }) => isActive ? "active" : ""}
                    >
                        Remboursements
                    </NavLink>

                </nav>

            </header>

            <Outlet />

            <footer className="legal-layout__footer">

                <p>
                    © {new Date().getFullYear()} Kilo Go
                </p>

                <nav>

                    <Link to="/">
                        Accueil
                    </Link>

                    <Link to="/support/contact">
                        Contact
                    </Link>

                    <Link to="/support/help-center">
                        Centre d'aide
                    </Link>

                </nav>

            </footer>

        </main>
    );
}