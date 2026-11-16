import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import trajetgo from "@shared/assets/logo.png";
import { APP_CONFIG } from "@shared/config/app.config";
import { getCopyrightYears } from "@shared/utils/copyright.utils";
import { 
    POLICY_URL, 
    SUPPORT_URL 
} from "@shared/services/api";

import "../styles/common/AppFooter.scss";

/* ------------------------------------------------------------------ */
/* Config des colonnes                                                 */
/* ------------------------------------------------------------------ */

const FOOTER_SECTIONS = [
    {
        title: "Voyageurs",
        links: [
            { label: "Rechercher un trajet", to: "/trips" },
            { label: "Réserver un billet", to: "/trips" },
            { label: "Mes réservations", to: "/account/bookings" },
            { label: "Comment ça marche ?", to: "/how-it-works" },
        ],
    },
    {
        title: "Partenaires",
        links: [
            { label: "Devenir partenaire", to: "/partners" },
            { label: "Solutions pour les compagnies", to: "/partners/companies" },
            { label: "Demander une démonstration", to: "/partners/demo" },
            { label: "Accès à l'espace compagnie", to: "/partners/login" },
        ],
    },
    {
        title: "Entreprise",
        links: [
            { label: "À propos", to: "/about" },
            { label: "Actualités et blog", to: "/blog" },
            { label: "Carrières", to: "/careers" },
            { label: "Contact", to: "/contact" },
        ],
    },
    {
        title: "Assistance",
        links: [
            { label: "Centre d'aide", to: `${SUPPORT_URL}/help-center` },
            { label: "FAQ", to: `${SUPPORT_URL}/faq` },
            { label: "Signaler un problème", to: `${SUPPORT_URL}/report` },
            { label: "Nous contacter", to: `${SUPPORT_URL}/contact` },
        ],
    },
];

const LEGAL_LINKS = [
    { label: "Mentions légales", to: `${POLICY_URL}/notice` },
    { label: "Conditions d'utilisation", to: `${POLICY_URL}/terms` },
    { label: "Confidentialité", to: `${POLICY_URL}/privacy` },
    { label: "Cookies", to: `${POLICY_URL}/cookie` },
];

/* ------------------------------------------------------------------ */

export default function AppFooter() {
    return (
        <footer className="app-footer">
            <div className="app-footer__container">
                {/* ---------- Marque ---------- */}

                <div className="app-footer__brand">
                    <Link to="/" className="app-footer__logo">
                        <img src={trajetgo} alt={APP_CONFIG.name} />
                    </Link>

                    <p className="app-footer__tagline">
                        Votre trajet, simplement.
                    </p>

                    <p className="app-footer__description">
                        Une plateforme pour rechercher, réserver et gérer
                        ses trajets interurbains en toute simplicité.
                    </p>

                    <div className="app-footer__socials">
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Facebook"
                        >
                            <FaFacebook size={18} />
                        </a>

                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="Instagram"
                        >
                            <FaInstagram size={18} />
                        </a>

                        <a
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="LinkedIn"
                        >
                            <FaLinkedin size={18} />
                        </a>

                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noreferrer"
                            aria-label="X (Twitter)"
                        >
                            <FaXTwitter size={18} />
                        </a>
                    </div>
                </div>

                {/* ---------- Colonnes de liens ---------- */}

                <div className="app-footer__sections">
                    {FOOTER_SECTIONS.map((section) => (
                        <div
                            key={section.title}
                            className="app-footer__column"
                        >
                            <h4>{section.title}</h4>

                            {section.links.map((link) => (
                                <Link key={link.label} to={link.to}>
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    ))}
                </div>

                {/* ---------- Mentions légales (ligne horizontale) ---------- */}

                <nav
                    className="app-footer__legal"
                    aria-label="Mentions légales"
                >
                    {LEGAL_LINKS.map((link, index) => (
                        <span key={link.to}>
                            <Link to={link.to}>{link.label}</Link>

                            {index < LEGAL_LINKS.length - 1 && (
                                <span
                                    className="app-footer__legal-separator"
                                    aria-hidden="true"
                                >
                                    ·
                                </span>
                            )}
                        </span>
                    ))}
                </nav>

                {/* ---------- Copyright + signature ---------- */}

                <div className="app-footer__bottom">
                    <p>
                        © {getCopyrightYears()} {APP_CONFIG.name}. Tous
                        droits réservés.
                    </p>

                    <p className="app-footer__made-with">
                        Fait avec{" "}
                        <span
                            className="app-footer__heart"
                            aria-label="amour"
                        >
                            ❤️
                        </span>{" "}
                        en Côte d'Ivoire
                    </p>
                </div>
            </div>
        </footer>
    );
}