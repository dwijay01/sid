import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Search, Plus, Edit2, Trash2, MapPin, Users } from 'lucide-react';

export default function Index({ wilayah, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.wilayah.index'), { search }, { preserveState: true });
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus data wilayah ini?')) {
            router.delete(route('admin.wilayah.destroy', id));
        }
    };

    return (
        <AdminLayout header="Manajemen Wilayah RT/RW">
            <Head title="Wilayah" />

            <div className="sm:flex sm:items-center sm:justify-between mb-6">
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                    Kelola data wilayah RT/RW dan dusun di desa.
                </p>
                <div className="mt-4 sm:mt-0">
                    <Link
                        href={route('admin.wilayah.create')}
                        className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors"
                    >
                        <Plus size={16} />
                        Tambah Wilayah
                    </Link>
                </div>
            </div>

            <div className="glass bg-white dark:bg-slate-800 p-4 mb-6 shadow-sm rounded-xl">
                <form onSubmit={handleSearch} className="flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-5 w-5 text-slate-400" />
                        </div>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="block w-full rounded-lg border-0 py-2.5 pl-10 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50"
                            placeholder="Cari RT, RW, atau dusun..."
                        />
                    </div>
                    <button type="submit" className="rounded-lg bg-slate-100 dark:bg-slate-700 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                        Cari
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {wilayah.data.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
                        Data wilayah tidak ditemukan.
                    </div>
                ) : (
                    wilayah.data.map((item) => (
                        <div
                            key={item.id}
                            className="relative overflow-hidden bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700/60 hover:shadow-md transition-all duration-300 group"
                        >
                            <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${item.is_active ? 'from-emerald-500 to-teal-600' : 'from-slate-300 to-slate-400'}`} />
                            
                            <div className="p-5">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-xl p-2.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
                                            <MapPin className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                                RT {item.rt} / RW {item.rw}
                                            </h3>
                                            {item.dusun && (
                                                <p className="text-sm text-slate-500 dark:text-slate-400">Dusun {item.dusun}</p>
                                            )}
                                        </div>
                                    </div>
                                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${item.is_active ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 ring-emerald-600/20' : 'bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 ring-slate-300 dark:ring-slate-700'}`}>
                                        {item.is_active ? 'Aktif' : 'Nonaktif'}
                                    </span>
                                </div>

                                <div className="mt-4 space-y-2">
                                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                        <Users size={14} className="text-slate-400" />
                                        <span>Ketua: {item.nama_ketua || '-'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                        <span className="text-slate-400">📋</span>
                                        <span>{item.family_cards_count || 0} Kartu Keluarga</span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex gap-2">
                                    <Link
                                        href={route('admin.wilayah.edit', item.id)}
                                        className="flex-1 text-center rounded-lg bg-slate-100 dark:bg-slate-700 px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors inline-flex items-center justify-center gap-1"
                                    >
                                        <Edit2 size={14} /> Edit
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="flex-1 text-center rounded-lg bg-red-50 dark:bg-red-900/30 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors inline-flex items-center justify-center gap-1"
                                    >
                                        <Trash2 size={14} /> Hapus
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            {wilayah.links && wilayah.links.length > 3 && (
                <div className="mt-6 flex justify-center">
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                        {wilayah.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                    link.active
                                        ? 'z-10 bg-emerald-600 text-white'
                                        : 'text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                                } ${index === 0 ? 'rounded-l-md' : ''} ${index === wilayah.links.length - 1 ? 'rounded-r-md' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </nav>
                </div>
            )}
        </AdminLayout>
    );
}
