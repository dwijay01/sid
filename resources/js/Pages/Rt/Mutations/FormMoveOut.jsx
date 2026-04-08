import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import RtLayout from '@/Layouts/RtLayout';

export default function FormMoveOut({ residents }) {
    const { data, setData, post, processing, errors } = useForm({
        resident_id: '', tanggal_mutasi: '', asal_tujuan: '', keterangan: '',
    });
    const handleSubmit = (e) => { e.preventDefault(); post(route('rt.mutations.store-move-out')); };
    const inputClass = "block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-blue-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50";

    return (
        <RtLayout header="Input Warga Pindah Keluar"><Head title="Warga Pindah" />
            <div className="max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-4">Data Warga Pindah Keluar</h3>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Pilih Warga *</label>
                        <select value={data.resident_id} onChange={(e) => setData('resident_id', e.target.value)} className={inputClass}>
                            <option value="">-- Pilih Warga --</option>
                            {residents.map((r) => <option key={r.id} value={r.id}>{r.nama_lengkap} ({r.nik})</option>)}
                        </select>
                        {errors.resident_id && <p className="mt-1 text-sm text-red-600">{errors.resident_id}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tanggal Pindah *</label>
                        <input type="date" value={data.tanggal_mutasi} onChange={(e) => setData('tanggal_mutasi', e.target.value)} className={inputClass} />
                        {errors.tanggal_mutasi && <p className="mt-1 text-sm text-red-600">{errors.tanggal_mutasi}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tujuan Pindah *</label>
                        <input type="text" value={data.asal_tujuan} onChange={(e) => setData('asal_tujuan', e.target.value)} className={inputClass} placeholder="Contoh: Kota Semarang" />
                        {errors.asal_tujuan && <p className="mt-1 text-sm text-red-600">{errors.asal_tujuan}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Keterangan</label>
                        <textarea value={data.keterangan} onChange={(e) => setData('keterangan', e.target.value)} rows={3} className={inputClass} />
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <Link href={route('rt.mutations.index')} className="px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300">Batal</Link>
                        <button type="submit" disabled={processing} className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-sm font-bold shadow-sm disabled:opacity-50">{processing ? 'Menyimpan...' : 'Simpan Data Pindah'}</button>
                    </div>
                </form>
            </div>
        </RtLayout>
    );
}
