import { useState } from "react";
import { Plus, Search, X, BusFront } from "lucide-react";

import Loading from "@shared/components/Loading";

import useTrips from "../../hooks/useTrips";
import CreateTripModal from "../../components/trip/CreateTripModal";
import TripTable from "../../components/trip/TripTable";
import TripDetailsModal from "../../components/trip/TripDetailsModal";
import TripStatusModal from "../../components/trip/TripStatusModal";
import { STATUS_FILTERS } from "../../utils/trip.utils";

import "../../styles/pages/admin/Trips.scss";

export default function Trips() {
    const {
        loading,
        trips,
        filteredTrips,
        serverError,
        search,
        setSearch,
        statusFilter,
        setStatusFilter,
        sort,
        handleSort,
        updateStatus,
        refresh,
    } = useTrips();

    const [selectedAction, setSelectedAction] = useState(null);
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    if (loading) {
        return <Loading
            message="Chargement des voyages..."
        />;
    }

    const isEmpty = trips.length === 0;

    /* ---------- Confirmation d'action ---------- */

    const handleConfirmAction = async () => {
        if (!selectedAction) return;

        setActionLoading(true);

        try {
            await updateStatus(
                selectedAction.trip.id,
                selectedAction.action    // ✅ "START_BOARDING" | "DEPART" | ...
            );

            setSelectedAction(null);
            // ❌ Plus de refresh() ici — la mise à jour optimiste suffit
        } catch (err) {
            // Le toast est géré dans useTrips
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="trips">
            <header className="trips__header">
                <div>
                    <h1>Voyages</h1>
                    <p>Gérez les voyages de votre compagnie.</p>
                </div>

                <button
                    type="button"
                    className="trips__create-button"
                    onClick={() => setOpenModal(true)}
                >
                    <Plus size={18} />
                    Ajouter un voyage
                </button>
            </header>

            {serverError && (
                <div className="trips__error" role="alert">
                    {serverError}
                </div>
            )}

            {isEmpty ? (
                <section className="trips__empty">
                    <BusFront size={42} />
                    <h2>Aucun voyage</h2>
                    <p>
                        Commencez par ajouter un voyage à votre compagnie.
                    </p>
                </section>
            ) : (
                <>
                    <section className="trips__toolbar">
                        <div className="trips__search">
                            <Search size={18} aria-hidden="true" />
                            <input
                                type="search"
                                placeholder="Rechercher un voyage..."    /* ✅ */
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                aria-label="Rechercher un voyage"
                            />
                            {search && (
                                <button
                                    type="button"
                                    className="trips__search-clear"
                                    onClick={() => setSearch("")}
                                    aria-label="Effacer la recherche"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        <div className="trips__filter">
                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(e.target.value)
                                }
                                aria-label="Filtrer les voyages par statut"
                            >
                                {STATUS_FILTERS.map((filter) => (
                                    <option
                                        key={filter.value}
                                        value={filter.value}
                                    >
                                        {filter.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </section>

                    {(search || statusFilter !== "ALL") && (
                        <div className="trips__result-info">
                            <span>
                                {filteredTrips.length} voyage
                                {filteredTrips.length > 1 ? "s" : ""} trouvé
                                {filteredTrips.length > 1 ? "s" : ""}
                            </span>
                        </div>
                    )}

                    {filteredTrips.length === 0 ? (
                        <section className="trips__empty">
                            <BusFront size={42} />
                            <h3>Aucun voyage trouvé</h3>
                            <p>
                                Aucun voyage ne correspond aux filtres
                                actuels.
                            </p>

                            {(search || statusFilter !== "ALL") && (
                                <button
                                    type="button"
                                    className="trips__reset-button"
                                    onClick={() => {
                                        setSearch("");
                                        setStatusFilter("ALL");
                                    }}
                                >
                                    Réinitialiser les filtres
                                </button>
                            )}
                        </section>
                    ) : (
                        <section className="trips__card">
                            <TripTable
                                trips={filteredTrips}
                                search={search}
                                sort={sort}
                                onSort={handleSort}
                                setSelectedAction={setSelectedAction}
                                setSelectedTrip={setSelectedTrip}
                            />

                            {/* <Pagination /> */}
                        </section>
                    )}
                </>
            )}

            {/* ---------- CREATE ---------- */}

            <CreateTripModal
                isOpen={openModal}
                onClose={() => setOpenModal(false)}
                onCreated={refresh}
            />

            {/* ---------- DETAILS ---------- */}

            <TripDetailsModal
                open={!!selectedTrip}
                trip={selectedTrip}
                onClose={() => setSelectedTrip(null)}
            />

            {/* ---------- STATUS ACTION ---------- */}

            <TripStatusModal
                open={!!selectedAction}
                trip={selectedAction?.trip}
                action={selectedAction?.action}       // ✅ "action" pas "status"
                loading={actionLoading}
                onClose={() => setSelectedAction(null)}
                onConfirm={handleConfirmAction}
            />
        </div>
    );
}