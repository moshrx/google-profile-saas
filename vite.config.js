import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
      open: false,
      gzipSize: true,
      brotliSize: true,
    })
  ],
  build: {
    // Code splitting configuration
    rollupOptions: {
      output: {
        manualChunks(id) {
          // React core vendor chunk
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
          // Utility libraries chunk
          if (id.includes('node_modules/jspdf') || id.includes('node_modules/html2canvas')) {
            return 'utils';
          }
        },
        // Chunk naming strategy
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          // Safety check for asset name
          if (!assetInfo.name) {
            return 'assets/[hash][extname]';
          }
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(assetInfo.name)) {
            return 'assets/images/[name]-[hash][extname]';
          }
          if (/\.css$/.test(assetInfo.name)) {
            return 'assets/css/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
    // Target modern browsers for smaller bundles
    target: 'es2020',
    // CSS optimization
    cssMinify: true,
    // Asset optimization - inline smaller assets
    assetsInlineLimit: 4096,
    // Chunk size warnings
    chunkSizeWarningLimit: 500,
    // Source maps for production (disable for maximum performance)
    sourcemap: false,
  },
  // Optimize dependencies pre-bundling
  optimizeDeps: {
    include: ['react', 'react-dom', 'jspdf', 'html2canvas'],
  },
})
