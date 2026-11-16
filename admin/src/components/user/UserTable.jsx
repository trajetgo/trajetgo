import {
    Building2,
    Mail,
    Phone,
} from "lucide-react";

import Table from "@shared/components/ui/Table";
import Avatar from "@shared/components/ui/Avatar";
import HighlightText from "@shared/components/ui/HighlightText";

import UserActions from "./UserActions";

import {
    getUserRole,
    getUserStatus,
    getUserFullName,
} from "../../utils/user.utils";

import "../../styles/components/user/UserTable.scss";

/* ------------------------------------------------------------------ */

export default function UserTable({
    users,
    search,
    sort,
    onSort,
    setSelectedUser,
    setSelectedAction,
}) {
    /* =========================================================
       Colonnes
    ========================================================= */

    const columns = [
        /* -------- Membre (nom + contact) -------- */
        {
            key: "fullName",
            label: "Membre",
            sortable: true,
            render: (_, user) => {
                const fullName = getUserFullName(user);

                return (
                    <div className="user-table__user">
                        <Avatar name={fullName} src={user?.avatarUrl} size="sm" />

                        <div className="user-table__user-info">
                            <HighlightText
                                text={fullName}
                                search={search}
                                as="strong"
                            />

                            <div className="user-table__user-meta">
                                {user.email && (
                                    <span title={user.email}>
                                        <Mail
                                            size={12}
                                            aria-hidden="true"
                                        />
                                        {user.email}
                                    </span>
                                )}

                                {user.phone && (
                                    <span title={user.phone}>
                                        <Phone
                                            size={12}
                                            aria-hidden="true"
                                        />
                                        {user.phone}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                );
            },
        },

        /* -------- Rôle -------- */
        {
            key: "role",
            label: "Rôle",
            sortable: true,
            render: (_, user) => {
                const role = getUserRole(user.role);

                return (
                    <span
                        className={`user-table__badge user-table__badge--role-${role.className}`}
                    >
                        {role.label}
                    </span>
                );
            },
        },

        /* -------- Agence -------- */
        {
            key: "agency",
            label: "Agence",
            sortable: true,
            render: (_, user) => {
                if (!user.agency) {
                    return (
                        <span className="user-table__empty">—</span>
                    );
                }

                return (
                    <div className="user-table__agency">
                        <Building2
                            size={14}
                            aria-hidden="true"
                        />
                        <HighlightText
                            text={user.agency.name}
                            search={search}
                            as="span"
                        />
                    </div>
                );
            },
        },

        /* -------- Statut -------- */
        {
            key: "status",
            label: "Statut",
            sortable: true,
            render: (_, user) => {
                const status = getUserStatus(user.status);

                return (
                    <span
                        className={`user-table__badge user-table__badge--status-${status.className}`}
                    >
                        <span className="user-table__badge-dot" />
                        {status.label}
                    </span>
                );
            },
        },

        /* -------- Actions -------- */
        {
            key: "actions",
            label: "Actions",
            sortable: false,
            render: (_, user) => (
                <UserActions
                    user={user}
                    setSelectedUser={setSelectedUser}
                    setSelectedAction={setSelectedAction}
                />
            ),
        },
    ];

    /* =========================================================
       Rendu
    ========================================================= */

    return (
        <Table
            className="user-table"
            selectable={false}
            columns={columns}
            data={users}
            sortable
            onSort={onSort}
            defaultSort={sort}
            emptyMessage="Aucun membre trouvé."
            hoverable
            bordered
        />
    );
}