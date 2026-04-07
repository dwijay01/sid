import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';

export default function Index({ letterTypes, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.letter-types.index'), { search }, { preserveState: true });
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus jenis surat ini?')) {
            router.delete(route('admin.letter-types.destroy', id));
        }
    };

    return (
        <AdminLayout header="Jenis Surat">
            <Head title="Jenis Surat" />

            <div className="sm:flex sm:items-center sm:justify-between mb-6">
                <p className="text-sm text-slate-700 dark:text-slate-300">Kelola jenis surat yang tersedia untuk permohonan warga.</p>
                <div className="mt-4 sm:mt-0">
                    <Link href={route('admin.letter-types.create')} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors">
                        <Plus size={16} /> Tambah Jenis Surat
                    </Link>
                </div>
            </div>

            <div className="glass bg-white dark:bg-slate-800 p-4 mb-6 shadow-sm rounded-xl">
                <form onSubmit={handleSearch} className="flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-5 w-5 text-slate-400" />
                        </div>
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="block w-full rounded-lg border-0 py-2.5 pl-10 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50" placeholder="Cari jenis surat..." />
                    </div>
                    <button type="submit" className="rounded-lg bg-slate-100 dark:bg-slate-700 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">Cari</button>
                </form>
            </div>

            <div className="bg-white dark:bg-slate-800 overflow-hidden shadow-sm rounded-xl">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 dark:text-white sm:pl-6">Kode</th>
                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">Nama</th>
                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">Template</th>
                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">Perlu Approval RT</th>
                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">Status</th>
                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">Permohonan</th>
                                <th className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Aksi</span></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {letterTypes.data.length === 0 ? (
                                <tr><td colSpan="7" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">Tidak ada data.</td></tr>
                            ) : (
                                letterTypes.data.map((lt) => (
                                    <tr key={lt.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                                            <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 ring-1 ring-inset ring-slate-300 dark:ring-slate-700 font-mono">{lt.code}</span>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-slate-900 dark:text-white">{lt.name}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">{lt.template?.name || '-'}</td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                                            {lt.requires_rt_approval ? (
                                                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Ya</span>
                                            ) : (
                                                <span className="text-slate-400">Tidak</span>
                                            )}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4">
                                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ring-1 ring-inset ${lt.is_active ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 ring-emerald-600/20' : 'bg-red-50 dark:bg-red-900/30 text-red-700 ring-red-600/20'}`}>
                                                {lt.is_active ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400 text-center">{lt.letter_requests_count || 0}</td>
                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm sm:pr-6 flex gap-1 justify-end">
                                            <Link href={route('admin.letter-types.edit', lt.id)} className="text-indigo-500 hover:text-indigo-700 p-1.5 rounded-full hover:bg-indigo-50 dark:bg-indigo-900/30 transition-colors">
                                                <Edit2 size={16} />
                                            </Link>
                                            <button onClick={() => handleDelete(lt.id)} className="text-red-500 hover:text-red-700 p-1.5 rounded-full hover:bg-red-50 dark:bg-red-900/30 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
