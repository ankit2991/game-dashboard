import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  Coins,
  Building2,
  Users,
  Gamepad2,
  CheckCircle2,
  ArrowUpRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { Card, CardHeader } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { mockChartMonthlyGrowth, mockChartApiTraffic } from '../../../data/mock/adminData';

export const AnalyticsReports: React.FC = () => {
  const [activeReport, setActiveReport] = useState<'financial' | 'operators' | 'providers' | 'games'>('financial');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-14 right-6 z-50 bg-[#20C997] text-[#0B1020] px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#233252]/60">
        <div>
          <h1 className="text-2xl font-bold font-display text-white tracking-tight flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-[#7C5CFC]" />
            Platform Financial Analytics & Reports
          </h1>
          <p className="text-xs text-[#98A5BF] mt-1">
            Aggregated gross gaming revenue (GGR), take-rate commission margins, and operator volume trends.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="cyan"
            size="sm"
            leftIcon={<Download className="w-3.5 h-3.5" />}
            onClick={() => showToast('Financial snapshot CSV generated.')}
          >
            Export Comprehensive Report
          </Button>
        </div>
      </div>

      {/* Report Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto text-xs pb-1">
        {(['financial', 'operators', 'providers', 'games'] as const).map((r) => (
          <button
            key={r}
            onClick={() => setActiveReport(r)}
            className={`px-4 py-2 rounded-xl capitalize font-semibold transition-all whitespace-nowrap ${
              activeReport === r
                ? 'bg-[#7C5CFC] text-white shadow-md shadow-[#7C5CFC]/20'
                : 'bg-[#121A2D] text-[#98A5BF] hover:text-white hover:bg-[#182238] border border-[#233252]'
            }`}
          >
            {r} Performance
          </button>
        ))}
      </div>

      {/* Main Bar Chart: Monthly GMV Growth */}
      <Card>
        <CardHeader
          title="Monthly Platform GMV & Turnover ($ Millions)"
          subtitle="Gross turnover trend across all connected B2B operators (May - Oct 2026)"
          action={<Badge variant="purple" size="sm">+75% YoY Growth</Badge>}
        />
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockChartMonthlyGrowth} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#233252" opacity={0.6} />
              <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
              <YAxis stroke="#64748B" fontSize={11} tickFormatter={(val) => `$${(val / 1000000).toFixed(0)}M`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#121A2D',
                  borderColor: '#2D3E66',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
                formatter={(val: any) => [`$${(val / 1000000).toFixed(2)}M`, 'GMV Volume']}
              />
              <Bar dataKey="gmv" fill="#7C5CFC" radius={[8, 8, 0, 0]} name="Gross Turn" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Secondary Two-column Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader
            title="Player Registration Momentum"
            subtitle="Cumulative active registered player growth curve"
          />
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartMonthlyGrowth} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPlayers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00D4FF" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#233252" opacity={0.6} />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#121A2D',
                    borderColor: '#2D3E66',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />
                <Area type="monotone" dataKey="players" stroke="#00D4FF" strokeWidth={2.5} fillOpacity={1} fill="url(#colorPlayers)" name="Total Players" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Commercial Operator Growth"
            subtitle="Licensed operators utilizing the Nexus Provider API"
          />
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockChartMonthlyGrowth} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#233252" opacity={0.6} />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#121A2D',
                    borderColor: '#2D3E66',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                />
                <Bar dataKey="operators" fill="#20C997" radius={[6, 6, 0, 0]} name="Active Operators" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};
