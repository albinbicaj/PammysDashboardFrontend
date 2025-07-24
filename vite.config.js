import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import fs from 'fs';
import path from 'path';

function writeVersionJson() {
  const timestamp = new Date().toISOString();
  const versionData = {
    version: timestamp,
  };
  const versionFilePath = path.resolve(__dirname, 'public/version.json');
  fs.writeFileSync(versionFilePath, JSON.stringify(versionData, null, 2));
  console.log(`📝 version.json generated: ${timestamp}`);
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'version-generator',
      apply: 'build',
      buildStart() {
        writeVersionJson();
      },
    },
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'generateSW',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        navigateFallback: '/index.html',
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
          {
            urlPattern: ({ request }) =>
              request.destination === 'script' ||
              request.destination === 'style' ||
              request.destination === 'worker',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'assets-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
        ],
      },
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'My React Vite App',
        short_name: 'ReactVite',
        description: 'My awesome Vite-powered PWA!',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
          {
            src: '/Pammys_Favicon_2024_96x96.webp',
            sizes: '192x192',
            type: 'image/webp',
          },
          {
            src: '/Pammys_Favicon_2024_256x256.webp',
            sizes: '256x256',
            type: 'image/webp',
          },
          {
            src: '/Pammys_Favicon_2024_96x96.webp',
            sizes: '96x96',
            type: 'image/webp',
          },
          {
            src: '/Pammys_Favicon_2024_96x96.webp',
            sizes: '512x512',
            type: 'image/webp',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
});
