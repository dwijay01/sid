import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import RtLayout from '@/Layouts/RtLayout';
import { RELIGIONS, BLOOD_TYPES, EDUCATION_LEVELS, FAMILY_RELATIONS, MARITAL_STATUS, GENDER_LABELS } from '@/Helpers/constants';
import { Plus, X } from 'lucide-react';
import axios from 'axios';

export default function Form({ resident, familyCards = [], defaultFamilyCardId = '' }) {
    const isEdit = !!resident;
    const [localFamilyCards, setLocalFamilyCards] = useState(familyCards);
    
    // Quick Add KK state
    const [showKkModal, setShowKkModal] = useState(false);
    const [kkForm, setKkForm] = useState({ no_kk: '', alamat: '' });
    const [kkError, setKkError] = useState('');
    const [savingKk, setSavingKk] = useState(false);

    const { data, setData, post, put, processing, errors } = useForm({
        nik: resident?.nik || '',
        nama_lengkap: resident?.nama_lengkap || '',
        tempat_lahir: resident?.tempat_lahir || '',
        tanggal_lahir: resident?.tanggal_lahir?.split('T')[0] || '',
        jenis_kelamin: resident?.jenis_kelamin || 'L',
        agama: resident?.agama || 'Islam',
        golongan_darah: resident?.golongan_darah || 'tidak_tahu',
        status_perkawinan: resident?.status_perkawinan || 'belum_kawin',
        pekerjaan: resident?.pekerjaan || '',
        pendidikan: resident?.pendidikan || 'tidak_sekolah',
        hubungan_keluarga: resident?.hubungan_keluarga || 'kepala',
        family_card_id: resident?.family_card_id || defaultFamilyCardId || '',
        alamat_sekarang: resident?.alamat_sekarang || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('rt.residents.update', resident.id));
        } else {
            post(route('rt.residents.store'));
        }
    };

    const handleQuickStoreKk = async (e) => {
        e.preventDefault();
        setSavingKk(true);
        setKkError('');
        
        try {
            const response = await axios.post(route('rt.family-cards.quick-store'), kkForm);
            if (response.data.success) {
                const newKk = response.data.family_card;
                // Add to local list and select it
                setLocalFamilyCards([...localFamilyCards, newKk]);
                setData('family_card_id', newKk.id);
                // Reset and close modal
                setKkForm({ no_kk: '', alamat: '' });
                setShowKkModal(false);
            }
        } catch (err) {
            setKkError(err.response?.data?.message || 'Gagal menyimpan Kartu Keluarga. Pastikan Nomor KK belum terdaftar dan terdiri dari 16 digit.');
        } finally {
            setSavingKk(false);
        }
    };

    const inputClass = "block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50";

    return (
        <RtLayout header={isEdit ? 'Edit Data Penduduk' : 'Input Data Penduduk'}>
            <Head title={isEdit ? 'Edit Penduduk' : 'Input Penduduk'} />

            <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-700 pb-4">Identitas Penduduk</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">NIK *</label>
                                <input type="text" value={data.nik} onChange={(e) => setData('nik', e.target.value)} maxLength={16} className={inputClass} placeholder="16 digit NIK" />
                                {errors.nik && <p className="mt-1 text-sm text-red-600">{errors.nik}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nama Lengkap *</label>
                                <input type="text" value={data.nama_lengkap} onChange={(e) => setData('nama_lengkap', e.target.value)} className={inputClass} />
                                {errors.nama_lengkap && <p className="mt-1 text-sm text-red-600">{errors.nama_lengkap}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tempat Lahir *</label>
                                <input type="text" value={data.tempat_lahir} onChange={(e) => setData('tempat_lahir', e.target.value)} className={inputClass} />
                                {errors.tempat_lahir && <p className="mt-1 text-sm text-red-600">{errors.tempat_lahir}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tanggal Lahir *</label>
                                <input type="date" value={data.tanggal_lahir} onChange={(e) => setData('tanggal_lahir', e.target.value)} className={inputClass} />
                                {errors.tanggal_lahir && <p className="mt-1 text-sm text-red-600">{errors.tanggal_lahir}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Jenis Kelamin *</label>
                                <select value={data.jenis_kelamin} onChange={(e) => setData('jenis_kelamin', e.target.value)} className={inputClass}>
                                    {Object.entries(GENDER_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Agama *</label>
                                <select value={data.agama} onChange={(e) => setData('agama', e.target.value)} className={inputClass}>
                                    {RELIGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Golongan Darah</label>
                                <select value={data.golongan_darah} onChange={(e) => setData('golongan_darah', e.target.value)} className={inputClass}>
                                    {BLOOD_TYPES.map((b) => <option key={b} value={b}>{b === 'tidak_tahu' ? 'Tidak Tahu' : b}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status Perkawinan *</label>
                                <select value={data.status_perkawinan} onChange={(e) => setData('status_perkawinan', e.target.value)} className={inputClass}>
                                    {Object.entries(MARITAL_STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Pendidikan *</label>
                                <select value={data.pendidikan} onChange={(e) => setData('pendidikan', e.target.value)} className={inputClass}>
                                    {EDUCATION_LEVELS.map((e) => <option key={e} value={e}>{e === 'tidak_sekolah' ? 'Tidak Sekolah' : e}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Pekerjaan</label>
                                <input type="text" value={data.pekerjaan} onChange={(e) => setData('pekerjaan', e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Hubungan Keluarga *</label>
                                <select value={data.hubungan_keluarga} onChange={(e) => setData('hubungan_keluarga', e.target.value)} className={inputClass}>
                                    {Object.entries(FAMILY_RELATIONS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kartu Keluarga</label>
                                <div className="flex gap-2">
                                    <select value={data.family_card_id} onChange={(e) => setData('family_card_id', e.target.value)} className={inputClass}>
                                        <option value="">-- Pilih KK --</option>
                                        {localFamilyCards.map((fc) => <option key={fc.id} value={fc.id}>{fc.no_kk}</option>)}
                                    </select>
                                    <button 
                                        type="button" 
                                        onClick={() => setShowKkModal(true)}
                                        className="shrink-0 px-3 py-2.5 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 flex items-center gap-1 transition-colors"
                                    >
                                        <Plus size={16} /> KK Baru
                                    </button>
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Alamat Sekarang</label>
                                <textarea value={data.alamat_sekarang} onChange={(e) => setData('alamat_sekarang', e.target.value)} rows={2} className={inputClass} />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-4">
                        <Link href={route('rt.residents')} className="px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">Batal</Link>
                        <button type="submit" disabled={processing} className="inline-flex items-center px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold shadow-sm disabled:opacity-50 transition-colors">
                            {processing ? 'Menyimpan...' : (isEdit ? 'Perbarui' : 'Simpan')}
                        </button>
                    </div>
                </form>
            </div>

            {/* Quick Add KK Modal */}
            {showKkModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
                        <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-sm transition-opacity" onClick={() => setShowKkModal(false)} />
                        
                        <div className="relative transform overflow-hidden rounded-xl bg-white dark:bg-slate-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md border border-slate-200 dark:border-slate-700">
                            <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Plus size={20} className="text-blue-600" />
                                    Tambah Kartu Keluarga
                                </h3>
                                <button onClick={() => setShowKkModal(false)} className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300">
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleQuickStoreKk}>
                                <div className="px-6 py-5 space-y-4">
                                    {kkError && (
                                        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm p-3 rounded-lg border border-red-100 dark:border-red-900/50">
                                            {kkError}
                                        </div>
                                    )}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nomor Kartu Keluarga *</label>
                                        <input 
                                            type="text" 
                                            value={kkForm.no_kk} 
                                            onChange={(e) => setKkForm({...kkForm, no_kk: e.target.value})}
                                            maxLength={16}
                                            required
                                            className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-blue-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50 font-mono"
                                            placeholder="16 digit No. KK"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Alamat KK *</label>
                                        <textarea 
                                            value={kkForm.alamat} 
                                            onChange={(e) => setKkForm({...kkForm, alamat: e.target.value})}
                                            rows={3}
                                            required
                                            className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-blue-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50"
                                            placeholder="Contoh: Jl. Sukamaju No. 1 RT 001/RW 001"
                                        />
                                    </div>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
                                    <button 
                                        type="button" 
                                        onClick={() => setShowKkModal(false)}
                                        className="px-4 py-2 font-semibold text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={savingKk || !kkForm.no_kk || !kkForm.alamat}
                                        className="px-5 py-2 font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors disabled:opacity-50 inline-flex items-center gap-2"
                                    >
                                        {savingKk ? 'Menyimpan...' : 'Simpan KK'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </RtLayout>
    );
}
