import React, { useState } from 'react';
import { Head, useForm, Link, router } from '@inertiajs/react';
import RtLayout from '@/Layouts/RtLayout';
import { SEKTOR_USAHA, RENTANG_OMZET, JUMLAH_KARYAWAN, UMKM_STATUS } from '@/Helpers/constants';
import { Store, Upload, Camera, X } from 'lucide-react';

export default function Form({ umkm, residents = [] }) {
    const isEdit = !!umkm;
    const { data, setData, post, put, processing, errors, progress } = useForm({
        resident_id: umkm?.resident_id || '',
        nama_usaha: umkm?.nama_usaha || '',
        sektor_usaha: umkm?.sektor_usaha || 'kuliner',
        alamat_sama_domisili: umkm?.alamat_sama_domisili ?? true,
        alamat_usaha: umkm?.alamat_usaha || '',
        foto_tempat_usaha: null,
        memiliki_nib: umkm?.memiliki_nib ?? false,
        nomor_nib: umkm?.nomor_nib || '',
        rentang_omzet: umkm?.rentang_omzet || 'belum_ada',
        jumlah_karyawan: umkm?.jumlah_karyawan || '0',
        deskripsi: umkm?.deskripsi || '',
        status: umkm?.status || 'aktif',
    });

    const [previewUrl, setPreviewUrl] = useState(
        umkm?.foto_tempat_usaha ? `/storage/${umkm.foto_tempat_usaha}` : null
    );
    const [residentSearch, setResidentSearch] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            post(route('rt.umkm.update', umkm.id), {
                _method: 'PUT',
                forceFormData: true,
            });
        } else {
            post(route('rt.umkm.store'), { forceFormData: true });
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('foto_tempat_usaha', file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const clearPhoto = () => {
        setData('foto_tempat_usaha', null);
        setPreviewUrl(null);
    };

    const filteredResidents = residents.filter(r =>
        r.nama_lengkap.toLowerCase().includes(residentSearch.toLowerCase()) ||
        r.nik.includes(residentSearch)
    );

    const selectedResident = residents.find(r => r.id == data.resident_id);

    const inputClass = "block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-blue-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50";
    const labelClass = "block text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5";

    return (
        <RtLayout header={isEdit ? 'Edit Data UMKM' : 'Pendataan UMKM Baru'}>
            <Head title={isEdit ? 'Edit UMKM' : 'Tambah UMKM'} />

            <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Section 1: Pemilik Usaha */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-5 border-b border-slate-200 dark:border-slate-700 pb-4">
                            <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-lg text-amber-600 dark:text-amber-400"><Store size={18} /></div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Langkah 1: Pemilik Usaha</h3>
                                <p className="text-xs text-slate-500">Pilih warga yang memiliki usaha ini.</p>
                            </div>
                        </div>

                        {!isEdit ? (
                            <div>
                                <label className={labelClass}>Cari & Pilih Warga *</label>
                                <input
                                    type="text" value={residentSearch} onChange={(e) => setResidentSearch(e.target.value)}
                                    className={inputClass} placeholder="Ketik nama atau NIK warga..."
                                />
                                {residentSearch && (
                                    <div className="mt-2 max-h-48 overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800">
                                        {filteredResidents.length > 0 ? filteredResidents.slice(0, 10).map(r => (
                                            <button key={r.id} type="button" onClick={() => { setData('resident_id', r.id); setResidentSearch(''); }}
                                                className={`w-full text-left px-4 py-3 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors ${data.resident_id == r.id ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}>
                                                <div className="font-semibold text-sm text-slate-900 dark:text-white">{r.nama_lengkap}</div>
                                                <div className="text-xs text-slate-500 font-mono">NIK: {r.nik}</div>
                                            </button>
                                        )) : (
                                            <div className="px-4 py-3 text-sm text-slate-500">Tidak ditemukan warga dengan kata kunci tersebut.</div>
                                        )}
                                    </div>
                                )}
                                {selectedResident && (
                                    <div className="mt-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                                        <div className="text-sm font-bold text-blue-800 dark:text-blue-300">{selectedResident.nama_lengkap}</div>
                                        <div className="text-xs text-blue-600 dark:text-blue-400 font-mono">NIK: {selectedResident.nik}</div>
                                    </div>
                                )}
                                {errors.resident_id && <p className="mt-1 text-sm text-red-600">{errors.resident_id}</p>}
                            </div>
                        ) : (
                            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/40">
                                <p className="text-xs text-slate-500 uppercase font-bold mb-1">Pemilik Usaha</p>
                                <p className="font-bold text-slate-900 dark:text-white">{umkm?.resident?.nama_lengkap}</p>
                                <p className="text-sm text-slate-500 font-mono">NIK: {umkm?.resident?.nik}</p>
                            </div>
                        )}
                    </div>

                    {/* Section 2: Data Usaha */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-5 border-b border-slate-200 dark:border-slate-700 pb-4">
                            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-600 dark:text-blue-400"><Store size={18} /></div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Langkah 2: Informasi Usaha</h3>
                                <p className="text-xs text-slate-500">Detail usaha yang akan didaftarkan.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className={labelClass}>Nama Usaha *</label>
                                <input type="text" value={data.nama_usaha} onChange={(e) => setData('nama_usaha', e.target.value)}
                                    className={inputClass} placeholder="Contoh: Warung Nasi Bu Siti" />
                                {errors.nama_usaha && <p className="mt-1 text-sm text-red-600">{errors.nama_usaha}</p>}
                            </div>

                            <div>
                                <label className={labelClass}>Sektor Usaha *</label>
                                <select value={data.sektor_usaha} onChange={(e) => setData('sektor_usaha', e.target.value)} className={inputClass}>
                                    {Object.entries(SEKTOR_USAHA).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                </select>
                                {errors.sektor_usaha && <p className="mt-1 text-sm text-red-600">{errors.sektor_usaha}</p>}
                            </div>

                            <div>
                                <label className={labelClass}>Status Usaha *</label>
                                <select value={data.status} onChange={(e) => setData('status', e.target.value)} className={inputClass}>
                                    {Object.entries(UMKM_STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className={labelClass}>Deskripsi Usaha</label>
                                <textarea value={data.deskripsi} onChange={(e) => setData('deskripsi', e.target.value)}
                                    rows={2} className={inputClass} placeholder="Deskripsi singkat usaha (opsional)..." />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Alamat */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-5 border-b border-slate-200 dark:border-slate-700 pb-4">
                            <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg text-emerald-600 dark:text-emerald-400"><Store size={18} /></div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Langkah 3: Lokasi Usaha</h3>
                                <p className="text-xs text-slate-500">Tentukan alamat tempat usaha.</p>
                            </div>
                        </div>

                        <label className="flex items-center gap-3 cursor-pointer mb-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors">
                            <input type="checkbox" checked={data.alamat_sama_domisili}
                                onChange={(e) => setData('alamat_sama_domisili', e.target.checked)}
                                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600" />
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Alamat usaha sama dengan alamat domisili pemilik</span>
                        </label>

                        {!data.alamat_sama_domisili && (
                            <div>
                                <label className={labelClass}>Alamat Usaha *</label>
                                <textarea value={data.alamat_usaha} onChange={(e) => setData('alamat_usaha', e.target.value)}
                                    rows={2} className={inputClass} placeholder="Masukkan alamat lengkap lokasi usaha..." />
                                {errors.alamat_usaha && <p className="mt-1 text-sm text-red-600">{errors.alamat_usaha}</p>}
                            </div>
                        )}
                    </div>

                    {/* Section 4: NIB & Skala */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-5 border-b border-slate-200 dark:border-slate-700 pb-4">
                            <div className="bg-violet-100 dark:bg-violet-900/30 p-2 rounded-lg text-violet-600 dark:text-violet-400"><Store size={18} /></div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Langkah 4: Status Izin & Skala</h3>
                                <p className="text-xs text-slate-500">Informasi izin usaha dan skala operasi.</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>Kepemilikan NIB *</label>
                                <div className="flex gap-4 mt-2">
                                    <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${data.memiliki_nib ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}>
                                        <input type="radio" name="memiliki_nib" checked={data.memiliki_nib === true}
                                            onChange={() => setData('memiliki_nib', true)} className="sr-only" />
                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">✓ Sudah Punya</span>
                                    </label>
                                    <label className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${!data.memiliki_nib ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}>
                                        <input type="radio" name="memiliki_nib" checked={data.memiliki_nib === false}
                                            onChange={() => setData('memiliki_nib', false)} className="sr-only" />
                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">✗ Belum Punya</span>
                                    </label>
                                </div>
                            </div>

                            {data.memiliki_nib && (
                                <div>
                                    <label className={labelClass}>Nomor NIB</label>
                                    <input type="text" value={data.nomor_nib} onChange={(e) => setData('nomor_nib', e.target.value)}
                                        className={inputClass} placeholder="Masukkan No. NIB..." />
                                    {errors.nomor_nib && <p className="mt-1 text-sm text-red-600">{errors.nomor_nib}</p>}
                                </div>
                            )}

                            <div>
                                <label className={labelClass}>Estimasi Omzet per Bulan</label>
                                <select value={data.rentang_omzet} onChange={(e) => setData('rentang_omzet', e.target.value)} className={inputClass}>
                                    {Object.entries(RENTANG_OMZET).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className={labelClass}>Jumlah Karyawan</label>
                                <select value={data.jumlah_karyawan} onChange={(e) => setData('jumlah_karyawan', e.target.value)} className={inputClass}>
                                    {Object.entries(JUMLAH_KARYAWAN).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Section 5: Foto */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-5 border-b border-slate-200 dark:border-slate-700 pb-4">
                            <div className="bg-pink-100 dark:bg-pink-900/30 p-2 rounded-lg text-pink-600 dark:text-pink-400"><Camera size={18} /></div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900 dark:text-white">Langkah 5: Foto Tempat Usaha</h3>
                                <p className="text-xs text-slate-500">Ambil foto atau upload gambar tempat usaha (opsional).</p>
                            </div>
                        </div>

                        <div className="flex flex-col items-center gap-4">
                            {previewUrl ? (
                                <div className="relative">
                                    <img src={previewUrl} alt="Preview" className="w-full max-w-md h-48 object-cover rounded-lg border border-slate-200 dark:border-slate-700" />
                                    <button type="button" onClick={clearPhoto} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : null}

                            <label className="flex items-center gap-3 px-6 py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg cursor-pointer transition-colors border-2 border-dashed border-slate-300 dark:border-slate-600">
                                <Upload size={20} className="text-slate-500" />
                                <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                                    {previewUrl ? 'Ganti Foto' : 'Pilih Foto / Ambil dari Kamera'}
                                </span>
                                <input type="file" accept="image/*" capture="environment" onChange={handleFileChange} className="sr-only" />
                            </label>

                            {progress && (
                                <div className="w-full max-w-md">
                                    <div className="bg-slate-200 rounded-full h-2">
                                        <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${progress.percentage}%` }} />
                                    </div>
                                </div>
                            )}
                            {errors.foto_tempat_usaha && <p className="text-sm text-red-600">{errors.foto_tempat_usaha}</p>}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3">
                        <Link href={route('rt.umkm.index')} className="px-5 py-2.5 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                            Batal
                        </Link>
                        <button type="submit" disabled={processing}
                            className="px-8 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-sm font-bold shadow-md disabled:opacity-50 transition-all transform active:scale-95">
                            {processing ? 'Menyimpan...' : (isEdit ? 'Perbarui Data' : 'Simpan Data UMKM')}
                        </button>
                    </div>
                </form>
            </div>
        </RtLayout>
    );
}
