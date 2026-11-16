import { Link } from "react-router-dom";
import {
    Plane,
    Package,
    Search,
    CircleUser,
} from "lucide-react";
import Avatar from "@shared/components/ui/Avatar";
import NotificationBell from "@shared/components/notification/NotificationBell";
import NotificationList from "@shared/components/notification/NotificationList";
import useNotifications from "@shared/hooks/useNotifications";
import { useAuth } from "@shared/contexts/auth.context";
import { AUTH_URL } from "@shared/services/api";
import Loading from "@shared/components/Loading";

export default function AppHeader({ onOpenModal }) {
    const {
        isAuthenticated,
        loading,
        user
    } = useAuth();

    const notifications = useNotifications({
        application: "PASSENGER",
    });

    if (loading) return <Loading message="Chargement..." />

    return (
        <>
            <header className="app-layout__header">
                <div className="home-header__container">
                    <Link
                        to="/"
                        className="home-header__brand"
                    >
                        <span id="kilo" className="kilo">Trajet</span>
                        <span id="go" className="go">Go</span>
                    </Link>

                    <nav className="home-header__nav">
                        <Link to="/trips">
                            <Plane size={18} />
                            Voyages
                        </Link>

                        <Link to="/packages">
                            <Package size={18} />
                            Colis
                        </Link>

                        <Link to="/search">
                            <Search size={18} />
                            Rechercher
                        </Link>
                    </nav>

                    <div className="home-header__actions">
                        {isAuthenticated ? (
                            <>
                                <NotificationBell
                                    loading={notifications.loading}
                                    permission={notifications.permission}
                                    isSubscribed={notifications.isSubscribed}
                                    open={notifications.open}
                                    unreadCount={notifications.unreadCount}
                                    setOpen={notifications.setOpen}
                                />

                                <Avatar
                                    size="md"
                                    src={user.avatar}
                                    name={`${user.firstName} ${user.lastName}`}
                                    onClick={onOpenModal}
                                />

                            </>
                        ) : (
                            <>
                                <a href={`${AUTH_URL}/login?utm_source=${window.location.origin}`}>
                                    <button
                                        className="login-btn"
                                    >
                                        <CircleUser size={24} />
                                        Connexion
                                    </button>
                                </a>
                            </>
                        )}
                    </div>

                </div>
            </header>

            {notifications.open && (
                <NotificationList
                    notifications={notifications.notifications}
                    loading={notifications.loading}
                    error={notifications.error}
                    onRead={notifications.markAsRead}
                    onReadAll={notifications.markAllAsRead}
                    isSubscribed={notifications.isSubscribed}
                    permission={notifications.permission}
                    onEnablePush={notifications.subscribe}
                />
            )}
        </>
    )
}
