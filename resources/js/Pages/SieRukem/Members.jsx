import React, { useState, useEffect } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import SieRukemLayout from '@/Layouts/SieRukemLayout';
import { Heart, Search, Printer, Edit2, Trash2, UserCheck, UserX } from 'lucide-react';
import { RUKEM_STATUS, RUKEM_STATUS_COLORS } from '@/Helpers/constants';

export default function Members({ members, filters = {}, filterStats = {}, rts = [] }) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [rtFilter, setRtFilter] = useState(filters.rt || '');

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.get(route('sie-rukem.members'), { search, status: statusFilter, rt: rtFilter }, { preserveState: true });
        }, 400);
        return () => clearTimeout(timeout);
    }, [search, statusFilter, rtFilter]);

    const handlePrint = () => window.print();

    return (
        <SieRukemLayout header="Data Anggota Rukun Kematian">
            <Head title="Anggota Rukem" />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-6 print:hidden">
                <div className="relative overflow-hidden rounded-xl bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 hover:shadow-md transition-all border-l-4 border-emerald-500">
                    <dt className="flex items-center gap-x-3">
                        <div className="p-2.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
                            <Heart size={20} />
                        </div>
                        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Rukem Aktif</div>
                    </dt>
                    <dd className="mt-4 text-3xl font-black text-slate-900 dark:text-white">{filterStats.aktif?.toLocaleString('id-ID') || 0}</dd>
                </div>
                <div className="relative overflow-hidden rounded-xl bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 hover:shadow-md transition-all border-l-4 border-violet-500">
                    <dt className="flex items-center gap-x-3">
                        <div className="p-2.5 bg-violet-100 dark:bg-violet-900/30 rounded-lg text-violet-600 dark:text-violet-400">
                            <Heart size={20} />
                        </div>
                        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Warga Khusus (Kurang Mampu)</div>
                    </dt>
                    <dd className="mt-4 text-3xl font-black text-slate-900 dark:text-white">{filterStats.khusus?.toLocaleString('id-ID') || 0}</dd>
                </div>
                <div className="relative overflow-hidden rounded-xl bg-white dark:bg-slate-800 p-6 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 hover:shadow-md transition-all border-l-4 border-amber-500">
                    <dt className="flex items-center gap-x-3">
                        <div className="p-2.5 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-400">
                            <Heart size={20} />
                        </div>
                        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Rukem Nonaktif</div>
                    </dt>
                    <dd className="mt-4 text-3xl font-black text-slate-900 dark:text-white">{filterStats.nonaktif?.toLocaleString('id-ID') || 0}</dd>
                </div>
            </div>

            <div className="mb-6">
                <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4 hidden sm:flex">
                            <div className="bg-violet-100 dark:bg-violet-900/40 p-3 rounded-xl text-violet-600 dark:text-violet-400"><Heart size={24} /></div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Daftar Anggota Rukem</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Data lengkap seluruh anggota Rukun Kematian.</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3 w-full sm:w-auto print:hidden">
                            <div className="relative flex-grow sm:flex-grow-0 min-w-[200px]">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                                    className="block w-full rounded-lg border-0 py-2.5 pl-10 pr-3 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-violet-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50"
                                    placeholder="Cari NIK, Nama, atau KK..."
                                />
                            </div>
                            <select value={rtFilter} onChange={(e) => setRtFilter(e.target.value)} className="rounded-lg border-0 py-2.5 text-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white flex-grow sm:flex-grow-0">
                                <option value="">Semua RT</option>
                                {rts.map(rt => <option key={rt} value={rt}>RT {String(rt).padStart(2, '0')}</option>)}
                            </select>
                            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-lg border-0 py-2.5 text-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white flex-grow sm:flex-grow-0">
                                <option value="">Semua Status</option>
                                {Object.entries(RUKEM_STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                            </select>
                            <button onClick={handlePrint} className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-500 transition-colors shadow-sm flex-grow sm:flex-grow-0">
                                <Printer size={16} /> Cetak Data
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="hidden print:block p-6 text-center border-b border-slate-200 dark:border-slate-700">
                    <h2 className="font-bold text-xl uppercase text-slate-900 dark:text-white">Daftar Anggota Rukun Kematian</h2>
                    <p className="text-sm mt-1">
                        {rtFilter ? `RT ${String(rtFilter).padStart(2, '0')}` : 'Semua RT'} • {statusFilter ? RUKEM_STATUS[statusFilter] : 'Semua Status'} 
                    </p>
                    <div className="mt-4 flex justify-center gap-6 text-sm font-bold">
                        <span className="text-emerald-600">Aktif: {filterStats.aktif}</span>
                        <span className="text-violet-600">Khusus: {filterStats.khusus}</span>
                        <span className="text-amber-600">Nonaktif: {filterStats.nonaktif}</span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th className="py-3.5 pl-6 pr-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">No</th>
                                <th className="px-3 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">No. Anggota</th>
                                <th className="px-3 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Kepala Keluarga / KK</th>
                                <th className="px-3 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">RT/RW</th>
                                <th className="px-3 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Tgl Gabung</th>
                                <th className="px-3 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-3 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">Ket.</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {members.data.length > 0 ? members.data.map((m, index) => (
                                <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm text-slate-600 dark:text-slate-400">{index + 1}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm font-mono font-bold text-violet-700 dark:text-violet-400">{m.nomor_anggota}</td>
                                    <td className="px-3 py-4 align-top">
                                        <div className="font-bold text-slate-900 dark:text-white text-sm mb-1">{m.family_card?.kepala_keluarga?.nama_lengkap || '-'}</div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mb-2">KK: {m.family_card?.no_kk || '-'}</div>
                                        {m.family_card?.anggota_keluarga && m.family_card.anggota_keluarga.length > 0 && (
                                            <div className="text-xs text-slate-600 dark:text-slate-400">
                                                <div className="font-semibold mb-1">Anggota Keluarga:</div>
                                                <ul className="list-disc pl-4 space-y-0.5">
                                                    {m.family_card.anggota_keluarga.filter(r => r.id !== m.family_card.kepala_keluarga_id).map((r) => (
                                                        <li key={r.id}>
                                                            {r.nama_lengkap} <span className="text-slate-400 capitalize">({r.hubungan_keluarga ? r.hubungan_keluarga.replace('_', ' ') : '-'})</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-600 dark:text-slate-400">
                                        {m.family_card?.wilayah ? `RT ${m.family_card.wilayah.rt} / RW ${m.family_card.wilayah.rw}` : '-'}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-600 dark:text-slate-400 text-xs">
                                        {new Date(m.tanggal_gabung).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4">
                                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-[10px] font-bold ring-1 ring-inset ${RUKEM_STATUS_COLORS[m.status_keanggotaan] || ''}`}>
                                            {RUKEM_STATUS[m.status_keanggotaan] || m.status_keanggotaan}
                                        </span>
                                    </td>
                                    <td className="px-3 py-4 text-sm text-slate-600 dark:text-slate-400 max-w-[150px] truncate">{m.keterangan || '-'}</td>
                                </tr>
                            )) : (
                                <tr><td colSpan="7" className="px-6 py-12 text-center text-sm text-slate-500 dark:text-slate-400">Belum ada anggota Rukun Kematian terdaftar.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {members.links && members.links.length > 3 && (
                    <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex items-center justify-center print:hidden">
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                            {members.links.map((link, i) => (
                                <a key={i} href={link.url || '#'} className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${link.active ? 'z-10 bg-violet-600 text-white' : 'text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'} ${i === 0 ? 'rounded-l-md' : ''} ${i === members.links.length - 1 ? 'rounded-r-md' : ''}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                            ))}
                        </nav>
                    </div>
                )}
            </div>
        </SieRukemLayout>
    );
}
