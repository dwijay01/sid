import React from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Save, ArrowLeft } from 'lucide-react';

export default function Form({ resident, familyCards }) {
    const isEdit = !!resident;
    
    const { data, setData, post, put, processing, errors } = useForm({
        nik: resident?.nik || '',
        nama_lengkap: resident?.nama_lengkap || '',
        tempat_lahir: resident?.tempat_lahir || '',
        tanggal_lahir: resident?.tanggal_lahir || '',
        jenis_kelamin: resident?.jenis_kelamin || 'L',
        agama: resident?.agama || 'Islam',
        status_perkawinan: resident?.status_perkawinan || 'belum_kawin',
        golongan_darah: resident?.golongan_darah || 'tidak_tahu',
        pekerjaan: resident?.pekerjaan || '',
        pendidikan: resident?.pendidikan || 'SMA',
        hubungan_keluarga: resident?.hubungan_keluarga || 'anak',
        family_card_id: resident?.family_card_id || '',
        alamat_sekarang: resident?.alamat_sekarang || '',
        status_penduduk: resident?.status_penduduk || 'aktif',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (isEdit) {
            put(route('admin.residents.update', resident.id));
        } else {
            post(route('admin.residents.store'));
        }
    };

    return (
        <AdminLayout header={isEdit ? "Edit Penduduk" : "Tambah Penduduk"}>
            <Head title={isEdit ? "Edit Penduduk" : "Tambah Penduduk"} />

            <div className="mb-6 flex items-center justify-between">
                <Link 
                    href={route('admin.residents.index')} 
                    className="flex items-center text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:text-emerald-400 transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali
                </Link>
            </div>

            <div className="glass bg-white dark:bg-slate-800 p-6 shadow-sm rounded-xl">
                <form onSubmit={handleSubmit}>
                    <div className="space-y-12">
                        <div className="border-b border-slate-900/10 pb-12">
                            <h2 className="text-base font-semibold leading-7 text-slate-900 dark:text-white">
                                Profil Informasi Warga
                            </h2>
                            <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                Masukkan data individu yang sah sesuai dengan kartu identitas (KTP/Akta).
                            </p>

                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                {/* Baris 1: NIK & Nama Lengkap */}
                                <div className="sm:col-span-3">
                                    <label htmlFor="nik" className="block text-sm font-medium leading-6 text-slate-900 dark:text-white">NIK</label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            id="nik"
                                            value={data.nik}
                                            onChange={e => setData('nik', e.target.value)}
                                            className={`block w-full rounded-md border-0 py-2 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ${errors.nik ? 'ring-red-500 focus:ring-red-500' : 'ring-slate-300 dark:ring-slate-700 focus:ring-emerald-600'} sm:text-sm sm:leading-6 bg-slate-50 dark:bg-slate-800/50`}
                                            maxLength={16}
                                        />
                                        {errors.nik && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.nik}</p>}
                                    </div>
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="nama_lengkap" className="block text-sm font-medium leading-6 text-slate-900 dark:text-white">Nama Lengkap</label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            id="nama_lengkap"
                                            value={data.nama_lengkap}
                                            onChange={e => setData('nama_lengkap', e.target.value)}
                                            className={`block w-full rounded-md border-0 py-2 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ${errors.nama_lengkap ? 'ring-red-500 focus:ring-red-500' : 'ring-slate-300 dark:ring-slate-700 focus:ring-emerald-600'} sm:text-sm sm:leading-6 bg-slate-50 dark:bg-slate-800/50`}
                                        />
                                        {errors.nama_lengkap && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.nama_lengkap}</p>}
                                    </div>
                                </div>

                                {/* Baris 2: Tempat & Tanggal Lahir */}
                                <div className="sm:col-span-3">
                                    <label htmlFor="tempat_lahir" className="block text-sm font-medium leading-6 text-slate-900 dark:text-white">Tempat Lahir</label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            id="tempat_lahir"
                                            value={data.tempat_lahir}
                                            onChange={e => setData('tempat_lahir', e.target.value)}
                                            className={`block w-full rounded-md border-0 py-2 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ${errors.tempat_lahir ? 'ring-red-500 focus:ring-red-500' : 'ring-slate-300 dark:ring-slate-700 focus:ring-emerald-600'} sm:text-sm sm:leading-6 bg-slate-50 dark:bg-slate-800/50`}
                                        />
                                        {errors.tempat_lahir && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.tempat_lahir}</p>}
                                    </div>
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="tanggal_lahir" className="block text-sm font-medium leading-6 text-slate-900 dark:text-white">Tanggal Lahir</label>
                                    <div className="mt-2">
                                        <input
                                            type="date"
                                            id="tanggal_lahir"
                                            value={data.tanggal_lahir}
                                            onChange={e => setData('tanggal_lahir', e.target.value)}
                                            className={`block w-full rounded-md border-0 py-2 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ${errors.tanggal_lahir ? 'ring-red-500 focus:ring-red-500' : 'ring-slate-300 dark:ring-slate-700 focus:ring-emerald-600'} sm:text-sm sm:leading-6 bg-slate-50 dark:bg-slate-800/50`}
                                        />
                                        {errors.tanggal_lahir && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.tanggal_lahir}</p>}
                                    </div>
                                </div>

                                {/* Baris 3: Jenis Kelamin, Agama, Gol Darah */}
                                <div className="sm:col-span-2">
                                    <label htmlFor="jenis_kelamin" className="block text-sm font-medium leading-6 text-slate-900 dark:text-white">Jenis Kelamin</label>
                                    <div className="mt-2">
                                        <select
                                            id="jenis_kelamin"
                                            value={data.jenis_kelamin}
                                            onChange={e => setData('jenis_kelamin', e.target.value)}
                                            className={`block w-full rounded-md border-0 py-2 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ${errors.jenis_kelamin ? 'ring-red-500 focus:ring-red-500' : 'ring-slate-300 dark:ring-slate-700 focus:ring-emerald-600'} sm:text-sm sm:leading-6 bg-slate-50 dark:bg-slate-800/50`}
                                        >
                                            <option value="L">Laki-laki</option>
                                            <option value="P">Perempuan</option>
                                        </select>
                                        {errors.jenis_kelamin && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.jenis_kelamin}</p>}
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="agama" className="block text-sm font-medium leading-6 text-slate-900 dark:text-white">Agama</label>
                                    <div className="mt-2">
                                        <select
                                            id="agama"
                                            value={data.agama}
                                            onChange={e => setData('agama', e.target.value)}
                                            className={`block w-full rounded-md border-0 py-2 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ${errors.agama ? 'ring-red-500 focus:ring-red-500' : 'ring-slate-300 dark:ring-slate-700 focus:ring-emerald-600'} sm:text-sm sm:leading-6 bg-slate-50 dark:bg-slate-800/50`}
                                        >
                                            <option value="Islam">Islam</option>
                                            <option value="Kristen">Kristen</option>
                                            <option value="Katolik">Katolik</option>
                                            <option value="Hindu">Hindu</option>
                                            <option value="Buddha">Buddha</option>
                                            <option value="Konghucu">Konghucu</option>
                                        </select>
                                        {errors.agama && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.agama}</p>}
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="golongan_darah" className="block text-sm font-medium leading-6 text-slate-900 dark:text-white">Gol. Darah</label>
                                    <div className="mt-2">
                                        <select
                                            id="golongan_darah"
                                            value={data.golongan_darah}
                                            onChange={e => setData('golongan_darah', e.target.value)}
                                            className={`block w-full rounded-md border-0 py-2 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ${errors.golongan_darah ? 'ring-red-500 focus:ring-red-500' : 'ring-slate-300 dark:ring-slate-700 focus:ring-emerald-600'} sm:text-sm sm:leading-6 bg-slate-50 dark:bg-slate-800/50`}
                                        >
                                            <option value="A">A</option>
                                            <option value="B">B</option>
                                            <option value="AB">AB</option>
                                            <option value="O">O</option>
                                            <option value="tidak_tahu">Tidak Tahu</option>
                                        </select>
                                        {errors.golongan_darah && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.golongan_darah}</p>}
                                    </div>
                                </div>

                                {/* Baris 4: Status Marital, Pendidikan, Pekerjaan */}
                                <div className="sm:col-span-2">
                                    <label htmlFor="status_perkawinan" className="block text-sm font-medium leading-6 text-slate-900 dark:text-white">Status Perkawinan</label>
                                    <div className="mt-2">
                                        <select
                                            id="status_perkawinan"
                                            value={data.status_perkawinan}
                                            onChange={e => setData('status_perkawinan', e.target.value)}
                                            className={`block w-full rounded-md border-0 py-2 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ${errors.status_perkawinan ? 'ring-red-500 focus:ring-red-500' : 'ring-slate-300 dark:ring-slate-700 focus:ring-emerald-600'} sm:text-sm sm:leading-6 bg-slate-50 dark:bg-slate-800/50`}
                                        >
                                            <option value="belum_kawin">Belum Kawin</option>
                                            <option value="kawin">Kawin</option>
                                            <option value="cerai_hidup">Cerai Hidup</option>
                                            <option value="cerai_mati">Cerai Mati</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="pendidikan" className="block text-sm font-medium leading-6 text-slate-900 dark:text-white">Pendidikan</label>
                                    <div className="mt-2">
                                        <select
                                            id="pendidikan"
                                            value={data.pendidikan}
                                            onChange={e => setData('pendidikan', e.target.value)}
                                            className={`block w-full rounded-md border-0 py-2 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ${errors.pendidikan ? 'ring-red-500 focus:ring-red-500' : 'ring-slate-300 dark:ring-slate-700 focus:ring-emerald-600'} sm:text-sm sm:leading-6 bg-slate-50 dark:bg-slate-800/50`}
                                        >
                                            <option value="tidak_sekolah">Tidak Sekolah</option>
                                            <option value="SD">SD</option>
                                            <option value="SMP">SMP</option>
                                            <option value="SMA">SMA/Sederajat</option>
                                            <option value="D1">D1</option>
                                            <option value="D2">D2</option>
                                            <option value="D3">D3</option>
                                            <option value="S1">S1/D4</option>
                                            <option value="S2">S2</option>
                                            <option value="S3">S3</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <label htmlFor="pekerjaan" className="block text-sm font-medium leading-6 text-slate-900 dark:text-white">Pekerjaan</label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            id="pekerjaan"
                                            value={data.pekerjaan}
                                            onChange={e => setData('pekerjaan', e.target.value)}
                                            placeholder="Cth: Petani, ASN, dsb."
                                            className={`block w-full rounded-md border-0 py-2 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ${errors.pekerjaan ? 'ring-red-500 focus:ring-red-500' : 'ring-slate-300 dark:ring-slate-700 focus:ring-emerald-600'} sm:text-sm sm:leading-6 bg-slate-50 dark:bg-slate-800/50`}
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="border-b border-slate-900/10 pb-12">
                            <h2 className="text-base font-semibold leading-7 text-slate-900 dark:text-white">Informasi Keluarga & Sistem</h2>
                            <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">Kaitkan penduduk dengan Kartu Keluarga dan tentukan statusnya dalam sistem administrasi.</p>

                            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                <div className="sm:col-span-3">
                                    <label htmlFor="family_card_id" className="block text-sm font-medium leading-6 text-slate-900 dark:text-white">Nomor Kartu Keluarga (Opsional)</label>
                                    <div className="mt-2">
                                        <select
                                            id="family_card_id"
                                            value={data.family_card_id}
                                            onChange={e => setData('family_card_id', e.target.value)}
                                            className="block w-full rounded-md border-0 py-2 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-emerald-600 sm:text-sm sm:leading-6 bg-slate-50 dark:bg-slate-800/50"
                                        >
                                            <option value="">- Belum Terdaftar di KK -</option>
                                            {familyCards.map(kk => (
                                                <option key={kk.id} value={kk.id}>
                                                    {kk.no_kk} {kk.kepala_keluarga ? `- ${kk.kepala_keluarga.nama_lengkap}` : ''}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="sm:col-span-3">
                                    <label htmlFor="hubungan_keluarga" className="block text-sm font-medium leading-6 text-slate-900 dark:text-white">Hubungan dalam Keluarga</label>
                                    <div className="mt-2">
                                        <select
                                            id="hubungan_keluarga"
                                            value={data.hubungan_keluarga}
                                            onChange={e => setData('hubungan_keluarga', e.target.value)}
                                            className="block w-full rounded-md border-0 py-2 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-emerald-600 sm:text-sm sm:leading-6 bg-slate-50 dark:bg-slate-800/50"
                                        >
                                            <option value="kepala">Kepala Keluarga</option>
                                            <option value="istri">Istri</option>
                                            <option value="anak">Anak</option>
                                            <option value="menantu">Menantu</option>
                                            <option value="cucu">Cucu</option>
                                            <option value="orang_tua">Orang Tua</option>
                                            <option value="mertua">Mertua</option>
                                            <option value="famili_lain">Famili Lain</option>
                                            <option value="lainnya">Lainnya</option>
                                        </select>
                                    </div>
                                </div>
                                
                                {isEdit && (
                                    <div className="sm:col-span-3">
                                        <label htmlFor="status_penduduk" className="block text-sm font-medium leading-6 text-slate-900 dark:text-white">Status Penduduk</label>
                                        <div className="mt-2">
                                            <select
                                                id="status_penduduk"
                                                value={data.status_penduduk}
                                                onChange={e => setData('status_penduduk', e.target.value)}
                                                className="block w-full rounded-md border-0 py-2 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-emerald-600 sm:text-sm sm:leading-6 bg-slate-50 dark:bg-slate-800/50"
                                            >
                                                <option value="aktif">Aktif (Hidup / Tinggal)</option>
                                                <option value="meninggal">Meninggal Dunia</option>
                                                <option value="pindah">Pindah Domisili</option>
                                                <option value="hilang">Hilang / Tidak Diketahui</option>
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <Link href={route('admin.residents.index')} className="text-sm font-semibold leading-6 text-slate-900 dark:text-white">
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-md bg-emerald-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 flex items-center gap-2 disabled:opacity-75"
                        >
                            <Save size={18} />
                            {processing ? 'Menyimpan...' : 'Simpan Data'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
