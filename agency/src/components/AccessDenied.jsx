import { useNavigate } from "react-router-dom";
import {
    ShieldX,
    ArrowLeft,
    Home,
    LockKeyhole,
} from "lucide-react";

import "../styles/components/AccessDenied.scss";

export default function AccessDenied({
    title = "Accès refusé",
    message = "Vous n'avez pas les autorisations nécessaires pour accéder à cette page.",
    showBackButton = true,
    homePath = "/",
}) {
    const navigate = useNavigate();

    return (
        <main className="access-denied">
            <div className="access-denied__card">
                <div className="access-denied__illustration">
                    <div className="access-denied__icon">
                        <ShieldX size={42} strokeWidth={1.6} />
                    </div>

                    <span className="access-denied__badge">
                        <LockKeyhole size={14} />
                        Accès restreint
                    </span>
                </div>

                <div className="access-denied__content">
                    <span className="access-denied__code">
                        ERREUR 403
                    </span>

                    <h1>{title}</h1>

                    <p className="access-denied__message">
                        {message}
                    </p>

                    <p className="access-denied__help">
                        Si vous pensez qu'il s'agit d'une erreur,
                        contactez l'administrateur de votre compte.
                    </p>
                </div>

                <div className="access-denied__actions">
                    {showBackButton && (
                        <button
                            type="button"
                            className="access-denied__button access-denied__button--secondary"
                            onClick={() => navigate(-1)}
                        >
                            <ArrowLeft size={17} />
                            Retour
                        </button>
                    )}

                    <button
                        type="button"
                        className="access-denied__button access-denied__button--primary"
                        onClick={() => navigate(homePath, { replace: true })}
                    >
                        <Home size={17} />
                        Accueil
                    </button>
                </div>

                <div className="access-denied__footer">
                    <span className="access-denied__footer-dot" />
                    Espace sécurisé Trajet Go
                </div>
            </div>
        </main>
    );
}