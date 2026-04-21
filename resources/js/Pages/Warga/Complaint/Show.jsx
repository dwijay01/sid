import React from 'react';
import { Head, Link } from '@inertiajs/react';
import WargaLayout from '@/Layouts/WargaLayout';
import { 
    AlertTriangle, 
    ArrowLeft, 
    CheckCircle2, 
    Clock, 
    MessageSquareWarning,
    UserCircle,
    Shield,
    MapPin,
    ArrowRight
} from 'lucide-react';

export default function Show({ complaint }) {
    
    const getStatusTheme = (status) => {
        switch(status) {
            case 'menunggu': return { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-800 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800', icon: <Clock className="h-5 w-5" /> };
            case 'diproses_rt': return { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-800 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-800', icon: <UserCircle className="h-5 w-5" /> };
            case 'diteruskan_rw': return { bg: 'bg-indigo-100 dark:bg-indigo-900/30', text: 'text-indigo-800 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-800', icon: <Shield className="h-5 w-5" /> };
            case 'selesai': return { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-800 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-800', icon: <CheckCircle2 className="h-5 w-5" /> };
            case 'ditolak': return { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-800 dark:text-red-400', border: 'border-red-200 dark:border-red-800', icon: <AlertTriangle className="h-5 w-5" /> };
            default: return { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-800 dark:text-slate-300', border: 'border-slate-200 dark:border-slate-700', icon: <Clock className="h-5 w-5" /> };
        }
    };

    const theme = getStatusTheme(complaint.status);

    return (
        <WargaLayout header={`Detail Laporan #${complaint.id}`}>
            <Head title={`Laporan #${complaint.id}`} />

            <div className="max-w-4xl mx-auto py-8">
                <Link href={route('warga.complaints.index')} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors mb-6">
                    <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar Laporan
                </Link>

                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm mb-6">
                    <div className={`${theme.bg} ${theme.border} border-b p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
                        <div className="flex items-center gap-3">
                            <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${theme.text} bg-white dark:bg-slate-900 shadow-sm`}>
                                {theme.icon}
                            </div>
                            <div>
                                <h2 className={`font-bold ${theme.text}`}>Status Pengaduan</h2>
                                <p className={`text-sm ${theme.text} font-medium mt-0.5`}>{complaint.status_label}</p>
                            </div>
                        </div>
                        <div className={`text-right ${theme.text}`}>
                            <div className="text-sm font-bold">Kategori: <span className="capitalize">{complaint.category.replace('_', ' ')}</span></div>
                            <div className="text-xs opacity-80 mt-1">{complaint.formatted_date}</div>
                        </div>
                    </div>

                    <div className="p-6 sm:p-8">
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6">{complaint.title}</h1>
                        
                        <div className="prose prose-sm dark:prose-invert max-w-none text-slate-700 dark:text-slate-300">
                            <p className="whitespace-pre-wrap">{complaint.description}</p>
                        </div>

                        {complaint.attachment_path && (
                            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700">
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Foto Lampiran</h3>
                                <img 
                                    src={`/storage/${complaint.attachment_path}`} 
                                    alt="Lampiran Laporan" 
                                    className="max-h-96 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Response Thread */}
                <div className="space-y-6">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                        <MessageSquareWarning className="h-5 w-5 text-amber-500" />
                        Tanggapan Pengurus
                    </h3>

                    {(!complaint.rt_response && !complaint.rw_response) ? (
                        <div className="text-center p-8 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                            <Clock className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                            <p className="text-sm text-slate-500 dark:text-slate-400">Laporan Anda sedang menunggu ditinjau oleh Ketua RT.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* RT Response */}
                            {complaint.rt_response && (
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-800 shadow-sm">
                                        RT
                                    </div>
                                    <div className="flex-1 bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 relative">
                                        <div className="absolute top-4 -left-2.5 w-5 h-5 bg-white dark:bg-slate-800 border-l border-b border-slate-200 dark:border-slate-700 transform rotate-45"></div>
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Tanggapan Ketua RT</h4>
                                        <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{complaint.rt_response}</p>
                                    </div>
                                </div>
                            )}

                            {/* RW Response */}
                            {complaint.rw_response && (
                                <div className="flex gap-4">
                                    <div className="flex-shrink-0 h-10 w-10 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-800 shadow-sm">
                                        RW
                                    </div>
                                    <div className="flex-1 bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 relative">
                                        <div className="absolute top-4 -left-2.5 w-5 h-5 bg-white dark:bg-slate-800 border-l border-b border-slate-200 dark:border-slate-700 transform rotate-45"></div>
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                                            Tanggapan Ketua RW
                                            <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 text-[10px] rounded-full uppercase tracking-widest border border-emerald-200 dark:border-emerald-800">Tingkat Lanjut</span>
                                        </h4>
                                        <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{complaint.rw_response}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </WargaLayout>
    );
}
