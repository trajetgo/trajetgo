import BusTable from './BusTable'

export default function BusList({
    buses,
    search,
    sort,
    onSort,
    onView,
    setSelectedAction,
    setSelectedBus,
}) {

    if (!buses || buses.length === 0) return null;

    return (
        <BusTable
            buses={buses}
            search={search}
            sort={sort}
            onSort={onSort}
            setSelectedAction={setSelectedAction}
            setSelectedBus={setSelectedBus}
        />
    )
}
