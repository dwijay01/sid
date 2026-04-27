import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import RwLayout from '@/Layouts/RwLayout';
import { FileBarChart, Printer, Users, Heart, ArrowRightLeft, ArrowDownToLine, Skull, Baby, FileSpreadsheet, Store } from 'lucide-react';

const reportTypes = [
    { key: 'penduduk', label: 'Data Penduduk', icon: Users, color: 'emerald' },
    { key: 'rukem', label: 'Rukun Kematian', icon: Heart, color: 'rose' },
    { key: 'umkm', label: 'Data UMKM', icon: Store, color: 'purple' },
    { key: 'pindah', label: 'Warga Pindah', icon: ArrowRightLeft, color: 'amber' },
    { key: 'masuk', label: 'Warga Masuk', icon: ArrowDownToLine, color: 'blue' },
    { key: 'meninggal', label: 'Warga Meninggal', icon: Skull, color: 'red' },
    { key: 'lahir', label: 'Data Kelahiran', icon: Baby, color: 'pink' },
];

export default function Reports({ data, type, wilayahList = [], filters = {} }) {
    const [activeType, setActiveType] = useState(type || 'penduduk');
    const [selectedRt, setSelectedRt] = useState(filters.rt || '');

    const handleSwitch = (newType) => {
        setActiveType(newType);
        router.get(route('rw.reports'), { type: newType, rt: selectedRt }, { preserveState: true });
    };

    const handleRtChange = (e) => {
        const rt = e.target.value;
        setSelectedRt(rt);
        router.get(route('rw.reports'), { type: activeType, rt }, { preserveState: true });
    };

    const handlePrint = () => {
        window.print();
    };

    const handleExportExcel = () => {
        window.location.href = route('rw.reports', { type: activeType, rt: selectedRt, export: 'excel' });
    };

    const activeReport = reportTypes.find(r => r.key === activeType);

    return (
        <RwLayout header="Report & Cetak">
            <Head title="Report - RW" />

            <div className="mb-6">
                <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-xl text-blue-600 dark:text-blue-400"><FileBarChart size={24} /></div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Report & Cetak Data</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Pilih jenis report untuk ditampilkan dan dicetak.</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                            <select
                                value={selectedRt}
                                onChange={handleRtChange}
                                className="w-full sm:w-auto border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-sm focus:ring-teal-500 focus:border-teal-500 print:hidden"
                            >
                                <option value="">Semua RT</option>
                                {wilayahList.map((w) => (
                                    <option key={w.id} value={w.rt}>RT {w.rt}</option>
                                ))}
                            </select>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <button onClick={handleExportExcel} className="flex-1 sm:flex-none justify-center inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-bold shadow-sm transition-colors print:hidden">
                                    <FileSpreadsheet size={16} /> Export
                                </button>
                                <button onClick={handlePrint} className="flex-1 sm:flex-none justify-center inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-sm font-bold shadow-sm transition-colors print:hidden">
                                    <Printer size={16} /> Cetak
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2 print:hidden">
                        {reportTypes.map((rt) => (
                            <button key={rt.key} onClick={() => handleSwitch(rt.key)}
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                    activeType === rt.key
                                        ? 'bg-teal-600 text-white shadow-sm'
                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                }`}
                            >
                                <rt.icon size={16} />
                                {rt.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Data Table */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden" id="printArea">
                <div className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-6 py-4">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        Laporan: {activeReport?.label} ({data.length} data)
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    {activeType === 'penduduk' && (
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 text-sm">
                            <thead className="bg-slate-50 dark:bg-slate-800/50">
                                <tr>
                                    <th className="py-3 pl-6 pr-3 text-left text-xs font-bold text-slate-500 uppercase">No</th>
                                    <th className="px-3 py-3 text-left text-xs font-bold text-slate-500 uppercase">NIK</th>
                                    <th className="px-3 py-3 text-left text-xs font-bold text-slate-500 uppercase">Nama</th>
                                    <th className="px-3 py-3 text-left text-xs font-bold text-slate-500 uppercase">L/P</th>
                                    <th className="px-3 py-3 text-left text-xs font-bold text-slate-500 uppercase">TTL</th>
                                    <th className="px-3 py-3 text-left text-xs font-bold text-slate-500 uppercase">RT/RW</th>
                                    <th className="px-3 py-3 text-left text-xs font-bold text-slate-500 uppercase">Agama</th>
                                    <th className="px-3 py-3 text-left text-xs font-bold text-slate-500 uppercase">Pekerjaan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {data.map((r, i) => (
                                    <tr key={r.id}><td className="py-2 pl-6 pr-3">{i + 1}</td><td className="px-3 py-2 font-mono">{r.nik}</td><td className="px-3 py-2 font-semibold">{r.nama_lengkap}</td><td className="px-3 py-2">{r.jenis_kelamin}</td><td className="px-3 py-2">{r.tempat_lahir}, {new Date(r.tanggal_lahir).toLocaleDateString('id-ID')}</td><td className="px-3 py-2">{r.family_card?.wilayah ? `RT ${r.family_card.wilayah.rt}/RW ${r.family_card.wilayah.rw}` : '-'}</td><td className="px-3 py-2">{r.agama}</td><td className="px-3 py-2">{r.pekerjaan || '-'}</td></tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {activeType === 'rukem' && (
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 text-sm">
                            <thead className="bg-slate-50 dark:bg-slate-800/50">
                                <tr>
                                    <th className="py-3 pl-6 pr-3 text-left text-xs font-bold text-slate-500 uppercase">No</th>
                                    <th className="px-3 py-3 text-left text-xs font-bold text-slate-500 uppercase">No. Anggota</th>
                                    <th className="px-3 py-3 text-left text-xs font-bold text-slate-500 uppercase">Kepala Keluarga / KK</th>
                                    <th className="px-3 py-3 text-left text-xs font-bold text-slate-500 uppercase">RT/RW</th>
                                    <th className="px-3 py-3 text-left text-xs font-bold text-slate-500 uppercase">Tgl Gabung</th>
                                    <th className="px-3 py-3 text-left text-xs font-bold text-slate-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {data.map((m, i) => (
                                    <tr key={m.id}>
                                        <td className="py-2 pl-6 pr-3">{i + 1}</td>
                                        <td className="px-3 py-2 font-mono">{m.nomor_anggota}</td>
                                        <td className="px-3 py-2">
                                            <div className="font-semibold">{m.family_card?.kepala_keluarga?.nama_lengkap || '-'}</div>
                                            <div className="text-xs text-slate-500 font-mono">KK: {m.family_card?.no_kk || '-'}</div>
                                        </td>
                                        <td className="px-3 py-2">
                                            {m.family_card?.wilayah ? `RT ${m.family_card.wilayah.rt}/RW ${m.family_card.wilayah.rw}` : '-'}
                                        </td>
                                        <td className="px-3 py-2">{new Date(m.tanggal_gabung).toLocaleDateString('id-ID')}</td>
                                        <td className="px-3 py-2 capitalize">{m.status_keanggotaan}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {['pindah', 'masuk', 'meninggal', 'lahir'].includes(activeType) && (
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 text-sm">
                            <thead className="bg-slate-50 dark:bg-slate-800/50">
                                <tr>
                                    <th className="py-3 pl-6 pr-3 text-left text-xs font-bold text-slate-500 uppercase">No</th>
                                    <th className="px-3 py-3 text-left text-xs font-bold text-slate-500 uppercase">Nama / NIK</th>
                                    <th className="px-3 py-3 text-left text-xs font-bold text-slate-500 uppercase">Tgl Mutasi</th>
                                    <th className="px-3 py-3 text-left text-xs font-bold text-slate-500 uppercase">Asal/Tujuan</th>
                                    <th className="px-3 py-3 text-left text-xs font-bold text-slate-500 uppercase">Keterangan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {data.map((m, i) => (
                                    <tr key={m.id}><td className="py-2 pl-6 pr-3">{i + 1}</td><td className="px-3 py-2"><div className="font-semibold">{m.resident?.nama_lengkap}</div><div className="text-xs text-slate-500 font-mono">{m.resident?.nik}</div></td><td className="px-3 py-2">{new Date(m.tanggal_mutasi).toLocaleDateString('id-ID')}</td><td className="px-3 py-2">{m.asal_tujuan || '-'}</td><td className="px-3 py-2">{m.keterangan || '-'}</td></tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {activeType === 'umkm' && (
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 text-sm">
                            <thead className="bg-slate-50 dark:bg-slate-800/50">
                                <tr>
                                    <th className="py-3 pl-6 pr-3 text-left text-xs font-bold text-slate-500 uppercase">No</th>
                                    <th className="px-3 py-3 text-left text-xs font-bold text-slate-500 uppercase">Nama Usaha / Bidang</th>
                                    <th className="px-3 py-3 text-left text-xs font-bold text-slate-500 uppercase">Pemilik (Warga)</th>
                                    <th className="px-3 py-3 text-left text-xs font-bold text-slate-500 uppercase">RT/RW</th>
                                    <th className="px-3 py-3 text-left text-xs font-bold text-slate-500 uppercase">Omzet</th>
                                    <th className="px-3 py-3 text-left text-xs font-bold text-slate-500 uppercase">Tenaga Kerja</th>
                                    <th className="px-3 py-3 text-left text-xs font-bold text-slate-500 uppercase">Tahun Berdiri</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {data.map((u, i) => (
                                    <tr key={u.id}>
                                        <td className="py-2 pl-6 pr-3">{i + 1}</td>
                                        <td className="px-3 py-2">
                                            <div className="font-semibold text-purple-700 dark:text-purple-400">{u.nama_usaha}</div>
                                            <div className="text-xs text-slate-500 capitalize">{u.sektor_usaha}</div>
                                        </td>
                                        <td className="px-3 py-2">{u.resident?.nama_lengkap}</td>
                                        <td className="px-3 py-2">{u.resident?.familyCard?.wilayah ? `RT ${u.resident.familyCard.wilayah.rt}/RW ${u.resident.familyCard.wilayah.rw}` : '-'}</td>
                                        <td className="px-3 py-2">{u.rentang_omzet}</td>
                                        <td className="px-3 py-2">{u.jumlah_karyawan} org</td>
                                        <td className="px-3 py-2">{u.tahun_berdiri}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {data.length === 0 && (
                        <div className="px-6 py-16 text-center text-slate-500 dark:text-slate-400">Tidak ada data untuk laporan ini.</div>
                    )}
                </div>
            </div>
        </RwLayout>
    );
}
