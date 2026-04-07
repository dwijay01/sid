import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    PieChart, 
    FileSignature,
    FileText,
    History,
    LogOut,
    Menu,
    Bell
} from 'lucide-react';
import Dropdown from '@/Components/Dropdown';
import ThemeToggle from '@/Components/ThemeToggle';

export default function KadesLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        { name: 'Dashboard & TTE', href: route('kades.dashboard'), icon: FileSignature, current: route().current('kades.dashboard') || route().current('kades.letters.*') },
        { name: 'Laporan Penduduk', href: route('kades.reports.demography'), icon: PieChart, current: route().current('kades.reports.demography') },
        { name: 'Laporan Surat', href: route('kades.reports.letters'), icon: FileText, current: route().current('kades.reports.letters') },
        { name: 'Audit Trail', href: route('kades.reports.audit'), icon: History, current: route().current('kades.reports.audit') },
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
            <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex h-16 shrink-0 items-center px-6 border-b border-slate-800">
                    <img className="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=emerald&shade=500" alt="SID Logo" />
                    <span className="ml-3 text-lg font-bold tracking-tight text-white">Portal Kades SID</span>
                </div>
                
                <div className="flex flex-col h-[calc(100vh-4rem)]">
                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">Menu Utama</div>
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                                    item.current
                                        ? 'bg-emerald-600 text-white'
                                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                }`}
                            >
                                <item.icon
                                    className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${
                                        item.current ? 'text-white' : 'text-slate-400 group-hover:text-white'
                                    }`}
                                    aria-hidden="true"
                                />
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                    
                    <div className="p-4 border-t border-slate-800">
                        <div className="flex items-center px-3 py-3 rounded-lg bg-slate-800">
                            <div className="flex-shrink-0">
                                <div className="h-9 w-9 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold border border-emerald-400">
                                    {user.name.charAt(0)}
                                </div>
                            </div>
                            <div className="ml-3 flex-1 overflow-hidden">
                                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                                <p className="text-xs text-slate-400 truncate">Kepala Desa</p>
                            </div>
                            <Link method="post" href={route('logout')} className="p-1.5 text-slate-400 hover:text-red-400 rounded-md hover:bg-slate-700 transition-colors" title="Logout">
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
                        <h1 className="text-xl font-bold leading-tight text-slate-800 dark:text-white hidden sm:block">
                            {header}
                        </h1>
                        <div className="flex-1 sm:hidden"></div>
                        
                        <div className="flex items-center gap-x-4 lg:gap-x-6">
                            <ThemeToggle />
                            <button type="button" className="-m-2.5 p-2.5 text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-full hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors relative">
                                <span className="sr-only">View notifications</span>
                                <Bell className="h-6 w-6" aria-hidden="true" />
                                <span className="absolute top-2 right-2.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900"></span>
                            </button>

                            <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-slate-200 dark:lg:bg-slate-800" aria-hidden="true" />

                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="flex items-center gap-x-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
                                        <span className="hidden sm:block">{user.name}</span>
                                        <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold sm:hidden">
                                            {user.name.charAt(0)}
                                        </div>
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content align="right">
                                    <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button">
                                        Log Out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </header>

                <main className="flex-1 bg-slate-50 dark:bg-slate-900">
                    <div className="py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
                        <div className="sm:hidden mb-6">
                            <h1 className="text-2xl font-bold leading-tight text-slate-900 dark:text-white">
                                {header}
                            </h1>
                        </div>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
