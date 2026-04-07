import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import RtRwLayout from '@/Layouts/RtRwLayout';
import { ArrowLeft, Check, X, FileText, User, PenTool, AlertTriangle } from 'lucide-react';

export default function ApprovalDetail({ letter }) {
    const { data, setData, post, processing, errors } = useForm({
        action: '',
        catatan: ''
    });

    const [showProcessForm, setShowProcessForm] = useState(false);

    const handleProcess = (actionType) => {
        setData('action', actionType);
        
        if (actionType === 'approve') {
            setData('catatan', 'Disetujui di tingkat RT/RW dan diteruskan ke Balai Desa.');
        } else {
            setData('catatan', '');
        }
        
        setShowProcessForm(true);
    };

    const submitProcessForm = (e) => {
        e.preventDefault();
        
        let routeName = data.action === 'approve' ? 'rtrw.approval.approve' : 'rtrw.approval.reject';
        post(route(routeName, letter.id), {
            onSuccess: () => setShowProcessForm(false)
        });
    };

    const isPendingApproval = letter.status === 'diajukan';

    return (
        <RtRwLayout header="Review Pengajuan Warga">
            <Head title={`Review - ${letter.resident?.nama_lengkap}`} />

            <div className="mb-6">
                <Link 
                    href={route('rtrw.dashboard')} 
                    className="inline-flex items-center text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:text-blue-400 transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke Dashboard
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Review Data (Left/Center) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-sm">
                        <div className="border-b-2 border-slate-200 dark:border-slate-700 pb-6 mb-6 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold uppercase text-slate-900 dark:text-white">{letter.letter_type?.nama_surat}</h2>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Dibuat pada: {new Date(letter.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}</p>
                            </div>
                            <div className="bg-amber-100 text-amber-700 px-3 py-1 rounded-md text-sm font-bold uppercase tracking-wider">
                                {letter.status?.replace(/_/g, ' ') || 'UNKNOWN'}
                            </div>
                        </div>

                        <div className="space-y-6 text-slate-800 dark:text-slate-200 text-sm">
                            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-100 rounded-xl p-5">
                                <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2"><User size={16} /> Data Pemohon (Warga)</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold mb-1">Nama Lengkap</p>
                                        <p className="font-bold">{letter.resident?.nama_lengkap}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold mb-1">NIK/No KK</p>
                                        <p className="font-bold">{letter.resident?.nik} / {letter.resident?.familyCard?.no_kk || '-'}</p>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <p className="text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold mb-1">Alamat Tinggal</p>
                                        <p className="font-bold">{letter.resident?.alamat_sekarang || letter.resident?.familyCard?.alamat || '-'}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-5">
                                <h3 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2"><FileText size={16} /> Rincian Permohonan</h3>
                                <div className="mb-4">
                                    <p className="text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold mb-1">Keperluan Pengajuan</p>
                                    <p className="text-base font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-lg text-slate-800 dark:text-slate-200">"{letter.keperluan}"</p>
                                </div>
                                {letter.keterangan_tambahan && (
                                    <div>
                                        <p className="text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold mb-1">Keterangan Opsional</p>
                                        <p className="font-medium text-slate-700 dark:text-slate-300">{letter.keterangan_tambahan}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Area: Action */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="glass bg-white dark:bg-slate-800 p-6 shadow-sm rounded-xl border-t-4 border-blue-500">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
                            <div className="p-2 bg-blue-100 text-blue-600 dark:text-blue-400 rounded-lg"><PenTool size={20} /></div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Keputusan RT/RW</h3>
                        </div>
                        
                        {!isPendingApproval ? (
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
                                <Check className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Status saat ini:</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 uppercase font-bold">{letter.status?.replace(/_/g, ' ') || 'UNKNOWN'}</p>
                            </div>
                        ) : !showProcessForm ? (
                            <div className="space-y-4 border-t border-slate-100 dark:border-slate-700 pt-2">
                                <button
                                    onClick={() => handleProcess('approve')}
                                    className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white rounded-xl px-5 py-3.5 font-bold hover:bg-blue-500 transition-colors shadow hover:shadow-md"
                                >
                                    <Check size={20} /> Setujui & Teruskan
                                </button>
                                
                                <button
                                    onClick={() => handleProcess('reject')}
                                    className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-red-200 text-red-600 dark:text-red-400 rounded-xl px-5 py-3 font-bold hover:bg-red-50 dark:bg-red-900/30 transition-colors"
                                >
                                    <X size={18} /> Tolak Permohonan
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={submitProcessForm} className="animate-fade-in space-y-4">
                                <div className={`p-4 rounded-lg border ${data.action === 'approve' ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200' : 'bg-red-50 dark:bg-red-900/30 border-red-200'}`}>
                                    <h4 className={`text-sm font-bold flex items-center gap-2 mb-2 ${data.action === 'approve' ? 'text-blue-800' : 'text-red-800'}`}>
                                        {data.action === 'approve' ? <><Check size={16} /> Konfirmasi Persetujuan</> : <><X size={16} /> Konfirmasi Penolakan</>}
                                    </h4>
                                    
                                    <label htmlFor="catatan" className="block text-sm font-medium leading-6 text-slate-900 dark:text-white mt-3">
                                        Catatan / Keterangan
                                    </label>
                                    <textarea
                                        id="catatan"
                                        rows={3}
                                        value={data.catatan}
                                        onChange={e => setData('catatan', e.target.value)}
                                        required={data.action === 'reject'}
                                        placeholder={data.action === 'reject' ? "Alasan mengapa pengajuan ini ditolak..." : "Catatan persetujuan (opsional)..."}
                                        className="mt-1 block w-full rounded-md border-0 py-2 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-blue-600 sm:text-sm sm:leading-6 bg-white dark:bg-slate-800"
                                    />
                                    {errors.catatan && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.catatan}</p>}
                                </div>
                                
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowProcessForm(false)}
                                        className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-4 py-2.5 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-bold shadow-sm text-white transition-colors flex items-center justify-center gap-2 ${
                                            data.action === 'approve' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-red-600 hover:bg-red-500'
                                        }`}
                                    >
                                        {processing ? 'Memproses...' : 'Kirim'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </RtRwLayout>
    );
}
