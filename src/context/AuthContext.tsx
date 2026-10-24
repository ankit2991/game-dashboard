import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { ApiError } from '../lib/api/client';
import { playerApi, type PlayerRegisterRequest, type PlayerProfile, type PlayerSessionResponse } from '../lib/api/player';
import { clearLegacyMockSession, clearPersistedRefresh, persistRefresh, readPersistedRefresh, refreshOnce } from '../lib/auth/playerSession';
import { operatorApi, type OperatorProfile, type OperatorRegisterRequest, type OperatorSession } from '../lib/api/operator';
import { clearOperatorRefresh, persistOperatorRefresh, readOperatorRefresh, refreshOperatorOnce } from '../lib/auth/operatorSession';
import { adminApi, type AdminSession } from '../lib/api/admin';
import { clearAdminRefresh, readAdminRefresh, refreshAdminOnce, saveAdminRefresh } from '../lib/auth/adminSession';
import { validateOperatorProfile } from '../lib/operator/operatorModel';

export type UserRole = 'super_admin' | 'operator' | 'player';
export type OperatorApproval = 'approved' | 'pending' | 'suspended' | 'rejected';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  username?: string;
  operatorApprovalStatus?: OperatorApproval;
  companyName?: string;
  walletBalance?: number;
  currency?: string;
  vipTier?: string;
  createdAt?: string;
  locale?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  role: UserRole | null;
  /** Local demo persona is player-only; never authorizes admin routes. */
  loginAs: (role: UserRole, options?: { email?: string; name?: string; companyName?: string; approvalStatus?: OperatorApproval }) => void;
  loginAdmin: (email: string, password: string) => Promise<void>;
  getAdminAccessToken: () => Promise<string | null>;
  loginPlayer: (identifier: string, password: string, remember: boolean) => Promise<void>;
  registerPlayer: (fields: PlayerRegisterRequest, remember: boolean) => Promise<void>;
  getPlayerAccessToken: () => Promise<string | null>;
  loadPlayerProfile: () => Promise<PlayerProfile>;
  updatePlayerProfile: (changes: { displayName?: string; locale?: string }) => Promise<PlayerProfile>;
  registerOperator: (operatorData: OperatorRegisterRequest, remember: boolean) => Promise<OperatorApproval>;
  loginOperator: (email: string, password: string, remember: boolean) => Promise<OperatorApproval>;
  reloadOperatorStatus: () => Promise<OperatorProfile>;
  getOperatorAccessToken: () => Promise<string | null>;
  logout: () => void;
  updateBalance: (newBalance: number) => void;
}

const PLAYER_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80';
const OPERATOR_AVATAR = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80';

export const MOCK_PERSONAS = {
  player: {
    id: 'dev_player_only', name: 'Dev Test Player', email: 'dev-player@localhost.test',
    role: 'player' as UserRole, avatar: PLAYER_AVATAR,
  },
};

interface TokenState {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  remember: boolean;
}

const profileToUser = (profile: PlayerProfile): AuthUser => ({
  id: profile.id, name: profile.displayName, email: profile.email,
  username: profile.username, role: 'player', avatar: PLAYER_AVATAR,
  createdAt: profile.createdAt, locale: profile.locale,
  // Wallet/VIP data will be connected by later patches. Never invent a balance.
});

