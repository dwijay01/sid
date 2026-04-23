<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <!-- PWA Meta Tags -->
        <meta name="theme-color" content="#059669">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-status-bar-style" content="default">
        <meta name="apple-mobile-web-app-title" content="SIRAWE">
        <meta name="description" content="Sistem Informasi RT-RW — Layanan administrasi desa digital">
        <meta name="mobile-web-app-capable" content="yes">
        <link rel="manifest" href="/manifest.json">
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        <!-- Scripts -->
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx'])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia

        <!-- Service Worker Registration -->
        <script>
            if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                    navigator.serviceWorker.register('/sw.js')
                        .then(reg => {
                            console.log('[SIRAWE] Service Worker registered:', reg.scope);
                            // Check for updates periodically
                            setInterval(() => reg.update(), 60 * 60 * 1000); // every hour
                        })
                        .catch(err => console.error('[SIRAWE] SW registration failed:', err));
                });
            }
        </script>
    </body>
</html>
