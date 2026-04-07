import React from 'react';
import { Head, Link } from '@inertiajs/react';
import WargaLayout from '@/Layouts/WargaLayout';
import { ArrowLeft, Clock, Check, FileCheck, CodeSquare, AlertCircle } from 'lucide-react';

export default function Track({ letter }) {
    
    // Defines the steps for the letter process
    const steps = [
        { id: 'menunggu_review_admin', label: 'Diproses Staf' },
        { id: 'menunggu_ttd_kades', label: 'Menunggu Pengesahan Kades' },
        { id: 'selesai', label: 'Selesai & Siap Unduh' }
    ];

    let currentStepIndex = 0;
    if (letter.status === 'selesai' || letter.status === 'ditolak') {
        currentStepIndex = 3; 
    } else if (letter.status === 'menunggu_ttd_kades') {
        currentStepIndex = 1;
    }

    const isRejected = letter.status === 'ditolak';

    return (
        <WargaLayout header="Lacak Pengajuan Surat">
            <Head title="Lacak Surat" />

            <div className="mb-6 flex justify-between items-center">
                <Link 
                    href={route('warga.dashboard')} 
                    className="inline-flex items-center text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:text-emerald-400 transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke Dashboard
                </Link>
            </div>

            <div className="mx-auto max-w-4xl space-y-6">
                
                {/* Status Box */}
                <div className="glass bg-white dark:bg-slate-800 p-8 shadow-sm rounded-2xl border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row items-center gap-8 text-center md:text-left relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500"></div>
                    <div className="flex-1">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-1">Status Pengajuan</h2>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">{letter.letter_type?.nama_surat}</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto md:mx-0">Keperluan: <strong>{letter.keperluan}</strong></p>
                        
                        {isRejected && (
                             <div className="mt-4 inline-flex items-center gap-2 bg-red-100 text-red-800 px-4 py-2 rounded-lg font-bold border border-red-200">
                                <AlertCircle size={20} />
                                Pengajuan Ditolak
                             </div>
                        )}
                        {!isRejected && letter.status === 'selesai' && (
                             <div className="mt-4 inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 px-4 py-2 rounded-lg font-bold border border-emerald-200">
                                <FileCheck size={20} />
                                Pengajuan Selesai
                             </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Log Timeline */}
                    <div className="glass bg-white dark:bg-slate-800 p-8 shadow-sm rounded-2xl border border-slate-100 dark:border-slate-700">
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 border-b border-slate-100 dark:border-slate-700 pb-4">
                            <Clock className="text-emerald-500" size={20} />
                            Riwayat Proses
                        </h4>
                        
                        <div className="flow-root">
                            <ul role="list" className="-mb-8">
                                {letter.logs && letter.logs.map((log, logIdx) => (
                                    <li key={log.id}>
                                        <div className="relative pb-8">
                                            {logIdx !== letter.logs.length - 1 ? (
                                                <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-slate-200" aria-hidden="true" />
                                            ) : null}
                                            <div className="relative flex space-x-3">
                                                <div>
                                                    <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-4 ring-white ${
                                                        log.status_to === 'menunggu_ttd_kades' ? 'bg-amber-500' :
                                                        log.status_to === 'selesai' ? 'bg-emerald-500' :
                                                        log.status_to === 'ditolak' ? 'bg-red-500' :
                                                        'bg-blue-500'
                                                    }`}>
                                                        {log.status_to === 'ditolak' ? <AlertCircle className="h-4 w-4 text-white" /> : <Check className="h-4 w-4 text-white" aria-hidden="true" />}
                                                    </span>
                                                </div>
                                                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                                    <div>
                                                        <p className="text-sm text-slate-900 dark:text-white font-bold border-b border-slate-100 dark:border-slate-700 pb-1 mb-1 inline-block uppercase tracking-wide">
                                                            {log.status_to?.replace(/_/g, ' ').toUpperCase() || 'STATUS'}
                                                        </p>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700 italic">
                                                            "{log.notes}"
                                                        </p>
                                                    </div>
                                                    <div className="whitespace-nowrap text-right text-xs text-slate-500 dark:text-slate-400">
                                                        <time dateTime={log.created_at}>{new Date(log.created_at).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit'})}</time>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Completion Action */}
                    <div className="space-y-6">
                        <div className="glass bg-slate-50 dark:bg-slate-800/50 p-8 shadow-inner rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
                            {letter.status === 'selesai' ? (
                                <div>
                                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Dokumen Siap Unduh</h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">Surat Anda telah ditandatangani dan diberi kode QR validasi otomatis. Anda bisa mengunduhnya sebagai PDF.</p>
                                    <button 
                                        onClick={() => {
                                            window.open(route('warga.letters.download', letter.id), '_blank');
                                        }}
                                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl shadow transition-colors flex items-center justify-center gap-2"
                                    >
                                        <CodeSquare size={20} />
                                        Unduh Dokumen PDF
                                    </button>
                                </div>
                            ) : isRejected ? (
                                <div>
                                    <div className="mx-auto w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4">
                                        <AlertCircle size={32} />
                                    </div>
                                    <h4 className="text-lg font-bold text-red-900 mb-2">Surat Ditolak</h4>
                                    <p className="text-sm text-red-700">Silakan periksa catatan penolakan pada riwayat proses, perbaiki data Anda, dan ajukan kembali surat.</p>
                                    <Link href={route('warga.letters.create')} className="mt-6 inline-block w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl shadow transition-colors">
                                        Buat Pengajuan Baru
                                    </Link>
                                </div>
                            ) : (
                                <div>
                                    <div className="mx-auto w-16 h-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mb-4 animate-pulse">
                                        <Clock size={32} />
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Dokumen Sedang Diproses</h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Dokumen Anda sedang dalam antrean pemrosesan oleh Staf Desa atau sedang menunggu pengesahan Kepala Desa. Silakan pantau halaman ini secara berkala.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </WargaLayout>
    );
}
