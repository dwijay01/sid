import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import KadesLayout from '@/Layouts/KadesLayout';
import { Search, Activity } from 'lucide-react';
import { formatDateTime, capitalize } from '@/Helpers/formatters';

export default function AuditTrail({ audits, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('kades.reports.audit'), { search }, { preserveState: true });
    };

    const eventColor = {
        created: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 ring-emerald-600/20',
        updated: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 ring-blue-600/20',
        deleted: 'bg-red-50 dark:bg-red-900/30 text-red-700 ring-red-600/20',
    };

    const getModelName = (type) => {
        if (!type) return '-';
        const parts = type.split('\\');
        return parts[parts.length - 1];
    };

    return (
        <KadesLayout header="Audit Trail">
            <Head title="Audit Trail" />

            <div className="mb-6">
                <p className="text-sm text-slate-700 dark:text-slate-300">Riwayat perubahan data pada sistem.</p>
            </div>

            <div className="glass bg-white dark:bg-slate-800 p-4 mb-6 shadow-sm rounded-xl">
                <form onSubmit={handleSearch} className="flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-5 w-5 text-slate-400" />
                        </div>
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="block w-full rounded-lg border-0 py-2.5 pl-10 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50" placeholder="Cari model atau event..." />
                    </div>
                    <button type="submit" className="rounded-lg bg-slate-100 dark:bg-slate-700 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">Cari</button>
                </form>
            </div>

            <div className="bg-white dark:bg-slate-800 overflow-hidden shadow-sm rounded-xl">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 dark:text-white sm:pl-6">Waktu</th>
                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">User</th>
                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">Event</th>
                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">Model</th>
                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">ID</th>
                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">IP</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {audits.data.length === 0 ? (
                                <tr><td colSpan="6" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">Belum ada data audit.</td></tr>
                            ) : (
                                audits.data.map((audit) => (
                                    <tr key={audit.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6 text-sm text-slate-500 dark:text-slate-400">{formatDateTime(audit.created_at)}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-900 dark:text-white font-medium">{audit.user?.name || 'System'}</td>
                                        <td className="whitespace-nowrap px-3 py-4">
                                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ring-1 ring-inset ${eventColor[audit.event] || 'bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 ring-slate-300 dark:ring-slate-700'}`}>
                                                {capitalize(audit.event)}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-700 dark:text-slate-300 font-mono text-xs">{getModelName(audit.auditable_type)}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">#{audit.auditable_id}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-400 font-mono text-xs">{audit.ip_address || '-'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {audits.links && audits.links.length > 3 && (
                    <div className="border-t border-slate-200 dark:border-slate-700 px-4 py-3 flex justify-between items-center sm:px-6">
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                            Menampilkan {audits.from || 0} - {audits.to || 0} dari {audits.total}
                        </p>
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                            {audits.links.map((link, i) => (
                                <Link key={i} href={link.url || '#'} className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${link.active ? 'bg-emerald-600 text-white' : 'text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'} ${i === 0 ? 'rounded-l-md' : ''} ${i === audits.links.length - 1 ? 'rounded-r-md' : ''}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                            ))}
                        </nav>
                    </div>
                )}
            </div>
        </KadesLayout>
    );
}
