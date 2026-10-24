import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Building2, Gamepad2, Clock, LogOut, ChevronUp, ChevronDown, Wrench } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/**
 * DevRoleSwitcher
 * strictly active in development mode (import.meta.env.DEV).
 * Never rendered in production build.
 * Replaces the old global top portal switcher with an unobtrusive
 * developer floating tester widget.
 */
export const DevRoleSwitcher: React.FC = () => {
  // Only render in development
  if (!import.meta.env.DEV) {
    return null;
  }

  const { user, loginAs, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-3 right-3 z-50 font-sans text-xs select-none">
      {isOpen ? (
        <div className="bg-[#121A2D] border border-[#2D3E66] rounded-2xl shadow-2xl p-3 w-64 space-y-2.5 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between pb-2 border-b border-[#233252]">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <Wrench className="w-3.5 h-3.5 text-[#00D4FF]" />
              <span>Dev Role Tester</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded text-[#98A5BF] hover:text-white"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="text-[10px] text-[#64748B]">
            Current: <span className="text-[#00D4FF] font-bold uppercase">{user ? user.role : 'Guest'}</span>
            {user?.operatorApprovalStatus && (
              <span className="text-[#FFB547] ml-1">({user.operatorApprovalStatus})</span>
            )}
          </div>

          <div className="space-y-1">
            <button
              onClick={() => {
                loginAs('super_admin');
                navigate('/admin');
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-white hover:bg-[#7C5CFC]/20 hover:text-[#A885FF] transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#7C5CFC]" />
              <span>Test as Super Admin</span>
            </button>

            <button
              onClick={() => {
                loginAs('operator', { approvalStatus: 'approved' });
                navigate('/operator/dashboard');
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-white hover:bg-[#00D4FF]/20 hover:text-[#00D4FF] transition-colors"
            >
              <Building2 className="w-3.5 h-3.5 text-[#00D4FF]" />
              <span>Test as Approved Operator</span>
            </button>

            <button
              onClick={() => {
                loginAs('operator', { approvalStatus: 'pending' });
                navigate('/operator/pending-approval');
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-white hover:bg-[#FFB547]/20 hover:text-[#FFB547] transition-colors"
            >
              <Clock className="w-3.5 h-3.5 text-[#FFB547]" />
              <span>Test as Pending Operator</span>
            </button>

            <button
              onClick={() => {
                loginAs('player');
                navigate('/');
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-white hover:bg-[#20C997]/20 hover:text-[#20C997] transition-colors"
            >
              <Gamepad2 className="w-3.5 h-3.5 text-[#20C997]" />
              <span>Test as Player</span>
            </button>

            <button
              onClick={() => {
                logout();
                navigate('/');
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-[#FF5D73] hover:bg-[#FF5D73]/10 transition-colors border-t border-[#233252] mt-1 pt-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout (Guest Mode)</span>
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#182238]/90 hover:bg-[#233252] text-[#98A5BF] hover:text-white px-2.5 py-1.5 rounded-full border border-[#2D3E66] shadow-xl flex items-center gap-1.5 backdrop-blur-md transition-all hover:scale-105"
          title="Open Dev Persona Switcher (Dev Mode Only)"
        >
          <Wrench className="w-3 h-3 text-[#00D4FF]" />
          <span className="text-[11px] font-semibold">Dev Persona</span>
          <ChevronUp className="w-3 h-3 text-[#64748B]" />
        </button>
      )}
    </div>
  );
};
