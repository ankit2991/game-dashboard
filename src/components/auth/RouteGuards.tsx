import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../context/AuthContext';

interface RequireAuthProps {
  children: React.ReactNode;
  fallbackLoginRoute?: string;
}

export const RequireAuth: React.FC<RequireAuthProps> = ({ children, fallbackLoginRoute }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

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
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

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
  const { user } = useAuth();

  if (!user || user.role !== 'operator') {
    return <Navigate to="/operator/login" replace />;
  }

  if (user.operatorApprovalStatus === 'pending') {
    return <Navigate to="/operator/pending-approval" replace />;
  }

  if (user.operatorApprovalStatus === 'suspended' || user.operatorApprovalStatus === 'rejected') {
    return <Navigate to="/access-denied" state={{ reason: 'operator_suspended' }} replace />;
  }

  return <>{children}</>;
};
