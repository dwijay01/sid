import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
    Home, 
    Users,
    UserPlus,
    ArrowUpDown,
    Heart,
    FileText,
    LogOut,
    Menu,
    Bell,
    CreditCard,
    Store,
    ClipboardList,
    Printer
} from 'lucide-react';
import Dropdown from '@/Components/Dropdown';
import ThemeToggle from '@/Components/ThemeToggle';

export default function RtLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        { name: 'Dashboard', href: route('rt.dashboard'), icon: Home, current: route().current('rt.dashboard') },
        { name: 'Daftar Warga', href: route('rt.residents'), icon: Users, current: route().current('rt.residents*') },
        { name: 'Kartu Keluarga', href: route('rt.family-cards.index'), icon: CreditCard, current: route().current('rt.family-cards.*') },
        { name: 'Mutasi Penduduk', href: route('rt.mutations.index'), icon: ArrowUpDown, current: route().current('rt.mutations.*') },
        { name: 'Rukun Kematian', href: route('rt.rukem.index'), icon: Heart, current: route().current('rt.rukem.*') },
        { name: 'Pendataan UMKM', href: route('rt.umkm.index'), icon: Store, current: route().current('rt.umkm.*') },
        { name: 'Log Import', href: route('rt.import-logs.index'), icon: ClipboardList, current: route().current('rt.import-logs.*') },
        { name: 'Report & Cetak', href: route('rt.reports'), icon: Printer, current: route().current('rt.reports') },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm lg:hidden transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-blue-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex h-16 shrink-0 items-center px-6 border-b border-blue-800">
                    <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold text-sm">RT</div>
                    <span className="ml-3 text-lg font-bold tracking-tight text-white">Portal Ketua RT</span>
                </div>
                
                <div className="flex flex-col h-[calc(100vh-4rem)]">
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        <div className="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-4 px-2">Menu Layanan RT</div>
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                                    item.current
                                        ? 'bg-blue-800 text-white border border-blue-700 shadow'
                                        : 'text-blue-100 hover:bg-blue-800 hover:text-white'
                                }`}
                            >
                                <item.icon
                                    className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${
                                        item.current ? 'text-blue-300' : 'text-blue-400 group-hover:text-blue-300'
                                    }`}
                                    aria-hidden="true"
                                />
                                {item.name}
                                {item.current && <span className="ml-auto h-2 w-2 rounded-full bg-blue-400 border border-white"></span>}
                            </Link>
                        ))}
                    </nav>
                    
                    <div className="p-4 border-t border-blue-800">
                        <div className="flex items-center px-3 py-3 rounded-lg bg-blue-800/50">
                            <div className="flex-shrink-0 relative">
                                <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-900 font-bold border border-blue-200 shadow-inner">
                                    {user.name.charAt(0)}
                                </div>
                                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-blue-900"></span>
                            </div>
                            <div className="ml-3 flex-1 overflow-hidden">
                                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                                <p className="text-xs text-blue-300 truncate">Ketua RT</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content wrapper */}
            <div className="lg:pl-72 flex flex-col min-h-screen">
                <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
                    <button type="button" className="-m-2.5 p-2.5 text-slate-700 lg:hidden" onClick={() => setSidebarOpen(true)}>
                        <span className="sr-only">Open sidebar</span>
                        <Menu className="h-6 w-6" aria-hidden="true" />
                    </button>

                    <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-between items-center">
                        <h1 className="text-lg font-bold leading-tight text-slate-800 dark:text-white hidden sm:block">{header}</h1>
                        <div className="flex-1 sm:hidden"></div>
                        
                        <div className="flex items-center gap-x-4 lg:gap-x-6">
                            <ThemeToggle />
                            <button type="button" className="-m-2.5 p-2.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors relative">
                                <Bell className="h-6 w-6" aria-hidden="true" />
                            </button>

                            <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-slate-200 dark:lg:bg-slate-800" aria-hidden="true" />

                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="flex items-center gap-x-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 rounded-full pl-2 pr-3 py-1.5 bg-white dark:bg-slate-800 shadow-sm hover:shadow transition-shadow">
                                        <div className="h-7 w-7 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold">
                                            {user.name.charAt(0)}
                                        </div>
                                        <span className="hidden sm:block font-semibold">{user.name}</span>
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content align="right">
                                    <Dropdown.Link href={route('profile.edit')} className="flex items-center gap-2">Profil Akun</Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button" className="flex items-center gap-2 text-red-600">
                                        <LogOut size={16} /> Keluar
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </header>

                <main className="flex-1 bg-slate-50 dark:bg-slate-900">
                    <div className="py-8 px-4 sm:px-6 lg:px-8 animate-fade-in max-w-7xl mx-auto">
                        <div className="sm:hidden mb-6">
                            <h1 className="text-xl font-bold leading-tight text-slate-900 dark:text-white">{header}</h1>
                        </div>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
