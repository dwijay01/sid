import React from 'react';
import { Head, Link } from '@inertiajs/react';
import RtLayout from '@/Layouts/RtLayout';
import { Users, CreditCard, Heart, FileText, ArrowUpDown, ChevronRight, Clock, UserPlus, Baby, Skull, ArrowRightLeft, Store, MessageSquareWarning } from 'lucide-react';
import { MUTATION_TYPES } from '@/Helpers/constants';

export default function Dashboard({ stats, recentMutations }) {
    return (
        <RtLayout header="Dashboard Ketua RT">
            <Head title="Dashboard RT" />

            <div className="mb-8">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 shadow-lg sm:px-12">
                    <div className="absolute inset-0 bg-blue-700/30 backdrop-blur-xl blur-2xl z-0" />
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Selamat Datang, Ketua RT</h2>
                        <p className="text-blue-100 text-sm max-w-2xl">
                            Kelola data penduduk, mutasi, dan anggota Rukun Kematian di wilayah RT Anda.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                {[
                    { label: 'Total Penduduk', value: stats.total_penduduk, icon: Users, color: 'emerald' },
                    { label: 'Kartu Keluarga', value: stats.total_kk, icon: CreditCard, color: 'blue' },
                    { label: 'Unit UMKM', value: stats.total_umkm, icon: Store, color: 'amber' },
                    { label: 'Pengaduan Aktif', value: stats.active_complaints, icon: MessageSquareWarning, color: 'indigo', link: route('rt.complaints.index') },
                ].map((stat) => (
                    <div key={stat.label} className={`relative overflow-hidden rounded-xl bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 hover:shadow-md transition-all border-l-4 border-${stat.color}-500 group`}>
                        {stat.link && <Link href={stat.link} className="absolute inset-0 z-10" />}
                        <dt className="flex items-center gap-x-3">
                            <div className={`p-2.5 bg-${stat.color}-100 dark:bg-${stat.color}-900/30 rounded-lg text-${stat.color}-600`}>
                                <stat.icon size={20} />
                            </div>
                            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{stat.label}</div>
                        </dt>
                        <dd className="mt-4 text-3xl font-black text-slate-900 dark:text-white">{stat.value?.toLocaleString('id-ID') || 0}</dd>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Mutations */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 shadow-sm rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex justify-between items-center">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <ArrowUpDown size={18} className="text-blue-500" /> Mutasi Penduduk Terbaru
                        </h3>
                        <Link href={route('rt.mutations.index')} className="text-sm font-semibold text-blue-600 hover:text-blue-500">Lihat Semua →</Link>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-700">
                        {recentMutations.length > 0 ? recentMutations.map((m) => (
                            <div key={m.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                <div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{m.resident?.nama_lengkap}</p>
                                    <p className="text-xs text-slate-500">{MUTATION_TYPES[m.type] || m.type} — {new Date(m.tanggal_mutasi).toLocaleDateString('id-ID')}</p>
                                </div>
                                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ring-1 ring-inset ${
                                    m.type === 'lahir' ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' :
                                    m.type === 'mati' ? 'bg-red-50 text-red-700 ring-red-600/20' :
                                    m.type === 'pindah_keluar' ? 'bg-amber-50 text-amber-700 ring-amber-600/20' :
                                    'bg-blue-50 text-blue-700 ring-blue-600/20'
                                }`}>
                                    {MUTATION_TYPES[m.type] || m.type}
                                </span>
                            </div>
                        )) : (
                            <div className="px-6 py-12 text-center text-sm text-slate-500">Tidak ada data mutasi terbaru.</div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-800 p-6 shadow-sm rounded-xl border border-slate-200 dark:border-slate-700">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Input Data Cepat</h3>
                        <div className="space-y-2">
                            {[
                                { label: 'Input KK Baru', href: route('rt.family-cards.create'), icon: CreditCard, color: 'blue' },
                                { label: 'Input Penduduk Baru', href: route('rt.residents.create'), icon: UserPlus, color: 'emerald' },
                                { label: 'Kelahiran', href: route('rt.mutations.birth'), icon: Baby, color: 'pink' },
                                { label: 'Kematian', href: route('rt.mutations.death'), icon: Skull, color: 'red' },
                                { label: 'Warga Pindah', href: route('rt.mutations.move-out'), icon: ArrowRightLeft, color: 'amber' },
                                { label: 'Warga Masuk', href: route('rt.mutations.move-in'), icon: ArrowRightLeft, color: 'indigo' },
                                { label: 'Input Anggota Rukem', href: route('rt.rukem.create'), icon: Heart, color: 'rose' },
                                { label: 'Pendataan UMKM', href: route('rt.umkm.create'), icon: Store, color: 'amber' },
                                { label: 'Tinjau Pengaduan', href: route('rt.complaints.index'), icon: MessageSquareWarning, color: 'indigo' },
                            ].map((a) => (
                                <Link key={a.label} href={a.href} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 group transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className={`bg-${a.color}-100 dark:bg-${a.color}-900/30 p-1.5 rounded text-${a.color}-600`}>
                                            <a.icon size={14} />
                                        </div>
                                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{a.label}</span>
                                    </div>
                                    <ChevronRight size={14} className="text-slate-400" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </RtLayout>
    );
}
