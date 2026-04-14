import React, { useState } from 'react';
import SiePemberdayaanLayout from '@/Layouts/SiePemberdayaanLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Plus, 
    Search, 
    Recycle, 
    MoreHorizontal,
    User,
    Wallet,
    CheckCircle2,
    XCircle,
    Info
} from 'lucide-react';
import Dropdown from '@/Components/Dropdown';
import TextInput from '@/Components/TextInput';

export default function Index({ participations, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('sie-pemberdayaan.waste.index'), { search, status: filters.status }, { preserveState: true });
    };

    const handleStatusFilter = (status) => {
        router.get(route('sie-pemberdayaan.waste.index'), { search: filters.search, status }, { preserveState: true });
    };

    return (
        <SiePemberdayaanLayout header="Pengelolaan Sampah & Lingkungan">
            <Head title="Pengelolaan Sampah" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Bank Sampah & Kebersihan</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Mendata partisipasi warga dalam program lingkungan dan bank sampah.</p>
                </div>
                <Link
                    href={route('sie-pemberdayaan.waste.create')}
                    className="inline-flex items-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-200 dark:shadow-none gap-2"
                >
                    <Plus size={18} /> Daftarkan Partisipasi
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 mb-6 flex flex-col md:flex-row gap-4">
                <form onSubmit={handleSearch} className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <TextInput
                        className="w-full pl-10 h-11 bg-slate-50 dark:bg-slate-900 border-none rounded-xl"
                        placeholder="Cari No. KK atau Alamat..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </form>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => handleStatusFilter('')}
                        className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${!filters.status ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 dark:bg-slate-900 text-slate-500 hover:bg-slate-100'}`}
                    >
                        Semua
                    </button>
                    <button 
                        onClick={() => handleStatusFilter('active')}
                        className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${filters.status === 'active' ? 'bg-green-600 text-white shadow-md' : 'bg-slate-50 dark:bg-slate-900 text-slate-500 hover:bg-slate-100'}`}
                    >
                        Aktif
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {participations.data.length > 0 ? participations.data.map((part) => (
                    <div key={part.id} className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-all relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-indigo-500 opacity-5 -mr-12 -mt-12 rounded-full group-hover:scale-110 transition-transform`}></div>
                        
                        <div className="flex items-start justify-between mb-5 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-500">
                                    <User size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white uppercase truncate max-w-[150px]">
                                        {part.family_card.head?.nama_lengkap || 'Kepala Keluarga'}
                                    </h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">KK: {part.family_card.no_kk}</p>
                                </div>
                            </div>
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                        <MoreHorizontal size={20} />
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content align="right">
                                    <Dropdown.Link href={route('sie-pemberdayaan.waste.edit', part.id)}>Edit Data</Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>

                        <div className="space-y-4 relative z-10">
                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl">
                                <div className="flex items-center gap-3">
                                    <Wallet size={20} className="text-indigo-500" />
                                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Saldo Bank Sampah</span>
                                </div>
                                <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                                    Rp {parseFloat(part.balance).toLocaleString('id-ID')}
                                </span>
                            </div>

                            <div className="flex items-center justify-between px-2">
                                <div className="flex items-center gap-2">
                                    <Recycle size={16} className="text-indigo-500" />
                                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Status Partisipasi</span>
                                </div>
                                {part.is_active ? (
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 gap-1">
                                        <CheckCircle2 size={12} /> Aktif
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 gap-1">
                                        <XCircle size={12} /> Nonaktif
                                    </span>
                                )}
                            </div>

                            {part.notes && (
                                <div className="p-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl flex gap-3 text-xs text-slate-500 dark:text-slate-400 italic">
                                    <Info size={14} className="flex-shrink-0 mt-0.5 text-indigo-400" />
                                    <p>{part.notes}</p>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 pt-4 border-t border-slate-50 dark:border-slate-700/50">
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Alamat Domisili</p>
                            <p className="text-xs text-slate-600 dark:text-slate-300 font-medium truncate italic">{part.family_card.alamat}</p>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full py-24 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                        <Recycle size={64} strokeWidth={1} className="mb-4 opacity-30" />
                        <p className="text-lg font-medium italic">Belum ada data partisipasi sampah.</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {participations.links.length > 3 && (
                <div className="mt-8 flex justify-center gap-2">
                    {participations.links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.url}
                            className={`px-4 py-2 text-xs rounded-xl font-bold transition-all ${link.active ? 'bg-indigo-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-100 dark:border-slate-700 hover:bg-slate-50 shadow-sm'} ${!link.url && 'opacity-50 cursor-not-allowed hidden'}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}
        </SiePemberdayaanLayout>
    );
}
