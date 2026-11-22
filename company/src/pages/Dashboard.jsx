import { useNavigate } from "react-router-dom";
import {
    Plus,
    RefreshCw,
    Bus,
    Route as RouteIcon,
    Ticket,
    Users,
    Building2,
    CalendarClock,
    Wallet,
    TrendingUp,
    AlertTriangle,
    ArrowRight,
    Clock,
    MapPin,
} from "lucide-react";

import Loading from "@shared/components/Loading";

import useDashboard from "../hooks/useDashboard";

import "../styles/pages/Dashboard.scss";

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function formatPrice(value) {
    return new Intl.NumberFormat("fr-FR").format(value ?? 0);
}

function formatDate(value) {
    if (!value) return "—";

    return new Date(value).toLocaleDateString("fr-FR", {
        weekday: "short",
        day: "2-digit",
        month: "short",
    });
}

function formatTime(value) {
    if (!value) return "—";

    return new Date(value).toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

/* ------------------------------------------------------------------ */
/* KPI Card                                                            */
/* ------------------------------------------------------------------ */

function KpiCard({ label, value, icon: Icon, variant = "", hint }) {
    return (
        <article className={`dashboard-kpi ${variant}`}>
            <div className="dashboard-kpi__icon">
                <Icon size={20} />
            </div>

            <div className="dashboard-kpi__body">
                <span className="dashboard-kpi__label">{label}</span>
                <strong className="dashboard-kpi__value">{value}</strong>
                {hint && <span className="dashboard-kpi__hint">{hint}</span>}
            </div>
        </article>
    );
}

/* ------------------------------------------------------------------ */
/* Prochain départ                                                     */
/* ------------------------------------------------------------------ */

function UpcomingTripRow({ trip }) {
    return (
        <li className="dashboard-trip">
            <div className="dashboard-trip__time">
                <strong>{formatTime(trip.departureAt)}</strong>
                <span>{formatDate(trip.departureAt)}</span>
            </div>

            <div className="dashboard-trip__main">
                <div className="dashboard-trip__route">
                    <span>{trip.origin ?? "—"}</span>
                    <ArrowRight size={13} aria-hidden="true" />
                    <span>{trip.destination ?? "—"}</span>
                </div>

                <div className="dashboard-trip__meta">
                    <span>
                        <Bus size={12} />
                        {trip.busName ?? "—"}
                    </span>
                    <span>
                        <MapPin size={12} />
                        {trip.departureAgency ?? "—"}
                    </span>
                </div>
            </div>

            <div className="dashboard-trip__seats">
                <span>{trip.bookedSeats ?? 0}</span>
                <small>/ {trip.totalSeats ?? 0}</small>
            </div>
        </li>
    );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function Dashboard() {
    const navigate = useNavigate();
    const { summary, loading, error, refresh } = useDashboard();

    const handleOrganizationSync = () => {
        navigate("/integrations/tgtl");
    };

    const handleNewDeparture = () => {
        navigate("/schedules");
    };

    if (loading) {
        return <Loading message="Chargement du tableau de bord..." />;
    }

    if (error) {
        return (
            <div className="dashboard">
                <div className="dashboard__error" role="alert">
                    <AlertTriangle size={18} />
                    <p>{error}</p>
                    <button type="button" onClick={refresh}>
                        <RefreshCw size={15} />
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    const kpis = summary?.kpis ?? {};
    const alerts = summary?.alerts ?? [];
    const upcomingTrips = summary?.upcomingTrips ?? [];

    return (
        <div className="dashboard">
            <div className="dashboard__container">

                {/* ---------- En-tête ---------- */}

                <header className="dashboard__header">
                    <div className="dashboard__heading">
                        <h3>Direction Compagnie de Transport</h3>
                        <p>
                            Supervisez l'ensemble de vos activités de transport :
                            gestion des agences, programmation des voyages,
                            billetterie, parc automobile et suivi des performances.
                        </p>
                    </div>

                    <div className="dashboard__actions">
                        <button
                            type="button"
                            className="dashboard__sync"
                            onClick={handleOrganizationSync}
                        >
                            <RefreshCw size={17} />
                            <span>Synchroniser mon organisation</span>
                        </button>

                        <button
                            type="button"
                            className="dashboard__create"
                            onClick={handleNewDeparture}
                        >
                            <Plus size={17} />
                            Nouveau départ
                        </button>
                    </div>
                </header>

                {/* ---------- KPI ---------- */}

                <section className="dashboard__kpis" aria-label="Indicateurs clés">
                    <KpiCard
                        label="Départs aujourd'hui"
                        value={kpis.todayTrips ?? 0}
                        icon={CalendarClock}
                        hint={`${kpis.todayBookedSeats ?? 0} places réservées`}
                    />

                    <KpiCard
                        label="Chiffre d'affaires du jour"
                        value={`${formatPrice(kpis.todayRevenue)} FCFA`}
                        icon={Wallet}
                        variant="is-accent"
                    />

                    <KpiCard
                        label="Taux de remplissage"
                        value={`${Math.round((kpis.todayOccupancy ?? 0) * 100)} %`}
                        icon={TrendingUp}
                    />

                    <KpiCard
                        label="Bus actifs"
                        value={kpis.activeBuses ?? 0}
                        icon={Bus}
                        hint={`${kpis.totalBuses ?? 0} au total`}
                    />

                    <KpiCard
                        label="Lignes actives"
                        value={kpis.activeRoutes ?? 0}
                        icon={RouteIcon}
                    />

                    <KpiCard
                        label="Agences"
                        value={kpis.agencies ?? 0}
                        icon={Building2}
                    />

                    <KpiCard
                        label="Réservations du jour"
                        value={kpis.todayBookings ?? 0}
                        icon={Ticket}
                    />

                    <KpiCard
                        label="Personnel"
                        value={kpis.staff ?? 0}
                        icon={Users}
                    />
                </section>

                {/* ---------- Alertes ---------- */}

                {alerts.length > 0 && (
                    <section className="dashboard__alerts" aria-label="Alertes">
                        {alerts.map((alert) => (
                            <div
                                key={alert.id}
                                className={`dashboard-alert dashboard-alert--${alert.severity ?? "info"}`}
                            >
                                <AlertTriangle size={16} />
                                <span>{alert.message}</span>

                                {alert.action && (
                                    <button
                                        type="button"
                                        onClick={() => navigate(alert.action.to)}
                                    >
                                        {alert.action.label}
                                    </button>
                                )}
                            </div>
                        ))}
                    </section>
                )}

                {/* ---------- Prochains départs ---------- */}

                <section className="dashboard__section">
                    <header className="dashboard__section-header">
                        <h2>Prochains départs</h2>

                        <button
                            type="button"
                            className="dashboard__link"
                            onClick={() => navigate("/trips")}
                        >
                            Voir tous les départs
                            <ArrowRight size={14} />
                        </button>
                    </header>

                    {upcomingTrips.length === 0 ? (
                        <div className="dashboard__empty">
                            <Clock size={32} />
                            <p>Aucun départ programmé dans les prochaines 24 heures.</p>
                            <button
                                type="button"
                                onClick={() => navigate("/schedules")}
                            >
                                Créer une programmation
                            </button>
                        </div>
                    ) : (
                        <ul className="dashboard-trips">
                            {upcomingTrips.map((trip) => (
                                <UpcomingTripRow key={trip.id} trip={trip} />
                            ))}
                        </ul>
                    )}
                </section>

                {/* ---------- Raccourcis ---------- */}

                <section className="dashboard__section">
                    <header className="dashboard__section-header">
                        <h2>Accès rapides</h2>
                    </header>

                    <div className="dashboard__shortcuts">
                        <button type="button" onClick={() => navigate("/schedules")}>
                            <CalendarClock size={20} />
                            <div>
                                <strong>Programmations</strong>
                                <span>Gérer les horaires récurrents</span>
                            </div>
                        </button>

                        <button type="button" onClick={() => navigate("/trips")}>
                            <Bus size={20} />
                            <div>
                                <strong>Départs</strong>
                                <span>Voyages datés et affectation bus</span>
                            </div>
                        </button>

                        <button type="button" onClick={() => navigate("/agencies")}>
                            <Building2 size={20} />
                            <div>
                                <strong>Agences</strong>
                                <span>Points de vente et guichets</span>
                            </div>
                        </button>

                        <button type="button" onClick={() => navigate("/staff")}>
                            <Users size={20} />
                            <div>
                                <strong>Personnel</strong>
                                <span>Agents, contrôleurs, invitations</span>
                            </div>
                        </button>
                    </div>
                </section>

            </div>
        </div>
    );
}