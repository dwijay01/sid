import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, Send, PenTool, AlertTriangle } from 'lucide-react';

export default function WalkIn({ residents, letterTypes }) {
    const { data, setData, post, processing, errors } = useForm({
        resident_id: '',
        letter_type_id: '',
        keperluan: '',
        keterangan_tambahan: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.letters.storeWalkIn'));
    };

    return (
        <AdminLayout header="Kiosk Pelayanan Terpadu (Walk-In)">
            <Head title="Pelayanan Walk-In" />

            <div className="mb-6 flex items-center justify-between">
                <Link 
                    href={route('admin.dashboard')} 
                    className="inline-flex items-center text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:text-emerald-400 transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke Dashboard
                </Link>
            </div>

            <div className="mx-auto max-w-3xl">
                <div className="bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 border p-5 mb-6 rounded-xl shadow-sm relative overflow-hidden">
                    <div className="flex z-10 relative">
                        <div className="flex-shrink-0">
                            <PenTool className="h-6 w-6 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-bold text-emerald-800">Layanan Pembuatan Langsung Administrasi</h3>
                            <p className="text-sm text-emerald-700 mt-1">
                                Fitur ini digunakan apabila warga datang langsung (Walk-in) ke Balai Desa. Pengajuan ini akan membypass layer verifikasi RT/RW dan langsung diteruskan untuk ditandatangani oleh Kepala Desa.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="glass bg-white dark:bg-slate-800 p-8 shadow-sm rounded-2xl border border-slate-100 dark:border-slate-700">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="resident_id" className="block text-sm font-semibold text-slate-900 dark:text-white">
                                Warga Pemohon <span className="text-red-500">*</span>
                            </label>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Pilih nama atau NIK warga yang bersangkutan.</p>
                            <select
                                id="resident_id"
                                value={data.resident_id}
                                onChange={e => setData('resident_id', e.target.value)}
                                className={`block w-full rounded-lg border-0 py-3 px-4 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ${errors.resident_id ? 'ring-red-500 focus:ring-red-500' : 'ring-slate-300 dark:ring-slate-700 focus:ring-emerald-600'} sm:text-sm bg-slate-50 dark:bg-slate-800/50`}
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
                                Jenis Surat Pengantar / Keterangan <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="letter_type_id"
                                value={data.letter_type_id}
                                onChange={e => setData('letter_type_id', e.target.value)}
                                className={`block w-full rounded-lg border-0 py-3 px-4 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ${errors.letter_type_id ? 'ring-red-500 focus:ring-red-500' : 'ring-slate-300 dark:ring-slate-700 focus:ring-emerald-600'} sm:text-sm bg-slate-50 dark:bg-slate-800/50`}
                                required
                            >
                                <option value="" disabled>-- Pilih Jenis Surat --</option>
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
                                className={`block w-full rounded-lg border-0 py-3 px-4 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ${errors.keperluan ? 'ring-red-500 focus:ring-red-500' : 'ring-slate-300 dark:ring-slate-700 focus:ring-emerald-600'} sm:text-sm bg-slate-50 dark:bg-slate-800/50`}
                                placeholder="Cth: Mengurus pembuatan KTP"
                                required
                            />
                            {errors.keperluan && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.keperluan}</p>}
                        </div>

                        <div>
                            <label htmlFor="keterangan_tambahan" className="block text-sm font-semibold text-slate-900 dark:text-white">
                                Keterangan Tambahan
                            </label>
                            <textarea
                                id="keterangan_tambahan"
                                rows={3}
                                value={data.keterangan_tambahan}
                                onChange={e => setData('keterangan_tambahan', e.target.value)}
                                className={`block w-full rounded-lg border-0 py-3 px-4 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ${errors.keterangan_tambahan ? 'ring-red-500 focus:ring-red-500' : 'ring-slate-300 dark:ring-slate-700 focus:ring-emerald-600'} sm:text-sm bg-slate-50 dark:bg-slate-800/50`}
                                placeholder="Sebutkan catatan opsional..."
                            />
                        </div>

                        <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-end gap-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-8 py-3 text-sm font-bold text-white shadow hover:bg-emerald-500 hover:-translate-y-0.5 transition-all focus-ring-emerald-600 disabled:opacity-75 disabled:hover:translate-y-0"
                            >
                                <Send size={18} />
                                {processing ? 'Memproses...' : 'Proses Pengajuan (Ke Kades)'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
