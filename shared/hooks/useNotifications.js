import { useCallback, useEffect, useState } from 'react';
import service from "../services/notifications.service";

export default function usePushNotifications({ application }) {
    const [permission, setPermission] = useState(
        typeof Notification !== 'undefined' ? Notification.permission : 'default'
    );
    const [subscription, setSubscription] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchNotifications();
    }, []);

    useEffect(() => {
        if (!('serviceWorker' in navigator)) return;
        navigator.serviceWorker.ready.then(reg => {
            reg.pushManager.getSubscription().then(sub => {
                setSubscription(sub);
            });
        });
    }, []);

    useEffect(() => {
        if (!('serviceWorker' in navigator)) return;

        function handleMessage(event) {
            if (event.data?.type === 'PUSH_NOTIFICATION') {
                const notif = event.data.notification;
                setNotifications(prev => [notif, ...prev]);
                setUnreadCount(prev => prev + 1);
            }
            // SW demande de marquer comme lu (au clic sur la notif native)
            if (event.data?.type === 'MARK_READ' && event.data.notificationId) {
                handleMarkAsRead(event.data.notificationId);
            }
        }

        navigator.serviceWorker.addEventListener('message', handleMessage);
        return () => navigator.serviceWorker.removeEventListener('message', handleMessage);
    }, []);

    const fetchNotifications = useCallback(async (onlyUnread = false) => {
        try {
            const result = await service.findAll({ onlyUnread });
            setNotifications(result?.data.notifications);
            setUnreadCount(result?.data.unreadCount);
        } catch (err) {
            console.error('[usePushNotifications] fetchNotifications:', err);
        }
    }, []);

    const subscribe = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            if (!('Notification' in window)) {
                throw new Error('Les notifications ne sont pas supportées.');
            }

            if (!('serviceWorker' in navigator)) {
                throw new Error('Service Worker non supporté.');
            }

            // Permission navigateur
            const result = await Notification.requestPermission();
            setPermission(result);

            if (result !== 'granted') {
                throw new Error('Permission refusée.');
            }

            // Clé VAPID
            const vapidKey = await service.getVapidKey();
            console.log('VAPID KEY =>', vapidKey);
            console.log(typeof vapidKey);

            // SW prêt
            const registration = await navigator.serviceWorker.ready;

            // Abonnement push
            const pushSubscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapidKey),
            });

            setSubscription(pushSubscription);

            // Sauvegarde backend
            await service.subscribe(pushSubscription);

            console.log('[Push] abonnement réussi');
            return true;
        } catch (err) {
            console.error('[usePushNotifications] subscribe:', err);
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const unsubscribe = useCallback(async () => {
        if (!subscription) return;

        try {
            // Révoquer côté backend (CSRF protégé)
            await service.remove(subscription);

            // Révoquer côté navigateur
            await subscription.unsubscribe();
            setSubscription(null);
            setPermission('default');

        } catch (err) {
            console.error('[usePushNotifications] unsubscribe:', err);
        }
    }, [subscription]);

    async function handleMarkAsRead(notificationId) {
        try {
            await service.read(notificationId);
            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('[usePushNotifications] markAsRead:', err);
        }
    }


    const markAsRead = useCallback(handleMarkAsRead, []);

    const markAllAsRead = useCallback(async () => {
        try {
            await service.readAll();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error('[usePushNotifications] markAllAsRead:', err);
        }
    }, []);

    return {
        // État
        permission,             // 'default' | 'granted' | 'denied'
        isSubscribed: !!subscription,
        loading,
        error,

        // Données
        notifications,
        unreadCount,

        // Actions
        subscribe,
        unsubscribe,
        markAsRead,
        markAllAsRead,
        refresh: fetchNotifications,
    };
}

// ─── Convertir la clé VAPID base64 en Uint8Array ─────────────
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    return new Uint8Array([...rawData].map(char => char.charCodeAt(0)));
}