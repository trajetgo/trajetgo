import { Link } from "react-router-dom";

import trajetGo from "@shared/assets/logo.png";

import "../../styles/components/auth/LoginHeader.scss";

export default function LoginHeader() {
  return (
    <header className="login-header">

      <Link
        to="/"
        className="login-header__logo"
      >
        <img
          src={trajetGo}
          alt="Kilogo"
        />
      </Link>

      <h1 className="login-header__title">
        Heureux de vous revoir !
      </h1>

      <p className="login-header__subtitle">
        Connectez-vous pour rechercher, réserver et gérer vos trajets
        en toute simplicité.
      </p>

    </header>
  );
}