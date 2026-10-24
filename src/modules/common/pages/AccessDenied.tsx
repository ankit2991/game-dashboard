import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, LogOut, Lock, Home, Building2, ShieldCheck } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useAuth } from '../../../context/AuthContext';

export const AccessDenied: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const attemptedPath = (location.state as any)?.attemptedPath || location.pathname;
  const reason = (location.state as any)?.reason;

  const getAuthorizedPortalLink = () => {
    if (!user) return { label: 'Return to Homepage', path: '/' };
    if (user.role === 'super_admin') return { label: 'Go to Super Admin Portal', path: '/admin' };
    if (user.role === 'operator') {
      if (user.operatorApprovalStatus === 'pending') {
        return { label: 'View Operator Application Status', path: '/operator/pending-approval' };
      }
      return { label: 'Go to Operator Dashboard', path: '/operator/dashboard' };
    }
    return { label: 'Return to Player Hub', path: '/' };
  };

  const authorizedPortal = getAuthorizedPortalLink();

  const handleLogoutAndSwitch = () => {
    logout();
    if (attemptedPath.startsWith('/admin')) {
      navigate('/admin/login');
    } else if (attemptedPath.startsWith('/operator')) {
      navigate('/operator/login');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1020] text-[#F5F7FF] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
      {/* Background cyber grid & glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#FF5D73]/15 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full text-center space-y-6">
        {/* Shield Alert Icon */}
        <div className="w-20 h-20 rounded-3xl bg-[#FF5D73]/10 border-2 border-[#FF5D73]/40 flex items-center justify-center mx-auto shadow-2xl shadow-[#FF5D73]/20 animate-in zoom-in-95">
          <ShieldAlert className="w-10 h-10 text-[#FF5D73]" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-widest px-3 py-1 rounded-full bg-[#FF5D73]/10 text-[#FF5D73] border border-[#FF5D73]/30 inline-block font-bold">
            HTTP 403 • Restricted Zone
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-white tracking-wide">
            Access Denied
          </h1>
          <p className="text-sm text-[#98A5BF] max-w-md mx-auto leading-relaxed">
            {reason === 'operator_suspended'
              ? 'Your operator account has been suspended by compliance. Please contact Super Admin support.'
              : 'You do not have the required role or authorization level to access this portal section.'}
          </p>
        </div>

        {/* Current Identity Card */}
        <div className="bg-[#121A2D] border border-[#233252] rounded-2xl p-4 text-left space-y-2 text-xs">
          <div className="flex items-center justify-between text-[#98A5BF] pb-2 border-b border-[#233252]">
            <span>Current Authenticated Identity:</span>
            <span className="font-mono font-bold text-white capitalize">
              {user ? user.role.replace('_', ' ') : 'Unauthenticated Guest'}
            </span>
          </div>
          {user && (
            <div className="flex items-center justify-between pt-1">
              <span className="text-white font-medium">{user.name} ({user.email})</span>
              <span className="text-[#00D4FF] font-mono text-[11px]">{user.id}</span>
            </div>
          )}
          {attemptedPath && (
            <div className="text-[11px] text-[#64748B] font-mono truncate">
              Requested target: <span className="text-[#FFB547]">{attemptedPath}</span>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link to={authorizedPortal.path} className="w-full sm:w-auto">
            <Button
              variant="primary"
              size="md"
              leftIcon={<Home className="w-4 h-4" />}
              className="w-full sm:w-auto font-bold"
            >
              {authorizedPortal.label}
            </Button>
          </Link>

          <Button
            variant="outline"
            size="md"
            onClick={handleLogoutAndSwitch}
            leftIcon={<LogOut className="w-4 h-4" />}
            className="w-full sm:w-auto text-[#FF5D73] border-[#FF5D73]/30 hover:bg-[#FF5D73]/10"
          >
            Switch Account
          </Button>
        </div>
      </div>
    </div>
  );
};
