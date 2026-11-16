import { Outlet, Link, NavLink } from "react-router-dom";
import logo from '../assets/logo.png';
import "../styles/layouts/support.scss";

export default function SupportLayout() {

    return (
        <main className="support-layout">

            <header className="support-layout__header">

                <Link
                    to="/"
                    className="support-layout__logo"
                >
                    <img src={logo} alt={logo} />

                    <div className="legal-layout__brand">
                        <span id="kilo" className="kilo">Trajet</span>
                        <span id="go" className="go">Go</span>
                    </div>
                </Link>

                <nav className="support-layout__nav">

                    <NavLink
                        to="/support/help-center"
                        className={({ isActive }) => isActive ? "active" : ""}
                    >
                        Aide
                    </NavLink>

                    <NavLink
                        to="/support/faq"
                        className={({ isActive }) => isActive ? "active" : ""}
                    >
                        FAQ
                    </NavLink>

                    <NavLink
                        to="/support/contact"
                        className={({ isActive }) => isActive ? "active" : ""}
                    >
                        Contact
                    </NavLink>

                    <NavLink
                        to="/support/report"
                        className={({ isActive }) => isActive ? "active" : ""}
                    >
                        Signalement
                    </NavLink>

                </nav>

            </header>

            <Outlet />

            <footer className="support-layout__footer">

                <p>
                    © {new Date().getFullYear()} Kilo Go
                </p>

                <nav>

                    <Link to="/">
                        Accueil
                    </Link>

                    <Link to="/legal/terms">
                        Conditions
                    </Link>

                    <Link to="/legal/privacy">
                        Confidentialité
                    </Link>

                    <Link to="/legal/cookies">
                        Cookies
                    </Link>

                </nav>

            </footer>

        </main>
    );
}