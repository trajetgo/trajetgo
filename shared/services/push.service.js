
import { urlBase64ToUint8Array } from "../utils/push.utils";
import { API_URL } from "./api";
import csrfService from "./csrf.service";

// Fonction utilitaire pour les requêtes protégées CSRF
const makeCsrfRequest = async (url, options = {}) => {
    let token;
    try {
        token = await csrfService.getCsrfToken();
    } catch (error) {
        console.error('Impossible de récupérer le token CSRF:', error);
        throw new Error('CSRF token unavailable');
    }

    const config = {
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'x-csrf-token': token, // Utilisez un seul header pour plus de clarté
        },
        ...options
    };

    const response = await fetch(url, config);


    // Si CSRF invalide, reset et relance une fois
    if (response.status === 403) {
        const responseText = await response.text();
        console.warn('CSRF 403 response:', responseText);

        let errorData;
        try {
            errorData = JSON.parse(responseText);
        } catch {
            errorData = { message: responseText };
        }

        if (errorData.code === 'EBADCSRFTOKEN' || errorData.message?.includes('CSRF')) {
            console.warn('CSRF token invalide, régénération...');
            csrfService.resetCsrfToken();
            token = await csrfService.getCsrfToken();

            config.headers['x-csrf-token'] = token;

            return await fetch(url, config);
        }
    }

    return response;
};

const VAPID_PUBLIC_KEY = process.env.REACT_APP_VAPID_PUBLIC_KEY;

const SERVICE_WORKER_PATH = "/service-worker.js";

const APPLICATION = "PASSENGER";

const SUBSCRIPTION_STORAGE_KEY = "trajet-go-push-subscription-id";

class PushService {
    isSupported() {
        return (
            "serviceWorker" in navigator &&
            "PushManager" in window &&
            "Notification" in window
        );
    }

    registerServiceWorker = async () => {
        if (!this.isSupported()) {
            throw new Error(
                "Les notifications Push ne sont pas prises en charge par ce navigateur."
            );
        }

        return navigator.serviceWorker.register(
            SERVICE_WORKER_PATH
        );
    }

    getSubscription = async () => {
        const registration = await this.registerServiceWorker();

        return registration.pushManager.getSubscription();
    }

    subscribe = async () => {
        if (!VAPID_PUBLIC_KEY) {
            throw new Error(
                "La clé publique VAPID est absente."
            );
        }

        if (!this.isSupported()) {
            throw new Error(
                "Les notifications Push ne sont pas prises en charge."
            );
        }

        if (Notification.permission === "denied") {
            throw new Error(
                "Les notifications sont bloquées dans les paramètres du navigateur."
            );
        }

        const permission = await Notification.requestPermission();

        if (permission !== "granted") {
            throw new Error(
                "L'autorisation d'envoyer des notifications a été refusée."
            );
        }

        const registration = await this.registerServiceWorker();

        let subscription = await registration.pushManager.getSubscription();

        if (!subscription) {
            subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(
                    VAPID_PUBLIC_KEY
                )
            });
        }

        const result = await makeCsrfRequest(`${API_URL}/notifications/push/subscribe`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                subscription: subscription.toJSON(),
                application: APPLICATION,
                deviceLabel: navigator.userAgent
            })
        });

        // À adapter à la structure exacte de ApiResponse.
        const subscriptionId = result.data?.id;

        if (subscriptionId) {
            localStorage.setItem(
                SUBSCRIPTION_STORAGE_KEY,
                subscriptionId
            );
        }

        return {
            subscription,
            subscriptionId,
            permission
        };
    }

    unsubscribe = async () => {
        const registration = await this.registerServiceWorker();

        const subscription = await registration.pushManager.getSubscription();

        if (!subscription) {
            localStorage.removeItem(SUBSCRIPTION_STORAGE_KEY);

            return { unsubscribed: true };
        }

        const subscriptionId = localStorage.getItem(
            SUBSCRIPTION_STORAGE_KEY
        );

        // Révoquer côté serveur avant de supprimer l'abonnement navigateur.
        if (subscriptionId) {
            await makeCsrfRequest(`${API_URL}/notifications/push/${subscriptionId}`, {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        await subscription.unsubscribe();

        localStorage.removeItem(SUBSCRIPTION_STORAGE_KEY);

        return { unsubscribed: true };
    }

    getPermission = async () => {
        if (!("Notification" in window)) {
            return "unsupported";
        }

        return Notification.permission;
    }
};

const pushService = new PushService();

export default pushService;