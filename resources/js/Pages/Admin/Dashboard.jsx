import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Users, FileText, CheckCircle, Clock, Store } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function Dashboard({ stats, chartData }) {
    const cards = [
        { name: 'Total Penduduk', stat: stats.total_penduduk, icon: Users, bgColor: 'bg-blue-50 dark:bg-blue-900/30', textColor: 'text-blue-600 dark:text-blue-400' },
        { name: 'Total KK', stat: stats.total_kk, icon: Users, bgColor: 'bg-indigo-50 dark:bg-indigo-900/30', textColor: 'text-indigo-600 dark:text-indigo-400' },
        { name: 'Unit UMKM', stat: stats.total_umkm, icon: Store, bgColor: 'bg-amber-50 dark:bg-amber-900/30', textColor: 'text-amber-600 dark:text-amber-400' },
        { name: 'Surat Selesai (Bulan Ini)', stat: stats.surat_selesai, icon: CheckCircle, bgColor: 'bg-emerald-50 dark:bg-emerald-900/30', textColor: 'text-emerald-600 dark:text-emerald-400' },
        { name: 'Menunggu Diproses', stat: stats.surat_pending, icon: Clock, bgColor: 'bg-violet-50 dark:bg-violet-900/30', textColor: 'text-violet-600 dark:text-violet-400' },
    ];

    return (
        <AdminLayout header="Dashboard">
            <Head title="Admin Dashboard" />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {cards.map((card) => (
                    <div key={card.name} className="glass overflow-hidden rounded-xl bg-white dark:bg-slate-800 dark:border dark:border-slate-700 p-6 shadow-sm transition-all hover:shadow-md">
                        <div className="flex items-center">
                            <div className={`flex flex-shrink-0 items-center justify-center h-12 w-12 rounded-xl ${card.bgColor} ${card.textColor}`}>
                                <card.icon className="h-6 w-6" aria-hidden="true" />
                            </div>
                            <div className="ml-4 truncate">
                                <p className="truncate text-sm font-medium text-slate-500 dark:text-slate-400">{card.name}</p>
                                <p className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{card.stat}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div className="glass rounded-xl bg-white dark:bg-slate-800 dark:border dark:border-slate-700 shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Demografi Kelompok Usia</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData?.age || []} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                                <YAxis tick={{fill: '#64748b', fontSize: 12}} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                                    cursor={{fill: '#f8fafc'}}
                                />
                                <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass rounded-xl bg-white dark:bg-slate-800 dark:border dark:border-slate-700 shadow-sm p-6">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Demografi Gender</h2>
                    <div className="h-64 flex justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData?.gender || []}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {(chartData?.gender || []).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : '#ec4899'} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Legend */}
                        <div className="absolute bottom-6 right-6 flex flex-col gap-2">
                             {(chartData?.gender || []).map((entry, index) => (
                                <div key={`legend-${index}`} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                    <div className="w-3 h-3 rounded-full" style={{backgroundColor: index === 0 ? '#3b82f6' : '#ec4899'}}></div>
                                    <span>{entry.name}: {entry.value}</span>
                                </div>
                             ))}
                        </div>
                    </div>
                </div>

                {/* Placeholder List */}
                <div className="glass rounded-xl bg-white dark:bg-slate-800 dark:border dark:border-slate-700 shadow-sm p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-10">
                        <FileText className="w-48 h-48 text-emerald-500" />
                    </div>
                    <div className="relative">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Pintasan Layanan</h2>
                        <div className="space-y-3">
                            <Link href={route('admin.letters.walkin')} className="block p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors group">
                                <div className="flex items-center">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">Buat Surat Langsung</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Layanan kiosk / walk-in untuk warga ke balai desa</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-300 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                        &rarr;
                                    </div>
                                </div>
                            </Link>
                            <Link href={route('admin.letters.queue')} className="block p-4 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors group">
                                <div className="flex items-center">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">Antrean Proses Surat</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Cek permohonan surat yang memerlukan proses admin</p>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-300 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                        &rarr;
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
