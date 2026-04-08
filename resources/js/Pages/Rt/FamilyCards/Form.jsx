import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import RtLayout from '@/Layouts/RtLayout';

export default function Form({ familyCard = null, residents = [] }) {
    const isEdit = !!familyCard;
    const { data, setData, post, put, processing, errors } = useForm({
        no_kk: familyCard?.no_kk || '',
        kepala_keluarga_id: familyCard?.kepala_keluarga_id || '',
        alamat: familyCard?.alamat || '',
        kode_pos: familyCard?.kode_pos || '',
        status: familyCard?.status || 'aktif',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('rt.family-cards.update', familyCard.id));
        } else {
            post(route('rt.family-cards.store'));
        }
    };

    const inputClass = "block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-blue-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50";

    return (
        <RtLayout header={isEdit ? 'Edit Kartu Keluarga' : 'Tambah Kartu Keluarga'}>
            <Head title={isEdit ? 'Edit KK' : 'Tambah KK'} />

            <div className="max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-6">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-4">
                        {isEdit ? 'Edit Data Kartu Keluarga' : 'Input Kartu Keluarga Baru'}
                    </h2>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nomor KK *</label>
                        <input type="text" value={data.no_kk} onChange={(e) => setData('no_kk', e.target.value)} maxLength={16} className={inputClass} placeholder="16 digit angka" />
                        {errors.no_kk && <p className="mt-1 text-sm text-red-600">{errors.no_kk}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kepala Keluarga</label>
                        <select value={data.kepala_keluarga_id} onChange={(e) => setData('kepala_keluarga_id', e.target.value)} className={inputClass}>
                            <option value="">-- Pilih (Opsional) --</option>
                            {residents.map((r) => (
                                <option key={r.id} value={r.id}>{r.nama_lengkap} ({r.nik})</option>
                            ))}
                        </select>
                        <p className="mt-1 text-xs text-slate-500">Kepala keluarga dapat diset setelah profil penduduk didaftarkan.</p>
                        {errors.kepala_keluarga_id && <p className="mt-1 text-sm text-red-600">{errors.kepala_keluarga_id}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Alamat Lengkap *</label>
                        <textarea value={data.alamat} onChange={(e) => setData('alamat', e.target.value)} rows={3} className={inputClass} placeholder="Nama jalan, gang, nomor rumah" />
                        {errors.alamat && <p className="mt-1 text-sm text-red-600">{errors.alamat}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kode Pos</label>
                        <input type="text" value={data.kode_pos} onChange={(e) => setData('kode_pos', e.target.value)} maxLength={5} className={inputClass} />
                        {errors.kode_pos && <p className="mt-1 text-sm text-red-600">{errors.kode_pos}</p>}
                    </div>

                    {isEdit && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status KK *</label>
                            <select value={data.status} onChange={(e) => setData('status', e.target.value)} className={inputClass}>
                                <option value="aktif">Aktif</option>
                                <option value="pecah_kk">Pecah KK</option>
                                <option value="pindah">Pindah</option>
                                <option value="hilang">Hilang</option>
                            </select>
                            {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
                        </div>
                    )}

                    <div className="pt-4 flex justify-end gap-3 border-t border-slate-200 dark:border-slate-700">
                        <Link href={route('rt.family-cards.index')} className="px-4 py-2 font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors">Batal</Link>
                        <button type="submit" disabled={processing} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-sm transition-colors disabled:opacity-50">
                            {processing ? 'Menyimpan...' : (isEdit ? 'Simpan Perubahan' : 'Tambah KK')}
                        </button>
                    </div>
                </form>
            </div>
        </RtLayout>
    );
}
