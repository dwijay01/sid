import React from 'react';
import { Head, Link } from '@inertiajs/react';
import RtRwLayout from '@/Layouts/RtRwLayout';
import { FileSignature, Users, CheckCircle, Clock, AlertTriangle, ChevronRight, Info } from 'lucide-react';

export default function Dashboard({ pendingApprovals, stats }) {
    return (
        <RtRwLayout header="Dasbor Peninjauan RT/RW">
            <Head title="Dashboard RT/RW" />

            <div className="mb-8">
                <div className="relative overflow-hidden rounded-2xl bg-blue-600 px-6 py-8 shadow-lg sm:px-12">
                    <div className="absolute inset-0 -mx-4 -my-4 bg-blue-700/50 backdrop-blur-xl blur-2xl z-0" aria-hidden="true" />
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Selamat datang, Pengurus Lingkungan</h2>
                        <p className="text-blue-100 text-sm max-w-2xl">
                            Sistem Informasi Desa memungkinkan Anda untuk memonitor warga dan menyetujui pengajuan surat sebelum diteruskan ke Balai Desa.
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                <div className="relative overflow-hidden rounded-xl bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 group hover:shadow-md transition-all border-l-4 border-amber-500">
                    <dt className="flex items-center gap-x-3">
                        <div className="p-2.5 bg-amber-100 rounded-lg text-amber-600 dark:text-amber-400 transition-colors">
                            <Clock size={20} />
                        </div>
                        <div className="text-xs font-bold leading-6 text-slate-500 dark:text-slate-400 uppercase tracking-wider">Perlu Persetujuan</div>
                    </dt>
                    <dd className="mt-4 flex items-baseline gap-x-2">
                        <span className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">{stats.menunggu_persetujuan}</span>
                        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Antrean</span>
                    </dd>
                </div>
                
                <div className="relative overflow-hidden rounded-xl bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 group hover:shadow-md transition-all border-l-4 border-blue-500">
                    <dt className="flex items-center gap-x-3">
                        <div className="p-2.5 bg-blue-100 rounded-lg text-blue-600 dark:text-blue-400 transition-colors">
                            <CheckCircle size={20} />
                        </div>
                        <div className="text-xs font-bold leading-6 text-slate-500 dark:text-slate-400 uppercase tracking-wider">Telah Disetujui</div>
                    </dt>
                    <dd className="mt-4 flex items-baseline gap-x-2">
                        <span className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">{stats.riwayat_disetujui}</span>
                        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Riwayat Surat</span>
                    </dd>
                </div>

                <div className="relative overflow-hidden rounded-xl bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 group hover:shadow-md transition-all border-l-4 border-emerald-500">
                    <dt className="flex items-center gap-x-3">
                        <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg text-emerald-600 dark:text-emerald-400 transition-colors">
                            <Users size={20} />
                        </div>
                        <div className="text-xs font-bold leading-6 text-slate-500 dark:text-slate-400 uppercase tracking-wider">Warga Diawasi</div>
                    </dt>
                    <dd className="mt-4 flex items-baseline gap-x-2">
                        <span className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">{stats.total_warga.toLocaleString('id-ID')}</span>
                        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Penduduk</span>
                    </dd>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Pending Approvals Table */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass bg-white dark:bg-slate-800 shadow-sm rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                        <div className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-6 py-5 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold leading-6 text-slate-900 dark:text-white flex items-center gap-2">
                                    <Clock className="text-amber-500" size={20} />
                                    Daftar Tunggu Persetujuan Pengantar
                                </h3>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Pengajuan surat ini berasal dari warga di lingkungan Anda.</p>
                            </div>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                                <thead className="bg-slate-50 dark:bg-slate-800/50/50 dark:bg-slate-800/50">
                                    <tr>
                                        <th scope="col" className="py-3.5 pl-6 pr-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Info Warga</th>
                                        <th scope="col" className="px-3 py-3.5 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Detail Surat</th>
                                        <th scope="col" className="relative py-3.5 pl-3 pr-6"><span className="sr-only">Aksi</span></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-700 bg-white dark:bg-slate-800">
                                    {pendingApprovals.length > 0 ? (
                                        pendingApprovals.map((letter) => (
                                            <tr key={letter.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                                <td className="whitespace-nowrap py-4 pl-6 pr-3">
                                                    <div className="flex items-center">
                                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-black mr-3 ring-2 ring-white dark:ring-slate-800">
                                                            {letter.resident?.nama_lengkap?.charAt(0) || '?'}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold text-slate-900 dark:text-white">{letter.resident?.nama_lengkap}</div>
                                                            <div className="text-xs text-slate-500 dark:text-slate-400">{letter.resident?.nik}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-3 py-4 text-sm text-slate-700 dark:text-slate-300">
                                                    <div className="font-bold text-slate-800 dark:text-slate-200">{letter.letter_type?.nama_surat}</div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">Kep: {letter.keperluan}</div>
                                                    <div className="text-[10px] text-slate-400 dark:text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider font-semibold">Tgl: {new Date(letter.updated_at).toLocaleDateString('id-ID')}</div>
                                                </td>
                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium">
                                                    <Link
                                                        href={route('rtrw.approval.show', letter.id)}
                                                        className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
                                                    >
                                                        Review & Setujui
                                                        <ChevronRight size={14} className="ml-1 -mr-1" />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="3" className="px-6 py-16 text-center">
                                                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/30 mb-4">
                                                    <CheckCircle className="h-8 w-8 text-blue-500" aria-hidden="true" />
                                                </div>
                                                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">Tidak Ada Antrean</h3>
                                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Semua permohonan warga telah selesai Anda proses.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Area Reminders & Fast actions */}
                <div className="space-y-6">
                    <div className="rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/20 p-6 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Info size={64} />
                        </div>
                        <h3 className="text-base font-bold text-blue-900 dark:text-blue-300 mb-2">Tugas RT/RW</h3>
                        <div className="mt-2 text-sm text-blue-800 dark:text-blue-200 space-y-3 relative z-10">
                            <p>Sebagai pengurus lingkungan, Anda berperan menyaring pengajuan surat warga untuk memastikan bahwa pemohon memang warga Anda dan tujuannya benar.</p>
                            <p>Setelah Anda Setujui, sistem akan otomatis meneruskan antreannya ke meja pelayanan Balai Desa.</p>
                        </div>
                    </div>

                    <div className="glass bg-white dark:bg-slate-800 p-6 shadow-sm rounded-xl border border-slate-200 dark:border-slate-700">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            Aksi Cepat
                        </h3>
                        <div className="space-y-3">
                            <Link href={route('rtrw.bypass.create')} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 group transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 p-2 rounded-lg group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                        <FileSignature size={18} />
                                    </div>
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">Buat Surat (Bypass)</span>
                                </div>
                                <ChevronRight size={16} className="text-slate-400 dark:text-slate-500 dark:text-slate-400 group-hover:text-emerald-600 dark:text-emerald-400" />
                            </Link>

                            <Link href={route('rtrw.residents')} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 group transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 p-2 rounded-lg group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                        <Users size={18} />
                                    </div>
                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-blue-700 dark:group-hover:text-blue-400">Daftar Warga</span>
                                </div>
                                <ChevronRight size={16} className="text-slate-400 dark:text-slate-500 dark:text-slate-400 group-hover:text-blue-600 dark:text-blue-400" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </RtRwLayout>
    );
}
