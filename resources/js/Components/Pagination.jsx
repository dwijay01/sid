import React from 'react';
import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
    if (!links || links.length <= 3) return null;

    return (
        <div className="flex flex-wrap justify-center gap-1">
            {links.map((link, key) => (
                <Link
                    key={key}
                    href={link.url || '#'}
                    className={`inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
                        link.active
                            ? 'z-10 bg-indigo-600 text-white border-indigo-600 shadow-md'
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    } ${!link.url ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </div>
    );
}
