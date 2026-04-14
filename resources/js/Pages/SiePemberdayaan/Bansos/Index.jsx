import React from 'react';
import SiePemberdayaanLayout from '@/Layouts/SiePemberdayaanLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Search, 
    HeartHandshake, 
    Home,
    Droplets,
    ShieldAlert,
    ChevronRight,
    Filter,
    Layers,
    XCircle,
    User
} from 'lucide-react';
import TextInput from '@/Components/TextInput';

export default function Index({ families, filters }) {
    const handlePriorityFilter = (priority) => {
        router.get(route('sie-pemberdayaan.bansos.index'), { ...filters, priority }, { preserveState: true });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('sie-pemberdayaan.bansos.index'), { ...filters, search: e.target.search.value }, { preserveState: true });
    };

    const isHighPriority = (family) => {
        const pLantai = ['Tanah', 'Papan', 'Kayu'].some(v => family.jenis_lantai?.includes(v));
        const pDinding = ['Bambu', 'Kayu', 'Seng', 'Semi Permanen'].some(v => family.jenis_dinding?.includes(v));
        const pSanitasi = ['Bersama', 'Umum', 'Tidak Ada'].some(v => family.fasilitas_sanitasi?.includes(v));
        return pLantai || pDinding || pSanitasi;
    };

    return (
        <SiePemberdayaanLayout header="Rekomendasi Bansos">
            <Head title="Rekomendasi Bansos" />

            <div className="mb-8">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Verifikasi Kelayakan Bantuan</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Gunakan data kondisi perumahan untuk memberikan rekomendasi prioritas penerima bantuan (Bansos).</p>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                            <Layers size={20} />
                        </div>
                        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Total KK Terpeta</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{families.total} KK</h3>
                </div>
                <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-2xl shadow-sm border border-red-100 dark:border-red-900/20">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg">
                            <ShieldAlert size={20} />
                        </div>
                        <span className="text-sm font-medium text-red-700 dark:text-red-400">Indikasi Prioritas Tinggi</span>
                    </div>
                    <h3 className="text-2xl font-bold text-red-900 dark:text-red-300">Target Rekomendasi</h3>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <form onSubmit={handleSearch} className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <TextInput
                        name="search"
                        defaultValue={filters.search}
                        className="w-full pl-10 h-11 bg-white dark:bg-slate-800 border-none shadow-sm rounded-xl"
                        placeholder="Cari No. KK atau Alamat..."
                    />
                </form>
                <div className="flex gap-2">
                    <button 
                        onClick={() => handlePriorityFilter('')}
                        className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${!filters.priority ? 'bg-indigo-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-100'}`}
                    >
                        Semua Data
                    </button>
                    <button 
                        onClick={() => handlePriorityFilter('high')}
                        className={`px-4 py-2 text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${filters.priority === 'high' ? 'bg-red-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-red-600 border border-red-100 hover:bg-red-50'}`}
                    >
                        <ShieldAlert size={16} /> Prioritas Tinggi
                    </button>
                </div>
            </div>

            {/* Results */}
            <div className="grid grid-cols-1 gap-4">
                {families.data.length > 0 ? families.data.map((family) => {
                    const priority = isHighPriority(family);
                    return (
                        <div key={family.id} className={`bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border ${priority ? 'border-red-100 dark:border-red-900/30 ring-1 ring-red-50 dark:ring-red-900/10' : 'border-slate-100 dark:border-slate-700'} flex flex-col lg:flex-row lg:items-center justify-between gap-6 group hover:shadow-md transition-shadow`}>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-500">
                                        <User size={20} />
                                    </div>
                                    <div className="truncate">
                                        <h4 className="font-bold text-slate-900 dark:text-white uppercase truncate">
                                            {family.head?.nama_lengkap || 'Kepala Keluarga Tidak Ditemukan'}
                                        </h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">No. KK: {family.no_kk}</p>
                                    </div>
                                    {priority && (
                                        <span className="ml-2 hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400 uppercase tracking-wider">Prioritas</span>
                                    )}
                                </div>
                                <div className="flex flex-wrap gap-4 mt-4">
                                    <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                                        <Home size={14} className="text-slate-400" />
                                        <span>Dinding: <span className="font-bold">{family.jenis_dinding || '-'}</span></span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                                        <Layers size={14} className="text-slate-400" />
                                        <span>Lantai: <span className="font-bold">{family.jenis_lantai || '-'}</span></span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                                        <Droplets size={14} className="text-slate-400" />
                                        <span>Sanitasi: <span className="font-bold">{family.fasilitas_sanitasi || '-'}</span></span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 lg:pl-6 lg:border-l border-slate-100 dark:border-slate-700">
                                <div className="text-right hidden sm:block">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 italic">Rekomendasi</p>
                                    <p className={`text-sm font-black uppercase ${priority ? 'text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-500'}`}>
                                        {priority ? 'Sangat Layak' : 'Reguler'}
                                    </p>
                                </div>
                                <div className="flex-1 sm:flex-initial">
                                    <button className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${priority ? 'bg-red-600 text-white shadow-lg shadow-red-100 dark:shadow-none hover:bg-red-700' : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-100'}`}>
                                        Detail KK <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                }) : (
                    <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-slate-100 dark:border-slate-700">
                        <HeartHandshake size={48} className="mx-auto text-slate-300 mb-4" />
                        <p className="text-slate-500 dark:text-slate-400 font-medium">Data keluarga tidak ditemukan.</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {families.links.length > 3 && (
                <div className="mt-8 flex justify-center gap-2">
                    {families.links.map((link, i) => (
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
