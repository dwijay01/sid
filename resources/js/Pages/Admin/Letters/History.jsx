import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Search, FileText, FileCheck, XCircle, ArrowLeft, Eye } from 'lucide-react';

export default function History({ letters, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.letters.history'), { search }, { preserveState: true });
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'selesai':
                return 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 ring-emerald-600/20';
            case 'ditolak':
                return 'bg-red-50 dark:bg-red-900/30 text-red-700 ring-red-600/20';
            default:
                return 'bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 ring-slate-600/20';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'selesai':
                return <FileCheck size={14} className="mr-1" />;
            case 'ditolak':
                return <XCircle size={14} className="mr-1" />;
            default:
                return <FileText size={14} className="mr-1" />;
        }
    };

    return (
        <AdminLayout header="Riwayat Surat Selesai & Ditolak">
            <Head title="Riwayat Surat" />

            <div className="sm:flex sm:items-center sm:justify-between mb-6">
                <div>
                    <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                        Arsip dokumen persuratan yang telah selesai diproses atau ditolak.
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none flex items-center gap-2">
                    <Link
                        href={route('admin.letters.queue')}
                        className="flex items-center text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:text-emerald-400 transition-colors text-sm font-semibold"
                    >
                        <ArrowLeft className="mr-1.5 h-4 w-4" />
                        Kembali ke Antrean
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
                            placeholder="Cari NIK atau Nama Pemohon..."
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
                                    Pemohon
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">
                                    Jenis Surat & Nomor
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">
                                    Waktu Selesai
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
                            {letters.data.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 font-medium">
                                        Tidak ada riwayat persuratan.
                                    </td>
                                </tr>
                            ) : (
                                letters.data.map((letter) => (
                                    <tr key={letter.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                                            <div className="text-sm font-medium text-slate-900 dark:text-white">{letter.resident?.nama_lengkap || 'Unknown'}</div>
                                            <div className="text-sm text-slate-500 dark:text-slate-400 font-mono tracking-wider">{letter.resident?.nik}</div>
                                        </td>
                                        <td className="px-3 py-4 text-sm text-slate-700 dark:text-slate-300 max-w-sm truncate whitespace-normal">
                                            <div className="font-semibold">{letter.letter_type?.nama_surat}</div>
                                            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5 border-b border-slate-100 dark:border-slate-700 inline-block pb-0.5">{letter.nomor_surat || 'N/A'}</div>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">
                                            {new Date(letter.updated_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">
                                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ring-1 ring-inset shadow-sm ${getStatusStyle(letter.status)}`}>
                                                {getStatusIcon(letter.status)}
                                                {letter.status.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                            <Link
                                                href={route('admin.letters.show', letter.id)}
                                                className="inline-flex items-center rounded-md bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                            >
                                                <Eye size={14} className="mr-1.5" />
                                                Tinjau Berkas
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Placeholder */}
                {letters.links && letters.links.length > 3 && (
                    <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 sm:px-6 flex items-center justify-between">
                         {/* Insert manual pagination blocks from previous components */}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
