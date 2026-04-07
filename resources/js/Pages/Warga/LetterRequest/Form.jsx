import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import WargaLayout from '@/Layouts/WargaLayout';
import { ArrowLeft, Send, FileText } from 'lucide-react';

export default function Form({ letterTypes }) {
    const { data, setData, post, processing, errors } = useForm({
        letter_type_id: '',
        keperluan: '',
        keterangan_tambahan: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('warga.letters.store'));
    };

    return (
        <WargaLayout header="Buat Pengajuan Surat">
            <Head title="Pengajuan Surat Baru" />

            <div className="mb-6">
                <Link 
                    href={route('warga.dashboard')} 
                    className="inline-flex items-center text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:text-emerald-400 transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke Dashboard
                </Link>
            </div>

            <div className="mx-auto max-w-3xl">
                <div className="glass bg-white dark:bg-slate-800 p-8 shadow-sm rounded-2xl border border-slate-100 dark:border-slate-700">
                    <div className="border-b border-slate-200 dark:border-slate-700 pb-5 mb-8 flex items-center gap-4">
                        <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
                            <FileText size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Formulir Permohonan</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Lengkapi data di bawah ini untuk mengajukan surat.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="letter_type_id" className="block text-sm font-semibold text-slate-900 dark:text-white">
                                Jenis Surat <span className="text-red-500">*</span>
                            </label>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Pilih jenis surat yang ingin Anda buat.</p>
                            <select
                                id="letter_type_id"
                                value={data.letter_type_id}
                                onChange={e => setData('letter_type_id', e.target.value)}
                                className={`block w-full rounded-lg border-0 py-3 px-4 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ${errors.letter_type_id ? 'ring-red-500 focus:ring-red-500' : 'ring-slate-300 dark:ring-slate-700 focus:ring-emerald-600'} sm:text-sm bg-slate-50 dark:bg-slate-800/50`}
                                required
                            >
                                <option value="" disabled>-- Pilih Surat --</option>
                                {letterTypes.map(type => (
                                    <option key={type.id} value={type.id}>{type.nama_surat} ({type.kode_surat})</option>
                                ))}
                            </select>
                            {errors.letter_type_id && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.letter_type_id}</p>}
                        </div>

                        <div>
                            <label htmlFor="keperluan" className="block text-sm font-semibold text-slate-900 dark:text-white">
                                Keperluan Pengajuan <span className="text-red-500">*</span>
                            </label>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Jelaskan secara singkat tujuan permohonan surat ini. (Contoh: "Persyaratan Melamar Pekerjaan")</p>
                            <input
                                type="text"
                                id="keperluan"
                                value={data.keperluan}
                                onChange={e => setData('keperluan', e.target.value)}
                                className={`block w-full rounded-lg border-0 py-3 px-4 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ${errors.keperluan ? 'ring-red-500 focus:ring-red-500' : 'ring-slate-300 dark:ring-slate-700 focus:ring-emerald-600'} sm:text-sm bg-slate-50 dark:bg-slate-800/50`}
                                placeholder="Masukkan keperluan..."
                                required
                            />
                            {errors.keperluan && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.keperluan}</p>}
                        </div>

                        <div>
                            <label htmlFor="keterangan_tambahan" className="block text-sm font-semibold text-slate-900 dark:text-white">
                                Keterangan Tambahan <span className="text-slate-400 font-normal">(Opsional)</span>
                            </label>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Tambahkan catatan lain jika diperlukan oleh staf desa.</p>
                            <textarea
                                id="keterangan_tambahan"
                                rows={4}
                                value={data.keterangan_tambahan}
                                onChange={e => setData('keterangan_tambahan', e.target.value)}
                                className={`block w-full rounded-lg border-0 py-3 px-4 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ${errors.keterangan_tambahan ? 'ring-red-500 focus:ring-red-500' : 'ring-slate-300 dark:ring-slate-700 focus:ring-emerald-600'} sm:text-sm bg-slate-50 dark:bg-slate-800/50`}
                                placeholder="Opsional..."
                            />
                            {errors.keterangan_tambahan && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.keterangan_tambahan}</p>}
                        </div>

                        <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-end gap-4">
                            <Link 
                                href={route('warga.dashboard')}
                                className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white transition-colors"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-8 py-3 text-sm font-bold text-white shadow hover:bg-emerald-500 hover:-translate-y-0.5 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:opacity-75 disabled:hover:translate-y-0"
                            >
                                <Send size={18} />
                                {processing ? 'Mengirim...' : 'Kirim Pengajuan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </WargaLayout>
    );
}
