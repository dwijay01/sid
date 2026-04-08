import React, { useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Save, ArrowLeft, Baby, Users } from 'lucide-react';

export default function CreateBirth({ familyCards }) {
    const { data, setData, post, processing, errors } = useForm({
        nama_bayi: '',
        jenis_kelamin: '',
        tempat_lahir: '',
        tanggal_lahir: new Date().toISOString().split('T')[0],
        jam_lahir: '',
        berat: '',
        panjang: '',
        family_card_id: '',
        hubungan_keluarga: 'anak',
        ayah_nik: '',
        ibu_nik: '',
        keterangan: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.mutations.storeBirth'));
    };

    // Auto-fill NIK Ortu logic could be added here if needed, 
    // but for now let's keep it simple as per the plan.

    return (
        <AdminLayout header="Catat Kelahiran Baru">
            <Head title="Catat Kelahiran" />

            <div className="mb-6 flex items-center justify-between max-w-4xl">
                <Link href={route('admin.mutations.index')} className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-colors">
                    <ArrowLeft size={16} /> Kembali
                </Link>
            </div>

            <div className="max-w-4xl">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Data Bayi */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700/60 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex items-center gap-2">
                            <Baby size={20} className="text-emerald-500" />
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Informasi Bayi</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nama Bayi *</label>
                                <input
                                    type="text"
                                    value={data.nama_bayi}
                                    onChange={(e) => setData('nama_bayi', e.target.value)}
                                    className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50"
                                    placeholder="Nama Lengkap Bayi"
                                />
                                {errors.nama_bayi && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.nama_bayi}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Jenis Kelamin *</label>
                                    <select
                                        value={data.jenis_kelamin}
                                        onChange={(e) => setData('jenis_kelamin', e.target.value)}
                                        className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50"
                                    >
                                        <option value="">-- Pilih --</option>
                                        <option value="L">Laki-Laki</option>
                                        <option value="P">Perempuan</option>
                                    </select>
                                    {errors.jenis_kelamin && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.jenis_kelamin}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Hubungan SHDK *</label>
                                    <select
                                        value={data.hubungan_keluarga}
                                        onChange={(e) => setData('hubungan_keluarga', e.target.value)}
                                        className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50"
                                    >
                                        <option value="anak">Anak</option>
                                        <option value="cucu">Cucu</option>
                                        <option value="lainnya">Lainnya</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tempat Lahir *</label>
                                    <input
                                        type="text"
                                        value={data.tempat_lahir}
                                        onChange={(e) => setData('tempat_lahir', e.target.value)}
                                        className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50"
                                        placeholder="Kota/Kab"
                                    />
                                    {errors.tempat_lahir && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.tempat_lahir}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tanggal Lahir *</label>
                                    <input
                                        type="date"
                                        value={data.tanggal_lahir}
                                        onChange={(e) => setData('tanggal_lahir', e.target.value)}
                                        className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Jam Lahir *</label>
                                    <input
                                        type="time"
                                        value={data.jam_lahir}
                                        onChange={(e) => setData('jam_lahir', e.target.value)}
                                        className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50"
                                    />
                                    {errors.jam_lahir && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.jam_lahir}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Berat (kg)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={data.berat}
                                        onChange={(e) => setData('berat', e.target.value)}
                                        className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Panjang (cm)</label>
                                    <input
                                        type="number"
                                        value={data.panjang}
                                        onChange={(e) => setData('panjang', e.target.value)}
                                        className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Data Keluarga & Orang Tua */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700/60 overflow-hidden">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex items-center gap-2">
                                <Users size={20} className="text-blue-500" />
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Orang Tua & KK</h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Pilih Kartu Keluarga *</label>
                                    <select
                                        value={data.family_card_id}
                                        onChange={(e) => setData('family_card_id', e.target.value)}
                                        className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50"
                                    >
                                        <option value="">-- Cari KK / Kepala Keluarga --</option>
                                        {familyCards.map((kk) => (
                                            <option key={kk.id} value={kk.id}>
                                                KK: {kk.no_kk} - {kk.kepala_keluarga?.nama_lengkap}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.family_card_id && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.family_card_id}</p>}
                                    <p className="mt-1 text-xs text-slate-500">Bayi akan otomatis terdaftar sebagai warga di KK ini.</p>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">NIK Ayah (Opsional)</label>
                                        <input
                                            type="text"
                                            value={data.ayah_nik}
                                            onChange={(e) => setData('ayah_nik', e.target.value)}
                                            className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50 font-mono"
                                            placeholder="NIK Ayah"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">NIK Ibu (Opsional)</label>
                                        <input
                                            type="text"
                                            value={data.ibu_nik}
                                            onChange={(e) => setData('ibu_nik', e.target.value)}
                                            className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50 font-mono"
                                            placeholder="NIK Ibu"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700/60 overflow-hidden p-6">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Keterangan Tambahan</label>
                            <textarea
                                value={data.keterangan}
                                onChange={(e) => setData('keterangan', e.target.value)}
                                rows={2}
                                className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50"
                                placeholder="Misal: Lahir normal, Kondisi sehat..."
                            />

                            <div className="flex justify-end gap-3 mt-6">
                                <Link href={route('admin.mutations.index')} className="rounded-lg bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                    Batal
                                </Link>
                                <button type="submit" disabled={processing} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors disabled:opacity-50">
                                    <Save size={16} />
                                    {processing ? 'Memproses...' : 'Simpan Kelahiran'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
