// =============================================================================
// SIERWE Service Worker
// Strategi Caching:
//   - Cache First: Aset statis (CSS, JS, font, ikon)
//   - Network First: API data & halaman navigasi
//   - Stale While Revalidate: Gambar
// =============================================================================

const CACHE_VERSION = 'sierwe-v1';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;

// Aset yang akan di-precache saat install
const PRECACHE_URLS = [
    '/offline.html',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
];

// ─── INSTALL ────────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
    console.log('[SW] Installing Service Worker...');
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('[SW] Precaching critical assets');
                return cache.addAll(PRECACHE_URLS);
            })
            .then(() => self.skipWaiting()) // Aktivasi segera tanpa menunggu tab ditutup
    );
});

// ─── ACTIVATE ───────────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating Service Worker...');
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((name) => name.startsWith('sierwe-') && name !== STATIC_CACHE && name !== DYNAMIC_CACHE && name !== IMAGE_CACHE)
                        .map((name) => {
                            console.log('[SW] Deleting old cache:', name);
                            return caches.delete(name);
                        })
                );
            })
            .then(() => self.clients.claim()) // Ambil alih semua tab yang terbuka
    );
});

// ─── FETCH ──────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Hanya handle request dari origin yang sama & GET requests
    if (request.method !== 'GET') return;
    if (url.origin !== self.location.origin) return;

    // Tentukan strategi berdasarkan tipe request
    if (isStaticAsset(url)) {
        event.respondWith(cacheFirst(request, STATIC_CACHE));
    } else if (isImage(url)) {
        event.respondWith(staleWhileRevalidate(request, IMAGE_CACHE));
    } else if (isNavigationRequest(request)) {
        event.respondWith(networkFirstWithOfflineFallback(request));
    } else {
        event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    }
});

// ─── HELPER: Identifikasi Tipe Request ──────────────────────────────────────────

function isStaticAsset(url) {
    return /\.(css|js|woff2?|ttf|eot|svg)(\?.*)?$/i.test(url.pathname) ||
           url.pathname.startsWith('/icons/') ||
           url.pathname.startsWith('/build/');
}

function isImage(url) {
    return /\.(png|jpe?g|gif|webp|avif|ico)(\?.*)?$/i.test(url.pathname) &&
           !url.pathname.startsWith('/icons/'); // Ikon sudah di-handle sebagai static
}

function isNavigationRequest(request) {
    return request.mode === 'navigate' ||
           (request.method === 'GET' && request.headers.get('accept')?.includes('text/html'));
}

// ─── STRATEGI: Cache First ──────────────────────────────────────────────────────
// Cek cache dulu, jika tidak ada baru ke network. Cocok untuk aset yang jarang berubah.
async function cacheFirst(request, cacheName) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }

    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.warn('[SW] Cache First - Network failed for:', request.url);
        return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
    }
}

// ─── STRATEGI: Network First ────────────────────────────────────────────────────
// Coba network dulu, jika gagal pakai cache. Cocok untuk data API yang harus fresh.
async function networkFirst(request, cacheName) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(cacheName);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        return new Response(JSON.stringify({ error: 'Anda sedang offline' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}

// ─── STRATEGI: Network First + Offline Fallback ─────────────────────────────────
// Untuk navigasi: coba network, jika gagal tampilkan halaman offline khusus.
async function networkFirstWithOfflineFallback(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        // Fallback ke halaman offline
        return caches.match('/offline.html');
    }
}

// ─── STRATEGI: Stale While Revalidate ───────────────────────────────────────────
// Tampilkan cache segera (cepat), sambil update cache di background. Cocok untuk gambar.
async function staleWhileRevalidate(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);

    const fetchPromise = fetch(request)
        .then((networkResponse) => {
            if (networkResponse.ok) {
                cache.put(request, networkResponse.clone());
            }
            return networkResponse;
        })
        .catch(() => cachedResponse);

    return cachedResponse || fetchPromise;
}

// ─── PUSH NOTIFICATION (Foundation) ─────────────────────────────────────────────
self.addEventListener('push', (event) => {
    let data = { title: 'SIERWE', body: 'Ada pemberitahuan baru dari desa.' };

    if (event.data) {
        try {
            data = event.data.json();
        } catch (e) {
            data.body = event.data.text();
        }
    }

    const options = {
        body: data.body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            url: data.url || '/',
            dateOfArrival: Date.now(),
        },
        actions: data.actions || [
            { action: 'open', title: 'Buka Aplikasi' },
            { action: 'close', title: 'Tutup' },
        ],
        tag: data.tag || 'sierwe-notification',
        renotify: true,
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Handle klik notifikasi
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'close') return;

    const urlToOpen = event.notification.data?.url || '/';

    event.waitUntil(
        self.clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                // Jika sudah ada tab yang terbuka, fokuskan
                for (const client of clientList) {
                    if (client.url.includes(self.location.origin) && 'focus' in client) {
                        client.navigate(urlToOpen);
                        return client.focus();
                    }
                }
                // Jika tidak ada tab terbuka, buka tab baru
                return self.clients.openWindow(urlToOpen);
            })
    );
});
