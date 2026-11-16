import { Building2 } from "lucide-react";

import { formatDate } from "@shared/utils/date.utils";
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
                <div className="agency-table__agency">
                    <div className="agency-table__icon">
                        <Building2 size={18} />
                    </div>

                    <div className="agency-table__info">
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
                        agency?.city?.name ||
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
            render: (_, agency) => (
                <span>
                    {formatDate(agency.updatedAt, "dd MMM yyyy · HH:mm")}
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
            emptyMessage="Aucune agence trouvée."
            hoverable
            bordered
        />
    );
}