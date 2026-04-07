import React from 'react';
import { STATUS_LABELS, STATUS_COLORS, RESIDENT_STATUS_COLORS } from '@/Helpers/constants';

export default function StatusBadge({ status, type = 'letter' }) {
    let label = status;
    let colorClass = 'bg-slate-50 text-slate-700 ring-slate-600/20';

    if (type === 'letter') {
        label = STATUS_LABELS[status] || status;
        colorClass = STATUS_COLORS[status] || colorClass;
    } else if (type === 'resident') {
        label = status ? status.charAt(0).toUpperCase() + status.slice(1) : '-';
        colorClass = RESIDENT_STATUS_COLORS[status] || colorClass;
    }

    return (
        <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${colorClass}`}>
            {label}
        </span>
    );
}
