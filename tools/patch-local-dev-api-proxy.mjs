/** Intentionally restricted localhost browser-to-Backend development proxy. */
export const DEFAULT_DEV_BACKEND = 'http://127.0.0.1:3001';
export const DEV_BROWSER_ORIGINS = Object.freeze([
  'http://localhost:5175', 'http://127.0.0.1:5175',
  'http://localhost:5173', 'http://127.0.0.1:5173',
]);
export function validateDevBackendUrl(input) {
  let u;
  try { u = new URL(input); } catch { throw new Error('Invalid local development backend URL'); }
  const isLocal = ['localhost', '127.0.0.1', '[::1]'].includes(u.hostname);
  if (!(u.protocol === 'https:' || (isLocal && u.protocol === 'http:')) ||
      u.username || u.password || u.search || u.hash || u.pathname !== '/') {
    throw new Error('Dev backend URL must be an HTTPS origin or local HTTP origin');
  }
  return u.origin;
}
export function stripLocalOriginForServerProxy(proxyReq, req) {
  if (DEV_BROWSER_ORIGINS.includes(req.headers.origin)) proxyReq.removeHeader('origin');
}
