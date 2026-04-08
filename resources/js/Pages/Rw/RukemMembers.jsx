import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import RwLayout from '@/Layouts/RwLayout';
import { Heart, Search } from 'lucide-react';
import { RUKEM_STATUS, RUKEM_STATUS_COLORS } from '@/Helpers/constants';

export default function RukemMembers({ members, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(route('rw.rukem'), { search, status: statusFilter }, { preserveState: true });
        }, 400);
        return () => clearTimeout(timeout);
    }, [search, statusFilter]);

    return (
        <RwLayout header="Data Rukun Kematian">
            <Head title="Data Rukem - RW" />

            <div className="mb-6">
                <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-rose-100 dark:bg-rose-900/40 p-3 rounded-xl text-rose-600 dark:text-rose-400">
                                <Heart size={24} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Anggota Rukun Kematian</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Data warga yang terdaftar sebagai anggota Rukun Kematian di wilayah RW.</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                                    className="block w-full rounded-lg border-0 py-2 pl-10 pr-3 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-teal-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50"
                                    placeholder="Cari anggota..."
                                />
                            </div>
                            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border-0 py-2 text-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white">
                                <option value="">Semua Status</option>
                                {Object.entries(RUKEM_STATUS).map(([k, v]) => (
                                    <option key={k} value={k}>{v}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th className="py-3.5 pl-6 pr-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">No. Anggota</th>
                                <th className="px-3 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Nama / NIK</th>
                                <th className="px-3 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">RT/RW</th>
                                <th className="px-3 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Tgl Gabung</th>
                                <th className="px-3 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {members.data.length > 0 ? members.data.map((m) => (
                                <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-mono font-bold text-teal-700 dark:text-teal-400">{m.nomor_anggota}</td>
                                    <td className="whitespace-nowrap px-3 py-4">
                                        <div className="font-bold text-slate-900 dark:text-white text-sm">{m.resident?.nama_lengkap}</div>
                                        <div className="text-xs text-slate-500 font-mono">{m.resident?.nik}</div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-600 dark:text-slate-400">
                                        {m.resident?.family_card?.wilayah ? `RT ${m.resident.family_card.wilayah.rt} / RW ${m.resident.family_card.wilayah.rw}` : '-'}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-600 dark:text-slate-400">{new Date(m.tanggal_gabung).toLocaleDateString('id-ID')}</td>
                                    <td className="whitespace-nowrap px-3 py-4">
                                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ring-1 ring-inset ${RUKEM_STATUS_COLORS[m.status_keanggotaan] || ''}`}>
                                            {RUKEM_STATUS[m.status_keanggotaan] || m.status_keanggotaan}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="5" className="px-6 py-12 text-center text-sm text-slate-500">Belum ada anggota Rukun Kematian terdaftar.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {members.links && members.links.length > 3 && (
                    <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex items-center justify-center">
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                            {members.links.map((link, i) => (
                                <a key={i} href={link.url || '#'} className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${link.active ? 'z-10 bg-teal-600 text-white' : 'text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'} ${i === 0 ? 'rounded-l-md' : ''} ${i === members.links.length - 1 ? 'rounded-r-md' : ''}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                            ))}
                        </nav>
                    </div>
                )}
            </div>
        </RwLayout>
    );
}
