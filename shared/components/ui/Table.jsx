import React, { useState } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import ActivityIndicator from './ActivityIndicator';
import '../../styles/components/ui/Table.scss';

export default function Table({
    columns = [],
    data = [],
    loading = false,
    emptyMessage = 'Aucune donnée disponible',
    className = '',
    onSelectAll = null,
    selectedAll = false,
    pagination = null,
    onPageChange = null,
    onLimitChange = null,
    pageSize = 10,
    total = 0,
    currentPage = 1,
    sortable = true,
    onSort = null,
    defaultSort = null,
    rowClassName = null,
    onRowClick = null,
    striped = true,
    hoverable = true,
    bordered = false,
    compact = false,
}) {
    const [sortConfig, setSortConfig] = useState(defaultSort || {
        key: null,
        direction: 'asc',
    });

    // Gestion du tri
    const handleSort = (key) => {
        if (!sortable) return;

        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }

        const newSortConfig = { key, direction };
        console.log('🔄 [Table] handleSort:', newSortConfig);
        setSortConfig(newSortConfig);

        if (onSort) {
            onSort(newSortConfig);
        }
    };

    // Gestion de la pagination
    const handlePageChange = (page) => {
        console.log('📄 [Table] handlePageChange:', page);
        if (onPageChange) {
            onPageChange(page);
        }
    };

    const handleLimitChange = (e) => {
        const limit = parseInt(e.target.value);
        console.log('📏 [Table] handleLimitChange:', limit);
        if (onLimitChange) {
            onLimitChange(limit);
        }
    };

    // Trier les données
    const sortedData = React.useMemo(() => {
        if (!sortConfig.key || !sortable) return data;

        return [...data].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue === null || aValue === undefined) return 1;
            if (bValue === null || bValue === undefined) return -1;

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortConfig.direction === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortConfig.direction === 'asc'
                    ? aValue - bValue
                    : bValue - aValue;
            }

            const aStr = String(aValue);
            const bStr = String(bValue);
            return sortConfig.direction === 'asc'
                ? aStr.localeCompare(bStr)
                : bStr.localeCompare(aStr);
        });
    }, [data, sortConfig, sortable]);

    // Calcul de la pagination
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, total);
    const paginatedData = pagination ? sortedData.slice(startIndex, endIndex) : sortedData;

    // Rendu du loader
    // if (loading) {
    //     return (
    //         <div className={`table-container ${className}`}>
    //             <div className="table-loading">
    //                 <ActivityIndicator
    //                     type="digital"
    //                     size={30}
    //                     message="Chargement..."
    //                 />
    //             </div>
    //         </div>
    //     );
    // }

    // Rendu du message vide
    if (!paginatedData || paginatedData.length === 0) {
        return (
            <div className={`table-container ${className}`}>
                <div className="table-empty">
                    <p className="empty-icon">📭</p>
                    <p className="empty-message">{emptyMessage}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`table-container ${className}`}>
            <div className="table-wrapper">
                <table className={`
                    table 
                    ${striped ? 'table-striped' : ''}
                    ${hoverable ? 'table-hoverable' : ''}
                    ${bordered ? 'table-bordered' : ''}
                    ${compact ? 'table-compact' : ''}
                `}>
                    {/* En-tête */}
                    <thead>
                        <tr>
                            {onSelectAll && (
                                <th className="table-checkbox">
                                    <input
                                        type="checkbox"
                                        checked={selectedAll}
                                        onChange={(e) => onSelectAll(e.target.checked)}
                                    />
                                </th>
                            )}
                            {columns.map((column, index) => (
                                <th
                                    key={column.key || index}
                                    className={`
                                        ${column.className || ''}
                                        ${column.sortable !== false && sortable ? 'sortable' : ''}
                                        ${sortConfig.key === column.key ? 'sorted' : ''}
                                    `}
                                    style={column.style || {}}
                                    onClick={() => column.sortable !== false && sortable && handleSort(column.key)}
                                >
                                    <div className="th-content">
                                        <span>{column.label}</span>
                                        {column.sortable !== false && sortable && (
                                            <span className="sort-icon">
                                                {sortConfig.key === column.key ? (
                                                    sortConfig.direction === 'asc'
                                                        ? <ChevronUp size={14} />
                                                        : <ChevronDown size={14} />
                                                ) : (
                                                    <ChevronDown size={14} className="sort-inactive" />
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* Corps */}
                    <tbody>
                        {paginatedData.map((row, rowIndex) => (
                            <tr
                                key={row.id || rowIndex}
                                className={`
                                    ${rowClassName ? typeof rowClassName === 'function'
                                        ? rowClassName(row, rowIndex)
                                        : rowClassName : ''}
                                    ${onRowClick ? 'clickable' : ''}
                                `}
                                onClick={() => onRowClick && onRowClick(row, rowIndex)}
                            >
                                {onSelectAll && (
                                    <td className="table-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={row._checked || false}
                                            onChange={(e) => {
                                                // Gérer la sélection individuelle
                                            }}
                                        />
                                    </td>
                                )}
                                {columns.map((column, colIndex) => (
                                    <td
                                        key={column.key || colIndex}
                                        className={column.className || ''}
                                        style={column.style || {}}
                                    >
                                        {column.render
                                            ? column.render(row[column.key], row, rowIndex)
                                            : row[column.key] !== undefined && row[column.key] !== null
                                                ? String(row[column.key])
                                                : '—'
                                        }
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {pagination && totalPages > 1 && (
                <div className="table-pagination">
                    <div className="pagination-info">
                        Affichage de {startIndex + 1} à {endIndex} sur {total} éléments
                    </div>

                    <div className="pagination-controls">
                        <div className="pagination-limit">
                            <select
                                value={pageSize}
                                onChange={handleLimitChange}
                                className="limit-select"
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                            <span>par page</span>
                        </div>

                        <div className="pagination-buttons">
                            <button
                                className="page-btn"
                                disabled={currentPage === 1}
                                onClick={() => handlePageChange(currentPage - 1)}
                            >
                                <ChevronLeft size={16} />
                            </button>

                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }

                                return (
                                    <button
                                        key={pageNum}
                                        className={`page-number ${currentPage === pageNum ? 'active' : ''}`}
                                        onClick={() => handlePageChange(pageNum)}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}

                            {totalPages > 5 && currentPage < totalPages - 2 && (
                                <span className="page-ellipsis">…</span>
                            )}

                            <button
                                className="page-btn"
                                disabled={currentPage === totalPages}
                                onClick={() => handlePageChange(currentPage + 1)}
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}