import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import RtLayout from '@/Layouts/RtLayout';
import { CreditCard, Search, Plus, Edit, Trash2 } from 'lucide-react';
import { STATUS_COLORS } from '@/Helpers/constants'; // Optional, or define locally

export default function Index({ familyCards, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(route('rt.family-cards.index'), { search }, { preserveState: true });
        }, 400);
        return () => clearTimeout(timeout);
    }, [search]);

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus KK ini?')) {
            router.delete(route('rt.family-cards.destroy', id));
        }
    };

    return (
        <RtLayout header="Kartu Keluarga">
            <Head title="Kartu Keluarga - RT" />

            <div className="mb-6">
                <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-xl text-blue-600 dark:text-blue-400">
                            <CreditCard size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Data Kartu Keluarga</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Kelola KK di wilayah RT Anda.</p>
                        </div>
                    </div>
                    
                    <div className="flex gap-3 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-64">
                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-slate-400" />
                            </div>
                            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} 
                                className="block w-full rounded-lg border-0 py-2.5 pl-10 pr-3 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50" 
                                placeholder="Cari No. KK atau nama..."
                            />
                        </div>
                        <Link href={route('rt.family-cards.create')} className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold shadow-sm transition-colors whitespace-nowrap">
                            <Plus size={16} /> Tambah KK
                        </Link>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th className="py-3.5 pl-6 pr-3 text-left text-xs font-bold text-slate-500 uppercase">No. KK</th>
                                <th className="px-3 py-3.5 text-left text-xs font-bold text-slate-500 uppercase">Kepala Keluarga</th>
                                <th className="px-3 py-3.5 text-left text-xs font-bold text-slate-500 uppercase">Alamat</th>
                                <th className="px-3 py-3.5 text-left text-xs font-bold text-slate-500 uppercase">Status</th>
                                <th className="relative py-3.5 pl-3 pr-6 text-right"><span className="sr-only">Aksi</span></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {familyCards.data.length === 0 ? (
                                <tr><td colSpan="5" className="px-6 py-12 text-center text-sm text-slate-500">Belum ada data Kartu Keluarga.</td></tr>
                            ) : (
                                familyCards.data.map((kk) => (
                                    <tr key={kk.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="whitespace-nowrap py-4 pl-6 pr-3 font-mono text-sm font-bold text-slate-900 dark:text-white">{kk.no_kk}</td>
                                        <td className="whitespace-nowrap px-3 py-4">
                                            <div className="font-semibold text-slate-900 dark:text-white">{kk.kepala_keluarga?.nama_lengkap || '-'}</div>
                                            <div className="text-xs text-slate-500">{kk.kepala_keluarga?.nik || ''}</div>
                                        </td>
                                        <td className="px-3 py-4 text-sm text-slate-600 dark:text-slate-400 max-w-xs truncate">{kk.alamat}</td>
                                        <td className="whitespace-nowrap px-3 py-4">
                                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ring-1 ring-inset ${kk.status === 'aktif' ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' : 'bg-slate-50 text-slate-700 ring-slate-600/20'}`}>
                                                {kk.status}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium flex justify-end gap-2">
                                            <Link href={route('rt.family-cards.edit', kk.id)} className="text-blue-600 hover:text-blue-900 p-1.5 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30">
                                                <Edit size={16} />
                                            </Link>
                                            <button onClick={() => handleDelete(kk.id)} className="text-red-600 hover:text-red-900 p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/30">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                
                {familyCards.links && familyCards.links.length > 3 && (
                    <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex justify-center">
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                            {familyCards.links.map((link, i) => (
                                <Link key={i} href={link.url || '#'} className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${link.active ? 'z-10 bg-blue-600 text-white' : 'text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 hover:bg-slate-50'} ${i === 0 ? 'rounded-l-md' : ''} ${i === familyCards.links.length - 1 ? 'rounded-r-md' : ''}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                            ))}
                        </nav>
                    </div>
                )}
            </div>
        </RtLayout>
    );
}
