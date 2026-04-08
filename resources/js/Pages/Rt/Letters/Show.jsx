import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import RtLayout from '@/Layouts/RtLayout';
import { FileText, CheckCircle, XCircle, ArrowLeft, User, Calendar, Info } from 'lucide-react';
import { STATUS_LABELS, STATUS_COLORS } from '@/Helpers/constants';

export default function Show({ letterRequest }) {
    const [rejectReason, setRejectReason] = useState('');
    const [showRejectForm, setShowRejectForm] = useState(false);

    const handleApprove = () => {
        if (confirm('Apakah Anda yakin ingin menyetujui surat ini?')) {
            router.post(route('rt.letters.approve', letterRequest.id));
        }
    };

    const handleReject = () => {
        if (!rejectReason.trim()) return alert('Harap isi alasan penolakan.');
        router.post(route('rt.letters.reject', letterRequest.id), { alasan: rejectReason });
    };

    const isPending = letterRequest.status === 'diajukan';

    return (
        <RtLayout header="Detail Surat">
            <Head title="Detail Surat - RT" />

            <div className="max-w-3xl mx-auto space-y-6">
                <Link href={route('rt.letters.index')} className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 mb-4">
                    <ArrowLeft size={16} /> Kembali ke Daftar
                </Link>

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                    <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-2.5 rounded-lg text-blue-600 dark:text-blue-400"><FileText size={20} /></div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white">{letterRequest.letter_type?.nama_surat || letterRequest.letter_type?.name}</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Diajukan {new Date(letterRequest.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            </div>
                        </div>
                        <span className={`inline-flex items-center rounded-md px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${STATUS_COLORS[letterRequest.status] || ''}`}>
                            {STATUS_LABELS[letterRequest.status] || letterRequest.status}
                        </span>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2"><User size={14} /> Data Pemohon</h3>
                                <div className="space-y-2 text-sm">
                                    <div><span className="text-slate-500 dark:text-slate-400">Nama:</span> <span className="font-semibold text-slate-900 dark:text-white ml-2">{letterRequest.resident?.nama_lengkap}</span></div>
                                    <div><span className="text-slate-500 dark:text-slate-400">NIK:</span> <span className="font-mono ml-2">{letterRequest.resident?.nik}</span></div>
                                    <div><span className="text-slate-500 dark:text-slate-400">No. KK:</span> <span className="font-mono ml-2">{letterRequest.resident?.family_card?.no_kk || '-'}</span></div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2"><Info size={14} /> Detail Pengajuan</h3>
                                <div className="space-y-2 text-sm">
                                    <div><span className="text-slate-500 dark:text-slate-400">Keperluan:</span> <span className="font-semibold text-slate-900 dark:text-white ml-2">{letterRequest.keperluan}</span></div>
                                </div>
                            </div>
                        </div>

                        {isPending && (
                            <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">Tindakan</h3>
                                
                                {!showRejectForm ? (
                                    <div className="flex gap-4">
                                        <button onClick={handleApprove} className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-bold shadow-sm transition-colors">
                                            <CheckCircle size={18} /> Setujui Surat
                                        </button>
                                        <button onClick={() => setShowRejectForm(true)} className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-bold shadow-sm transition-colors">
                                            <XCircle size={18} /> Tolak Surat
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4 bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-900/50">
                                        <h4 className="text-sm font-bold text-red-700 dark:text-red-400">Alasan Penolakan</h4>
                                        <textarea
                                            value={rejectReason}
                                            onChange={(e) => setRejectReason(e.target.value)}
                                            rows={3}
                                            className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-red-300 dark:ring-red-700 focus:ring-2 focus:ring-red-600 sm:text-sm bg-white dark:bg-slate-800"
                                            placeholder="Tulis alasan penolakan..."
                                        />
                                        <div className="flex gap-3">
                                            <button onClick={handleReject} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-bold">Konfirmasi Tolak</button>
                                            <button onClick={() => setShowRejectForm(false)} className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300">Batal</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </RtLayout>
    );
}
