import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import compression from 'vite-plugin-compression'
import { readFileSync } from 'fs'

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'))

export default defineConfig({
  resolve: {
    dedupe: ['react', 'react-dom', 'react-router-dom'],
  },
  define: {
    // Expose package version as an env var so MorePage can display it without
    // bundling the entire package.json.
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(pkg.version),
  },
  build: {
    rollupOptions: {
      output: {
        // Split large vendor libraries into a separate chunk so they can be
        // cached independently of application code, improving repeat-visit load time.
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (['react', 'react-dom', 'react-router-dom'].some(pkg => id.includes(`/${pkg}/`))) {
              return 'vendor'
            }
            if (id.includes('/fuse.js/') || id.includes('/fuse.js?')) {
              return 'search'
            }
          }
        },
      },
    },
  },
  test: {
    environment: 'node',
  },
  plugins: [
    react(),
    compression({ algorithm: 'brotliCompress', ext: '.br' }),
    compression({ algorithm: 'gzip', ext: '.gz' }),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: { globPatterns: ['**/*.{js,css,html,svg,png,woff2}'] },
      manifest: {
        name: 'New Life UK — Free Guide',
        short_name: 'New Life UK',
        description: 'Free multilingual guide for new arrivals in the UK',
        theme_color: '#059669',
        background_color: '#FAFAF9',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      }
    })
  ]
})

