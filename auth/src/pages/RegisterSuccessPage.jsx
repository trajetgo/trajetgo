import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { REGISTER_SUCCESS_STORAGE_KEY } from "../utils/auth.utils";

import RegisterSuccess from "../components/RegisterSuccess";

export default function RegisterSuccessPage() {
    const navigate = useNavigate();

    const [payload, setPayload] = useState(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        document.title = "Compte créé | Trajet Go";

        try {
            const raw = sessionStorage.getItem(REGISTER_SUCCESS_STORAGE_KEY);

            if (!raw) {
                // Pas de données : l'utilisateur est arrivé ici par erreur
                // ou l'onglet a été fermé puis rouvert.
                navigate("/register", { replace: true });
                return;
            }

            setPayload(JSON.parse(raw));
            setReady(true);
        } catch {
            navigate("/register", { replace: true });
        }
    }, [navigate]);

    if (!ready || !payload) {
        return null;
    }

    return (
        <RegisterSuccess
            email={payload.email}
            phone={payload.phone}
            verificationId={payload.verificationId}
            onNavigateAway={() => {
                sessionStorage.removeItem(REGISTER_SUCCESS_STORAGE_KEY);
            }}
        />
    );
}