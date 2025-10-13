import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Production optimizations
  build: {
    // Enable minification
    minify: 'terser',
    // Generate source maps for debugging (disable in production if not needed)
    sourcemap: false,
    // Chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Copy public assets including favicons
    copyPublicDir: true,
    // Rollup options for better tree shaking
    rollupOptions: {
      output: {
        // Manual chunks for better caching
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@mui/material', '@emotion/react', '@emotion/styled'],
          animations: ['framer-motion'],
          maps: ['leaflet', 'react-leaflet'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
        },
      },
    },
    // Target modern browsers for better optimization
    target: 'esnext',
  },
  
  // Performance optimizations
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@features': path.resolve(__dirname, './src/features'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@store': path.resolve(__dirname, './src/store'),
      '@types': path.resolve(__dirname, './src/types'),
      '@api': path.resolve(__dirname, './src/api'),
      '@theme': path.resolve(__dirname, './src/theme'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL || 'http://localhost:8080',
        changeOrigin: true,
        secure: true,
        // Add security headers
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // Add security headers
            proxyReq.setHeader('X-Forwarded-Proto', 'https');
          });
        },
      },
    },
  },
  
  // Preview server configuration
  preview: {
    port: 4173,
    host: true,
  },
})