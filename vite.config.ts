import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(), 
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        strategies: 'injectManifest',
        srcDir: 'src',
        filename: 'sw.ts',
        injectManifest: {
          // Workaround for Windows paths containing `'` (e.g. "Nichole's Project"):
          // bundling to IIFE avoids emitting ESM imports with absolute file paths.
          rollupFormat: 'iife',
          // Match previous Workbox config: allow large bundles to be precached.
          maximumFileSizeToCacheInBytes: 25 * 1024 * 1024,
          globPatterns: ['**/*.{js,css,html,ico,png,webp,svg,json,wasm}'],
        },
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg', 'app-icon.png', 'app-icon-192.png', 'app-icon-512.png', 'images/WildMaps! Logo no fog (trimmed).png'],
        manifest: {
          name: 'WildMaps',
          short_name: 'WildMaps',
          description: 'Explore the campus and find landmarks!',
          theme_color: '#800000',
          background_color: '#eef4ff',
          display: 'standalone',
          icons: [
            {
              src: 'images/WildMaps! Logo no fog (trimmed).png',
              sizes: 'any',
              type: 'image/png'
            },
            {
              src: 'images/WildMaps! Logo no fog (trimmed).png',
              sizes: 'any',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ]
        },
      })
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
