import React from 'react';
import { Head, Link } from '@inertiajs/react';
import RtLayout from '@/Layouts/RtLayout';
import { ArrowLeft, Users, User, Edit2, MapPin } from 'lucide-react';

export default function Show({ familyCard }) {
    return (
        <RtLayout header="Detail Kartu Keluarga">
            <Head title={`KK ${familyCard.no_kk}`} />

            <div className="mb-6 flex items-center justify-between">
                <Link 
                    href={route('rt.family-cards.index')} 
                    className="flex items-center text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:text-emerald-400 transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali
                </Link>
                
                <Link
                    href={route('rt.family-cards.edit', familyCard.id)}
                    className="rounded-md bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center gap-2"
                >
                    <Edit2 size={16} /> Edit Data
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Informasi KK Card */}
                <div className="glass bg-white dark:bg-slate-800 p-6 shadow-sm rounded-xl lg:col-span-1">
                    <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-700 pb-4 mb-4">
                        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-lg">
                            <Users size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white font-mono">{familyCard.no_kk}</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Nomor Kartu Keluarga</p>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Kepala Keluarga</p>
                            <p className="font-medium text-slate-900 dark:text-white">{familyCard.kepala_keluarga?.nama_lengkap || 'Tidak Diketahui'}</p>
                            <p className="text-sm font-mono text-slate-500 dark:text-slate-400">{familyCard.kepala_keluarga?.nik}</p>
                        </div>
                        
                        <div>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Alamat</p>
                            <p className="text-sm text-slate-800 dark:text-slate-200 break-words">{familyCard.alamat}</p>
                            <div className="flex items-center gap-1 mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                                <MapPin size={12} className="text-slate-400" />
                                {familyCard.wilayah ? `RT ${familyCard.wilayah.rt} / RW ${familyCard.wilayah.rw}` : '-'}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Kode Pos</p>
                                <p className="text-sm text-slate-900 dark:text-white">{familyCard.kode_pos || '-'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Status KK</p>
                                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                                    familyCard.status === 'aktif' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 ring-emerald-600/20' : 
                                    'bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 ring-slate-600/20'
                                }`}>
                                    {familyCard.status.replace('_', ' ').toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Anggota Keluarga Table */}
                <div className="glass bg-white dark:bg-slate-800 shadow-sm rounded-xl lg:col-span-2 flex flex-col">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Daftar Anggota Keluarga</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Status hubungan dan informasi dasar dari setiap anggota dalam KK ini.</p>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto flex-1">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                            <thead className="bg-slate-50 dark:bg-slate-800/50">
                                <tr>
                                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 sm:pl-6">
                                        No
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        Nama Lengkap / NIK
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        SHDK
                                    </th>
                                    <th scope="col" className="px-3 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        Pendidikan
                                    </th>
                                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                        <span className="sr-only">Aksi</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-800">
                                {familyCard.anggota_keluarga && familyCard.anggota_keluarga.length > 0 ? (
                                    familyCard.anggota_keluarga.map((anggota, index) => (
                                        <tr key={anggota.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-slate-500 dark:text-slate-400 sm:pl-6">
                                                {index + 1}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4">
                                                <div className="text-sm font-medium text-slate-900 dark:text-white">{anggota.nama_lengkap}</div>
                                                <div className="text-sm font-mono text-slate-500 dark:text-slate-400">{anggota.nik}</div>
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-900 dark:text-white capitalize font-medium">
                                                {anggota.hubungan_keluarga.replace('_', ' ')}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400 uppercase">
                                                {anggota.pendidikan.replace('_', ' ')}
                                            </td>
                                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                                <Link 
                                                    href={route('rt.residents.edit', anggota.id)} 
                                                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 flex items-center gap-1 justify-end"
                                                >
                                                    <User size={14} /> Lihat
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 text-sm">
                                            Belum ada anggota keluarga yang terdaftar dalam KK ini. <br/>
                                            <Link href={route('rt.residents.create')} className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline mt-2 inline-block">
                                                Tambah Warga Baru
                                            </Link>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </RtLayout>
    );
}
