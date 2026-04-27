import React, { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import RtLayout from '@/Layouts/RtLayout';
import { Users, Search, Plus, Edit, Upload, AlertCircle, CheckCircle2, Heart, ArrowRightLeft } from 'lucide-react';
import { GENDER_LABELS, RESIDENT_STATUS, RESIDENT_STATUS_COLORS, RUKEM_STATUS, RUKEM_STATUS_COLORS } from '@/Helpers/constants';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Index({ residents, filters = {}, rukemStats = {} }) {
    const { flash, import_results } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [sortBy, setSortBy] = useState(typeof filters?.sort === 'string' ? filters.sort : 'name');
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [importFile, setImportFile] = useState(null);
    const [duplicateAction, setDuplicateAction] = useState('skip');
    const [isImporting, setIsImporting] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);

    useEffect(() => {
        const isChanged = search !== (filters.search || '') || 
                          sortBy !== (filters.sort || '');

        if (isChanged) {
            const timeout = setTimeout(() => {
                router.get(route('rt.residents'), { search, sort: sortBy }, { preserveState: true });
            }, 400);
            return () => clearTimeout(timeout);
        }
    }, [search, sortBy]);

    useEffect(() => {
        if (import_results) {
            setShowResultModal(true);
        }
    }, [import_results]);

    const handleImport = (e) => {
        e.preventDefault();
        if (!importFile) return;

        setIsImporting(true);
        router.post(route('rt.residents.import'), {
            file: importFile,
            duplicate_action: duplicateAction
        }, {
            onSuccess: () => {
                setIsImportModalOpen(false);
                setImportFile(null);
                setIsImporting(false);
            },
            onError: () => {
                setIsImporting(false);
            }
        });
    };

    return (
        <RtLayout header="Daftar Warga RT">
            <Head title="Daftar Warga - RT" />

            <div className="mb-6">
                <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-xl text-blue-600 dark:text-blue-400"><Users size={24} /></div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Data Warga RT Anda</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Hanya menampilkan warga yang terdaftar di wilayah RT Anda.</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <div className="flex gap-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                                        className="block w-full rounded-lg border-0 py-2 pl-10 pr-3 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50"
                                        placeholder="Cari NIK/Nama/Alamat..."
                                    />
                                </div>
                                <select 
                                    value={sortBy} 
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="rounded-lg border-0 py-2 text-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white"
                                >
                                    <option value="name">Urutan: Nama</option>
                                    <option value="kk">Urutan: Kartu Keluarga</option>
                                </select>
                            </div>
                            <button 
                                onClick={() => setIsImportModalOpen(true)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold hover:bg-emerald-500 transition-colors shadow-sm"
                            >
                                <Upload size={16} /> Import Excel
                            </button>
                            <Link href={route('rt.residents.create')} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-500 transition-colors shadow-sm">
                                <Plus size={16} /> Tambah
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {flash?.success && !import_results && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-center gap-3">
                    <CheckCircle2 size={20} />
                    {flash.success}
                </div>
            )}

            {flash?.error && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-3">
                    <AlertCircle size={20} />
                    {flash.error}
                </div>
            )}

            {rukemStats && Object.keys(rukemStats).length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 flex items-center gap-4 shadow-sm">
                        <div className="bg-emerald-100 dark:bg-emerald-900/40 p-3 rounded-lg text-emerald-600 dark:text-emerald-400">
                            <Heart size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Rukem Aktif</p>
                            <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{rukemStats.aktif || 0}</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 flex items-center gap-4 shadow-sm">
                        <div className="bg-purple-100 dark:bg-purple-900/40 p-3 rounded-lg text-purple-600 dark:text-purple-400">
                            <Heart size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Warga Khusus (Kurang Mampu)</p>
                            <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{rukemStats.khusus || 0}</p>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 flex items-center gap-4 shadow-sm">
                        <div className="bg-amber-100 dark:bg-amber-900/40 p-3 rounded-lg text-amber-600 dark:text-amber-400">
                            <Heart size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Rukem Nonaktif</p>
                            <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{rukemStats.nonaktif || 0}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th className="py-3.5 pl-6 pr-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Nama / NIK</th>
                                <th className="px-3 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">No. KK</th>
                                <th className="px-3 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">JK / Usia</th>
                                <th className="px-3 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Hub. Keluarga</th>
                                <th className="px-3 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-3 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Alamat</th>
                                <th className="py-3.5 pl-3 pr-6 text-right text-xs font-bold text-slate-500 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {residents.data.length > 0 ? residents.data.map((r) => (
                                <tr key={r.id} className={`${r.needs_update ? 'bg-amber-50/50 dark:bg-amber-900/10' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'} transition-colors`}>
                                    <td className="whitespace-nowrap py-4 pl-6 pr-3">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold mr-3">{r.nama_lengkap.charAt(0)}</div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <div className="font-bold text-slate-900 dark:text-white">{r.nama_lengkap}</div>
                                                    {r.needs_update && (
                                                        <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                                                            Needs Update
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="text-xs text-slate-500 font-mono">{r.nik}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-600 dark:text-slate-400 font-mono">{r.family_card?.no_kk || '-'}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-600 dark:text-slate-400">
                                        {GENDER_LABELS[r.jenis_kelamin]} / {r.tanggal_lahir ? `${new Date().getFullYear() - new Date(r.tanggal_lahir).getFullYear()} thn` : 'N/A'}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-600 dark:text-slate-400 capitalize">
                                        {r.hubungan_keluarga ? r.hubungan_keluarga.replace('_', ' ') : '-'}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4">
                                        <div className="flex flex-col gap-1">
                                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ring-1 ring-inset w-fit ${RESIDENT_STATUS_COLORS[r.status_penduduk] || ''}`}>
                                                {RESIDENT_STATUS[r.status_penduduk] || r.status_penduduk}
                                            </span>
                                            {r.family_card?.rukem_member && (
                                                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ring-1 ring-inset w-fit ${RUKEM_STATUS_COLORS[r.family_card.rukem_member.status_keanggotaan] || ''}`}>
                                                    Rukem: {RUKEM_STATUS[r.family_card.rukem_member.status_keanggotaan] || r.family_card.rukem_member.status_keanggotaan}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-3 py-4 text-sm text-slate-600 dark:text-slate-400 max-w-xs truncate">
                                        {r.alamat_sekarang || r.family_card?.alamat || '-'}
                                    </td>
                                    <td className="whitespace-nowrap py-4 pl-3 pr-6 text-right">
                                        <div className="flex justify-end gap-3 items-center">
                                            <Link href={route('rt.residents.edit', r.id)} className="text-blue-600 dark:text-blue-400 hover:text-blue-900 inline-flex items-center gap-1 text-sm font-semibold">
                                                <Edit size={14} /> Edit
                                            </Link>
                                            <div className="relative group">
                                                <button className="text-amber-600 dark:text-amber-400 hover:text-amber-900 inline-flex items-center gap-1 text-sm font-semibold cursor-pointer">
                                                    <ArrowRightLeft size={14} /> Mutasi
                                                </button>
                                                <div className="absolute right-0 top-full mt-1 w-36 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 flex flex-col py-1">
                                                    <Link href={route('rt.mutations.move-out', { resident_id: r.id })} className="px-3 py-2 text-sm text-left hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300">Pindah Keluar</Link>
                                                    <Link href={route('rt.mutations.death', { resident_id: r.id })} className="px-3 py-2 text-sm text-left hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300">Meninggal</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="5" className="px-6 py-12 text-center text-sm text-slate-500">Tidak ada data warga.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {residents.links && residents.links.length > 3 && (
                    <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex items-center justify-center">
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                            {residents.links.map((link, i) => (
                                <a key={i} href={link.url || '#'} className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${link.active ? 'z-10 bg-blue-600 text-white' : 'text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 hover:bg-slate-50'} ${i === 0 ? 'rounded-l-md' : ''} ${i === residents.links.length - 1 ? 'rounded-r-md' : ''}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                            ))}
                        </nav>
                    </div>
                )}
            </div>

            {/* Import Modal */}
            <Modal show={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} maxWidth="md">
                <form onSubmit={handleImport} className="p-6">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Import Data Warga dari Excel</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                        Pilih file Excel format data penduduk. Sistem akan otomatis mengambil data dari sheet yang sesuai dengan RT Anda.
                    </p>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">File Excel (.xlsx, .xls)</label>
                        <input 
                            type="file" 
                            accept=".xlsx, .xls, .csv"
                            onChange={(e) => setImportFile(e.target.files[0])}
                            className="block w-full text-sm text-slate-500 dark:text-slate-400
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100
                                dark:file:bg-slate-700 dark:file:text-slate-300"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Jika NIK sudah ada:</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="duplicate_action" 
                                    value="skip" 
                                    checked={duplicateAction === 'skip'}
                                    onChange={(e) => setDuplicateAction(e.target.value)}
                                    className="text-blue-600 focus:ring-blue-500 border-slate-300 dark:bg-slate-700 dark:border-slate-600"
                                />
                                <span className="text-sm text-slate-600 dark:text-slate-400">Lewati (Skip)</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="duplicate_action" 
                                    value="update" 
                                    checked={duplicateAction === 'update'}
                                    onChange={(e) => setDuplicateAction(e.target.value)}
                                    className="text-blue-600 focus:ring-blue-500 border-slate-300 dark:bg-slate-700 dark:border-slate-600"
                                />
                                <span className="text-sm text-slate-600 dark:text-slate-400">Update Data</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <SecondaryButton onClick={() => setIsImportModalOpen(false)}>Batal</SecondaryButton>
                        <PrimaryButton 
                            type="submit" 
                            disabled={!importFile || isImporting}
                            className={isImporting ? 'opacity-50 cursor-not-allowed' : ''}
                        >
                            {isImporting ? 'Mengimpor...' : 'Mulai Import'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Result Modal */}
            <Modal show={showResultModal} onClose={() => setShowResultModal(false)} maxWidth="lg">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 size={24} />
                        </div>
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Hasil Import Berhasil</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Berhasil</div>
                            <div className="text-2xl font-bold text-emerald-600">{import_results?.success_count || 0}</div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Dilewati (Duplikat)</div>
                            <div className="text-2xl font-bold text-amber-600">{import_results?.skipped?.length || 0}</div>
                        </div>
                    </div>

                    {import_results?.skipped?.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                                <AlertCircle size={16} /> Data yang dilewati:
                            </h3>
                            <div className="max-h-48 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                                <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                                    {import_results.skipped.map((item, idx) => (
                                        <li key={idx} className="p-3">
                                            <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{item.nama}</div>
                                            <div className="text-xs text-slate-500 font-mono">{item.nik}</div>
                                            <div className="text-xs text-rose-500 mt-1">{item.reason}</div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end">
                        <PrimaryButton onClick={() => setShowResultModal(false)}>Tutup</PrimaryButton>
                    </div>
                </div>
            </Modal>
        </RtLayout>
    );
}
