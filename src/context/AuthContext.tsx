import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'super_admin' | 'operator' | 'player';
export type OperatorApproval = 'approved' | 'pending' | 'suspended' | 'rejected';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  operatorApprovalStatus?: OperatorApproval;
  companyName?: string;
  walletBalance?: number;
  currency?: string;
  vipTier?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  loginAs: (role: UserRole, options?: { email?: string; name?: string; companyName?: string; approvalStatus?: OperatorApproval }) => void;
  registerPlayer: (playerData: { fullName: string; email: string; username: string }) => void;
  registerOperator: (operatorData: { companyName: string; email: string; businessType: string }) => void;
  logout: () => void;
  updateBalance: (newBalance: number) => void;
}

const STORAGE_KEY = 'nexus_auth_session';

// Pre-configured mock personas
export const MOCK_PERSONAS = {
  superAdmin: {
    id: 'usr_admin_001',
    name: 'Alex Mercer',
    email: 'alex.mercer@nexus-provider.io',
    role: 'super_admin' as UserRole,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
    vipTier: 'Platform Super Admin',
  },
  approvedOperator: {
    id: 'usr_op_7741',
    name: 'Daniel Tan',
    email: 'd.tan@asiagaming.net',
    companyName: 'Asia Gaming Network Ltd',
    role: 'operator' as UserRole,
    operatorApprovalStatus: 'approved' as OperatorApproval,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
  },
  pendingOperator: {
    id: 'usr_op_9921',
    name: 'Sarah Connor',
    email: 's.connor@cybertech-slots.io',
    companyName: 'CyberTech Gaming Ventures',
    role: 'operator' as UserRole,
    operatorApprovalStatus: 'pending' as OperatorApproval,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
  },
  player: {
    id: 'usr_882194',
    name: 'Raymond Chen',
    email: 'raymond.chen@gmail.com',
    role: 'player' as UserRole,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    walletBalance: 8420.50,
    currency: 'MYR',
    vipTier: 'Platinum Level 4',
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    // Restore session from localStorage if available
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse stored auth session:', e);
    }
    // Default to mock logged in player for B2C demo experience
    return MOCK_PERSONAS.player;
  });

  // Keep localStorage synchronized
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const loginAs = (
    role: UserRole,
    options?: { email?: string; name?: string; companyName?: string; approvalStatus?: OperatorApproval }
  ) => {
    if (role === 'super_admin') {
      const adminUser: AuthUser = {
        ...MOCK_PERSONAS.superAdmin,
        email: options?.email || MOCK_PERSONAS.superAdmin.email,
        name: options?.name || MOCK_PERSONAS.superAdmin.name,
      };
      setUser(adminUser);
    } else if (role === 'operator') {
      const approval = options?.approvalStatus || 'approved';
      const base = approval === 'pending' ? MOCK_PERSONAS.pendingOperator : MOCK_PERSONAS.approvedOperator;
      const opUser: AuthUser = {
        ...base,
        email: options?.email || base.email,
        companyName: options?.companyName || base.companyName,
        operatorApprovalStatus: approval,
      };
      setUser(opUser);
    } else {
      const playerUser: AuthUser = {
        ...MOCK_PERSONAS.player,
        email: options?.email || MOCK_PERSONAS.player.email,
        name: options?.name || MOCK_PERSONAS.player.name,
      };
      setUser(playerUser);
    }
  };

  const registerPlayer = (playerData: { fullName: string; email: string; username: string }) => {
    const newPlayer: AuthUser = {
      id: `usr_${Date.now().toString().slice(-6)}`,
      name: playerData.fullName || 'New Player',
      email: playerData.email,
      role: 'player',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      walletBalance: 1000.00, // Welcome gift balance
      currency: 'MYR',
      vipTier: 'Bronze Level 1',
    };
    setUser(newPlayer);
  };

  const registerOperator = (operatorData: { companyName: string; email: string; businessType: string }) => {
    const newOperator: AuthUser = {
      id: `usr_op_${Date.now().toString().slice(-6)}`,
      name: operatorData.companyName,
      email: operatorData.email,
      role: 'operator',
      companyName: operatorData.companyName,
      operatorApprovalStatus: 'pending', // Strictly pending!
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    };
    setUser(newOperator);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const updateBalance = (newBalance: number) => {
    if (user && user.role === 'player') {
      setUser({ ...user, walletBalance: newBalance });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        role: user?.role || null,
        loginAs,
        registerPlayer,
        registerOperator,
        logout,
        updateBalance,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
