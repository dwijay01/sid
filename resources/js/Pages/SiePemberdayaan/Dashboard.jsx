import React from 'react';
import SiePemberdayaanLayout from '@/Layouts/SiePemberdayaanLayout';
import { Head, Link } from '@inertiajs/react';
import { 
    Users, 
    Wifi, 
    Briefcase, 
    Recycle,
    ArrowUpRight,
    CreditCard
} from 'lucide-react';

export default function Dashboard({ stats, recentPayments }) {
    const statCards = [
        { 
            name: 'Total Keluarga (KK)', 
            value: stats.total_families, 
            icon: CreditCard, 
            description: 'Dalam lingkup RW',
            color: 'bg-blue-500'
        },
        { 
            name: 'Subscribed Internet', 
            value: stats.internet_active, 
            icon: Wifi, 
            description: 'Pelanggan aktif',
            color: 'bg-teal-500'
        },
        { 
            name: 'Database Keahlian', 
            value: stats.total_skills, 
            icon: Briefcase, 
            description: 'Potensi SDM warga',
            color: 'bg-indigo-500'
        },
        { 
            name: 'Partisipasi Sampah', 
            value: stats.waste_active, 
            icon: Recycle, 
            description: 'Warga aktif',
            color: 'bg-emerald-500'
        },
    ];

    return (
        <SiePemberdayaanLayout header="Dashboard Pemberdayaan">
            <Head title="Dashboard" />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statCards.map((stat) => (
                    <div key={stat.name} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow duration-300 relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 w-24 h-24 ${stat.color} opacity-5 -mr-8 -mt-8 rounded-full group-hover:scale-110 transition-transform`}></div>
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10 text-white`}>
                                <stat.icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.name}</p>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-0.5">{stat.value}</h3>
                            </div>
                        </div>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">{stat.description}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Internet Payments */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Pembayaran Internet Terbaru</h3>
                        <Link href={route('sie-pemberdayaan.internet.index')} className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1">
                            Semua Data <ArrowUpRight size={14} />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-bold tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">No. KK / Alamat</th>
                                    <th className="px-6 py-4">Periode</th>
                                    <th className="px-6 py-4">Jumlah</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                {recentPayments.length > 0 ? recentPayments.map((payment) => (
                                    <tr key={payment.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-slate-800 dark:text-white">{payment.subscription.family_card.no_kk}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">{payment.subscription.family_card.alamat}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">
                                            {new Date(0, payment.month - 1).toLocaleString('id-ID', { month: 'long' })} {payment.year}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-900 dark:text-white">
                                            Rp {parseFloat(payment.amount).toLocaleString('id-ID')}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                Lunas
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-slate-500 dark:text-slate-400 italic">
                                            Belum ada data pembayaran terbaru.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions / Info */}
                <div className="space-y-6">
                    <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200 dark:shadow-none">
                        <h4 className="text-lg font-bold mb-2">Tugas Sie Pemberdayaan</h4>
                        <p className="text-indigo-100 text-sm mb-4">Pastikan data masyarakat RW tetap terupdate untuk mempercepat proses bantuan dan layanan komunitas.</p>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-sm">
                                <div className="p-1 bg-white/20 rounded-md mt-0.5"><Wifi size={14} /></div>
                                <span>Monitor iuran internet warga untuk operasional berkelanjutan.</span>
                            </li>
                            <li className="flex items-start gap-3 text-sm">
                                <div className="p-1 bg-white/20 rounded-md mt-0.5"><Briefcase size={14} /></div>
                                <span>Daftarkan keahlian warga untuk memberdayakan ekonomi lokal.</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                        <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Status Layanan</h4>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-xl">
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                                    <span className="text-sm font-medium dark:text-slate-200">Internet RW</span>
                                </div>
                                <span className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider">Online</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900 rounded-xl opacity-60">
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 rounded-full bg-slate-400"></div>
                                    <span className="text-sm font-medium dark:text-slate-200">Bank Sampah</span>
                                </div>
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Coming Soon</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SiePemberdayaanLayout>
    );
}
