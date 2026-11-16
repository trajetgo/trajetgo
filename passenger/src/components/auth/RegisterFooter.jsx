import React from 'react';
import { Link } from "react-router-dom";
import "../../styles/components/auth/RegisterFooter.scss";

export default function RegisterFooter() {
    return (
        <footer className="register-footer">

            <p className="register-footer__login">
                Déjà membre ?
                {" "}
                <Link to="/auth/login">
                    Connexion
                </Link>
            </p>
        </footer>
    )
}
