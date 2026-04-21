import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import WargaLayout from '@/Layouts/WargaLayout';
import { 
    AlertTriangle, 
    Plus, 
    ArrowRight,
    MapPin,
    Calendar,
    Clock,
    FileText,
    MessageSquareWarning,
    Shield
} from 'lucide-react';

export default function Index({ complaints }) {
    const { flash } = usePage().props;

    const getStatusStyle = (status) => {
        switch (status) {
            case 'menunggu':
                return 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800';
            case 'diproses_rt':
                return 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
            case 'diteruskan_rw':
                return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800';
            case 'selesai':
                return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
            case 'ditolak':
                return 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
            default:
                return 'bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
        }
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'keamanan': return <Shield className="h-5 w-5" />;
            case 'infrastruktur': return <AlertTriangle className="h-5 w-5" />;
            default: return <MessageSquareWarning className="h-5 w-5" />;
        }
    };

    return (
        <WargaLayout header="Riwayat Pengaduan">
            <Head title="Pengaduan Saya" />

            <div className="max-w-4xl mx-auto py-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <MessageSquareWarning className="h-6 w-6 text-amber-500" />
                            Laporan Keamanan & Insiden
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Pantau status laporan dan aduan Anda kepada pengurus RT/RW.</p>
                    </div>
                    <Link
                        href={route('warga.complaints.create')}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm transition-colors shadow-sm"
                    >
                        <Plus className="h-4 w-4" /> Buka Laporan Baru
                    </Link>
                </div>

                {flash.success && (
                    <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm font-medium">
                        {flash.success}
                    </div>
                )}
                {flash.warning && (
                    <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-sm font-medium">
                        {flash.warning}
                    </div>
                )}

                {complaints.data.length === 0 ? (
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-10 text-center border border-slate-200 dark:border-slate-700 shadow-sm">
                        <div className="mx-auto w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center mb-4">
                            <FileText className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Belum Ada Laporan</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">
                            Anda belum pernah mengajukan laporan kejadian atau aduan ke pengurus RT.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {complaints.data.map(complaint => (
                            <Link 
                                href={route('warga.complaints.show', complaint.id)} 
                                key={complaint.id}
                                className="block group bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 hover:border-amber-300 dark:hover:border-amber-700 hover:shadow-md transition-all relative overflow-hidden"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0 mt-1">
                                            <div className={`h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 group-hover:bg-amber-100 group-hover:text-amber-600 dark:group-hover:bg-amber-900/30 dark:group-hover:text-amber-400 transition-colors`}>
                                                {getCategoryIcon(complaint.category)}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">{complaint.title}</h3>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" /> {complaint.created_at}
                                                </span>
                                                <span className="flex items-center gap-1 capitalize">
                                                    <MapPin className="h-3 w-3" /> {complaint.category.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 mt-2 sm:mt-0 pt-3 sm:pt-0 border-t border-slate-100 sm:border-0 dark:border-slate-700">
                                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(complaint.status)}`}>
                                            {complaint.status_label}
                                        </span>
                                        <ArrowRight className="h-5 w-5 text-slate-300 dark:text-slate-600 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </WargaLayout>
    );
}
