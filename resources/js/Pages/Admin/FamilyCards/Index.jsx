import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Search, Plus, MoreVertical, Edit2, Trash2, Eye, Users } from 'lucide-react';
import Dropdown from '@/Components/Dropdown';

export default function Index({ familyCards, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        const isChanged = search !== (filters.search || '');
        if (isChanged) {
            const timeout = setTimeout(() => {
                router.get(route('admin.family-cards.index'), { search }, { preserveState: true });
            }, 400);
            return () => clearTimeout(timeout);
        }
    }, [search]);

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus data Kartu Keluarga ini? Anak dan Istri harus dikeluarkan terlebih dahulu atau secara otomatis terhapus status KK-nya.')) {
            router.delete(route('admin.family-cards.destroy', id));
        }
    };

    return (
        <AdminLayout header="Data Kartu Keluarga (KK)">
            <Head title="Kartu Keluarga" />

            <div className="sm:flex sm:items-center sm:justify-between mb-6">
                <div>
                    <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                        Kelola data Kartu Keluarga warga desa, tambah KK baru, atau ubah status KK.
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                    <Link
                        href={route('admin.family-cards.create')}
                        className="block rounded-lg bg-emerald-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors flex items-center gap-2"
                    >
                        <Plus size={16} />
                        Tambah KK Baru
                    </Link>
                </div>
            </div>

            <div className="glass bg-white dark:bg-slate-800 p-4 mb-6 shadow-sm rounded-xl">
                <div className="flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-5 w-5 text-slate-400" aria-hidden="true" />
                        </div>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="block w-full rounded-lg border-0 py-2.5 pl-10 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6 bg-slate-50 dark:bg-slate-800/50"
                            placeholder="Cari Nomor KK / Nama Kepala Keluarga..."
                        />
                    </div>
                </div>
            </div>

            <div className="glass bg-white dark:bg-slate-800 overflow-hidden shadow-sm rounded-xl">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 dark:text-white sm:pl-6">
                                    No KK / Kepala Keluarga
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">
                                    Wilayah
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white text-center">
                                    Anggota
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">
                                    Status
                                </th>
                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                    <span className="sr-only">Aksi</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-800">
                            {familyCards.data.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 font-medium">
                                        Data KK tidak ditemukan.
                                    </td>
                                </tr>
                            ) : (
                                familyCards.data.map((kk) => (
                                    <tr key={kk.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6 text-sm">
                                            <div className="font-mono tracking-wider font-semibold text-slate-900 dark:text-white">{kk.no_kk}</div>
                                            <div className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1 mt-1">
                                                <Users size={14} className="text-emerald-500" />
                                                {kk.kepala_keluarga ? kk.kepala_keluarga.nama_lengkap : 'Tidak Diketahui'}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">
                                            {kk.wilayah ? `RT ${kk.wilayah.rt} / RW ${kk.wilayah.rw}` : '-'}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold">
                                                <Users size={14} className="text-emerald-500" />
                                                {kk.anggota_keluarga_count || 0}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">
                                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                                                kk.status === 'aktif' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 ring-emerald-600/20' : 
                                                kk.status === 'pindah' ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 ring-amber-600/20' : 
                                                'bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 ring-slate-600/20'
                                            }`}>
                                                {(kk.status || 'aktif').replace('_', ' ').toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                            <Dropdown>
                                                <Dropdown.Trigger>
                                                    <button className="text-slate-400 hover:text-emerald-600 dark:text-emerald-400 p-2 rounded-full hover:bg-emerald-50 dark:bg-emerald-900/30 transition-colors">
                                                        <MoreVertical size={18} />
                                                    </button>
                                                </Dropdown.Trigger>
                                                <Dropdown.Content align="right" width="48">
                                                    <button 
                                                        onClick={() => alert("Lihat Anggota Keluarga")}
                                                        className="block w-full px-4 py-2 text-left text-sm leading-5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                                                    >
                                                        <Users size={16} /> Anggota
                                                    </button>
                                                    <Link 
                                                        href={route('admin.family-cards.edit', kk.id)} 
                                                        className="block w-full px-4 py-2 text-left text-sm leading-5 text-indigo-600 dark:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                                                    >
                                                        <Edit2 size={16} /> Edit
                                                    </Link>
                                                    <button 
                                                        onClick={() => handleDelete(kk.id)} 
                                                        className="block w-full px-4 py-2 text-left text-sm leading-5 text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                                                    >
                                                        <Trash2 size={16} /> Hapus
                                                    </button>
                                                </Dropdown.Content>
                                            </Dropdown>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {familyCards.links && familyCards.links.length > 3 && (
                    <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:dark:bg-slate-800 px-4 py-3 sm:px-6 flex items-center justify-center">
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                            {familyCards.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                        link.active 
                                            ? 'z-10 bg-emerald-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600' 
                                            : 'text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 focus:z-20 focus:outline-offset-0 disabled:opacity-50'
                                    } ${index === 0 ? 'rounded-l-md' : ''} ${index === familyCards.links.length - 1 ? 'rounded-r-md' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </nav>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
