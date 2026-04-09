import React, { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import RwLayout from '@/Layouts/RwLayout';
import { UserCog, ShieldCheck, ShieldOff, MapPin, Plus, X, Users } from 'lucide-react';

export default function ManageRtUsers({ rtUsers, wilayahList, rukemUsers = [] }) {
    const [activeTab, setActiveTab] = useState('rt');
    const [showModal, setShowModal] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'rt',
        wilayah_id: '',
    });

    const openModal = (role) => {
        clearErrors();
        reset();
        setData('role', role);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        reset();
        clearErrors();
    };

    const handleToggle = (userId) => {
        if (confirm('Apakah Anda yakin ingin mengubah akses user ini?')) {
            router.post(route('rw.rt-users.toggle', userId));
        }
    };

    const handleStoreUser = (e) => {
        e.preventDefault();
        post(route('rw.rt-users.store'), {
            onSuccess: () => closeModal(),
        });
    };

    return (
        <RwLayout header={`Kelola Akses ${activeTab === 'rt' ? 'RT' : 'Sie Rukem'}`}>
            <Head title="Kelola Akses - RW" />

            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 shadow-sm flex-1 w-full">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-amber-100 dark:bg-amber-900/40 p-3 rounded-xl text-amber-600 dark:text-amber-400">
                                <UserCog size={24} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Kelola Akses Pengguna</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Kelola akun untuk Ketua RT dan Sie Rukun Kematian.</p>
                            </div>
                        </div>
                        <button onClick={() => openModal(activeTab)} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold shadow-sm transition-colors flex items-center gap-2">
                            <Plus size={16} /> Tambah Akun
                        </button>
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <div className="flex border-b border-slate-200 dark:border-slate-700">
                    <button
                        onClick={() => setActiveTab('rt')}
                        className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${
                            activeTab === 'rt'
                                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                    >
                        Ketua RT
                    </button>
                    <button
                        onClick={() => setActiveTab('rukem')}
                        className={`px-6 py-3 font-semibold text-sm border-b-2 transition-colors ${
                            activeTab === 'rukem'
                                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                    >
                        Sie Rukun Kematian
                    </button>
                </div>
            </div>

            {activeTab === 'rt' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wilayahList.map((w) => {
                        const rtUser = rtUsers.find(u => u.managed_wilayah?.id === w.id);
                        return (
                            <div key={w.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg text-blue-600 dark:text-blue-400">
                                            <MapPin size={18} />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-slate-900 dark:text-white">RT {w.rt} / RW {w.rw}</h3>
                                            {w.dusun && <p className="text-xs text-slate-500 dark:text-slate-400">{w.dusun}</p>}
                                        </div>
                                    </div>
                                </div>
                                <div className="px-6 py-5">
                                    {rtUser ? (
                                        <>
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold text-lg">
                                                    {rtUser.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 dark:text-white">{rtUser.name}</p>
                                                    <p className="text-xs text-slate-500">{rtUser.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                                                    rtUser.is_active 
                                                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' 
                                                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                                }`}>
                                                    {rtUser.is_active ? <><ShieldCheck size={14} /> Aktif</> : <><ShieldOff size={14} /> Nonaktif</>}
                                                </span>
                                                <button
                                                    onClick={() => handleToggle(rtUser.id)}
                                                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                                                        rtUser.is_active
                                                            ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-100'
                                                            : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100'
                                                    }`}
                                                >
                                                    {rtUser.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center py-4">
                                            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">Belum ada Ketua RT terdaftar</p>
                                            <button onClick={() => { openModal('rt'); setData('wilayah_id', w.id); }} className="text-xs font-bold text-blue-600 hover:text-blue-700">
                                                + Buat Akun RT Baru
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {activeTab === 'rukem' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rukemUsers.length === 0 ? (
                        <div className="col-span-full bg-white dark:bg-slate-800 p-8 rounded-xl border border-slate-200 dark:border-slate-700 text-center">
                            <Users size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Belum Ada Akun Sie Rukem</h3>
                            <p className="text-slate-500 dark:text-slate-400 mb-4">Silakan buat akun Sie Rukun Kematian untuk mengelola data anggota.</p>
                            <button onClick={() => openModal('sie_rukem')} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold shadow-sm transition-colors mx-auto flex items-center gap-2">
                                <Plus size={16} /> Tambah Akun
                            </button>
                        </div>
                    ) : (
                        rukemUsers.map((user) => (
                            <div key={user.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm px-6 py-5">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold text-lg">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white">{user.name}</p>
                                        <p className="text-xs text-slate-500">{user.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                                        user.is_active 
                                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' 
                                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                    }`}>
                                        {user.is_active ? <><ShieldCheck size={14} /> Aktif</> : <><ShieldOff size={14} /> Nonaktif</>}
                                    </span>
                                    <button
                                        onClick={() => handleToggle(user.id)}
                                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                                            user.is_active
                                                ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-100'
                                                : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100'
                                        }`}
                                    >
                                        {user.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
                        <div className="fixed inset-0 bg-slate-900/75 backdrop-blur-sm transition-opacity" onClick={closeModal} />
                        
                        <div className="relative transform overflow-hidden rounded-xl bg-white dark:bg-slate-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-slate-200 dark:border-slate-700">
                            <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                    Tambah Akun {data.role === 'rt' ? 'Ketua RT' : 'Sie Rukun Kematian'}
                                </h3>
                                <button onClick={closeModal} className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300">
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleStoreUser}>
                                <div className="px-6 py-5 space-y-4">
                                    {data.role === 'rt' && (
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Wilayah RT *</label>
                                            <select 
                                                value={data.wilayah_id} 
                                                onChange={(e) => setData('wilayah_id', e.target.value)}
                                                className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-blue-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50"
                                            >
                                                <option value="">-- Pilih Wilayah --</option>
                                                {wilayahList.map((w) => (
                                                    <option key={w.id} value={w.id}>RT {w.rt} / RW {w.rw}</option>
                                                ))}
                                            </select>
                                            {errors.wilayah_id && <p className="mt-1 text-sm text-red-600">{errors.wilayah_id}</p>}
                                        </div>
                                    )}
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nama Lengkap *</label>
                                        <input 
                                            type="text" 
                                            value={data.name} 
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-blue-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50"
                                        />
                                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email *</label>
                                        <input 
                                            type="email" 
                                            value={data.email} 
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-blue-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50"
                                        />
                                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password *</label>
                                        <input 
                                            type="password" 
                                            value={data.password} 
                                            onChange={(e) => setData('password', e.target.value)}
                                            className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-blue-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50"
                                        />
                                        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Konfirmasi Password *</label>
                                        <input 
                                            type="password" 
                                            value={data.password_confirmation} 
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            className="block w-full rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-blue-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50"
                                        />
                                    </div>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
                                    <button 
                                        type="button" 
                                        onClick={closeModal}
                                        className="px-4 py-2 font-semibold text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button 
                                        type="submit" 
                                        disabled={processing}
                                        className="px-6 py-2 font-bold text-sm text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors disabled:opacity-50"
                                    >
                                        {processing ? 'Menyimpan...' : 'Simpan'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </RwLayout>
    );
}
