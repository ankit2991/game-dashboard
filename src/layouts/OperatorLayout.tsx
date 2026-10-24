import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import {
  Building2,
  LayoutDashboard,
  Gamepad2,
  CheckCircle,
  KeyRound,
  FileCode2,
  Terminal,
  ArrowLeftRight,
  Webhook,
  Users,
  Bell,
  Search,
  ChevronDown,
  Menu,
  X,
  ExternalLink,
  LogOut,
  Sparkles,
  BookOpen,
  Code2,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export const OperatorLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showCompanyMenu, setShowCompanyMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [environment, setEnvironment] = useState<'sandbox' | 'production'>('production');

  const navItems = [
    { label: 'Overview', path: '/operator/dashboard', icon: LayoutDashboard },
    { label: 'Game Marketplace', path: '/operator/catalog', icon: Gamepad2, badge: '742' },
    { label: 'My Integrated Games', path: '/operator/my-games', icon: CheckCircle, badge: '420' },
    { label: 'API Credentials', path: '/operator/credentials', icon: KeyRound },
    { label: 'Developer API Docs', path: '/operator/docs', icon: FileCode2, highlight: true },
    { label: 'Integration Logs', path: '/operator/logs', icon: Terminal },
    { label: 'Transactions & GGR', path: '/operator/transactions', icon: ArrowLeftRight },
    { label: 'Webhooks', path: '/operator/webhooks', icon: Webhook },
    { label: 'Team Members', path: '/operator/team', icon: Users },
  ];

  return (
    <div className="h-screen bg-[#0B1020] text-[#F5F7FF] flex flex-col font-sans overflow-hidden">
      <div className="flex flex-1 overflow-hidden relative">
        {/* Fixed Desktop Sidebar (Non-scrolling with page) */}
        <aside
          className={`hidden lg:flex flex-col border-r border-[#233252] bg-[#121A2D]/95 backdrop-blur-md transition-all duration-300 z-30 flex-shrink-0 h-full select-none ${
            sidebarCollapsed ? 'w-20' : 'w-64'
          }`}
        >
          {/* Brand Header */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-[#233252]/80">
            <Link to="/operator/dashboard" className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#00D4FF] to-[#7C5CFC] flex items-center justify-center font-bold text-[#0B1020] shadow-lg shadow-[#00D4FF]/25 flex-shrink-0">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              {!sidebarCollapsed && (
                <div className="flex flex-col">
                  <span className="font-display font-bold text-sm tracking-wide text-white flex items-center gap-1.5">
                    NEXUS <span className="text-[10px] bg-[#00D4FF]/20 text-[#00D4FF] px-1.5 py-0.5 rounded border border-[#00D4FF]/30">OPERATOR</span>
                  </span>
                  <span className="text-[11px] text-[#98A5BF]">B2B Partner Portal</span>
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

          {/* Active Company Selector */}
          {!sidebarCollapsed && (
            <div className="px-4 pt-4">
              <div className="bg-[#182238] border border-[#233252] rounded-xl p-2.5">
                <span className="text-[10px] uppercase font-semibold text-[#64748B] block">Licensed Operator</span>
                <div className="flex items-center justify-between mt-1">
                  <div className="min-w-0">
                    <p className="font-semibold text-white text-xs truncate">{user?.companyName || 'Asia Gaming Network Ltd'}</p>
                    <span className="text-[10px] text-[#20C997] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#20C997]" /> Tier 1 Aggregator
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-[#00D4FF] to-[#00b8de] text-[#0B1020] font-bold shadow-lg shadow-[#00D4FF]/20'
                      : 'text-[#98A5BF] hover:text-white hover:bg-[#182238]'
                  }`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-[#0B1020]' : item.highlight ? 'text-[#00D4FF]' : 'text-[#98A5BF] group-hover:text-white'}`} />
                  {!sidebarCollapsed && (
                    <div className="flex items-center justify-between flex-1">
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                            isActive
                              ? 'bg-black/20 text-[#0B1020]'
                              : 'bg-[#233252] text-[#00D4FF]'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Quick API Docs Card in Sidebar */}
          {!sidebarCollapsed && (
            <div className="p-4 border-t border-[#233252]/80">
              <div className="bg-gradient-to-br from-[#7C5CFC]/20 to-[#00D4FF]/10 border border-[#7C5CFC]/30 rounded-xl p-3">
                <div className="flex items-center gap-2 mb-1 text-white font-semibold text-xs">
                  <Code2 className="w-4 h-4 text-[#00D4FF]" />
                  <span>REST & WebSocket APIs</span>
                </div>
                <p className="text-[11px] text-[#98A5BF]">SDKs ready for Node, PHP, Python & cURL.</p>
                <Link
                  to="/operator/docs"
                  className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-bold text-[#00D4FF] hover:underline"
                >
                  Explore API Reference →
                </Link>
              </div>
            </div>
          )}
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <div className="relative w-72 bg-[#121A2D] border-r border-[#233252] flex flex-col p-4 z-10">
              <div className="flex items-center justify-between pb-4 border-b border-[#233252]">
                <div className="flex items-center gap-2 font-display font-bold text-white">
                  <Building2 className="w-5 h-5 text-[#00D4FF]" />
                  <span>OPERATOR PORTAL</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1 rounded-lg text-[#98A5BF]">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 space-y-1.5 py-4 overflow-y-auto">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium ${
                      location.pathname === item.path ? 'bg-[#00D4FF] text-[#0B1020] font-bold' : 'text-[#98A5BF] hover:bg-[#182238] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && <span className="text-[10px] bg-[#233252] px-1.5 py-0.5 rounded text-[#00D4FF]">{item.badge}</span>}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Main Scrolling Content Area */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
          {/* Top Navbar */}
          <header className="h-16 border-b border-[#233252] bg-[#121A2D]/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-20 flex-shrink-0">
            {/* Left: Mobile hamburger & Search */}
            <div className="flex items-center gap-3 flex-1 max-w-lg">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-xl text-[#98A5BF] hover:text-white hover:bg-[#182238]"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="relative w-full max-w-sm hidden sm:block">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
                <input
                  type="text"
                  placeholder="Search catalog games, API keys, logs..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0B1020] text-xs text-[#F5F7FF] placeholder-[#64748B] border border-[#233252] focus:border-[#00D4FF] outline-none transition-all"
                />
              </div>
            </div>

            {/* Right: Environment Selector, Docs shortcut, Operator Profile */}
            <div className="flex items-center gap-3">
              {/* Interactive Environment Toggle */}
              <div className="bg-[#0B1020] p-1 rounded-xl border border-[#233252] flex items-center gap-1 text-xs">
                <button
                  onClick={() => setEnvironment('production')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    environment === 'production'
                      ? 'bg-[#20C997] text-[#0B1020] shadow-sm'
                      : 'text-[#98A5BF] hover:text-white'
                  }`}
                >
                  ● Production
                </button>
                <button
                  onClick={() => setEnvironment('sandbox')}
                  className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                    environment === 'sandbox'
                      ? 'bg-[#00D4FF] text-[#0B1020] shadow-sm'
                      : 'text-[#98A5BF] hover:text-white'
                  }`}
                >
                  ⚡ Sandbox
                </button>
              </div>

              {/* API Docs Button */}
              <Link
                to="/operator/docs"
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#182238] hover:bg-[#233252] text-[#00D4FF] text-xs font-semibold border border-[#2D3E66] transition-all"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>API Docs</span>
              </Link>

              {/* Operator Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-[#182238] border border-transparent hover:border-[#233252] transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#00D4FF] to-[#7C5CFC] flex items-center justify-center font-bold text-xs text-white">
                    {user?.name ? user.name.slice(0, 2).toUpperCase() : 'AG'}
                  </div>
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-semibold text-white">{user?.name || 'Daniel Tan'}</span>
                    <span className="text-[10px] text-[#00D4FF] truncate max-w-[120px]">{user?.companyName || 'Asia Gaming Ltd'}</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#98A5BF]" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#121A2D] border border-[#2D3E66] shadow-2xl p-2 z-50 text-xs">
                    <div className="px-3 py-2 border-b border-[#233252]">
                      <p className="font-semibold text-white truncate">{user?.email || 'd.tan@asiagaming.net'}</p>
                      <p className="text-[10px] text-[#20C997]">Account Status: Licensed & Active</p>
                    </div>
                    <Link
                      to="/operator/credentials"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-[#98A5BF] hover:text-white hover:bg-[#182238]"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>API Keys & Secrets</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        navigate('/operator/login');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[#FF5D73] hover:bg-[#FF5D73]/10 text-left transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Content Slot */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            <Outlet context={{ environment }} />
          </main>
        </div>
      </div>
    </div>
  );
};
