import React from 'react';
import { Head, Link } from '@inertiajs/react';
import RtRwLayout from '@/Layouts/RtRwLayout';
import { Users, Search, MapPin, Eye } from 'lucide-react';

export default function MyResidents({ residents }) {

    return (
        <RtRwLayout header="Daftar Warga Lingkungan">
            <Head title="Warga RT/RW" />

            <div className="mb-6">
                <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-emerald-100 dark:bg-emerald-900/40 p-3 rounded-xl text-emerald-600 dark:text-emerald-400">
                                <Users size={24} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Direktori Warga</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Mengelola daftar semua warga yang terdaftar di wilayah pengawasan Anda.</p>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
                            </div>
                            <input
                                type="text"
                                className="block w-full rounded-lg border-0 py-2 pl-10 pr-3 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                placeholder="Cari NIK/Nama Warga..."
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th scope="col" className="py-3.5 pl-6 pr-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Identitas Warga</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">No. KK</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Usia / JK</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status Penduduk</th>
                                <th scope="col" className="relative py-3.5 pl-3 pr-6"><span className="sr-only">Aksi</span></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700 bg-white dark:bg-slate-800">
                            {residents.data.length > 0 ? (
                                residents.data.map((resident) => (
                                    <tr key={resident.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="whitespace-nowrap py-4 pl-6 pr-3">
                                            <div className="flex items-center">
                                                <div className="h-10 w-10 flex-shrink-0 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-400">
                                                    {resident.nama_lengkap.charAt(0)}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="font-bold text-slate-900 dark:text-white">{resident.nama_lengkap}</div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">{resident.nik}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-600 dark:text-slate-400 font-mono">
                                            {resident.family_card?.no_kk || '-'}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-600 dark:text-slate-400">
                                            <span className="font-bold">{new Date().getFullYear() - new Date(resident.tanggal_lahir).getFullYear()}</span> thn <span className="text-slate-300 mx-1">|</span> {resident.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                                            <span className="inline-flex items-center rounded-md bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20 uppercase">
                                                {resident.status_penduduk}
                                            </span>
                                        </td>
                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium">
                                            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900" title="Detail Warga">
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                                        Tidak ada warga di wilayah Anda.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {residents.links && residents.links.length > 3 && (
                    <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex items-center justify-center">
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                            {residents.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                        link.active 
                                            ? 'z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600' 
                                            : 'text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 focus:z-20 focus:outline-offset-0 disabled:opacity-50'
                                    } ${index === 0 ? 'rounded-l-md' : ''} ${index === residents.links.length - 1 ? 'rounded-r-md' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </nav>
                    </div>
                )}
            </div>
        </RtRwLayout>
    );
}
