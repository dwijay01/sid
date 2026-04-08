import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import RtLayout from '@/Layouts/RtLayout';
import { RUKEM_STATUS } from '@/Helpers/constants';

export default function Form({ member, residents = [] }) {
    const isEdit = !!member;
    const { data, setData, post, put, processing, errors } = useForm({
        resident_id: member?.resident_id || '',
        tanggal_gabung: member?.tanggal_gabung?.split('T')[0] || '',
        status_keanggotaan: member?.status_keanggotaan || 'aktif',
        keterangan: member?.keterangan || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('rt.rukem.update', member.id));
        } else {
            post(route('rt.rukem.store'));
        }
    };

    const inputClass = "block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-blue-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50";

    return (
        <RtLayout header={isEdit ? 'Edit Anggota Rukem' : 'Tambah Anggota Rukem'}>
            <Head title={isEdit ? 'Edit Anggota Rukem' : 'Tambah Anggota Rukem'} />

            <div className="max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 space-y-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-4">
                        {isEdit ? `Edit Anggota: ${member.resident?.nama_lengkap}` : 'Pendaftaran Anggota Rukun Kematian'}
                    </h3>

                    {!isEdit && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Pilih Warga *</label>
                            <select value={data.resident_id} onChange={(e) => setData('resident_id', e.target.value)} className={inputClass}>
                                <option value="">-- Pilih Warga yang belum terdaftar --</option>
                                {residents.map((r) => (
                                    <option key={r.id} value={r.id}>{r.nama_lengkap} ({r.nik})</option>
                                ))}
                            </select>
                            {errors.resident_id && <p className="mt-1 text-sm text-red-600">{errors.resident_id}</p>}
                            {residents.length === 0 && (
                                <p className="mt-2 text-sm text-amber-600 dark:text-amber-400">Semua warga di RT Anda sudah terdaftar sebagai anggota Rukem.</p>
                            )}
                        </div>
                    )}

                    {!isEdit && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tanggal Bergabung *</label>
                            <input type="date" value={data.tanggal_gabung} onChange={(e) => setData('tanggal_gabung', e.target.value)} className={inputClass} />
                            {errors.tanggal_gabung && <p className="mt-1 text-sm text-red-600">{errors.tanggal_gabung}</p>}
                        </div>
                    )}

                    {isEdit && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status Keanggotaan *</label>
                            <select value={data.status_keanggotaan} onChange={(e) => setData('status_keanggotaan', e.target.value)} className={inputClass}>
                                {Object.entries(RUKEM_STATUS).map(([k, v]) => (
                                    <option key={k} value={k}>{v}</option>
                                ))}
                            </select>
                            {errors.status_keanggotaan && <p className="mt-1 text-sm text-red-600">{errors.status_keanggotaan}</p>}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Keterangan</label>
                        <textarea value={data.keterangan} onChange={(e) => setData('keterangan', e.target.value)} rows={3} className={inputClass} placeholder="Catatan tambahan (opsional)" />
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <Link href={route('rt.rukem.index')} className="px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900">Batal</Link>
                        <button type="submit" disabled={processing} className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-sm font-bold shadow-sm disabled:opacity-50 transition-colors">
                            {processing ? 'Menyimpan...' : (isEdit ? 'Perbarui' : 'Daftarkan Anggota')}
                        </button>
                    </div>
                </form>
            </div>
        </RtLayout>
    );
}
