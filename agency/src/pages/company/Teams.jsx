import { useState } from "react";
import { Plus, Search, Users, X } from "lucide-react";

import Loading from "@shared/components/Loading";

import TeamTable from "../../components/team/TeamTable";
import useTeams from "../../hooks/useTeamMembers";
import { ROLE_FILTERS, STATUS_FILTERS } from "../../utils/team.utils";
import InviteTeamMemberModal from "../../components/ticket/InviteTeamMemberModal";

import "../../styles/pages/company/Teams.scss";

export default function Teams() {
    const {
        loading,
        teams,
        filteredTeams,
        serverError,
        search,
        setSearch,
        statusFilter,
        setStatusFilter,
        roleFilter,
        setRoleFilter,
        sort,
        handleSort,
        updateRole,
        updateStatus,
        refresh,
    } = useTeams();

    const [selectedAction, setSelectedAction] = useState(null);
    const [selectedMember, setSelectedMember] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    if (loading) {
        return <Loading message="Chargement du personnel..." />;
    }

    const isEmpty = teams.length === 0;

    const hasActiveFilters =
        Boolean(search) || statusFilter !== "ALL" || roleFilter !== "ALL";

    const handleResetFilters = () => {
        setSearch("");
        setStatusFilter("ALL");
        setRoleFilter("ALL");
    };

    return (
        <div className="teams">
            {/* ---------- Header ---------- */}

            <header className="teams__header">
                <div>
                    <h1>Personnel</h1>
                    <p>Gérez le personnel de votre agence</p>
                </div>

                <button
                    type="button"
                    className="teams__create-button"
                    onClick={() => setOpenModal(true)}
                >
                    <Plus size={18} />
                    Ajouter un membre
                </button>
            </header>

            {/* ---------- Erreur ---------- */}

            {serverError && (
                <div className="teams__error" role="alert">
                    {serverError}
                </div>
            )}

            {/* ---------- Vide ---------- */}

            {isEmpty ? (
                <section className="teams__empty">
                    <Users size={42} />
                    <h2>Aucun membre</h2>
                    <p>
                        Commencez par ajouter un membre à votre compagnie.
                    </p>
                </section>
            ) : (
                <>
                    {/* ---------- Toolbar ---------- */}

                    <section className="teams__toolbar">
                        <div className="teams__search">
                            <Search size={18} aria-hidden="true" />

                            <input
                                type="search"
                                placeholder="Rechercher un membre..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                aria-label="Rechercher un membre"
                            />

                            {search && (
                                <button
                                    type="button"
                                    className="teams__search-clear"    
                                    onClick={() => setSearch("")}
                                    aria-label="Effacer la recherche"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        <div className="teams__filter">
                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(e.target.value)
                                }
                                aria-label="Filtrer les membres par statut"  
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

                        <div className="teams__filter">
                            <select
                                value={roleFilter}
                                onChange={(e) =>
                                    setRoleFilter(e.target.value)
                                }
                                aria-label="Filtrer les membres par rôle"     
                            >
                                {ROLE_FILTERS.map((filter) => (
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
                        <div className="teams__result-info">    {/* ✅ au lieu de trips__result-info */}
                            <span>
                                {filteredTeams.length} membre
                                {filteredTeams.length > 1 ? "s" : ""} trouvé
                                {filteredTeams.length > 1 ? "s" : ""}
                            </span>
                        </div>
                    )}

                    {/* ---------- Table / vide ---------- */}

                    {filteredTeams.length === 0 ? (
                        <section className="teams__empty">
                            <Users size={42} />
                            <h3>Aucun membre trouvé</h3>    {/* ✅ */}
                            <p>
                                Aucun membre ne correspond aux filtres
                                actuels.
                            </p>

                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    className="teams__reset-button"
                                    onClick={handleResetFilters}
                                >
                                    Réinitialiser les filtres
                                </button>
                            )}
                        </section>
                    ) : (
                        <section className="teams__card">
                            <TeamTable
                                teams={filteredTeams}
                                search={search}
                                sort={sort}
                                onSort={handleSort}
                                setSelectedAction={setSelectedAction}
                                setSelectedMember={setSelectedMember}
                            />
                        </section>
                    )}
                </>
            )}

            {/* ---------- Modal invitation ---------- */}

            <InviteTeamMemberModal
                open={openModal}
                onClose={() => setOpenModal(false)}  
                onInvited={refresh}                      
            />
        </div>
    );
}