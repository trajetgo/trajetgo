
self.addEventListener("push", (event) => {
    let payload = {};

    try {
        payload = event.data ? event.data.json() : {};
    } catch (error) {
        payload = {
            title: "Trajet Go",
            body: event.data?.text() || "Vous avez une nouvelle notification."
        };
    }

    const title = payload.title || "Trajet Go";

    const options = {
        body: payload.body || "Vous avez une nouvelle notification.",
        icon: payload.icon || "/icons/notification-icon.png",
        badge: payload.badge || "/icons/notification-badge.png",
        data: payload.data || {},
        tag: payload.tag,
        renotify: Boolean(payload.renotify)
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();

    const targetUrl = event.notification.data?.url || "/";

    event.waitUntil(
        (async () => {
            const url = new URL(targetUrl, self.location.origin);

            // Empêche une notification d'ouvrir un autre domaine.
            if (url.origin !== self.location.origin) {
                return;
            }

            const clientsList = await self.clients.matchAll({
                type: "window",
                includeUncontrolled: true
            });

            for (const client of clientsList) {
                if (client.url.startsWith(self.location.origin)) {
                    await client.focus();

                    if (client.navigate) {
                        await client.navigate(url.href);
                    }

                    return;
                }
            }

            await self.clients.openWindow(url.href);
        })()
    );
});
