import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Search, Plus, Trash2, ArrowUpDown } from 'lucide-react';
import StatusBadge from '@/Components/ui/StatusBadge';
import { MUTATION_TYPES } from '@/Helpers/constants';
import { formatDate } from '@/Helpers/formatters';

export default function Index({ mutations, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [typeFilter, setTypeFilter] = useState(filters.type || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.mutations.index'), { search, type: typeFilter }, { preserveState: true });
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus data mutasi ini?')) {
            router.delete(route('admin.mutations.destroy', id));
        }
    };

    const mutationColor = {
        lahir: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 ring-emerald-600/20',
        mati: 'bg-red-50 dark:bg-red-900/30 text-red-700 ring-red-600/20',
        pindah_keluar: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 ring-amber-600/20',
        pindah_masuk: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 ring-blue-600/20',
        datang: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 ring-indigo-600/20',
    };

    return (
        <AdminLayout header="Mutasi Kependudukan">
            <Head title="Mutasi" />

            <div className="sm:flex sm:items-center sm:justify-between mb-6">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                    Catat perpindahan, kelahiran, dan kematian penduduk.
                </p>
                <div className="mt-4 sm:mt-0">
                    <Link
                        href={route('admin.mutations.create')}
                        className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors"
                    >
                        <Plus size={16} />
                        Catat Mutasi
                    </Link>
                </div>
            </div>

            <div className="glass bg-white dark:bg-slate-800 p-4 mb-6 shadow-sm rounded-xl">
                <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
                    <div className="relative flex-1 min-w-[200px] max-w-md">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="block w-full rounded-lg border-0 py-2.5 pl-10 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50"
                            placeholder="Cari NIK atau nama..."
                        />
                    </div>
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50"
                    >
                        <option value="">Semua Jenis</option>
                        {Object.entries(MUTATION_TYPES).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                        ))}
                    </select>
                    <button type="submit" className="rounded-lg bg-slate-100 dark:bg-slate-700 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                        Filter
                    </button>
                </form>
            </div>

            <div className="glass bg-white dark:bg-slate-800 overflow-hidden shadow-sm rounded-xl">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 dark:text-white sm:pl-6">Penduduk</th>
                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">Jenis Mutasi</th>
                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">Tanggal</th>
                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">Asal/Tujuan</th>
                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">Petugas</th>
                                <th className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Aksi</span></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {mutations.data.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">Data mutasi tidak ditemukan.</td>
                                </tr>
                            ) : (
                                mutations.data.map((m) => (
                                    <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                                            <div className="text-sm font-medium text-slate-900 dark:text-white">{m.resident?.nama_lengkap || '-'}</div>
                                            <div className="text-sm text-slate-500 dark:text-slate-400 font-mono">{m.resident?.nik || '-'}</div>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4">
                                            <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${mutationColor[m.type] || 'bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 ring-slate-300 dark:ring-slate-700'}`}>
                                                {MUTATION_TYPES[m.type] || m.type}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">{formatDate(m.tanggal_mutasi)}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">{m.asal_tujuan || '-'}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">{m.processor?.name || '-'}</td>
                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm sm:pr-6">
                                            <button onClick={() => handleDelete(m.id)} className="text-red-500 hover:text-red-700 p-1.5 rounded-full hover:bg-red-50 dark:bg-red-900/30 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {mutations.links && mutations.links.length > 3 && (
                    <div className="border-t border-slate-200 dark:border-slate-700 px-4 py-3 flex justify-between items-center sm:px-6">
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                            Menampilkan <span className="font-medium">{mutations.from || 0}</span> - <span className="font-medium">{mutations.to || 0}</span> dari <span className="font-medium">{mutations.total}</span>
                        </p>
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                            {mutations.links.map((link, i) => (
                                <Link key={i} href={link.url || '#'} className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${link.active ? 'bg-emerald-600 text-white' : 'text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'} ${i === 0 ? 'rounded-l-md' : ''} ${i === mutations.links.length - 1 ? 'rounded-r-md' : ''}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                            ))}
                        </nav>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
