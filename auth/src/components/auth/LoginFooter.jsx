import React from 'react';
import { Link } from "react-router-dom";
import "../../styles/components/auth/LoginFooter.scss";

export default function LoginFooter() {
  return (
    <footer className="login-footer">

      <p className="login-footer__register">
        Vous n'avez pas encore de compte ?
        {" "}
        <Link to="/register">
          Créer un compte
        </Link>
      </p>

      <nav className="login-footer__links">
        <Link to="/forgot-password">
          Mot de passe oublié
        </Link>
      </nav>

    </footer>
  );
}