import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import {
  User,
  Wallet,
  Coins,
  Trophy,
  HelpCircle,
  LogOut,
  Gamepad2,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';

export const PlayerDashboardLayout: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const playerNavItems = [
    { label: 'Account Overview', path: '/player/profile', icon: User },
    { label: 'Sandbox Wallet', path: '/player/wallet', icon: Wallet, highlight: true },
    { label: 'Provider Transactions', path: '/player/transactions', icon: Coins },
    { label: 'Global Leaderboard', path: '/leaderboard', icon: Trophy },
  ];

  return (
    <div className="h-screen bg-[#0B1020] text-[#F5F7FF] flex flex-col font-sans overflow-hidden">
      <div className="flex flex-1 overflow-hidden relative">
        {/* Fixed Desktop Sidebar */}
        <aside
          className={`hidden lg:flex flex-col border-r border-[#233252] bg-[#121A2D]/95 backdrop-blur-md transition-all duration-300 z-30 flex-shrink-0 h-full select-none ${
            sidebarCollapsed ? 'w-20' : 'w-64'
          }`}
        >
          {/* Header */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-[#233252]/80">
            <Link to="/" className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#7C5CFC] to-[#00D4FF] flex items-center justify-center font-bold text-white shadow-md flex-shrink-0">
                <Gamepad2 className="w-4 h-4 text-white" />
              </div>
              {!sidebarCollapsed && (
                <div className="flex flex-col">
                  <span className="font-display font-bold text-sm tracking-wide text-white">
                    NEXUS <span className="text-[#00D4FF]">PLAYER</span>
                  </span>
                  <span className="text-[10px] text-[#98A5BF]">Player Portal</span>
                </div>
              )}
            </Link>

            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1 rounded-lg text-[#98A5BF] hover:text-white hover:bg-[#182238] transition-colors"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>

          {/* Player Identity Summary Card */}
          {!sidebarCollapsed && (
            <div className="p-4 border-b border-[#233252]/60">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#182238] border border-[#2D3E66]">
                <img
                  src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"}
                  alt="Player"
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-[#7C5CFC]/40"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-white text-xs truncate">{user?.name || 'Player'}</p>
                  <p className="text-[10px] text-[#00D4FF] font-mono">@{user?.username || user?.email?.split('@')[0] || 'player'}</p>
                  <span className="text-[10px] text-[#20C997] font-semibold block mt-0.5">
                    ● Sandbox account
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {playerNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-[#7C5CFC] to-[#6947eb] text-white shadow-lg shadow-[#7C5CFC]/20 font-bold'
                      : 'text-[#98A5BF] hover:text-white hover:bg-[#182238]'
                  }`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : item.highlight ? 'text-[#00D4FF]' : 'text-[#98A5BF] group-hover:text-white'}`} />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Return to Games Lobby button */}
          <div className="p-4 border-t border-[#233252]/80">
            <Link
              to="/games"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[#182238] hover:bg-[#233252] text-xs font-semibold text-[#00D4FF] border border-[#2D3E66] transition-all"
            >
              <Gamepad2 className="w-4 h-4" />
              {!sidebarCollapsed && <span>Play Games Lobby</span>}
            </Link>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <div className="relative w-72 bg-[#121A2D] border-r border-[#233252] flex flex-col p-4 z-10">
              <div className="flex items-center justify-between pb-4 border-b border-[#233252]">
                <span className="font-bold text-white font-display">PLAYER DASHBOARD</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1 rounded-lg text-[#98A5BF]">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 space-y-1.5 py-4 overflow-y-auto">
                {playerNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                      location.pathname === item.path ? 'bg-[#7C5CFC] text-white' : 'text-[#98A5BF] hover:bg-[#182238] hover:text-white'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Main Content Area (Independent scroll) */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
          {/* Top Bar with back to lobby & mobile toggle */}
          <header className="h-16 border-b border-[#233252] bg-[#121A2D]/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-20 flex-shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-xl text-[#98A5BF] hover:text-white hover:bg-[#182238]"
              >
                <Menu className="w-5 h-5" />
              </button>
              <Link to="/games" className="text-xs text-[#98A5BF] hover:text-white flex items-center gap-1.5 font-medium">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Gaming Lobby</span>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/player/wallet"
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#182238] border border-[#2D3E66] text-xs font-mono font-bold text-[#00D4FF]"
              >
                <Wallet className="w-3.5 h-3.5 text-[#20C997]" />
                <span>Balance unavailable</span>
              </Link>

              <Link
                to="/"
                onClick={logout}
                className="p-2 rounded-xl text-[#FF5D73] hover:bg-[#FF5D73]/10 border border-[#233252] text-xs font-semibold flex items-center gap-1.5"
                title="Sign Out Player"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </Link>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
