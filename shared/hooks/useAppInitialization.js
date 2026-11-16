import { useEffect, useState } from "react";

export default function useAppInitialization() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function initialize() {

            try {

                // initialize csrf

                // refresh token

                // récupérer l'utilisateur

                // charger les paramètres

            } finally {
                setTimeout(() => {
                    setLoading(false);

                }, 1500)
            }
        }

        initialize();

    }, []);

    return { loading };

};