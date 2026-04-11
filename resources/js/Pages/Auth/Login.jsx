import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    Eye,
    EyeOff,
    Lock,
    User,
    Building2,
    ArrowLeft,
    Shield,
    CheckCircle,
} from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        login: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [focused, setFocused] = useState(null);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Login" />

            <div className="min-h-screen flex font-sans antialiased">
                {/* ───── Left Panel - Decorative ───── */}
                <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-700">
                    {/* Pattern overlay */}
                    <div className="absolute inset-0 opacity-[0.05]" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />

                    {/* Decorative blobs */}
                    <div className="absolute top-1/4 -right-20 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl" />
                    <div className="absolute bottom-1/4 -left-20 w-96 h-96 rounded-full bg-teal-400/15 blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-emerald-300/10 blur-3xl" />

                    {/* Content */}
                    <div className="relative flex flex-col justify-between p-12 xl:p-16 w-full">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                                <Building2 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white tracking-tight">SIRAWE</h1>
                                <p className="text-xs text-emerald-300 font-medium">Sistem Informasi RT-RW</p>
                            </div>
                        </div>

                        {/* Center content */}
                        <div className="my-auto">
                            <h2 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-6">
                                Portal
                                <br />
                                <span className="bg-gradient-to-r from-emerald-300 to-teal-200 bg-clip-text text-transparent">
                                    Administrasi RT-RW
                                </span>
                            </h2>
                            <p className="text-emerald-100/80 text-lg leading-relaxed max-w-lg mb-10">
                                Akses layanan administrasi RT-RW secara digital. Ajukan surat, pantau status permohonan, dan kelola data kependudukan dengan mudah.
                            </p>

                            {/* Feature highlights */}
                            <div className="space-y-4">
                                {[
                                    'Pengajuan surat online tanpa antri',
                                    'Tracking status permohonan real-time',
                                    'Verifikasi dokumen dengan QR Code',
                                    'Data kependudukan terintegrasi',
                                ].map((feat) => (
                                    <div key={feat} className="flex items-center gap-3">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-400/20 flex items-center justify-center">
                                            <CheckCircle className="w-4 h-4 text-emerald-300" />
                                        </div>
                                        <span className="text-emerald-100 text-sm">{feat}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bottom info */}
                        <div className="flex items-center gap-3 text-emerald-300/60 text-sm">
                            <Shield className="w-4 h-4" />
                            <span>Dilindungi enkripsi SSL untuk keamanan data Anda</span>
                        </div>
                    </div>
                </div>

                {/* ───── Right Panel - Form ───── */}
                <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 px-4 sm:px-6 lg:px-8">
                    <div className="w-full max-w-md">
                        {/* Back to home */}
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:text-emerald-400 transition-colors mb-8 group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Kembali ke Beranda
                        </Link>

                        {/* Mobile logo */}
                        <div className="lg:hidden flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/30 flex items-center justify-center">
                                <Building2 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">SIRAWE</h1>
                                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Sistem Informasi RT-RW</p>
                            </div>
                        </div>

                        {/* Form header */}
                        <div className="mb-8">
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
                                Masuk ke Sistem
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400">
                                Masukkan NIK atau email dan password untuk melanjutkan
                            </p>
                        </div>

                        {/* Status */}
                        {status && (
                            <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                                    <p className="text-sm font-medium text-emerald-700">{status}</p>
                                </div>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={submit} className="space-y-6">
                            {/* NIK / Email field */}
                            <div>
                                <label
                                    htmlFor="login"
                                    className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
                                >
                                    NIK atau Email
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User
                                            className={`w-5 h-5 transition-colors duration-200 ${
                                                focused === 'login' ? 'text-emerald-500' : 'text-slate-400'
                                            }`}
                                        />
                                    </div>
                                    <input
                                        id="login"
                                        type="text"
                                        name="login"
                                        value={data.login}
                                        placeholder="Contoh: 3201xxxxxxxxxxxx atau email@anda.com"
                                        className={`block w-full pl-12 pr-4 py-3.5 rounded-xl border-2 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm transition-all duration-200 bg-white dark:bg-slate-800 ${
                                            errors.login
                                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                                                : focused === 'login'
                                                ? 'border-emerald-400 ring-4 ring-emerald-500/10'
                                                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:border-slate-600'
                                        } focus:outline-none`}
                                        autoComplete="username"
                                        autoFocus
                                        onFocus={() => setFocused('login')}
                                        onBlur={() => setFocused(null)}
                                        onChange={(e) => setData('login', e.target.value)}
                                    />
                                </div>
                                {errors.login && (
                                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5">
                                        <span className="w-1 h-1 rounded-full bg-red-500" />
                                        {errors.login}
                                    </p>
                                )}
                            </div>

                            {/* Password field */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
                                >
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock
                                            className={`w-5 h-5 transition-colors duration-200 ${
                                                focused === 'password' ? 'text-emerald-500' : 'text-slate-400'
                                            }`}
                                        />
                                    </div>
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={data.password}
                                        placeholder="Masukkan password"
                                        className={`block w-full pl-12 pr-12 py-3.5 rounded-xl border-2 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm transition-all duration-200 bg-white dark:bg-slate-800 ${
                                            errors.password
                                                ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                                                : focused === 'password'
                                                ? 'border-emerald-400 ring-4 ring-emerald-500/10'
                                                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:border-slate-600'
                                        } focus:outline-none`}
                                        autoComplete="current-password"
                                        onFocus={() => setFocused('password')}
                                        onBlur={() => setFocused(null)}
                                        onChange={(e) => setData('password', e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:text-slate-400 transition-colors"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1.5">
                                        <span className="w-1 h-1 rounded-full bg-red-500" />
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Remember & Forgot */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2.5 cursor-pointer group">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            name="remember"
                                            checked={data.remember}
                                            onChange={(e) => setData('remember', e.target.checked)}
                                            className="peer sr-only"
                                        />
                                        <div className="w-5 h-5 rounded-md border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 peer-checked:bg-emerald-500 peer-checked:border-emerald-500 transition-all duration-200 flex items-center justify-center group-hover:border-emerald-400">
                                            <svg
                                                className={`w-3 h-3 text-white transition-opacity ${
                                                    data.remember ? 'opacity-100' : 'opacity-0'
                                                }`}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={3}
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    </div>
                                    <span className="text-sm text-slate-600 dark:text-slate-400 select-none">Ingat saya</span>
                                </label>

                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-medium transition-colors"
                                    >
                                        Lupa password?
                                    </Link>
                                )}
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="relative w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg transition-all duration-300 overflow-hidden group"
                            >
                                <span className={`inline-flex items-center gap-2 transition-all duration-300 ${processing ? 'opacity-0' : 'opacity-100'}`}>
                                    <Lock className="w-4 h-4" />
                                    Masuk
                                </span>
                                {processing && (
                                    <span className="absolute inset-0 flex items-center justify-center">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                    </span>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="mt-8 relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200 dark:border-slate-700" />
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="px-4 bg-slate-50 dark:bg-slate-800/50 text-slate-400 font-medium">Informasi Login</span>
                            </div>
                        </div>

                        {/* Help text */}
                        <div className="mt-6 p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                                    <Shield className="w-4 h-4 text-blue-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                        <strong className="text-slate-700 dark:text-slate-300">Warga:</strong> Login menggunakan NIK 16 digit dan password yang sudah diberikan oleh operator.
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                                        <strong className="text-slate-700 dark:text-slate-300">Perangkat:</strong> Login menggunakan email dan password yang telah didaftarkan.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <p className="mt-8 text-center text-xs text-slate-400">
                            © {new Date().getFullYear()} SIRAWE — Sistem Informasi RT-RW
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
