import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Save, ArrowLeft } from 'lucide-react';

export default function Form({ wilayah, rtRwUsers = [] }) {
    const isEdit = !!wilayah;

    const { data, setData, post, put, processing, errors } = useForm({
        rt: wilayah?.rt || '',
        rw: wilayah?.rw || '',
        dusun: wilayah?.dusun || '',
        nama_ketua: wilayah?.nama_ketua || '',
        ketua_user_id: wilayah?.ketua_user_id || '',
        is_active: wilayah?.is_active ?? true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('admin.wilayah.update', wilayah.id));
        } else {
            post(route('admin.wilayah.store'));
        }
    };

    return (
        <AdminLayout header={isEdit ? 'Edit Wilayah' : 'Tambah Wilayah'}>
            <Head title={isEdit ? 'Edit Wilayah' : 'Tambah Wilayah'} />

            <div className="mb-6">
                <Link
                    href={route('admin.wilayah.index')}
                    className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-colors"
                >
                    <ArrowLeft size={16} /> Kembali ke Daftar Wilayah
                </Link>
            </div>

            <div className="max-w-2xl">
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700/60 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                            {isEdit ? 'Ubah Data Wilayah' : 'Data Wilayah Baru'}
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Isi informasi wilayah RT/RW di bawah ini.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">RT *</label>
                                <input
                                    type="text"
                                    value={data.rt}
                                    onChange={(e) => setData('rt', e.target.value)}
                                    className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50"
                                    placeholder="001"
                                    maxLength={3}
                                />
                                {errors.rt && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.rt}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">RW *</label>
                                <input
                                    type="text"
                                    value={data.rw}
                                    onChange={(e) => setData('rw', e.target.value)}
                                    className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50"
                                    placeholder="001"
                                    maxLength={3}
                                />
                                {errors.rw && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.rw}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Dusun</label>
                            <input
                                type="text"
                                value={data.dusun}
                                onChange={(e) => setData('dusun', e.target.value)}
                                className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50"
                                placeholder="Nama Dusun"
                            />
                            {errors.dusun && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.dusun}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nama Ketua RT/RW</label>
                            <input
                                type="text"
                                value={data.nama_ketua}
                                onChange={(e) => setData('nama_ketua', e.target.value)}
                                className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50"
                                placeholder="Nama lengkap ketua"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Akun Ketua (Opsional)</label>
                            <select
                                value={data.ketua_user_id}
                                onChange={(e) => setData('ketua_user_id', e.target.value)}
                                className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50"
                            >
                                <option value="">-- Pilih user --</option>
                                {rtRwUsers.map((u) => (
                                    <option key={u.id} value={u.id}>{u.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-emerald-600 dark:text-emerald-400 focus:ring-emerald-600"
                            />
                            <label htmlFor="is_active" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Wilayah Aktif
                            </label>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                            <Link
                                href={route('admin.wilayah.index')}
                                className="rounded-lg bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors disabled:opacity-50"
                            >
                                <Save size={16} />
                                {processing ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
