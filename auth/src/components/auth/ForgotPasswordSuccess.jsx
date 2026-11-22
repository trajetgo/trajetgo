import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

import { FORGOT_PASSWORD_IDENTIFIER_STORAGE_KEY } from '../../utils/auth.utils';

export default function ForgotPasswordSuccess({ identifier }) {

    const clearStorage = () => {
        sessionStorage.removeItem(
            FORGOT_PASSWORD_IDENTIFIER_STORAGE_KEY
        );
    };

    return (
        <main className="forgot-password">
            <div className="forgot-password__card">
                <div className="forgot-password__icon forgot-password__icon--success">
                    <CheckCircle2 size={32} />
                </div>

                <h1>Vérifiez votre boîte de réception</h1>

                <p>
                    Si un compte est associé à{" "}
                    <strong>{identifier}</strong>, vous recevrez un lien
                    pour réinitialiser votre mot de passe dans quelques
                    instants.
                </p>

                <p className="forgot-password__hint">
                    Pensez à vérifier vos spams. Le lien expire dans 1 heure.
                </p>

                <Link
                    to="/login"
                    className="forgot-password__btn forgot-password__btn--primary"
                    onClick={clearStorage}
                >
                    Retour à la connexion
                </Link>

                <Link
                    to="/forgot-password"
                    className="forgot-password__footer"
                    onClick={clearStorage}
                >
                    Renvoyer un lien
                </Link>
            </div>
        </main>
    )
}
