import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Search, Plus, Edit2, Trash2, Shield, MapPin } from 'lucide-react';
import { ROLE_LABELS } from '@/Helpers/constants';
import { formatDateTime } from '@/Helpers/formatters';

export default function Index({ users, roles, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [roleFilter, setRoleFilter] = useState(filters.role || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.users.index'), { search, role: roleFilter }, { preserveState: true });
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
            router.delete(route('admin.users.destroy', id));
        }
    };

    const roleColor = {
        kades: 'bg-purple-50 text-purple-700 ring-purple-600/20',
        operator: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 ring-blue-600/20',
        rw: 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 ring-teal-600/20',
        rt: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 ring-emerald-600/20',
        sie_rukem: 'bg-violet-50 dark:bg-violet-900/30 text-violet-700 ring-violet-600/20',
        kepala_kk: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 ring-amber-600/20',
        warga: 'bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 ring-slate-600/20',
    };

    return (
        <AdminLayout header="Manajemen User">
            <Head title="User" />

            <div className="sm:flex sm:items-center sm:justify-between mb-6">
                <p className="text-sm text-slate-700 dark:text-slate-300">Kelola akun pengguna dan hak akses sistem.</p>
                <div className="mt-4 sm:mt-0">
                    <Link href={route('admin.users.create')} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors">
                        <Plus size={16} /> Tambah User
                    </Link>
                </div>
            </div>

            <div className="glass bg-white dark:bg-slate-800 p-4 mb-6 shadow-sm rounded-xl">
                <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
                    <div className="relative flex-1 min-w-[200px] max-w-md">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-5 w-5 text-slate-400" />
                        </div>
                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="block w-full rounded-lg border-0 py-2.5 pl-10 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50" placeholder="Cari nama, email, atau NIK..." />
                    </div>
                    <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="rounded-lg border-0 py-2.5 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 focus:ring-2 focus:ring-inset focus:ring-emerald-600 sm:text-sm bg-slate-50 dark:bg-slate-800/50">
                        <option value="">Semua Role</option>
                        {roles.map((r) => <option key={r.id} value={r.name}>{ROLE_LABELS[r.name] || r.name}</option>)}
                    </select>
                    <button type="submit" className="rounded-lg bg-slate-100 dark:bg-slate-700 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">Filter</button>
                </form>
            </div>

            <div className="bg-white dark:bg-slate-800 overflow-hidden shadow-sm rounded-xl">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 dark:text-white sm:pl-6">User</th>
                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">NIK</th>
                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">Role</th>
                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">Status</th>
                                <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900 dark:text-white">Terdaftar</th>
                                <th className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Aksi</span></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {users.data.length === 0 ? (
                                <tr><td colSpan="6" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">Tidak ada user.</td></tr>
                            ) : (
                                users.data.map((u) => (
                                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-700 font-bold text-sm">
                                                    {u.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-medium text-slate-900 dark:text-white">{u.name}</div>
                                                    <div className="text-sm text-slate-500 dark:text-slate-400">{u.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400 font-mono">{u.nik || '-'}</td>
                                        <td className="whitespace-nowrap px-3 py-4">
                                            <span className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold ring-1 ring-inset ${roleColor[u.role_name] || 'bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 ring-slate-300 dark:ring-slate-700'}`}>
                                                <Shield size={10} />
                                                {ROLE_LABELS[u.role_name] || u.role_name}
                                            </span>
                                            {u.wilayah && (
                                                <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-500 font-medium">
                                                    <MapPin size={10} className="text-slate-400" />
                                                    RT {u.wilayah.rt} / RW {u.wilayah.rw}
                                                </div>
                                            )}
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4">
                                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${u.is_active !== false ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                                {u.is_active !== false ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 dark:text-slate-400">{formatDateTime(u.created_at)}</td>
                                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm sm:pr-6 flex gap-1 justify-end">
                                            <Link href={route('admin.users.edit', u.id)} className="text-indigo-500 hover:text-indigo-700 p-1.5 rounded-full hover:bg-indigo-50 dark:bg-indigo-900/30 transition-colors">
                                                <Edit2 size={16} />
                                            </Link>
                                            <button onClick={() => handleDelete(u.id)} className="text-red-500 hover:text-red-700 p-1.5 rounded-full hover:bg-red-50 dark:bg-red-900/30 transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {users.links && users.links.length > 3 && (
                    <div className="border-t border-slate-200 dark:border-slate-700 px-4 py-3 flex justify-between items-center sm:px-6">
                        <p className="text-sm text-slate-700 dark:text-slate-300">
                            Menampilkan <span className="font-medium">{users.from || 0}</span> - <span className="font-medium">{users.to || 0}</span> dari <span className="font-medium">{users.total}</span>
                        </p>
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                            {users.links.map((link, i) => (
                                <Link key={i} href={link.url || '#'} className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${link.active ? 'bg-emerald-600 text-white' : 'text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'} ${i === 0 ? 'rounded-l-md' : ''} ${i === users.links.length - 1 ? 'rounded-r-md' : ''}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                            ))}
                        </nav>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
