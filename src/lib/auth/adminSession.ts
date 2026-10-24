import { adminApi, type AdminSession } from '../api/admin';
const KEY = 'game_provider_admin_refresh_v1';
const TOKEN = /^[A-Za-z0-9_-]{43}$/;
// Admin refresh tokens must never be stored indefinitely in localStorage.
export function readAdminRefresh(): string | null {
  try { const value = sessionStorage.getItem(KEY); return value && TOKEN.test(value) ? value : null; }
  catch { return null; }
}
export function saveAdminRefresh(value: string): void {
  if (!TOKEN.test(value)) throw new Error('Invalid administrator refresh token');
  try { sessionStorage.setItem(KEY, value); } catch { /* non-persistent session */ }
}
export function clearAdminRefresh(): void {
  try { sessionStorage.removeItem(KEY); } catch { /* disabled */ }
}
const pending = new Map<string, Promise<AdminSession>>();
export function refreshAdminOnce(value: string): Promise<AdminSession> {
  const cached = pending.get(value);
  if (cached) return cached;
  const request = adminApi.refresh(value).finally(() => { if (pending.get(value) === request) pending.delete(value); });
  pending.set(value, request);
  return request;
}
