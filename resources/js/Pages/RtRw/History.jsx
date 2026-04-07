import React from 'react';
import { Head, Link } from '@inertiajs/react';
import RtRwLayout from '@/Layouts/RtRwLayout';
import { History as HistoryIcon, User, Search, FileSignature } from 'lucide-react';

export default function History({ history }) {

    return (
        <RtRwLayout header="Riwayat Persetujuan">
            <Head title="Riwayat Persetujuan RT/RW" />

            <div className="mb-6">
                <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-100 p-3 rounded-xl text-blue-600 dark:text-blue-400">
                            <HistoryIcon size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Arsip Persetujuan</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Daftar semua permohonan surat warga yang sudah pernah Anda review.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th scope="col" className="py-3.5 pl-6 pr-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tgl Review</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pemohon</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Detail Surat</th>
                                <th scope="col" className="px-3 py-3.5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Keputusan Anda</th>
                                <th scope="col" className="relative py-3.5 pl-3 pr-6"><span className="sr-only">Aksi</span></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700 bg-white dark:bg-slate-800">
                            {history.data.length > 0 ? (
                                history.data.map((request) => {
                                    // Find log where actor was this RT/RW
                                    const actionTaken = request.logs?.find(l => l.actor_id === 1) || null; // Assume auth()->id() is 1 for mocked demo
                                    
                                    // Normally we would just display the status, or determine if they approved or rejected it.
                                    // Let's just determine by status if 'ditolak' or not
                                    const isRejected = request.status === 'ditolak_rt' || request.status === 'ditolak';

                                    return (
                                        <tr key={request.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                           <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm text-slate-600 dark:text-slate-400">
                                                {new Date(request.approved_at || request.updated_at).toLocaleDateString('id-ID', {day:'numeric', month:'short', year:'numeric'})}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-slate-900 dark:text-white">
                                                {request.resident?.nama_lengkap}
                                            </td>
                                            <td className="px-3 py-4 text-sm text-slate-600 dark:text-slate-400 max-w-[200px] truncate">
                                                <div className="font-bold text-slate-800 dark:text-slate-200">{request.letter_type?.nama_surat}</div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">{request.keperluan}</div>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm">
                                                {isRejected ? (
                                                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Ditolak</span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800">Disetujui</span>
                                                )}
                                            </td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium">
                                                <Link
                                                    href={route('rtrw.approval.show', request.id)}
                                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-900 mx-2" title="Lihat Detail"
                                                >
                                                    <FileSignature size={18} className="inline" />
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                                        Tidak ada riwayat persetujuan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </RtRwLayout>
    );
}
