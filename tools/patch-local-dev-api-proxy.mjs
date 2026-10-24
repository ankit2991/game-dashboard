/**
 * Patch local-dev API bridge. The browser always contacts its own Vite origin.
 * Vite relays requests to the real Render backend without embedding secrets.
 *
 * Only strip the Origin header from SAME-ORIGIN browser requests originating
 * from these exact development hosts. Non-allowlisted origins are left intact
 * and must not be silently upgraded into trusted server-side requests.
 */
export const DEV_BROWSER_ORIGINS = Object.freeze([
  'http://localhost:5175',
  'http://127.0.0.1:5175',
  'http://192.168.1.101:5175',
]);

export const DEFAULT_DEV_BACKEND = 'https://game-provider-be-free.onrender.com';

export function shouldRemoveProxyOrigin(origin) {
  return typeof origin === 'string' && DEV_BROWSER_ORIGINS.includes(origin);
}

export function stripLocalOriginForServerProxy(proxyReq, request) {
  if (shouldRemoveProxyOrigin(request?.headers?.origin)) {
    proxyReq.removeHeader('origin');
    return true;
  }
  return false;
}

export function validateDevBackendUrl(value) {
  const target = new URL(value);
  if (!['http:', 'https:'].includes(target.protocol) || target.username || target.password ||
      target.pathname !== '/' || target.search || target.hash) {
    throw new Error('VITE_DEV_BACKEND_URL must be a bare HTTP(S) origin');
  }
  // Never proxy to an insecure remote server: local HTTP BE remains opt-in.
  const local = ['127.0.0.1', 'localhost', '[::1]'].includes(target.hostname);
  if (target.protocol !== 'https:' && !local) {
    throw new Error('VITE_DEV_BACKEND_URL must use HTTPS except for loopback development backends');
  }
  return target.origin;
}
