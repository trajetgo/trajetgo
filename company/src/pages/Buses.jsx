import { useState } from "react";
import { BusFront, LayoutGrid, List, Plus, Search, X } from "lucide-react";

import Loading from "@shared/components/Loading";

import useBuses from "../hooks/useBuses";

import CreateBusModal from "../components/bus/CreateBusModal";
import EditBusModal from "../components/bus/EditBusModal";
import BusDetailsModal from "../components/bus/BusDetailsModal";
import BusStatusModal from "../components/bus/BusStatusModal";
import SeatLayoutModal from "../components/bus/SeatLayoutModal";

import BusList from "../components/bus/BusList";
import BusGrid from "../components/bus/BusGrid";


import { BUS_STATUS_FILTERS } from "../utils/bus.utils";

import "../styles/pages/Buses.scss";

/* ------------------------------------------------------------------ */

export default function Buses() {
    const {
        loading,
        buses,
        filteredBuses,
        serverError,

        search,
        setSearch,

        statusFilter,
        setStatusFilter,

        sort,
        handleSort,

        viewMode,
        changeViewMode,

        updateStatus,
        refresh,
    } = useBuses();

    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [selectedBus, setSelectedBus] = useState(null);
    const [selectedAction, setSelectedAction] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    /* ---------- Loading ---------- */

    if (loading) {
        return <Loading message="Chargement de la flotte..." />;
    }

    const isEmpty = buses.length === 0;

    const hasActiveFilters = Boolean(search) || statusFilter !== "ALL";

    const handleResetFilters = () => {
        setSearch("");
        setStatusFilter("ALL");
    };

    /* ---------- Handlers ---------- */

    const closeAllModals = () => {
        setSelectedBus(null);
        setSelectedAction(null);
    };

    const handleConfirmStatus = async () => {
        if (!selectedBus || !selectedAction) return;

        setActionLoading(true);

        try {
            await updateStatus(selectedBus.id, selectedAction);
            closeAllModals();
        } finally {
            setActionLoading(false);
        }
    };

    /* ---------- Render ---------- */

    return (
        <div className="buses">
            {/* ---------- Header ---------- */}

            <header className="buses__header">
                <div>
                    <h1>Bus</h1>
                    <p>Gérez votre flotte et la configuration des sièges.</p>
                </div>

                <button
                    type="button"
                    className="buses__create-button"
                    onClick={() => setOpenCreateModal(true)}
                >
                    <Plus size={18} />
                    Ajouter un bus
                </button>
            </header>

            {/* ---------- Erreur ---------- */}

            {serverError && (
                <div className="buses__error" role="alert">
                    {serverError}
                </div>
            )}

            {/* ---------- Vide ---------- */}

            {isEmpty ? (
                <section className="buses__empty">
                    <BusFront size={42} />
                    <h2>Aucun bus</h2>
                    <p>Commencez par ajouter un bus à votre flotte.</p>
                </section>
            ) : (
                <>
                    {/* ---------- Toolbar ---------- */}

                    <section className="buses__toolbar">
                        <div className="buses__search">
                            <Search size={18} aria-hidden="true" />

                            <input
                                type="search"
                                placeholder="Rechercher un bus..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                aria-label="Rechercher un bus"
                            />

                            {search && (
                                <button
                                    type="button"
                                    className="buses__search-clear"
                                    onClick={() => setSearch("")}
                                    aria-label="Effacer la recherche"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        <div className="buses__filter">
                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(e.target.value)
                                }
                                aria-label="Filtrer les bus par statut"
                            >
                                {BUS_STATUS_FILTERS.map((filter) => (
                                    <option key={filter.value} value={filter.value}>
                                        {filter.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="buses__view-toggle" role="tablist">
                            <button
                                type="button"
                                role="tab"
                                aria-selected={viewMode === "list"}
                                className={`agencies__view-btn ${viewMode === "list" ? "buses__view-btn--active" : ""
                                    }`}
                                onClick={() => changeViewMode("list")}
                                aria-label="Vue liste"
                            >
                                <List size={16} />
                            </button>

                            <button
                                type="button"
                                role="tab"
                                aria-selected={viewMode === "grid"}
                                className={`buses__view-btn ${viewMode === "grid" ? "buses__view-btn--active" : ""
                                    }`}
                                onClick={() => changeViewMode("grid")}
                                aria-label="Vue grille"
                            >
                                <LayoutGrid size={16} />
                            </button>
                        </div>
                    </section>

                    {/* ---------- Résultat filtres ---------- */}

                    {hasActiveFilters && (
                        <div className="buses__result-info">
                            <span>
                                {filteredBuses.length} bus trouvé
                                {filteredBuses.length > 1 ? "s" : ""}
                            </span>
                        </div>
                    )}

                    {/* ---------- Table / vide ---------- */}

                    {filteredBuses.length === 0 ? (
                        <section className="buses__empty">
                            <BusFront size={42} />
                            <h3>Aucun bus trouvé</h3>
                            <p>Aucun bus ne correspond aux filtres actuels.</p>

                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    className="buses__reset-button"
                                    onClick={handleResetFilters}
                                >
                                    Réinitialiser les filtres
                                </button>
                            )}
                        </section>
                    ) : (
                        <div className="buses__card">
                            {viewMode === "list" && (
                                <BusList
                                    buses={filteredBuses}
                                    search={search}
                                    sort={sort}
                                    onSort={handleSort}
                                    setSelectedAction={
                                        setSelectedAction
                                    }
                                    setSelectedBus={
                                        setSelectedBus
                                    }
                                />
                            )}

                            {viewMode === "grid" && (
                                <BusGrid
                                    buses={filteredBuses}
                                    search={search}
                                    sort={sort}
                                    onSort={handleSort}
                                    setSelectedAction={
                                        setSelectedAction
                                    }
                                    setSelectedBus={
                                        setSelectedBus
                                    }
                                />

                            )}
                        </div>
                    )}
                </>
            )}

            {/* ---------- Modaux ---------- */}

            <CreateBusModal
                open={openCreateModal}
                onClose={() => setOpenCreateModal(false)}
                onCreated={refresh}
            />

            <BusDetailsModal
                open={selectedAction === "VIEW"}
                bus={selectedBus}
                onClose={() => setSelectedBus(null)}
            />

            <SeatLayoutModal
                open={selectedAction === "MANAGE_SEATS"}
                bus={selectedBus}
                onClose={closeAllModals}
                onUpdated={refresh}
            />

            <EditBusModal
                open={selectedAction === "EDIT"}
                bus={selectedBus}
                onClose={closeAllModals}
                onUpdated={refresh}
            />

            <BusStatusModal
                open={selectedAction === "EDIT_STATUS"}
                bus={selectedBus}
                loading={actionLoading}
                onClose={closeAllModals}
                onConfirm={handleConfirmStatus}
            />
        </div>
    );
}