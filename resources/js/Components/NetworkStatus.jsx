import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

/**
 * NetworkStatus — Komponen indikator koneksi internet.
 * Menampilkan banner notifikasi saat warga kehilangan koneksi.
 * Auto-hide saat koneksi kembali online.
 */
export default function NetworkStatus() {
    const [isOnline, setIsOnline] = useState(
        typeof navigator !== 'undefined' ? navigator.onLine : true
    );
    const [showBanner, setShowBanner] = useState(false);
    const [wasOffline, setWasOffline] = useState(false);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            if (wasOffline) {
                // Tampilkan sebentar banner "kembali online" lalu hide
                setShowBanner(true);
                setTimeout(() => {
                    setShowBanner(false);
                    setWasOffline(false);
                }, 3000);
            }
        };

        const handleOffline = () => {
            setIsOnline(false);
            setWasOffline(true);
            setShowBanner(true);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [wasOffline]);

    if (!showBanner) return null;

    return (
        <div
            className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-out ${
                showBanner ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
            }`}
        >
            <div
                className={`flex items-center justify-center gap-2.5 px-4 py-3 text-sm font-medium shadow-lg ${
                    isOnline
                        ? 'bg-emerald-500 text-white'
                        : 'bg-amber-500 text-white'
                }`}
            >
                {isOnline ? (
                    <>
                        <Wifi className="h-4 w-4 flex-shrink-0" />
                        <span>Koneksi kembali! 🎉</span>
                    </>
                ) : (
                    <>
                        <WifiOff className="h-4 w-4 flex-shrink-0 animate-pulse" />
                        <span>Anda sedang offline. Menampilkan data terakhir yang disimpan.</span>
                        <button
                            onClick={() => setShowBanner(false)}
                            className="ml-2 flex-shrink-0 rounded-full bg-white/20 hover:bg-white/30 p-1 transition-colors"
                            aria-label="Tutup"
                        >
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
