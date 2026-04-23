import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/js/app.jsx',
            refresh: true,
        }),
        react(),
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    // Gabungkan semua icon lucide menjadi satu file
                    if (id.includes('node_modules/lucide-react')) {
                        return 'lucide-icons';
                    }
                    // Gabungkan library pihak ketiga lainnya (React, dll) ke file vendor
                    if (id.includes('node_modules')) {
                        return 'vendor';
                    }
                }
            }
        }
    }
});
