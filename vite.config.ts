import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { DEFAULT_DEV_BACKEND, DEV_BROWSER_ORIGINS, stripLocalOriginForServerProxy, validateDevBackendUrl } from './tools/patch-local-dev-api-proxy.mjs'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // Connect the LAN development UI to the configured live Provider by default.
  // A local BE on :3001 is opt-in using VITE_DEV_BACKEND_URL in .env.local.
  // Netlify uses .env.production and does not use this Vite server proxy.
  const backend = validateDevBackendUrl(env.VITE_DEV_BACKEND_URL || DEFAULT_DEV_BACKEND)
  console.info(`[Game Provider Dev] /api -> ${backend} (VITE_API_BASE_URL must be empty to use proxy)`)
  return {
    plugins: [react()],
    server: {
      port: 5175,
      host: true,
      // Do not make Vite an unrestricted cross-origin relay on the LAN.
      cors: { origin: [...DEV_BROWSER_ORIGINS] },
      proxy: {
        '/api': {
          target: backend,
          changeOrigin: true,
          secure: true,
          configure(proxy) {
            proxy.on('proxyReq', (proxyReq, req) => {
              // The Render service rejects unknown browser Origins. Since the
              // browser is same-origin to Vite, this is a server-to-server hop.
              // Strip ONLY the three explicitly approved development origins;
              // an unknown Origin must still be checked by Render.
              stripLocalOriginForServerProxy(proxyReq, req)
            })
          },
        },
      },
    },
  }
})
