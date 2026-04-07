import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

export default function DataTable({
    columns,
    data,
    pagination,
    searchable = true,
    searchPlaceholder = 'Cari...',
    searchRoute,
    filters = {},
    emptyMessage = 'Data tidak ditemukan.',
    actions,
}) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchRoute) {
            router.get(searchRoute, { ...filters, search }, { preserveState: true });
        }
    };

    return (
        <div>
            {/* Search bar */}
            {searchable && searchRoute && (
                <div className="glass bg-white p-4 mb-4 shadow-sm rounded-xl">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <div className="relative flex-1 max-w-md">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="h-5 w-5 text-slate-400" aria-hidden="true" />
                            </div>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="block w-full rounded-lg border-0 py-2.5 pl-10 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6 bg-slate-50"
                                placeholder={searchPlaceholder}
                            />
                        </div>
                        <button
                            type="submit"
                            className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
                        >
                            Cari
                        </button>
                    </form>
                </div>
            )}

            {/* Table */}
            <div className="glass bg-white overflow-hidden shadow-sm rounded-xl">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                {columns.map((col, idx) => (
                                    <th
                                        key={idx}
                                        scope="col"
                                        className={`py-3.5 px-3 text-left text-sm font-semibold text-slate-900 ${idx === 0 ? 'pl-4 sm:pl-6' : ''} ${col.className || ''}`}
                                    >
                                        {col.header}
                                    </th>
                                ))}
                                {actions && (
                                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                        <span className="sr-only">Aksi</span>
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 bg-white">
                            {(!data || data.length === 0) ? (
                                <tr>
                                    <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-12 text-center text-slate-500 font-medium">
                                        {emptyMessage}
                                    </td>
                                </tr>
                            ) : (
                                data.map((row, rowIdx) => (
                                    <tr key={row.id || rowIdx} className="hover:bg-slate-50/50 transition-colors">
                                        {columns.map((col, colIdx) => (
                                            <td
                                                key={colIdx}
                                                className={`whitespace-nowrap py-4 px-3 text-sm text-slate-500 ${colIdx === 0 ? 'pl-4 sm:pl-6 font-medium text-slate-900' : ''} ${col.cellClassName || ''}`}
                                            >
                                                {col.render ? col.render(row) : row[col.accessor]}
                                            </td>
                                        ))}
                                        {actions && (
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                {actions(row)}
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination && pagination.links && pagination.links.length > 3 && (
                    <div className="border-t border-slate-200 bg-white px-4 py-3 sm:px-6 flex items-center justify-between">
                        <div className="flex flex-1 justify-between sm:hidden">
                            <Link href={pagination.prev_page_url || '#'} className={`relative inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 ${!pagination.prev_page_url ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                Previous
                            </Link>
                            <Link href={pagination.next_page_url || '#'} className={`relative ml-3 inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 ${!pagination.next_page_url ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                Next
                            </Link>
                        </div>
                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-slate-700">
                                    Menampilkan <span className="font-medium">{pagination.from || 0}</span> sampai <span className="font-medium">{pagination.to || 0}</span> dari{' '}
                                    <span className="font-medium">{pagination.total}</span> data
                                </p>
                            </div>
                            <div>
                                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                    {pagination.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                                link.active
                                                    ? 'z-10 bg-emerald-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600'
                                                    : 'text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0'
                                            } ${index === 0 ? 'rounded-l-md' : ''} ${index === pagination.links.length - 1 ? 'rounded-r-md' : ''}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
