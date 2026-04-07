import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Save, ArrowLeft } from 'lucide-react';
import TiptapEditor from '@/Components/TiptapEditor';

export default function Editor({ template, readOnly = false }) {
    const isEdit = !!template;

    const { data, setData, post, put, processing, errors } = useForm({
        name: template?.name || '',
        body_template: template?.body_template || defaultTemplate(),
        footer_text: template?.footer_text || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('admin.letter-templates.update', template.id));
        } else {
            post(route('admin.letter-templates.store'));
        }
    };

    return (
        <AdminLayout header={readOnly ? 'Lihat Template' : (isEdit ? 'Edit Template' : 'Buat Template')}>
            <Head title={readOnly ? 'Lihat Template' : (isEdit ? 'Edit Template' : 'Buat Template')} />

            <div className="mb-6">
                <Link href={route('admin.letter-templates.index')} className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-colors">
                    <ArrowLeft size={16} /> Kembali
                </Link>
            </div>

            <div className="max-w-4xl">
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700/60 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                            {readOnly ? template?.name : 'Editor Template Surat'}
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Gunakan placeholder: {'{{nama}}, {{nik}}, {{alamat}}, {{tempat_lahir}}, {{tanggal_lahir}}, {{pekerjaan}}, {{agama}}, {{keperluan}}, {{tanggal}}, {{nomor_surat}}'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nama Template *</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                disabled={readOnly}
                                className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50 disabled:bg-slate-100 dark:bg-slate-700"
                                placeholder="Contoh: Surat Keterangan Domisili"
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Body Template (HTML) *</label>
                            <TiptapEditor
                                value={data.body_template}
                                onChange={(html) => setData('body_template', html)}
                                disabled={readOnly}
                            />
                            {errors.body_template && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.body_template}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Footer Text</label>
                            <textarea
                                value={data.footer_text}
                                onChange={(e) => setData('footer_text', e.target.value)}
                                disabled={readOnly}
                                rows={3}
                                className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50 disabled:bg-slate-100 dark:bg-slate-700"
                                placeholder="Teks footer surat (opsional)..."
                            />
                        </div>

                        {!readOnly && (
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                                <Link href={route('admin.letter-templates.index')} className="rounded-lg bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                    Batal
                                </Link>
                                <button type="submit" disabled={processing} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors disabled:opacity-50">
                                    <Save size={16} />
                                    {processing ? 'Menyimpan...' : 'Simpan Template'}
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}

function defaultTemplate() {
    return `<div style="font-family: 'Times New Roman', serif; font-size: 12pt; line-height: 1.6;">
    <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="margin: 0; text-transform: uppercase; letter-spacing: 2px;">SURAT KETERANGAN</h2>
        <p style="margin: 5px 0;">Nomor: {{nomor_surat}}</p>
    </div>
    
    <p>Yang bertanda tangan di bawah ini, Kepala Desa {{nama_desa}}, Kecamatan {{kecamatan}}, Kabupaten {{kabupaten}}, Provinsi {{provinsi}}, menerangkan bahwa:</p>
    
    <table style="margin: 15px 0 15px 30px;">
        <tr><td style="width: 160px;">Nama</td><td>: {{nama}}</td></tr>
        <tr><td>NIK</td><td>: {{nik}}</td></tr>
        <tr><td>Tempat, Tgl Lahir</td><td>: {{tempat_lahir}}, {{tanggal_lahir}}</td></tr>
        <tr><td>Pekerjaan</td><td>: {{pekerjaan}}</td></tr>
        <tr><td>Agama</td><td>: {{agama}}</td></tr>
        <tr><td>Alamat</td><td>: {{alamat}}</td></tr>
    </table>
    
    <p>Adalah benar warga desa kami yang beralamat sebagaimana tersebut di atas.</p>
    <p>Surat keterangan ini dibuat untuk keperluan: <strong>{{keperluan}}</strong></p>
    <p>Demikian surat keterangan ini dibuat untuk dapat dipergunakan sebagaimana mestinya.</p>
    
    <div style="text-align: right; margin-top: 40px;">
        <p>{{nama_desa}}, {{tanggal}}</p>
        <p>Kepala Desa {{nama_desa}}</p>
        <br/><br/><br/>
        <p style="text-decoration: underline;"><strong>{{nama_kades}}</strong></p>
    </div>
</div>`;
}
