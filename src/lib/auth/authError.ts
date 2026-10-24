import { ApiError } from '../api/client';

export function authErrorMessage(error: unknown, portal: 'player' | 'operator' | 'admin'): string {
  if (!(error instanceof ApiError)) return error instanceof Error ? error.message : 'Authentication failed. Please retry.';
  if (error.code === 'INVALID_CREDENTIALS') return 'Incorrect email/username or password.';
  if (error.code === 'ACCOUNT_ALREADY_EXISTS' || error.code === 'OPERATOR_EXISTS') {
    return 'An account already exists with this email or username. Try signing in.';
  }
  if (error.code === 'INVALID_REGISTRATION' || error.code === 'INVALID_OPERATOR_REGISTRATION') return error.message;
  if (error.status === 429) return 'Too many requests. Wait a few minutes before trying again.';
  if (error.status === 404) return `${portal === 'player' ? 'Player' : portal === 'operator' ? 'Operator' : 'Admin'} authentication is not available on the configured backend. Check the deployed API URL and feature flags.`;
  if (error.status === 403) return 'Request blocked by backend origin policy or account permissions. Verify the deployed CORS settings.';
  if (error.code === 'NETWORK_ERROR' || error.code === 'REQUEST_TIMEOUT') return error.message;
  if (error.code === 'INVALID_LOGIN_REQUEST') return 'Enter a valid email/username and password.';
  return error.message || 'Authentication failed. Please retry.';
}
