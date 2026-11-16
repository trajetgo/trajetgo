import { Link } from "react-router-dom";

import trajetGo from "@shared/assets/logo.png";

import "../../styles/components/auth/RegisterHeader.scss";

export default function RegisterHeader() {
    return (
        <header className="register-header">
            <Link
                to="/"
                className="register-header__logo"
            >
                <img
                    src={trajetGo}
                    alt="Kilogo"
                />
            </Link>

            <h1 className="register-header__title">
                Bienvenue sur Trajet Go
            </h1>

            <p className="register-header__subtitle">
                Créez votre compte pour rechercher, réserver et gérer vos trajets
                en toute simplicité.
            </p>
        </header>
    )
}
