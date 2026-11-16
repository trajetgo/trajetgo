
import { useState, useEffect, useRef } from 'react'
import {
    Bell,
    BellOff,
    BellRing,
    RefreshCw,
    CheckCheck,
    X,
    ChevronRight,
    Loader2,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import usePushNotifications from '../../hooks/usePushNotifications'
import { DEFAULT_NOTIFICATION_CONFIG, TYPE_CONFIG } from '../../utils/notificationUtils.js'
import '../../styles/components/notifications/NotificationBell.scss'


// ─── Format date relatif ──────────────────────────────────────
function timeAgo(dateString) {
    const diff = Date.now() - new Date(dateString).getTime()
    const mins = Math.floor(diff / 60_000)
    const hours = Math.floor(diff / 3_600_000)
    const days = Math.floor(diff / 86_400_000)
    if (mins < 1) return 'à l\'instant'
    if (mins < 60) return `il y a ${mins} min`
    if (hours < 24) return `il y a ${hours}h`
    if (days < 7) return `il y a ${days}j`
    return new Date(dateString).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

// ─── Composant item notification ─────────────────────────────
function NotificationItem({ notification, onRead, navigate }) {
    const config = TYPE_CONFIG[notification.type] || DEFAULT_NOTIFICATION_CONFIG;

    const Icon = config.icon;

    function handleClick() {
        if (!notification.isRead) onRead(notification.id)
        // Navigation au deep link si data.url existe
        const url = notification.data?.url
        if (url) navigate(url)
    }

    return (
        <div
            className={`nb-item ${!notification.isRead ? 'unread' : ''}`}
            onClick={handleClick}
        >
            <div className="nb-item__icon" style={{ background: config.bg, color: config.color }}>
                <Icon size={15} />
            </div>
            <div className="nb-item__body">
                <p className="nb-item__title">{notification.title}</p>
                <p className="nb-item__message">{notification.message}</p>
                <span className="nb-item__time">{timeAgo(notification.createdAt)}</span>
            </div>
            {!notification.isRead && <div className="nb-item__dot" />}
            {notification.data?.url && (
                <ChevronRight size={13} className="nb-item__arrow" />
            )}
        </div>
    )
}

// ─── Composant principal ──────────────────────────────────────
export default function NotificationBell() {
    const {
        permission,
        isSubscribed,
        loading,
        error,
        notifications,
        unreadCount,
        subscribe,
        markAsRead,
        markAllAsRead,
        refresh,
    } = usePushNotifications()

    const [open, setOpen] = useState(false);

    const navigate = useNavigate();

    const ref = useRef(null)

    // Fermer au clic extérieur
    useEffect(() => {
        if (!open) return
        function handleOutside(e) {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false)
        }
        document.addEventListener('mousedown', handleOutside)
        return () => document.removeEventListener('mousedown', handleOutside)
    }, [open])

    // Fermer à l'Escape
    useEffect(() => {
        if (!open) return
        function handleKey(e) { if (e.key === 'Escape') setOpen(false) }
        document.addEventListener('keydown', handleKey)
        return () => document.removeEventListener('keydown', handleKey)
    }, [open])

    // ── Rendu bouton selon l'état ─────────────────────────────
    function renderBellIcon() {
        // 1. En cours d'abonnement → spinner
        if (loading) return <Loader2 size={20} className="nb-spin" />

        // 2. Permission refusée par le navigateur
        if (permission === 'denied') return <BellOff size={20} />

        // 3. Abonné + dropdown ouvert + notifs non lues → cloche animée
        if (isSubscribed && open && unreadCount > 0) return <BellRing size={20} />

        // 4. Tous les autres cas : abonné, non abonné, granted en attente
        return <Bell size={20} />
    }

    function handleBellClick() {
        // Bloqué → rien
        if (permission === 'denied') return

        // Pas encore abonné → lancer l'abonnement
        if (!isSubscribed) { subscribe(); return }

        // Abonné → toggle dropdown
        setOpen(o => !o)
    }

    return (
        <div className="nb-root" ref={ref}>

            {/* ── Bouton cloche ───────────────────────────────────── */}
            <button
                className={`nb-bell ${open ? 'open' : ''} ${permission === 'denied' ? 'denied' : ''}`}
                onClick={handleBellClick}
                disabled={loading}
                aria-label={
                    permission === 'denied' ? 'Notifications bloquées' :
                        !isSubscribed ? 'Activer les notifications' :
                            `${unreadCount} notification${unreadCount > 1 ? 's' : ''} non lue${unreadCount > 1 ? 's' : ''}`
                }
                title={
                    !isSubscribed && permission !== 'denied'
                        ? 'Cliquer pour activer les notifications'
                        : undefined
                }
            >
                {renderBellIcon()}

                {/* Badge compteur */}
                {unreadCount > 0 && !loading && (
                    <span className="nb-badge">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}

                {/* Indicateur "non abonné" */}
                {!isSubscribed && permission === 'default' && !loading && (
                    <span className="nb-dot-unsubscribed" title="Notifications désactivées" />
                )}
            </button>

            {/* ── Dropdown ─────────────────────────────────────────── */}
            {open && (
                <div className="nb-dropdown" role="dialog" aria-label="Notifications">

                    {/* Header */}
                    <div className="nb-dropdown__header">
                        <div className="nb-dropdown__header-left">
                            <span className="nb-dropdown__title">Notifications</span>
                            {unreadCount > 0 && (
                                <span className="nb-dropdown__count">{unreadCount} nouvelle{unreadCount > 1 ? 's' : ''}</span>
                            )}
                        </div>
                        <div className="nb-dropdown__header-actions">
                            {unreadCount > 0 && (
                                <button
                                    className="nb-action-btn"
                                    onClick={markAllAsRead}
                                    title="Tout marquer comme lu"
                                >
                                    <CheckCheck size={15} />
                                </button>
                            )}
                            <button
                                className="nb-action-btn"
                                onClick={refresh}
                                title="Rafraîchir"
                            >
                                <RefreshCw size={15} />
                            </button>
                            <button
                                className="nb-action-btn"
                                onClick={() => setOpen(false)}
                                title="Fermer"
                            >
                                <X size={15} />
                            </button>
                        </div>
                    </div>

                    {/* Liste */}
                    <div className="nb-dropdown__list">
                        {notifications?.length === 0 ? (
                            <div className="nb-empty">
                                <Bell size={28} />
                                <p>Aucune notification pour l'instant</p>
                            </div>
                        ) : (
                            notifications?.map(notif => (
                                <NotificationItem
                                    key={notif?.id}
                                    notification={notif}
                                    onRead={markAsRead}
                                    navigate={navigate}
                                />
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {notifications?.length > 0 && (
                        <div className="nb-dropdown__footer">
                            <a href="/notifications" onClick={() => setOpen(false)}>
                                Voir toutes les notifications
                            </a>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}