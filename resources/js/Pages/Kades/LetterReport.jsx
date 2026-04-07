import React from 'react';
import { Head } from '@inertiajs/react';
import KadesLayout from '@/Layouts/KadesLayout';
import StatCard from '@/Components/ui/StatCard';
import { FileText, CheckCircle, Clock } from 'lucide-react';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

export default function LetterReport({ monthlyStats, summary, year }) {
    const maxMonth = Math.max(...monthlyStats.map(m => m.total), 1);

    return (
        <KadesLayout header="Laporan Persuratan">
            <Head title="Laporan Persuratan" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <StatCard title={`Total Surat ${year}`} value={summary.total} icon={FileText} color="blue" />
                <StatCard title="Selesai" value={summary.selesai} icon={CheckCircle} color="emerald" />
                <StatCard title="Dalam Proses" value={summary.pending} icon={Clock} color="amber" />
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700/60 overflow-hidden">
                <div className="p-5 border-b border-slate-100 dark:border-slate-700">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Tren Surat per Bulan ({year})</h3>
                </div>
                <div className="p-5">
                    <div className="flex items-end gap-2 h-48">
                        {MONTHS.map((month, i) => {
                            const stat = monthlyStats.find(m => m.month === i + 1);
                            const total = stat?.total || 0;
                            const selesai = stat?.selesai || 0;
                            const height = maxMonth > 0 ? (total / maxMonth) * 100 : 0;
                            const selesaiHeight = maxMonth > 0 ? (selesai / maxMonth) * 100 : 0;
                            return (
                                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{total || ''}</span>
                                    <div className="w-full relative" style={{ height: '160px' }}>
                                        <div className="absolute bottom-0 w-full bg-slate-100 dark:bg-slate-700 rounded-t-md" style={{ height: `${height}%` }} />
                                        <div className="absolute bottom-0 w-full bg-gradient-to-t from-emerald-600 to-teal-500 rounded-t-md transition-all duration-500" style={{ height: `${selesaiHeight}%` }} />
                                    </div>
                                    <span className="text-xs text-slate-400">{month}</span>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex items-center gap-6 mt-4 justify-center">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-slate-200" />
                            <span className="text-xs text-slate-500 dark:text-slate-400">Total</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-emerald-500" />
                            <span className="text-xs text-slate-500 dark:text-slate-400">Selesai</span>
                        </div>
                    </div>
                </div>
            </div>
        </KadesLayout>
    );
}
