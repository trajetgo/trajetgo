import { useState } from "react";
import { Plus, Search, Users, X, AlertTriangle } from "lucide-react";

import Loading from "@shared/components/Loading";
import Pagination from "@shared/components/ui/Pagination";

import useUsers from "../../hooks/useUsers";
import UserTable from "../../components/user/UserTable";
import InviteTeamMemberModal from "../../components/user/InviteTeamMemberModal";
import UserStatusModal from "../../components/user/UserStatusModal";
import UserRoleModal from "../../components/user/UserRoleModal";

import {
    USER_ROLE_FILTERS,
    USER_STATUS_FILTERS,
} from "../../utils/user.utils";

import UserDetailsModal from "../../components/user/UserDetailsModal";
import "../../styles/pages/admin/TeamMembers.scss";

/* ------------------------------------------------------------------ */

export default function TeamMembers() {
    const {
        loading,
        serverError,
        users,
        filteredUsers,
        paginatedUsers,

        counts,

        search,
        setSearch,

        statusFilter,
        setStatusFilter,

        roleFilter,
        setRoleFilter,

        sort,
        handleSort,

        pagination,
        changePage,

        updateStatus,
        updateRole,

        refresh,
    } = useUsers();

    const [openInviteModal, setOpenInviteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedAction, setSelectedAction] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    /* ---------- Loading ---------- */

    if (loading) {
        return <Loading message="Chargement du personnel..." />;
    }

    const isEmpty = users.length === 0;
    const hasNoResults = !isEmpty && filteredUsers.length === 0;

    const hasActiveFilters =
        Boolean(search) ||
        statusFilter !== "ALL" ||
        roleFilter !== "ALL";

    /* ---------- Handlers ---------- */

    const handleResetFilters = () => {
        setSearch("");
        setStatusFilter("ALL");
        setRoleFilter("ALL");
    };

    /* ---------- Rendu ---------- */

    return (
        <div className="team-members">
            {/* ---------- Header ---------- */}

            <header className="team-members__header">
                <div>
                    <h1>Personnel</h1>
                    <p>Gérez les utilisateurs de votre service.</p>
                </div>

                <button
                    type="button"
                    className="team-members__create-button"
                    onClick={() => setOpenInviteModal(true)}
                >
                    <Plus size={18} />
                    Inviter un membre
                </button>
            </header>

            {/* ---------- Erreur ---------- */}

            {serverError && (
                <div className="team-members__error" role="alert">
                    <AlertTriangle size={18} />
                    {serverError}
                </div>
            )}

            {/* ---------- Contenu ---------- */}

            {isEmpty ? (
                <section className="team-members__empty">
                    <Users size={42} />
                    <h2>Aucun membre</h2>
                    <p>
                        Commencez par inviter un membre à rejoindre
                        votre compagnie.
                    </p>
                </section>
            ) : (
                <>
                    {/* Toolbar */}
                    <section className="team-members__toolbar">
                        <div className="team-members__search">
                            <Search size={18} />
                            <input
                                type="search"
                                placeholder="Rechercher un membre..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch("")}
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>

                        <div className="team-members__filter">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                {USER_STATUS_FILTERS.map((f) => (
                                    <option key={f.value} value={f.value}>
                                        {f.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="team-members__filter">
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                            >
                                {USER_ROLE_FILTERS.map((f) => (
                                    <option key={f.value} value={f.value}>
                                        {f.label}
                                    </option>
                                ))}
                            </select>
                        </div>


                    </section>

                    {/* Résultat filtres */}
                    {hasActiveFilters && (
                        <div className="team-members__result-info">
                            {filteredUsers.length} membre
                            {filteredUsers.length > 1 ? "s" : ""} trouvé
                            {filteredUsers.length > 1 ? "s" : ""}
                        </div>
                    )}

                    {/* Table / Vide */}
                    {hasNoResults ? (
                        <section className="team-members__empty">
                            <Users size={42} />
                            <h3>Aucun membre trouvé</h3>
                            <p>
                                Aucun membre ne correspond aux filtres
                                actuels.
                            </p>
                            <button onClick={handleResetFilters}>
                                Réinitialiser les filtres
                            </button>
                        </section>
                    ) : (
                        <section className="team-members__card">
                            <UserTable
                                users={paginatedUsers}
                                search={search}
                                sort={sort}
                                onSort={handleSort}
                                setSelectedUser={setSelectedUser}
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

            {/* ---------- Modaux ---------- */}

            <UserDetailsModal
                open={!!selectedUser && selectedAction === "VIEW"}
                user={selectedUser}
                onClose={() => {
                    setSelectedUser(null);
                    setSelectedAction(null);
                }}
                onEditRole={(user) => {
                    setSelectedUser(user);
                    setSelectedAction("EDIT_ROLE");
                }}
                onEditStatus={(user) => {
                    setSelectedUser(user);
                    setSelectedAction("EDIT_STATUS");
                }}
            />

            <InviteTeamMemberModal
                open={openInviteModal}
                onClose={() => setOpenInviteModal(false)}
                onInvited={async () => {
                    await refresh();
                }}
            />

            <UserStatusModal
                open={
                    !!selectedUser &&
                    ["ACTIVATE", "DEACTIVATE", "SUSPEND"].includes(selectedAction)
                }
                user={selectedUser}
                action={selectedAction}
                loading={actionLoading}
                onClose={() => {
                    setSelectedUser(null);
                    setSelectedAction(null);
                }}
                onConfirm={async (status) => {
                    if (!selectedUser) return;

                    setActionLoading(true);

                    try {
                        await updateStatus(selectedUser.id, status);
                        setSelectedUser(null);
                        setSelectedAction(null);
                    } finally {
                        setActionLoading(false);
                    }
                }}
            />

            <UserRoleModal
                open={!!selectedUser && selectedAction === "EDIT_ROLE"}
                user={selectedUser}
                loading={actionLoading}
                onClose={() => {
                    setSelectedUser(null);
                    setSelectedAction(null);
                }}
                onConfirm={async (role) => {
                    if (!selectedUser) return;

                    setActionLoading(true);

                    try {
                        await updateRole(selectedUser.id, role);
                        setSelectedUser(null);
                        setSelectedAction(null);
                    } finally {
                        setActionLoading(false);
                    }
                }}
            />
        </div>
    );
}