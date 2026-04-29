import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true
        }
      }
    },
    plugins: [react()],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return undefined;
            if (id.includes('framer-motion')) return 'motion-vendor';
            if (id.includes('react-dom')) return 'react-dom-vendor';
            if (id.includes('react-router')) return 'router-vendor';
            if (id.includes('react-helmet-async')) return 'helmet-vendor';
            if (id.includes('gsap')) return 'gsap-vendor';
            if (id.includes('lucide-react')) return 'icons-vendor';
            return 'vendor';
          }
        }
      },
      chunkSizeWarningLimit: 500,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
