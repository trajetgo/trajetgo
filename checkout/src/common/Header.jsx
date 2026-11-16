import { Link } from "react-router-dom";
import { CircleUser } from "lucide-react";
import Avatar from "../components/ui/Avatar";
import { useAuth } from "../contexts/auth.context";
import { PASSENGER_URL, AUTH_URL } from "../services/api";

import "../styles/common/Header.scss";


export default function Header({  onOpenUserMenu }) {
    const { isAuthenticated, user } = useAuth();

    return (
        <header
            className="app-header"
        >
            <div className="app-header__container">

                {/* Brand */}
                <Link to={PASSENGER_URL} className="app-header__brand">
                    <span className="app-header__brand-name">Trajet</span>
                    <span className="app-header__brand-accent">Go</span>
                </Link>

                {/* Actions */}
                <div className="app-header__actions">
                    {isAuthenticated ? (
                        <>
                            <Avatar
                                size="md"
                                src={user?.avatar}
                                name={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`}
                                onClick={onOpenUserMenu}
                            />
                        </>
                    ) : (
                        <a
                            href={`${AUTH_URL}/login?utm_source=${window.location.origin}`}
                            className="app-header__login"
                        >
                            <CircleUser size={20} />
                            <span>Connexion</span>
                        </a>
                    )}
                </div>

            </div>
        </header>
    )
}
