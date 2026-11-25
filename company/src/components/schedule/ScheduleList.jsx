import ScheduleTable from './ScheduleTable'

export default function ScheduleList({
    schedules,
    search,
    sort,
    onSort,
    setSelectedSchedule,
    setSelectedAction
}) {

    if (!schedules || schedules.length === 0) return;

    return (
        <ScheduleTable
            schedules={schedules}
            search={search}
            sort={sort}
            onSort={onSort}
            setSelectedSchedule={setSelectedSchedule}
            setSelectedAction={setSelectedAction}
        />
    )
}
