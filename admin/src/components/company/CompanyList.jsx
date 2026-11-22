import CompanyTable from './CompanyTable';

export default function CompanyList({
    companies,
    paginatedCompanies,
    search,
    setSelectedAction,
    setSelectedCompany,
    sort,
    onSort
}) {
    if (!companies || companies.length === 0) {
        return null;
    }

    return (
        <CompanyTable
            companies={paginatedCompanies}
            search={search}
            sort={sort}
            onSort={onSort}
            setSelectedAction={setSelectedAction}
            setSelectedCompany={setSelectedCompany}
        />
    )
}
