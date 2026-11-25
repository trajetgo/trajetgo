import TeamTable from './TeamTable';

export default function TeamList({
    teams,
    search,
    sort,
    onSort,       
    setSelectedAction,
    setSelectedMember,
}) {
    if (!teams || teams.length === 0) return null;

    return (
        <TeamTable
            teams={teams}
            search={search}
            sort={sort}
            onSort={onSort}   
            setSelectedAction={setSelectedAction}
            setSelectedMember={setSelectedMember}
        />
    );
}
