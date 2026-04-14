import React from 'react';
import SiePemberdayaanLayout from '@/Layouts/SiePemberdayaanLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronLeft, Save, Wallet } from 'lucide-react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Form({ participation, familyCards }) {
    const isEdit = !!participation;

    const { data, setData, post, put, processing, errors } = useForm({
        family_card_id: participation?.family_card_id || '',
        is_active: participation?.is_active ?? true,
        balance: participation?.balance || 0,
        notes: participation?.notes || '',
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('sie-pemberdayaan.waste.update', participation.id));
        } else {
            post(route('sie-pemberdayaan.waste.store'));
        }
    };

    return (
        <SiePemberdayaanLayout header={isEdit ? 'Edit Partisipasi' : 'Daftar Partisipasi Baru'}>
            <Head title={isEdit ? 'Edit Partisipasi' : 'Daftar Partisipasi'} />

            <div className="mb-8 flex items-center gap-4">
                <Link 
                    href={route('sie-pemberdayaan.waste.index')}
                    className="p-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 text-slate-500 hover:text-indigo-600 transition-colors"
                >
                    <ChevronLeft size={20} />
                </Link>
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{isEdit ? 'Update Data Partisipasi' : 'Registrasi Bank Sampah'}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Kelola status partisipasi warga dalam program lingkungan RW.</p>
                </div>
            </div>

            <div className="max-w-2xl">
                <form onSubmit={submit} className="space-y-6 bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div>
                        <InputLabel htmlFor="family_card_id" value="Keluarga (KK)" />
                        <select
                            id="family_card_id"
                            className="mt-1 block w-full rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm transition-all h-11"
                            value={data.family_card_id}
                            onChange={(e) => setData('family_card_id', e.target.value)}
                            disabled={isEdit}
                            required
                        >
                            <option value="">Pilih KK...</option>
                            {isEdit ? (
                                <option value={participation.family_card_id}>
                                    {participation.family_card.no_kk} - {participation.family_card.kepala_keluarga?.nama_lengkap || 'Tanpa Kepala'} [RT {participation.family_card.wilayah?.rt}/RW {participation.family_card.wilayah?.rw}]
                                </option>
                            ) : (
                                familyCards.map((kk) => (
                                    <option key={kk.id} value={kk.id}>
                                        {kk.no_kk} - {kk.kepala_keluarga?.nama_lengkap || 'Tanpa Kepala'} [RT {kk.wilayah?.rt}/RW {kk.wilayah?.rw}]
                                    </option>
                                ))
                            )}
                        </select>
                        <InputError message={errors.family_card_id} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="balance" value="Saldo Bank Sampah (Rp)" />
                        <div className="relative mt-1">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <span className="text-slate-400 font-bold text-sm">Rp</span>
                            </div>
                            <TextInput
                                id="balance"
                                type="number"
                                className="block w-full pl-12 rounded-xl"
                                value={data.balance}
                                onChange={(e) => setData('balance', e.target.value)}
                                min="0"
                                required
                            />
                        </div>
                        <InputError message={errors.balance} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="is_active" value="Status Partisipasi" />
                        <div className="flex gap-6 mt-2">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="is_active"
                                    checked={data.is_active === true}
                                    onChange={() => setData('is_active', true)}
                                    className="text-indigo-600 focus:ring-indigo-500 dark:bg-slate-900 border-slate-300"
                                />
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 transition-colors">Aktif</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input
                                    type="radio"
                                    name="is_active"
                                    checked={data.is_active === false}
                                    onChange={() => setData('is_active', false)}
                                    className="text-indigo-600 focus:ring-indigo-500 dark:bg-slate-900 border-slate-300"
                                />
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-red-600 transition-colors">Nonaktif</span>
                            </label>
                        </div>
                        <InputError message={errors.is_active} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="notes" value="Catatan / Keterangan" />
                        <textarea
                            id="notes"
                            className="mt-1 block w-full rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
                            rows="3"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            placeholder="Keterangan tambahan..."
                        ></textarea>
                        <InputError message={errors.notes} className="mt-2" />
                    </div>

                    <div className="pt-4 flex justify-end">
                        <PrimaryButton className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 dark:shadow-none" disabled={processing}>
                            <Save size={18} className="mr-2" />
                            {isEdit ? 'Simpan Perubahan' : 'Daftarkan Partisipasi'}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </SiePemberdayaanLayout>
    );
}
