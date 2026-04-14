import React from 'react';
import SiePemberdayaanLayout from '@/Layouts/SiePemberdayaanLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronLeft, Save } from 'lucide-react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Form({ subscription, familyCards }) {
    const isEdit = !!subscription;

    const { data, setData, post, put, processing, errors } = useForm({
        family_card_id: subscription?.family_card_id || '',
        package_name: subscription?.package_name || '',
        installation_date: subscription?.installation_date || '',
        access_point_location: subscription?.access_point_location || '',
        status: subscription?.status || 'aktif',
        notes: subscription?.notes || '',
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('sie-pemberdayaan.internet.update', subscription.id));
        } else {
            post(route('sie-pemberdayaan.internet.store'));
        }
    };

    return (
        <SiePemberdayaanLayout header={isEdit ? 'Edit Langganan' : 'Daftar Langganan Baru'}>
            <Head title={isEdit ? 'Edit Langganan' : 'Daftar Langganan'} />

            <div className="mb-8 flex items-center gap-4">
                <Link 
                    href={route('sie-pemberdayaan.internet.index')}
                    className="p-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 text-slate-500 hover:text-indigo-600 transition-colors"
                >
                    <ChevronLeft size={20} />
                </Link>
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{isEdit ? 'Edit Data Langganan' : 'Pendaftaran Internet Komunitas'}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Formulir pendataan infrastruktur internet RW.</p>
                </div>
            </div>

            <div className="max-w-3xl">
                <form onSubmit={submit} className="space-y-6 bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div>
                        <InputLabel htmlFor="family_card_id" value="Pilih Kartu Keluarga" />
                        <select
                            id="family_card_id"
                            className="mt-1 block w-full rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm transition-all h-11"
                            value={data.family_card_id}
                            onChange={(e) => setData('family_card_id', e.target.value)}
                            disabled={isEdit}
                            required
                        >
                            <option value="">Pilih KK...</option>
                            {familyCards.map((kk) => (
                                <option key={kk.id} value={kk.id}>
                                    {kk.no_kk} - {kk.kepala_keluarga?.nama_lengkap || 'Tanpa Kepala'} [RT {kk.wilayah?.rt}/RW {kk.wilayah?.rw}]
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.family_card_id} className="mt-2" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <InputLabel htmlFor="package_name" value="Paket Internet" />
                            <TextInput
                                id="package_name"
                                className="mt-1 block w-full rounded-xl"
                                value={data.package_name}
                                onChange={(e) => setData('package_name', e.target.value)}
                                placeholder="Misal: 10 Mbps, 20 Mbps"
                                required
                            />
                            <InputError message={errors.package_name} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="installation_date" value="Tanggal Instalasi" />
                            <TextInput
                                id="installation_date"
                                type="date"
                                className="mt-1 block w-full rounded-xl"
                                value={data.installation_date}
                                onChange={(e) => setData('installation_date', e.target.value)}
                                required
                            />
                            <InputError message={errors.installation_date} className="mt-2" />
                        </div>
                    </div>

                    <div>
                        <InputLabel htmlFor="access_point_location" value="Lokasi Titik Akses (Router)" />
                        <TextInput
                            id="access_point_location"
                            className="mt-1 block w-full rounded-xl"
                            value={data.access_point_location}
                            onChange={(e) => setData('access_point_location', e.target.value)}
                            placeholder="Misal: Ruang Tamu, Lantai 2, pojok teras"
                        />
                        <InputError message={errors.access_point_location} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="status" value="Status Layanan" />
                        <div className="flex gap-4 mt-2">
                            {['aktif', 'isolir', 'berhenti'].map((s) => (
                                <label key={s} className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="status"
                                        value={s}
                                        checked={data.status === s}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="text-indigo-600 focus:ring-indigo-500 dark:bg-slate-900 border-slate-300"
                                    />
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize group-hover:text-indigo-600 transition-colors">{s}</span>
                                </label>
                            ))}
                        </div>
                        <InputError message={errors.status} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="notes" value="Catatan Tambahan" />
                        <textarea
                            id="notes"
                            className="mt-1 block w-full rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
                            rows="3"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            placeholder="Keterangan tambahan jika ada..."
                        ></textarea>
                        <InputError message={errors.notes} className="mt-2" />
                    </div>

                    <div className="pt-4 flex justify-end">
                        <PrimaryButton className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 dark:shadow-none" disabled={processing}>
                            <Save size={18} className="mr-2" />
                            {isEdit ? 'Simpan Perubahan' : 'Daftarkan Pelanggan'}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </SiePemberdayaanLayout>
    );
}
