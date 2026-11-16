import { Link } from "react-router-dom";

import trajetGo from "@shared/assets/logo.png";

import "../../styles/components/auth/LoginHeader.scss";

export default function VerifyPhoneHeader({
    phone,
    formData,
    devOtp
}) {
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
                Vérification du téléphone
            </h1>

            <p className="login-header__subtitle">
                Nous avons envoyé un code de vérification à 6 chiffres au numéro
                <strong> {phone || formData.phone}</strong>.
                Saisissez-le ci-dessous pour confirmer votre numéro de téléphone.
            </p>

            {devOtp && (
                <div className="verify-phone__dev-code">
                    <strong>Mode développement</strong>
                    <p>Code OTP de test :</p>
                    <code>{devOtp}</code>
                </div>
            )}

        </header>
    )
}
