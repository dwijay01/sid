import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import RtLayout from '@/Layouts/RtLayout';
import { RELIGIONS, GENDER_LABELS, FAMILY_RELATIONS } from '@/Helpers/constants';

export default function FormMoveIn({ familyCards }) {
    const { data, setData, post, processing, errors } = useForm({
        nama_lengkap: '', nik: '', tempat_lahir: '', tanggal_lahir: '', jenis_kelamin: 'L', agama: 'Islam',
        family_card_id: '', hubungan_keluarga: 'kepala', asal_tujuan: '', tanggal_mutasi: '', keterangan: '',
    });
    const handleSubmit = (e) => { e.preventDefault(); post(route('rt.mutations.store-move-in')); };
    const inputClass = "block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-blue-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50";

    return (
        <RtLayout header="Input Warga Masuk"><Head title="Warga Masuk" />
            <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-4">Data Warga Masuk</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">NIK *</label><input type="text" value={data.nik} onChange={(e) => setData('nik', e.target.value)} maxLength={16} className={inputClass} />{errors.nik && <p className="mt-1 text-sm text-red-600">{errors.nik}</p>}</div>
                        <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nama Lengkap *</label><input type="text" value={data.nama_lengkap} onChange={(e) => setData('nama_lengkap', e.target.value)} className={inputClass} />{errors.nama_lengkap && <p className="mt-1 text-sm text-red-600">{errors.nama_lengkap}</p>}</div>
                        <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tempat Lahir *</label><input type="text" value={data.tempat_lahir} onChange={(e) => setData('tempat_lahir', e.target.value)} className={inputClass} />{errors.tempat_lahir && <p className="mt-1 text-sm text-red-600">{errors.tempat_lahir}</p>}</div>
                        <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tanggal Lahir *</label><input type="date" value={data.tanggal_lahir} onChange={(e) => setData('tanggal_lahir', e.target.value)} className={inputClass} />{errors.tanggal_lahir && <p className="mt-1 text-sm text-red-600">{errors.tanggal_lahir}</p>}</div>
                        <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Jenis Kelamin *</label><select value={data.jenis_kelamin} onChange={(e) => setData('jenis_kelamin', e.target.value)} className={inputClass}>{Object.entries(GENDER_LABELS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}</select></div>
                        <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Agama *</label><select value={data.agama} onChange={(e) => setData('agama', e.target.value)} className={inputClass}>{RELIGIONS.map((r) => <option key={r} value={r}>{r}</option>)}</select></div>
                        <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kartu Keluarga Tujuan *</label><select value={data.family_card_id} onChange={(e) => setData('family_card_id', e.target.value)} className={inputClass}><option value="">-- Pilih KK --</option>{familyCards.map((fc) => <option key={fc.id} value={fc.id}>{fc.no_kk} - {fc.kepala_keluarga?.nama_lengkap}</option>)}</select>{errors.family_card_id && <p className="mt-1 text-sm text-red-600">{errors.family_card_id}</p>}</div>
                        <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Hubungan Keluarga *</label><select value={data.hubungan_keluarga} onChange={(e) => setData('hubungan_keluarga', e.target.value)} className={inputClass}>{Object.entries(FAMILY_RELATIONS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}</select></div>
                        <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Asal Pindah *</label><input type="text" value={data.asal_tujuan} onChange={(e) => setData('asal_tujuan', e.target.value)} className={inputClass} />{errors.asal_tujuan && <p className="mt-1 text-sm text-red-600">{errors.asal_tujuan}</p>}</div>
                        <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tanggal Masuk *</label><input type="date" value={data.tanggal_mutasi} onChange={(e) => setData('tanggal_mutasi', e.target.value)} className={inputClass} />{errors.tanggal_mutasi && <p className="mt-1 text-sm text-red-600">{errors.tanggal_mutasi}</p>}</div>
                    </div>
                    <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Keterangan</label><textarea value={data.keterangan} onChange={(e) => setData('keterangan', e.target.value)} rows={2} className={inputClass} /></div>
                    <div className="flex justify-end gap-4 pt-4">
                        <Link href={route('rt.mutations.index')} className="px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300">Batal</Link>
                        <button type="submit" disabled={processing} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold shadow-sm disabled:opacity-50">{processing ? 'Menyimpan...' : 'Simpan Data Masuk'}</button>
                    </div>
                </form>
            </div>
        </RtLayout>
    );
}
