import { Bell, BellOff, CheckCheck, Loader2 } from "lucide-react";

import NotificationItem from "./NotificationItem";

export default function NotificationList({
    notifications = [],
    loading = false,
    error = null,
    onRead,
    onReadAll,
    isSubscribed = false,
    permission = "default",
    onEnablePush,
}) {
    return (
        <div className="nb-list">
            {!isSubscribed && permission !== "denied" && onEnablePush && (
                <div className="nb-list__push-prompt">
                    <div className="nb-list__push-icon">
                        <Bell size={18} />
                    </div>

                    <div className="nb-list__push-content">
                        <strong>Ne manquez aucune information</strong>
                        <p>
                            Activez les notifications pour recevoir
                            les alertes importantes de Trajet Go.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onEnablePush}
                    >
                        Activer
                    </button>
                </div>
            )}

            {permission === "denied" && (
                <div className="nb-list__push-disabled">
                    <BellOff size={16} />
                    <span>
                        Les notifications du navigateur sont bloquées.
                    </span>
                </div>
            )}

            <div className="nb-list__header">
                <strong>Notifications</strong>

                {notifications.some((item) => !item.readAt && !item.isRead) && (
                    <button
                        type="button"
                        onClick={onReadAll}
                    >
                        <CheckCheck size={15} />
                        Tout marquer comme lu
                    </button>
                )}
            </div>

            {loading ? (
                <div className="nb-list__state">
                    <Loader2 className="nb-spin" size={22} />
                    <span>Chargement des notifications...</span>
                </div>
            ) : error ? (
                <div className="nb-list__state nb-list__state--error">
                    {error}
                </div>
            ) : notifications.length === 0 ? (
                <div className="nb-list__state">
                    <Bell size={24} />
                    <span>Vous n'avez aucune notification.</span>
                </div>
            ) : (
                <div className="nb-list__items">
                    {notifications.map((notification) => (
                        <NotificationItem
                            key={notification.id}
                            notification={notification}
                            onRead={onRead}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
