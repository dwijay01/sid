import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import KadesLayout from '@/Layouts/KadesLayout';
import { ArrowLeft, Check, X, FileText, User, PenTool, AlertTriangle } from 'lucide-react';

export default function LetterDetail({ letter }) {
    const { data, setData, post, processing, errors } = useForm({
        action: '',
        catatan: ''
    });

    const [showProcessForm, setShowProcessForm] = useState(false);

    const handleProcess = (actionType) => {
        setData('action', actionType);
        
        if (actionType === 'approve') {
            setData('catatan', 'Telah dibubuhkan TTE oleh Kepala Desa.');
        } else {
            setData('catatan', '');
        }
        
        setShowProcessForm(true);
    };

    const submitProcessForm = (e) => {
        e.preventDefault();
        
        let routeName = data.action === 'approve' ? 'kades.letters.approve' : 'kades.letters.reject';
        post(route(routeName, letter.id), {
            onSuccess: () => setShowProcessForm(false)
        });
    };

    const isPendingTTE = letter.status === 'menunggu_ttd_kades';

    return (
        <KadesLayout header="Verifikasi & Pengesahan Surat">
            <Head title={`Sahkah - ${letter.resident?.nama_lengkap}`} />

            <div className="mb-6">
                <Link 
                    href={route('kades.dashboard')} 
                    className="inline-flex items-center text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:text-emerald-400 transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke Dashboard
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Dokumen Viewer & Review Data (Left/Center) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 shadow-sm">
                        <div className="border-b-2 border-slate-900 pb-6 mb-6 text-center">
                            <h2 className="text-xl font-bold uppercase tracking-widest text-slate-900 dark:text-white">Pemerintah Desa xxxx</h2>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Kecamatan xxxx, Kabupaten xxxx</p>
                            <hr className="my-4 border-slate-300 dark:border-slate-600" />
                            <h3 className="text-lg font-bold uppercase text-slate-900 dark:text-white underline decoration-2 underline-offset-4">{letter.letter_type?.nama_surat}</h3>
                            <p className="text-sm font-mono text-slate-600 dark:text-slate-400 mt-2">No. {letter.nomor_surat || '[Akan Diterbitkan]'}</p>
                        </div>

                        <div className="space-y-4 text-slate-800 dark:text-slate-200 text-justify leading-relaxed">
                            <p>Yang bertanda tangan di bawah ini Kepala Desa xxxx, menerangkan dengan sebenarnya bahwa:</p>
                            
                            <table className="w-full sm:w-10/12 md:w-8/12 mx-auto my-6 text-sm">
                                <tbody>
                                    <tr>
                                        <td className="py-2 pr-4 font-semibold w-1/3">Nama Lengkap</td>
                                        <td className="py-2 px-2 w-4">:</td>
                                        <td className="py-2 uppercase font-bold">{letter.resident?.nama_lengkap}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 pr-4 font-semibold">NIK / No. KK</td>
                                        <td className="py-2 px-2">:</td>
                                        <td className="py-2">{letter.resident?.nik} / {letter.resident?.familyCard?.no_kk || '-'}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 pr-4 font-semibold">Tempat, Tgl Lahir</td>
                                        <td className="py-2 px-2">:</td>
                                        <td className="py-2">{letter.resident?.tempat_lahir}, {new Date(letter.resident?.tanggal_lahir).toLocaleDateString('id-ID')}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 pr-4 font-semibold">Agama</td>
                                        <td className="py-2 px-2">:</td>
                                        <td className="py-2">{letter.resident?.agama}</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 pr-4 font-semibold align-top">Alamat</td>
                                        <td className="py-2 px-2 align-top">:</td>
                                        <td className="py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-lg p-2">{letter.resident?.alamat_sekarang || letter.resident?.familyCard?.alamat || '-'}</td>
                                    </tr>
                                </tbody>
                            </table>

                            <p>
                                Menerangkan bahwa orang tersebut benar-benar adalah warga kami dan bermaksud untuk: 
                                <br/><strong className="inline-block mt-2 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-lg border border-emerald-100 text-emerald-800">{letter.keperluan}</strong>
                            </p>
                            
                            <p className="mt-6">Demikian surat keterangan ini dibuat agar dapat dipergunakan sebagaimana mestinya.</p>
                        </div>
                    </div>
                </div>

                {/* Right Area: Action & Signature */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Action Block */}
                    <div className="glass bg-white dark:bg-slate-800 p-6 shadow-sm rounded-xl border-t-4 border-emerald-500">
                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-lg"><PenTool size={20} /></div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Aksi Pengesahan</h3>
                        </div>
                        
                        {!isPendingTTE ? (
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700 text-center">
                                <Check className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
                                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Status saat ini:</p>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 uppercase font-bold">{letter.status.replace(/_/g, ' ')}</p>
                            </div>
                        ) : !showProcessForm ? (
                            <div className="space-y-4 border-t border-slate-100 dark:border-slate-700 pt-2">
                                <button
                                    onClick={() => handleProcess('approve')}
                                    className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white rounded-xl px-5 py-3.5 font-bold hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                >
                                    <Check size={20} /> Sahkan & Bubuhkan TTE
                                </button>
                                
                                <button
                                    onClick={() => handleProcess('reject')}
                                    className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border-2 border-red-200 text-red-600 dark:text-red-400 rounded-xl px-5 py-3 font-bold hover:bg-red-50 dark:bg-red-900/30 transition-colors"
                                >
                                    <X size={18} /> Tolak Permohonan
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={submitProcessForm} className="animate-fade-in space-y-4">
                                <div className={`p-4 rounded-lg border ${data.action === 'approve' ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200' : 'bg-red-50 dark:bg-red-900/30 border-red-200'}`}>
                                    <h4 className={`text-sm font-bold flex items-center gap-2 mb-2 ${data.action === 'approve' ? 'text-emerald-800' : 'text-red-800'}`}>
                                        {data.action === 'approve' ? <><Check size={16} /> Konfirmasi TTE</> : <><X size={16} /> Konfirmasi Penolakan</>}
                                    </h4>
                                    
                                    <label htmlFor="catatan" className="block text-sm font-medium leading-6 text-slate-900 dark:text-white mt-3">
                                        Catatan / Keterangan
                                    </label>
                                    <textarea
                                        id="catatan"
                                        rows={3}
                                        value={data.catatan}
                                        onChange={e => setData('catatan', e.target.value)}
                                        required={data.action === 'reject'}
                                        placeholder={data.action === 'reject' ? "Jelaskan alasan kenapa ditolak..." : "Catatan TTE..."}
                                        className="mt-1 block w-full rounded-md border-0 py-2 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-emerald-600 sm:text-sm sm:leading-6 bg-white dark:bg-slate-800"
                                    />
                                </div>
                                
                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowProcessForm(false)}
                                        className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-4 py-2.5 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-bold shadow-sm text-white transition-colors flex items-center justify-center gap-2 ${
                                            data.action === 'approve' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-red-600 hover:bg-red-500'
                                        }`}
                                    >
                                        {processing ? 'Memproses...' : 'Kirim'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    <div className="glass bg-white dark:bg-slate-800 p-6 shadow-sm rounded-xl">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-700 pb-2">Riwayat Proses Admin</h3>
                        <ul className="space-y-4">
                            {letter.logs && letter.logs.map((log) => (
                                <li key={log.id} className="text-sm">
                                    <div className="flex justify-between items-start">
                                        <p className="font-semibold text-slate-800 dark:text-slate-200">{log.status_to?.replace(/_/g, ' ').toUpperCase() || 'STATUS'}</p>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">{new Date(log.created_at).toLocaleDateString('id-ID')}</span>
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{log.notes}</p>
                                    <p className="text-xs font-mono text-slate-400 mt-1 mt-0.5">Oleh: {log.actor?.name || 'Sistem'}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </KadesLayout>
    );
}
