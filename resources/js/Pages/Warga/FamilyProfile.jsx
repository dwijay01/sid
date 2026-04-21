import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import WargaLayout from '@/Layouts/WargaLayout';
import { 
    Users, 
    Home, 
    Droplet, 
    Wind, 
    MapPin, 
    FileText, 
    AlertCircle, 
    CheckCircle,
    UserCircle,
    Edit3,
    HeartPulse
} from 'lucide-react';
import Modal from '@/Components/Modal';

export default function FamilyProfile({ familyCard, members }) {
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'tetap':
                return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
            case 'sementara':
                return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800';
            default:
                return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
        }
    };

    return (
        <WargaLayout header="Profil Keluarga">
            <Head title="Profil Keluarga" />

            {!familyCard ? (
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center border border-slate-200 dark:border-slate-700 shadow-sm">
                    <Users className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Data Keluarga Belum Tersedia</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
                        Akun NIK Anda belum terkait dengan data Kartu Keluarga di sistem kami. Jika ini adalah kesalahan, silakan hubungi Ketua RT Anda.
                    </p>
                    <Link href={route('profile.edit')} className="inline-flex items-center justify-center rounded-xl bg-teal-600 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-teal-500 transition-colors">
                        Perbarui Profil NIK
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Alert for Update Data */}
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-4 flex items-start gap-4 shadow-sm">
                        <div className="flex-shrink-0 mt-0.5">
                            <AlertCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-300">Pembaruan Data Kependudukan</h3>
                            <p className="mt-1 text-sm text-indigo-700 dark:text-indigo-400/80 leading-relaxed">
                                Jika terdapat kesalahan ejaan nama, perubahan status, atau anggota keluarga baru, Anda dapat mengajukan pembaruan data secara resmi melalui layanan pengantar.
                            </p>
                            <div className="mt-3">
                                <button 
                                    onClick={() => setIsUpdateModalOpen(true)}
                                    className="text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:underline inline-flex items-center gap-1"
                                >
                                    <Edit3 className="h-3 w-3" /> Info Pengajuan Perubahan
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Info KK */}
                        <div className="lg:col-span-1 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                            <div className="bg-gradient-to-br from-teal-500 to-emerald-600 p-6 text-white text-center rounded-t-2xl relative">
                                <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 blur-xl"></div>
                                <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm border border-white/30 shadow-sm relative z-10">
                                    <FileText className="h-8 w-8 text-white" />
                                </div>
                                <p className="text-teal-100 text-xs font-medium uppercase tracking-wider mb-1 relative z-10">Nomor Kartu Keluarga</p>
                                <h2 className="text-xl font-bold tracking-widest relative z-10">{familyCard.no_kk}</h2>
                            </div>
                            
                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-700 pb-2 mb-4">Informasi Domisili</h3>
                                
                                <dl className="space-y-4 flex-1">
                                    <div>
                                        <dt className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                                            <MapPin className="h-3 w-3 text-teal-500" /> Alamat Sesuai KTP
                                        </dt>
                                        <dd className="text-sm text-slate-800 dark:text-slate-200 font-medium">{familyCard.alamat || '-'}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                                            <Home className="h-3 w-3 text-teal-500" /> Alamat Domisili Sekarang
                                        </dt>
                                        <dd className="text-sm text-slate-800 dark:text-slate-200 font-medium">{familyCard.alamat_domisili || '-'}</dd>
                                    </div>
                                    <div className="pt-2">
                                        <dt className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Status Kependudukan</dt>
                                        <dd>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded border text-xs font-bold capitalize ${getStatusStyle(familyCard.status)}`}>
                                                {familyCard.status || 'Tidak Diketahui'}
                                            </span>
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>

                        {/* Anggota KK */}
                        <div className="lg:col-span-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden">
                            <div className="border-b border-slate-100 dark:border-slate-700 px-6 py-5 flex items-center justify-between">
                                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <Users className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                                    Daftar Anggota Keluarga ({members.length})
                                </h2>
                            </div>
                            
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm whitespace-nowrap">
                                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400">
                                        <tr>
                                            <th className="px-6 py-3 font-semibold w-12">No</th>
                                            <th className="px-6 py-3 font-semibold">Nama Lengkap & NIK</th>
                                            <th className="px-6 py-3 font-semibold">SHDK</th>
                                            <th className="px-6 py-3 font-semibold">J.Kelamin / Umur</th>
                                            <th className="px-6 py-3 font-semibold">Status Pekerjaan</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 text-slate-700 dark:text-slate-300">
                                        {members.map((member, index) => (
                                            <tr key={member.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="px-6 py-4 font-medium">{index + 1}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 font-bold flex-shrink-0">
                                                            {member.nama_lengkap.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-slate-900 dark:text-white">{member.nama_lengkap}</div>
                                                            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono tracking-tight mt-0.5">{member.nik}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${
                                                        member.hubungan_keluarga === 'kepala_keluarga' 
                                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' 
                                                            : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                                                    }`}>
                                                        {member.hubungan_keluarga.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm">{member.jenis_kelamin === 'L' ? 'Laki-Laki' : 'Perempuan'}</div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{member.usia} Tahun</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm truncate max-w-[150px]">{member.pekerjaan || '-'}</div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Kondisi Hunian (Only if data exists) */}
                    {(familyCard.status_kepemilikan_bangunan || familyCard.sumber_air_minum) && (
                        <div className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden p-6">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-6">
                                <Home className="h-5 w-5 text-indigo-500" />
                                Data Kondisi Hunian
                            </h2>
                            
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                    <Home className="h-5 w-5 text-slate-400 mb-2" />
                                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 tracking-wide uppercase font-semibold">Kepemilikan</div>
                                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200 capitalize">{familyCard.status_kepemilikan_bangunan || '-'}</div>
                                </div>
                                <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                    <MapPin className="h-5 w-5 text-slate-400 mb-2" />
                                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 tracking-wide uppercase font-semibold">Jenis Lantai</div>
                                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200 capitalize">{familyCard.jenis_lantai || '-'}</div>
                                </div>
                                <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                    <AlertCircle className="h-5 w-5 text-slate-400 mb-2" />
                                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 tracking-wide uppercase font-semibold">Sanitasi / Jamban</div>
                                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200 capitalize">{familyCard.fasilitas_sanitasi || '-'}</div>
                                </div>
                                <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                                    <Droplet className="h-5 w-5 text-slate-400 mb-2" />
                                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 tracking-wide uppercase font-semibold">Sumber Air Minum</div>
                                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200 capitalize">{familyCard.sumber_air_minum || '-'}</div>
                                </div>
                            </div>
                            <p className="mt-4 text-xs text-slate-400 flex items-center justify-center gap-1.5 w-full text-center">
                                <CheckCircle className="h-3 w-3" /> Data hunian didata oleh aparatur RT setempat.
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Modal Informasi Perubahan Data */}
            <Modal show={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)}>
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4 border-b border-slate-100 dark:border-slate-700 pb-4">
                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/30">
                            <Edit3 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Pengajuan Perubahan Data</h2>
                    </div>
                    
                    <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                        <p>
                            Saat ini, pembaruan data anggota keluarga (contoh: tambah anggota karena kelahiran, perbaikan nama, pecah KK) 
                            <strong className="text-slate-800 dark:text-white"> harus diverifikasi oleh Ketua RT </strong> untuk mencegah pemalsuan data kependudukan.
                        </p>
                        
                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                            <h4 className="font-bold text-slate-900 dark:text-white mb-2">Cara Mengajukan:</h4>
                            <ol className="list-decimal list-inside space-y-2 ml-1">
                                <li>Pilih menu <strong>Pusat Layanan Surat</strong>.</li>
                                <li>Pilih jenis surat <strong>"Surat Pengantar Perubahan Data/KK"</strong> (Jika tersedia).</li>
                                <li>Isi form alasan perubahan (contoh: "Perbaikan nama anak sesuai akta lahir").</li>
                                <li>Sertakan bukti foto (KTP/Akta/KK Lama) jika form mendukung upload file tambahan.</li>
                                <li>Pihak RT/Desa akan memverifikasi dan memperbarui data inti KK Anda.</li>
                            </ol>
                        </div>
                        
                        <p className="text-xs text-slate-500">
                            Jika membutuhkan penanganan segera, Anda dapat mendatangi langsung Ketua RT setempat dengan membawa dokumen asli.
                        </p>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button 
                            type="button" 
                            onClick={() => setIsUpdateModalOpen(false)}
                            className="px-4 py-2 bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-bold text-sm rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            Tutup
                        </button>
                        <Link 
                            href={route('warga.letters.create')}
                            className="ml-3 px-4 py-2 bg-indigo-600 text-white font-bold text-sm rounded-lg hover:bg-indigo-500 transition-colors"
                        >
                            Buka Layanan Surat
                        </Link>
                    </div>
                </div>
            </Modal>
        </WargaLayout>
    );
}
