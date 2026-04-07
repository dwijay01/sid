import React, { useState, useRef } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Save,
    Settings as SettingsIcon,
    Upload,
    Image,
    Eye,
    ExternalLink,
    Check,
    AlertCircle,
} from 'lucide-react';

export default function Settings({ settings }) {
    const { flash } = usePage().props;

    const allSettings = [];
    Object.entries(settings).forEach(([group, items]) => {
        items.forEach((item) => {
            allSettings.push({ ...item, group });
        });
    });

    const [form, setForm] = useState(
        allSettings.reduce((acc, s) => ({ ...acc, [s.key]: s.value || '' }), {})
    );
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState({});
    const [activeTab, setActiveTab] = useState('general');
    const [successMsg, setSuccessMsg] = useState(flash?.success || '');

    const handleChange = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSaving(true);

        const settingsArray = allSettings.map((s) => ({
            key: s.key,
            value: form[s.key] || '',
            group: s.group,
        }));

        router.post(route('admin.settings.update'), { settings: settingsArray }, {
            onFinish: () => {
                setSaving(false);
                setSuccessMsg('Pengaturan berhasil disimpan!');
                setTimeout(() => setSuccessMsg(''), 3000);
            },
        });
    };

    const handleFileUpload = (key) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/jpeg,image/png,image/webp';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            setUploading((prev) => ({ ...prev, [key]: true }));

            const formData = new FormData();
            formData.append('file', file);
            formData.append('key', key);

            router.post(route('admin.settings.upload'), formData, {
                forceFormData: true,
                onSuccess: (page) => {
                    // Update form with new URL
                    const landingSettings = page.props?.settings?.landing || [];
                    const updatedItem = landingSettings.find((i) => i.key === key);
                    if (updatedItem) {
                        setForm((prev) => ({ ...prev, [key]: updatedItem.value }));
                    }
                    setSuccessMsg('Foto berhasil diupload!');
                    setTimeout(() => setSuccessMsg(''), 3000);
                },
                onFinish: () => {
                    setUploading((prev) => ({ ...prev, [key]: false }));
                },
            });
        };
        input.click();
    };

    const tabs = [
        { key: 'general', label: 'Informasi Umum', emoji: '🏘️', desc: 'Data umum desa' },
        { key: 'landing', label: 'Landing Page', emoji: '🌐', desc: 'Tampilan halaman depan' },
        { key: 'surat', label: 'Persuratan', emoji: '📄', desc: 'Format dan kop surat' },
        { key: 'display', label: 'Tampilan', emoji: '🎨', desc: 'Pengaturan tampilan' },
    ];

    const keyLabels = {
        nama_desa: 'Nama Desa',
        kecamatan: 'Kecamatan',
        kabupaten: 'Kabupaten',
        provinsi: 'Provinsi',
        kode_pos: 'Kode Pos',
        alamat_kantor: 'Alamat Kantor Desa',
        nama_kades: 'Nama Kepala Desa',
        nip_kades: 'NIP Kepala Desa',
        telepon_desa: 'Telepon Desa',
        format_nomor_surat: 'Format Nomor Surat',
        kop_surat: 'Header/Kop Surat',
        footer_surat: 'Footer Surat',
        app_name: 'Nama Aplikasi',
        app_logo: 'Logo Aplikasi',
        // Landing page
        landing_hero_tagline: 'Tagline Hero (Slogan Utama)',
        sambutan_kades: 'Sambutan Kepala Desa',
        visi: 'Visi Desa',
        misi: 'Misi Desa (pisahkan dengan baris baru)',
        sejarah_desa: 'Sejarah Desa',
        foto_kades: 'Foto Kepala Desa',
        foto_kantor_desa: 'Foto Kantor Desa',
    };

    const keyDescriptions = {
        landing_hero_tagline: 'Teks yang muncul di bawah nama desa pada halaman depan',
        sambutan_kades: 'Sambutan atau pesan dari Kepala Desa yang ditampilkan di halaman depan',
        visi: 'Visi pembangunan desa',
        misi: 'Masukkan setiap poin misi pada baris terpisah',
        sejarah_desa: 'Sejarah singkat tentang desa',
        foto_kades: 'Upload foto Kepala Desa (format: JPG, PNG, WebP, max 2MB)',
        foto_kantor_desa: 'Upload foto Kantor Desa untuk background hero (format: JPG, PNG, WebP, max 2MB)',
    };

    const isTextarea = (key) => {
        return ['alamat_kantor', 'footer_surat', 'kop_surat', 'sambutan_kades', 'visi', 'misi', 'sejarah_desa'].includes(key);
    };

    const isImageUpload = (key) => {
        return ['foto_kades', 'foto_kantor_desa', 'app_logo'].includes(key);
    };

    const currentTabSettings = settings[activeTab] || [];

    return (
        <AdminLayout header="Pengaturan Desa">
            <Head title="Pengaturan" />

            {/* Success message */}
            {successMsg && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 flex items-center gap-3 animate-fade-in">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <p className="text-sm font-medium text-emerald-700">{successMsg}</p>
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar Tabs */}
                <div className="lg:w-64 flex-shrink-0">
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700/60 overflow-hidden sticky top-24">
                        <div className="p-4 border-b border-slate-100 dark:border-slate-700">
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                                <SettingsIcon size={16} className="text-slate-400" />
                                Kategori
                            </h3>
                        </div>
                        <nav className="p-2 space-y-1">
                            {tabs.map((tab) => {
                                const hasSettings = settings[tab.key] && settings[tab.key].length > 0;
                                if (!hasSettings) return null;

                                return (
                                    <button
                                        key={tab.key}
                                        type="button"
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all duration-200 ${
                                            activeTab === tab.key
                                                ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 shadow-sm'
                                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:text-white'
                                        }`}
                                    >
                                        <span className="text-lg">{tab.emoji}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-medium ${activeTab === tab.key ? 'text-emerald-700' : ''}`}>
                                                {tab.label}
                                            </p>
                                            <p className="text-xs text-slate-400 truncate">{tab.desc}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </nav>

                        {/* Preview link */}
                        {activeTab === 'landing' && (
                            <div className="p-3 border-t border-slate-100 dark:border-slate-700">
                                <a
                                    href="/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-emerald-50 dark:bg-emerald-900/30 hover:text-emerald-700 text-sm font-medium transition-colors"
                                >
                                    <Eye size={16} />
                                    Lihat Landing Page
                                    <ExternalLink size={12} className="ml-auto" />
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Settings Form */}
                <div className="flex-1 min-w-0">
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700/60 overflow-hidden">
                            {/* Header */}
                            <div className="p-5 lg:p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">
                                        {tabs.find((t) => t.key === activeTab)?.emoji || '⚙️'}
                                    </span>
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                            {tabs.find((t) => t.key === activeTab)?.label || activeTab}
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            {tabs.find((t) => t.key === activeTab)?.desc}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="hidden sm:inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 transition-colors disabled:opacity-50"
                                >
                                    <Save size={16} />
                                    {saving ? 'Menyimpan...' : 'Simpan'}
                                </button>
                            </div>

                            {/* Fields */}
                            <div className="p-5 lg:p-6 space-y-6">
                                {currentTabSettings.map((item) => (
                                    <div key={item.key} className="group">
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                                            {keyLabels[item.key] ||
                                                item.key
                                                    .replace(/_/g, ' ')
                                                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                                        </label>
                                        {keyDescriptions[item.key] && (
                                            <p className="text-xs text-slate-400 mb-2">
                                                {keyDescriptions[item.key]}
                                            </p>
                                        )}

                                        {isImageUpload(item.key) ? (
                                            <div className="flex flex-col sm:flex-row items-start gap-4">
                                                {/* Preview */}
                                                <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center flex-shrink-0">
                                                    {form[item.key] ? (
                                                        <img
                                                            src={form[item.key]}
                                                            alt={keyLabels[item.key]}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="text-center p-2">
                                                            <Image className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                                                            <p className="text-xs text-slate-400">Belum ada foto</p>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleFileUpload(item.key)}
                                                        disabled={uploading[item.key]}
                                                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-emerald-400 hover:text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:bg-emerald-900/30 text-sm font-medium transition-all disabled:opacity-50"
                                                    >
                                                        <Upload size={16} />
                                                        {uploading[item.key] ? 'Mengupload...' : 'Upload Foto'}
                                                    </button>
                                                    {form[item.key] && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleChange(item.key, '')}
                                                            className="text-xs text-red-500 hover:text-red-600 dark:text-red-400 font-medium"
                                                        >
                                                            Hapus foto
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ) : isTextarea(item.key) ? (
                                            <textarea
                                                value={form[item.key]}
                                                onChange={(e) => handleChange(item.key, e.target.value)}
                                                rows={item.key === 'misi' || item.key === 'sejarah_desa' || item.key === 'sambutan_kades' ? 6 : 3}
                                                className="block w-full rounded-xl border-0 py-3 px-4 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-200 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-500 sm:text-sm bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:bg-slate-800 transition-colors resize-none"
                                                placeholder={`Masukkan ${(keyLabels[item.key] || item.key).toLowerCase()}...`}
                                            />
                                        ) : (
                                            <input
                                                type="text"
                                                value={form[item.key]}
                                                onChange={(e) => handleChange(item.key, e.target.value)}
                                                className="block w-full rounded-xl border-0 py-3 px-4 text-slate-900 dark:text-white ring-1 ring-inset ring-slate-200 dark:ring-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-emerald-500 sm:text-sm bg-slate-50 dark:bg-slate-800/50 hover:bg-white dark:bg-slate-800 transition-colors"
                                                placeholder={`Masukkan ${(keyLabels[item.key] || item.key).toLowerCase()}...`}
                                            />
                                        )}
                                    </div>
                                ))}

                                {currentTabSettings.length === 0 && (
                                    <div className="text-center py-12">
                                        <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                                        <p className="text-slate-500 dark:text-slate-400 font-medium">Belum ada pengaturan di kategori ini</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mobile save button */}
                        <div className="mt-4 sm:hidden">
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 hover:bg-emerald-500 transition-colors disabled:opacity-50"
                            >
                                <Save size={16} />
                                {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
