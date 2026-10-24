import type { ApiEnvelope } from './types';

/**
 * Browser-safe transport. No partner API key, game adapter key or B2B admin key
 * may ever be placed in VITE_* variables or passed by browser callers.
 */
const DEFAULT_TIMEOUT_MS = 10000;
const API_PATH = '/api/v1';

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly requestId?: string;

  constructor(message: string, status: number, code: string, requestId?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.requestId = requestId;
  }
}

/** Validate absolute backend URLs rather than accidentally sending secrets to a typo host. */
export function resolveApiBase(raw: string | undefined, development: boolean): string {
  const configured = raw?.trim();
  if (!configured) return API_PATH; // Vite /api proxy in local development.
  let url: URL;
  try { url = new URL(configured); }
  catch { throw new Error('VITE_API_BASE_URL must be an absolute HTTP(S) URL'); }
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  if (url.protocol !== 'https:' && !(development && local && url.protocol === 'http:')) {
    throw new Error('VITE_API_BASE_URL must use HTTPS except for development localhost');
  }
  if (url.username || url.password || url.search || url.hash ||
      !['/', API_PATH].includes(url.pathname.replace(/\/$/, '') || '/')) {
    throw new Error('VITE_API_BASE_URL must be an origin or origin/api/v1, without credentials or query');
  }
  return url.origin + API_PATH;
}

export const apiBaseUrl = resolveApiBase(import.meta.env.VITE_API_BASE_URL, import.meta.env.DEV);

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH';
  body?: unknown;
  accessToken?: string; // User / Operator / browser-Admin session token only; never private Partner/AdminKey/Adapter credentials.
  signal?: AbortSignal;
  timeoutMs?: number;
  /** Query values are URL-encoded; only server-supported endpoint parameters should be passed. */
  query?: Readonly<Record<string, string | number>>;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  if (!/^\/[a-z0-9/-]+$/.test(path) || path.includes('//')) {
    throw new Error('API path must be a safe /relative-path without a query string');
  }
  const { body, accessToken, timeoutMs = DEFAULT_TIMEOUT_MS, signal, method = 'GET', query } = options;
  if (query && method !== 'GET') throw new Error('API query is only supported for GET requests');
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query ?? {})) {
    if (!/^[a-z][a-z0-9]*$/.test(key) ||
        !(typeof value === 'string' || (typeof value === 'number' && Number.isFinite(value)))) {
      throw new Error('Invalid API query parameter');
    }
    params.set(key, String(value));
  }
  const queryString = params.size ? `?${params.toString()}` : '';
  if (!Number.isSafeInteger(timeoutMs) || timeoutMs < 1) throw new Error('Invalid API timeout');
  const controller = new AbortController();
  const abort = () => controller.abort();
  if (signal?.aborted) controller.abort();
  else signal?.addEventListener('abort', abort, { once: true });
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${apiBaseUrl}${path}${queryString}`, {
      method,
      headers: {
        Accept: 'application/json',
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      signal: controller.signal,
      credentials: 'omit',
      cache: 'no-store',
    });
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.toLowerCase().includes('application/json')) {
      throw new ApiError('Backend returned a non-JSON response. Check the API URL/proxy.', response.status, 'INVALID_API_RESPONSE');
    }
    let envelope: ApiEnvelope<T>;
    try { envelope = (await response.json()) as ApiEnvelope<T>; }
    catch { throw new ApiError('Backend returned invalid JSON.', response.status, 'INVALID_API_RESPONSE'); }
    if (!response.ok || envelope?.ok !== true || envelope.data === undefined) {
      throw new ApiError(
        envelope?.error?.message || `API request failed (HTTP ${response.status})`,
        response.status,
        envelope?.error?.code || 'API_REQUEST_FAILED',
        envelope?.requestId,
      );
    }
    return envelope.data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (controller.signal.aborted) {
      if (signal?.aborted) throw new ApiError('Request cancelled.', 0, 'REQUEST_CANCELLED');
      throw new ApiError('Backend request timed out.', 0, 'REQUEST_TIMEOUT');
    }
    throw new ApiError('Cannot reach backend. Check backend status, URL and CORS.', 0, 'NETWORK_ERROR');
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', abort);
  }
}
