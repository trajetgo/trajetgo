import { API_URL } from "@shared/services/api";

class LocationService {
    getCities = async () => {
        const response = await fetch(`${API_URL}/routes/cities`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
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

        console.log("Cities ", result)

        return result;
    };

    getLocationsByCity = async (cityId) => {
        const response = await fetch(`${API_URL}/routes/cities/cityId=${encodeURIComponent(cityId)}/locations`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
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

        console.log("Location by City ", result)

        return result;
    }

    getLocationsById = async (id) => {
        const response = await fetch(`${API_URL}/locations/${id}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
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
    }

    searchCities = async (term) => {
        const response = await fetch(`${API_URL}/locations/cities?search=${encodeURIComponent(term)}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        }
        );

        const result = await response.json();

        if (!response.ok) {
            const errorMessage =
                result.message ||
                result.error ||
                `Erreur ${response.status}`;

            const error = new Error(errorMessage);
            error.status = response.status;
            error.data = result;

            throw error;
        }

        return result;
    };

    getLocationsByType = async (type) => {
        const response = await fetch(`${API_URL}/locations?type=${encodeURIComponent(type)}`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
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
    }
};

const locationService = new LocationService();

export default locationService;