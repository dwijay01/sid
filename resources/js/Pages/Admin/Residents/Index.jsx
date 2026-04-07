import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Search, Plus, MoreVertical, Edit2, Trash2, Eye, Download } from 'lucide-react';
import Dropdown from '@/Components/Dropdown';

export default function Index({ residents, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.residents.index'), { search }, { preserveState: true });
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus data penduduk ini?')) {
            router.delete(route('admin.residents.destroy', id));
        }
    };

    return (
        <AdminLayout header="Data Kependudukan">
            <Head title="Penduduk" />

            <div className="sm:flex sm:items-center sm:justify-between mb-6">
                <div>
                    <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                        Kelola data warga desa, tambah penduduk baru, atau ubah data.
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none flex items-center gap-3">
                    <a
                        href={route('admin.residents.export')}
                        target="_blank"
                        className="block rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 px-4 py-2 text-center text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center gap-2"
                    >
                        <Download size={16} />
                        Export Excel
                    </a>
                    <Link
                        href={route('admin.residents.create')}
                        className="block rounded-lg bg-emerald-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors flex items-center gap-2"
                    >
                        <Plus size={16} />
                        Tambah Penduduk
                    </Link>
                </div>
            </div>

            <div className="glass bg-white dark:bg-slate-800 p-4 mb-6 shadow-sm rounded-xl">
                <form onSubmit={handleSearch} className="flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-5 w-5 text-slate-400" aria-hidden="true" />
                        </div>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="block w-full rounded-lg border-0 py-2.5 pl-10 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6 bg-slate-50 dark:bg-slate-800/50"
                            placeholder="Cari NIK atau Nama..."
                        />
                    </div>
                    <button
                        type="submit"
                        className="rounded-lg bg-slate-100 dark:bg-slate-700 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    >
                        Cari
                    </button>
                </form>
            </div>

            <div className="glass bg-white dark:bg-slate-800 overflow-hidden shadow-sm rounded-xl">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 dark:text-white sm:pl-6">
                                    NIK / Nama Lengkap
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">
                                    Jenis Kelamin
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">
                                    Usia
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
                            {residents.data.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 font-medium">
                                        Data Penduduk tidak ditemukan.
                                    </td>
                                </tr>
                            ) : (
                                residents.data.map((resident) => (
                                    <tr key={resident.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                                            <div className="text-sm font-medium text-slate-900 dark:text-white">{resident.nama_lengkap}</div>
                                            <div className="text-sm text-slate-500 dark:text-slate-400 font-mono tracking-wider">{resident.nik}</div>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">
                                            {resident.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">
                                            {new Date().getFullYear() - new Date(resident.tanggal_lahir).getFullYear()} Tahun
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">
                                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                                                resident.status_penduduk === 'aktif' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 ring-emerald-600/20' : 
                                                resident.status_penduduk === 'meninggal' ? 'bg-red-50 dark:bg-red-900/30 text-red-700 ring-red-600/20' : 
                                                'bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 ring-slate-600/20'
                                            }`}>
                                                {resident.status_penduduk.charAt(0).toUpperCase() + resident.status_penduduk.slice(1)}
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
                                                    <Link 
                                                        href={route('admin.residents.show', resident.id)} 
                                                        className="block w-full px-4 py-2 text-left text-sm leading-5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                                                    >
                                                        <Eye size={16} /> Detail
                                                    </Link>
                                                    <Link 
                                                        href={route('admin.residents.edit', resident.id)} 
                                                        className="block w-full px-4 py-2 text-left text-sm leading-5 text-indigo-600 dark:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                                                    >
                                                        <Edit2 size={16} /> Edit
                                                    </Link>
                                                    <button 
                                                        onClick={() => handleDelete(resident.id)} 
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

                {/* Pagination */}
                {residents.links && residents.links.length > 3 && (
                    <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 sm:px-6 flex items-center justify-between">
                        <div className="flex flex-1 justify-between sm:hidden">
                            <Link href={residents.prev_page_url || '#'} className={`relative inline-flex items-center rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 ${!residents.prev_page_url ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                Previous
                            </Link>
                            <Link href={residents.next_page_url || '#'} className={`relative ml-3 inline-flex items-center rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 ${!residents.next_page_url ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                Next
                            </Link>
                        </div>
                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-slate-700 dark:text-slate-300">
                                    Menampilkan <span className="font-medium">{residents.from || 0}</span> sampai <span className="font-medium">{residents.to || 0}</span> dari{' '}
                                    <span className="font-medium">{residents.total}</span> data
                                </p>
                            </div>
                            <div>
                                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                    {residents.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                                link.active 
                                                    ? 'z-10 bg-emerald-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600' 
                                                    : 'text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 focus:z-20 focus:outline-offset-0 disabled:opacity-50'
                                            } ${index === 0 ? 'rounded-l-md' : ''} ${index === residents.links.length - 1 ? 'rounded-r-md' : ''}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
