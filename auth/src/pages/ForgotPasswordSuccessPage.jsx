import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ForgotPasswordSuccess from '../components/auth/ForgotPasswordSuccess'
import { FORGOT_PASSWORD_IDENTIFIER_STORAGE_KEY } from '../utils/auth.utils';

export default function ForgotPasswordSuccessPage() {
    const navigate = useNavigate();

    const [identifier, setIdentifier] = useState(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        document.title = "Vérifiez votre boîte de réception | Trajet Go";

        try {
            const raw = sessionStorage.getItem(FORGOT_PASSWORD_IDENTIFIER_STORAGE_KEY);

            if (!raw) {
                // Pas d'identifiant : l'utilisateur est arrivé ici par erreur.
                navigate("/forgot-password", { replace: true });
                return;
            }

            setIdentifier(JSON.parse(raw));
            setReady(true);
        } catch {
            navigate("/forgot-password", { replace: true });
        }
    }, [navigate]);

    if (!ready || !identifier) return null;

    return <ForgotPasswordSuccess identifier={identifier} />;
}
