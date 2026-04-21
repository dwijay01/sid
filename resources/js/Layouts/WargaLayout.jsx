import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
    Home, 
    FileText, 
    History,
    UserCircle,
    LogOut,
    Menu,
    Bell,
    Users,
    MessageSquareWarning,
    Sun,
    Cloud,
    CloudRain
} from 'lucide-react';
import Dropdown from '@/Components/Dropdown';
import ThemeToggle from '@/Components/ThemeToggle';

export default function WargaLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const resident = user?.resident; 
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    // Simple mock time/weather 
    const [greeting, setGreeting] = useState('');
    const [weatherIcon, setWeatherIcon] = useState(<Sun className="h-4 w-4 text-amber-500" />);

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 11) setGreeting('Selamat Pagi');
        else if (hour < 15) setGreeting('Selamat Siang');
        else if (hour < 18) setGreeting('Selamat Sore');
        else setGreeting('Selamat Malam');

        // Randomize mock weather 
        const weathers = [
            <Sun className="h-5 w-5 text-amber-500" />,
            <Cloud className="h-5 w-5 text-slate-400" />,
            <CloudRain className="h-5 w-5 text-blue-400" />
        ];
        setWeatherIcon(weathers[Math.floor(Math.random() * weathers.length)]);
    }, []);

    const navigation = [
        { name: 'Beranda', href: route('warga.dashboard'), icon: Home, current: route().current('warga.dashboard') },
        { name: 'Layanan Surat', href: route('warga.letters.create'), icon: FileText, current: route().current('warga.letters.create') || route().current('warga.history') },
        { name: 'Keluarga', href: route('warga.keluarga'), icon: Users, current: route().current('warga.keluarga') },
        { name: 'Pengaduan', href: route('warga.complaints.index'), icon: MessageSquareWarning, current: route().current('warga.complaints.*') },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200 pb-16 lg:pb-0">
            {/* Mobile Bottom Navigation Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-safe">
                <nav className="flex justify-around items-center h-16">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                                item.current 
                                    ? 'text-teal-600 dark:text-teal-400' 
                                    : 'text-slate-500 hover:text-teal-500 dark:text-slate-400 dark:hover:text-teal-300'
                            }`}
                        >
                            <item.icon className="h-5 w-5" strokeWidth={item.current ? 2.5 : 2} />
                            <span className="text-[10px] font-medium">{item.name}</span>
                        </Link>
                    ))}
                    <Link
                        href={route('profile.edit')}
                        className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                            route().current('profile.edit')
                                ? 'text-teal-600 dark:text-teal-400' 
                                : 'text-slate-500 hover:text-teal-500 dark:text-slate-400 dark:hover:text-teal-300'
                        }`}
                    >
                        <UserCircle className="h-5 w-5" strokeWidth={route().current('profile.edit') ? 2.5 : 2} />
                        <span className="text-[10px] font-medium">Profil</span>
                    </Link>
                </nav>
            </div>

            {/* Desktop Sidebar (hidden on mobile) */}
            <div className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 lg:z-50 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
                <div className="flex h-16 shrink-0 items-center px-6 border-b border-slate-200 dark:border-slate-800">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-sm">
                        <Home className="h-5 w-5 text-white" />
                    </div>
                    <span className="ml-3 text-lg font-bold tracking-tight text-slate-900 dark:text-white">Portal Warga</span>
                </div>
                
                <div className="flex flex-col flex-1 overflow-y-auto">
                    <nav className="flex-1 px-4 py-8 space-y-2">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                                    item.current
                                        ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                                }`}
                            >
                                <item.icon
                                    className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${
                                        item.current ? 'text-teal-600 dark:text-teal-400' : 'text-slate-400 group-hover:text-slate-500 dark:group-hover:text-slate-300'
                                    }`}
                                    aria-hidden="true"
                                />
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                    
                    <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                        <div className="flex items-center px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                            <div className="flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center text-teal-700 dark:text-teal-300 font-bold border border-teal-200 dark:border-teal-800 shadow-sm group-hover:scale-105 transition-transform">
                                    {user.name.charAt(0)}
                                </div>
                            </div>
                            <div className="ml-3 flex-1 overflow-hidden">
                                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">Warga Desa</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content wrapper */}
            <div className="lg:pl-72 flex flex-col min-h-screen">
                {/* Top header */}
                <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                    
                    <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-between items-center">
                        {/* Header Personal + Weather */}
                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex items-center justify-center h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800">
                                {weatherIcon}
                            </div>
                            <div>
                                <h1 className="text-sm sm:text-base font-bold leading-tight text-slate-800 dark:text-white">
                                    {greeting}, {user.name.split(' ')[0]}! 👋
                                </h1>
                                <div className="flex items-center mt-0.5">
                                    {resident ? (
                                        <span className="inline-flex items-center text-[10px] sm:text-xs font-medium text-emerald-600 dark:text-emerald-400">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
                                            Akun Terverifikasi
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center text-[10px] sm:text-xs font-medium text-amber-600 dark:text-amber-400">
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 animate-pulse"></span>
                                            Belum Terverifikasi
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-x-3 lg:gap-x-6">
                            <ThemeToggle />
                            <button type="button" className="p-2 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 rounded-full hover:bg-teal-50 dark:hover:bg-teal-900/30 transition-colors relative">
                                <span className="sr-only">View notifications</span>
                                <Bell className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
                                <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white dark:border-slate-900"></span>
                            </button>

                            <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-slate-200 dark:lg:bg-slate-800" aria-hidden="true" />

                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="flex items-center focus:outline-none">
                                        <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center text-teal-700 dark:text-teal-400 font-bold border border-teal-200 dark:border-teal-800 shadow-sm">
                                            {user.name.charAt(0)}
                                        </div>
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content align="right">
                                    <Dropdown.Link href={route('profile.edit')} className="flex items-center gap-2 py-2.5">
                                        <UserCircle size={16} /> Profil Saya
                                    </Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button" className="flex items-center gap-2 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20">
                                        <LogOut size={16} /> Log Out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </header>

                <main className="flex-1">
                    <div className="py-6 px-4 sm:px-6 lg:px-8 animate-fade-in max-w-7xl mx-auto">
                        {/* Peringatan jika belum verified */}
                        {!resident && (
                            <div className="mb-6 rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/20 p-4 shadow-sm flex items-start gap-3">
                                <div className="mt-0.5 flex-shrink-0">
                                    <MessageSquareWarning className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-amber-800 dark:text-amber-300">Aksi Diperlukan</h3>
                                    <p className="mt-1 text-sm text-amber-700 dark:text-amber-400/80 leading-relaxed">
                                        Akun Anda belum ditautkan dengan data kependudukan. Silakan lengkapi NIK Anda di halaman Profil untuk mengakses Layanan E-Surat.
                                    </p>
                                    <div className="mt-3">
                                        <Link href={route('profile.edit')} className="text-xs font-bold text-amber-800 dark:text-amber-300 hover:underline">
                                            Lengkapi Profil Sekarang &rarr;
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
