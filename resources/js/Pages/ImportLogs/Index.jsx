import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import RtLayout from '@/Layouts/RtLayout';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import { ClipboardList, Eye, FileSpreadsheet, CheckCircle2, AlertCircle, ChevronRight, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export default function Index({ auth, logs }) {
    const [selectedLog, setSelectedLog] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Safeguard for roles and layout
    const userRole = auth?.user?.roles?.[0] || 'warga';
    const Layout = (userRole === 'operator' || userRole === 'kades') ? AdminLayout : RtLayout;

    if (!logs || !logs.data) {
        return (
            <Layout header="Log Riwayat Import">
                <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-xl shadow">
                    Memuat data...
                </div>
            </Layout>
        );
    }

    const openDetails = (log) => {
        setSelectedLog(log);
        setIsModalOpen(true);
    };

    return (
        <Layout
            header="Log Riwayat Import"
        >
            <Head title="Log Import" />

            <div className="max-w-7xl mx-auto">
                <div className="mb-6 flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-lg">
                        <ClipboardList size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Riwayat Import Data</h2>
                        <p className="text-slate-500 dark:text-slate-400">Daftar semua proses import Excel yang pernah dilakukan.</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs uppercase bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Waktu & File</th>
                                    <th className="px-6 py-4 font-semibold">Oleh</th>
                                    <th className="px-6 py-4 font-semibold text-center">Status</th>
                                    <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {logs.data.length > 0 ? (
                                    logs.data.map((log) => (
                                        <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-slate-900 dark:text-white flex items-center gap-1.5">
                                                        <FileSpreadsheet size={14} className="text-slate-400" />
                                                        {log.filename}
                                                    </span>
                                                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                                                        <Calendar size={12} />
                                                        {format(new Date(log.created_at), 'dd MMMM yyyy, HH:mm', { locale: id })}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-slate-700 dark:text-slate-300">{log.user?.name || 'Unknown'}</div>
                                                <div className="text-xs text-slate-500">{log.user?.roles?.[0]?.name || log.user?.roles?.[0] || 'Unknown'}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-center gap-3">
                                                    <div className="flex flex-col items-center">
                                                        <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                                                            <CheckCircle2 size={14} />
                                                            {log.total_success}
                                                        </div>
                                                        <span className="text-[10px] uppercase text-slate-400">Berhasil</span>
                                                    </div>
                                                    <div className="flex flex-col items-center">
                                                        <div className={`flex items-center gap-1 font-bold ${log.total_skipped > 0 ? 'text-amber-500' : 'text-slate-400'}`}>
                                                            <AlertCircle size={14} />
                                                            {log.total_skipped}
                                                        </div>
                                                        <span className="text-[10px] uppercase text-slate-400">Dilewati</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => openDetails(log)}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600 transition-all shadow-sm"
                                                >
                                                    <Eye size={14} />
                                                    Detail
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                                            Belum ada riwayat import data.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {logs.links && logs.links.length > 3 && (
                        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-700 flex justify-center">
                            <div className="flex gap-1">
                                {logs.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || '#'}
                                        className={`px-3 py-1 text-xs rounded-md border ${
                                            link.active 
                                                ? 'bg-emerald-600 text-white border-emerald-600' 
                                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                                        } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Details Modal */}
            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="2xl">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <ClipboardList className="text-emerald-600" />
                            Detail Hasil Import
                        </h3>
                        <div className="text-sm text-slate-500">
                            {selectedLog && format(new Date(selectedLog.created_at), 'dd MMM yyyy')}
                        </div>
                    </div>

                    {selectedLog && (
                        <div className="space-y-6">
                            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                                        <div className="text-2xl font-bold text-emerald-600">{selectedLog.total_success}</div>
                                        <div className="text-xs uppercase text-slate-500 font-semibold tracking-wider">Berhasil</div>
                                    </div>
                                    <div className="text-center p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                                        <div className={`text-2xl font-bold ${selectedLog.total_skipped > 0 ? 'text-amber-500' : 'text-slate-400'}`}>
                                            {selectedLog.total_skipped}
                                        </div>
                                        <div className="text-xs uppercase text-slate-500 font-semibold tracking-wider">Dilewati</div>
                                    </div>
                                </div>
                            </div>

                            {selectedLog.details?.summary && (
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2 ml-1">Ringkasan per Sheet:</h4>
                                    <div className="space-y-1">
                                        {selectedLog.details.summary.map((s, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 px-3 py-2 bg-slate-50 dark:bg-slate-900/30 rounded-lg">
                                                <ChevronRight size={14} className="text-slate-400" />
                                                {s}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div>
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2 ml-1">
                                    Detail Data Dilewati ({selectedLog.total_skipped}):
                                </h4>
                                <div className="max-h-60 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                                    {(selectedLog.details?.skipped || selectedLog.details?.skipped_details)?.length > 0 ? (
                                        <table className="w-full text-xs text-left">
                                            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 sticky top-0">
                                                <tr>
                                                    <th className="px-4 py-2 font-semibold">Nama</th>
                                                    <th className="px-4 py-2 font-semibold">NIK</th>
                                                    <th className="px-4 py-2 font-semibold">Alasan</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                                {(selectedLog.details?.skipped || selectedLog.details?.skipped_details).map((item, i) => (
                                                    <tr key={i}>
                                                        <td className="px-4 py-2 text-slate-900 dark:text-slate-200 font-medium">{item.nama}</td>
                                                        <td className="px-4 py-2 text-slate-500 font-mono">{item.nik}</td>
                                                        <td className="px-4 py-2">
                                                            <span className="px-1.5 py-0.5 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded text-[10px]">
                                                                {item.reason}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <div className="p-8 text-center text-slate-400 italic">
                                            Tidak ada data yang dilewati.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 flex justify-end">
                        <SecondaryButton onClick={() => setIsModalOpen(false)}>
                            Tutup
                        </SecondaryButton>
                    </div>
                </div>
            </Modal>
        </Layout>
    );
}
