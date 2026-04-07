import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Save, ArrowLeft } from 'lucide-react';

export default function Form({ letterType, templates = [] }) {
    const isEdit = !!letterType;

    const { data, setData, post, put, processing, errors } = useForm({
        name: letterType?.name || '',
        code: letterType?.code || '',
        description: letterType?.description || '',
        template_id: letterType?.template_id || '',
        requires_rt_approval: letterType?.requires_rt_approval ?? true,
        is_active: letterType?.is_active ?? true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('admin.letter-types.update', letterType.id));
        } else {
            post(route('admin.letter-types.store'));
        }
    };

    return (
        <AdminLayout header={isEdit ? 'Edit Jenis Surat' : 'Tambah Jenis Surat'}>
            <Head title={isEdit ? 'Edit Jenis Surat' : 'Tambah Jenis Surat'} />

            <div className="mb-6">
                <Link href={route('admin.letter-types.index')} className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-colors">
                    <ArrowLeft size={16} /> Kembali
                </Link>
            </div>

            <div className="max-w-2xl">
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700/60 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{isEdit ? 'Ubah Jenis Surat' : 'Jenis Surat Baru'}</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nama Jenis Surat *</label>
                            <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50" placeholder="Surat Keterangan Domisili" />
                            {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kode *</label>
                            <input type="text" value={data.code} onChange={(e) => setData('code', e.target.value.toUpperCase())} className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50 font-mono" placeholder="SKD" maxLength={20} />
                            {errors.code && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.code}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Deskripsi</label>
                            <textarea value={data.description} onChange={(e) => setData('description', e.target.value)} rows={3} className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50" placeholder="Deskripsi singkat..." />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Template Surat</label>
                            <select value={data.template_id} onChange={(e) => setData('template_id', e.target.value)} className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50">
                                <option value="">-- Tidak menggunakan template --</option>
                                {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <input type="checkbox" id="requires_rt" checked={data.requires_rt_approval} onChange={(e) => setData('requires_rt_approval', e.target.checked)} className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-emerald-600 dark:text-emerald-400 focus:ring-emerald-600" />
                                <label htmlFor="requires_rt" className="text-sm font-medium text-slate-700 dark:text-slate-300">Memerlukan persetujuan RT/RW</label>
                            </div>
                            <div className="flex items-center gap-3">
                                <input type="checkbox" id="is_active" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} className="h-4 w-4 rounded border-slate-300 dark:border-slate-600 text-emerald-600 dark:text-emerald-400 focus:ring-emerald-600" />
                                <label htmlFor="is_active" className="text-sm font-medium text-slate-700 dark:text-slate-300">Aktif (dapat digunakan warga)</label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                            <Link href={route('admin.letter-types.index')} className="rounded-lg bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">Batal</Link>
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
