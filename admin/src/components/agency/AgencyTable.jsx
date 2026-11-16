import { Building2 } from "lucide-react";

import Table from "@shared/components/ui/Table";
import HighlightText from "@shared/components/ui/HighlightText";
import { formatDate } from "@shared/utils/date.utils";

import AgencyActions from "./AgencyActions";
import { AGENCY_STATUS } from "../../utils/agency.utils";

import "../../styles/components/agency/AgencyTable.scss";

export default function AgencyTable({
    agencies,
    search,
    sort,
    onSort,
    setSelectedAction,
    setSelectedAgency,
    selectedRows = [],
    onToggleAll,
    onToggleRow,
}) {
    const formatStatus = (status) => {
        return (
            AGENCY_STATUS[status] || {
                class: "unknown",
                label: "Inconnu",
            }
        );
    };

    const columns = [
        {
            key: "name",
            label: "Agence",
            sortable: true,
            render: (_, agency) => (
                <div className="agency-table__name">
                    <Building2 size={18} />
                    <HighlightText
                        as="strong"
                        text={agency.name}
                        search={search}
                    />
                </div>
            ),
        },

        {
            key: "company",
            label: "Entrprise",
            sortable: true,
            render: (_, agency) => (
                <div className="agency-table__company">
                    <img
                        width={40}
                        height={40}
                        src={agency.company?.logo}
                        alt={agency.company?.name}
                    />
                    <HighlightText
                        as="strong"
                        text={agency.company?.name}
                        search={search}
                    />
                </div>
            ),
        },

        {
            key: "city",
            label: "Ville",
            sortable: true,
            render: (_, agency) => (
                <div className="agency-table__city">
                    <HighlightText
                        text={
                            agency?.city?.name ||
                            "—"
                        }
                        as="span"
                        search={search}
                    />
                </div>
            ),
        },

        {
            key: "phone",
            label: "Téléphone",
            sortable: true,
            render: (_, agency) => (
                <HighlightText
                    text={agency.phone || "—"}
                    as="span"
                    search={search}
                />
            ),
        },

        {
            key: "status",
            label: "Statut",
            sortable: true,
            render: (_, agency) => {
                const status = formatStatus(
                    agency.status
                );

                return (
                    <span
                        className={`badge badge--${status.class}`}
                    >
                        {status.label}
                    </span>
                );
            },
        },

        {
            key: "date",
            label: "Ajouté le",
            sortable: true,
            render: (_, agency) => (
                <div className="agency-table__date">
                    <span>
                        {formatDate(
                            agency.createdAt,
                            "dd MMM yyyy"
                        )}
                    </span>
                </div>
            ),
        },

        {
            key: "actions",
            label: "Actions",
            sortable: false,
            render: (_, agency) => (
                <AgencyActions
                    agency={agency}
                    onView={(agency) => {
                        setSelectedAgency(agency);
                        setSelectedAction("VIEW");
                    }}
                    setSelectedAction={setSelectedAction}
                    setSelectedAgency={setSelectedAgency}
                />
            ),
        },
    ];

    return (
        <Table
            className="agency-table"
            selectable={false}
            columns={columns}
            data={agencies}
            sortable
            onSort={onSort}
            defaultSort={sort}
            selectedRows={selectedRows}
            onToggleAll={onToggleAll}
            onToggleRow={onToggleRow}
            emptyMessage="Aucune agence trouvée."
            hoverable
            bordered
        />
    );
}