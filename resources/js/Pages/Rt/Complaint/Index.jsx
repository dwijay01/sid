import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import RtLayout from '@/Layouts/RtLayout';
import Pagination from '@/Components/Pagination';
import { 
    MessageSquareWarning, 
    Shield, 
    AlertTriangle,
    CheckCircle2,
    Clock,
    UserCircle,
    EyeOff
} from 'lucide-react';

export default function Index({ complaints, filters }) {

    const getStatusStyle = (status) => {
        switch (status) {
            case 'menunggu':
                return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400';
            case 'diproses_rt':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400';
            case 'diteruskan_rw':
                return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-400';
            case 'selesai':
                return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400';
            case 'ditolak':
                return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400';
            default:
                return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
        }
    };

    return (
        <RtLayout header="Pengaduan Warga">
            <Head title="Pengaduan Warga" />

            <div className="py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <MessageSquareWarning className="h-6 w-6 text-indigo-500" />
                            Daftar Pengaduan
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Kelola dan tanggapi laporan masuk dari warga di wilayah RT Anda.</p>
                    </div>

                    <div className="flex bg-white dark:bg-slate-800 p-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                        <Link href={route('rt.complaints.index', { status: 'all' })} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${!filters.status || filters.status === 'all' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700'}`}>Semua</Link>
                        <Link href={route('rt.complaints.index', { status: 'menunggu' })} className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filters.status === 'menunggu' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700'}`}>Menunggu</Link>
                        <Link href={route('rt.complaints.index', { status: 'diproses_rt' })} className={`hidden sm:inline-block px-4 py-2 text-sm font-medium rounded-lg transition-colors ${filters.status === 'diproses_rt' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-700'}`}>Diproses</Link>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Pelapor & Judul</th>
                                    <th className="px-6 py-4 font-semibold">Kategori</th>
                                    <th className="px-6 py-4 font-semibold">Tanggal</th>
                                    <th className="px-6 py-4 font-semibold">Status</th>
                                    <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                {complaints.data.length > 0 ? complaints.data.map(complaint => (
                                    <tr key={complaint.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                                                    {complaint.is_secret ? <EyeOff className="h-5 w-5" /> : <UserCircle className="h-5 w-5" />}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900 dark:text-white capitalize">{complaint.title}</div>
                                                    <div className={`text-xs mt-0.5 ${complaint.is_secret ? 'text-amber-600 dark:text-amber-500 font-medium' : 'text-slate-500 dark:text-slate-400'}`}>
                                                        {complaint.resident_name}
                                                    </div>
                                                </div>
                                            </div>
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
                                            <Link href={route('rt.complaints.show', complaint.id)} className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 font-bold">
                                                Tinjau Laporan &rarr;
                                            </Link>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-10 text-center text-slate-500 dark:text-slate-400">
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
        </RtLayout>
    );
}
