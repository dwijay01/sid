import { Head, Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import {
    Users,
    Home,
    FileText,
    MapPin,
    Phone,
    Mail,
    ChevronDown,
    ArrowRight,
    Shield,
    Clock,
    Award,
    Eye,
    Target,
    BookOpen,
    Building2,
    UserCheck,
    Heart,
    CheckCircle2,
    Menu,
    X,
} from 'lucide-react';

// Animated counter component
function AnimatedCounter({ end, duration = 2000, suffix = '' }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.3 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;
        let start = 0;
        const increment = end / (duration / 16);
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(timer);
            } else {
                setCount(Math.floor(start));
            }
        }, 16);
        return () => clearInterval(timer);
    }, [isVisible, end, duration]);

    return (
        <span ref={ref}>
            {count.toLocaleString('id-ID')}
            {suffix}
        </span>
    );
}

// Scroll animation hook
function useScrollAnimation() {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return [ref, isVisible];
}

export default function Welcome({ auth, desa, landing, statistik }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const namaDesa = desa?.nama_desa || 'Desa Sukamaju';
    const kecamatan = desa?.kecamatan || 'Kecamatan';
    const kabupaten = desa?.kabupaten || 'Kabupaten';
    const provinsi = desa?.provinsi || 'Provinsi';
    const telepon = desa?.telepon_desa || '-';
    const alamat = desa?.alamat_kantor || '-';
    const namaKades = desa?.nama_kades || 'Kepala Desa';

    const heroTagline = landing?.landing_hero_tagline || 'Melayani dengan Sepenuh Hati untuk Kesejahteraan Warga';
    const sambutan = landing?.sambutan_kades || '';
    const visi = landing?.visi || '';
    const misiText = landing?.misi || '';
    const sejarah = landing?.sejarah_desa || '';
    const fotoKades = landing?.foto_kades || '';
    const fotoKantor = landing?.foto_kantor_desa || '';

    const misiList = misiText ? misiText.split('\n').filter(Boolean) : [];

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const [statsRef, statsVisible] = useScrollAnimation();

    return (
        <>
            <Head title={namaDesa} />

            <div className="min-h-screen bg-white dark:bg-slate-800 font-sans antialiased">
                {/* ───── NAVBAR ───── */}
                <nav
                    className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
                            ? 'bg-white dark:bg-slate-800/95 backdrop-blur-lg shadow-lg shadow-emerald-900/5 border-b border-emerald-100'
                            : 'bg-transparent'
                        }`}
                >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16 lg:h-20">
                            {/* Logo */}
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${scrolled
                                            ? 'bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-500/30'
                                            : 'bg-white dark:bg-slate-800/20 backdrop-blur-sm border border-white/30'
                                        }`}
                                >
                                    <Building2
                                        className={`w-5 h-5 ${scrolled ? 'text-white' : 'text-white'}`}
                                    />
                                </div>
                                <div>
                                    <h1
                                        className={`text-lg font-bold tracking-tight transition-colors duration-500 ${scrolled ? 'text-slate-900 dark:text-white' : 'text-white'
                                            }`}
                                    >
                                        SIERWE
                                    </h1>
                                    <p
                                        className={`text-[10px] font-medium -mt-0.5 tracking-wider uppercase transition-colors duration-500 ${scrolled ? 'text-emerald-600 dark:text-emerald-400' : 'text-emerald-300'
                                            }`}
                                    >
                                        {namaDesa}
                                    </p>
                                </div>
                            </div>

                            {/* Desktop nav links */}
                            <div className="hidden lg:flex items-center gap-1">
                                {['Beranda', 'Statistik'].map(
                                    (item) => (
                                        <a
                                            key={item}
                                            href={`#${item.toLowerCase().replace(' ', '-')}`}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${scrolled
                                                    ? 'text-slate-600 dark:text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 dark:bg-emerald-900/30'
                                                    : 'text-white/80 hover:text-white hover:bg-white dark:bg-slate-800/10'
                                                }`}
                                        >
                                            {item}
                                        </a>
                                    )
                                )}
                            </div>

                            {/* Auth buttons */}
                            <div className="hidden lg:flex items-center gap-3">
                                {auth?.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-sm font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all duration-300"
                                    >
                                        Dashboard
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                ) : (
                                    <Link
                                        href={route('login')}
                                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white text-sm font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-0.5 transition-all duration-300"
                                    >
                                        Masuk Sistem
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                )}
                            </div>

                            {/* Mobile menu toggle */}
                            <button
                                className="lg:hidden p-2 rounded-lg"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            >
                                {mobileMenuOpen ? (
                                    <X className={scrolled ? 'text-slate-900 dark:text-white' : 'text-white'} />
                                ) : (
                                    <Menu className={scrolled ? 'text-slate-900 dark:text-white' : 'text-white'} />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile menu */}
                    {mobileMenuOpen && (
                        <div className="lg:hidden bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 shadow-xl">
                            <div className="p-4 space-y-1">
                                {['Beranda', 'Statistik'].map(
                                    (item) => (
                                        <a
                                            key={item}
                                            href={`#${item.toLowerCase().replace(' ', '-')}`}
                                            className="block px-4 py-3 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:bg-emerald-900/30 hover:text-emerald-700 transition-colors"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {item}
                                        </a>
                                    )
                                )}
                                <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-700">
                                    {auth?.user ? (
                                        <Link
                                            href={route('dashboard')}
                                            className="block w-full text-center px-4 py-3 rounded-xl bg-emerald-600 text-white text-sm font-semibold"
                                        >
                                            Dashboard
                                        </Link>
                                    ) : (
                                        <Link
                                            href={route('login')}
                                            className="block w-full text-center px-4 py-3 rounded-xl bg-emerald-600 text-white text-sm font-semibold"
                                        >
                                            Masuk Sistem
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </nav>

                {/* ───── HERO SECTION ───── */}
                <section id="beranda" className="relative min-h-[100vh] flex items-center overflow-hidden">
                    {/* Background */}
                    <div className="absolute inset-0">
                        {fotoKantor ? (
                            <img
                                src={fotoKantor}
                                alt="Kantor Desa"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-600" />
                        )}
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-emerald-900/70 to-slate-900/80" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-slate-900/30" />
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-1/4 -right-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl animate-pulse-slow" />
                        <div className="absolute bottom-1/4 -left-20 w-80 h-80 rounded-full bg-teal-400/10 blur-3xl animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
                    </div>

                    {/* Pattern overlay */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
                        <div className="max-w-3xl">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 backdrop-blur-sm mb-8 animate-fade-in">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-emerald-300 text-xs font-semibold tracking-wider uppercase">
                                    Sistem Informasi RT-RW
                                </span>
                            </div>

                            {/* Heading */}
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-[1.1] tracking-tight animate-slide-up">
                                Selamat Datang di{' '}
                                <span className="relative">
                                    <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-300 bg-clip-text text-transparent">
                                        {namaDesa}
                                    </span>
                                    <span className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full opacity-50" />
                                </span>
                            </h1>

                            {/* Tagline */}
                            <p className="mt-6 text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl animate-slide-up" style={{ animationDelay: '0.2s' }}>
                                {heroTagline}
                            </p>

                            {/* Location */}
                            <div className="mt-6 flex items-center gap-2 text-slate-400 animate-slide-up" style={{ animationDelay: '0.3s' }}>
                                <MapPin className="w-4 h-4 text-emerald-400" />
                                <span className="text-sm">
                                    {kecamatan}, {kabupaten}, {provinsi}
                                </span>
                            </div>

                            {/* CTA buttons */}
                            <div className="mt-10 flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                                {!auth?.user && (
                                    <Link
                                        href={route('login')}
                                        className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-base shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-1 transition-all duration-300 group"
                                    >
                                        Masuk Sistem
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Scroll indicator */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
                        <span className="text-white/40 text-xs tracking-widest uppercase">Scroll</span>
                        <ChevronDown className="w-5 h-5 text-white/40" />
                    </div>
                </section>

                {/* ───── STATISTICS ───── */}
                <section id="statistik" ref={statsRef} className="relative -mt-20 z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div
                            className={`grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 transition-all duration-1000 ${statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                                }`}
                        >
                            {[
                                {
                                    icon: Users,
                                    label: 'Total Penduduk',
                                    value: statistik?.total_penduduk || 0,
                                    color: 'from-emerald-500 to-emerald-600',
                                    shadow: 'shadow-emerald-500/20',
                                    suffix: ' jiwa',
                                },
                                {
                                    icon: UserCheck,
                                    label: 'Laki-laki',
                                    value: statistik?.laki_laki || 0,
                                    color: 'from-blue-500 to-blue-600',
                                    shadow: 'shadow-blue-500/20',
                                    suffix: ' jiwa',
                                },
                                {
                                    icon: Heart,
                                    label: 'Perempuan',
                                    value: statistik?.perempuan || 0,
                                    color: 'from-rose-500 to-rose-600',
                                    shadow: 'shadow-rose-500/20',
                                    suffix: ' jiwa',
                                },
                                {
                                    icon: Home,
                                    label: 'Kartu Keluarga',
                                    value: statistik?.total_kk || 0,
                                    color: 'from-amber-500 to-amber-600',
                                    shadow: 'shadow-amber-500/20',
                                    suffix: ' KK',
                                },
                            ].map((stat, idx) => (
                                <div
                                    key={stat.label}
                                    className={`bg-white dark:bg-slate-800 rounded-2xl p-6 lg:p-8 shadow-xl ${stat.shadow} border border-slate-100 dark:border-slate-700 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500`}
                                    style={{ transitionDelay: `${idx * 100}ms` }}
                                >
                                    <div
                                        className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg mb-4`}
                                    >
                                        <stat.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                        {statsVisible && <AnimatedCounter end={stat.value} />}
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>



                {/* ───── CTA ───── */}
                {!auth?.user && (
                    <section className="py-24 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-700 relative overflow-hidden">
                        <div className="absolute inset-0 opacity-10" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                        }} />
                        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                            <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-6">
                                Siap Menggunakan Layanan Digital RT-RW?
                            </h2>
                            <p className="text-emerald-100 text-lg mb-10 max-w-2xl mx-auto">
                                Login dengan NIK atau email terdaftar untuk mengakses layanan persuratan dan informasi kependudukan.
                            </p>
                            <Link
                                href={route('login')}
                                className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-white dark:bg-slate-800 text-emerald-700 font-bold text-lg shadow-2xl shadow-emerald-900/30 hover:shadow-emerald-900/50 hover:-translate-y-1 transition-all duration-300 group"
                            >
                                Masuk Sekarang
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </section>
                )}

                {/* ───── FOOTER ───── */}
                <footer className="bg-slate-900 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
                            {/* About */}
                            <div className="lg:col-span-2">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                                        <Building2 className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold">SIERWE</h3>
                                        <p className="text-xs text-emerald-400 font-medium">{namaDesa}</p>
                                    </div>
                                </div>
                                <p className="text-slate-400 leading-relaxed max-w-md">
                                    Sistem Informasi RT-RW {namaDesa} untuk pelayanan administrasi
                                    yang lebih cepat, transparan, dan akuntabel bagi seluruh warga.
                                </p>
                            </div>

                            {/* Contact */}
                            <div>
                                <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">Kontak</h4>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                        <span className="text-slate-400 text-sm">{alamat}</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <Phone className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                                        <span className="text-slate-400 text-sm">{telepon}</span>
                                    </li>
                                </ul>
                            </div>

                            {/* Quick Links */}
                            <div>
                                <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">
                                    Tautan Cepat
                                </h4>
                                <ul className="space-y-3">
                                    {['Beranda', 'Statistik'].map(
                                        (item) => (
                                            <li key={item}>
                                                <a
                                                    href={`#${item.toLowerCase().replace(' ', '-')}`}
                                                    className="text-slate-400 hover:text-emerald-400 text-sm transition-colors"
                                                >
                                                    {item}
                                                </a>
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-slate-800 text-center">
                            <p className="text-slate-500 dark:text-slate-400 text-sm">
                                © {new Date().getFullYear()} SIERWE {namaDesa}. Hak Cipta Dilindungi.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
