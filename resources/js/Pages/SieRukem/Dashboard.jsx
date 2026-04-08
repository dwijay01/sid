import React from 'react';
import { Head, Link } from '@inertiajs/react';
import SieRukemLayout from '@/Layouts/SieRukemLayout';
import { Heart, Users, UserCheck, UserX, ChevronRight } from 'lucide-react';

export default function Dashboard({ stats, recentMembers }) {
    return (
        <SieRukemLayout header="Dashboard Rukun Kematian">
            <Head title="Dashboard - Sie Rukem" />

            <div className="mb-8">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-8 shadow-lg sm:px-12">
                    <div className="absolute inset-0 bg-violet-700/30 backdrop-blur-xl blur-2xl z-0" />
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Sie. Rukun Kematian</h2>
                        <p className="text-violet-100 text-sm max-w-2xl">
                            Rukun Kematian (Rukem) adalah lembaga sosial warga yang bergerak dalam bidang pelayanan jasa kematian dan solidaritas sosial — membantu keluarga yang berduka dalam pengurusan jenazah dan pemberian santunan.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                {[
                    { label: 'Total Anggota', value: stats.total, icon: Users, color: 'violet' },
                    { label: 'Anggota Aktif', value: stats.aktif, icon: UserCheck, color: 'emerald' },
                    { label: 'Nonaktif', value: stats.nonaktif, icon: UserX, color: 'amber' },
                    { label: 'Keluar', value: stats.keluar, icon: UserX, color: 'red' },
                ].map((stat) => (
                    <div key={stat.label} className={`relative overflow-hidden rounded-xl bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 hover:shadow-md transition-all border-l-4 border-${stat.color}-500`}>
                        <dt className="flex items-center gap-x-3">
                            <div className={`p-2.5 bg-${stat.color}-100 dark:bg-${stat.color}-900/30 rounded-lg text-${stat.color}-600 dark:text-${stat.color}-400`}>
                                <stat.icon size={20} />
                            </div>
                            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</div>
                        </dt>
                        <dd className="mt-4 text-3xl font-black text-slate-900 dark:text-white">{stat.value?.toLocaleString('id-ID') || 0}</dd>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex justify-between items-center">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2"><Heart size={18} className="text-rose-500" /> Anggota Terbaru</h3>
                        <Link href={route('sie-rukem.members')} className="text-sm font-semibold text-violet-600 hover:text-violet-500">Lihat Semua →</Link>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-700">
                        {recentMembers.length > 0 ? recentMembers.map((m) => (
                            <div key={m.id} className="px-6 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-700 dark:text-violet-400 font-bold">
                                        {m.resident?.nama_lengkap?.charAt(0) || '?'}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{m.resident?.nama_lengkap}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            {m.nomor_anggota} • {m.resident?.family_card?.wilayah ? `RT ${m.resident.family_card.wilayah.rt}/RW ${m.resident.family_card.wilayah.rw}` : ''}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-xs text-slate-500 dark:text-slate-400">{new Date(m.tanggal_gabung).toLocaleDateString('id-ID')}</span>
                            </div>
                        )) : (
                            <div className="px-6 py-12 text-center text-sm text-slate-500 dark:text-slate-400">Belum ada anggota terdaftar.</div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-xl border border-violet-200 dark:border-violet-900/50 bg-violet-50 dark:bg-violet-900/20 p-6 shadow-sm">
                        <h3 className="text-base font-bold text-violet-900 dark:text-violet-300 mb-3">Tentang Rukem</h3>
                        <div className="text-sm text-violet-800 dark:text-violet-200 space-y-2">
                            <p>Rukun Kematian membantu keluarga yang berduka dalam:</p>
                            <ul className="list-disc list-inside space-y-1 ml-2">
                                <li>Memandikan jenazah</li>
                                <li>Mengkafani jenazah</li>
                                <li>Menyalatkan jenazah</li>
                                <li>Pemakaman</li>
                                <li>Memberikan santunan</li>
                            </ul>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-6 shadow-sm rounded-xl border border-slate-200 dark:border-slate-700">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Aksi Cepat</h3>
                        <Link href={route('sie-rukem.members')} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-900/30 group transition-all">
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Lihat Semua Anggota</span>
                            <ChevronRight size={16} className="text-slate-400" />
                        </Link>
                    </div>
                </div>
            </div>
        </SieRukemLayout>
    );
}
