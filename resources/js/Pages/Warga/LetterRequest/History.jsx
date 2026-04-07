import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import WargaLayout from '@/Layouts/WargaLayout';
import { History as HistoryIcon, FileCheck, CheckCircle, ChevronRight, AlertCircle, Search } from 'lucide-react';

export default function History({ history }) {

    return (
        <WargaLayout header="Riwayat Surat Selesai">
            <Head title="Riwayat Persuratan" />

            <div className="mb-6">
                <div className="rounded-xl bg-slate-900 border-l-4 border-emerald-500 text-white p-6 shadow-sm">
                    <div className="flex items-start md:items-center gap-4">
                        <div className="bg-slate-800 p-3 rounded-xl">
                            <HistoryIcon className="text-emerald-400" size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">Arsip Surat Saya</h2>
                            <p className="text-sm text-slate-400 mt-1">Daftar semua pengajuan surat Anda yang telah selesai diproses (terbit maupun ditolak).</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <ul className="divide-y divide-slate-100 dark:divide-slate-700">
                    {history.data.length > 0 ? (
                        history.data.map((request) => (
                            <li key={request.id}>
                                <Link href={route('warga.letters.track', request.id)} className="block hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors p-6 sm:px-8">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <p className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">{request.letter_type?.nama_surat}</p>
                                            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">{request.keperluan}</p>
                                            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                                                {request.status === 'selesai' ? (
                                                    <span className="inline-flex items-center text-emerald-700 font-bold bg-emerald-50 dark:bg-emerald-900/30 px-2.5 py-1 rounded-md border border-emerald-200">
                                                        <FileCheck size={14} className="mr-1.5" /> Surat Terbit
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center text-red-700 font-bold bg-red-50 dark:bg-red-900/30 px-2.5 py-1 rounded-md border border-red-200">
                                                        <AlertCircle size={14} className="mr-1.5" /> Ditolak / Batal
                                                    </span>
                                                )}
                                                <span className="text-slate-400 font-medium">Selesai pada: <span className="text-slate-600 dark:text-slate-400">{new Date(request.updated_at).toLocaleDateString('id-ID', {day:'numeric', month:'long', year:'numeric'})}</span></span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 sm:pl-4">
                                            <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Lihat Detail</span>
                                            <ChevronRight className="text-emerald-500 flex-shrink-0" size={20} />
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        ))
                    ) : (
                        <li className="px-6 py-16 text-center">
                            <HistoryIcon className="mx-auto h-12 w-12 text-slate-200 mb-4" />
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Arsip Kosong</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Anda belum memiliki riwayat pengajuan surat yang selesai.</p>
                        </li>
                    )}
                </ul>

                {/* Pagination Placeholder */}
                {history.links && history.links.length > 3 && (
                    <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex items-center justify-center">
                        <nav className="isolate inline-flex -space-x-px rounded-xl shadow-sm" aria-label="Pagination">
                            {history.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                        link.active 
                                            ? 'z-10 bg-emerald-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600' 
                                            : 'text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 focus:z-20 focus:outline-offset-0 disabled:opacity-50 font-medium'
                                    } ${index === 0 ? 'rounded-l-xl' : ''} ${index === history.links.length - 1 ? 'rounded-r-xl' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </nav>
                    </div>
                )}
            </div>
        </WargaLayout>
    );
}
