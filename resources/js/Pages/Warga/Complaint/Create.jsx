import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import WargaLayout from '@/Layouts/WargaLayout';
import { 
    AlertTriangle, 
    ArrowLeft, 
    MessageSquareWarning, 
    Upload, 
    X,
    EyeOff,
    CheckCircle2
} from 'lucide-react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        category: '',
        description: '',
        attachment: null,
        is_secret: false,
    });

    const [previewUrl, setPreviewUrl] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('attachment', file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const removeFile = () => {
        setData('attachment', null);
        setPreviewUrl(null);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('warga.complaints.store'));
    };

    return (
        <WargaLayout header="Buat Laporan Baru">
            <Head title="Buat Laporan / Pengaduan" />

            <div className="max-w-3xl mx-auto py-8">
                <Link href={route('warga.complaints.index')} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors mb-6">
                    <ArrowLeft className="h-4 w-4" /> Kembali ke Riwayat
                </Link>

                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl overflow-hidden shadow-sm">
                    <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6 sm:p-8 text-white relative">
                        <div className="absolute top-0 right-0 -mr-10 -mt-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
                        <div className="relative z-10 flex items-start gap-4">
                            <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 flex-shrink-0">
                                <MessageSquareWarning className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold">Form Pengaduan & Laporan</h1>
                                <p className="text-amber-100 text-sm mt-1 max-w-lg">Laporan Anda akan ditinjau langsung oleh Ketua RT. Jika status laporan "Diteruskan ke RW", artinya laporan Anda memerlukan perhatian khusus dari Ketua RW.</p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={submit} className="p-6 sm:p-8 space-y-6">
                        <div>
                            <InputLabel htmlFor="title" value="Judul Laporan" />
                            <TextInput
                                id="title"
                                type="text"
                                className="mt-1 block w-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 focus:border-amber-500 focus:ring-amber-500"
                                placeholder="Contoh: Pohon Tumbang di RT 01"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                required
                            />
                            <p className="mt-1.5 text-xs text-slate-500">Tulis ringkasan laporan dalam satu kalimat singkat.</p>
                            <InputError message={errors.title} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="category" value="Kategori" />
                            <select
                                id="category"
                                className="mt-1 block w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:border-amber-500 focus:ring-amber-500 shadow-sm"
                                value={data.category}
                                onChange={(e) => setData('category', e.target.value)}
                                required
                            >
                                <option value="" disabled>Pilih kategori yang sesuai...</option>
                                <option value="infrastruktur">Fasilitas / Infrastruktur (Jalan, Lampu, Selokan)</option>
                                <option value="keamanan">Keamanan / Ketertiban Lingkungan</option>
                                <option value="kesehatan">Kesehatan & Kebersihan (Sampah, Sarang Nyamuk)</option>
                                <option value="pelayanan">Pelayanan Administrasi Warga</option>
                                <option value="sosial">Bantuan Sosial / Warga Kurang Mampu</option>
                                <option value="lainnya">Lainnya</option>
                            </select>
                            <InputError message={errors.category} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="description" value="Detail Kejadian" />
                            <textarea
                                id="description"
                                rows="5"
                                className="mt-1 block w-full rounded-xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white px-4 py-3 focus:border-amber-500 focus:ring-amber-500 shadow-sm"
                                placeholder="Jelaskan secara detail, termasuk lokasi akurat jika terjadi di jalan raya..."
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                required
                            ></textarea>
                            <InputError message={errors.description} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel value="Foto Bukti (Opsional)" />
                            
                            {!previewUrl ? (
                                <label className="mt-2 flex justify-center w-full min-h-[160px] px-4 py-6 border-2 border-slate-200 dark:border-slate-700 border-dashed rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:border-amber-400 dark:hover:border-amber-500 transition-colors group">
                                    <div className="space-y-2 text-center flex flex-col items-center justify-center">
                                        <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 group-hover:text-amber-500 group-hover:bg-amber-50 dark:group-hover:bg-amber-900/30 transition-colors">
                                            <Upload className="h-5 w-5" />
                                        </div>
                                        <div className="text-sm text-slate-600 dark:text-slate-400">
                                            <span className="font-semibold text-amber-600 dark:text-amber-400">Pilih foto</span> atau tarik dan lepas
                                        </div>
                                        <p className="text-xs text-slate-500">PNG, JPG up to 2MB</p>
                                    </div>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                                </label>
                            ) : (
                                <div className="mt-2 relative rounded-xl border border-slate-200 dark:border-slate-700 p-2 bg-slate-50 dark:bg-slate-900 flex justify-center">
                                    <img src={previewUrl} alt="Preview" className="max-h-64 rounded-lg object-contain" />
                                    <button 
                                        type="button" 
                                        onClick={removeFile}
                                        className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 shadow-sm"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                            <InputError message={errors.attachment} className="mt-2" />
                        </div>

                        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/50 p-4 rounded-xl flex items-start gap-4">
                            <div className="flex items-center h-5 mt-0.5">
                                <input
                                    id="is_secret"
                                    type="checkbox"
                                    className="w-4 h-4 text-amber-600 border-slate-300 rounded focus:ring-amber-500 dark:bg-slate-900 dark:border-slate-600"
                                    checked={data.is_secret}
                                    onChange={(e) => setData('is_secret', e.target.checked)}
                                />
                            </div>
                            <div className="flex-1">
                                <label htmlFor="is_secret" className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 cursor-pointer">
                                    Identitas Anonim <EyeOff className="h-4 w-4 text-slate-400" />
                                </label>
                                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Jika dicentang, nama Anda akan disamarkan dari pengurus publik. Identitas asli tetap diamankan di sistem.</p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                            <PrimaryButton 
                                className="bg-amber-600 hover:bg-amber-700 focus:bg-amber-700 active:bg-amber-800 px-6 py-3" 
                                disabled={processing}
                            >
                                {processing ? 'Mengirim Laporan...' : 'Kirim Laporan'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </WargaLayout>
    );
}
