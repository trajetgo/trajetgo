import Table from "@shared/components/ui/Table";
import Avatar from "@shared/components/ui/Avatar";
import HighlightText from "@shared/components/ui/HighlightText";
import { formatDate } from "@shared/utils/date.utils";

import TeamActions from "./TeamActions";

import { formatRole, formatStatus } from "../../constants/team.constants";

import "../../styles/components/team/TeamTable.scss";


/* ------------------------------------------------------------------ */

export default function TeamTable({
    teams,
    search,
    sort,
    onSort,
    setSelectedAction,
    setSelectedMember,
}) {
    const columns = [
        {
            key: "firstName",
            label: "Membre",
            sortable: true,
            render: (_, member) => (
                <div className="team-table__member">
                    <Avatar
                        name={member?.fullName}
                        src={member?.avatarUrl}
                        size="md"
                    />

                    <div className="team-table__member-info">
                        <HighlightText
                            text={member?.fullName || "—"}
                            search={search}
                            as="strong"
                        />

                        {member.email && (
                            <HighlightText
                                text={member.email}
                                search={search}
                                as="span"
                            />
                        )}
                    </div>
                </div>
            ),
        },

        {
            key: "role",
            label: "Rôle",
            sortable: true,
            render: (_, member) => {
                const config = formatRole(member.role);

                return (
                    <span
                        className={`team-table__badge team-table__badge--role team-table__badge--role-${config.class}`}
                    >
                        {config.label}
                    </span>
                );
            },
        },

        {
            key: "agency",
            label: "Agence",
            sortable: true,
            render: (_, member) => {
                if (!member.agency) {
                    return <span className="team-table__muted">Compagnie</span>;
                }

                return (
                    <div className="team-table__agency">
                        <span>{member.agency.name}</span>
                        {member.agency.code && <small>{member.agency.code}</small>}
                    </div>
                );
            },
        },

        {
            key: "phone",
            label: "Téléphone",
            sortable: true,
            render: (_, member) => (
                <span>
                    <HighlightText
                        text={member.phone || "—"}
                        search={search}          // ← corrigé : "search" pas "highlight"
                    />
                </span>
            ),
        },

        {
            key: "status",
            label: "Statut",
            sortable: true,
            render: (_, member) => {
                const config = formatStatus(member.status);

                return (
                    <span
                        className={`team-table__badge team-table__badge--status team-table__badge--status-${config.class}`}
                    >
                        {config.label}
                    </span>
                );
            },
        },

        {
            key: "createdAt",
            label: "Ajouté le",
            sortable: true,
            render: (_, member) => (
                <span className="team-table__date">
                    {formatDate(member.createdAt, "dd MMM yyyy · HH:mm")}
                </span>
            ),
        },

        {
            key: "actions",
            label: "Actions",
            sortable: false,
            render: (_, member) => (
                <TeamActions
                    member={member}
                    onView={() => {
                        setSelectedMember(member);
                        setSelectedAction("VIEW");
                    }}
                    setSelectedAction={setSelectedAction}
                    setSelectedMember={setSelectedMember}
                />
            ),
        },
    ];

    return (
        <Table
            className="team-table"
            selectable={false}
            columns={columns}
            data={teams}
            sortable
            onSort={onSort}
            defaultSort={sort}
            emptyMessage="Aucun membre trouvé."
            hoverable
            bordered
        />
    );
}