import React from 'react';
import { Head, Link } from '@inertiajs/react';
import WargaLayout from '@/Layouts/WargaLayout';
import { FileText, Clock, FileCheck, Info, ChevronRight, CheckCircle, AlertCircle, History } from 'lucide-react';

export default function Dashboard({ activeRequests, recentHistory }) {
    const getStatusStyle = (status) => {
        switch (status) {
            case 'menunggu_review_admin':
            case 'menunggu_ttd_kades':
                return 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 border-blue-200';
            case 'selesai':
                return 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 border-emerald-200';
            case 'ditolak':
                return 'bg-red-50 dark:bg-red-900/30 text-red-700 border-red-200';
            default:
                return 'bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
        }
    };

    return (
        <WargaLayout header="Layanan Mandiri Warga">
            <Head title="Dashboard Warga" />

            <div className="mb-6">
                <div className="relative overflow-hidden rounded-2xl bg-emerald-600 px-6 py-10 shadow-lg sm:px-12 sm:py-12">
                    <div className="absolute inset-0 -mx-4 -my-4 bg-emerald-700/50 backdrop-blur-xl blur-2xl z-0" aria-hidden="true" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-white text-center md:text-left">
                            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Pusat Layanan Persuratan</h2>
                            <p className="mt-2 text-emerald-100 text-sm max-w-xl">
                                Ajukan permohonan surat kelahiran, keterangan tidak mampu, surat pindah, dan lainnya langsung dari rumah tanpa harus mengantre panjang di balai desa.
                            </p>
                        </div>
                        <Link
                            href={route('warga.letters.create')}
                            className="inline-flex flex-shrink-0 items-center justify-center rounded-xl bg-white dark:bg-emerald-500/20 px-6 py-4 text-sm font-bold text-emerald-700 dark:text-white shadow hover:bg-emerald-50 dark:hover:bg-emerald-500/30 border border-transparent dark:border-emerald-400/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white transition-all hover:scale-105"
                        >
                            <FileText className="mr-2" size={20} />
                            Mulai Buat Surat
                        </Link>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Active Requests */}
                <div className="glass bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="border-b border-slate-100 dark:border-slate-700 px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Clock size={18} className="text-amber-500" />
                            Dalam Proses ({activeRequests.length})
                        </h3>
                    </div>
                    
                    <ul className="divide-y divide-slate-100 dark:divide-slate-700">
                        {activeRequests.length > 0 ? (
                            activeRequests.map((request) => (
                                <li key={request.id}>
                                    <Link href={route('warga.letters.track', request.id)} className="block hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400 mb-1">{request.letter_type?.nama_surat}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{request.keperluan}</p>
                                                <div className="mt-2 flex items-center gap-2 text-xs">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded border font-medium ${getStatusStyle(request.status)}`}>
                                                        {request.status?.replace(/_/g, ' ').toUpperCase() || 'UNKNOWN'}
                                                    </span>
                                                    <span className="text-slate-400">&bull; {new Date(request.created_at).toLocaleDateString('id-ID')}</span>
                                                </div>
                                            </div>
                                            <ChevronRight className="text-slate-300 dark:text-slate-600 flex-shrink-0 ml-4" size={20} />
                                        </div>
                                    </Link>
                                </li>
                            ))
                        ) : (
                            <li className="px-6 py-12 text-center">
                                <Info className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-600 mb-2" />
                                <p className="text-sm text-slate-500 dark:text-slate-400">Tidak ada pengajuan surat yang sedang diproses.</p>
                            </li>
                        )}
                    </ul>
                </div>

                {/* History */}
                <div className="glass bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="border-b border-slate-100 dark:border-slate-700 px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <FileCheck size={18} className="text-emerald-500" />
                            Riwayat Terakhir ({recentHistory.length})
                        </h3>
                        <Link href={route('warga.history')} className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500">
                            Lihat Semua
                        </Link>
                    </div>
                    
                    <ul className="divide-y divide-slate-100 dark:divide-slate-700">
                        {recentHistory.length > 0 ? (
                            recentHistory.map((request) => (
                                <li key={request.id}>
                                    <div className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{request.letter_type?.nama_surat}</p>
                                                <div className="mt-2 flex items-center gap-2 text-xs">
                                                    {request.status === 'selesai' ? (
                                                        <span className="inline-flex items-center text-emerald-700 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                                                            <CheckCircle size={12} className="mr-1" /> Selesai
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center text-red-700 dark:text-red-400 font-medium bg-red-50 dark:bg-red-900/30 px-2 py-0.5 rounded border border-red-200 dark:border-red-800">
                                                            <AlertCircle size={12} className="mr-1" /> Ditolak
                                                        </span>
                                                    )}
                                                    <span className="text-slate-400 dark:text-slate-500 dark:text-slate-400 text-xs">Selesai pada: {new Date(request.updated_at).toLocaleDateString('id-ID')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <li className="px-6 py-12 text-center">
                                <History className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-600 mb-2" />
                                <p className="text-sm text-slate-500 dark:text-slate-400">Belum ada riwayat persuratan.</p>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </WargaLayout>
    );
}
