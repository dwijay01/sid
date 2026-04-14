import React from 'react';
import SiePemberdayaanLayout from '@/Layouts/SiePemberdayaanLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { 
    ChevronLeft, 
    Calendar, 
    CheckCircle2, 
    Clock, 
    CreditCard,
    ArrowRightLeft
} from 'lucide-react';

export default function Payments({ subscription, year, months }) {
    const { post, processing } = useForm({
        month: null,
        year: year,
        amount: 50000, // Default amount, could be dynamic based on package
    });

    const togglePayment = (month) => {
        if (processing) return;

        post(route('sie-pemberdayaan.internet.toggle-payment', { 
            internetSubscription: subscription.id,
            month: month,
            year: year,
            amount: 50000 // In a real app, this would be from the package
        }), {
            preserveScroll: true
        });
    };

    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 2; i <= currentYear + 1; i++) {
        years.push(i);
    }

    return (
        <SiePemberdayaanLayout header="Riwayat Pembayaran">
            <Head title={`Pembayaran - ${subscription.family_card.no_kk}`} />

            <div className="mb-8 flex items-center gap-4">
                <Link 
                    href={route('sie-pemberdayaan.internet.index')}
                    className="p-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                    <ChevronLeft size={20} />
                </Link>
                <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Monitoring Iuran Bulanan</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">No. KK: {subscription.family_card.no_kk} - {subscription.package_name}</p>
                </div>
            </div>

            {/* Year Selector */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-700 mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Calendar className="text-indigo-500" size={20} />
                    <span className="font-bold text-slate-800 dark:text-white text-lg">Tahun {year}</span>
                </div>
                <div className="flex gap-2">
                    {years.map((y) => (
                        <Link
                            key={y}
                            href={route('sie-pemberdayaan.internet.payments', subscription.id)}
                            data={{ year: y }}
                            className={`px-4 py-2 text-sm font-bold rounded-xl transition-all ${year == y ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100'}`}
                        >
                            {y}
                        </Link>
                    ))}
                </div>
            </div>

            {/* Months Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Object.entries(months).map(([m, data]) => (
                    <div 
                        key={m} 
                        className={`bg-white dark:bg-slate-800 rounded-2xl border ${data.payment ? 'border-green-100 dark:border-green-900/30 ring-1 ring-green-100 dark:ring-green-900/10' : 'border-slate-100 dark:border-slate-700'} p-6 shadow-sm relative group`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h4 className="font-bold text-slate-900 dark:text-white text-lg">{data.name}</h4>
                                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">{year}</p>
                            </div>
                            {data.payment ? (
                                <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl">
                                    <CheckCircle2 size={24} />
                                </div>
                            ) : (
                                <div className="p-2 bg-slate-100 dark:bg-slate-900 text-slate-400 rounded-xl">
                                    <Clock size={24} />
                                </div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Status</span>
                                <span className={`text-sm font-bold ${data.payment ? 'text-green-600 dark:text-green-400' : 'text-slate-400'}`}>
                                    {data.payment ? 'Lunas' : 'Belum Bayar'}
                                </span>
                            </div>
                            
                            {data.payment && (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Nominal</span>
                                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                                        Rp {parseFloat(data.payment.amount).toLocaleString('id-ID')}
                                    </span>
                                </div>
                            )}

                            <button
                                onClick={() => togglePayment(m)}
                                disabled={processing}
                                className={`w-full mt-2 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${data.payment 
                                    ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400' 
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-100 dark:shadow-none'}`}
                            >
                                {data.payment ? (
                                    <>Batalkan Lunas</>
                                ) : (
                                    <><CreditCard size={18} /> Tandai Lunas</>
                                )}
                            </button>
                        </div>

                        {data.payment && (
                            <div className="mt-4 pt-4 border-t border-green-50 dark:border-green-900/20">
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider">Tgl Pembayaran</p>
                                <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                                    {new Date(data.payment.payment_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </SiePemberdayaanLayout>
    );
}
