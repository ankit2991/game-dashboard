import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // Local development proxy: browser calls /api/v1/*; Vite forwards to Backend.
  // Production calls the absolute VITE_API_BASE_URL and needs BE CORS_ORIGINS.
  const backend = env.VITE_DEV_BACKEND_URL || 'http://127.0.0.1:3001'
  const parsed = new URL(backend)
  if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password ||
      parsed.pathname !== '/' || parsed.search || parsed.hash) {
    throw new Error('VITE_DEV_BACKEND_URL must be a bare HTTP(S) origin')
  }
  return {
    plugins: [react()],
    server: {
      port: 5175,
      host: true,
      proxy: { '/api': { target: parsed.origin, changeOrigin: true } },
    },
  }
})
