import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import RwLayout from '@/Layouts/RwLayout';
import { CreditCard, Search, Users, MapPin } from 'lucide-react';

export default function FamilyCards({ familyCards, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');

    useEffect(() => {
        const isChanged = search !== (filters.search || '');
        if (isChanged) {
            const timeout = setTimeout(() => {
                router.get(route('rw.family-cards'), { search }, { preserveState: true });
            }, 400);
            return () => clearTimeout(timeout);
        }
    }, [search]);

    return (
        <RwLayout header="Data Kartu Keluarga">
            <Head title="Data KK - RW" />

            <div className="mb-6">
                <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-teal-100 dark:bg-teal-900/40 p-3 rounded-xl text-teal-600 dark:text-teal-400">
                                <CreditCard size={24} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Data Kartu Keluarga Wilayah RW</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Monitoring seluruh KK di semua RT dalam wilayah RW Anda.</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input 
                                    type="text" 
                                    value={search} 
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="block w-full rounded-lg border-0 py-2 pl-10 pr-3 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-teal-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50"
                                    placeholder="Cari No. KK/Kepala Keluarga..."
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th className="py-3.5 pl-6 pr-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">No. KK / Kepala Keluarga</th>
                                <th className="px-3 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">RT/RW</th>
                                <th className="px-3 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Anggota</th>
                                <th className="px-3 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Alamat</th>
                                <th className="px-3 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {familyCards.data.length > 0 ? familyCards.data.map((kk) => (
                                <tr key={kk.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="whitespace-nowrap py-4 pl-6 pr-3">
                                        <div className="font-mono text-sm font-bold text-slate-900 dark:text-white">{kk.no_kk}</div>
                                        <div className="font-semibold text-slate-700 dark:text-slate-300 text-xs mt-0.5">{kk.kepala_keluarga?.nama_lengkap || '-'}</div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-600 dark:text-slate-400">
                                        <div className="flex items-center gap-1.5">
                                            <MapPin size={14} className="text-teal-500" />
                                            RT {kk.wilayah?.rt} / RW {kk.wilayah?.rw}
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-center">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 font-bold text-xs border border-teal-100 dark:border-teal-800">
                                            <Users size={12} />
                                            {kk.anggota_keluarga_count || 0}
                                        </span>
                                    </td>
                                    <td className="px-3 py-4 text-sm text-slate-600 dark:text-slate-400">
                                        <div className="max-w-xs truncate" title={kk.alamat}>{kk.alamat}</div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4">
                                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-[10px] font-bold ring-1 ring-inset ${kk.status === 'aktif' ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' : 'bg-slate-50 text-slate-700 ring-slate-600/20'}`}>
                                            {kk.status.toUpperCase()}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="5" className="px-6 py-12 text-center text-sm text-slate-500">Tidak ada data Kartu Keluarga.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {familyCards.links && familyCards.links.length > 3 && (
                    <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex items-center justify-center">
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                            {familyCards.links.map((link, i) => (
                                <Link 
                                    key={i} 
                                    href={link.url || '#'} 
                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${link.active ? 'z-10 bg-teal-600 text-white' : 'text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'} ${i === 0 ? 'rounded-l-md' : ''} ${i === familyCards.links.length - 1 ? 'rounded-r-md' : ''}`} 
                                    dangerouslySetInnerHTML={{ __html: link.label }} 
                                />
                            ))}
                        </nav>
                    </div>
                )}
            </div>
        </RwLayout>
    );
}
