import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Save, ArrowLeft } from 'lucide-react';

export default function Form({ familyCard, residents, wilayah }) {
    const isEdit = !!familyCard;
    
    const { data, setData, post, put, processing, errors } = useForm({
        no_kk: familyCard?.no_kk || '',
        kepala_keluarga_id: familyCard?.kepala_keluarga_id || '',
        wilayah_id: familyCard?.wilayah_id || '',
        alamat: familyCard?.alamat || '',
        kode_pos: familyCard?.kode_pos || '',
        status: familyCard?.status || 'aktif',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (isEdit) {
            put(route('admin.family-cards.update', familyCard.id));
        } else {
            post(route('admin.family-cards.store'));
        }
    };

    return (
        <AdminLayout header={isEdit ? "Edit Kartu Keluarga" : "Tambah Kartu Keluarga"}>
            <Head title={isEdit ? "Edit KK" : "Tambah KK"} />

            <div className="mb-6 flex items-center justify-between">
                <Link 
                    href={route('admin.family-cards.index')} 
                    className="flex items-center text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:text-emerald-400 transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali
                </Link>
            </div>

            <div className="glass bg-white dark:bg-slate-800 p-6 shadow-sm rounded-xl">
                <form onSubmit={handleSubmit}>
                    <div className="space-y-12">
                        <div className="border-b border-slate-900/10 pb-12">
                            <h2 className="text-base font-semibold leading-7 text-slate-900 dark:text-white">
                                Profil Kartu Keluarga
                            </h2>
                            <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                Buat entitas pengelompokkan Kartu Keluarga yang akan menampung data Anggota Keluarga.
                            </p>

                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                <div className="sm:col-span-3">
                                    <label htmlFor="no_kk" className="block text-sm font-medium leading-6 text-slate-900 dark:text-white">Nomor Induk Keluarga (No KK)</label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            id="no_kk"
                                            value={data.no_kk}
                                            onChange={e => setData('no_kk', e.target.value)}
                                            className={`block w-full rounded-md border-0 py-2 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ${errors.no_kk ? 'ring-red-500 focus:ring-red-500' : 'ring-slate-300 dark:ring-slate-700 focus:ring-emerald-600'} sm:text-sm sm:leading-6 bg-slate-50 dark:bg-slate-800/50`}
                                            maxLength={16}
                                        />
                                        {errors.no_kk && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.no_kk}</p>}
                                    </div>
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="kepala_keluarga_id" className="block text-sm font-medium leading-6 text-slate-900 dark:text-white">Kepala Keluarga</label>
                                    <div className="mt-2">
                                        <select
                                            id="kepala_keluarga_id"
                                            value={data.kepala_keluarga_id}
                                            onChange={e => setData('kepala_keluarga_id', e.target.value)}
                                            className={`block w-full rounded-md border-0 py-2 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ${errors.kepala_keluarga_id ? 'ring-red-500 focus:ring-red-500' : 'ring-slate-300 dark:ring-slate-700 focus:ring-emerald-600'} sm:text-sm sm:leading-6 bg-slate-50 dark:bg-slate-800/50`}
                                        >
                                            <option value="">- Pilih Kepala Keluarga -</option>
                                            {residents.map(r => (
                                                <option key={r.id} value={r.id}>{r.nik} - {r.nama_lengkap}</option>
                                            ))}
                                        </select>
                                        {errors.kepala_keluarga_id && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.kepala_keluarga_id}</p>}
                                        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                                            *(Penduduk yang dipilih otomatis akan disetel hubungannya sebagai Kepala Keluarga.)
                                        </p>
                                    </div>
                                </div>

                                <div className="col-span-full">
                                    <label htmlFor="alamat" className="block text-sm font-medium leading-6 text-slate-900 dark:text-white">Alamat Lengkap Rumah</label>
                                    <div className="mt-2">
                                        <textarea
                                            id="alamat"
                                            rows={3}
                                            value={data.alamat}
                                            onChange={e => setData('alamat', e.target.value)}
                                            className={`block w-full rounded-md border-0 py-2 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ${errors.alamat ? 'ring-red-500 focus:ring-red-500' : 'ring-slate-300 dark:ring-slate-700 focus:ring-emerald-600'} sm:text-sm sm:leading-6 bg-slate-50 dark:bg-slate-800/50`}
                                        />
                                        {errors.alamat && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.alamat}</p>}
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="wilayah_id" className="block text-sm font-medium leading-6 text-slate-900 dark:text-white">Wilayah (RT/RW)</label>
                                    <div className="mt-2">
                                        <select
                                            id="wilayah_id"
                                            value={data.wilayah_id}
                                            onChange={e => setData('wilayah_id', e.target.value)}
                                            className={`block w-full rounded-md border-0 py-2 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ${errors.wilayah_id ? 'ring-red-500 focus:ring-red-500' : 'ring-slate-300 dark:ring-slate-700 focus:ring-emerald-600'} sm:text-sm sm:leading-6 bg-slate-50 dark:bg-slate-800/50`}
                                        >
                                            <option value="">- Pilih RT/RW -</option>
                                            {wilayah.map(w => (
                                                <option key={w.id} value={w.id}>RT {w.rt} / RW {w.rw}</option>
                                            ))}
                                        </select>
                                        {errors.wilayah_id && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.wilayah_id}</p>}
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="kode_pos" className="block text-sm font-medium leading-6 text-slate-900 dark:text-white">Kode Pos</label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            id="kode_pos"
                                            value={data.kode_pos}
                                            onChange={e => setData('kode_pos', e.target.value)}
                                            className={`block w-full rounded-md border-0 py-2 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ${errors.kode_pos ? 'ring-red-500 focus:ring-red-500' : 'ring-slate-300 dark:ring-slate-700 focus:ring-emerald-600'} sm:text-sm sm:leading-6 bg-slate-50 dark:bg-slate-800/50`}
                                        />
                                    </div>
                                </div>
                                
                                {isEdit && (
                                    <div className="sm:col-span-2">
                                        <label htmlFor="status" className="block text-sm font-medium leading-6 text-slate-900 dark:text-white">Status KK</label>
                                        <div className="mt-2">
                                            <select
                                                id="status"
                                                value={data.status}
                                                onChange={e => setData('status', e.target.value)}
                                                className={`block w-full rounded-md border-0 py-2 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ${errors.status ? 'ring-red-500 focus:ring-red-500' : 'ring-slate-300 dark:ring-slate-700 focus:ring-emerald-600'} sm:text-sm sm:leading-6 bg-slate-50 dark:bg-slate-800/50`}
                                            >
                                                <option value="aktif">Aktif</option>
                                                <option value="pecah_kk">Pecah KK</option>
                                                <option value="pindah">Pindah Domisili</option>
                                                <option value="hilang">Hilang</option>
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <Link href={route('admin.family-cards.index')} className="text-sm font-semibold leading-6 text-slate-900 dark:text-white">
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-md bg-emerald-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 flex items-center gap-2 disabled:opacity-75"
                        >
                            <Save size={18} />
                            {processing ? 'Menyimpan...' : 'Simpan Data'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
