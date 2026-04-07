import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { CheckCircle, XCircle, FileText, Calendar, User, ShieldCheck } from 'lucide-react';

export default function QrVerify({ isValid, message, document }) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-800/50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
            <Head title="Verifikasi Dokumen SID" />

            <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-700">
                <div className="bg-slate-900 px-6 py-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <ShieldCheck size={120} />
                    </div>
                    <img className="mx-auto h-12 w-auto mb-4 relative z-10" src="https://tailwindui.com/img/logos/mark.svg?color=emerald&shade=500" alt="SID Logo" />
                    <h2 className="text-xl font-bold text-white relative z-10">Verifikasi Dokumen Desa</h2>
                    <p className="text-slate-400 text-sm mt-2 relative z-10">Sistem Informasi Kependudukan Desa</p>
                </div>

                <div className="px-6 py-8">
                    {isValid ? (
                        <div className="text-center">
                            <div className="mx-auto w-20 h-20 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                                <CheckCircle size={48} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Dokumen Valid</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Dokumen ini diterbitkan secara sah oleh Pemerintah Desa dan telah ditandatangani secara elektronik (TTE).</p>
                            
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 text-left space-y-4 border border-slate-100 dark:border-slate-700">
                                <div>
                                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1"><FileText size={14} /> Jenis Surat</span>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{document.jenis_surat}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 block">Nomor Surat</span>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{document.nomor_surat || '-'}</p>
                                    </div>
                                    <div>
                                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 block">Pemohon</span>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">{document.nama_pemohon}</p>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1"><Calendar size={14} /> Disahkan Pada</span>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                                        {new Date(document.tanggal_disahkan).toLocaleDateString('id-ID', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })} WIB
                                    </p>
                                </div>
                                <div>
                                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1"><User size={14} /> Oleh</span>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{document.disahkan_oleh}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center">
                            <div className="mx-auto w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-6">
                                <XCircle size={48} />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Dokumen Tidak Valid</h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-6">{message}</p>
                            <div className="bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-500 p-4 text-left">
                                <p className="text-sm text-amber-700">Peringatan: Dokumen yang tidak dikenali sistem kemungkinan adalah palsu atau belum disahkan sepenuhnya. Harap berhati-hati menerima dokumen ini.</p>
                            </div>
                        </div>
                    )}
                </div>
                
                <div className="bg-slate-100 dark:bg-slate-700 px-6 py-4 text-center border-t border-slate-200 dark:border-slate-700">
                    <Link href="/" className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500">
                        Kembali ke Beranda SID
                    </Link>
                </div>
            </div>
            <div className="mt-8 text-center text-xs text-slate-400">
                &copy; {new Date().getFullYear()} Sistem Informasi Kependudukan Desa
            </div>
        </div>
    );
}
