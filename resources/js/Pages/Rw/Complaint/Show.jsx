import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import RwLayout from '@/Layouts/RwLayout';
import Modal from '@/Components/Modal';
import { 
    ArrowLeft, 
    CheckCircle2, 
    Clock, 
    MessageSquareWarning,
    UserCircle,
    Shield,
    AlertTriangle,
    EyeOff,
    Zap,
    XCircle,
    Send
} from 'lucide-react';

export default function Show({ complaint }) {
    const { flash } = usePage().props;
    const [showResponseModal, setShowResponseModal] = useState(false);
    const [selectedAction, setSelectedAction] = useState('');

    const { data, setData, post, processing, reset } = useForm({
        status: '',
        rw_response: complaint.rw_response || '',
    });

    const openAction = (action) => {
        setSelectedAction(action);
        setData('status', action);
        setShowResponseModal(true);
    };

    const submitResponse = (e) => {
        e.preventDefault();
        post(route('rw.complaints.updateStatus', complaint.id), {
            onSuccess: () => {
                setShowResponseModal(false);
                reset();
            },
        });
    };

    const getStatusTheme = (status) => {
        switch(status) {
            case 'menunggu': return { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-800 dark:text-amber-400', icon: <Clock className="h-5 w-5" /> };
            case 'diproses_rt': return { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-800 dark:text-blue-400', icon: <UserCircle className="h-5 w-5" /> };
            case 'diteruskan_rw': return { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-800 dark:text-indigo-400', icon: <Shield className="h-5 w-5" /> };
            case 'selesai': return { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-800 dark:text-emerald-400', icon: <CheckCircle2 className="h-5 w-5" /> };
            case 'ditolak': return { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-800 dark:text-red-400', icon: <AlertTriangle className="h-5 w-5" /> };
            default: return { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-800 dark:text-slate-300', icon: <Clock className="h-5 w-5" /> };
        }
    };

    const theme = getStatusTheme(complaint.status);
    const isEscalated = complaint.status === 'diteruskan_rw';

    return (
        <RwLayout header={`Pengaduan #${complaint.id}`}>
            <Head title={`Pengaduan #${complaint.id} - RW`} />

            <div className="max-w-4xl mx-auto">
                <Link href={route('rw.complaints.index')} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors mb-6">
                    <ArrowLeft className="h-4 w-4" /> Kembali ke Monitor
                </Link>

                {flash?.success && (
                    <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm font-medium">
                        {flash.success}
                    </div>
                )}

                {/* Escalation Badge */}
                {isEscalated && (
                    <div className="mb-6 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-4 flex items-start gap-3">
                        <Zap className="h-5 w-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-300">Laporan Diteruskan ke RW</h3>
                            <p className="text-sm text-indigo-700 dark:text-indigo-400/80 mt-1">Ketua RT telah menandai laporan ini sebagai <strong>Penting</strong> dan membutuhkan tindak lanjut dari RW.</p>
                        </div>
                    </div>
                )}

                {/* Status Header */}
                <div className={`${theme.bg} rounded-2xl p-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
                    <div className="flex items-center gap-3">
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${theme.text} bg-white dark:bg-slate-900 shadow-sm`}>
                            {theme.icon}
                        </div>
                        <div>
                            <div className={`text-xs font-semibold ${theme.text} uppercase tracking-wider`}>Status</div>
                            <div className={`text-lg font-bold ${theme.text}`}>{complaint.status_label}</div>
                        </div>
                    </div>
                    <div className={`text-sm ${theme.text}`}>
                        <div className="font-medium">Wilayah: {complaint.wilayah ? `RT ${complaint.wilayah.rt} / RW ${complaint.wilayah.rw}` : '-'}</div>
                        <div className="text-xs opacity-80 mt-1">{complaint.formatted_date}</div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm mb-6">
                    <div className="p-6 sm:p-8">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
                            <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                                {complaint.is_secret ? <EyeOff className="h-5 w-5" /> : <UserCircle className="h-5 w-5" />}
                            </div>
                            <div>
                                <div className="font-bold text-slate-900 dark:text-white">{complaint.resident?.nama_lengkap}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">Kategori: {complaint.category?.replace('_', ' ')}</div>
                            </div>
                        </div>

                        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-4">{complaint.title}</h1>
                        <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">{complaint.description}</p>

                        {complaint.attachment_path && (
                            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Foto Lampiran</h3>
                                <img src={`/storage/${complaint.attachment_path}`} alt="Lampiran" className="max-h-96 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Response Thread */}
                {(complaint.rt_response || complaint.rw_response) && (
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm mb-6 p-6">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">Riwayat Tanggapan</h3>
                        <div className="space-y-4">
                            {complaint.rt_response && (
                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                                    <div className="text-xs font-bold text-blue-700 dark:text-blue-400 mb-2">Tanggapan Ketua RT</div>
                                    <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{complaint.rt_response}</p>
                                </div>
                            )}
                            {complaint.rw_response && (
                                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
                                    <div className="text-xs font-bold text-purple-700 dark:text-purple-400 mb-2">Tanggapan Ketua RW (Anda)</div>
                                    <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{complaint.rw_response}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Actions — RW can respond to escalated complaints or mark anything as done */}
                {complaint.status !== 'selesai' && complaint.status !== 'ditolak' && (
                    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm p-6">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-4">Tindakan RW</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => openAction('selesai')} className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 transition-colors">
                                <CheckCircle2 className="h-6 w-6" />
                                <span className="text-xs font-bold text-center">Selesaikan</span>
                            </button>
                            <button onClick={() => openAction('ditolak')} className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-dashed border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-700 dark:text-red-400 transition-colors">
                                <XCircle className="h-6 w-6" />
                                <span className="text-xs font-bold text-center">Tolak</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* RW Response Modal */}
            <Modal show={showResponseModal} onClose={() => setShowResponseModal(false)}>
                <form onSubmit={submitResponse} className="p-6">
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100 dark:border-slate-700">
                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                            <Send className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                            {selectedAction === 'selesai' ? 'Selesaikan Pengaduan' : 'Tolak Pengaduan'}
                        </h2>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">Tanggapan RW (Opsional)</label>
                        <textarea
                            rows="4"
                            className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white px-4 py-3 focus:border-purple-500 focus:ring-purple-500"
                            placeholder="Berikan keterangan resmi dari RW..."
                            value={data.rw_response}
                            onChange={(e) => setData('rw_response', e.target.value)}
                        ></textarea>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button type="button" onClick={() => setShowResponseModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-bold text-sm rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                            Batal
                        </button>
                        <button type="submit" disabled={processing} className="px-5 py-2 bg-purple-600 text-white font-bold text-sm rounded-lg hover:bg-purple-500 transition-colors disabled:opacity-50">
                            {processing ? 'Menyimpan...' : 'Konfirmasi'}
                        </button>
                    </div>
                </form>
            </Modal>
        </RwLayout>
    );
}
