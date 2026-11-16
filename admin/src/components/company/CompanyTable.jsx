import { BusFront } from "lucide-react";

import Table from "@shared/components/ui/Table";
import HighlightText from "@shared/components/ui/HighlightText";
import { formatDate } from "@shared/utils/date.utils";

import CompanyActions from "./CompanyActions";
import { COMPANY_STATUS } from "../../utils/company.utils";

import "../../styles/components/company/CompanyTable.scss";

export default function CompanyTable({
    companies,
    search,
    sort,
    onSort,
    setSelectedAction,
    setSelectedCompany,
}) {

    const formatStatus = (status) => {
        return (
            COMPANY_STATUS[status] || {
                class: "unknown",
                label: "Inconnu",
            }
        );
    };

    const columns = [
        {
            key: "name",
            label: "Nom",
            sortable: true,
            render: (_, company) => (
                <div className="company-table__name">
                    {company.logoUrl ? (
                        <BusFront size={32} />
                    ) : (
                        <img
                            width={40}
                            height={40}
                            src={company.logo}
                            alt={company.name}
                        />
                    )}

                    <HighlightText
                        as="strong"
                        text={company.name}
                        search={search}
                    />
                </div>
            )
        },

        {
            key: "legalName",
            label: "Nom légal",
            sortable: true,
            render: (_, company) => (
                <div className="company-table__legalName">
                    <HighlightText
                        as="span"
                        text={company.legalName}
                        search={search}
                    />
                </div>
            )
        },

        {
            key: "rccm",
            label: "Numéro RCCM",
            sortable: true,
            render: (_, company) => (
                <div className="company-table__registrationNumber">
                    <HighlightText
                        as="span"
                        text={company.registrationNumber}
                        search={search}
                    />
                </div>
            )
        },

        {
            key: "idu",
            label: "Identifiant Unique",
            sortable: true,
            render: (_, company) => (
                <div className="company-table__taxId">
                    <HighlightText
                        as="span"
                        text={company.taxId}
                        search={search}
                    />
                </div>
            )
        },

        {
            key: "email",
            label: "Email",
            sortable: true,
            render: (_, company) => (
                <span className="company-table__email">{company.email}</span>
            )
        },

        {
            key: "phone",
            label: "Téléphone",
            sortable: true,
            render: (_, company) => (
                <span className="company-table__phone">{company.phone}</span>
            )
        },

        {
            key: "cityId",
            label: "Ville siège",
            sortable: true,
            render: (_, company) => (
                <div
                    className="company-table__city"
                >
                    {company.city?.name}
                </div>
            )
        },

        {
            key: "status",
            label: "Statut",
            sortable: false,
            render: (_, company) => {
                const status = formatStatus(company.status);
                return (
                    <span className={`company-table__status company-table__status--${status.class}`}>
                        {status.label}
                    </span>
                );
            }
        },

        {
            key: "createdAt",
            label: "Ajouté le",
            sortable: true,
            render: (_, company) => (
                <div className="company-table__date">
                    <span>
                        {formatDate(
                            company.createdAt,
                            'dd MMM yyyy'
                        )}
                    </span>
                </div>
            ),
        },

        {
            key: "actions",
            label: "Actions",
            sortable:false,
            render: (_, company) => (
                <CompanyActions
                    company={company}
                    onView={(company) => {
                        setSelectedCompany(company);
                        setSelectedAction("VIEW");
                    }}
                    setSelectedAction={setSelectedAction}
                    setSelectedCompany={setSelectedCompany}
                />
            )
        }
    ];

    return (
        <Table
            className="company-table"
            selectable={false}
            columns={columns}
            data={companies}
            sortable
            onSort={onSort}
            defaultSort={sort}
            emptyMessage="Aucune entreprise trouvée."
            hoverable
            bordered
        />
    )
}
