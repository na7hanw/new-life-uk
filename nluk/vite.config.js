import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import compression from 'vite-plugin-compression'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
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
            if (id.includes('/lucide-react/')) {
              return 'icons'
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
    environment: 'jsdom',
  },
  plugins: [
    react(),
    // Compress PNG/JPEG/SVG/WebP assets during build to reduce initial load size.
    ViteImageOptimizer({
      png: { quality: 80 },
      jpeg: { quality: 80 },
      svg: { multipass: true },
    }),
    compression({ algorithm: 'brotliCompress', ext: '.br' }),
    compression({ algorithm: 'gzip', ext: '.gz' }),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        // Serve cached index.html for any navigation request so SPA routes
        // (/culture, /saves/apps, etc.) work correctly when offline.
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/api\//],
      },
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

