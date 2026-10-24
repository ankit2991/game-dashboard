import React, { useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  Gamepad2,
  CheckCircle,
  Zap,
  CheckCircle2,
  AlertTriangle,
  KeyRound,
  Coins,
  Layers,
  ArrowUpRight,
  TrendingUp,
  Download,
  ExternalLink,
  Code2,
  Play,
  Terminal,
  Server
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Card, CardHeader } from '../../../components/ui/Card';
import { StatCard } from '../../../components/ui/StatCard';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { mockGames, mockProviders } from '../../../data/mock/gamesData';
import { mockChartApiTraffic, mockChartProviderShare } from '../../../data/mock/adminData';

export const OperatorDashboard: React.FC = () => {
  const context = useOutletContext<{ environment: 'sandbox' | 'production' }>();
  const isSandbox = context?.environment === 'sandbox';

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#233252]/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-display text-white tracking-tight">
              Asia Gaming Network Ltd
            </h1>
            <Badge variant={isSandbox ? 'cyan' : 'success'} size="sm" dot>
              {isSandbox ? 'Sandbox Mode' : 'Production Live'}
            </Badge>
          </div>
          <p className="text-xs text-[#98A5BF] mt-1">
            Aggregator Portal • Account ID: <code className="text-[#00D4FF] font-mono">op_asia_gaming</code> • Protocol: Seamless Wallet v2
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/operator/docs">
            <Button variant="outline" size="sm" leftIcon={<Code2 className="w-3.5 h-3.5 text-[#00D4FF]" />}>
              API Reference
            </Button>
          </Link>
          <Link to="/operator/catalog">
            <Button variant="cyan" size="sm" leftIcon={<Gamepad2 className="w-3.5 h-3.5" />}>
              Add Games from Marketplace
            </Button>
          </Link>
        </div>
      </div>

      {/* 8 Operator Summary KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="p-3 rounded-xl bg-[#121A2D] border border-[#233252] lg:col-span-2">
          <span className="text-[10px] text-[#64748B] uppercase font-semibold">Available Catalog</span>
          <p className="text-xl font-bold text-white font-display mt-0.5">742</p>
          <span className="text-[10px] text-[#98A5BF]">Global Studio Games</span>
        </div>

        <div className="p-3 rounded-xl bg-[#121A2D] border border-[#233252] lg:col-span-2">
          <span className="text-[10px] text-[#64748B] uppercase font-semibold">My Active Titles</span>
          <p className="text-xl font-bold text-[#00D4FF] font-display mt-0.5">420</p>
          <span className="text-[10px] text-[#20C997]">Integrated & Live</span>
        </div>

        <div className="p-3 rounded-xl bg-[#121A2D] border border-[#233252] lg:col-span-2">
          <span className="text-[10px] text-[#64748B] uppercase font-semibold">Monthly API Calls</span>
          <p className="text-xl font-bold text-[#7C5CFC] font-display mt-0.5">42.9M</p>
          <span className="text-[10px] text-[#98A5BF]">99.94% Success Rate</span>
        </div>

        <div className="p-3 rounded-xl bg-[#121A2D] border border-[#233252] lg:col-span-2">
          <span className="text-[10px] text-[#64748B] uppercase font-semibold">GGR Turnover (GMV)</span>
          <p className="text-xl font-bold text-[#20C997] font-display mt-0.5">$18.45M</p>
          <span className="text-[10px] text-[#20C997]">↑ 19.4% This Month</span>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time API Traffic */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Inbound Game Launch & Wallet Callbacks"
            subtitle="Request throughput over 24 hours"
            action={<Badge variant="cyan" size="sm" dot>Live WebSocket</Badge>}
          />
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartApiTraffic} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="opColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00D4FF" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#233252" opacity={0.6} />
                <XAxis dataKey="time" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#121A2D',
                    borderColor: '#2D3E66',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />
                <Area type="monotone" dataKey="requests" stroke="#00D4FF" strokeWidth={2.5} fillOpacity={1} fill="url(#opColor)" name="API Calls" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Studio Share Donut */}
        <Card>
          <CardHeader
            title="Provider Volume Breakdown"
            subtitle="Share of player sessions by studio"
          />
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockChartProviderShare}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {mockChartProviderShare.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#121A2D',
                    borderColor: '#2D3E66',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1 pt-1 text-xs">
            {mockChartProviderShare.slice(0, 3).map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[#98A5BF]">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-semibold text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Two Column Grid: Top Games for this Operator & Recent API Gateway Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Played Games on Operator White-Labels */}
        <Card>
          <CardHeader
            title="Your Top Performing Games"
            subtitle="Highest grossing titles distributed across your portals"
            action={
              <Link to="/operator/my-games" className="text-xs text-[#00D4FF] hover:underline font-semibold">
                Manage Integrated (420) →
              </Link>
            }
          />

          <div className="space-y-2.5">
            {mockGames.slice(0, 4).map((game) => (
              <div
                key={game.id}
                className="p-3 rounded-xl bg-[#121A2D] border border-[#233252] flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={game.thumbnail}
                    alt={game.title}
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-[#2D3E66]"
                  />
                  <div className="min-w-0">
                    <p className="font-semibold text-white text-xs truncate">{game.title}</p>
                    <p className="text-[11px] text-[#98A5BF] truncate">{game.providerName} • RTP: {game.rtp}%</p>
                  </div>
                </div>

                <Badge variant="success" size="sm">Active Live</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Integration Activity Feed */}
        <Card>
          <CardHeader
            title="Recent API Handshakes & Callbacks"
            subtitle="Real-time request log for session tokens"
            action={
              <Link to="/operator/logs" className="text-xs text-[#00D4FF] hover:underline font-semibold">
                View Full Logs →
              </Link>
            }
          />

          <div className="space-y-2.5 text-xs">
            <div className="p-2.5 rounded-xl bg-[#121A2D] border border-[#233252] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[#20C997] font-bold">200 OK</span>
                <span className="text-white font-mono">POST /v1/games/launch</span>
              </div>
              <span className="text-[#98A5BF]">41ms • Just now</span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#121A2D] border border-[#233252] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[#20C997] font-bold">200 OK</span>
                <span className="text-white font-mono">POST /v1/wallet/bet</span>
              </div>
              <span className="text-[#98A5BF]">36ms • 12s ago</span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#121A2D] border border-[#233252] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[#20C997] font-bold">200 OK</span>
                <span className="text-white font-mono">POST /v1/wallet/win</span>
              </div>
              <span className="text-[#98A5BF]">39ms • 45s ago</span>
            </div>

            <div className="p-2.5 rounded-xl bg-[#121A2D] border border-[#233252] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[#00D4FF] font-bold">200 OK</span>
                <span className="text-white font-mono">GET /v1/catalog/games</span>
              </div>
              <span className="text-[#98A5BF]">58ms • 2m ago</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
