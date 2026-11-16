import { useState } from "react";
import { Plus, Route as RouteIcon, Search, X, AlertTriangle } from "lucide-react";

import Loading from "@shared/components/Loading";

import useRoutes from "../../hooks/useRoutes";
import RouteTable from "../../components/route/RouteTable";
import CreateRouteModal from "../../components/route/CreateRouteModal";

import { ROUTE_STATUS_FILTERS } from "../../utils/route.utils";

import "../../styles/pages/admin/Routes.scss";

/* ------------------------------------------------------------------ */

export default function Lines() {
    const {
        loading,
        routes,
        filteredRoutes,
        paginatedRoutes,

        search,
        setSearch,

        statusFilter,
        setStatusFilter,

        sort,
        handleSort,

        pagination,
        changePage,

        serverError,
        refresh,
    } = useRoutes();

    const [openModal, setOpenModal] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [selectedAction, setSelectedAction] = useState(null);

    /* ---------- État de chargement ---------- */

    if (loading) {
        return <Loading
            message="Chargement des lignes..."
        />;
    }

    const isEmpty = routes.length === 0;
    const hasNoResults = !isEmpty && filteredRoutes?.length === 0;

    const hasActiveFilters =
        Boolean(search) || statusFilter !== "ALL";

    const handleResetFilters = () => {
        setSearch("");
        setStatusFilter("ALL");
    };

    /* ---------- Rendu ---------- */

    return (
        <div className="routes">
            {/* ============================================
                HEADER
            ============================================ */}

            <header className="routes__header">
                <div>
                    <h1>Lignes</h1>
                    <p>Gérez les lignes des compagnies qui utilisent votre service.</p>
                </div>

                <button
                    type="button"
                    className="routes__create-button"
                    onClick={() => setOpenModal(true)}
                >
                    <Plus size={18} />
                    Ajouter une ligne
                </button>
            </header>

            {/* ============================================
                ERROR
            ============================================ */}

            {serverError && (
                <div className="routes__error" role="alert">
                    <AlertTriangle size={18} aria-hidden="true" />
                    {serverError}
                </div>
            )}

            {/* ============================================
                CONTENU
            ============================================ */}

            {isEmpty ? (
                <section className="routes__empty">
                    <RouteIcon size={42} aria-hidden="true" />
                    <h2>Aucune ligne</h2>
                    <p>
                        Commencez par ajouter une ligne à votre
                        compagnie.
                    </p>
                </section>
            ) : (
                <>
                    {/* ---------- Toolbar ---------- */}

                    <section className="routes__toolbar">
                        <div className="routes__search">
                            <Search size={18} aria-hidden="true" />

                            <input
                                type="search"
                                placeholder="Rechercher une ligne..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                aria-label="Rechercher une ligne"
                            />

                            {search && (
                                <button
                                    type="button"
                                    className="routes__search-clear"
                                    onClick={() => setSearch("")}
                                    aria-label="Effacer la recherche"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        <div className="routes__filter">
                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(e.target.value)
                                }
                                aria-label="Filtrer les lignes par statut"
                            >
                                {ROUTE_STATUS_FILTERS.map((filter) => (
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

                    {/* ---------- Résultat filtres ---------- */}

                    {hasActiveFilters && (
                        <div className="routes__result-info">
                            {filteredRoutes?.length} ligne
                            {filteredRoutes?.length > 1 ? "s" : ""} trouvée
                            {filteredRoutes?.length > 1 ? "s" : ""}
                        </div>
                    )}

                    {/* ---------- Table / Vide filtré ---------- */}

                    {hasNoResults ? (
                        <section className="routes__empty">
                            <RouteIcon size={42} aria-hidden="true" />
                            <h3>Aucune ligne trouvée</h3>
                            <p>
                                Aucune ligne ne correspond aux filtres
                                actuels.
                            </p>

                            <button
                                type="button"
                                className="routes__reset-button"
                                onClick={handleResetFilters}
                            >
                                Réinitialiser les filtres
                            </button>
                        </section>
                    ) : (
                        <section className="routes__card">
                            <RouteTable
                                routes={paginatedRoutes}
                                search={search}
                                sort={sort}
                                onSort={handleSort}
                                setSelectedAction={setSelectedAction}
                                setSelectedRoute={setSelectedRoute}
                            />
{/* 
                            <Pagination
                                pagination={pagination}
                                changePage={changePage}
                            /> */}
                        </section>
                    )}
                </>
            )}

            {/* ---------- Modaux ---------- */}

            <CreateRouteModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onCreated={refresh}
            />
        </div>
    );
}