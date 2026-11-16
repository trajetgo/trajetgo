import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

export default function SortableHeader({ label, sortKey, sort, onSort }) {
    const active = sort.key === sortKey;

    return (
        <th>
            <button
                type="button"
                className="admin-table__sort-btn"
                onClick={() => onSort(sortKey)}
            > <span>{label}</span>
                {active
                    ? (sort.direction === 'asc'
                        ? <ArrowUp size={14} />
                        : <ArrowDown size={14} />)
                    : (
                        <ArrowUpDown size={14} />
                    )}
            </button>
        </th>
    );
}
