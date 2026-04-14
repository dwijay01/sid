import React, { useState } from 'react';
import SiePemberdayaanLayout from '@/Layouts/SiePemberdayaanLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Plus, 
    Search, 
    Wifi, 
    MoreHorizontal,
    CreditCard,
    AlertCircle,
    CheckCircle2,
    XCircle
} from 'lucide-react';
import Dropdown from '@/Components/Dropdown';
import TextInput from '@/Components/TextInput';

export default function Index({ subscriptions, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('sie-pemberdayaan.internet.index'), { search, status: filters.status }, { preserveState: true });
    };

    const handleStatusFilter = (status) => {
        router.get(route('sie-pemberdayaan.internet.index'), { search: filters.search, status }, { preserveState: true });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'aktif':
                return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 gap-1"><CheckCircle2 size={12} /> Aktif</span>;
            case 'isolir':
                return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 gap-1"><AlertCircle size={12} /> Isolir</span>;
            case 'berhenti':
                return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 gap-1"><XCircle size={12} /> Berhenti</span>;
            default:
                return null;
        }
    };

    return (
        <SiePemberdayaanLayout header="Internet Komunitas">
            <Head title="Internet Komunitas" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Daftar Pelanggan Internet</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Kelola data instalasi dan iuran internet RW secara terpusat.</p>
                </div>
                <Link
                    href={route('sie-pemberdayaan.internet.create')}
                    className="inline-flex items-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-200 dark:shadow-none gap-2"
                >
                    <Plus size={18} /> Daftarkan Pelanggan
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 mb-6 flex flex-col md:flex-row gap-4">
                <form onSubmit={handleSearch} className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <TextInput
                        className="w-full pl-10 h-11 bg-slate-50 dark:bg-slate-900 border-none focus:ring-2 focus:ring-indigo-500 rounded-xl"
                        placeholder="Cari No. KK atau Alamat..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </form>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => handleStatusFilter('')}
                        className={`px-4 py-2 text-sm font-semibold rounded-xl transition-colors ${!filters.status ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400' : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100'}`}
                    >
                        Semua
                    </button>
                    <button 
                        onClick={() => handleStatusFilter('aktif')}
                        className={`px-4 py-2 text-sm font-semibold rounded-xl transition-colors ${filters.status === 'aktif' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400' : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100'}`}
                    >
                        Aktif
                    </button>
                    <button 
                        onClick={() => handleStatusFilter('isolir')}
                        className={`px-4 py-2 text-sm font-semibold rounded-xl transition-colors ${filters.status === 'isolir' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-400' : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100'}`}
                    >
                        Isolir
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">No. KK / Wilayah</th>
                                <th className="px-6 py-4">Paket & Lokasi</th>
                                <th className="px-6 py-4">Tgl Instalasi</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {subscriptions.data.length > 0 ? subscriptions.data.map((sub) => (
                                <tr key={sub.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-bold text-slate-800 dark:text-white">{sub.family_card.no_kk}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">RT {sub.family_card.wilayah.rt} / RW {sub.family_card.wilayah.rw}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Wifi size={14} className="text-indigo-500" />
                                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{sub.package_name}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{sub.access_point_location || '-'}</p>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                                        {new Date(sub.installation_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(sub.status)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link 
                                                href={route('sie-pemberdayaan.internet.payments', sub.id)}
                                                className="p-2 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                                                title="Riwayat Pembayaran"
                                            >
                                                <CreditCard size={18} />
                                            </Link>
                                            <Dropdown>
                                                <Dropdown.Trigger>
                                                    <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                                        <MoreHorizontal size={18} />
                                                    </button>
                                                </Dropdown.Trigger>
                                                <Dropdown.Content align="right">
                                                    <Dropdown.Link href={route('sie-pemberdayaan.internet.edit', sub.id)}>Edit Data</Dropdown.Link>
                                                </Dropdown.Content>
                                            </Dropdown>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 italic">
                                        Data tidak ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination (Simplified) */}
                {subscriptions.links.length > 3 && (
                    <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700 flex justify-center gap-2">
                        {subscriptions.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url}
                                className={`px-3 py-1 text-xs rounded-md ${link.active ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'} ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </SiePemberdayaanLayout>
    );
}
