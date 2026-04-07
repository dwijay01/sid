import React from 'react';

export default function StatCard({ title, value, icon: Icon, color = 'emerald', description, trend, trendUp }) {
    const colorMap = {
        emerald: 'from-emerald-500 to-teal-600',
        blue: 'from-blue-500 to-indigo-600',
        amber: 'from-amber-500 to-orange-600',
        purple: 'from-purple-500 to-violet-600',
        rose: 'from-rose-500 to-pink-600',
        slate: 'from-slate-500 to-slate-700',
    };

    const iconBgMap = {
        emerald: 'bg-emerald-100 text-emerald-600',
        blue: 'bg-blue-100 text-blue-600',
        amber: 'bg-amber-100 text-amber-600',
        purple: 'bg-purple-100 text-purple-600',
        rose: 'bg-rose-100 text-rose-600',
        slate: 'bg-slate-100 text-slate-600',
    };

    return (
        <div className="relative overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-slate-200/60 hover:shadow-md transition-all duration-300 group">
            <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${colorMap[color]}`} />
            
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900 tracking-tight">
                        {typeof value === 'number' ? value.toLocaleString('id-ID') : value}
                    </p>
                    {description && (
                        <p className="mt-1 text-xs text-slate-400">{description}</p>
                    )}
                    {trend !== undefined && (
                        <p className={`mt-1 text-xs font-medium ${trendUp ? 'text-emerald-600' : 'text-red-500'}`}>
                            {trendUp ? '↑' : '↓'} {trend}
                        </p>
                    )}
                </div>
                {Icon && (
                    <div className={`rounded-xl p-3 ${iconBgMap[color]} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="h-6 w-6" />
                    </div>
                )}
            </div>
        </div>
    );
}
