import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import RtRwLayout from '@/Layouts/RtRwLayout';
import { ArrowLeft, Send, FileSignature, AlertCircle } from 'lucide-react';

export default function BypassInput({ letterTypes, residents }) {
    const { data, setData, post, processing, errors } = useForm({
        resident_id: '',
        letter_type_id: '',
        keperluan: '',
        keterangan_tambahan: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('rtrw.bypass.store'));
    };

    return (
        <RtRwLayout header="Bypass Input Permohonan Surat">
            <Head title="Bypass Surat Warga" />

            <div className="mb-6">
                <Link 
                    href={route('rtrw.dashboard')} 
                    className="inline-flex items-center text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:text-blue-400 transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke Dashboard
                </Link>
            </div>

            <div className="mx-auto max-w-3xl">
                <div className="bg-amber-50 dark:bg-amber-900/30 border-l-4 border-amber-500 p-4 mb-6 rounded-r-lg shadow-sm">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-amber-700 font-medium">
                                Bypass Input digunakan apabila warga bermasalah mengakses portal mandiri (contoh: warga lansia). Pengajuan yang dibuat dari form ini akan <strong className="font-bold">otomatis dianggap disetujui (Approved) oleh RT/RW</strong>.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="glass bg-white dark:bg-slate-800 p-8 shadow-sm rounded-2xl border border-slate-100 dark:border-slate-700">
                    <div className="border-b border-slate-200 dark:border-slate-700 pb-5 mb-8 flex items-center gap-4">
                        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
                            <FileSignature size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Formulir Permohonan Langsung</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Lengkapi form ini atas nama warga bersangkutan.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="resident_id" className="block text-sm font-semibold text-slate-900 dark:text-white">
                                Cari Identitas Warga <span className="text-red-500">*</span>
                            </label>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Pilih warga yang membutuhkan surat.</p>
                            <select
                                id="resident_id"
                                value={data.resident_id}
                                onChange={e => setData('resident_id', e.target.value)}
                                className={`block w-full rounded-lg border-0 py-3 px-4 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ${errors.resident_id ? 'ring-red-500 focus:ring-red-500' : 'ring-slate-300 dark:ring-slate-700 focus:ring-blue-600'} sm:text-sm bg-slate-50 dark:bg-slate-800/50`}
                                required
                            >
                                <option value="" disabled>-- Pilih Warga --</option>
                                {residents.map(res => (
                                    <option key={res.id} value={res.id}>{res.nama_lengkap} (NIK: {res.nik})</option>
                                ))}
                            </select>
                            {errors.resident_id && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.resident_id}</p>}
                        </div>

                        <div>
                            <label htmlFor="letter_type_id" className="block text-sm font-semibold text-slate-900 dark:text-white">
                                Jenis Surat <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="letter_type_id"
                                value={data.letter_type_id}
                                onChange={e => setData('letter_type_id', e.target.value)}
                                className={`block w-full rounded-lg border-0 py-3 px-4 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ${errors.letter_type_id ? 'ring-red-500 focus:ring-red-500' : 'ring-slate-300 dark:ring-slate-700 focus:ring-blue-600'} sm:text-sm bg-slate-50 dark:bg-slate-800/50`}
                                required
                            >
                                <option value="" disabled>-- Pilih Surat --</option>
                                {letterTypes.map(type => (
                                    <option key={type.id} value={type.id}>{type.nama_surat}</option>
                                ))}
                            </select>
                            {errors.letter_type_id && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.letter_type_id}</p>}
                        </div>

                        <div>
                            <label htmlFor="keperluan" className="block text-sm font-semibold text-slate-900 dark:text-white">
                                Keperluan Pengajuan <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="keperluan"
                                value={data.keperluan}
                                onChange={e => setData('keperluan', e.target.value)}
                                className={`block w-full rounded-lg border-0 py-3 px-4 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ${errors.keperluan ? 'ring-red-500 focus:ring-red-500' : 'ring-slate-300 dark:ring-slate-700 focus:ring-blue-600'} sm:text-sm bg-slate-50 dark:bg-slate-800/50`}
                                placeholder="Cth: Mengurus BPJS"
                                required
                            />
                            {errors.keperluan && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.keperluan}</p>}
                        </div>

                        <div>
                            <label htmlFor="keterangan_tambahan" className="block text-sm font-semibold text-slate-900 dark:text-white">
                                Keterangan Opsional
                            </label>
                            <textarea
                                id="keterangan_tambahan"
                                rows={3}
                                value={data.keterangan_tambahan}
                                onChange={e => setData('keterangan_tambahan', e.target.value)}
                                className={`block w-full rounded-lg border-0 py-3 px-4 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ${errors.keterangan_tambahan ? 'ring-red-500 focus:ring-red-500' : 'ring-slate-300 dark:ring-slate-700 focus:ring-blue-600'} sm:text-sm bg-slate-50 dark:bg-slate-800/50`}
                                placeholder="..."
                            />
                        </div>

                        <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-end gap-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-3 text-sm font-bold text-white shadow hover:bg-blue-500 hover:-translate-y-0.5 transition-all focus-ring-blue-600 disabled:opacity-75 disabled:hover:translate-y-0"
                            >
                                <Send size={18} />
                                {processing ? 'Memproses...' : 'Kirim & Bypass Persetujuan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </RtRwLayout>
    );
}
