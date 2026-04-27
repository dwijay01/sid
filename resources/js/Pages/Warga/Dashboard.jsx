import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import WargaLayout from '@/Layouts/WargaLayout';
import InstallPWA from '@/Components/InstallPWA';
import { 
    FileText, 
    Wifi, 
    ChevronRight, 
    Store, 
    Megaphone, 
    ShieldAlert,
    Clock,
    CheckCircle,
    XCircle,
    ArrowRight,
    MapPin,
    CalendarDays
} from 'lucide-react';

export default function Dashboard({ activeRequests, activeComplaintsCount, internetData, etalase, pengumuman }) {
    const { auth } = usePage().props;
    const resident = auth.user?.resident;

    const getStatusStyle = (status) => {
        switch (status) {
            case 'menunggu_review_admin':
            case 'menunggu_ttd_kades':
                return 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800';
            case 'disetujui_rt':
                return 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800';
            case 'selesai':
                return 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800';
            case 'ditolak':
                return 'bg-red-50 dark:bg-red-900/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800';
            default:
                return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700';
        }
    };

    return (
        <WargaLayout header="Beranda">
            <Head title="Beranda Warga" />

            {/* PWA Install Prompt */}
            <InstallPWA />

            {/* Quick Actions (Jalan Pintas) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <Link
                    href={route('warga.letters.create')}
                    className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 p-5 sm:p-6 text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                >
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 blur-xl group-hover:bg-white/20 transition-colors"></div>
                    <FileText className="h-8 w-8 mb-4 lg:mb-6 text-white/90" />
                    <h3 className="font-bold sm:text-lg leading-tight mb-1 relative z-10">Buat Surat<br/>Pengantar</h3>
                    <p className="text-teal-100 text-[10px] sm:text-xs">Layanan Administrasi</p>
                </Link>

                <Link
                    href={route('warga.complaints.index')}
                    className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 p-5 sm:p-6 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-sm hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
                >
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-amber-500/5 blur-xl group-hover:bg-amber-500/10 transition-colors"></div>
                    <div className="h-8 w-8 mb-4 lg:mb-6 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center relative">
                        <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        {activeComplaintsCount > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 text-[10px] items-center justify-center text-white font-bold">
                                    {activeComplaintsCount}
                                </span>
                            </span>
                        )}
                    </div>
                    <h3 className="font-bold sm:text-lg leading-tight mb-1 relative z-10">Lapor<br/>Kejadian</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-[10px] sm:text-xs">Aduan & Keamanan</p>
                </Link>

                {/* Kartu Tagihan */}
                <div className="col-span-2 relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 p-5 sm:p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <Wifi className="h-4 w-4" />
                            </div>
                            <h3 className="font-bold text-slate-900 dark:text-white">Internet RT/RW</h3>
                        </div>
                        {internetData ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] sm:text-xs font-semibold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                Aktif
                            </span>
                        ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] sm:text-xs font-semibold uppercase tracking-wider bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                                Tidak Tersedia
                            </span>
                        )}
                    </div>
                    
                    {internetData ? (
                        <div>
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Paket: {internetData.package}</p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    {internetData.payment_status === 'lunas' ? (
                                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                                    ) : (
                                        <Clock className="h-4 w-4 text-amber-500" />
                                    )}
                                    <span className={`text-xs font-semibold ${internetData.payment_status === 'lunas' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                                        Iuran Bulan Ini {internetData.payment_status === 'lunas' ? 'Lunas' : 'Belum Dibayar'}
                                    </span>
                                </div>
                                <button className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline">Bayar &rarr;</button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col justify-end">
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Keluarga Anda belum berlangganan layanan Internet RT/RW.</p>
                            <a href="https://wa.me/6285712399909" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 self-start">Info Langganan</a>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-8 mt-4">
                {/* Papan Pengumuman */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Megaphone className="h-5 w-5 text-amber-500" />
                            Papan Pengumuman
                        </h2>
                        <button className="text-sm text-teal-600 dark:text-teal-400 hover:underline font-medium">Lihat Semua</button>
                    </div>
                    
                    <div className="space-y-3">
                        {pengumuman.map((item) => (
                            <div key={item.id} className="group relative overflow-hidden rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md transition-shadow flex items-start gap-4 cursor-pointer">
                                <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${item.bg}`}>
                                    <CalendarDays className="h-6 w-6" />
                                </div>
                                <div className="flex-1 pt-0.5">
                                    <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-1">{item.title}</h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                                        <Clock className="h-3 w-3" />
                                        {item.date}
                                    </p>
                                </div>
                                <div className="hidden sm:flex items-center self-center px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-medium">
                                    {item.type}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Status Surat (Mini) */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <FileText className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                            Status Surat Aktif
                        </h2>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                        {(!resident) ? (
                            <div className="p-6 text-center">
                                <XCircle className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                                <p className="text-xs text-slate-500 dark:text-slate-400">Silakan lengkapi profil untuk mengajukan surat.</p>
                            </div>
                        ) : activeRequests.length > 0 ? (
                            <ul className="divide-y divide-slate-100 dark:divide-slate-700">
                                {activeRequests.map(request => (
                                    <li key={request.id}>
                                        <Link href={route('warga.letters.track', request.id)} className="block p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1 pr-2">{request.letter_type?.nama_surat}</h4>
                                                <ChevronRight className="h-4 w-4 text-slate-400 flex-shrink-0" />
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getStatusStyle(request.status)}`}>
                                                    {request.status_label}
                                                </span>
                                                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                                                    {new Date(request.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'})}
                                                </span>
                                            </div>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="p-6 text-center bg-slate-50 dark:bg-slate-800">
                                <FileText className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                                <p className="text-xs text-slate-500 dark:text-slate-400">Tidak ada pengajuan surat aktif.</p>
                                <Link href={route('warga.letters.create')} className="mt-3 inline-block text-xs font-bold text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300">
                                    Buat Surat Baru &rarr;
                                </Link>
                            </div>
                        )}
                        {/* Arsip Link */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700/50 p-3 text-center">
                             <Link href={route('warga.history')} className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 inline-flex items-center gap-1">
                                Buka Arsip Dokumen <ArrowRight className="h-3 w-3" />
                             </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Etalase Desa (Horizontal Scroll) */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <Store className="h-5 w-5 text-indigo-500" />
                            Etalase Desa
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Dukung UMKM dan jasa layanan tetangga sekitar kita</p>
                    </div>
                    <button className="hidden sm:block text-sm text-teal-600 dark:text-teal-400 hover:underline font-medium">Jelajahi</button>
                </div>

                <div className="flex overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar gap-4 snap-x">
                    {etalase.length > 0 ? etalase.map((item, idx) => (
                        <div key={`${item.type}-${item.id}-${idx}`} className="snap-start flex-shrink-0 w-64 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden flex flex-col group cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-md transition-all">
                            {/* Card Header (Image placeholder & badge) */}
                            <div className="h-24 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 relative p-3">
                                <span className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-1 rounded bg-white/90 dark:bg-slate-900/90 shadow-sm ${item.type === 'umkm' ? 'text-indigo-600 dark:text-indigo-400' : 'text-teal-600 dark:text-teal-400'}`}>
                                    {item.type === 'umkm' ? 'Produk' : 'Jasa'}
                                </span>
                                <div className="absolute -bottom-5 left-4 h-10 w-10 rounded-xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-center">
                                    <Store className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                                </div>
                            </div>
                            
                            {/* Card Body */}
                            <div className="p-4 pt-7 flex-1 flex flex-col">
                                <h3 className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1 mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{item.title}</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 flex-1">{item.subtitle}</p>
                                
                                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                    <MapPin className="h-3.5 w-3.5" />
                                    <span className="truncate">Oleh: <span className="font-medium text-slate-700 dark:text-slate-300">{item.owner}</span></span>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="w-full text-center py-10 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-sm bg-white dark:bg-slate-800/50">
                            Belum ada data UMKM atau Jasa terdaftar.
                        </div>
                    )}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}} />
            
        </WargaLayout>
    );
}
