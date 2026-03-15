import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import compression from 'vite-plugin-compression'

export default defineConfig({
  resolve: {
    dedupe: ['react', 'react-dom', 'react-router-dom'],
  },
  test: {
    environment: 'node',
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          const reactPkgs = ['react', 'react-dom', 'react-router-dom', 'scheduler']
          if (reactPkgs.some(pkg => id.includes(`node_modules/${pkg}`))) return 'vendor-react'
          if (id.includes('node_modules/fuse.js')) return 'vendor-fuse'
          if (id.includes('node_modules/@sentry')) return 'vendor-sentry'
        }
      }
    }
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
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      }
    })
  ]
})
