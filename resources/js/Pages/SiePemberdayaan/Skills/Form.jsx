import React from 'react';
import SiePemberdayaanLayout from '@/Layouts/SiePemberdayaanLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronLeft, Save, Briefcase, Hammer, GraduationCap, Wrench } from 'lucide-react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Form({ skill, residents }) {
    const isEdit = !!skill;

    const { data, setData, post, put, processing, errors } = useForm({
        resident_id: skill?.resident_id || '',
        category: skill?.category || 'Jasa',
        skill_name: skill?.skill_name || '',
        description: skill?.description || '',
    });

    const submit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('sie-pemberdayaan.skills.update', skill.id));
        } else {
            post(route('sie-pemberdayaan.skills.store'));
        }
    };

    const categories = [
        { id: 'Jasa', icon: Briefcase, color: 'bg-blue-500' },
        { id: 'Teknik', icon: Hammer, color: 'bg-amber-500' },
        { id: 'Pendidikan', icon: GraduationCap, color: 'bg-indigo-500' },
        { id: 'Lainnya', icon: Wrench, color: 'bg-slate-500' },
    ];

    return (
        <SiePemberdayaanLayout header={isEdit ? 'Edit Keahlian' : 'Tambah Keahlian Warga'}>
            <Head title={isEdit ? 'Edit Keahlian' : 'Tambah Keahlian'} />

            <div className="mb-8 flex items-center gap-4">
                <Link 
                    href={route('sie-pemberdayaan.skills.index')}
                    className="p-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 text-slate-500 hover:text-indigo-600 transition-colors"
                >
                    <ChevronLeft size={20} />
                </Link>
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">{isEdit ? 'Update Potensi Warga' : 'Pendataan SDM Warga'}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Daftarkan keahlian spesifik warga untuk pemberdayaan komunitas.</p>
                </div>
            </div>

            <div className="max-w-3xl">
                <form onSubmit={submit} className="space-y-8 bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div>
                        <InputLabel htmlFor="resident_id" value="Nama Warga" />
                        <select
                            id="resident_id"
                            className="mt-1 block w-full rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm transition-all h-11"
                            value={data.resident_id}
                            onChange={(e) => setData('resident_id', e.target.value)}
                            disabled={isEdit}
                            required
                        >
                            <option value="">Pilih Warga...</option>
                            {residents.map((res) => (
                                <option key={res.id} value={res.id}>
                                    {res.nama_lengkap} (NIK: {res.nik})
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.resident_id} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel value="Kategori Bidang" className="mb-3" />
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setData('category', cat.id)}
                                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                                        data.category === cat.id 
                                            ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-100 dark:ring-0' 
                                            : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-700 text-slate-500 hover:border-slate-200'
                                    }`}
                                >
                                    <cat.icon size={24} className="mb-2" />
                                    <span className="text-xs font-bold uppercase tracking-wider">{cat.id}</span>
                                </button>
                            ))}
                        </div>
                        <InputError message={errors.category} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="skill_name" value="Nama Keahlian / Jasa" />
                        <TextInput
                            id="skill_name"
                            className="mt-1 block w-full rounded-xl"
                            value={data.skill_name}
                            onChange={(e) => setData('skill_name', e.target.value)}
                            placeholder="Misal: Tukang Listrik, Guru Les Matematika, Service AC..."
                            required
                        />
                        <InputError message={errors.skill_name} className="mt-2" />
                    </div>

                    <div>
                        <InputLabel htmlFor="description" value="Deskripsi Detail" />
                        <textarea
                            id="description"
                            className="mt-1 block w-full rounded-xl border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
                            rows="4"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            placeholder="Jelaskan spesialisasi atau pengalaman tertentu..."
                        ></textarea>
                        <InputError message={errors.description} className="mt-2" />
                    </div>

                    <div className="pt-4 flex justify-end">
                        <PrimaryButton className="px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-100 dark:shadow-none" disabled={processing}>
                            <Save size={18} className="mr-2" />
                            {isEdit ? 'Simpan Perubahan' : 'Catat Keahlian'}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </SiePemberdayaanLayout>
    );
}
