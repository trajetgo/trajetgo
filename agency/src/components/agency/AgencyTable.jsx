import { Building2 } from "lucide-react";

import Table from "@shared/components/ui/Table";
import HighlightText from "@shared/components/ui/HighlightText";

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
                <div className="agency-cell">
                    <div className="agencies__icon">
                        <Building2 size={18} />
                    </div>

                    <div className="agency-cell__content">
                        <HighlightText
                            as="strong"
                            text={agency.name}
                            search={search}
                        />
                    </div>
                </div>
            ),
        },

        {
            key: "city",
            label: "Ville",
            sortable: true,
            render: (_, agency) => (
                <HighlightText
                    text={
                        agency.location?.city?.name ||
                        "—"
                    }
                    as="span"
                    search={search}
                />
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
            sortable: false,
            render:(_, agency) => (
                <span>
                    {agency.createdAt}
                </span>
            )
        },

        {
            key: "actions",
            label: "Actions",
            sortable: false,
            render: (_, agency) => (
                <AgencyActions
                    agency={agency}
                    onView={setSelectedAgency}
                    setSelectedAction={setSelectedAction}
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