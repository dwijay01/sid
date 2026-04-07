import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import StatCard from '@/Components/ui/StatCard';
import { Users, UserCheck, Home } from 'lucide-react';

export default function Demography({ chartData, summary }) {
    const COLORS = ['#059669', '#0d9488', '#0891b2', '#6366f1', '#a855f7', '#ec4899', '#f97316', '#eab308'];

    return (
        <AdminLayout header="Laporan Demografi">
            <Head title="Laporan Demografi" />

            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard title="Total Penduduk" value={summary.total_penduduk} icon={Users} color="emerald" />
                <StatCard title="Total KK" value={summary.total_kk} icon={Home} color="blue" />
                <StatCard title="Laki-Laki" value={summary.laki_laki} icon={UserCheck} color="purple" />
                <StatCard title="Perempuan" value={summary.perempuan} icon={UserCheck} color="rose" />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gender */}
                <ChartCard title="Distribusi Gender" data={chartData.gender} colors={COLORS} />

                {/* Age */}
                <ChartCard title="Kelompok Usia" data={chartData.age} colors={COLORS} type="bar" />

                {/* Religion */}
                <ChartCard title="Distribusi Agama" data={chartData.religion} colors={COLORS} />

                {/* Education */}
                <ChartCard title="Tingkat Pendidikan" data={chartData.education} colors={COLORS} type="bar" />

                {/* Occupation */}
                {chartData.occupation && (
                    <div className="lg:col-span-2">
                        <ChartCard title="Pekerjaan (Top 15)" data={chartData.occupation} colors={COLORS} type="bar" />
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

function ChartCard({ title, data, colors, type = 'pie' }) {
    const maxVal = Math.max(...data.map(d => d.value), 1);

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700/60 overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-700">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h3>
            </div>
            <div className="p-5">
                {type === 'pie' ? (
                    <div className="space-y-3">
                        {data.map((item, i) => {
                            const total = data.reduce((sum, d) => sum + d.value, 0);
                            const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
                            return (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: colors[i % colors.length] }} />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-700 dark:text-slate-300 font-medium truncate">{item.name}</span>
                                            <span className="text-slate-500 dark:text-slate-400 ml-2">{item.value.toLocaleString('id-ID')} ({pct}%)</span>
                                        </div>
                                        <div className="mt-1 w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                                            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: colors[i % colors.length] }} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="space-y-2.5">
                        {data.map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <span className="text-xs text-slate-500 dark:text-slate-400 w-24 text-right truncate flex-shrink-0">{item.name}</span>
                                <div className="flex-1 bg-slate-100 dark:bg-slate-700 rounded-full h-6 overflow-hidden relative">
                                    <div
                                        className="h-full rounded-full transition-all duration-500 flex items-center px-2"
                                        style={{ width: `${Math.max((item.value / maxVal) * 100, 5)}%`, backgroundColor: colors[i % colors.length] }}
                                    >
                                        <span className="text-xs text-white font-medium">{item.value}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
