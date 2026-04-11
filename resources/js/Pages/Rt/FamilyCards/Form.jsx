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
        status_kepemilikan_bangunan: familyCard?.status_kepemilikan_bangunan || '',
        jenis_lantai: familyCard?.jenis_lantai || '',
        jenis_dinding: familyCard?.jenis_dinding || '',
        fasilitas_sanitasi: familyCard?.fasilitas_sanitasi || '',
        sumber_air_minum: familyCard?.sumber_air_minum || '',
        alamat_domisili: familyCard?.alamat_domisili || '',
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

            <div className="max-w-3xl mx-auto space-y-6 pb-20">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-6">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-4">
                            {isEdit ? 'Edit Data Kartu Keluarga' : 'Input Kartu Keluarga Baru'}
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nomor KK *</label>
                                <input type="text" value={data.no_kk} onChange={(e) => setData('no_kk', e.target.value)} maxLength={16} className={inputClass} placeholder="16 digit angka" />
                                {errors.no_kk && <p className="mt-1 text-sm text-red-600">{errors.no_kk}</p>}
                            </div>

                            <div className="md:col-span-2">
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

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Alamat (Sesuai KK) *</label>
                                <textarea value={data.alamat} onChange={(e) => setData('alamat', e.target.value)} rows={2} className={inputClass} placeholder="Nama jalan, gang, nomor rumah" />
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
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 space-y-6">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-4">
                            Kondisi Hunian & Sanitasi
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Alamat Domisili (Tempat Tinggal Sekarang)</label>
                                <textarea 
                                    value={data.alamat_domisili} 
                                    onChange={(e) => setData('alamat_domisili', e.target.value)} 
                                    rows={2} 
                                    className={inputClass} 
                                    placeholder="Kosongkan jika sama dengan alamat KK" 
                                />
                                <p className="mt-1 text-xs text-slate-500">Gunakan ini untuk membedakan warga pendatang dan warga tetap.</p>
                                {errors.alamat_domisili && <p className="mt-1 text-sm text-red-600">{errors.alamat_domisili}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status Kepemilikan Bangunan</label>
                                <select value={data.status_kepemilikan_bangunan} onChange={(e) => setData('status_kepemilikan_bangunan', e.target.value)} className={inputClass}>
                                    <option value="">-- Pilih --</option>
                                    <option value="milik_sendiri">Milik Sendiri</option>
                                    <option value="kontrak_sewa">Kontrak / Sewa</option>
                                    <option value="bebas_sewa">Bebas Sewa (Numpang)</option>
                                    <option value="rumah_dinas">Rumah Dinas / Fasilitas</option>
                                </select>
                                {errors.status_kepemilikan_bangunan && <p className="mt-1 text-sm text-red-600">{errors.status_kepemilikan_bangunan}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Sumber Air Minum</label>
                                <select value={data.sumber_air_minum} onChange={(e) => setData('sumber_air_minum', e.target.value)} className={inputClass}>
                                    <option value="">-- Pilih --</option>
                                    <option value="pdam">PDAM</option>
                                    <option value="sumur_bor">Sumur Bor</option>
                                    <option value="sumur_gali">Sumur Gali</option>
                                    <option value="mata_air">Mata Air</option>
                                    <option value="sungai">Sungai</option>
                                </select>
                                {errors.sumber_air_minum && <p className="mt-1 text-sm text-red-600">{errors.sumber_air_minum}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Jenis Lantai Terluas</label>
                                <select value={data.jenis_lantai} onChange={(e) => setData('jenis_lantai', e.target.value)} className={inputClass}>
                                    <option value="">-- Pilih --</option>
                                    <option value="keramik">Keramik</option>
                                    <option value="semen">Semen</option>
                                    <option value="tanah">Tanah</option>
                                    <option value="kayu">Kayu</option>
                                </select>
                                {errors.jenis_lantai && <p className="mt-1 text-sm text-red-600">{errors.jenis_lantai}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Jenis Dinding Terluas</label>
                                <select value={data.jenis_dinding} onChange={(e) => setData('jenis_dinding', e.target.value)} className={inputClass}>
                                    <option value="">-- Pilih --</option>
                                    <option value="tembok">Tembok</option>
                                    <option value="papan">Papan</option>
                                    <option value="anyaman_bambu">Anyaman Bambu</option>
                                </select>
                                {errors.jenis_dinding && <p className="mt-1 text-sm text-red-600">{errors.jenis_dinding}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Fasilitas Sanitasi (Jamban)</label>
                                <select value={data.fasilitas_sanitasi} onChange={(e) => setData('fasilitas_sanitasi', e.target.value)} className={inputClass}>
                                    <option value="">-- Pilih --</option>
                                    <option value="milik_sendiri">Milik Sendiri (Leher Angsa)</option>
                                    <option value="mck_umum">MCK Umum / Bersama</option>
                                    <option value="tidak_punya">Tidak Punya (Sungai/Kebun)</option>
                                </select>
                                {errors.fasilitas_sanitasi && <p className="mt-1 text-sm text-red-600">{errors.fasilitas_sanitasi}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 flex justify-end gap-3 border border-slate-200 dark:border-slate-700">
                        <Link href={route('rt.family-cards.index')} className="px-4 py-2 font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg transition-colors">Batal</Link>
                        <button type="submit" disabled={processing} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold shadow-sm transition-colors disabled:opacity-50">
                            {processing ? 'Menyimpan...' : (isEdit ? 'Simpan Perubahan' : 'Tambah KK')}
                        </button>
                    </div>
                </form>
            </div>
        </RtLayout>
    );
}
