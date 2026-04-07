import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Search, Plus, Edit2, Trash2, FileText, Eye } from 'lucide-react';
import { formatDateTime } from '@/Helpers/formatters';

export default function Index({ templates, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.letter-templates.index'), { search }, { preserveState: true });
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus template ini?')) {
            router.delete(route('admin.letter-templates.destroy', id));
        }
    };

    return (
        <AdminLayout header="Template Surat">
            <Head title="Template Surat" />

            <div className="sm:flex sm:items-center sm:justify-between mb-6">
                <p className="text-sm text-slate-700 dark:text-slate-300">Kelola template surat desa untuk pencetakan otomatis.</p>
                <div className="mt-4 sm:mt-0">
                    <Link href={route('admin.letter-templates.create')} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors">
                        <Plus size={16} /> Buat Template
                    </Link>
                </div>
            </div>

            <div className="glass bg-white dark:bg-slate-800 p-4 mb-6 shadow-sm rounded-xl">
                <form onSubmit={handleSearch} className="flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-5 w-5 text-slate-400" />
                        </div>
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="block w-full rounded-lg border-0 py-2.5 pl-10 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50" placeholder="Cari template..." />
                    </div>
                    <button type="submit" className="rounded-lg bg-slate-100 dark:bg-slate-700 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">Cari</button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.data.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-xl shadow-sm">Template surat tidak ditemukan.</div>
                ) : (
                    templates.data.map((tpl) => (
                        <div key={tpl.id} className="relative overflow-hidden bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700/60 hover:shadow-md transition-all duration-300">
                            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-500 to-violet-600" />
                            <div className="p-5">
                                <div className="flex items-start gap-3 mb-3">
                                    <div className="rounded-xl p-2.5 bg-purple-100 text-purple-600">
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">{tpl.name}</h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Dibuat oleh {tpl.creator?.name || '-'}</p>
                                    </div>
                                </div>
                                <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
                                    <p>Digunakan oleh {tpl.letter_types_count || 0} jenis surat</p>
                                    <p>Terakhir diubah: {formatDateTime(tpl.updated_at)}</p>
                                </div>
                                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex gap-2">
                                    <Link href={route('admin.letter-templates.show', tpl.id)} className="flex-1 text-center rounded-lg bg-slate-100 dark:bg-slate-700 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors inline-flex items-center justify-center gap-1">
                                        <Eye size={12} /> Lihat
                                    </Link>
                                    <Link href={route('admin.letter-templates.edit', tpl.id)} className="flex-1 text-center rounded-lg bg-indigo-50 dark:bg-indigo-900/30 px-3 py-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors inline-flex items-center justify-center gap-1">
                                        <Edit2 size={12} /> Edit
                                    </Link>
                                    <button onClick={() => handleDelete(tpl.id)} className="flex-1 text-center rounded-lg bg-red-50 dark:bg-red-900/30 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors inline-flex items-center justify-center gap-1">
                                        <Trash2 size={12} /> Hapus
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </AdminLayout>
    );
}
