import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Zap, WifiOff } from 'lucide-react';

/**
 * InstallPWA — Custom install prompt untuk warga desa.
 * Menampilkan banner ajakan install aplikasi SIERWE ke home screen.
 * - Intercept `beforeinstallprompt` event
 * - Simpan preferensi dismiss di localStorage
 * - Auto-hide setelah app terinstall
 */
export default function InstallPWA() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showBanner, setShowBanner] = useState(false);
    const [isInstalled, setIsInstalled] = useState(false);
    const [installing, setInstalling] = useState(false);

    useEffect(() => {
        // Cek apakah sudah diinstall atau user sudah dismiss sebelumnya
        const isDismissed = localStorage.getItem('sierwe-pwa-dismissed');
        const dismissedAt = isDismissed ? parseInt(isDismissed, 10) : 0;
        const daysSinceDismiss = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24);

        // Cek apakah sudah berjalan di standalone mode (sudah diinstall)
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                             window.navigator.standalone === true;

        if (isStandalone) {
            setIsInstalled(true);
            return;
        }

        const handleBeforeInstall = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);

            // Tampilkan banner jika belum dismiss (atau sudah 7 hari sejak dismiss)
            if (!isDismissed || daysSinceDismiss >= 7) {
                setShowBanner(true);
            }
        };

        const handleAppInstalled = () => {
            setIsInstalled(true);
            setShowBanner(false);
            setDeferredPrompt(null);
            localStorage.removeItem('sierwe-pwa-dismissed');
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstall);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        setInstalling(true);
        deferredPrompt.prompt();

        const { outcome } = await deferredPrompt.userChoice;
        console.log('[PWA] Install outcome:', outcome);

        if (outcome === 'accepted') {
            setShowBanner(false);
        }

        setDeferredPrompt(null);
        setInstalling(false);
    };

    const handleDismiss = () => {
        setShowBanner(false);
        localStorage.setItem('sierwe-pwa-dismissed', Date.now().toString());
    };

    // Jangan render apapun jika sudah install atau tidak ada prompt
    if (isInstalled || !showBanner) return null;

    return (
        <div className="mb-6 animate-slide-up">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 p-[1px] shadow-lg shadow-teal-500/20">
                {/* Dismiss button */}
                <button
                    onClick={handleDismiss}
                    className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
                    aria-label="Tutup"
                >
                    <X className="h-4 w-4" />
                </button>

                <div className="relative rounded-[calc(1rem-1px)] bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 p-5 sm:p-6">
                    {/* Decorative circles */}
                    <div className="absolute -top-6 -right-6 h-32 w-32 rounded-full bg-white/5 blur-xl"></div>
                    <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-white/5 blur-xl"></div>

                    <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        {/* Icon */}
                        <div className="flex-shrink-0 flex items-center justify-center h-14 w-14 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 shadow-inner">
                            <Smartphone className="h-7 w-7 text-white" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <h3 className="text-base sm:text-lg font-bold text-white leading-tight mb-1.5">
                                📲 Install Aplikasi Desa di HP Anda
                            </h3>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-teal-100">
                                <span className="inline-flex items-center gap-1">
                                    <Zap className="h-3 w-3" /> Akses lebih cepat
                                </span>
                                <span className="inline-flex items-center gap-1">
                                    <Download className="h-3 w-3" /> Tanpa download Play Store
                                </span>
                                <span className="inline-flex items-center gap-1">
                                    <WifiOff className="h-3 w-3" /> Bisa offline
                                </span>
                            </div>
                        </div>

                        {/* Install button */}
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <button
                                onClick={handleInstall}
                                disabled={installing}
                                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-teal-700 font-bold text-sm hover:bg-teal-50 active:bg-teal-100 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-wait"
                            >
                                <Download className={`h-4 w-4 ${installing ? 'animate-bounce' : ''}`} />
                                {installing ? 'Menginstall...' : 'Install Sekarang'}
                            </button>
                            <button
                                onClick={handleDismiss}
                                className="sm:hidden flex-shrink-0 px-4 py-2.5 rounded-xl bg-white/10 text-white/80 font-medium text-sm hover:bg-white/20 transition-colors"
                            >
                                Nanti
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
