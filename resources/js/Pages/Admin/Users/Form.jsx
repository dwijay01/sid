import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Save, ArrowLeft } from 'lucide-react';
import { ROLE_LABELS } from '@/Helpers/constants';

export default function Form({ user, roles = [], wilayah = [] }) {
    const isEdit = !!user;

    const { data, setData, post, put, processing, errors } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        nik: user?.nik || '',
        no_kk: user?.no_kk || '',
        phone: user?.phone || '',
        password: '',
        password_confirmation: '',
        role: user?.role_name || 'warga',
        is_active: user?.is_active ?? true,
        wilayah_id: user?.wilayah_id || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('admin.users.update', user.id));
        } else {
            post(route('admin.users.store'));
        }
    };

    return (
        <AdminLayout header={isEdit ? 'Edit User' : 'Tambah User'}>
            <Head title={isEdit ? 'Edit User' : 'Tambah User'} />

            <div className="mb-6">
                <Link href={route('admin.users.index')} className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-colors">
                    <ArrowLeft size={16} /> Kembali
                </Link>
            </div>

            <div className="max-w-2xl">
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700/60 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{isEdit ? 'Ubah Data User' : 'User Baru'}</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nama Lengkap *</label>
                            <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50" placeholder="Nama lengkap" />
                            {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email *</label>
                            <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50" placeholder="email@example.com" />
                            {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">NIK</label>
                                <input type="text" value={data.nik} onChange={(e) => setData('nik', e.target.value)} className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50 font-mono" placeholder="16 digit NIK" maxLength={16} />
                                {errors.nik && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.nik}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">No. KK</label>
                                <input type="text" value={data.no_kk} onChange={(e) => setData('no_kk', e.target.value)} className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50 font-mono" placeholder="16 digit No. KK" maxLength={16} />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">No. Telepon</label>
                            <input type="text" value={data.phone} onChange={(e) => setData('phone', e.target.value)} className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50" placeholder="08xxxxxxxxxx" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role *</label>
                            <select value={data.role} onChange={(e) => setData('role', e.target.value)} className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50">
                                {roles.map((r) => <option key={r.id} value={r.name}>{ROLE_LABELS[r.name] || r.name}</option>)}
                            </select>
                            {errors.role && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.role}</p>}
                        </div>

                        {(data.role === 'rt' || data.role === 'rw' || data.role === 'sie_rukem' || data.role === 'sie_pemberdayaan') && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Wilayah Kerja *</label>
                                <select 
                                    value={data.wilayah_id} 
                                    onChange={(e) => setData('wilayah_id', e.target.value)} 
                                    className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50"
                                >
                                    <option value="">Pilih Wilayah</option>
                                    {wilayah.map((w) => (
                                        <option key={w.id} value={w.id}>
                                            RT {w.rt} / RW {w.rw} {w.dusun ? `(${w.dusun})` : ''}
                                        </option>
                                    ))}
                                </select>
                                {errors.wilayah_id && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.wilayah_id}</p>}
                                <p className="mt-1 text-xs text-slate-500 italic">
                                    {data.role === 'rt' ? 'Pilih unit RT spesifik.' : 'Pilih salah satu RT di wilayah RW yang bersangkutan untuk menautkan akun.'}
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Password {isEdit ? '(kosongkan jika tidak diubah)' : '*'}
                                </label>
                                <input type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50" placeholder="••••••••" />
                                {errors.password && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Konfirmasi Password</label>
                                <input type="password" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50" placeholder="••••••••" />
                            </div>
                        </div>

                        {isEdit && (
                            <div className="flex items-center gap-3">
                                <input type="checkbox" id="is_active" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-emerald-600 dark:text-emerald-400 focus:ring-emerald-600" />
                                <label htmlFor="is_active" className="text-sm font-medium text-slate-700 dark:text-slate-300">Akun Aktif</label>
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                            <Link href={route('admin.users.index')} className="rounded-lg bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">Batal</Link>
                            <button type="submit" disabled={processing} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors disabled:opacity-50">
                                <Save size={16} /> {processing ? 'Menyimpan...' : 'Simpan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
