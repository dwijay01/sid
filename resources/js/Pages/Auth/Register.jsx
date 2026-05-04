import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import {
    Eye,
    EyeOff,
    Lock,
    User,
    Building2,
    ArrowLeft,
    Shield,
    CheckCircle,
    MapPin,
    Mail,
} from 'lucide-react';

export default function Register({ wilayahList = [], status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        wilayah_id: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [focused, setFocused] = useState(null);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Pendaftaran Ketua RT" />

            <div className="min-h-screen flex font-sans antialiased">
                {/* ───── Left Panel - Decorative ───── */}
                <div className="hidden lg:flex lg:w-1/2 xl:w-[50%] relative overflow-hidden bg-gradient-to-br from-blue-800 via-blue-700 to-indigo-700">
                    {/* Pattern overlay */}
                    <div className="absolute inset-0 opacity-[0.05]" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />

                    {/* Decorative blobs */}
                    <div className="absolute top-1/4 -right-20 w-96 h-96 rounded-full bg-blue-500/20 blur-3xl" />
                    <div className="absolute bottom-1/4 -left-20 w-96 h-96 rounded-full bg-indigo-400/15 blur-3xl" />

                    {/* Content */}
                    <div className="relative flex flex-col justify-between p-12 xl:p-16 w-full">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                                <Building2 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white tracking-tight">SIERWE</h1>
                                <p className="text-xs text-blue-200 font-medium">Sistem Informasi RT-RW</p>
                            </div>
                        </div>

                        {/* Center content */}
                        <div className="my-auto">
                            <h2 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-6">
                                Pendaftaran
                                <br />
                                <span className="bg-gradient-to-r from-blue-300 to-indigo-200 bg-clip-text text-transparent">
                                    Akun Ketua RT
                                </span>
                            </h2>
                            <p className="text-blue-100/80 text-lg leading-relaxed max-w-lg mb-10">
                                Segera daftarkan akun Anda sebagai Ketua RT untuk mulai mengelola data warga dan layanan administrasi di wilayah Anda.
                            </p>

                            {/* Info Box */}
                            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-400/20 flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-blue-300" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold mb-1">Verifikasi Ketua RW</h4>
                                        <p className="text-blue-100/70 text-sm">
                                            Setiap pendaftaran akun Ketua RT akan divalidasi dan diaktifkan secara manual oleh Ketua RW masing-masing.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom info */}
                        <div className="flex items-center gap-3 text-blue-300/60 text-sm">
                            <Shield className="w-4 h-4" />
                            <span>Keamanan data prioritas utama kami</span>
                        </div>
                    </div>
                </div>

                {/* ───── Right Panel - Form ───── */}
                <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 px-4 sm:px-6 lg:px-8 overflow-y-auto py-12">
                    <div className="w-full max-w-md">
                        {/* Back to login */}
                        <Link
                            href={route('login')}
                            className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:text-blue-400 transition-colors mb-8 group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Kembali ke Login
                        </Link>

                        {/* Form header */}
                        <div className="mb-8">
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
                                Daftarkan Diri Anda
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400">
                                Lengkapi data di bawah ini untuk mengajukan akses Ketua RT
                            </p>
                        </div>

                        {/* Status Message (Registration Success) */}
                        {status && (
                            <div className="mb-8 p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                                        <CheckCircle className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-emerald-800 dark:text-emerald-100 font-bold text-sm leading-relaxed">
                                            {status}
                                        </p>
                                        <div className="mt-4">
                                            <Link 
                                                href={route('login')}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors shadow-sm shadow-emerald-600/20"
                                            >
                                                Ke Halaman Login
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {!status && (
                            <form onSubmit={submit} className="space-y-5">
                                {/* Name field */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                        Nama Lengkap
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <User className={`w-5 h-5 transition-colors ${focused === 'name' ? 'text-blue-500' : 'text-slate-400'}`} />
                                        </div>
                                        <input
                                            type="text"
                                            value={data.name}
                                            required
                                            className={`block w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all bg-white dark:bg-slate-800 dark:text-white sm:text-sm ${
                                                errors.name ? 'border-red-300 ring-4 ring-red-500/10' : focused === 'name' ? 'border-blue-400 ring-4 ring-blue-500/10' : 'border-slate-200 dark:border-slate-700'
                                            } focus:outline-none`}
                                            placeholder="Masukkan nama lengkap"
                                            onFocus={() => setFocused('name')}
                                            onBlur={() => setFocused(null)}
                                            onChange={(e) => setData('name', e.target.value)}
                                        />
                                    </div>
                                    {errors.name && <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.name}</p>}
                                </div>

                                {/* Email field */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                        Alamat Email
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Mail className={`w-5 h-5 transition-colors ${focused === 'email' ? 'text-blue-500' : 'text-slate-400'}`} />
                                        </div>
                                        <input
                                            type="email"
                                            value={data.email}
                                            required
                                            className={`block w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all bg-white dark:bg-slate-800 dark:text-white sm:text-sm ${
                                                errors.email ? 'border-red-300 ring-4 ring-red-500/10' : focused === 'email' ? 'border-blue-400 ring-4 ring-blue-500/10' : 'border-slate-200 dark:border-slate-700'
                                            } focus:outline-none`}
                                            placeholder="email@anda.com"
                                            onFocus={() => setFocused('email')}
                                            onBlur={() => setFocused(null)}
                                            onChange={(e) => setData('email', e.target.value)}
                                        />
                                    </div>
                                    {errors.email && <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.email}</p>}
                                </div>

                                {/* Wilayah field */}
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                        Wilayah (RT / RW)
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <MapPin className={`w-5 h-5 transition-colors ${focused === 'wilayah' ? 'text-blue-500' : 'text-slate-400'}`} />
                                        </div>
                                        <select
                                            value={data.wilayah_id}
                                            required
                                            className={`block w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all bg-white dark:bg-slate-800 dark:text-white sm:text-sm appearance-none ${
                                                errors.wilayah_id ? 'border-red-300 ring-4 ring-red-500/10' : focused === 'wilayah' ? 'border-blue-400 ring-4 ring-blue-500/10' : 'border-slate-200 dark:border-slate-700'
                                            } focus:outline-none`}
                                            onFocus={() => setFocused('wilayah')}
                                            onBlur={() => setFocused(null)}
                                            onChange={(e) => setData('wilayah_id', e.target.value)}
                                        >
                                            <option value="">-- Pilih Wilayah RT / RW --</option>
                                            {wilayahList.map((w) => (
                                                <option key={w.id} value={w.id}>
                                                    RT {w.rt} / RW {w.rw} {w.dusun ? `(${w.dusun})` : ''}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                            <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                    {errors.wilayah_id && <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.wilayah_id}</p>}
                                </div>

                                {/* Password field */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Lock className={`w-5 h-5 transition-colors ${focused === 'password' ? 'text-blue-500' : 'text-slate-400'}`} />
                                            </div>
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={data.password}
                                                required
                                                className={`block w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all bg-white dark:bg-slate-800 dark:text-white sm:text-sm ${
                                                    errors.password ? 'border-red-300 ring-4 ring-red-500/10' : focused === 'password' ? 'border-blue-400 ring-4 ring-blue-500/10' : 'border-slate-200 dark:border-slate-700'
                                                } focus:outline-none`}
                                                placeholder="••••••••"
                                                onFocus={() => setFocused('password')}
                                                onBlur={() => setFocused(null)}
                                                onChange={(e) => setData('password', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                            Konfirmasi
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Lock className={`w-5 h-5 transition-colors ${focused === 'confirm' ? 'text-blue-500' : 'text-slate-400'}`} />
                                            </div>
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={data.password_confirmation}
                                                required
                                                className={`block w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all bg-white dark:bg-slate-800 dark:text-white sm:text-sm ${
                                                    focused === 'confirm' ? 'border-blue-400 ring-4 ring-blue-500/10' : 'border-slate-200 dark:border-slate-700'
                                                } focus:outline-none`}
                                                placeholder="••••••••"
                                                onFocus={() => setFocused('confirm')}
                                                onBlur={() => setFocused(null)}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {errors.password && <p className="text-xs text-red-600 font-medium">{errors.password}</p>}

                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1.5"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        {showPassword ? 'Sembunyikan' : 'Lihat'} Password
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0"
                                >
                                    {processing ? 'Mendaftarkan...' : 'Daftar Sekarang'}
                                </button>
                            </form>
                        )}

                        {/* Footer */}
                        <p className="mt-8 text-center text-xs text-slate-400">
                            © {new Date().getFullYear()} SIERWE — Sistem Informasi RT-RW
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
