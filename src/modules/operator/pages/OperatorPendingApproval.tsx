import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Clock, ShieldCheck, Mail, FileText, CheckCircle2, LogOut, ArrowRight, Phone } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { useAuth } from '../../../context/AuthContext';

export const OperatorPendingApproval: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
            KYC & Legal Verification in Progress
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-white tracking-wide">
            Operator Account Under Review
          </h1>
          <p className="text-sm text-[#98A5BF] max-w-md mx-auto leading-relaxed">
            Thank you for registering with NEXUS Game Provider. Your corporate aggregator application has been assigned to our compliance officer for due diligence.
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
                <h3 className="font-bold text-white text-sm">{user?.companyName || 'Corporate Partner Ltd'}</h3>
                <span className="text-[11px] text-[#98A5BF]">ID: {user?.id || 'usr_op_pending'}</span>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#FFB547]/20 text-[#FFB547] border border-[#FFB547]/30">
              Pending Approval
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#182238] border border-[#233252]">
              <span className="text-[10px] text-[#64748B] uppercase font-bold block mb-1">Corporate Email</span>
              <span className="font-semibold text-white">{user?.email || 'corporate@operator.com'}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#182238] border border-[#233252]">
              <span className="text-[10px] text-[#64748B] uppercase font-bold block mb-1">Estimated SLA</span>
              <span className="font-semibold text-[#00D4FF]">24 – 48 Business Hours</span>
            </div>
          </div>

          {/* Verification steps */}
          <div className="pt-2 space-y-2">
            <h4 className="text-[11px] font-bold text-[#98A5BF] uppercase tracking-wider">Compliance Checklist</h4>
            <div className="space-y-1.5 text-xs text-[#98A5BF]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#20C997]" />
                <span className="text-white">Business registration & incorporation filed</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#FFB547]" />
                <span>RNG Certification & BMM Testlabs audit review</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#64748B]" />
                <span className="text-[#64748B]">HMAC production API credentials & IP white-listing</span>
              </div>
            </div>
          </div>
        </div>

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
          <a
            href="mailto:compliance@nexus-provider.io"
            className="w-full sm:w-auto"
          >
            <Button
              variant="cyan"
              size="md"
              leftIcon={<Mail className="w-4 h-4" />}
              className="w-full sm:w-auto font-bold"
            >
              Contact Compliance Team
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};
