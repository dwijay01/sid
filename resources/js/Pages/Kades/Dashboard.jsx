import React from 'react';
import { Head, Link } from '@inertiajs/react';
import KadesLayout from '@/Layouts/KadesLayout';
import { FileSignature, Users, CheckCircle, Clock, AlertTriangle, FileText } from 'lucide-react';

export default function Dashboard({ stats, pendingLetters }) {
    return (
        <KadesLayout header="Dashboard & TTE Kades">
            <Head title="Dashboard Kepala Desa" />

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Selamat datang, Kepala Desa</h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Berikut adalah ringkasan permohonan surat yang memerlukan Tanda Tangan Elektronik (TTE) Anda.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                <div className="relative overflow-hidden rounded-xl bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 group hover:shadow-md transition-all border-l-4 border-amber-500">
                    <dt className="flex items-center gap-x-3">
                        <div className="p-3 bg-amber-100 rounded-lg text-amber-600 dark:text-amber-400 transition-colors">
                            <FileSignature size={24} />
                        </div>
                        <div className="text-sm font-semibold leading-6 text-slate-600 dark:text-slate-400 uppercase tracking-wide">Perlu TTE</div>
                    </dt>
                    <dd className="mt-4 flex items-baseline gap-x-2">
                        <span className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">{stats.total_pending_signature}</span>
                        <span className="text-sm text-slate-500 dark:text-slate-400">surat</span>
                    </dd>
                </div>
                
                <div className="relative overflow-hidden rounded-xl bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 group hover:shadow-md transition-all border-l-4 border-emerald-500">
                    <dt className="flex items-center gap-x-3">
                        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg text-emerald-600 dark:text-emerald-400 transition-colors">
                            <CheckCircle size={24} />
                        </div>
                        <div className="text-sm font-semibold leading-6 text-slate-600 dark:text-slate-400 uppercase tracking-wide">Total Disetujui</div>
                    </dt>
                    <dd className="mt-4 flex items-baseline gap-x-2">
                        <span className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">{stats.total_letters_approved}</span>
                        <span className="text-sm text-slate-500 dark:text-slate-400">surat selesai</span>
                    </dd>
                </div>

                <div className="relative overflow-hidden rounded-xl bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 group hover:shadow-md transition-all border-l-4 border-blue-500">
                    <dt className="flex items-center gap-x-3">
                        <div className="p-3 bg-blue-100 rounded-lg text-blue-600 dark:text-blue-400 transition-colors">
                            <Users size={24} />
                        </div>
                        <div className="text-sm font-semibold leading-6 text-slate-600 dark:text-slate-400 uppercase tracking-wide">Populasi Penduduk</div>
                    </dt>
                    <dd className="mt-4 flex items-baseline gap-x-2">
                        <span className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">{stats.total_residents.toLocaleString('id-ID')}</span>
                        <span className="text-sm text-slate-500 dark:text-slate-400">jiwa</span>
                    </dd>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Pending Letters Table */}
                <div className="lg:col-span-2 glass bg-white dark:bg-slate-800 shadow-sm rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                    <div className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-6 py-5 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold leading-6 text-slate-900 dark:text-white flex items-center gap-2">
                                <Clock className="text-amber-500" size={20} />
                                Daftar Tunggu TTE Pengesahan
                            </h3>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Silakan tinjau dan bubuhkan TTE (Tanda Tangan Elektronik) untuk mensahkan dokumen.</p>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                            <thead className="bg-slate-50 dark:bg-slate-800/50/50 dark:bg-slate-800/50">
                                <tr>
                                    <th scope="col" className="py-3.5 pl-6 pr-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pemohon</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Jenis Surat</th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Waktu Masuk</th>
                                    <th scope="col" className="relative py-3.5 pl-3 pr-6"><span className="sr-only">Aksi</span></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-800">
                                {pendingLetters.length > 0 ? (
                                    pendingLetters.map((letter) => (
                                        <tr key={letter.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                            <td className="whitespace-nowrap py-4 pl-6 pr-3">
                                                <div className="flex items-center">
                                                    <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-bold mr-3 ring-2 ring-white dark:ring-slate-800">
                                                        {letter.resident?.nama_lengkap?.charAt(0) || '?'}
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-semibold text-slate-900 dark:text-white">{letter.resident?.nama_lengkap}</div>
                                                        <div className="text-xs font-mono text-slate-500 dark:text-slate-400">{letter.resident?.nik}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-3 py-4 text-sm text-slate-700 dark:text-slate-300 max-w-[200px] truncate">
                                                <div className="font-semibold text-slate-800 dark:text-slate-200">{letter.letter_type?.nama_surat}</div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400 truncate" title={letter.keperluan}>{letter.keperluan}</div>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">
                                                {new Date(letter.updated_at).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium">
                                                <Link
                                                    href={route('kades.letters.show', letter.id)}
                                                    className="inline-flex items-center rounded-md bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                                                >
                                                    <FileSignature size={14} className="mr-1.5" />
                                                    Tinjau Berkas
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-12 text-center">
                                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-3">
                                                <CheckCircle className="h-6 w-6 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                                            </div>
                                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Bagus! Semua TTE Selesai.</h3>
                                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Tidak ada pengajuan surat yang menunggu tanda tangan Anda saat ini.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {pendingLetters.length > 0 && (
                        <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-3 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                            <Link href="#" className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-500">Lihat Semua Antrean →</Link>
                        </div>
                    )}
                </div>

                {/* Right Area Reminders */}
                <div className="space-y-6">
                    <div className="rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/20 p-6 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <AlertTriangle size={64} />
                        </div>
                        <h3 className="text-base font-bold text-amber-800 dark:text-amber-400 mb-2">Info Pengesahan (TTE)</h3>
                        <div className="mt-2 text-sm text-amber-700 dark:text-amber-300 space-y-2">
                            <p>Tanda tangan elektronik akan disematkan menggunakan profil identitas sertifikat TTE Anda.</p>
                            <p>Setiap dokumen yang ditandatangani akan memiliki <strong>QR Code Unik</strong> yang valid di sistem. Harap pastikan kebenaran data pemohon sebelum melakukan Pengesahan.</p>
                        </div>
                    </div>
                </div>
            </div>
        </KadesLayout>
    );
}
