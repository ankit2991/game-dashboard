import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Clock, LogOut, RefreshCw } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { useAuth } from '../../../context/AuthContext';

export const OperatorPendingApproval: React.FC = () => {
  const { user, logout, reloadOperatorStatus } = useAuth();
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const checkStatus = async () => {
    setChecking(true);
    setError('');
    try {
      const latest = await reloadOperatorStatus();
      if (latest.status === 'approved') navigate('/operator/dashboard', { replace: true });
      else if (latest.status !== 'pending') navigate('/access-denied', { replace: true });
    } catch {
      setError('Could not verify account status. Check your connection and try again.');
    } finally { setChecking(false); }
  };

  const handleLogout = () => {
    logout();
    navigate('/operator/login');
  };

  return (
    <div className="min-h-screen bg-[#0B1020] text-[#F5F7FF] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#FFB547]/15 via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-xl w-full text-center space-y-6">
        {/* Animated Clock / Building Icon */}
        <div className="w-20 h-20 rounded-3xl bg-[#FFB547]/10 border-2 border-[#FFB547]/40 flex items-center justify-center mx-auto shadow-2xl shadow-[#FFB547]/20 animate-in zoom-in-95">
          <Clock className="w-10 h-10 text-[#FFB547] animate-pulse" />
        </div>

        <div className="space-y-2">
          <Badge size="md" variant="warning" dot>
            Application awaiting administrator review
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-white tracking-wide">
            Operator Account Under Review
          </h1>
          <p className="text-sm text-[#98A5BF] max-w-md mx-auto leading-relaxed">
            Your registration has been received. A trusted administrator must approve your account before you can access the operator dashboard.
          </p>
        </div>

        {/* Application Summary Card */}
        <div className="bg-[#121A2D] border border-[#233252] rounded-3xl p-6 text-left space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#233252]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#182238] border border-[#2D3E66] flex items-center justify-center text-[#00D4FF]">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">{user?.companyName || 'Operator'}</h3>
                <span className="text-[11px] text-[#98A5BF]">ID: {user?.id || '—'}</span>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#FFB547]/20 text-[#FFB547] border border-[#FFB547]/30">
              Pending Approval
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#182238] border border-[#233252]">
              <span className="text-[10px] text-[#64748B] uppercase font-bold block mb-1">Corporate Email</span>
              <span className="font-semibold text-white">{user?.email || '—'}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#182238] border border-[#233252]">
              <span className="text-[10px] text-[#64748B] uppercase font-bold block mb-1">Estimated SLA</span>
              <span className="font-semibold text-[#00D4FF]">Not guaranteed</span>
            </div>
          </div>

          <p className="text-xs text-[#98A5BF]">No API keys or game access are granted automatically with an operator application.</p>
        </div>

        {error && <p role="alert" className="text-xs text-[#FF5D73]">{error}</p>}
        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            variant="outline"
            size="md"
            onClick={handleLogout}
            leftIcon={<LogOut className="w-4 h-4" />}
            className="w-full sm:w-auto text-[#FF5D73] border-[#FF5D73]/30 hover:bg-[#FF5D73]/10"
          >
            Sign Out Operator
          </Button>
          <Button variant="cyan" size="md" onClick={checkStatus} isLoading={checking}
            leftIcon={<RefreshCw className="w-4 h-4" />}>
            Check Approval Status
          </Button>
        </div>
      </div>
    </div>
  );
};
