import AgencyTable from './AgencyTable'

export default function AgencyList({
    agencies,
    search,
    sort,
    handleSort,
    setSelectedAction,
    setSelectedAgency
}) {
    if (!agencies || agencies.length === 0) return null;

    return (
        <AgencyTable
            agencies={agencies}
            search={search}
            sort={sort}
            onSort={handleSort}
            setSelectedAction={setSelectedAction}
            setSelectedAgency={setSelectedAgency}
        />
    )
}
