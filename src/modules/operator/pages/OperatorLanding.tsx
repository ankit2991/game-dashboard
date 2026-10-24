import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Gamepad2,
  Cpu,
  Zap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileCode2,
  Layers,
  Sparkles,
  Server,
  Lock,
  Globe,
  Coins
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { mockProviders, mockGames } from '../../../data/mock/gamesData';

export const OperatorLanding: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0B1020] text-[#F5F7FF] flex flex-col font-sans relative selection:bg-[#00D4FF] selection:text-[#0B1020]">
      {/* Top Navigation */}
      <header className="border-b border-[#233252]/80 bg-[#121A2D]/80 backdrop-blur-md sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/operator" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#00D4FF] to-[#7C5CFC] flex items-center justify-center font-bold text-[#0B1020] shadow-lg shadow-[#00D4FF]/25">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-display font-bold text-lg text-white tracking-wide">
                NEXUS <span className="text-[#00D4FF]">PROVIDER</span>
              </span>
              <span className="text-[10px] text-[#98A5BF] block -mt-1">B2B Game Aggregation Gateway</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-[#98A5BF]">
            <a href="#benefits" className="hover:text-white transition-colors">Why Nexus</a>
            <a href="#providers" className="hover:text-white transition-colors">Studio Partners</a>
            <a href="#workflow" className="hover:text-white transition-colors">Integration Flow</a>
            <Link to="/operator/docs" className="hover:text-[#00D4FF] transition-colors flex items-center gap-1">
              <span>API Reference</span>
              <Badge variant="cyan" size="sm">v1.0</Badge>
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/operator/login">
              <Button variant="outline" size="sm">Operator Login</Button>
            </Link>
            <Link to="/operator/register">
              <Button variant="cyan" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Register Company
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-[#7C5CFC]/20 to-[#00D4FF]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <Badge variant="cyan" size="md" className="mb-4 shadow-lg shadow-[#00D4FF]/10">
            ⚡ Next-Gen Aggregator Gateway for Licensed iGaming Brands
          </Badge>

          <h1 className="text-4xl sm:text-6xl font-bold font-display tracking-tight text-white leading-tight">
            One Unified API. <br />
            <span className="bg-gradient-to-r from-[#00D4FF] via-[#A885FF] to-[#7C5CFC] bg-clip-text text-transparent">
              Multiple World-Class Game Studios.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[#98A5BF] max-w-2xl mx-auto mt-5 leading-relaxed">
            Eliminate individual studio integrations. Connect your casino, sportsbook, or white-label portal to 700+ certified slots, crash games, and live dealer feeds through a single seamless wallet callback protocol.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3.5 mt-8">
            <Link to="/operator/register">
              <Button variant="cyan" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Start Instant Sandbox Integration
              </Button>
            </Link>
            <Link to="/operator/dashboard">
              <Button variant="outline" size="lg">
                Explore Demo Operator Dashboard
              </Button>
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mt-14 pt-8 border-t border-[#233252]/60">
            <div>
              <p className="text-2xl font-bold text-white font-display">740+</p>
              <span className="text-xs text-[#98A5BF]">Aggregated Titles</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#00D4FF] font-display">42 ms</p>
              <span className="text-xs text-[#98A5BF]">Average Game Launch</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#20C997] font-display">99.99%</p>
              <span className="text-xs text-[#98A5BF]">Platform SLA Uptime</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#A885FF] font-display">12+ Currencies</p>
              <span className="text-xs text-[#98A5BF]">Fiat & USDT Settled</span>
            </div>
          </div>
        </div>
      </section>

      {/* Studio Providers Carousel Bar */}
      <section id="providers" className="py-10 border-y border-[#233252]/80 bg-[#121A2D]/60">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-[#98A5BF] mb-6">
            Integrated Upstream Studios Ready for Instant Distribution
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {mockProviders.map((prov) => (
              <div
                key={prov.id}
                className="p-3.5 rounded-2xl bg-[#182238]/70 border border-[#233252] flex flex-col items-center text-center hover:border-[#00D4FF]/40 transition-all hover:scale-105"
              >
                <img
                  src={prov.logo}
                  alt={prov.name}
                  className="w-12 h-12 rounded-xl object-cover mb-2 border border-[#2D3E66]"
                />
                <span className="font-semibold text-white text-xs truncate w-full">{prov.name}</span>
                <span className="text-[10px] text-[#00D4FF] mt-0.5">{prov.totalGames} Games</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Benefits */}
      <section id="benefits" className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="purple" size="md">Architecture & Advantage</Badge>
          <h2 className="text-3xl font-bold font-display text-white mt-3">
            Engineered for High-Concurrence Gaming Portals
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-[#182238]/60 border border-[#233252] hover:border-[#7C5CFC]/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#7C5CFC]/15 border border-[#7C5CFC]/30 flex items-center justify-center text-[#A885FF] mb-4">
              <Coins className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-base font-display">Seamless Wallet Protocol</h3>
            <p className="text-xs text-[#98A5BF] mt-2 leading-relaxed">
              No deposit transfers required. Keep player balances in your own database; Nexus securely checks balance, places bets, and credits wins in real-time.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#182238]/60 border border-[#233252] hover:border-[#00D4FF]/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#00D4FF]/15 border border-[#00D4FF]/30 flex items-center justify-center text-[#00D4FF] mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-base font-display">Single API Game Launch</h3>
            <p className="text-xs text-[#98A5BF] mt-2 leading-relaxed">
              A single REST call creates a temporary secure token and returns an embeddable mobile-first iframe URL for all 700+ games.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#182238]/60 border border-[#233252] hover:border-[#20C997]/40 transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#20C997]/15 border border-[#20C997]/30 flex items-center justify-center text-[#20C997] mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-white text-base font-display">Enterprise SLA & Redundancy</h3>
            <p className="text-xs text-[#98A5BF] mt-2 leading-relaxed">
              Multi-region edge clusters across Asia, Europe, and Americas prevent game lag and absorb sudden viral jackpot spikes.
            </p>
          </div>
        </div>
      </section>

      {/* Integration Workflow */}
      <section id="workflow" className="py-16 px-6 bg-[#121A2D]/50 border-t border-[#233252]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="cyan" size="md">3-Step Integration Flow</Badge>
            <h2 className="text-3xl font-bold font-display text-white mt-3">From Registration to Live Games in 24 Hours</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div className="p-6 rounded-2xl bg-[#0B1020] border border-[#233252]">
              <span className="text-3xl font-bold font-display text-[#00D4FF]">01</span>
              <h4 className="font-bold text-white text-sm mt-2">Provision API Credentials</h4>
              <p className="text-xs text-[#98A5BF] mt-1.5">
                Register company profile, generate Sandbox keys instantly, and test game launches with simulated credits.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0B1020] border border-[#233252]">
              <span className="text-3xl font-bold font-display text-[#7C5CFC]">02</span>
              <h4 className="font-bold text-white text-sm mt-2">Hook Up Wallet Callback</h4>
              <p className="text-xs text-[#98A5BF] mt-1.5">
                Implement 3 endpoints: <code className="text-[#A885FF]">/balance</code>, <code className="text-[#A885FF]">/bet</code>, and <code className="text-[#A885FF]">/win</code> using our SDKs.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0B1020] border border-[#233252]">
              <span className="text-3xl font-bold font-display text-[#20C997]">03</span>
              <h4 className="font-bold text-white text-sm mt-2">Go Live in Production</h4>
              <p className="text-xs text-[#98A5BF] mt-1.5">
                Pass automated webhook validation, submit KYC for compliance signoff, and receive your live production keys.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/operator/register">
              <Button variant="cyan" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Create Free Operator Sandbox Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#233252] bg-[#0B1020] py-8 px-6 text-xs text-[#98A5BF]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-display font-bold text-white">
            <Building2 className="w-4 h-4 text-[#00D4FF]" />
            <span>NEXUS OPERATOR SAAS PLATFORM</span>
          </div>
          <p>© 2026 Nexus Provider Aggregation Technologies. Licensed iGaming SaaS.</p>
        </div>
      </footer>
    </div>
  );
};
