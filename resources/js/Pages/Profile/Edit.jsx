import { Head, usePage } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import WargaLayout from '@/Layouts/WargaLayout';
import AdminLayout from '@/Layouts/AdminLayout';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { UserCircle, Shield, AlertTriangle } from 'lucide-react';

export default function Edit({ mustVerifyEmail, status }) {
    const { auth } = usePage().props;
    const roles = auth.user.roles || [];
    
    // Choose dynamic layout based on roles so the user doesn't lose their sidebar
    let Layout = AuthenticatedLayout;
    if (roles.includes('warga') || roles.includes('kepala_kk')) {
        Layout = WargaLayout;
    } else if (roles.includes('operator')) {
        Layout = AdminLayout;
    }
    // We can add other layouts if needed, but this covers the main ones Warga/Admin

    return (
        <Layout header="Pengaturan Profil">
            <Head title="Profil" />

            <div className="max-w-7xl mx-auto py-8">
                {/* Header Section */}
                <div className="mb-8 px-4 sm:px-0">
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Pengaturan Akun</h1>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Kelola informasi pribadi, keamanan kata sandi, dan preferensi akun Anda.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    
                    {/* Left Sticky Navigation (Desktop) */}
                    <div className="hidden lg:block w-64 shrink-0 sticky top-24">
                        <nav className="space-y-1">
                            <a href="#profile-info" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300">
                                <UserCircle className="h-5 w-5" />
                                Informasi Profil
                            </a>
                            <a href="#security" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white transition-colors">
                                <Shield className="h-5 w-5" />
                                Keamanan Sandi
                            </a>
                            <a href="#danger-zone" className="flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                <AlertTriangle className="h-5 w-5" />
                                Zona Bahaya
                            </a>
                        </nav>
                    </div>

                    {/* Right Content Area */}
                    <div className="flex-1 w-full space-y-8">
                        
                        {/* Profile Information Block */}
                        <div id="profile-info" className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700 relative overflow-hidden">
                            <div className="absolute top-0 right-0 -mt-10 -mr-10 h-32 w-32 rounded-full bg-teal-500/5 blur-3xl"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
                                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400">
                                        <UserCircle className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Informasi Profil</h2>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Perbarui data diri dan alamat email Anda.</p>
                                    </div>
                                </div>
                                
                                <UpdateProfileInformationForm
                                    mustVerifyEmail={mustVerifyEmail}
                                    status={status}
                                    className="max-w-2xl"
                                />
                            </div>
                        </div>

                        {/* Update Password Block */}
                        <div id="security" className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 dark:border-slate-700 relative overflow-hidden">
                            <div className="absolute top-0 right-0 -mt-10 -mr-10 h-32 w-32 rounded-full bg-indigo-500/5 blur-3xl"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6 border-b border-slate-100 dark:border-slate-700 pb-4">
                                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                                        <Shield className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Keamanan Kata Sandi</h2>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Pastikan akun Anda menggunakan sandi yang panjang dan acak.</p>
                                    </div>
                                </div>

                                <UpdatePasswordForm className="max-w-2xl" />
                            </div>
                        </div>

                        {/* Delete User Block */}
                        <div id="danger-zone" className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm border border-red-200 dark:border-red-900/30 relative overflow-hidden">
                             <div className="absolute top-0 right-0 -mt-10 -mr-10 h-32 w-32 rounded-full bg-red-500/5 blur-3xl"></div>
                             <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6 border-b border-red-100 dark:border-red-900/20 pb-4">
                                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                                        <AlertTriangle className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-bold text-red-600 dark:text-red-400">Hapus Akun</h2>
                                        <p className="text-xs text-red-500/80 dark:text-red-400/80">Peringatan: Tindakan ini tidak dapat dibatalkan.</p>
                                    </div>
                                </div>
                                <DeleteUserForm className="max-w-2xl" />
                             </div>
                        </div>

                    </div>
                </div>
            </div>
        </Layout>
    );
}
