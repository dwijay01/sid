import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import RtLayout from '@/Layouts/RtLayout';
import { ArrowUpDown, Search, Baby, Skull, ArrowRightLeft, ArrowDownToLine } from 'lucide-react';
import { MUTATION_TYPES } from '@/Helpers/constants';

export default function Index({ mutations, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [typeFilter, setTypeFilter] = useState(filters.type || '');

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(route('rt.mutations.index'), { search, type: typeFilter }, { preserveState: true });
        }, 400);
        return () => clearTimeout(timeout);
    }, [search, typeFilter]);

    const typeColors = {
        lahir: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
        mati: 'bg-red-50 text-red-700 ring-red-600/20',
        pindah_keluar: 'bg-amber-50 text-amber-700 ring-amber-600/20',
        pindah_masuk: 'bg-blue-50 text-blue-700 ring-blue-600/20',
        datang: 'bg-indigo-50 text-indigo-700 ring-indigo-600/20',
    };

    return (
        <RtLayout header="Mutasi Penduduk">
            <Head title="Mutasi - RT" />

            <div className="mb-6">
                <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-indigo-100 dark:bg-indigo-900/40 p-3 rounded-xl text-indigo-600"><ArrowUpDown size={24} /></div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Data Mutasi Penduduk</h2>
                                <p className="text-sm text-slate-500">Riwayat mutasi: kelahiran, kematian, pindah, masuk.</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Link href={route('rt.mutations.birth')} className="inline-flex items-center gap-1 px-3 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-500"><Baby size={14} /> Lahir</Link>
                            <Link href={route('rt.mutations.death')} className="inline-flex items-center gap-1 px-3 py-2 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-500"><Skull size={14} /> Meninggal</Link>
                            <Link href={route('rt.mutations.move-out')} className="inline-flex items-center gap-1 px-3 py-2 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-500"><ArrowRightLeft size={14} /> Pindah</Link>
                            <Link href={route('rt.mutations.move-in')} className="inline-flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-500"><ArrowDownToLine size={14} /> Masuk</Link>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-3 mt-4">
                        <div className="relative flex-1 min-w-[200px]">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="block w-full rounded-lg border-0 py-2 pl-10 pr-3 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50" placeholder="Cari..." />
                        </div>
                        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="rounded-lg border-0 py-2 text-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white">
                            <option value="">Semua Tipe</option>
                            {Object.entries(MUTATION_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th className="py-3.5 pl-6 pr-3 text-left text-xs font-bold text-slate-500 uppercase">Warga</th>
                                <th className="px-3 py-3.5 text-left text-xs font-bold text-slate-500 uppercase">Tipe</th>
                                <th className="px-3 py-3.5 text-left text-xs font-bold text-slate-500 uppercase">Tanggal</th>
                                <th className="px-3 py-3.5 text-left text-xs font-bold text-slate-500 uppercase">Keterangan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {mutations.data.length > 0 ? mutations.data.map((m) => (
                                <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="whitespace-nowrap py-4 pl-6 pr-3">
                                        <div className="font-bold text-slate-900 dark:text-white text-sm">{m.resident?.nama_lengkap}</div>
                                        <div className="text-xs text-slate-500 font-mono">{m.resident?.nik}</div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4">
                                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ring-1 ring-inset ${typeColors[m.type] || ''}`}>
                                            {MUTATION_TYPES[m.type] || m.type}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-600 dark:text-slate-400">{new Date(m.tanggal_mutasi).toLocaleDateString('id-ID')}</td>
                                    <td className="px-3 py-4 text-sm text-slate-600 dark:text-slate-400 max-w-xs truncate">{m.keterangan || '-'}</td>
                                </tr>
                            )) : (
                                <tr><td colSpan="4" className="px-6 py-12 text-center text-sm text-slate-500">Belum ada data mutasi.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {mutations.links && mutations.links.length > 3 && (
                    <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex items-center justify-center">
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                            {mutations.links.map((link, i) => (
                                <a key={i} href={link.url || '#'} className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${link.active ? 'z-10 bg-blue-600 text-white' : 'text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 hover:bg-slate-50'} ${i === 0 ? 'rounded-l-md' : ''} ${i === mutations.links.length - 1 ? 'rounded-r-md' : ''}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                            ))}
                        </nav>
                    </div>
                )}
            </div>
        </RtLayout>
    );
}
