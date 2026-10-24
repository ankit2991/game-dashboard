import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import {
  Gamepad2,
  Sparkles,
  Trophy,
  Gift,
  Search,
  Wallet,
  User,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  Flame,
  HelpCircle,
  Bell,
  Coins,
  LogOut,
  ExternalLink,
  Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export const B2CLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, updateBalance } = useAuth();
  const isPlayer = isAuthenticated && user?.role === 'player';
  const playerBalance = user?.walletBalance !== undefined ? user.walletBalance : 8420.50;
  const currency = user?.currency || 'MYR';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'All Games', path: '/games' },
    { label: 'Slots', path: '/games?category=slots' },
    { label: 'Crash & Arcade', path: '/games?category=arcade' },
    { label: 'Live Casino', path: '/games?category=live' },
    { label: 'Leaderboard', path: '/leaderboard' },
    { label: 'Promotions', path: '/promotions' },
  ];

  return (
    <div className="min-h-screen bg-[#0B1020] text-[#F5F7FF] flex flex-col font-sans selection:bg-[#7C5CFC] selection:text-white">
      {/* Top Promo Ticker */}
      <div className="bg-gradient-to-r from-[#182238] via-[#233252] to-[#182238] border-b border-[#2D3E66] px-3 sm:px-6 lg:px-8 py-1 sm:py-1.5 text-center text-xs overflow-hidden">
        <div className="w-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 mx-auto text-[10px] sm:text-xs truncate">
            <span className="flex items-center gap-1 text-[#FFB547] font-bold uppercase tracking-wider flex-shrink-0">
              <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FFB547] animate-pulse" /> Hot Event:
            </span>
            <span className="text-white font-medium truncate">
              Weekly $100,000 Multiplier Tournament Live on Pragmatic & Spribe Games!
            </span>
            <Link to="/promotions" className="text-[#00D4FF] hover:underline font-bold ml-1 hidden sm:inline flex-shrink-0">
              Claim Bonus →
            </Link>
          </div>

          <div className="hidden lg:flex items-center gap-3 text-[11px] text-[#98A5BF] flex-shrink-0">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#20C997]" /> Provably Fair & RNG Certified
            </span>
            <span className="text-[#2D3E66]">|</span>
            <span className="text-[#A885FF]">24/7 Live Support</span>
          </div>
        </div>
      </div>

      {/* Main Gaming Navbar */}
      <header className="border-b border-[#233252] bg-[#121A2D]/95 backdrop-blur-md sticky top-0 z-40 px-3 sm:px-6 lg:px-8">
        <div className="w-full h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
          {/* Left: Brand Logo & Navigation Links */}
          <div className="flex items-center gap-4 xl:gap-8 min-w-0 flex-shrink-0">
            <Link to="/" className="flex items-center gap-2 sm:gap-2.5 group flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#7C5CFC] via-[#6947eb] to-[#00D4FF] flex items-center justify-center font-bold text-white shadow-lg shadow-[#7C5CFC]/30 group-hover:scale-105 transition-transform flex-shrink-0">
                <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-black text-sm sm:text-xl text-white tracking-wider flex items-center gap-1 leading-none">
                  NEXUS <span className="text-[#00D4FF]">PLAY</span>
                </span>
                <span className="text-[9px] text-[#98A5BF] tracking-widest uppercase font-semibold mt-1 hidden sm:block">
                  Casino & Crash Hub
                </span>
              </div>
            </Link>

            {/* Segmented Nav Pill Strip (Desktop only) */}
            <nav className="hidden lg:flex items-center bg-[#182238]/70 p-1 rounded-xl border border-[#233252]/80 backdrop-blur-sm gap-0.5">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path || (link.path.includes('?') && location.pathname + location.search === link.path);
                return (
                  <Link
                    key={link.label}
                    to={link.path}
                    className={`h-8 px-3.5 flex items-center justify-center rounded-lg text-xs transition-all whitespace-nowrap font-medium ${
                      isActive
                        ? 'bg-[#7C5CFC] text-white font-bold shadow-md shadow-[#7C5CFC]/25'
                        : 'text-[#98A5BF] hover:text-white hover:bg-[#233252]'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: Search, Balance/Login, Profile Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
            {/* Search Input Bar (Desktop & Tablet only) */}
            <Link
              to="/games"
              className="h-10 px-3.5 w-44 xl:w-56 rounded-xl bg-[#182238] hover:bg-[#233252] text-[#98A5BF] hover:text-white border border-[#2D3E66] transition-all hidden md:flex items-center justify-between gap-2 text-xs group"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <Search className="w-3.5 h-3.5 text-[#64748B] group-hover:text-[#00D4FF] transition-colors flex-shrink-0" />
                <span className="text-[#64748B] text-xs truncate">Search 700+ games...</span>
              </div>
              <kbd className="hidden xl:inline-block text-[10px] bg-[#233252] px-1.5 py-0.5 rounded text-[#98A5BF] font-mono border border-[#2D3E66]">⌘K</kbd>
            </Link>

            {isPlayer ? (
              <div className="flex items-center gap-1.5 sm:gap-2.5">
                {/* Mobile Balance Pill (Compact, visible on < sm) */}
                <Link
                  to="/player/wallet"
                  className="h-8.5 sm:hidden px-2 rounded-lg bg-[#182238] border border-[#2D3E66] flex items-center gap-1.5 text-xs font-mono font-bold text-white select-none"
                  title="View Player Wallet"
                >
                  <Wallet className="w-3.5 h-3.5 text-[#20C997] flex-shrink-0" />
                  <span className="text-[11px] text-[#00D4FF]">8,420</span>
                </Link>

                {/* Mobile Quick Deposit Button (Visible on < sm) */}
                <Link to="/player/wallet" className="sm:hidden">
                  <button
                    className="h-8.5 px-2.5 rounded-lg bg-gradient-to-r from-[#00D4FF] to-[#00B4D8] hover:brightness-110 active:scale-95 text-[#0B1020] font-bold text-xs flex items-center gap-1 shadow-md shadow-[#00D4FF]/20 transition-all select-none"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Deposit</span>
                  </button>
                </Link>

                {/* Tablet & Desktop Unified Balance Capsule */}
                <div className="hidden sm:flex items-center bg-[#182238] border border-[#2D3E66] rounded-xl p-1 gap-1.5 shadow-sm">
                  <Link
                    to="/player/wallet"
                    className="flex items-center gap-2 px-2.5 py-0.5 hover:bg-[#233252] rounded-lg transition-colors group select-none"
                    title="View Player Wallet"
                  >
                    <div className="w-6 h-6 rounded-md bg-[#20C997]/15 text-[#20C997] flex items-center justify-center flex-shrink-0">
                      <Wallet className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col text-left justify-center">
                      <span className="text-[9px] text-[#98A5BF] uppercase tracking-wider font-semibold leading-none">Balance</span>
                      <span className="font-mono font-bold text-xs text-white group-hover:text-[#00D4FF] mt-0.5 leading-none">
                        <span className="text-[#00D4FF]">{currency}</span> {playerBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </Link>

                  <Link to="/player/wallet">
                    <button
                      className="h-8 px-3 rounded-lg bg-gradient-to-r from-[#00D4FF] to-[#00B4D8] hover:brightness-110 active:scale-95 text-[#0B1020] font-bold text-xs flex items-center gap-1 shadow-md shadow-[#00D4FF]/20 transition-all select-none"
                    >
                      <Plus className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Deposit</span>
                    </button>
                  </Link>
                </div>

                {/* Tablet & Desktop Player Profile Dropdown Button */}
                <div className="relative hidden sm:block">
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="h-10 px-2 sm:px-2.5 rounded-xl bg-[#182238] hover:bg-[#233252] border border-[#2D3E66] flex items-center gap-2 transition-colors select-none group"
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"}
                        alt="Player"
                        className="w-7 h-7 rounded-lg object-cover ring-1 ring-[#7C5CFC]/50"
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#20C997] ring-1 ring-[#182238]" />
                    </div>
                    <div className="hidden xl:flex flex-col text-left justify-center">
                      <span className="text-xs font-bold text-white group-hover:text-[#00D4FF] leading-none transition-colors">{user?.name || 'Raymond'}</span>
                      <span className="text-[9px] text-[#FFB547] font-semibold leading-none mt-0.5">{user?.vipTier || 'VIP 4'}</span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-[#98A5BF] group-hover:text-white transition-colors" />
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[#121A2D] border border-[#2D3E66] shadow-2xl p-2 z-50 text-xs animate-in fade-in zoom-in-95">
                      <div className="px-3 py-2 border-b border-[#233252]">
                        <p className="font-bold text-white">{user?.name || 'Raymond Chen'}</p>
                        <p className="text-[10px] text-[#00D4FF] font-mono truncate">{user?.email || 'raymond@nexus.io'}</p>
                        <span className="text-[10px] text-[#20C997] font-medium">{user?.vipTier || 'VIP Tier: Platinum Level 4'}</span>
                      </div>
                      <Link
                        to="/player/profile"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-[#98A5BF] hover:text-white hover:bg-[#182238]"
                      >
                        <User className="w-3.5 h-3.5" />
                        <span>My Account Overview</span>
                      </Link>
                      <Link
                        to="/player/wallet"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-[#98A5BF] hover:text-white hover:bg-[#182238]"
                      >
                        <Wallet className="w-3.5 h-3.5" />
                        <span>Deposit & Withdraw</span>
                      </Link>
                      <Link
                        to="/player/transactions"
                        onClick={() => setShowProfileMenu(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-[#98A5BF] hover:text-white hover:bg-[#182238]"
                      >
                        <Coins className="w-3.5 h-3.5" />
                        <span>Game Bets & History</span>
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setShowProfileMenu(false);
                          navigate('/');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[#FF5D73] hover:bg-[#FF5D73]/10 text-left transition-colors border-t border-[#233252] mt-1 pt-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out Player</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Logged Out Controls */
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Link to="/login">
                  <Button variant="outline" size="sm" className="h-8.5 sm:h-10 px-2.5 sm:px-4 rounded-xl text-xs font-semibold">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm" className="h-8.5 sm:h-10 px-3 sm:px-4 rounded-xl text-xs font-bold">Register</Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden h-8.5 w-8.5 sm:h-10 sm:w-10 flex items-center justify-center rounded-xl text-[#98A5BF] hover:text-white hover:bg-[#182238] border border-[#233252] flex-shrink-0"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#233252] py-4 px-2 space-y-3 animate-in slide-in-from-top-4 duration-200 bg-[#121A2D]">
            {/* Player Profile Header Card on Mobile */}
            {isPlayer && (
              <div className="p-3 rounded-2xl bg-[#182238] border border-[#2D3E66] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="relative flex-shrink-0">
                    <img
                      src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"}
                      alt="Player"
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-[#7C5CFC]/50"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#20C997] ring-2 ring-[#182238]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white leading-none">{user?.name || 'Raymond Chen'}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#FFB547]/20 text-[#FFB547] font-semibold font-mono leading-none">{user?.vipTier || 'VIP 4'}</span>
                    </div>
                    <span className="text-[10px] text-[#00D4FF] font-mono block mt-1 truncate max-w-[140px]">{user?.email || 'raymond@nexus.io'}</span>
                  </div>
                </div>

                <Link
                  to="/player/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-2.5 py-1.5 rounded-lg bg-[#233252] hover:bg-[#2D3E66] text-white text-xs font-semibold"
                >
                  View Profile
                </Link>
              </div>
            )}

            {/* Mobile Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />
              <input
                type="text"
                placeholder="Search slots, crash, live tables..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#182238] border border-[#2D3E66] text-xs text-white placeholder-[#64748B] outline-none focus:border-[#7C5CFC]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    navigate('/games');
                    setMobileMenuOpen(false);
                  }
                }}
              />
            </div>

            {/* Mobile Wallet Quick Action */}
            {isPlayer && (
              <div className="p-3 rounded-xl bg-[#182238] border border-[#2D3E66] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#20C997]/20 text-[#20C997] flex items-center justify-center">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#98A5BF] block leading-none">Total Balance</span>
                    <span className="text-xs font-mono font-bold text-white leading-none mt-1 block">
                      <span className="text-[#00D4FF]">{currency}</span> {playerBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <Link
                    to="/player/wallet"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-1.5 rounded-lg bg-[#00D4FF] hover:bg-[#00B4D8] text-[#0B1020] text-xs font-bold flex items-center gap-1 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Deposit</span>
                  </Link>
                </div>
              </div>
            )}

            {/* Nav Links Grid */}
            <div className="grid grid-cols-2 gap-1.5">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.label}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                      isActive
                        ? 'bg-[#7C5CFC] text-white font-bold'
                        : 'text-[#98A5BF] hover:text-white bg-[#182238]/60 hover:bg-[#182238]'
                    }`}
                  >
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Player Account Shortcuts */}
            {isPlayer && (
              <div className="pt-2 border-t border-[#233252]/80 flex items-center justify-between gap-2 text-xs">
                <Link
                  to="/player/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2 px-3 text-center rounded-xl bg-[#182238] text-[#98A5BF] hover:text-white border border-[#2D3E66]"
                >
                  My Profile
                </Link>
                <Link
                  to="/player/transactions"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 py-2 px-3 text-center rounded-xl bg-[#182238] text-[#98A5BF] hover:text-white border border-[#2D3E66]"
                >
                  Bet Ledger
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        <Outlet context={{ isLoggedIn: isPlayer, playerBalance, setPlayerBalance: updateBalance, currency }} />
      </main>

      {/* Footer */}
      <footer className="border-t border-[#233252] bg-[#121A2D] mt-20 pt-12 pb-8 px-6 text-xs text-[#98A5BF]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 pb-10 border-b border-[#233252]/80">
            {/* Col 1: Brand */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#7C5CFC] to-[#00D4FF] flex items-center justify-center font-bold text-white">
                  <Gamepad2 className="w-5 h-5 text-white" />
                </div>
                <span className="font-display font-bold text-lg text-white">NEXUS PLAY</span>
              </div>
              <p className="text-xs text-[#98A5BF] max-w-sm leading-relaxed">
                Premier online entertainment destination offering the highest RTP certified slots, instant crash games, and live dealer experiences powered by the Nexus Provider SaaS Engine.
              </p>
              <div className="flex items-center gap-2 pt-2">
                <span className="px-2.5 py-1 rounded-lg bg-[#182238] border border-[#2D3E66] text-white font-bold text-[11px]">18+ ONLY</span>
                <span className="px-2.5 py-1 rounded-lg bg-[#182238] border border-[#2D3E66] text-[#20C997] font-semibold text-[11px]">RNG CERTIFIED</span>
                <span className="px-2.5 py-1 rounded-lg bg-[#182238] border border-[#2D3E66] text-[#00D4FF] font-semibold text-[11px]">PROVABLY FAIR</span>
              </div>
            </div>

            {/* Col 2: Games */}
            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Games Hub</h4>
              <ul className="space-y-2">
                <li><Link to="/games?category=slots" className="hover:text-white transition-colors">Video Slots</Link></li>
                <li><Link to="/games?category=arcade" className="hover:text-white transition-colors">Aviator & Crash</Link></li>
                <li><Link to="/games?category=live" className="hover:text-white transition-colors">Live Dealer Roulette</Link></li>
                <li><Link to="/games?category=card" className="hover:text-white transition-colors">VIP Blackjack</Link></li>
                <li><Link to="/games" className="hover:text-white transition-colors">Jackpot Megaways</Link></li>
              </ul>
            </div>

            {/* Col 3: Promos */}
            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Community</h4>
              <ul className="space-y-2">
                <li><Link to="/promotions" className="hover:text-white transition-colors">Promotions & Bonuses</Link></li>
                <li><Link to="/leaderboard" className="hover:text-white transition-colors">VIP Leaderboard</Link></li>
                <li><Link to="/player/wallet" className="hover:text-white transition-colors">Deposit & Withdraw</Link></li>
                <li><Link to="/operator" className="text-[#00D4FF] hover:underline flex items-center gap-1">B2B Integration Portal <ExternalLink className="w-2.5 h-2.5" /></Link></li>
              </ul>
            </div>

            {/* Col 4: Responsible Gaming */}
            <div>
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Responsible Play</h4>
              <p className="text-[11px] text-[#64748B] leading-relaxed">
                Gambling can be addictive. Please play responsibly. Set deposit limits and never gamble with money you cannot afford to lose.
              </p>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#64748B]">
            <p>© 2026 Nexus Play Gaming Ltd. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-white">Terms of Service</a>
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Self Exclusion</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
