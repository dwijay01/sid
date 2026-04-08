import React from 'react';
import { Head, router } from '@inertiajs/react';
import RwLayout from '@/Layouts/RwLayout';
import { UserCog, ShieldCheck, ShieldOff, MapPin } from 'lucide-react';

export default function ManageRtUsers({ rtUsers, wilayahList }) {
    const handleToggle = (userId) => {
        if (confirm('Apakah Anda yakin ingin mengubah akses user ini?')) {
            router.post(route('rw.rt-users.toggle', userId));
        }
    };

    return (
        <RwLayout header="Kelola Akses RT">
            <Head title="Kelola Akses RT - RW" />

            <div className="mb-6">
                <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="bg-amber-100 dark:bg-amber-900/40 p-3 rounded-xl text-amber-600 dark:text-amber-400">
                            <UserCog size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Kelola Akses Pengguna RT</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Aktifkan atau nonaktifkan akses Ketua RT di wilayah RW Anda.</p>
                        </div>
                    </div>
                </div>
            </div>

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
                                        <p className="text-sm text-slate-500 dark:text-slate-400">Belum ada Ketua RT terdaftar</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </RwLayout>
    );
}
