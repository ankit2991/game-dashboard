import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  Cpu,
  Gamepad2,
  KeyRound,
  ArrowLeftRight,
  BarChart3,
  Settings,
  Bell,
  Search,
  ChevronDown,
  Menu,
  X,
  ShieldCheck,
  LogOut,
  ExternalLink,
  Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [envMode, setEnvMode] = useState<'production' | 'staging' | 'sandbox'>('production');

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'User Management', path: '/admin/users', icon: Users, badge: '284K' },
    { label: 'Operator Management', path: '/admin/operators', icon: Building2, badge: '6 New' },
    { label: 'Game Providers', path: '/admin/providers', icon: Cpu, badge: '6' },
    { label: 'Game Management', path: '/admin/games', icon: Gamepad2, badge: '742' },
    { label: 'API Key Management', path: '/admin/api-keys', icon: KeyRound },
    { label: 'Transaction Central', path: '/admin/transactions', icon: ArrowLeftRight },
    { label: 'Reports & Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'System Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="h-screen bg-[#0B1020] text-[#F5F7FF] flex flex-col font-sans overflow-hidden">
      <div className="flex flex-1 overflow-hidden relative">
        {/* Fixed Desktop Sidebar */}
        <aside
          className={`hidden lg:flex flex-col border-r border-[#233252] bg-[#121A2D]/95 backdrop-blur-md transition-all duration-300 z-30 flex-shrink-0 h-full select-none ${
            sidebarCollapsed ? 'w-20' : 'w-64'
          }`}
        >
          {/* Brand Logo Header */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-[#233252]/80">
            <Link to="/admin" className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#7C5CFC] to-[#00D4FF] flex items-center justify-center font-bold text-white shadow-lg shadow-[#7C5CFC]/30 flex-shrink-0">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              {!sidebarCollapsed && (
                <div className="flex flex-col">
                  <span className="font-display font-bold text-sm tracking-wide text-white flex items-center gap-1.5">
                    NEXUS <span className="text-[10px] bg-[#7C5CFC]/20 text-[#A885FF] px-1.5 py-0.5 rounded border border-[#7C5CFC]/30">ADMIN</span>
                  </span>
                  <span className="text-[11px] text-[#98A5BF]">SaaS Provider Core</span>
                </div>
              )}
            </Link>

            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1 rounded-lg text-[#98A5BF] hover:text-white hover:bg-[#182238] transition-colors"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>

          {/* Environment Indicator Pill */}
          {!sidebarCollapsed && (
            <div className="px-4 pt-4">
              <div className="bg-[#182238] border border-[#233252] rounded-xl p-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${envMode === 'production' ? 'bg-[#20C997] animate-pulse' : 'bg-[#FFB547]'}`} />
                  <span className="font-medium text-[#98A5BF]">Environment:</span>
                </div>
                <select
                  value={envMode}
                  onChange={(e) => setEnvMode(e.target.value as any)}
                  className="bg-[#0B1020] text-xs font-semibold text-[#00D4FF] border border-[#2D3E66] rounded-lg px-2 py-1 outline-none cursor-pointer"
                >
                  <option value="production">Production</option>
                  <option value="staging">Staging</option>
                  <option value="sandbox">Sandbox</option>
                </select>
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
                      ? 'bg-gradient-to-r from-[#7C5CFC] to-[#6947eb] text-white shadow-lg shadow-[#7C5CFC]/20'
                      : 'text-[#98A5BF] hover:text-white hover:bg-[#182238]'
                  }`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-[#98A5BF] group-hover:text-[#00D4FF]'}`} />
                  {!sidebarCollapsed && (
                    <div className="flex items-center justify-between flex-1">
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-[#233252] text-[#A885FF]'
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

          {/* System Health Status Footer */}
          <div className="p-4 border-t border-[#233252]/80">
            {!sidebarCollapsed ? (
              <div className="bg-[#182238]/60 border border-[#233252] rounded-xl p-3">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-[#98A5BF] flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-[#20C997]" />
                    Engine Health
                  </span>
                  <span className="text-[#20C997] font-bold">99.98%</span>
                </div>
                <div className="w-full bg-[#0B1020] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-[#20C997] to-[#00D4FF] h-full w-[99.98%]" />
                </div>
                <p className="text-[10px] text-[#64748B] mt-1.5">Gateway cluster healthy</p>
              </div>
            ) : (
              <div className="flex justify-center" title="System 99.98% Healthy">
                <div className="w-3 h-3 rounded-full bg-[#20C997] animate-ping" />
              </div>
            )}
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <div className="relative w-72 bg-[#121A2D] border-r border-[#233252] flex flex-col p-4 z-10">
              <div className="flex items-center justify-between pb-4 border-b border-[#233252]">
                <div className="flex items-center gap-2 font-display font-bold text-white">
                  <ShieldCheck className="w-5 h-5 text-[#7C5CFC]" />
                  <span>NEXUS SUPER ADMIN</span>
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
                      location.pathname === item.path ? 'bg-[#7C5CFC] text-white' : 'text-[#98A5BF] hover:bg-[#182238] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && <span className="text-[10px] bg-[#233252] px-1.5 py-0.5 rounded text-[#A885FF]">{item.badge}</span>}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto">
          {/* Top Header Navbar */}
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
                  placeholder="Search operators, players, games, API keys..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0B1020] text-xs text-[#F5F7FF] placeholder-[#64748B] border border-[#233252] focus:border-[#7C5CFC] outline-none transition-all"
                />
              </div>
            </div>

            {/* Right: Quick Actions, Alerts, Admin User Profile */}
            <div className="flex items-center gap-3">
              {/* Notification Popover Toggle */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 rounded-xl bg-[#182238] hover:bg-[#233252] text-[#98A5BF] hover:text-white border border-[#233252] relative transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF5D73] ring-2 ring-[#121A2D]" />
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#121A2D] border border-[#2D3E66] shadow-2xl p-4 z-50 text-xs">
                    <div className="flex items-center justify-between pb-3 border-b border-[#233252]">
                      <span className="font-semibold text-white">System Alerts</span>
                      <span className="text-[10px] text-[#A885FF] cursor-pointer hover:underline">Mark all read</span>
                    </div>
                    <div className="space-y-3 mt-3">
                      <div className="p-2.5 rounded-xl bg-[#182238] border border-[#233252] flex items-start gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-[#FFB547] mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-white">Pending Operator Application</p>
                          <p className="text-[#98A5BF] text-[11px]">CyberTech Gaming Ventures submitted KYC papers.</p>
                          <span className="text-[10px] text-[#64748B]">12m ago</span>
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-[#182238] border border-[#233252] flex items-start gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-[#20C997] mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-white">Gateway Spike Absorbed</p>
                          <p className="text-[#98A5BF] text-[11px]">Pragmatic Nexus handled 1.8M req/hr cleanly.</p>
                          <span className="text-[10px] text-[#64748B]">45m ago</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Admin Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-[#182238] border border-transparent hover:border-[#233252] transition-all"
                >
                  <img
                    src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}
                    alt="Admin Avatar"
                    className="w-8 h-8 rounded-lg object-cover ring-2 ring-[#7C5CFC]/40"
                  />
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-semibold text-white">{user?.name || 'Alex Mercer'}</span>
                    <span className="text-[10px] text-[#A885FF] font-medium">Root Admin</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#98A5BF]" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#121A2D] border border-[#2D3E66] shadow-2xl p-2 z-50 text-xs">
                    <div className="px-3 py-2 border-b border-[#233252]">
                      <p className="font-semibold text-white truncate">{user?.email || 'alex.mercer@nexus-provider.io'}</p>
                      <p className="text-[10px] text-[#20C997]">Role: Super Administrator</p>
                    </div>
                    <Link
                      to="/admin/settings"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-[#98A5BF] hover:text-white hover:bg-[#182238]"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      <span>Security & Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[#FF5D73] hover:bg-[#FF5D73]/10 text-left transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out Admin</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Page View Slot */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};
