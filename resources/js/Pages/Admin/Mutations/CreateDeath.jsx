import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Save, ArrowLeft, Skull } from 'lucide-react';

export default function CreateDeath({ residents }) {
    const { data, setData, post, processing, errors } = useForm({
        resident_id: '',
        tanggal_mati: new Date().toISOString().split('T')[0],
        jam_mati: '',
        tempat_mati: '',
        penyebab: '',
        pelapor_nik: '',
        keterangan: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.mutations.storeDeath'));
    };

    return (
        <AdminLayout header="Catat Kematian Penduduk">
            <Head title="Catat Kematian" />

            <div className="mb-6">
                <Link href={route('admin.mutations.index')} className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-colors">
                    <ArrowLeft size={16} /> Kembali
                </Link>
            </div>

            <div className="max-w-2xl">
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700/60 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-red-50/50 dark:bg-red-950/20 flex items-center gap-2">
                        <Skull size={20} className="text-red-500" />
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Formulir Kematian</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 p-4 rounded-lg">
                            <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed font-medium">
                                PERHATIAN: Menyimpan data ini akan otomatis mengubah status penduduk menjadi "Meninggal" dan menonaktifkannya dari daftar penduduk aktif.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Pilih Penduduk (Almarhum/ah) *</label>
                            <select
                                value={data.resident_id}
                                onChange={(e) => setData('resident_id', e.target.value)}
                                className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50"
                            >
                                <option value="">-- Pilih Penduduk Aktif --</option>
                                {residents.map((r) => (
                                    <option key={r.id} value={r.id}>{r.nama_lengkap} ({r.nik})</option>
                                ))}
                            </select>
                            {errors.resident_id && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.resident_id}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tanggal Meninggal *</label>
                                <input
                                    type="date"
                                    value={data.tanggal_mati}
                                    onChange={(e) => setData('tanggal_mati', e.target.value)}
                                    className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50"
                                />
                                {errors.tanggal_mati && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.tanggal_mati}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Jam Meninggal *</label>
                                <input
                                    type="time"
                                    value={data.jam_mati}
                                    onChange={(e) => setData('jam_mati', e.target.value)}
                                    className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50"
                                />
                                {errors.jam_mati && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.jam_mati}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tempat Meninggal *</label>
                            <input
                                type="text"
                                value={data.tempat_mati}
                                onChange={(e) => setData('tempat_mati', e.target.value)}
                                className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50"
                                placeholder="Misal: Rumah Duka, RSUD, dll"
                            />
                            {errors.tempat_mati && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.tempat_mati}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Penyebab Kematian *</label>
                            <input
                                type="text"
                                value={data.penyebab}
                                onChange={(e) => setData('penyebab', e.target.value)}
                                className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50"
                                placeholder="Misal: Sakit, Usia Tua, Kecelakaan"
                            />
                            {errors.penyebab && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.penyebab}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">NIK Pelapor (Opsional)</label>
                            <input
                                type="text"
                                value={data.pelapor_nik}
                                onChange={(e) => setData('pelapor_nik', e.target.value)}
                                className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50 font-mono"
                                placeholder="NIK keluarga atau saksi"
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                            <Link href={route('admin.mutations.index')} className="rounded-lg bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                Batal
                            </Link>
                            <button type="submit" disabled={processing} className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-500 transition-colors disabled:opacity-50">
                                <Skull size={16} />
                                {processing ? 'Memproses...' : 'Simpan Kematian'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
