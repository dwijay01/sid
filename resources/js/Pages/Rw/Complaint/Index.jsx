import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import RwLayout from '@/Layouts/RwLayout';
import Pagination from '@/Components/Pagination';
import { 
    MessageSquareWarning, 
    Shield, 
    AlertTriangle,
    CheckCircle2,
    Clock,
    UserCircle,
    EyeOff,
    ArrowUpRight,
    Zap
} from 'lucide-react';

export default function Index({ complaints, filters, wilayahList }) {
    const { flash } = usePage().props;

    const getStatusStyle = (status) => {
        switch (status) {
            case 'menunggu': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400';
            case 'diproses_rt': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400';
            case 'diteruskan_rw': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-400';
            case 'selesai': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400';
            case 'ditolak': return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400';
            default: return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
        }
    };

    return (
        <RwLayout header="Pengaduan Warga">
            <Head title="Pengaduan Warga - RW" />

            <div className="py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <MessageSquareWarning className="h-6 w-6 text-purple-500" />
                            Monitor Pengaduan Seluruh RT
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Pantau semua laporan warga. Laporan bertanda <span className="text-indigo-600 dark:text-indigo-400 font-bold">⚡ Penting</span> memerlukan perhatian RW.</p>
                    </div>
                </div>

                {flash?.success && (
                    <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm font-medium">
                        {flash.success}
                    </div>
                )}

                {/* Filters */}
                <div className="flex flex-wrap gap-3 mb-6">
                    <div className="flex bg-white dark:bg-slate-800 p-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                        <Link href={route('rw.complaints.index', { ...filters, status: 'all' })} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${!filters.status || filters.status === 'all' ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700'}`}>Semua</Link>
                        <Link href={route('rw.complaints.index', { ...filters, status: 'diteruskan_rw' })} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${filters.status === 'diteruskan_rw' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700'}`}><Zap className="h-3.5 w-3.5" /> Penting</Link>
                        <Link href={route('rw.complaints.index', { ...filters, status: 'menunggu' })} className={`hidden sm:inline-block px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filters.status === 'menunggu' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700'}`}>Menunggu</Link>
                        <Link href={route('rw.complaints.index', { ...filters, status: 'selesai' })} className={`hidden sm:inline-block px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filters.status === 'selesai' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700'}`}>Selesai</Link>
                    </div>

                    {wilayahList && wilayahList.length > 1 && (
                        <select
                            className="rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm shadow-sm focus:border-purple-500 focus:ring-purple-500"
                            value={filters.rt || ''}
                            onChange={(e) => {
                                const url = route('rw.complaints.index', { ...filters, rt: e.target.value || undefined });
                                window.location.href = url;
                            }}
                        >
                            <option value="">Semua RT</option>
                            {wilayahList.map(w => (
                                <option key={w.id} value={w.rt}>RT {w.rt}</option>
                            ))}
                        </select>
                    )}
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Pelapor & Judul</th>
                                    <th className="px-6 py-4 font-semibold">Wilayah</th>
                                    <th className="px-6 py-4 font-semibold">Kategori</th>
                                    <th className="px-6 py-4 font-semibold">Tanggal</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                    <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                {complaints.data.length > 0 ? complaints.data.map(complaint => (
                                    <tr key={complaint.id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${complaint.is_escalated ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                                                    {complaint.is_secret ? <EyeOff className="h-5 w-5" /> : <UserCircle className="h-5 w-5" />}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                        {complaint.title}
                                                        {complaint.is_escalated && (
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 text-[10px] font-bold uppercase tracking-wider border border-indigo-200 dark:border-indigo-800">
                                                                <Zap className="h-3 w-3" /> Penting
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{complaint.resident_name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-slate-600 dark:text-slate-400 font-medium">{complaint.wilayah_name}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-slate-600 dark:text-slate-400 capitalize">{complaint.category.replace('_', ' ')}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {complaint.created_at}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${getStatusStyle(complaint.status)}`}>
                                                {complaint.status_label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={route('rw.complaints.show', complaint.id)} className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 font-bold">
                                                Detail &rarr;
                                            </Link>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-10 text-center text-slate-500 dark:text-slate-400">
                                            Tidak ada laporan pengaduan yang ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {complaints.last_page > 1 && (
                        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                            <Pagination links={complaints.links} />
                        </div>
                    )}
                </div>
            </div>
        </RwLayout>
    );
}
