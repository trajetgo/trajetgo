import { Search, X } from "lucide-react";

const STATUS_FILTERS = [
    { value: "ALL", label: "Toutes" },
    { value: "ACTIVE", label: "Actives" },
    { value: "PAUSED", label: "En pause" },
    { value: "EXPIRED", label: "Expirées" },
];

export default function ScheduleFilters({
    search,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    counts,
}) {
    return (
        <section className="schedule-filters">
            {/* ---------- Recherche ---------- */}

            <div className="schedule-filters__search">
                <Search size={16} aria-hidden="true" />

                <input
                    type="search"
                    placeholder="Rechercher une programmation..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    aria-label="Rechercher une programmation"
                />

                {search && (
                    <button
                        type="button"
                        className="schedule-filters__search-clear"
                        onClick={() => onSearchChange("")}
                        aria-label="Effacer la recherche"
                    >
                        <X size={14} />
                    </button>
                )}
            </div>

            {/* ---------- Filtre statut ---------- */}

            <div
                className="schedule-filters__tabs"
                role="tablist"
                aria-label="Filtrer par statut"
            >
                {STATUS_FILTERS.map((filter) => {
                    const count =
                        filter.value === "ALL"
                            ? counts?.all ?? 0
                            : counts?.[filter.value.toLowerCase()] ?? 0;

                    const isActive = statusFilter === filter.value;

                    return (
                        <button
                            key={filter.value}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            className={`schedule-filters__tab ${isActive
                                    ? "schedule-filters__tab--active"
                                    : ""
                                }`}
                            onClick={() =>
                                onStatusFilterChange(filter.value)
                            }
                        >
                            {filter.label}
                            <span className="schedule-filters__count">
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}