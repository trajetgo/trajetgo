import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react'

export default function Pagination({
    pagination,
    changePage
}) {
    return (
        <>
            {pagination.totalPages > 1 && (
                <div className="pagination">
                    <button
                        className="page-btn"
                        disabled={pagination.page === 1}
                        onClick={() => changePage(pagination.page - 1)}
                    >
                        <ChevronLeft size={18} />
                    </button>

                    <div className="page-numbers">
                        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                            let pageNum;
                            if (pagination.totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (pagination.page <= 3) {
                                pageNum = i + 1;
                            } else if (pagination.page >= pagination.totalPages - 2) {
                                pageNum = pagination.totalPages - 4 + i;
                            } else {
                                pageNum = pagination.page - 2 + i;
                            }
                            return (
                                <button
                                    key={pageNum}
                                    className={`page-number ${pagination.page === pageNum ? 'active' : ''}`}
                                    onClick={() => changePage(pageNum)}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                        {pagination.totalPages > 5 && pagination.page < pagination.totalPages - 2 && (
                            <span className="page-ellipsis">…</span>
                        )}
                    </div>

                    <button
                        className="page-btn"
                        disabled={pagination.page === pagination.totalPages}
                        onClick={() => changePage(pagination.page + 1)}
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            )}
        </>
    )
}
