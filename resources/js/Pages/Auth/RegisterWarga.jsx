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
    Mail,
    IdCard,
    Calendar,
} from 'lucide-react';

export default function RegisterWarga({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        nik: '',
        nama_lengkap: '',
        tanggal_lahir: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [focused, setFocused] = useState(null);

    const submit = (e) => {
        e.preventDefault();
        post(route('register.warga'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Pendaftaran Akun Warga" />

            <div className="min-h-screen flex font-sans antialiased text-slate-900">
                {/* ───── Left Panel - Decorative ───── */}
                <div className="hidden lg:flex lg:w-1/2 xl:w-[50%] relative overflow-hidden bg-gradient-to-br from-teal-800 via-teal-700 to-cyan-700">
                    {/* Pattern overlay */}
                    <div className="absolute inset-0 opacity-[0.05]" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />

                    {/* Decorative blobs */}
                    <div className="absolute top-1/4 -right-20 w-96 h-96 rounded-full bg-teal-500/20 blur-3xl" />
                    <div className="absolute bottom-1/4 -left-20 w-96 h-96 rounded-full bg-cyan-400/15 blur-3xl" />

                    {/* Content */}
                    <div className="relative flex flex-col justify-between p-12 xl:p-16 w-full">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800/10 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-xl">
                                <Building2 className="w-6 h-6 text-teal-600" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white tracking-tight">SIERWE</h1>
                                <p className="text-xs text-teal-200 font-medium">Sistem Informasi RT-RW</p>
                            </div>
                        </div>

                        {/* Center content */}
                        <div className="my-auto">
                            <h2 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight mb-6">
                                Pendaftaran
                                <br />
                                <span className="bg-gradient-to-r from-teal-300 to-cyan-200 bg-clip-text text-transparent">
                                    Akun Warga Mandiri
                                </span>
                            </h2>
                            <p className="text-teal-100/80 text-lg leading-relaxed max-w-lg mb-10">
                                Aktifkan akun digital Anda untuk mulai menggunakan layanan desa secara online, memantau status surat, dan memperbarui data kependudukan.
                            </p>

                            {/* Info Box */}
                            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-teal-400/20 flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-teal-300" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold mb-1">Verifikasi Data KTP</h4>
                                        <p className="text-teal-100/70 text-sm">
                                            Pastikan NIK dan Tanggal Lahir yang Anda masukkan sudah sesuai dengan data di KTP Anda untuk aktivasi otomatis.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom info */}
                        <div className="flex items-center gap-3 text-teal-300/60 text-sm">
                            <Shield className="w-4 h-4" />
                            <span>Privasi dan keamanan data warga terjamin</span>
                        </div>
                    </div>
                </div>

                {/* ───── Right Panel - Form ───── */}
                <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4 sm:px-6 lg:px-8 overflow-y-auto py-12">
                    <div className="w-full max-w-md">
                        {/* Back to login */}
                        <Link
                            href={route('login')}
                            className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors mb-8 group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            Kembali ke Login
                        </Link>

                        {/* Form header */}
                        <div className="mb-8">
                            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
                                Daftar Akun Warga
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400">
                                Masukkan data yang sesuai dengan KTP Anda
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-5">
                            {/* NIK field */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    NIK (16 Digit)
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <IdCard className={`w-5 h-5 transition-colors ${focused === 'nik' ? 'text-teal-500' : 'text-slate-400'}`} />
                                    </div>
                                    <input
                                        type="text"
                                        value={data.nik}
                                        required
                                        maxLength="16"
                                        className={`block w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all bg-white dark:bg-slate-800 dark:text-white sm:text-sm ${
                                            errors.nik ? 'border-red-300 ring-4 ring-red-500/10' : focused === 'nik' ? 'border-teal-400 ring-4 ring-teal-500/10' : 'border-slate-200 dark:border-slate-700'
                                        } focus:outline-none`}
                                        placeholder="32xxxxxxxxxxxxxx"
                                        onFocus={() => setFocused('nik')}
                                        onBlur={() => setFocused(null)}
                                        onChange={(e) => setData('nik', e.target.value.replace(/[^0-9]/g, ''))}
                                    />
                                </div>
                                {errors.nik && <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.nik}</p>}
                            </div>

                            {/* Name field */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    Nama Lengkap
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className={`w-5 h-5 transition-colors ${focused === 'nama_lengkap' ? 'text-teal-500' : 'text-slate-400'}`} />
                                    </div>
                                    <input
                                        type="text"
                                        value={data.nama_lengkap}
                                        required
                                        className={`block w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all bg-white dark:bg-slate-800 dark:text-white sm:text-sm ${
                                            errors.nama_lengkap ? 'border-red-300 ring-4 ring-red-500/10' : focused === 'nama_lengkap' ? 'border-teal-400 ring-4 ring-teal-500/10' : 'border-slate-200 dark:border-slate-700'
                                        } focus:outline-none`}
                                        placeholder="Sesuai KTP"
                                        onFocus={() => setFocused('nama_lengkap')}
                                        onBlur={() => setFocused(null)}
                                        onChange={(e) => setData('nama_lengkap', e.target.value)}
                                    />
                                </div>
                                {errors.nama_lengkap && <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.nama_lengkap}</p>}
                            </div>

                            {/* Tanggal Lahir field */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    Tanggal Lahir
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Calendar className={`w-5 h-5 transition-colors ${focused === 'tanggal_lahir' ? 'text-teal-500' : 'text-slate-400'}`} />
                                    </div>
                                    <input
                                        type="date"
                                        value={data.tanggal_lahir}
                                        required
                                        className={`block w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all bg-white dark:bg-slate-800 dark:text-white sm:text-sm ${
                                            errors.tanggal_lahir ? 'border-red-300 ring-4 ring-red-500/10' : focused === 'tanggal_lahir' ? 'border-teal-400 ring-4 ring-teal-500/10' : 'border-slate-200 dark:border-slate-700'
                                        } focus:outline-none`}
                                        onFocus={() => setFocused('tanggal_lahir')}
                                        onBlur={() => setFocused(null)}
                                        onChange={(e) => setData('tanggal_lahir', e.target.value)}
                                    />
                                </div>
                                {errors.tanggal_lahir && <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.tanggal_lahir}</p>}
                            </div>

                            {/* Email field */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    Alamat Email (Untuk Notifikasi)
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className={`w-5 h-5 transition-colors ${focused === 'email' ? 'text-teal-500' : 'text-slate-400'}`} />
                                    </div>
                                    <input
                                        type="email"
                                        value={data.email}
                                        required
                                        className={`block w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all bg-white dark:bg-slate-800 dark:text-white sm:text-sm ${
                                            errors.email ? 'border-red-300 ring-4 ring-red-500/10' : focused === 'email' ? 'border-teal-400 ring-4 ring-teal-500/10' : 'border-slate-200 dark:border-slate-700'
                                        } focus:outline-none`}
                                        placeholder="email@anda.com"
                                        onFocus={() => setFocused('email')}
                                        onBlur={() => setFocused(null)}
                                        onChange={(e) => setData('email', e.target.value)}
                                    />
                                </div>
                                {errors.email && <p className="mt-1.5 text-xs text-red-600 font-medium">{errors.email}</p>}
                            </div>

                            {/* Password fields */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Lock className={`w-5 h-5 transition-colors ${focused === 'password' ? 'text-teal-500' : 'text-slate-400'}`} />
                                        </div>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={data.password}
                                            required
                                            className={`block w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all bg-white dark:bg-slate-800 dark:text-white sm:text-sm ${
                                                errors.password ? 'border-red-300 ring-4 ring-red-500/10' : focused === 'password' ? 'border-teal-400 ring-4 ring-teal-500/10' : 'border-slate-200 dark:border-slate-700'
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
                                            <Lock className={`w-5 h-5 transition-colors ${focused === 'confirm' ? 'text-teal-500' : 'text-slate-400'}`} />
                                        </div>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={data.password_confirmation}
                                            required
                                            className={`block w-full pl-12 pr-4 py-3.5 rounded-xl border-2 transition-all bg-white dark:bg-slate-800 dark:text-white sm:text-sm ${
                                                focused === 'confirm' ? 'border-teal-400 ring-4 ring-teal-500/10' : 'border-slate-200 dark:border-slate-700'
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
                                    className="text-xs font-semibold text-slate-500 hover:text-teal-600 transition-colors flex items-center gap-1.5"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    {showPassword ? 'Sembunyikan' : 'Lihat'} Password
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-4 rounded-xl bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-bold text-sm shadow-lg shadow-teal-500/30 hover:shadow-xl hover:shadow-teal-500/40 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0"
                            >
                                {processing ? 'Mendaftarkan Akun...' : 'Daftar Sekarang'}
                            </button>
                        </form>

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
