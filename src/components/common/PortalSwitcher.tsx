import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Building2, Gamepad2, Sparkles, X, ShieldAlert } from 'lucide-react';
import { Badge } from '../ui/Badge';

export const PortalSwitcher: React.FC = () => {
  const location = useLocation();
  const [isMinimized, setIsMinimized] = useState(false);

  const currentPortal = location.pathname.startsWith('/admin')
    ? 'admin'
    : location.pathname.startsWith('/operator')
    ? 'operator'
    : 'b2c';

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 right-4 z-50 bg-[#7C5CFC] hover:bg-[#6947eb] text-white px-3.5 py-2 rounded-full shadow-2xl flex items-center gap-2 text-xs font-semibold border border-white/20 transition-all hover:scale-105"
        title="Open App Switcher"
      >
        <Sparkles className="w-4 h-4 text-cyan-300" />
        <span>Switch Portal</span>
      </button>
    );
  }

  return (
    <div className="bg-[#121A2D]/95 border-b border-[#233252] backdrop-blur-md sticky top-0 z-50 px-2.5 sm:px-6 lg:px-8 py-1.5 sm:py-2 text-xs text-[#98A5BF]">
      <div className="w-full flex items-center justify-between gap-1.5 sm:gap-3 overflow-x-auto no-scrollbar">
        {/* Left: Brand Badge & Platform Indicator */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          <div className="flex items-center gap-1.5 font-bold font-display text-white tracking-wider text-[11px] sm:text-xs">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#00D4FF] animate-ping" />
            <span className="text-[#00D4FF]">NEXUS</span>
            <span className="text-white hidden sm:inline">SAAS PLATFORM</span>
          </div>
          <span className="text-[#64748B] hidden sm:inline">|</span>
          <span className="text-[#98A5BF] hidden md:inline">Frontend UI Prototype</span>
          <span className="hidden sm:inline-block">
            <Badge size="sm" variant="cyan" dot>UI Simulation</Badge>
          </span>
        </div>

        {/* Center: Switch Portals */}
        <div className="flex items-center gap-1 bg-[#0B1020]/90 p-0.5 sm:p-1 rounded-lg sm:rounded-xl border border-[#233252] flex-shrink-0">
          <Link
            to="/admin"
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-md sm:rounded-lg transition-all font-medium text-[11px] sm:text-xs whitespace-nowrap ${
              currentPortal === 'admin'
                ? 'bg-[#7C5CFC] text-white shadow-md shadow-[#7C5CFC]/30'
                : 'text-[#98A5BF] hover:text-white hover:bg-[#182238]'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span><span className="hidden sm:inline">Super </span>Admin</span>
          </Link>

          <Link
            to="/operator"
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-md sm:rounded-lg transition-all font-medium text-[11px] sm:text-xs whitespace-nowrap ${
              currentPortal === 'operator'
                ? 'bg-[#00D4FF] text-[#0B1020] font-bold shadow-md shadow-[#00D4FF]/30'
                : 'text-[#98A5BF] hover:text-white hover:bg-[#182238]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span><span className="hidden sm:inline">B2B </span>Operator</span>
          </Link>

          <Link
            to="/"
            className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-md sm:rounded-lg transition-all font-medium text-[11px] sm:text-xs whitespace-nowrap ${
              currentPortal === 'b2c'
                ? 'bg-gradient-to-r from-[#7C5CFC] to-[#00D4FF] text-white font-bold shadow-md'
                : 'text-[#98A5BF] hover:text-white hover:bg-[#182238]'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span><span className="hidden sm:inline">B2C </span>Gaming</span>
          </Link>
        </div>

        {/* Right: Environment & Minimize */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className="hidden md:inline-block">
            <Badge size="sm" variant="purple">v1.0-RC</Badge>
          </span>
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 rounded-md text-[#98A5BF] hover:text-white hover:bg-[#182238]"
            title="Minimize bar"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
