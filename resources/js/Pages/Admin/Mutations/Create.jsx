import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Save, ArrowLeft } from 'lucide-react';
import { MUTATION_TYPES } from '@/Helpers/constants';

export default function Create({ residents }) {
    const { data, setData, post, processing, errors } = useForm({
        resident_id: '',
        type: '',
        tanggal_mutasi: new Date().toISOString().split('T')[0],
        keterangan: '',
        asal_tujuan: '',
        no_surat_mutasi: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.mutations.store'));
    };

    const showAsalTujuan = ['pindah_keluar', 'pindah_masuk', 'datang'].includes(data.type);

    return (
        <AdminLayout header="Catat Mutasi Kependudukan">
            <Head title="Catat Mutasi" />

            <div className="mb-6">
                <Link href={route('admin.mutations.index')} className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-colors">
                    <ArrowLeft size={16} /> Kembali
                </Link>
            </div>

            <div className="max-w-2xl">
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700/60 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Data Mutasi Baru</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Catat perubahan data kependudukan (lahir, mati, pindah, datang).</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Penduduk *</label>
                            <select
                                value={data.resident_id}
                                onChange={(e) => setData('resident_id', e.target.value)}
                                className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50"
                            >
                                <option value="">-- Pilih Penduduk --</option>
                                {residents.map((r) => (
                                    <option key={r.id} value={r.id}>{r.nama_lengkap} ({r.nik})</option>
                                ))}
                            </select>
                            {errors.resident_id && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.resident_id}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Jenis Mutasi *</label>
                            <select
                                value={data.type}
                                onChange={(e) => setData('type', e.target.value)}
                                className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50"
                            >
                                <option value="">-- Pilih Jenis --</option>
                                {Object.entries(MUTATION_TYPES).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                            {errors.type && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.type}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tanggal Mutasi *</label>
                            <input
                                type="date"
                                value={data.tanggal_mutasi}
                                onChange={(e) => setData('tanggal_mutasi', e.target.value)}
                                className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50"
                            />
                            {errors.tanggal_mutasi && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.tanggal_mutasi}</p>}
                        </div>

                        {showAsalTujuan && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    {data.type === 'pindah_keluar' ? 'Tujuan Pindah' : 'Asal Datang/Pindah'}
                                </label>
                                <input
                                    type="text"
                                    value={data.asal_tujuan}
                                    onChange={(e) => setData('asal_tujuan', e.target.value)}
                                    className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50"
                                    placeholder="Kota/Kabupaten"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">No. Surat Mutasi (opsional)</label>
                            <input
                                type="text"
                                value={data.no_surat_mutasi}
                                onChange={(e) => setData('no_surat_mutasi', e.target.value)}
                                className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50"
                                placeholder="Nomor surat"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Keterangan</label>
                            <textarea
                                value={data.keterangan}
                                onChange={(e) => setData('keterangan', e.target.value)}
                                rows={3}
                                className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50"
                                placeholder="Keterangan tambahan..."
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                            <Link href={route('admin.mutations.index')} className="rounded-lg bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                Batal
                            </Link>
                            <button type="submit" disabled={processing} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors disabled:opacity-50">
                                <Save size={16} />
                                {processing ? 'Menyimpan...' : 'Simpan Mutasi'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
