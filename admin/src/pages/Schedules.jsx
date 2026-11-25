import { useState } from "react";
import {
    CalendarClock,
    Plus,
    Search,
    AlertTriangle,
} from "lucide-react";

import Loading from "@shared/components/Loading";
import Pagination from "@shared/components/ui/Pagination";

import useSchedules from "../hooks/useSchedules";
import ScheduleFilters from "../components/schedule/ScheduleFilters";
import ScheduleTable from "../components/schedule/ScheduleTable";
import CreateScheduleModal from "../components/schedule/CreateScheduleModal";

import "../styles/pages/admin/Schedules.scss";

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
        return <Loading
            message="Chargement des programmations..."
        />;
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
                        Configurez les horaires récurrents des
                        voyages des compagnies qui utilisent votre service.
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
                <section className="schedules__empty">
                    <CalendarClock size={42} aria-hidden="true" />

                    <h2>Aucune programmation</h2>

                    <p>
                        Commencez par ajouter une programmation pour
                        vos voyages récurrents.
                    </p>
                </section>
            ) : (
                <>
                    {/* ---------- Filtres ---------- */}

                    <ScheduleFilters
                        search={search}
                        onSearchChange={setSearch}
                        statusFilter={statusFilter}
                        onStatusFilterChange={setStatusFilter}
                        counts={counts}
                    />

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
                            <ScheduleTable
                                schedules={paginatedSchedules}
                                search={search}
                                sort={sort}
                                onSort={handleSort}
                                setSelectedSchedule={setSelectedSchedule}
                                setSelectedAction={setSelectedAction}
                            />

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