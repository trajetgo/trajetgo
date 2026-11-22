import { API_URL } from "@shared/services/api";

class TgtlService {
    getStatus = async () => {
        try {
            const response = await fetch(`${API_URL}/tgtl/status`, {
                method: 'GET',
                credentials: "include",
            });

            const result = await response.json();

            // Si la réponse n'est pas ok, on lance une erreur avec le message du backend
            if (!response.ok) {
                // Le backend renvoie un objet avec un message d'erreur
                const errorMessage = result.message ||
                    result.error ||
                    `Erreur ${response.status}`;

                // Créer une erreur avec le message du backend
                const error = new Error(errorMessage);
                error.status = response.status;
                error.data = result;
                throw error;
            }

            return result;
        } catch (error) {
            // Si c'est une erreur réseau
            if (error.name === 'TypeError' || error.message.includes('fetch')) {
                throw new Error('Impossible de contacter le serveur. Vérifiez votre connexion internet.');
            }

            // Si c'est une erreur de réponse HTTP
            if (error.status === 401) {
                throw new Error('Email ou mot de passe incorrect');
            }
            if (error.status === 403) {
                throw new Error('Compte désactivé. Contactez l\'administrateur.');
            }
            if (error.status === 404) {
                throw new Error('Service de connexion indisponible');
            }

            // Si c'est une erreur réseau
            if (error.name === 'TypeError') {
                throw new Error('Impossible de contacter le serveur. Vérifiez votre connexion.');
            }

            // Ré-throw l'erreur originale
            throw error;
        }
    };
};

const tgtlService = new TgtlService();

export default tgtlService;