import { Link } from 'react-router-dom';
import {
    Bell,
    LogOut,
    Package,
    Plane,
    Settings,
    ShieldCheck,
    User,
    Wallet
} from 'lucide-react';
import Avatar from '../ui/Avatar';
import Modal from '../ui/Modal';
import { useAuth } from '../../contexts/auth.context';
import "../../styles/components/user/UserMenuModal.scss";

export default function UserMenuModal({ open, onClose, onLogout }) {
    const { user } = useAuth();

    if (!open) return null;

    return (
        <Modal
            isOpen={open}
            title={null}
            onClose={onClose}
        >
            <div
                className="user-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="user-modal__header">
                    <Avatar
                        src={user.avatar}
                        name={`${user.firstName} ${user.lastName}`}
                        size="lg"
                    />
                    <div>
                        <h3>{user.firstName} {user.lastName}</h3>
                        <p>{user.email}</p>
                        {user.identityVerified && (<span className="user-modal__badge">
                            <ShieldCheck size={14} /> Compte vérifié
                        </span>
                        )}
                    </div>
                </div>

                <div className="user-modal__section">
                    <Link
                        to="/app/profile"
                        onClick={onClose}
                    >
                        <User size={18} /> Mon profil
                    </Link>
                    <Link
                        to="/app/trips/my"
                        onClick={onClose}
                    >
                        <Plane size={18} /> Mes voyages
                    </Link>
                    <Link
                        to="/app/bookings/my"
                        onClick={onClose}
                    >
                        <Package size={18} /> Mes réservations
                    </Link>

                    <Link
                        to="/app/payments"
                        onClick={onClose}
                    >
                        <Wallet size={18} /> Paiements
                    </Link>

                    <Link
                        to="/app/notifications"
                        onClick={onClose}
                    >
                        <Bell size={18} /> Notifications
                    </Link>

                    <Link
                        to="/app/settings"
                        onClick={onClose}
                    >
                        <Settings size={18} /> Paramètres
                    </Link>
                </div>

                <button
                    className="user-modal__logout"
                    onClick={onLogout}
                >
                    <LogOut size={18} /> Se déconnecter
                </button>
            </div>

        </Modal>
    )
}
