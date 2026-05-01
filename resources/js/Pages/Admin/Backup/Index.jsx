import React from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Database, Download, Trash2, Plus, Clock, HardDrive, AlertTriangle } from 'lucide-react';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Index({ backups = [] }) {
    const handleCreateBackup = () => {
        if (confirm('Apakah Anda yakin ingin membuat backup database sekarang? Proses ini mungkin memakan waktu beberapa saat.')) {
            router.post(route('admin.backup.create'));
        }
    };

    const handleDelete = (filename) => {
        if (confirm(`Apakah Anda yakin ingin menghapus file backup "${filename}"?`)) {
            router.delete(route('admin.backup.destroy', filename));
        }
    };

    return (
        <AdminLayout header="Backup Database">
            <Head title="Backup Database" />

            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Cadangkan seluruh data sistem secara berkala untuk mencegah kehilangan data.
                    </p>
                </div>
                <PrimaryButton 
                    onClick={handleCreateBackup}
                    className="flex items-center gap-2"
                >
                    <Plus size={18} />
                    Buat Backup Baru
                </PrimaryButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg">
                        <Database size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Total File</p>
                        <p className="text-xl font-bold text-slate-900 dark:text-white">{backups.length}</p>
                    </div>
                </div>
                
                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                        <HardDrive size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Penyimpanan</p>
                        <p className="text-xl font-bold text-slate-900 dark:text-white">
                            Local Disk
                        </p>
                    </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-5 border border-amber-200 dark:border-amber-800 flex items-start gap-3">
                    <AlertTriangle className="text-amber-600 dark:text-amber-500 flex-shrink-0" size={20} />
                    <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                        Sangat disarankan untuk mengunduh file backup dan menyimpannya di luar server ini (Cloud/Disk Eksternal) untuk keamanan maksimal.
                    </p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-700">
                            <tr>
                                <th className="px-6 py-4">Nama File</th>
                                <th className="px-6 py-4">Ukuran</th>
                                <th className="px-6 py-4">Waktu Pembuatan</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {backups.length > 0 ? (
                                backups.map((backup) => (
                                    <tr key={backup.name} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                            <div className="flex items-center gap-2">
                                                <FileCode className="text-slate-400" size={16} />
                                                {backup.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{backup.size}</td>
                                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                                            <div className="flex items-center gap-2">
                                                <Clock size={14} className="text-slate-400" />
                                                {backup.created_at}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <a
                                                    href={route('admin.backup.download', backup.name)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                                    title="Unduh"
                                                >
                                                    <Download size={18} />
                                                </a>
                                                <button
                                                    onClick={() => handleDelete(backup.name)}
                                                    className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors"
                                                    title="Hapus"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 italic">
                                        Belum ada file backup yang tersedia.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}

// Simple icon replacement since I used FileCode which might not be imported correctly
const FileCode = ({ size, className }) => (
    <Database size={size} className={className} />
);
