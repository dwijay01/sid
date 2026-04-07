import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, Check, X, FileText, Clock, User, Download, FileSignature } from 'lucide-react';

export default function Show({ letter }) {
    const { data, setData, post, processing, errors } = useForm({
        action: '',
        catatan: ''
    });

    const [showProcessForm, setShowProcessForm] = useState(false);

    const handleProcess = (actionType) => {
        setData('action', actionType);
        setShowProcessForm(true);
    };

    const submitProcessForm = (e) => {
        e.preventDefault();
        post(route('admin.letters.process', letter.id), {
            onSuccess: () => setShowProcessForm(false)
        });
    };

    const getStatusStyle = (status) => {
        const s = status?.toLowerCase();
        switch (s) {
            case 'menunggu_review_admin': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'menunggu_ttd_kades': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'selesai': return 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 border-emerald-200';
            case 'ditolak': return 'bg-red-100 text-red-800 border-red-200';
            default: return 'bg-orange-100 text-orange-800 border-orange-200';
        }
    };

    const isPendingAdmin = letter.status === 'menunggu_review_admin';
    const isSignedOrFinished = ['menunggu_ttd_kades', 'selesai'].includes(letter.status);

    return (
        <AdminLayout header="Tinjau Permohonan Surat">
            <Head title={`Permohonan - ${letter.resident?.nama_lengkap}`} />

            <div className="mb-6 flex items-center justify-between">
                <Link 
                    href={route('admin.letters.queue')} 
                    className="flex items-center text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:text-emerald-400 transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke Antrean
                </Link>

                {isSignedOrFinished && (
                    <button
                        onClick={() => {
                            window.open(route('admin.letters.print', letter.id), '_blank');
                        }}
                        className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg hover:bg-emerald-500 transition-all flex items-center gap-2 border border-emerald-700"
                    >
                        <Download size={18} /> Cetak Surat (PDF)
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Detail Information */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass bg-white dark:bg-slate-800 p-6 shadow-sm rounded-xl">
                        <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-700 pb-4 mb-4">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <FileText className="text-emerald-600 dark:text-emerald-400" size={24} />
                                    {letter.letter_type?.nama_surat}
                                </h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-mono">{letter.nomor_surat || 'Nomor Surat Belum Diterbitkan'}</p>
                            </div>
                            <span className={`px-3 py-1.5 rounded-md text-xs font-bold border ${getStatusStyle(letter.status)}`}>
                                {letter.status_label || letter.status?.replace(/_/g, ' ').toUpperCase() || 'UNKNOWN'}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Pemohon / NIK</h3>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900 dark:text-white">{letter.resident?.nama_lengkap}</p>
                                        <p className="text-sm font-mono text-slate-500 dark:text-slate-400">{letter.resident?.nik}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Keperluan</h3>
                                <p className="text-sm text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700 min-h-[4rem]">
                                    {letter.keperluan}
                                </p>
                            </div>

                            <div className="md:col-span-2 border-t border-slate-100 dark:border-slate-700 pt-4 mt-2">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Informasi Tambahan (Keperluan Opsional)</h3>
                                {letter.keterangan_tambahan ? (
                                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-100 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                                        {letter.keterangan_tambahan}
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-400 italic">Tidak ada catatan tambahan.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Timeline Tracker */}
                    <div className="glass bg-white dark:bg-slate-800 p-6 shadow-sm rounded-xl">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <Clock size={20} className="text-emerald-600 dark:text-emerald-400" />
                            Riwayat Status (Tracking logs)
                        </h3>
                        
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
                                                    <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                                                        log.status_to === 'menunggu_ttd_kades' ? 'bg-amber-500' :
                                                        log.status_to === 'selesai' ? 'bg-emerald-500' :
                                                        log.status_to === 'ditolak' ? 'bg-red-500' :
                                                        'bg-blue-500'
                                                    }`}>
                                                        <Check className="h-4 w-4 text-white" aria-hidden="true" />
                                                    </span>
                                                </div>
                                                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                                    <div>
                                                        <p className="text-sm text-slate-900 dark:text-white font-semibold border-b border-slate-100 dark:border-slate-700 pb-1 mb-1 inline-block">
                                                            {log.status_to?.replace(/_/g, ' ').toUpperCase() || 'STATUS'}
                                                        </p>
                                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                                            {log.notes}
                                                        </p>
                                                    </div>
                                                    <div className="whitespace-nowrap text-right text-sm text-slate-500 dark:text-slate-400">
                                                        <time dateTime={log.created_at}>{new Date(log.created_at).toLocaleDateString('id-ID', { hour:'2-digit', minute:'2-digit' })}</time>
                                                        <p className="text-xs font-medium text-slate-900 dark:text-white mt-1">{log.actor?.name || 'Sistem'}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Right Column: Actions */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Action Block */}
                    {isPendingAdmin && (
                        <div className="glass bg-white dark:bg-slate-800 p-6 shadow-sm rounded-xl border border-emerald-100">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">Aksi Verifikasi</h3>
                            
                            {!showProcessForm ? (
                                <div className="space-y-3">
                                    <button
                                        onClick={() => handleProcess('approve')}
                                        className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white rounded-lg px-4 py-2.5 font-bold hover:bg-emerald-500 transition-colors shadow-sm"
                                    >
                                        <Check size={18} /> Verifikasi & Teruskan ke Kades
                                    </button>
                                    
                                    <button
                                        onClick={() => handleProcess('complete')}
                                        className="w-full flex items-center justify-center gap-2 bg-slate-800 text-white rounded-lg px-4 py-2.5 font-bold hover:bg-slate-700 transition-colors shadow-sm"
                                    >
                                        <FileSignature size={18} /> Langsung Selesai (TTD Cap)
                                    </button>
                                    
                                    <button
                                        onClick={() => handleProcess('reject')}
                                        className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-red-200 text-red-600 dark:text-red-400 rounded-lg px-4 py-2.5 font-bold hover:bg-red-50 dark:bg-red-900/30 transition-colors"
                                    >
                                        <X size={18} /> Tolak Permohonan
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={submitProcessForm} className="animate-fade-in">
                                    <div className="mb-4">
                                        <label htmlFor="catatan" className="block text-sm font-medium leading-6 text-slate-900 dark:text-white">
                                            Berikan Catatan Pengajuan <span className={data.action === 'reject' ? 'text-red-500' : ''}>{data.action === 'reject' ? '(Wajib)' : '(Opsional)'}</span>
                                        </label>
                                        <textarea
                                            id="catatan"
                                            rows={4}
                                            value={data.catatan}
                                            onChange={e => setData('catatan', e.target.value)}
                                            placeholder={data.action === 'reject' ? "Alasan penolakan..." : "Catatan verifikasi..."}
                                            required={data.action === 'reject'}
                                            className="mt-2 block w-full rounded-md border-0 py-2 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-emerald-600 sm:text-sm sm:leading-6 bg-slate-50 dark:bg-slate-800/50"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setShowProcessForm(false)}
                                            className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-3 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700/50"
                                        >
                                            Batal
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className={`flex-1 px-3 py-2 rounded-lg text-sm font-bold shadow-sm text-white ${
                                                data.action === 'reject' ? 'bg-red-600 hover:bg-red-500' : 'bg-emerald-600 hover:bg-emerald-500'
                                            }`}
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    )}
                    
                    {!isPendingAdmin && (
                        <div className="glass bg-slate-50 dark:bg-slate-800/50 p-6 shadow-sm rounded-xl border border-slate-200 dark:border-slate-700">
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Informasi Status</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Surat ini {letter.status === 'ditolak' ? 'telah ditolak' : 'sudah diproses'} dan tidak dapat diverifikasi ulang.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
