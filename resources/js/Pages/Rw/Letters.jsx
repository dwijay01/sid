import { Head, Link } from '@inertiajs/react';
import RwLayout from '@/Layouts/RwLayout';
import { FileText, Search } from 'lucide-react';
import { STATUS_LABELS, STATUS_COLORS } from '@/Helpers/constants';

export default function Letters({ letters, filters = {} }) {
    return (
        <RwLayout header="Surat Masuk">
            <Head title="Surat Masuk - RW" />

            <div className="mb-6">
                <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="bg-indigo-100 dark:bg-indigo-900/40 p-3 rounded-xl text-indigo-600 dark:text-indigo-400">
                            <FileText size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">Surat Masuk Wilayah RW</h2>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Daftar semua surat yang diajukan warga di wilayah RW Anda.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th className="py-3.5 pl-6 pr-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Pemohon</th>
                                <th className="px-3 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Jenis Surat</th>
                                <th className="px-3 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Keperluan</th>
                                <th className="px-3 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal</th>
                                <th className="px-3 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {letters.data.length > 0 ? letters.data.map((l) => (
                                <tr key={l.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="whitespace-nowrap py-4 pl-6 pr-3">
                                        <div className="font-bold text-slate-900 dark:text-white text-sm">{l.resident?.nama_lengkap}</div>
                                        <div className="text-xs text-slate-500 font-mono">{l.resident?.nik}</div>
                                        {l.resident?.family_card?.kategori_aktif === 'tidak_aktif' && (
                                            <div className="mt-1 inline-flex items-center rounded-md bg-red-50 dark:bg-red-900/20 px-2 py-1 text-xs font-bold text-red-700 dark:text-red-400 ring-1 ring-inset ring-red-600/20">
                                                ⚠️ Warga Tidak Aktif
                                            </div>
                                        )}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm font-semibold text-slate-800 dark:text-slate-200">{l.letter_type?.nama_surat || l.letter_type?.name}</td>
                                    <td className="px-3 py-4 text-sm text-slate-600 dark:text-slate-400 max-w-xs truncate">{l.keperluan}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">{new Date(l.created_at).toLocaleDateString('id-ID')}</td>
                                    <td className="whitespace-nowrap px-3 py-4">
                                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ring-1 ring-inset ${STATUS_COLORS[l.status] || ''}`}>
                                            {STATUS_LABELS[l.status] || l.status}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="5" className="px-6 py-12 text-center text-sm text-slate-500">Tidak ada surat.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {letters.links && letters.links.length > 3 && (
                    <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 px-6 py-4 flex items-center justify-center">
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">
                            {letters.links.map((link, i) => (
                                <Link 
                                    key={i} 
                                    href={link.url || '#'} 
                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${link.active ? 'z-10 bg-teal-600 text-white' : 'text-slate-900 dark:text-white ring-1 ring-inset ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'} ${i === 0 ? 'rounded-l-md' : ''} ${i === letters.links.length - 1 ? 'rounded-r-md' : ''}`} 
                                    dangerouslySetInnerHTML={{ __html: link.label }} 
                                />
                            ))}
                        </nav>
                    </div>
                )}
            </div>
        </RwLayout>
    );
}
