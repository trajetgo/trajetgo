import React from 'react';
import { Link } from 'react-router-dom';
import { CircleAlert, Clock3, MailCheck, RotateCw, ShieldCheck } from 'lucide-react';
import '../../styles/components/auth/RegisterSuccess.scss';

export default function RegisterSuccess({
    email,
    onResendEmail,
}) {
    return (
        <section className="register-success">

            <div className="register-success__icon">
                <MailCheck size={56} />
            </div>

            <h1 className="register-success__title">
                Votre compte a bien été créé
            </h1>

            <p className="register-success__subtitle">
                Nous avons envoyé un email de vérification à
                <strong> {email}</strong>.
            </p>

            <div className="register-success__steps">

                <div className="register-success__step">
                    <MailCheck size={20} />
                    <div>
                        <h3>1. Ouvrez votre boîte mail</h3>
                        <p>
                            Consultez votre messagerie et recherchez
                            l'email envoyé par Kilo Go.
                        </p>
                    </div>
                </div>

                <div className="register-success__step">
                    <ShieldCheck size={20} />
                    <div>
                        <h3>2. Cliquez sur le lien de vérification</h3>
                        <p>
                            Ce lien permet d'activer votre compte
                            de manière sécurisée.
                        </p>
                    </div>
                </div>

                <div className="register-success__step">
                    <Clock3 size={20} />
                    <div>
                        <h3>3. Connectez-vous</h3>
                        <p>
                            Une fois votre adresse email vérifiée,
                            vous pourrez accéder à votre espace.
                        </p>
                    </div>
                </div>

            </div>

            <div className="register-success__tips">

                <div className="register-success__tips-header">
                    <CircleAlert size={18} />
                    <h2>Vous ne trouvez pas notre email ?</h2>
                </div>

                <ul>
                    <li>Vérifiez votre dossier Spam ou Courriers indésirables.</li>
                    <li>Patientez quelques minutes avant de réessayer.</li>
                    <li>Ajoutez <strong>no-reply@kilogo.com</strong> à vos contacts.</li>
                    <li>Assurez-vous d'avoir saisi la bonne adresse email.</li>
                </ul>

            </div>

            <div className="register-success__actions">

                <button
                    type="button"
                    onClick={onResendEmail}
                    className="btn btn-primary"
                >
                    <RotateCw size={18} />
                    Renvoyer l'email de vérification
                </button>

                <Link
                    to="/auth/login"
                    className="btn btn-secondary"
                >
                    Retour à la connexion
                </Link>

            </div>

        </section>
    )
}
