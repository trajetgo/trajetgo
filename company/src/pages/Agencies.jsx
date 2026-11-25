import { useState } from "react";
import {
    Plus,
    Search,
    Building2,
    X,
    List,
    LayoutGrid,
} from "lucide-react";

import Loading from "@shared/components/Loading";

import useAgencies from "../hooks/useAgencies";
import CreateAgencyModal from "../components/agency/CreateAgencyModal";
import AgencyDetailsModal from "../components/agency/AgencyDetailsModal";
import AgencyStatusModal from "../components/agency/AgencyStatusModal";

import { STATUS_FILTERS } from "../utils/agency.utils";

import AgencyList from "../components/agency/AgencyList";
import AgencyGrid from "../components/agency/AgencyGrid";

import "../styles/pages/Agencies.scss";

export default function Agencies() {
    const {
        loading,
        serverError,

        agencies,
        filteredAgencies,

        counts,

        search,
        setSearch,

        sort,
        handleSort,

        viewMode,
        changeViewMode,

        statusFilter,
        setStatusFilter,

        updateStatus,

        refresh,
    } = useAgencies();

    const [selectedAction, setSelectedAction] = useState(null);

    const [selectedAgency, setSelectedAgency] = useState(null);

    const [openModal, setOpenModal] = useState(false);

    if (loading) {
        return (
            <Loading
                message="Chargement des agences..."
            />
        );
    }

    const isEmpty = agencies.length === 0;

    return (
        <div className="agencies">

            {/* =====================================================
                HEADER
            ===================================================== */}

            <header className="agencies__header">

                <div>
                    <h1>Agences</h1>

                    <p>
                        Gérez les agences de votre compagnie.
                    </p>
                </div>

                <button
                    type="button"
                    className="agencies__create-button"
                    onClick={() => setOpenModal(true)}
                >
                    <Plus size={18} />
                    Ajouter une agence
                </button>

            </header>


            {/* =====================================================
                ERROR
            ===================================================== */}

            {serverError && (
                <div
                    className="agencies__error"
                    role="alert"
                >
                    {serverError}
                </div>
            )}


            {/* =====================================================
                EMPTY INITIAL STATE
            ===================================================== */}

            {isEmpty ? (
                <section className="agencies__empty">

                    <Building2 size={42} />

                    <h2>
                        Aucune agence
                    </h2>

                    <p>
                        Commencez par ajouter une agence
                        à votre compagnie.
                    </p>

                </section>
            ) : (

                <>
                    {/* =================================================
                        FILTERS
                    ================================================= */}

                    <section className="agencies__toolbar">

                        <div className="agencies__search">

                            <Search
                                size={18}
                                aria-hidden="true"
                            />

                            <input
                                type="search"
                                placeholder="Rechercher une agence..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                                aria-label="Rechercher une agence"
                            />

                            {search && (
                                <button
                                    type="button"
                                    className="agencies__search-clear"
                                    onClick={() =>
                                        setSearch("")
                                    }
                                    aria-label="Effacer la recherche"
                                >
                                    <X size={16} />
                                </button>
                            )}

                        </div>


                        <div className="agencies__filter">

                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(
                                        e.target.value
                                    )
                                }
                                aria-label="Filtrer les agences par statut"
                            >
                                {STATUS_FILTERS.map(
                                    (filter) => (
                                        <option
                                            key={filter.value}
                                            value={filter.value}
                                        >
                                            {filter.label}
                                        </option>
                                    )
                                )}
                            </select>

                        </div>

                        <div className="agencies__view-toggle" role="tablist">
                            <button
                                type="button"
                                role="tab"
                                aria-selected={viewMode === "list"}
                                className={`agencies__view-btn ${viewMode === "list" ? "agencies__view-btn--active" : ""
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
                                className={`agencies__view-btn ${viewMode === "grid" ? "agencies__view-btn--active" : ""
                                    }`}
                                onClick={() => changeViewMode("grid")}
                                aria-label="Vue grille"
                            >
                                <LayoutGrid size={16} />
                            </button>
                        </div>

                    </section>


                    {/* =================================================
                        FILTER RESULT
                    ================================================= */}

                    {(search ||
                        statusFilter !== "ALL") && (
                            <div className="agencies__result-info">

                                <span>
                                    {filteredAgencies.length}{" "}
                                    agence
                                    {filteredAgencies.length > 1
                                        ? "s"
                                        : ""}{" "}
                                    trouvée
                                    {filteredAgencies.length > 1
                                        ? "s"
                                        : ""}
                                </span>

                            </div>
                        )}


                    {/* =================================================
                        TABLE / EMPTY SEARCH
                    ================================================= */}

                    {filteredAgencies.length === 0 ? (

                        <section className="agencies__empty">

                            <Building2 size={42} />

                            <h3>
                                Aucune agence trouvée
                            </h3>

                            <p>
                                Aucune agence ne correspond
                                aux filtres actuels.
                            </p>

                        </section>

                    ) : (

                        <section className="agencies__card">

                            {viewMode === "list" && (
                                <AgencyList
                                    agencies={filteredAgencies}
                                    search={search}
                                    sort={sort}
                                    onSort={handleSort}
                                    setSelectedAction={
                                        setSelectedAction
                                    }
                                    setSelectedAgency={
                                        setSelectedAgency
                                    }
                                />
                            )}

                            {viewMode === "grid" && (
                                <AgencyGrid
                                    agencies={filteredAgencies}
                                    search={search}
                                    sort={sort}
                                    onSort={handleSort}
                                    setSelectedAction={
                                        setSelectedAction
                                    }
                                    setSelectedAgency={
                                        setSelectedAgency
                                    }
                                />

                            )}

                        </section>
                    )}
                </>
            )}


            {/* =====================================================
                CREATE
            ===================================================== */}

            <CreateAgencyModal
                isOpen={openModal}
                onClose={() =>
                    setOpenModal(false)
                }
                onCreated={refresh}
            />


            {/* =====================================================
                DETAILS
            ===================================================== */}

            <AgencyDetailsModal
                open={!!selectedAgency}
                agency={selectedAgency}
                onClose={() =>
                    setSelectedAgency(null)
                }
            />


            {/* =====================================================
                STATUS ACTION
            ===================================================== */}

            <AgencyStatusModal
                open={!!selectedAction}
                agency={
                    selectedAction?.agency
                }
                action={
                    selectedAction?.status
                }
                onClose={() =>
                    setSelectedAction(null)
                }
                onConfirm={async () => {

                    if (!selectedAction) {
                        return;
                    }

                    await updateStatus(
                        selectedAction.agency.id,
                        selectedAction.status
                    );

                    setSelectedAction(null);
                    await refresh();
                }}
            />
        </div>
    );
}