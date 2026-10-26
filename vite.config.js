import { Buffer } from 'node:buffer'
import process from 'node:process'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import geoAuditHandler from './api/geo-audit.js'
import geoAuditLeadHandler from './api/geo-audit-lead.js'
import generateProfileHandler from './api/generate-profile.js'
import grantChatHandler from './api/grant-chat.js'
import sendEmailHandler from './api/send-email.js'

const apiHandlers = new Map([
  ['/api/geo-audit', geoAuditHandler],
  ['/api/geo-audit-lead', geoAuditLeadHandler],
  ['/api/generate-profile', generateProfileHandler],
  ['/api/grant-chat', grantChatHandler],
  ['/api/send-email', sendEmailHandler],
])

function localApiPlugin() {
  return {
    name: 'local-api-functions',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const pathname = new URL(req.url, 'http://localhost').pathname
        const handler = apiHandlers.get(pathname)
        if (!handler) return next()

        try {
          const chunks = []
          for await (const chunk of req) chunks.push(chunk)
          const body = Buffer.concat(chunks).toString('utf8')
          req.body = body ? JSON.parse(body) : {}
          req.query = Object.fromEntries(new URL(req.url, 'http://localhost').searchParams)

          res.status = (statusCode) => {
            res.statusCode = statusCode
            return res
          }
          res.json = (payload) => {
            if (!res.headersSent) res.setHeader('Content-Type', 'application/json; charset=utf-8')
            res.end(JSON.stringify(payload))
          }

          await handler(req, res)
        } catch (error) {
          console.error('Local API error:', error)
          if (!res.headersSent) {
            res.statusCode = error instanceof SyntaxError ? 400 : 500
            res.setHeader('Content-Type', 'application/json; charset=utf-8')
          }
          if (!res.writableEnded) res.end(JSON.stringify({ error: 'The local API request failed.' }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const serverEnv = loadEnv(mode, process.cwd(), '')
  for (const [key, value] of Object.entries(serverEnv)) {
    if (process.env[key] === undefined) process.env[key] = value
  }

  return {
  plugins: [
    react(),
    localApiPlugin(),
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
  }
})
