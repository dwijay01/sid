import React, { useState } from 'react';
import SiePemberdayaanLayout from '@/Layouts/SiePemberdayaanLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    Plus, 
    Search, 
    Briefcase, 
    MoreHorizontal,
    User,
    Phone,
    MapPin,
    Tornado,
    Wrench,
    BookOpen,
    GraduationCap,
    Hammer,
    Trash2
} from 'lucide-react';
import Dropdown from '@/Components/Dropdown';
import TextInput from '@/Components/TextInput';

export default function Index({ skills, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('sie-pemberdayaan.skills.index'), { search, category: filters.category }, { preserveState: true });
    };

    const handleCategoryFilter = (category) => {
        router.get(route('sie-pemberdayaan.skills.index'), { search: filters.search, category }, { preserveState: true });
    };

    const categories = [
        { id: 'Jasa', icon: Briefcase, color: 'bg-blue-500' },
        { id: 'Teknik', icon: Hammer, color: 'bg-amber-500' },
        { id: 'Pendidikan', icon: GraduationCap, color: 'bg-indigo-500' },
        { id: 'Lainnya', icon: Wrench, color: 'bg-slate-500' },
    ];

    return (
        <SiePemberdayaanLayout header="Database Keahlian Warga">
            <Head title="Database Keahlian" />

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Ekosistem Keahlian RW</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Mendata potensi SDM untuk kebutuhan dari warga untuk warga.</p>
                </div>
                <Link
                    href={route('sie-pemberdayaan.skills.create')}
                    className="inline-flex items-center px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-200 dark:shadow-none gap-2"
                >
                    <Plus size={18} /> Tambah Keahlian
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-6 mb-8">
                <div className="flex-1">
                    <form onSubmit={handleSearch} className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <TextInput
                            className="w-full pl-12 h-12 bg-white dark:bg-slate-800 border-none shadow-sm focus:ring-2 focus:ring-indigo-500 rounded-2xl"
                            placeholder="Cari warga atau jenis keahlian..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </form>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
                    <button 
                        onClick={() => handleCategoryFilter('')}
                        className={`whitespace-nowrap px-6 py-3 text-sm font-bold rounded-2xl transition-all ${!filters.category ? 'bg-indigo-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-700 hover:bg-slate-50'}`}
                    >
                        Semua Kategori
                    </button>
                    {categories.map((cat) => (
                        <button 
                            key={cat.id}
                            onClick={() => handleCategoryFilter(cat.id)}
                            className={`whitespace-nowrap px-6 py-3 text-sm font-bold rounded-2xl transition-all flex items-center gap-2 ${filters.category === cat.id ? 'bg-indigo-600 text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-700 hover:bg-slate-50'}`}
                        >
                            <cat.icon size={16} /> {cat.id}
                        </button>
                    ))}
                </div>
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {skills.data.length > 0 ? skills.data.map((skill) => (
                    <div key={skill.id} className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                                    <User size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">{skill.resident.nama_lengkap}</h3>
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400">
                                        NIW: {skill.resident.nik.substring(0, 6)}...
                                    </span>
                                </div>
                            </div>
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                        <MoreHorizontal size={20} />
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content align="right">
                                    <Dropdown.Link href={route('sie-pemberdayaan.skills.edit', skill.id)}>Edit Data</Dropdown.Link>
                                    <Dropdown.Link 
                                        href={route('sie-pemberdayaan.skills.destroy', skill.id)} 
                                        method="delete" 
                                        as="button"
                                        className="text-red-600"
                                    >
                                        Hapus
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>

                        <div className="space-y-4 mb-6">
                            <div>
                                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold gap-1 mb-2 ${
                                    skill.category === 'Jasa' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                    skill.category === 'Teknik' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                    skill.category === 'Pendidikan' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' :
                                    'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400'
                                }`}>
                                    {skill.category}
                                </span>
                                <h4 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-tight uppercase">
                                    {skill.skill_name}
                                </h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 italic">
                                    "{skill.description || 'Tidak ada deskripsi tambahan.'}"
                                </p>
                            </div>
                        </div>

                        <div className="pt-5 border-t border-slate-50 dark:border-slate-700/50 space-y-3">
                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                <MapPin size={16} className="text-indigo-500 flex-shrink-0" />
                                <span className="text-xs font-medium truncate italic">{skill.resident.family_card.alamat}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                <Phone size={16} className="text-indigo-500 flex-shrink-0" />
                                <span className="text-xs font-bold font-mono">{skill.resident.telepon || 'No. telp tidak tersedia'}</span>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="col-span-full py-24 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600">
                        <Briefcase size={64} strokeWidth={1} className="mb-4 opacity-50" />
                        <p className="text-lg font-medium italic">Belum ada data keahlian yang terdaftar di RW ini.</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {skills.links.length > 3 && (
                <div className="mt-12 flex justify-center gap-3">
                    {skills.links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.url}
                            className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all ${link.active ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-700 hover:bg-slate-50 shadow-sm'} ${!link.url && 'opacity-50 cursor-not-allowed hidden'}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}
        </SiePemberdayaanLayout>
    );
}
