import { Link } from "react-router-dom";
import {
    CheckCircle2,
    XCircle,
    LoaderCircle,
    Mail,
    ArrowRight,
} from "lucide-react";

import useVerifyEmail from "../hooks/useVerifyEmail";

import "../styles/pages/VerifyEmail.scss";

export default function VerifyEmail() {
    const { message, isLoading, isSuccess, isError } = useVerifyEmail();

    return (
        <main className="verify-email">
            <div className="verify-email__card">
                {isLoading && (
                    <>
                        <div className="verify-email__icon verify-email__icon--loading">
                            <LoaderCircle size={32} className="is-spinning" />
                        </div>

                        <h1>Vérification en cours</h1>

                        <p>Nous confirmons votre adresse e-mail...</p>
                    </>
                )}

                {isSuccess && (
                    <>
                        <div className="verify-email__icon verify-email__icon--success">
                            <CheckCircle2 size={32} />
                        </div>

                        <h1>Adresse e-mail vérifiée</h1>

                        <p>{message}</p>

                        <div className="verify-email__actions">
                            <Link to="/login" className="verify-email__btn verify-email__btn--primary">
                                Accéder à mon compte
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </>
                )}

                {isError && (
                    <>
                        <div className="verify-email__icon verify-email__icon--error">
                            <XCircle size={32} />
                        </div>

                        <h1>Vérification impossible</h1>

                        <p>{message}</p>

                        <div className="verify-email__actions">
                            <Link
                                to="/resend-verification"
                                className="verify-email__btn verify-email__btn--primary"
                            >
                                <Mail size={16} />
                                Recevoir un nouveau lien
                            </Link>

                            <Link to="/" className="verify-email__btn">
                                Retour à l'accueil
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}