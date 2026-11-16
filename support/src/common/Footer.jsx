import { Link } from "react-router-dom";
import {
    BookOpen,
    CircleHelp,
    FileText,
    LifeBuoy,
    Mail,
    Phone,
    ShieldCheck,
} from "lucide-react";

import trajetGo from "@shared/assets/logo.png";

import "../styles/common/Footer.scss";

export default function Footer({
    appName = "Espace professionnel",
    version = "1.0.0",
}) {
    return (
        <footer className="app-footer">
            <div className="app-footer__container">

                {/* =====================================================
                    BRAND
                ===================================================== */}

                <div className="app-footer__brand">
                    <Link
                        to="/"
                        className="app-footer__logo"
                    >
                        <img
                            src={trajetGo}
                            alt="Trajet Go"
                        />
                    </Link>

                    <p className="app-footer__title">
                        Trajet Go Business
                    </p>

                    <p className="app-footer__description">
                        Infrastructure numérique pour les
                        compagnies de transport interurbain.
                    </p>
                </div>


                {/* =====================================================
                    ASSISTANCE
                ===================================================== */}

                <div className="app-footer__column">
                    <h4>
                        Assistance
                    </h4>

                    <Link to="/support/help-center">
                        <LifeBuoy size={15} />
                        Centre d'aide
                    </Link>

                    <Link to="/support/contact">
                        <CircleHelp size={15} />
                        Contacter le support
                    </Link>

                    <Link to="/support/report">
                        <ShieldCheck size={15} />
                        Signaler un incident
                    </Link>
                </div>


                {/* =====================================================
                    RESSOURCES
                ===================================================== */}

                <div className="app-footer__column">
                    <h4>
                        Ressources
                    </h4>

                    <Link to="/documentation">
                        <BookOpen size={15} />
                        Guide d'utilisation
                    </Link>

                    <Link to="/documentation/api">
                        <FileText size={15} />
                        Documentation
                    </Link>

                    <Link to="/updates">
                        Nouveautés
                    </Link>
                </div>


                {/* =====================================================
                    CONTACT
                ===================================================== */}

                <div className="app-footer__column app-footer__contact">
                    <h4>
                        Support Trajet Go
                    </h4>

                    <a href="mailto:support@trajetgo.ci">
                        <Mail size={15} />
                        support@trajetgo.ci
                    </a>

                    <a href="tel:+2250700000000">
                        <Phone size={15} />
                        +225 07 00 00 00 00
                    </a>

                    <span className="app-footer__availability">
                        Assistance professionnelle
                    </span>
                </div>

            </div>


            {/* =====================================================
                BOTTOM
            ===================================================== */}

            <div className="app-footer__bottom">
                <div className="app-footer__bottom-left">
                    <span>
                        © {new Date().getFullYear()} Trajet Go
                    </span>

                    <span className="app-footer__separator">
                        •
                    </span>

                    <span>
                        {appName}
                    </span>

                    <span className="app-footer__separator">
                        •
                    </span>

                    <span>
                        Version {version}
                    </span>
                </div>

                <div className="app-footer__bottom-links">
                    <Link to="/legal/terms">
                        Conditions
                    </Link>

                    <Link to="/legal/privacy">
                        Confidentialité
                    </Link>

                    <Link to="/legal/security">
                        Sécurité
                    </Link>
                </div>
            </div>
        </footer>
    );
}