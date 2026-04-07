import React from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import StatCard from '@/Components/ui/StatCard';
import { FileText, CheckCircle, XCircle } from 'lucide-react';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

export default function LetterStats({ monthlyStats, byType, year, availableYears }) {
    const handleYearChange = (e) => {
        router.get(route('admin.reports.letters'), { year: e.target.value }, { preserveState: true });
    };

    const totalAll = monthlyStats.reduce((sum, m) => sum + m.total, 0);
    const totalSelesai = monthlyStats.reduce((sum, m) => sum + m.selesai, 0);
    const totalDitolak = monthlyStats.reduce((sum, m) => sum + m.ditolak, 0);
    const maxMonth = Math.max(...monthlyStats.map(m => m.total), 1);

    return (
        <AdminLayout header="Statistik Persuratan">
            <Head title="Statistik Surat" />

            <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-slate-700 dark:text-slate-300">Laporan persuratan tahun {year}</p>
                <select
                    value={year}
                    onChange={handleYearChange}
                    className="rounded-lg border-0 py-2 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm bg-white dark:bg-slate-800"
                >
                    {availableYears && availableYears.length > 0 ? (
                        availableYears.map((y) => <option key={y} value={y}>{y}</option>)
                    ) : (
                        <option value={year}>{year}</option>
                    )}
                </select>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <StatCard title="Total Surat" value={totalAll} icon={FileText} color="blue" />
                <StatCard title="Selesai" value={totalSelesai} icon={CheckCircle} color="emerald" />
                <StatCard title="Ditolak" value={totalDitolak} icon={XCircle} color="rose" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Chart */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700/60 overflow-hidden">
                    <div className="p-5 border-b border-slate-100 dark:border-slate-700">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Surat per Bulan ({year})</h3>
                    </div>
                    <div className="p-5">
                        <div className="flex items-end gap-2 h-48">
                            {MONTHS.map((month, i) => {
                                const stat = monthlyStats.find(m => m.month === i + 1);
                                const total = stat?.total || 0;
                                const height = maxMonth > 0 ? (total / maxMonth) * 100 : 0;
                                return (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{total || ''}</span>
                                        <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-t-md relative" style={{ height: '160px' }}>
                                            <div
                                                className="absolute bottom-0 w-full bg-gradient-to-t from-emerald-600 to-teal-500 rounded-t-md transition-all duration-500"
                                                style={{ height: `${height}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-slate-400">{month}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* By Type */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700/60 overflow-hidden">
                    <div className="p-5 border-b border-slate-100 dark:border-slate-700">
                        <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Berdasarkan Jenis Surat</h3>
                    </div>
                    <div className="p-5">
                        {byType.length === 0 ? (
                            <p className="text-center text-slate-500 dark:text-slate-400 py-8">Belum ada data.</p>
                        ) : (
                            <div className="space-y-3">
                                {byType.map((item, i) => {
                                    const maxType = Math.max(...byType.map(b => b.total), 1);
                                    const colors = ['#059669', '#0891b2', '#6366f1', '#a855f7', '#f97316', '#ec4899'];
                                    return (
                                        <div key={i} className="flex items-center gap-3">
                                            <span className="text-xs text-slate-600 dark:text-slate-400 w-32 text-right truncate flex-shrink-0">
                                                {item.letter_type?.name || 'Unknown'}
                                            </span>
                                            <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-6 overflow-hidden relative">
                                                <div
                                                    className="h-full rounded-full transition-all duration-500 flex items-center px-2"
                                                    style={{ width: `${Math.max((item.total / maxType) * 100, 8)}%`, backgroundColor: colors[i % colors.length] }}
                                                >
                                                    <span className="text-xs text-white font-medium">{item.total}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
