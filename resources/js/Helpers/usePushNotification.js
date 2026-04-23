import { useState, useEffect, useCallback } from 'react';

/**
 * usePushNotification — Foundation hook untuk Web Push Notifications.
 *
 * Menyediakan interface untuk:
 * - Meminta izin notifikasi
 * - Subscribe ke push service
 * - Mengelola status subscription
 *
 * CATATAN: Hook ini hanya menyiapkan sisi frontend.
 * Backend Laravel perlu endpoint untuk menerima subscription object
 * dan library seperti `laravel-notification-channels/webpush` untuk mengirim push.
 *
 * @example
 * const { isSupported, permission, isSubscribed, subscribe, unsubscribe } = usePushNotification();
 */
export default function usePushNotification() {
    const [isSupported, setIsSupported] = useState(false);
    const [permission, setPermission] = useState('default');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [subscription, setSubscription] = useState(null);
    const [registration, setRegistration] = useState(null);

    useEffect(() => {
        // Cek apakah browser mendukung Push API
        const supported = 'serviceWorker' in navigator &&
                          'PushManager' in window &&
                          'Notification' in window;

        setIsSupported(supported);

        if (!supported) return;

        // Cek permission saat ini
        setPermission(Notification.permission);

        // Cek apakah sudah subscribe
        navigator.serviceWorker.ready.then((reg) => {
            setRegistration(reg);
            return reg.pushManager.getSubscription();
        }).then((sub) => {
            if (sub) {
                setSubscription(sub);
                setIsSubscribed(true);
            }
        }).catch((err) => {
            console.warn('[Push] Error checking subscription:', err);
        });
    }, []);

    /**
     * Minta izin notifikasi dan subscribe ke push service.
     * Returns subscription object yang bisa dikirim ke backend Laravel.
     */
    const subscribe = useCallback(async (vapidPublicKey) => {
        if (!isSupported || !registration) {
            console.warn('[Push] Push notifications not supported');
            return null;
        }

        try {
            // Minta izin
            const perm = await Notification.requestPermission();
            setPermission(perm);

            if (perm !== 'granted') {
                console.log('[Push] Notification permission denied');
                return null;
            }

            // Subscribe dengan VAPID key
            const sub = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
            });

            setSubscription(sub);
            setIsSubscribed(true);

            console.log('[Push] Successfully subscribed:', sub.endpoint);

            // Return subscription sebagai plain object untuk dikirim ke backend
            return {
                endpoint: sub.endpoint,
                keys: {
                    p256dh: arrayBufferToBase64(sub.getKey('p256dh')),
                    auth: arrayBufferToBase64(sub.getKey('auth')),
                },
            };
        } catch (error) {
            console.error('[Push] Subscription failed:', error);
            return null;
        }
    }, [isSupported, registration]);

    /**
     * Unsubscribe dari push notifications.
     */
    const unsubscribe = useCallback(async () => {
        if (!subscription) return false;

        try {
            const success = await subscription.unsubscribe();
            if (success) {
                setSubscription(null);
                setIsSubscribed(false);
                console.log('[Push] Successfully unsubscribed');
            }
            return success;
        } catch (error) {
            console.error('[Push] Unsubscribe failed:', error);
            return false;
        }
    }, [subscription]);

    return {
        isSupported,
        permission,
        isSubscribed,
        subscription,
        subscribe,
        unsubscribe,
    };
}

// ─── Helper Functions ───────────────────────────────────────────────────────────

/**
 * Convert VAPID public key dari Base64 URL string ke Uint8Array.
 * Diperlukan oleh PushManager.subscribe().
 */
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
}

/**
 * Convert ArrayBuffer ke Base64 string.
 * Untuk mengirim subscription keys ke backend.
 */
function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}
