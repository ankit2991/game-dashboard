import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../context/AuthContext';

interface RequireAuthProps {
  children: React.ReactNode;
  fallbackLoginRoute?: string;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ children, fallbackLoginRoute }) => {
  const { isAuthenticated, isInitializing } = useAuth();
  const location = useLocation();

  if (isInitializing) return <div className="min-h-screen bg-[#0B1020] text-white flex items-center justify-center">Restoring session…</div>;

  if (!isAuthenticated) {
    let target = fallbackLoginRoute;
    if (!target) {
      if (location.pathname.startsWith('/admin')) {
        target = '/admin/login';
      } else if (location.pathname.startsWith('/operator')) {
        target = '/operator/login';
      } else {
        target = '/login';
      }
    }
    return <Navigate to={target} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

interface RequireRoleProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export const RequireRole: React.FC<RequireRoleProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isInitializing } = useAuth();
  const location = useLocation();

  if (isInitializing) return <div className="min-h-screen bg-[#0B1020] text-white flex items-center justify-center">Restoring session…</div>;

  if (!isAuthenticated || !user) {
    let loginTarget = '/login';
    if (location.pathname.startsWith('/admin')) loginTarget = '/admin/login';
    if (location.pathname.startsWith('/operator')) loginTarget = '/operator/login';
    return <Navigate to={loginTarget} state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/access-denied" state={{ attemptedPath: location.pathname, requiredRoles: allowedRoles }} replace />;
  }

  return <>{children}</>;
};

interface RequireOperatorApprovalProps {
  children: React.ReactNode;
}

export const RequireOperatorApproval: React.FC<RequireOperatorApprovalProps> = ({ children }) => {
  const { user, reloadOperatorStatus } = useAuth();
  const location = useLocation();
  const [checkedPath, setCheckedPath] = useState<string | null>(null);
  const [checkFailed, setCheckFailed] = useState(false);

  useEffect(() => {
    if (user?.role !== 'operator' || user.operatorApprovalStatus !== 'approved') return;
    let active = true;
    setCheckFailed(false);
    void reloadOperatorStatus().then(() => {
      if (active) setCheckedPath(location.pathname);
    }).catch(() => {
      if (active) setCheckFailed(true);
    });
    return () => { active = false; };
  }, [location.pathname, reloadOperatorStatus, user?.id, user?.role, user?.operatorApprovalStatus]);

  if (!user || user.role !== 'operator') return <Navigate to="/operator/login" replace />;
  if (user.operatorApprovalStatus === 'pending') return <Navigate to="/operator/pending-approval" replace />;
  if (user.operatorApprovalStatus !== 'approved') {
    return <Navigate to="/access-denied" state={{ reason: 'operator_suspended' }} replace />;
  }
  if (checkFailed) return <div className="min-h-screen bg-[#0B1020] text-[#FF5D73] p-8">Unable to verify operator approval. Check your connection and reload.</div>;
  if (checkedPath !== location.pathname) return <div className="min-h-screen bg-[#0B1020] text-white p-8">Verifying operator approval…</div>;
  return <>{children}</>;
};
