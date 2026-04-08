import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import RtLayout from '@/Layouts/RtLayout';
import { GENDER_LABELS, FAMILY_RELATIONS } from '@/Helpers/constants';

export default function FormBirth({ familyCards }) {
    const { data, setData, post, processing, errors } = useForm({
        nama_bayi: '', jenis_kelamin: 'L', tempat_lahir: '', tanggal_lahir: '',
        family_card_id: '', hubungan_keluarga: 'anak', keterangan: '',
    });
    const handleSubmit = (e) => { e.preventDefault(); post(route('rt.mutations.store-birth')); };
    const inputClass = "block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-blue-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50";

    return (
        <RtLayout header="Input Data Kelahiran"><Head title="Data Kelahiran" />
            <div className="max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-4">Data Kelahiran Baru</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nama Bayi *</label><input type="text" value={data.nama_bayi} onChange={(e) => setData('nama_bayi', e.target.value)} className={inputClass} />{errors.nama_bayi && <p className="mt-1 text-sm text-red-600">{errors.nama_bayi}</p>}</div>
                        <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Jenis Kelamin *</label><select value={data.jenis_kelamin} onChange={(e) => setData('jenis_kelamin', e.target.value)} className={inputClass}>{Object.entries(GENDER_LABELS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}</select></div>
                        <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tempat Lahir *</label><input type="text" value={data.tempat_lahir} onChange={(e) => setData('tempat_lahir', e.target.value)} className={inputClass} />{errors.tempat_lahir && <p className="mt-1 text-sm text-red-600">{errors.tempat_lahir}</p>}</div>
                        <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tanggal Lahir *</label><input type="date" value={data.tanggal_lahir} onChange={(e) => setData('tanggal_lahir', e.target.value)} className={inputClass} />{errors.tanggal_lahir && <p className="mt-1 text-sm text-red-600">{errors.tanggal_lahir}</p>}</div>
                        <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kartu Keluarga *</label><select value={data.family_card_id} onChange={(e) => setData('family_card_id', e.target.value)} className={inputClass}><option value="">-- Pilih KK --</option>{familyCards.map((fc) => <option key={fc.id} value={fc.id}>{fc.no_kk} - {fc.kepala_keluarga?.nama_lengkap}</option>)}</select>{errors.family_card_id && <p className="mt-1 text-sm text-red-600">{errors.family_card_id}</p>}</div>
                        <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Hubungan Keluarga *</label><select value={data.hubungan_keluarga} onChange={(e) => setData('hubungan_keluarga', e.target.value)} className={inputClass}>{Object.entries(FAMILY_RELATIONS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}</select></div>
                    </div>
                    <div><label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Keterangan</label><textarea value={data.keterangan} onChange={(e) => setData('keterangan', e.target.value)} rows={2} className={inputClass} /></div>
                    <div className="flex justify-end gap-4 pt-4">
                        <Link href={route('rt.mutations.index')} className="px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300">Batal</Link>
                        <button type="submit" disabled={processing} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-bold shadow-sm disabled:opacity-50">{processing ? 'Menyimpan...' : 'Simpan Data Kelahiran'}</button>
                    </div>
                </form>
            </div>
        </RtLayout>
    );
}
