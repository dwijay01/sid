import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, User, Edit2, CreditCard, Droplets, MapPin, Briefcase, FileText } from 'lucide-react';

export default function Show({ resident }) {
    return (
        <AdminLayout header="Detail Penduduk">
            <Head title={`Detail - ${resident.nama_lengkap}`} />

            <div className="mb-6 flex items-center justify-between">
                <Link 
                    href={route('admin.residents.index')} 
                    className="flex items-center text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:text-emerald-400 transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali
                </Link>
                
                <Link
                    href={route('admin.residents.edit', resident.id)}
                    className="rounded-md bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center gap-2"
                >
                    <Edit2 size={16} /> Edit Profil
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Kolom Kiri: Profil Utama */}
                <div className="glass bg-white dark:bg-slate-800 p-6 shadow-sm rounded-xl lg:col-span-1 space-y-6">
                    <div className="text-center pb-6 border-b border-slate-100 dark:border-slate-700">
                        <div className="mx-auto h-24 w-24 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-700 font-bold text-3xl mb-4 border-4 border-white shadow-sm delay-100 animate-slide-up">
                            {resident.nama_lengkap.charAt(0)}
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{resident.nama_lengkap}</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-mono tracking-wider">{resident.nik}</p>
                        
                        <div className="mt-3">
                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                                resident.status_penduduk === 'aktif' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 ring-emerald-600/20' : 
                                'bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 ring-slate-600/20'
                            }`}>
                                Status: {resident.status_penduduk.replace('_', ' ').toUpperCase()}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <User className="text-slate-400" size={18} />
                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase">Jenis Kelamin</p>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">{resident.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <MapPin className="text-slate-400" size={18} />
                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase">Tempat, Tgl Lahir</p>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">{resident.tempat_lahir}, {resident.tanggal_lahir}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Droplets className="text-slate-400" size={18} />
                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase">Gol. Darah & Agama</p>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">{resident.golongan_darah.replace('_', ' ').toUpperCase()} — {resident.agama}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Briefcase className="text-slate-400" size={18} />
                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 uppercase">Pekerjaan</p>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">{resident.pekerjaan || 'Belum/Tidak Bekerja'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Kolom Kanan: Detail & KK */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass bg-white dark:bg-slate-800 p-6 shadow-sm rounded-xl">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-2">
                            <CreditCard size={20} className="text-emerald-600 dark:text-emerald-400" />
                            Informasi Keluarga
                        </h3>
                        
                        {resident.family_card ? (
                            <div className="grid grid-cols-2 gap-y-4 gap-x-6 pt-2">
                                <div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase mb-1">Nomor Kartu Keluarga (KK)</p>
                                    <Link href={route('admin.family-cards.show', resident.family_card.id)} className="text-emerald-600 dark:text-emerald-400 font-mono tracking-wider font-semibold hover:underline">
                                        {resident.family_card.no_kk}
                                    </Link>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase mb-1">Hubungan dalam Keluarga</p>
                                    <p className="text-sm font-medium text-slate-900 dark:text-white capitalize">{resident.hubungan_keluarga.replace('_', ' ')}</p>
                                </div>
                                <div className="col-span-2">
                                    <p className="text-xs text-slate-500 dark:text-slate-400 uppercase mb-1">Alamat Keluarga / Wilayah</p>
                                    <p className="text-sm text-slate-900 dark:text-white">
                                        {resident.family_card.alamat}<br/>
                                        <span className="text-slate-600 dark:text-slate-400 font-medium">
                                            RT {resident.family_card.wilayah?.rt || '-'} / RW {resident.family_card.wilayah?.rw || '-'}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-6 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 rounded-lg border border-amber-100">
                                <p className="text-sm font-medium">Warga ini belum tergabung ke dalam Kartu Keluarga manapun.</p>
                            </div>
                        )}
                    </div>

                    {/* Placeholder untuk Riwayat Dokumen */}
                    <div className="glass bg-white dark:bg-slate-800 p-6 shadow-sm rounded-xl">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-2">
                            <FileText size={20} className="text-emerald-600 dark:text-emerald-400" />
                            Riwayat Persuratan & Dokumen
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
                            Belum ada riwayat dokumen yang diajukan untuk warga ini.
                        </p>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
