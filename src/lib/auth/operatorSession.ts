import { operatorApi, type OperatorSession } from '../api/operator';

// Same browser storage limitation as existing B2C auth; HttpOnly cookie refresh
// should replace this before sensitive financial/production functionality.
const STORAGE_KEY = 'game_provider_operator_refresh_v1';
const TOKEN = /^[A-Za-z0-9_-]{43}$/;
export interface PersistedOperatorRefresh { refreshToken: string; remember: boolean }
export function clearOperatorRefresh(): void {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* blocked */ }
  try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* blocked */ }
}
export function persistOperatorRefresh(refreshToken: string, remember: boolean): void {
  clearOperatorRefresh();
  if (!TOKEN.test(refreshToken)) throw new Error('Invalid operator token');
  try { (remember ? localStorage : sessionStorage).setItem(STORAGE_KEY, refreshToken); }
  catch { /* session stays in-memory only */ }
}
export function readOperatorRefresh(): PersistedOperatorRefresh | null {
  for (const remember of [true, false]) {
    try {
      const storage = remember ? localStorage : sessionStorage;
      const refreshToken = storage.getItem(STORAGE_KEY);
      if (refreshToken && TOKEN.test(refreshToken)) return { refreshToken, remember };
      if (refreshToken) storage.removeItem(STORAGE_KEY);
    } catch { /* blocked */ }
  }
  return null;
}
const pending = new Map<string, Promise<OperatorSession>>();
export function refreshOperatorOnce(token: string): Promise<OperatorSession> {
  const current = pending.get(token);
  if (current) return current;
  const request = operatorApi.refresh(token).finally(() => {
    if (pending.get(token) === request) pending.delete(token);
  });
  pending.set(token, request);
  return request;
}
