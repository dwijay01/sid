import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import RtLayout from '@/Layouts/RtLayout';
import { Store, Search, Plus, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { SEKTOR_USAHA, SEKTOR_USAHA_COLORS, UMKM_STATUS, UMKM_STATUS_COLORS, RENTANG_OMZET } from '@/Helpers/constants';

export default function Index({ umkm, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [sektorFilter, setSektorFilter] = useState(filters.sektor || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(route('rt.umkm.index'), { search, sektor: sektorFilter, status: statusFilter }, { preserveState: true });
        }, 400);
        return () => clearTimeout(timeout);
    }, [search, sektorFilter, statusFilter]);

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus data UMKM ini?')) {
            router.delete(route('rt.umkm.destroy', id));
        }
    };

    return (
        <RtLayout header="Pendataan UMKM">
            <Head title="UMKM - RT" />

            <div className="mb-6">
                <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-amber-100 dark:bg-amber-900/40 p-3 rounded-xl text-amber-600 dark:text-amber-400">
                                <Store size={24} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Data UMKM Warga</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Kelola pendataan usaha mikro, kecil, dan menengah di wilayah RT.</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                                    className="block w-full rounded-lg border-0 py-2.5 pl-10 pr-3 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50"
                                    placeholder="Cari usaha/pemilik..."
                                />
                            </div>
                            <select value={sektorFilter} onChange={(e) => setSektorFilter(e.target.value)} className="rounded-lg border-0 py-2.5 text-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white">
                                <option value="">Semua Sektor</option>
                                {Object.entries(SEKTOR_USAHA).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                            </select>
                            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border-0 py-2.5 text-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white">
                                <option value="">Semua Status</option>
                                {Object.entries(UMKM_STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                            </select>
                            <Link href={route('rt.umkm.create')} className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-bold hover:bg-amber-500 transition-colors shadow-sm whitespace-nowrap">
                                <Plus size={16} /> Tambah Usaha
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th className="py-3.5 pl-6 pr-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Usaha</th>
                                <th className="px-3 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Pemilik</th>
                                <th className="px-3 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Sektor</th>
                                <th className="px-3 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">NIB</th>
                                <th className="px-3 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Omzet</th>
                                <th className="px-3 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="py-3.5 pl-3 pr-6 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {umkm.data.length > 0 ? umkm.data.map((u) => (
                                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="whitespace-nowrap py-4 pl-6 pr-3">
                                        <div className="font-bold text-slate-900 dark:text-white text-sm">{u.nama_usaha}</div>
                                        {u.deskripsi && <div className="text-xs text-slate-500 dark:text-slate-400 max-w-[200px] truncate">{u.deskripsi}</div>}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4">
                                        <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">{u.resident?.nama_lengkap || '-'}</div>
                                        <div className="text-xs text-slate-500 font-mono">{u.resident?.nik || '-'}</div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4">
                                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-[10px] font-bold ring-1 ring-inset ${SEKTOR_USAHA_COLORS[u.sektor_usaha] || ''}`}>
                                            {SEKTOR_USAHA[u.sektor_usaha] || u.sektor_usaha}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                                        {u.memiliki_nib ? (
                                            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-xs">
                                                <CheckCircle size={14} /> Punya
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 text-red-500 dark:text-red-400 font-semibold text-xs">
                                                <XCircle size={14} /> Belum
                                            </span>
                                        )}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-xs text-slate-600 dark:text-slate-400">
                                        {RENTANG_OMZET[u.rentang_omzet] || '-'}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4">
                                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-[10px] font-bold ring-1 ring-inset ${UMKM_STATUS_COLORS[u.status] || ''}`}>
                                            {UMKM_STATUS[u.status] || u.status}
                                        </span>
                                    </td>
                                    <td className="whitespace-nowrap py-4 pl-3 pr-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={route('rt.umkm.edit', u.id)} className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors" title="Edit">
                                                <Edit2 size={16} />
                                            </Link>
                                            <button onClick={() => handleDelete(u.id)} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors" title="Hapus">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="7" className="px-6 py-12 text-center text-sm text-slate-500 dark:text-slate-400">Belum ada data UMKM. Klik "Tambah Usaha" untuk mulai pendataan.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {umkm.links && umkm.links.length > 3 && (
                    <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex items-center justify-center">
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                            {umkm.links.map((link, i) => (
                                <a key={i} href={link.url || '#'} className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${link.active ? 'z-10 bg-blue-600 text-white' : 'text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'} ${i === 0 ? 'rounded-l-md' : ''} ${i === umkm.links.length - 1 ? 'rounded-r-md' : ''}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                            ))}
                        </nav>
                    </div>
                )}
            </div>
        </RtLayout>
    );
}
