import React from 'react';
import { Head, Link } from '@inertiajs/react';
import RwLayout from '@/Layouts/RwLayout';
import { Users, Heart, CreditCard, MapPin, FileText, ArrowUpDown, ChevronRight, Store, MessageSquareWarning, AlertTriangle, Zap } from 'lucide-react';
import { MUTATION_TYPES } from '@/Helpers/constants';

export default function Dashboard({ stats, recentMutations }) {
    return (
        <RwLayout header="Dashboard Ketua RW">
            <Head title="Dashboard RW" />

            <div className="mb-8">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-8 shadow-lg sm:px-12">
                    <div className="absolute inset-0 bg-teal-700/30 backdrop-blur-xl blur-2xl z-0" />
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Selamat Datang, Ketua RW</h2>
                        <p className="text-teal-100 text-sm max-w-2xl">
                            Pantau data penduduk, anggota Rukun Kematian, dan kelola akses RT di wilayah RW Anda.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                {[
                    { label: 'Total Penduduk', value: stats.total_penduduk, icon: Users, color: 'emerald', link: route('rw.residents') },
                    { label: 'Anggota Rukem', value: stats.total_rukem, icon: Heart, color: 'rose', link: route('rw.rukem') },
                    { label: 'Unit UMKM', value: stats.total_umkm, icon: Store, color: 'amber', link: route('rw.umkm') },
                    { label: 'Kartu Keluarga', value: stats.total_kk, icon: CreditCard, color: 'blue' },
                ].map((stat) => (
                    <div key={stat.label} className={`relative overflow-hidden rounded-xl bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 hover:shadow-md transition-all border-l-4 border-${stat.color}-500`}>
                        <dt className="flex items-center gap-x-3">
                            <div className={`p-2.5 bg-${stat.color}-100 dark:bg-${stat.color}-900/30 rounded-lg text-${stat.color}-600 dark:text-${stat.color}-400`}>
                                <stat.icon size={20} />
                            </div>
                            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</div>
                        </dt>
                        <dd className="mt-4 flex items-baseline gap-x-2">
                            <span className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">{stat.value?.toLocaleString('id-ID') || 0}</span>
                        </dd>
                        {stat.link && (
                            <Link href={stat.link} className="absolute inset-0" />
                        )}
                    </div>
                ))}
            </div>

            <div className="mb-8 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <MapPin size={20} className="text-indigo-500" />
                    Analisa Wilayah (Hunian & Sanitasi)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800">
                        <p className="text-sm font-medium text-indigo-800 dark:text-indigo-300 mb-1">KK Menumpang (Bebas Sewa)</p>
                        <p className="text-2xl font-black text-indigo-900 dark:text-indigo-100">{stats.total_bebas_sewa || 0} <span className="text-xs font-normal">KK</span></p>
                    </div>
                    <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800">
                        <p className="text-sm font-medium text-orange-800 dark:text-orange-300 mb-1">Belum Punya Jamban Sendiri</p>
                        <p className="text-2xl font-black text-orange-900 dark:text-orange-100">{stats.total_tanpa_jamban || 0} <span className="text-xs font-normal">KK</span></p>
                    </div>
                    <div className="p-4 rounded-lg bg-teal-50 dark:bg-teal-900/20 border border-teal-100 dark:border-teal-800">
                        <p className="text-sm font-medium text-teal-800 dark:text-teal-300 mb-1">Warga Pendatang (Domisili)</p>
                        <p className="text-2xl font-black text-teal-900 dark:text-teal-100">{stats.total_pendatang || 0} <span className="text-xs font-normal">KK</span></p>
                    </div>
                    <div className={`p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 relative group cursor-pointer hover:shadow-md transition-all`}>
                        <Link href={route('rw.complaints.index', { status: 'diteruskan_rw' })} className="absolute inset-0 z-10" />
                        <p className="text-sm font-medium text-indigo-800 dark:text-indigo-300 mb-1 flex items-center gap-1.5">
                            <Zap size={14} className="text-amber-500 fill-amber-500" /> Pengaduan Penting (Eskalasi)
                        </p>
                        <p className="text-2xl font-black text-indigo-900 dark:text-indigo-100">{stats.escalated_complaints || 0} <span className="text-xs font-normal">Laporan</span></p>
                    </div>
                    <div className={`col-span-1 md:col-span-2 p-4 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 relative group cursor-pointer hover:shadow-md transition-all`}>
                        <Link href={route('rw.complaints.index')} className="absolute inset-0 z-10" />
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-400 mb-1">Total Pengaduan Aktif (Seluruh RT)</p>
                        <p className="text-2xl font-black text-slate-900 dark:text-white">{stats.active_complaints || 0} <span className="text-xs font-normal">Laporan Terbuka</span></p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Mutations */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-6 py-4">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <ArrowUpDown size={18} className="text-teal-500" />
                            Mutasi Terbaru
                        </h3>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-700">
                        {recentMutations.length > 0 ? recentMutations.map((m) => (
                            <div key={m.id} className="px-6 py-4 flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{m.resident?.nama_lengkap}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{MUTATION_TYPES[m.type] || m.type} — {new Date(m.tanggal_mutasi).toLocaleDateString('id-ID')}</p>
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
                            <div className="px-6 py-12 text-center text-sm text-slate-500 dark:text-slate-400">Belum ada data mutasi.</div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-6">
                    <div className="rounded-xl border border-teal-200 dark:border-teal-900/50 bg-teal-50 dark:bg-teal-900/20 p-6 shadow-sm">
                        <h3 className="text-base font-bold text-teal-900 dark:text-teal-300 mb-3">Tugas Ketua RW</h3>
                        <div className="text-sm text-teal-800 dark:text-teal-200 space-y-2">
                            <p>• Memantau data penduduk dan keanggotaan Rukun Kematian di seluruh RT.</p>
                            <p>• Mencetak laporan data penduduk, rukem, mutasi (pindah, masuk, meninggal, lahir).</p>
                            <p>• Mengelola akses pengguna Ketua RT.</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-6 shadow-sm rounded-xl border border-slate-200 dark:border-slate-700">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Aksi Cepat</h3>
                        <div className="space-y-3">
                            {[
                                { label: 'Lihat Data Penduduk', href: route('rw.residents'), color: 'emerald' },
                                { label: 'Data Rukun Kematian', href: route('rw.rukem'), color: 'rose' },
                                { label: 'Data UMKM', href: route('rw.umkm'), color: 'amber' },
                                { label: 'Monitor Pengaduan', href: route('rw.complaints.index'), color: 'indigo' },
                                { label: 'Report & Cetak', href: route('rw.reports'), color: 'blue' },
                                { label: 'Kelola Akses RT', href: route('rw.rt-users.index'), color: 'violet' },
                            ].map((action) => (
                                <Link key={action.label} href={action.href} className={`flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-${action.color}-500 hover:bg-${action.color}-50 dark:hover:bg-${action.color}-900/30 group transition-all`}>
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{action.label}</span>
                                    <ChevronRight size={16} className="text-slate-400" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </RwLayout>
    );
}
