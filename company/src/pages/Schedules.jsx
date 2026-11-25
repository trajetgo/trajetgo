import { useState } from "react";
import {
    CalendarClock,
    Plus,
    Search,
    AlertTriangle,
    LayoutGrid,
    List,
    X,
} from "lucide-react";

import Loading from "@shared/components/Loading";
import Pagination from "@shared/components/ui/Pagination";
import Empty from "@shared/components/feedback/Empty";

import useSchedules from "../hooks/useSchedules";
import ScheduleTable from "../components/schedule/ScheduleTable";
import ScheduleList from "../components/schedule/ScheduleList";
import ScheduleGrid from "../components/schedule/ScheduleGrid";
import CreateScheduleModal from "../components/schedule/CreateScheduleModal";

import { STATUS_FILTERS } from "../constants/schedule.constants";


import "../styles/pages/Schedules.scss";

/* ------------------------------------------------------------------ */

export default function Schedules() {
    const [openModal, setOpenModal] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [selectedAction, setSelectedAction] = useState(null);

    const {
        loading,
        schedules,
        filteredSchedules,
        paginatedSchedules,
        counts,
        serverError,

        search,
        setSearch,

        statusFilter,
        setStatusFilter,

        sort,
        handleSort,

        viewMode,
        changeViewMode,

        pagination,
        changePage,

        refresh,
    } = useSchedules();

    /* ---------- Handlers ---------- */

    const handleResetFilters = () => {
        setSearch("");
        setStatusFilter("ALL");
    };

    const hasActiveFilters = Boolean(search) || statusFilter !== "ALL";

    /* ---------- Loading ---------- */

    if (loading) {
        return <Loading message="Chargement des programmations..." />;
    }

    const isEmpty = schedules.length === 0;
    const hasNoResults = !isEmpty && filteredSchedules.length === 0;

    /* ---------- Rendu ---------- */

    return (
        <div className="schedules">
            {/* ---------- Header ---------- */}

            <header className="schedules__header">
                <div>
                    <h1>Programmation</h1>
                    <p>
                        Configurez les horaires récurrents de vos
                        voyages.
                    </p>
                </div>

                <button
                    type="button"
                    className="schedules__create-button"
                    onClick={() => setOpenModal(true)}
                >
                    <Plus size={18} />
                    Nouvelle programmation
                </button>
            </header>

            {/* ---------- Erreur ---------- */}

            {serverError && (
                <div className="schedules__error" role="alert">
                    <AlertTriangle size={18} aria-hidden="true" />
                    {serverError}
                </div>
            )}

            {/* ---------- Contenu ---------- */}

            {isEmpty ? (
                <Empty
                    icon={CalendarClock}
                    title="Aucune programmation"
                    text="Commencez par ajouter une programmation pour vos voyages récurrents."
                />
            ) : (
                <>
                    {/* ---------- Filtres ---------- */}

                    <section className="schedules__toolbar">
                        {/* ---------- Recherche ---------- */}

                        <div className="schedules__search">
                            <Search size={16} aria-hidden="true" />

                            <input
                                type="search"
                                placeholder="Rechercher une programmation..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                aria-label="Rechercher une programmation"
                            />

                            {search && (
                                <button
                                    type="button"
                                    className="schedule-filters__search-clear"
                                    onClick={() => setSearch("")}
                                    aria-label="Effacer la recherche"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        {/* ---------- Filtre statut ---------- */}

                        <div
                            className="schedules__filter"
                            role="tablist"
                            aria-label="Filtrer par statut"
                        >
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

                    {/* ---------- Résultat filtres ---------- */}

                    {hasActiveFilters && (
                        <div className="schedules__result-info">
                            {filteredSchedules.length} programmation
                            {filteredSchedules.length > 1 ? "s" : ""}{" "}
                            trouvée
                            {filteredSchedules.length > 1 ? "s" : ""}
                        </div>
                    )}

                    {/* ---------- Tableau / Vide ---------- */}

                    {hasNoResults ? (
                        <section className="schedules__empty">
                            <Search size={42} aria-hidden="true" />

                            <h3>Aucune programmation trouvée</h3>

                            <p>
                                Aucune programmation ne correspond aux
                                filtres actuels.
                            </p>

                            <button
                                type="button"
                                className="schedules__reset-button"
                                onClick={handleResetFilters}
                            >
                                Réinitialiser les filtres
                            </button>
                        </section>
                    ) : (
                        <section className="schedules__card">
                            {viewMode === "list" && (
                                <ScheduleList
                                    schedules={filteredSchedules}
                                    search={search}
                                    sort={sort}
                                    onSort={handleSort}
                                    setSelectedAction={
                                        setSelectedAction
                                    }
                                    setSelectedSchedule={
                                        setSelectedSchedule
                                    }
                                />
                            )}

                            {viewMode === "grid" && (
                                <ScheduleGrid
                                    schedules={filteredSchedules}
                                    search={search}
                                    sort={sort}
                                    onSort={handleSort}
                                    setSelectedAction={
                                        setSelectedAction
                                    }
                                    setSelectedSchedule={
                                        setSelectedSchedule
                                    }
                                />

                            )}

                            <Pagination
                                pagination={pagination}
                                changePage={changePage}
                            />
                        </section>
                    )}
                </>
            )}

            {/* ---------- Modal ---------- */}

            <CreateScheduleModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onCreated={async () => {
                    setOpenModal(false);
                    await refresh();
                }}
            />
        </div>
    );
}