const operatorToUser = (raw: OperatorProfile): AuthUser => {
  const profile = validateOperatorProfile(raw);
  return ({
  id: profile.id, name: profile.contactPerson, email: profile.email,
  companyName: profile.companyName, role: 'operator', avatar: OPERATOR_AVATAR,
  operatorApprovalStatus: profile.status, createdAt: profile.createdAt,
  });
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const tokens = useRef<TokenState | null>(null);
  const operatorTokens = useRef<TokenState | null>(null);
  const adminTokens = useRef<TokenState | null>(null);
  const adminRefreshPending = useRef<Promise<string | null> | null>(null);
  const operatorRefreshPending = useRef<Promise<string | null> | null>(null);
  const refreshPending = useRef<Promise<string | null> | null>(null);
  // Reject stale login/restore promises after logout or persona change.
  const revision = useRef(0);

  const acceptPlayerSession = useCallback((session: PlayerSessionResponse, remember: boolean) => {
    if (!session.accessToken || !session.refreshToken || !session.user?.id ||
        session.tokenType !== 'Bearer' || !(session.expiresIn > 0)) {
      throw new Error('Backend returned an invalid player session.');
    }
    tokens.current = {
      accessToken: session.accessToken, refreshToken: session.refreshToken,
      expiresAt: Date.now() + session.expiresIn * 1000, remember,
    };
    persistRefresh(session.refreshToken, remember);
    setUser(profileToUser(session.user));
    setIsInitializing(false);
  }, []);

  const acceptOperatorSession = useCallback((session: OperatorSession, remember: boolean) => {
    if (!session.accessToken || !session.refreshToken || !session.user?.id ||
        session.tokenType !== 'Bearer' || !(session.expiresIn > 0)) {
      throw new Error('Backend returned an invalid operator session.');
    }
    validateOperatorProfile(session.user);
    operatorTokens.current = {
      accessToken: session.accessToken, refreshToken: session.refreshToken,
      expiresAt: Date.now() + session.expiresIn * 1000, remember,
    };
    persistOperatorRefresh(session.refreshToken, remember);
    setUser(operatorToUser(session.user));
    setIsInitializing(false);
  }, []);

  const acceptAdminSession = useCallback((session: AdminSession) => {
    if (session.tokenType !== 'Bearer' || session.user?.role !== 'super_admin' ||
        !session.accessToken || !session.refreshToken || !(session.expiresIn > 0)) {
      throw new Error('Backend returned an invalid admin session.');
    }
    adminTokens.current = {accessToken: session.accessToken, refreshToken: session.refreshToken,
      expiresAt: Date.now() + session.expiresIn * 1000, remember: false};
    saveAdminRefresh(session.refreshToken);
    setUser({id: session.user.id, name: session.user.name, email: session.user.email,
      role: 'super_admin', avatar: OPERATOR_AVATAR});
    setIsInitializing(false);
  }, []);

  useEffect(() => {
    clearLegacyMockSession();
    let mounted = true;
    const version = revision.current;
    const savedAdmin = readAdminRefresh();
    if (savedAdmin) {
      void refreshAdminOnce(savedAdmin).then(session => {
        if (mounted && version === revision.current) acceptAdminSession(session);
      }).catch(() => {
        if (mounted && version === revision.current) { adminTokens.current = null; clearAdminRefresh(); setUser(null); }
      }).finally(() => { if (mounted) setIsInitializing(false); });
      return () => { mounted = false; };
    }
    const savedOperator = readOperatorRefresh();
    if (savedOperator) {
      void refreshOperatorOnce(savedOperator.refreshToken).then(session => {
        if (mounted && version === revision.current) acceptOperatorSession(session, savedOperator.remember);
      }).catch(() => {
        if (mounted && version === revision.current) {
          operatorTokens.current = null;
          clearOperatorRefresh();
          setUser(null);
        }
      }).finally(() => { if (mounted) setIsInitializing(false); });
      return () => { mounted = false; };
    }
    const saved = readPersistedRefresh();
    if (!saved) {
      setIsInitializing(false);
      return () => { mounted = false; };
    }
    void refreshOnce(saved.refreshToken).then(session => {
      if (mounted && version === revision.current) acceptPlayerSession(session, saved.remember);
    }).catch(() => {
      // Expired, revoked, malformed, or temporarily unreachable session:
      // fail closed and never trust a previously cached user object.
      if (mounted && version === revision.current) {
        tokens.current = null;
        clearPersistedRefresh();
        setUser(null);
      }
    }).finally(() => { if (mounted) setIsInitializing(false); });
    return () => { mounted = false; };
  }, [acceptPlayerSession, acceptOperatorSession, acceptAdminSession]);

  const loginAdmin = useCallback(async (email: string, password: string) => {
    const version = ++revision.current;
    const previousPlayer = tokens.current;
    const previousOperator = operatorTokens.current;
    const previousAdmin = adminTokens.current;
    tokens.current = null; operatorTokens.current = null; adminTokens.current = null;
    clearPersistedRefresh(); clearOperatorRefresh(); clearAdminRefresh(); setUser(null);
    if (previousPlayer) void playerApi.logout(previousPlayer.refreshToken).catch(() => {});
    if (previousOperator) void operatorApi.logout(previousOperator.refreshToken).catch(() => {});
    if (previousAdmin) void adminApi.logout(previousAdmin.refreshToken).catch(() => {});
    const session = await adminApi.login(email, password);
    if (version !== revision.current) { void adminApi.logout(session.refreshToken).catch(() => {}); throw new ApiError('Session changed. Please sign in again.', 401, 'SESSION_CHANGED'); }
    acceptAdminSession(session);
  }, [acceptAdminSession]);

  const getAdminAccessToken = useCallback(async (): Promise<string | null> => {
    const current = adminTokens.current;
    if (!current || user?.role !== 'super_admin') return null;
    if (current.expiresAt > Date.now() + 30_000) return current.accessToken;
    if (adminRefreshPending.current) return adminRefreshPending.current;
    const version = revision.current;
    const request = refreshAdminOnce(current.refreshToken).then(session => {
      if (version !== revision.current) return null;
      acceptAdminSession(session); return session.accessToken;
    }).catch(error => {
      if (version === revision.current && error instanceof ApiError && error.status === 401) {
        adminTokens.current = null; clearAdminRefresh(); setUser(null);
      }
      throw error;
    }).finally(() => { if (adminRefreshPending.current === request) adminRefreshPending.current = null; });
    adminRefreshPending.current = request;
    return request;
  }, [acceptAdminSession, user?.role]);

  const loginPlayer = useCallback(async (identifier: string, password: string, remember: boolean) => {
    const version = ++revision.current;
    const oldSession = tokens.current;
    const oldOperator = operatorTokens.current;
    const oldAdmin = adminTokens.current;
    tokens.current = null;
    operatorTokens.current = null;
    adminTokens.current = null;
    clearAdminRefresh();
    clearPersistedRefresh();
    clearOperatorRefresh();
    setUser(null);
    if (oldSession) void playerApi.logout(oldSession.refreshToken).catch(() => {});
    if (oldOperator) void operatorApi.logout(oldOperator.refreshToken).catch(() => {});
    if (oldAdmin) void adminApi.logout(oldAdmin.refreshToken).catch(() => {});
    const session = await playerApi.login(identifier, password);
    if (version !== revision.current) { void playerApi.logout(session.refreshToken).catch(() => {}); throw new ApiError('Session changed. Please sign in again.', 401, 'SESSION_CHANGED'); }
    acceptPlayerSession(session, remember);
  }, [acceptPlayerSession]);

  const registerPlayer = useCallback(async (fields: PlayerRegisterRequest, remember: boolean) => {
    const version = ++revision.current;
    const oldSession = tokens.current;
    const oldOperator = operatorTokens.current;
    const oldAdmin = adminTokens.current;
    tokens.current = null;
    operatorTokens.current = null;
    adminTokens.current = null;
    clearAdminRefresh();
    clearPersistedRefresh();
    clearOperatorRefresh();
    setUser(null);
    if (oldSession) void playerApi.logout(oldSession.refreshToken).catch(() => {});
    if (oldOperator) void operatorApi.logout(oldOperator.refreshToken).catch(() => {});
    if (oldAdmin) void adminApi.logout(oldAdmin.refreshToken).catch(() => {});
    const session = await playerApi.register(fields);
    if (version !== revision.current) { void playerApi.logout(session.refreshToken).catch(() => {}); throw new ApiError('Session changed. Please sign in again.', 401, 'SESSION_CHANGED'); }
    acceptPlayerSession(session, remember);
  }, [acceptPlayerSession]);

  const getPlayerAccessToken = useCallback(async (): Promise<string | null> => {
    if (!tokens.current || user?.role !== 'player') return null;
    if (tokens.current.expiresAt > Date.now() + 30_000) return tokens.current.accessToken;
    if (refreshPending.current) return refreshPending.current;
    const version = revision.current;
    const previous = tokens.current;
    const pending = refreshOnce(previous.refreshToken).then(session => {
      if (version !== revision.current) return null;
      acceptPlayerSession(session, previous.remember);
      return session.accessToken;
    }).catch(error => {
      if (version === revision.current && error instanceof ApiError && error.status === 401) {
        tokens.current = null;
        clearPersistedRefresh();
        setUser(null);
      }
      throw error;
    }).finally(() => { if (refreshPending.current === pending) refreshPending.current = null; });
    refreshPending.current = pending;
    return pending;
  }, [acceptPlayerSession, user?.role]);

  const loadPlayerProfile = useCallback(async (): Promise<PlayerProfile> => {
    const version = revision.current;
    const token = await getPlayerAccessToken();
    if (!token) throw new ApiError('Please sign in to access your profile.', 401, 'UNAUTHORIZED');
    const response = await playerApi.me(token);
    if (version !== revision.current) throw new ApiError('Session changed.', 401, 'SESSION_CHANGED');
    setUser(profileToUser(response.user));
    return response.user;
  }, [getPlayerAccessToken]);

  const updatePlayerProfile = useCallback(async (changes: { displayName?: string; locale?: string }): Promise<PlayerProfile> => {
    const version = revision.current;
    const token = await getPlayerAccessToken();
    if (!token) throw new ApiError('Please sign in to edit your profile.', 401, 'UNAUTHORIZED');
    const response = await playerApi.updateProfile(token, changes);
    if (version !== revision.current) throw new ApiError('Session changed.', 401, 'SESSION_CHANGED');
    setUser(profileToUser(response.user));
    return response.user;
  }, [getPlayerAccessToken]);

  const loginOperator = useCallback(async (email: string, password: string, remember: boolean): Promise<OperatorApproval> => {
    const version = ++revision.current;
    const previousPlayer = tokens.current;
    const previousOperator = operatorTokens.current;
    const previousAdmin = adminTokens.current;
    tokens.current = null;
    operatorTokens.current = null;
    adminTokens.current = null;
    clearAdminRefresh();
    clearPersistedRefresh();
    clearOperatorRefresh();
    setUser(null);
    if (previousPlayer) void playerApi.logout(previousPlayer.refreshToken).catch(() => {});
    if (previousOperator) void operatorApi.logout(previousOperator.refreshToken).catch(() => {});
    if (previousAdmin) void adminApi.logout(previousAdmin.refreshToken).catch(() => {});
    const session = await operatorApi.login(email, password);
    if (version !== revision.current) { void operatorApi.logout(session.refreshToken).catch(() => {}); throw new ApiError('Session changed. Please sign in again.', 401, 'SESSION_CHANGED'); }
    acceptOperatorSession(session, remember);
    return session.user.status;
  }, [acceptOperatorSession]);

  const registerOperator = useCallback(async (fields: OperatorRegisterRequest, remember: boolean): Promise<OperatorApproval> => {
    const version = ++revision.current;
    const previousPlayer = tokens.current;
    const previousOperator = operatorTokens.current;
    const previousAdmin = adminTokens.current;
    tokens.current = null;
    operatorTokens.current = null;
    adminTokens.current = null;
    clearAdminRefresh();
    clearPersistedRefresh();
    clearOperatorRefresh();
    setUser(null);
    if (previousPlayer) void playerApi.logout(previousPlayer.refreshToken).catch(() => {});
    if (previousOperator) void operatorApi.logout(previousOperator.refreshToken).catch(() => {});
    if (previousAdmin) void adminApi.logout(previousAdmin.refreshToken).catch(() => {});
    const session = await operatorApi.register(fields);
    if (version !== revision.current) { void operatorApi.logout(session.refreshToken).catch(() => {}); throw new ApiError('Session changed. Please sign in again.', 401, 'SESSION_CHANGED'); }
    acceptOperatorSession(session, remember);
    return session.user.status;
  }, [acceptOperatorSession]);

  const getOperatorAccessToken = useCallback(async (): Promise<string | null> => {
    const current = operatorTokens.current;
    if (!current || user?.role !== 'operator') return null;
    if (current.expiresAt > Date.now() + 30_000) return current.accessToken;
    if (operatorRefreshPending.current) return operatorRefreshPending.current;
    const version = revision.current;
    const pending = refreshOperatorOnce(current.refreshToken).then(session => {
      if (version !== revision.current) return null;
      acceptOperatorSession(session, current.remember);
      return session.accessToken;
    }).catch(error => {
      if (version === revision.current && error instanceof ApiError && error.status === 401) {
        operatorTokens.current = null;
        clearOperatorRefresh();
        setUser(null);
      }
      throw error;
    }).finally(() => {
      if (operatorRefreshPending.current === pending) operatorRefreshPending.current = null;
    });
    operatorRefreshPending.current = pending;
    return pending;
  }, [acceptOperatorSession, user?.role]);

  const reloadOperatorStatus = useCallback(async (): Promise<OperatorProfile> => {
    const version = revision.current;
    const token = await getOperatorAccessToken();
    if (!token) throw new ApiError('Please sign in as an operator.', 401, 'UNAUTHORIZED');
    const result = await operatorApi.me(token);
    if (version !== revision.current) throw new ApiError('Session changed.', 401, 'SESSION_CHANGED');
    setUser(operatorToUser(result.user));
    return result.user;
  }, [getOperatorAccessToken]);

  const logout = useCallback(() => {
    ++revision.current;
    const previous = tokens.current;
    const previousOperator = operatorTokens.current;
    const previousAdmin = adminTokens.current;
    tokens.current = null;
    operatorTokens.current = null;
    adminTokens.current = null;
    clearAdminRefresh();
    clearPersistedRefresh();
    clearOperatorRefresh();
    clearLegacyMockSession();
    setUser(null);
    setIsInitializing(false);
    // Revoke the refresh token server-side; local logout always completes first.
    // If offline, the issued token remains valid until server-side expiry.
    if (previous) void playerApi.logout(previous.refreshToken).catch(() => {});
    if (previousOperator) void operatorApi.logout(previousOperator.refreshToken).catch(() => {});
    if (previousAdmin) void adminApi.logout(previousAdmin.refreshToken).catch(() => {});
  }, []);

  const loginAs = useCallback((role: UserRole, options?: {
    email?: string; name?: string; companyName?: string; approvalStatus?: OperatorApproval;
  }) => {
    // A developer UI simulation is never a real authenticated session.
    if (!import.meta.env.DEV || role !== 'player') return;
    ++revision.current;
    tokens.current = null;
    clearPersistedRefresh();
    operatorTokens.current = null;
    clearOperatorRefresh();
    adminTokens.current = null;
    clearAdminRefresh();
    const base = MOCK_PERSONAS.player;
    setUser({ ...base, name: options?.name || base.name, email: options?.email || base.email });
    setIsInitializing(false);
  }, []);

  const updateBalance = useCallback((_newBalance: number) => {
    // Patch 6 will replace mock wallet state with authenticated wallet data.
    // Never allow client-only balance updates on a real B2C account.
  }, []);

  return (
    <AuthContext.Provider value={{
      user, isAuthenticated: !!user, isInitializing, role: user?.role || null,
      loginAs, loginAdmin, getAdminAccessToken, loginPlayer, registerPlayer, getPlayerAccessToken,
      loadPlayerProfile, updatePlayerProfile, registerOperator, loginOperator, reloadOperatorStatus, getOperatorAccessToken, logout, updateBalance,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
