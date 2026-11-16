import {
    Bell,
    BellOff,
    BellRing,
    Loader2,
} from "lucide-react";

import '../../styles/components/notifications/NotificationBell.scss'

export default function NotificationBell({
    loading = false,
    permission = "default",
    isSubscribed = false,
    open = false,
    unreadCount = 0,
    setOpen,
}) {
    function renderBellIcon() {
        if (loading) {
            return <Loader2 size={20} className="nb-spin" />;
        }

        if (permission === "denied") {
            return <BellOff size={20} />;
        }

        if (open && unreadCount > 0) {
            return <BellRing size={20} />;
        }

        return <Bell size={20} />;
    }

    function handleBellClick() {
        setOpen?.((previous) => !previous);
    }

    return (
        <button
            type="button"
            className={`nb-bell ${open ? "open" : ""} ${permission === "denied" ? "denied" : ""
                }`}
            onClick={handleBellClick}
            aria-expanded={open}
            aria-label={`${unreadCount} notification${unreadCount > 1 ? "s" : ""
                } non lue${unreadCount > 1 ? "s" : ""}`}
            title={
                !isSubscribed && permission !== "denied"
                    ? "Les notifications Push ne sont pas activées"
                    : "Afficher les notifications"
            }
        >
            {renderBellIcon()}

            {unreadCount > 0 && (
                <span className="nb-badge">
                    {unreadCount > 99 ? "99+" : unreadCount}
                </span>
            )}

            {!isSubscribed && permission === "default" && (
                <span
                    className="nb-dot-unsubscribed"
                    title="Notifications Push désactivées"
                />
            )}
        </button>
    );
}
