import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
    Home, 
    FileText, 
    History,
    UserCircle,
    LogOut,
    Menu,
    Bell
} from 'lucide-react';
import Dropdown from '@/Components/Dropdown';
import ThemeToggle from '@/Components/ThemeToggle';

export default function WargaLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const resident = user?.resident; // diakses dari auth.user.resident sesuai HandleInertiaRequests
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        { name: 'Dashboard Saya', href: route('warga.dashboard'), icon: Home, current: route().current('warga.dashboard') },
        { name: 'Buat Surat Baru', href: route('warga.letters.create'), icon: FileText, current: route().current('warga.letters.create') },
        { name: 'Riwayat Surat', href: route('warga.history'), icon: History, current: route().current('warga.history') },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-emerald-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex h-16 shrink-0 items-center px-6 border-b border-emerald-800">
                    <img className="h-8 w-auto saturate-150 brightness-200" src="https://tailwindui.com/img/logos/mark.svg?color=emerald&shade=500" alt="SID Logo" />
                    <span className="ml-3 text-lg font-bold tracking-tight text-white">Portal Warga SID</span>
                </div>
                
                <div className="flex flex-col h-[calc(100vh-4rem)]">
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        <div className="text-xs font-semibold text-emerald-300 uppercase tracking-wider mb-4 px-2">Menu Layanan</div>
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                                    item.current
                                        ? 'bg-emerald-800 text-white border border-emerald-700'
                                        : 'text-emerald-100 hover:bg-emerald-800 hover:text-white'
                                }`}
                            >
                                <item.icon
                                    className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${
                                        item.current ? 'text-white' : 'text-emerald-400 group-hover:text-white'
                                    }`}
                                    aria-hidden="true"
                                />
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                    
                    <div className="p-4 border-t border-emerald-800">
                        <div className="flex items-center px-3 py-3 rounded-lg bg-emerald-800/50">
                            <div className="flex-shrink-0">
                                <div className="h-9 w-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-900 font-bold border border-emerald-200">
                                    {user.name.charAt(0)}
                                </div>
                            </div>
                            <div className="ml-3 flex-1 overflow-hidden">
                                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                                <p className="text-xs text-emerald-300 truncate">Warga Desa</p>
                            </div>
                            <Link method="post" href={route('logout')} className="p-1.5 text-emerald-400 hover:text-white rounded-md hover:bg-emerald-700 transition-colors" title="Logout">
                                <LogOut className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content wrapper */}
            <div className="lg:pl-72 flex flex-col min-h-screen">
                {/* Top header */}
                <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                    <button
                        type="button"
                        className="-m-2.5 p-2.5 text-slate-700 lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <span className="sr-only">Open sidebar</span>
                        <Menu className="h-6 w-6" aria-hidden="true" />
                    </button>

                    <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-between items-center">
                        <h1 className="text-lg font-bold leading-tight text-slate-800 dark:text-white hidden sm:block">
                            {header}
                        </h1>
                        <div className="flex-1 sm:hidden"></div>
                        
                        <div className="flex items-center gap-x-4 lg:gap-x-6">
                            <ThemeToggle />
                            <button type="button" className="-m-2.5 p-2.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors relative">
                                <span className="sr-only">View notifications</span>
                                <Bell className="h-6 w-6" aria-hidden="true" />
                            </button>

                            <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-slate-200 dark:lg:bg-slate-800" aria-hidden="true" />

                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="flex items-center gap-x-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 rounded-full pl-2 pr-3 py-1 bg-white dark:bg-slate-800 shadow-sm">
                                        <div className="h-7 w-7 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold">
                                            {user.name.charAt(0)}
                                        </div>
                                        <span className="hidden sm:block">{user.name}</span>
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content align="right">
                                    <Dropdown.Link href={route('profile.edit')} className="flex items-center gap-2">
                                        <UserCircle size={16} /> Profil Saya
                                    </Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button" className="flex items-center gap-2 text-red-600">
                                        <LogOut size={16} /> Log Out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </header>

                <main className="flex-1 bg-slate-50 dark:bg-slate-900">
                    <div className="py-8 px-4 sm:px-6 lg:px-8 animate-fade-in max-w-7xl mx-auto">
                        <div className="sm:hidden mb-6">
                            <h1 className="text-xl font-bold leading-tight text-slate-900 dark:text-white">
                                {header}
                            </h1>
                        </div>
                        {/* Jika resident belum tertaut, tampilkan peringatan */}
                        {!resident && (
                            <div className="mb-6 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/20 p-4 shadow-sm text-sm text-amber-800 dark:text-amber-300">
                                Akun Anda belum tertaut dengan data kependudukan NIK. Silakan perbarui profil Anda untuk menggunakan layanan persuratan.
                            </div>
                        )}
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
