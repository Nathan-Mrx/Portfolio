'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import styles from './Pagination.module.css';

export default function Pagination({ currentPage, totalItems, itemsPerPage, onPageChange }) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalItems === 0) return null;

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            let start = Math.max(1, currentPage - 2);
            let end = Math.min(totalPages, start + maxVisiblePages - 1);

            if (end === totalPages) {
                start = Math.max(1, end - maxVisiblePages + 1);
            }

            for (let i = start; i <= end; i++) pages.push(i);
        }
        return pages;
    };

    return (
        <nav className={styles.paginationContainer} aria-label="Pagination">
            <div className={styles.controls}>
                <button
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                    className={styles.pageButton}
                    title="First Page"
                >
                    <ChevronsLeft size={18} />
                </button>
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={styles.pageButton}
                    title="Previous Page"
                >
                    <ChevronLeft size={18} />
                </button>
            </div>

            <div className={styles.pages}>
                {getPageNumbers().map(page => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`${styles.pageButton} ${currentPage === page ? styles.active : ''}`}
                    >
                        {page}
                    </button>
                ))}
            </div>

            <div className={styles.controls}>
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={styles.pageButton}
                    title="Next Page"
                >
                    <ChevronRight size={18} />
                </button>
                <button
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className={styles.pageButton}
                    title="Last Page"
                >
                    <ChevronsRight size={18} />
                </button>
            </div>
        </nav>
    );
}
