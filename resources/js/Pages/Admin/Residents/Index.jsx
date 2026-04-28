import React, { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Search, Plus, MoreVertical, Edit2, Trash2, Eye, Download, Upload, CheckCircle2, AlertCircle, Heart } from 'lucide-react';
import { GENDER_LABELS, RESIDENT_STATUS, RESIDENT_STATUS_COLORS, RUKEM_STATUS, RUKEM_STATUS_COLORS, KATEGORI_AKTIF, KATEGORI_AKTIF_COLORS } from '@/Helpers/constants';
import Dropdown from '@/Components/Dropdown';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Index({ residents, filters, rukemStats = {} }) {
    const { flash, import_results } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [sortBy, setSortBy] = useState(typeof filters?.sort === 'string' ? filters.sort : 'name');
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [importFile, setImportFile] = useState(null);
    const [duplicateAction, setDuplicateAction] = useState('skip');
    const [isImporting, setIsImporting] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);

    useEffect(() => {
        if (import_results) {
            setShowResultModal(true);
        }
    }, [import_results]);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.residents.index'), { search, sort: sortBy }, { preserveState: true });
    };

    const handleSortChange = (newSort) => {
        setSortBy(newSort);
        router.get(route('admin.residents.index'), { search, sort: newSort }, { preserveState: true });
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus data penduduk ini?')) {
            router.delete(route('admin.residents.destroy', id));
        }
    };

    const handleImport = (e) => {
        e.preventDefault();
        if (!importFile) return;

        setIsImporting(true);
        router.post(route('admin.residents.import'), {
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
        <AdminLayout header="Data Kependudukan">
            <Head title="Penduduk" />

            <div className="sm:flex sm:items-center sm:justify-between mb-6">
                <div>
                    <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                        Kelola data warga desa, tambah penduduk baru, atau ubah data.
                    </p>
                </div>
                <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none flex items-center gap-3 flex-wrap">
                    <a
                        href={route('admin.residents.export')}
                        target="_blank"
                        className="block rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 px-4 py-2 text-center text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center gap-2"
                    >
                        <Download size={16} />
                        Export Excel
                    </a>
                    <button
                        onClick={() => setIsImportModalOpen(true)}
                        className="block rounded-lg bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-300 dark:border-emerald-700 px-4 py-2 text-center text-sm font-semibold text-emerald-700 dark:text-emerald-400 shadow-sm hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors flex items-center gap-2"
                    >
                        <Upload size={16} />
                        Import Excel
                    </button>
                    <Link
                        href={route('admin.residents.create')}
                        className="block rounded-lg bg-emerald-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors flex items-center gap-2"
                    >
                        <Plus size={16} />
                        Tambah Penduduk
                    </Link>
                </div>
            </div>

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

            <div className="glass bg-white dark:bg-slate-800 p-4 mb-6 shadow-sm rounded-xl">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1 max-w-md">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-5 w-5 text-slate-400" aria-hidden="true" />
                        </div>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="block w-full rounded-lg border-0 py-2.5 pl-10 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm sm:leading-6 bg-slate-50 dark:bg-slate-800/50"
                            placeholder="Cari NIK, Nama, atau Alamat..."
                        />
                    </div>
                    
                    <div className="flex gap-2">
                        <select 
                            value={sortBy} 
                            onChange={(e) => handleSortChange(e.target.value)}
                            className="rounded-lg border-0 py-2.5 text-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white"
                        >
                            <option value="name">Urutkan: Nama</option>
                            <option value="kk">Urutkan: Kartu Keluarga</option>
                        </select>
                        
                        <button
                            type="submit"
                            className="rounded-lg bg-emerald-600 px-6 py-2 text-sm font-semibold text-white hover:bg-emerald-500 transition-colors shadow-sm"
                        >
                            Cari
                        </button>
                    </div>
                </form>
            </div>

            <div className="glass bg-white dark:bg-slate-800 overflow-hidden shadow-sm rounded-xl">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 dark:text-white sm:pl-6">
                                    NIK / Nama Lengkap
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">
                                    Jenis Kelamin
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">
                                    Usia
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">
                                    Hub. Keluarga
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">
                                    Status
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">
                                    Keaktifan
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">
                                    Alamat
                                </th>
                                <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                                    <span className="sr-only">Aksi</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-800">
                            {residents.data.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 font-medium">
                                        Data Penduduk tidak ditemukan.
                                    </td>
                                </tr>
                            ) : (
                                residents.data.map((resident) => (
                                    <tr key={resident.id} className={`${resident.needs_update ? 'bg-amber-50/50 dark:bg-amber-900/10' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'} transition-colors`}>
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                                            <div className="flex items-center gap-2">
                                                <div className="text-sm font-medium text-slate-900 dark:text-white">{resident.nama_lengkap}</div>
                                                {resident.needs_update && (
                                                    <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                                                        Update
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-sm text-slate-500 dark:text-slate-400 font-mono tracking-wider">{resident.nik}</div>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">
                                            {resident.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">
                                            {resident.tanggal_lahir ? `${new Date().getFullYear() - new Date(resident.tanggal_lahir).getFullYear()} Tahun` : 'N/A'}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">
                                            <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 ring-blue-600/20 capitalize">
                                                {resident.hubungan_keluarga ? resident.hubungan_keluarga.replace('_', ' ') : '-'}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">
                                            <div className="flex flex-col gap-1">
                                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset w-fit ${
                                                resident.status_penduduk === 'aktif' ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 ring-emerald-600/20' : 
                                                resident.status_penduduk === 'meninggal' ? 'bg-red-50 dark:bg-red-900/30 text-red-700 ring-red-600/20' : 
                                                'bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 ring-slate-600/20'
                                            }`}>
                                                {resident.status_penduduk.charAt(0).toUpperCase() + resident.status_penduduk.slice(1)}
                                            </span>
                                            {resident.family_card?.rukem_member && (
                                                <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset w-fit ${RUKEM_STATUS_COLORS[resident.family_card.rukem_member.status_keanggotaan] || ''}`}>
                                                    Rukem: {RUKEM_STATUS[resident.family_card.rukem_member.status_keanggotaan] || resident.family_card.rukem_member.status_keanggotaan}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">
                                        {resident.family_card?.kategori_aktif ? (
                                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${KATEGORI_AKTIF_COLORS[resident.family_card.kategori_aktif] || ''}`}>
                                                {KATEGORI_AKTIF[resident.family_card.kategori_aktif] || resident.family_card.kategori_aktif}
                                            </span>
                                        ) : (
                                            <span className="text-slate-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-3 py-4 text-sm text-slate-500 dark:text-slate-400 max-w-xs truncate">
                                        {resident.alamat_sekarang || resident.family_card?.alamat || '-'}
                                    </td>
                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                            <Dropdown>
                                                <Dropdown.Trigger>
                                                    <button className="text-slate-400 hover:text-emerald-600 dark:text-emerald-400 p-2 rounded-full hover:bg-emerald-50 dark:bg-emerald-900/30 transition-colors">
                                                        <MoreVertical size={18} />
                                                    </button>
                                                </Dropdown.Trigger>
                                                <Dropdown.Content align="right" width="48">
                                                    <Link 
                                                        href={route('admin.residents.show', resident.id)} 
                                                        className="block w-full px-4 py-2 text-left text-sm leading-5 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                                                    >
                                                        <Eye size={16} /> Detail
                                                    </Link>
                                                    <Link 
                                                        href={route('admin.residents.edit', resident.id)} 
                                                        className="block w-full px-4 py-2 text-left text-sm leading-5 text-indigo-600 dark:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                                                    >
                                                        <Edit2 size={16} /> Edit
                                                    </Link>
                                                    <button 
                                                        onClick={() => handleDelete(resident.id)} 
                                                        className="block w-full px-4 py-2 text-left text-sm leading-5 text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                                                    >
                                                        <Trash2 size={16} /> Hapus
                                                    </button>
                                                </Dropdown.Content>
                                            </Dropdown>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {residents.links && residents.links.length > 3 && (
                    <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 sm:px-6 flex items-center justify-between">
                        <div className="flex flex-1 justify-between sm:hidden">
                            <Link href={residents.prev_page_url || '#'} className={`relative inline-flex items-center rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 ${!residents.prev_page_url ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                Previous
                            </Link>
                            <Link href={residents.next_page_url || '#'} className={`relative ml-3 inline-flex items-center rounded-md border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 ${!residents.next_page_url ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                Next
                            </Link>
                        </div>
                        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-slate-700 dark:text-slate-300">
                                    Menampilkan <span className="font-medium">{residents.from || 0}</span> sampai <span className="font-medium">{residents.to || 0}</span> dari{' '}
                                    <span className="font-medium">{residents.total}</span> data
                                </p>
                            </div>
                            <div>
                                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                    {residents.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                                link.active 
                                                    ? 'z-10 bg-emerald-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600' 
                                                    : 'text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 focus:z-20 focus:outline-offset-0 disabled:opacity-50'
                                            } ${index === 0 ? 'rounded-l-md' : ''} ${index === residents.links.length - 1 ? 'rounded-r-md' : ''}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
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
            
            <div className="glass bg-white dark:bg-slate-800 p-4 mb-6 shadow-sm rounded-xl">
                {/* ... existing search form ... */}
            </div>

            {/* Import Modal */}
            <Modal show={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} maxWidth="md">
                <form onSubmit={handleImport} className="p-6">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Import Data Warga dari Excel</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                        Pilih file Excel yang berisi data warga. Sistem akan memproses setiap sheet RT dan memasukkan data penduduk serta KK secara otomatis.
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
                                file:bg-emerald-50 file:text-emerald-700
                                hover:file:bg-emerald-100
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
                                    className="text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:bg-slate-700 dark:border-slate-600"
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
                                    className="text-emerald-600 focus:ring-emerald-500 border-slate-300 dark:bg-slate-700 dark:border-slate-600"
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
                        <h2 className="text-lg font-bold text-slate-800 dark:text-white">Hasil Import Selesai</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Berhasil</div>
                            <div className="text-2xl font-bold text-emerald-600">{import_results?.total_success || 0}</div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Dilewati</div>
                            <div className="text-2xl font-bold text-amber-600">{import_results?.total_skipped || 0}</div>
                        </div>
                    </div>

                    {import_results?.summary?.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Ringkasan per Sheet:</h3>
                            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 p-3">
                                <ul className="text-xs space-y-1 text-slate-600 dark:text-slate-400">
                                    {import_results.summary.map((line, i) => (
                                        <li key={i}>{line}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {import_results?.skipped_details?.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                                <AlertCircle size={16} /> Detail Duplikat (teratas):
                            </h3>
                            <div className="max-h-48 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900/50">
                                <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                                    {import_results.skipped_details.slice(0, 50).map((item, idx) => (
                                        <li key={idx} className="p-3">
                                            <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{item.nama}</div>
                                            <div className="text-xs text-slate-500 font-mono">{item.nik}</div>
                                            <div className="text-xs text-rose-500 mt-1">{item.reason}</div>
                                        </li>
                                    ))}
                                    {import_results.skipped_details.length > 50 && (
                                        <li className="p-3 text-center text-xs text-slate-500 italic">...dan {import_results.skipped_details.length - 50} data lainnya</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end">
                        <PrimaryButton onClick={() => setShowResultModal(false)}>Tutup</PrimaryButton>
                    </div>
                </div>
            </Modal>
        </AdminLayout>
    );
}
