import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Building2,
  Gamepad2,
  Cpu,
  Activity,
  Layers,
  Coins,
  CheckCircle,
  Clock,
  Download,
  ChevronRight,
  Server,
  Zap,
  AlertTriangle
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
import { Modal } from '../../../components/ui/Modal';
import {
  mockAdminMetrics,
  mockChartApiTraffic,
  mockChartProviderShare,
  mockOperators,
  mockActivityLogs
} from '../../../data/mock/adminData';
import { mockGames } from '../../../data/mock/gamesData';
import type { Operator } from '../../../types';

export const AdminDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'today' | '7d' | '30d' | 'ytd'>('today');
  const [selectedOperatorForReview, setSelectedOperatorForReview] = useState<Operator | null>(null);
  const [reviewActionSuccess, setReviewActionSuccess] = useState<string | null>(null);
  const [operatorsList, setOperatorsList] = useState<Operator[]>(mockOperators);

  // Filter pending operators
  const pendingOperators = operatorsList.filter((op) => op.approvalStatus === 'pending');

  const handleApproveOperator = (opId: string) => {
    setOperatorsList((prev) =>
      prev.map((op) => (op.id === opId ? { ...op, approvalStatus: 'approved', accountStatus: 'active' } : op))
    );
    setReviewActionSuccess(`Operator application for ${selectedOperatorForReview?.companyName} APPROVED successfully!`);
    setTimeout(() => {
      setSelectedOperatorForReview(null);
      setReviewActionSuccess(null);
    }, 1500);
  };

  const handleRejectOperator = (opId: string) => {
    setOperatorsList((prev) =>
      prev.map((op) => (op.id === opId ? { ...op, approvalStatus: 'rejected', accountStatus: 'disabled' } : op))
    );
    setReviewActionSuccess(`Operator application for ${selectedOperatorForReview?.companyName} REJECTED.`);
    setTimeout(() => {
      setSelectedOperatorForReview(null);
      setReviewActionSuccess(null);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#233252]/60">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-display text-white tracking-tight">Super Admin Master Overview</h1>
            <Badge variant="success" size="sm" dot>Nexus v2.4 Live</Badge>
          </div>
          <p className="text-xs text-[#98A5BF] mt-1">
            Real-time telemetry across 6 upstream game providers, 148 licensed operators, and player sessions.
          </p>
        </div>

        {/* Time Filter Controls & Export */}
        <div className="flex items-center gap-2">
          <div className="bg-[#121A2D] p-1 rounded-xl border border-[#233252] flex items-center gap-1 text-xs">
            {(['today', '7d', '30d', 'ytd'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimeRange(period)}
                className={`px-3 py-1.5 rounded-lg font-medium uppercase transition-all ${
                  timeRange === period
                    ? 'bg-[#7C5CFC] text-white shadow-sm'
                    : 'text-[#98A5BF] hover:text-white hover:bg-[#182238]'
                }`}
              >
                {period}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-3.5 h-3.5" />}
            onClick={() => alert('Simulated CSV summary report downloaded.')}
          >
            Export Snapshot
          </Button>
        </div>
      </div>

      {/* 12 Master KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3.5">
        <StatCard
          title="Total Players"
          value={mockAdminMetrics.totalPlayers.toLocaleString()}
          change="+14.2%"
          trend="up"
          icon={<Users className="w-4 h-4" />}
          accentColor="purple"
          subtitle="Registered accounts"
        />

        <StatCard
          title="Active Today"
          value={mockAdminMetrics.activePlayersToday.toLocaleString()}
          change="+8.9%"
          trend="up"
          icon={<Activity className="w-4 h-4" />}
          accentColor="cyan"
          subtitle="Concurrent sessions"
        />

        <StatCard
          title="B2B Operators"
          value={mockAdminMetrics.totalOperators}
          change="+6 pending"
          trend="neutral"
          icon={<Building2 className="w-4 h-4" />}
          accentColor="emerald"
          subtitle="Commercial partners"
        />

        <StatCard
          title="Pending Approvals"
          value={pendingOperators.length}
          change={pendingOperators.length > 0 ? "Requires Review" : "Clear"}
          trend={pendingOperators.length > 0 ? "down" : "up"}
          icon={<Clock className="w-4 h-4" />}
          accentColor="amber"
          subtitle="KYC applications"
        />

        <StatCard
          title="Available Games"
          value={mockAdminMetrics.totalAvailableGames}
          change="+18 this week"
          trend="up"
          icon={<Gamepad2 className="w-4 h-4" />}
          accentColor="purple"
          subtitle="Aggregated catalog"
        />

        <StatCard
          title="Active Providers"
          value={`${mockAdminMetrics.activeGameProviders} / 6`}
          change="100% Up"
          trend="up"
          icon={<Cpu className="w-4 h-4" />}
          accentColor="cyan"
          subtitle="Tier-1 Studio Feeds"
        />

        <StatCard
          title="API Volume Today"
          value="14.82M"
          change="+22.4%"
          trend="up"
          icon={<Zap className="w-4 h-4" />}
          accentColor="purple"
          subtitle="Inbound requests"
        />

        <StatCard
          title="Success Rate"
          value={`${mockAdminMetrics.apiSuccessRate}%`}
          change="Optimal"
          trend="up"
          icon={<CheckCircle className="w-4 h-4" />}
          accentColor="emerald"
          subtitle="Response latency 42ms"
        />

        <StatCard
          title="Failed Requests"
          value="17,785"
          change="0.12% error"
          trend="down"
          icon={<AlertTriangle className="w-4 h-4" />}
          accentColor="rose"
          subtitle="Handled by retries"
        />

        <StatCard
          title="Total GMV Volume"
          value={`$${(mockAdminMetrics.totalGmv / 1000000).toFixed(1)}M`}
          change="+18.5%"
          trend="up"
          icon={<Coins className="w-4 h-4" />}
          accentColor="amber"
          subtitle="Gross bets wagered"
        />

        <StatCard
          title="Platform Rev (~3%)"
          value={`$${(mockAdminMetrics.platformRevenue / 1000).toFixed(0)}K`}
          change="+21.0%"
          trend="up"
          icon={<Layers className="w-4 h-4" />}
          accentColor="cyan"
          subtitle="SaaS fee & rev-share"
        />

        <StatCard
          title="System Health"
          value={`${mockAdminMetrics.systemHealthPercent}%`}
          change="Nominal"
          trend="up"
          icon={<Server className="w-4 h-4" />}
          accentColor="emerald"
          subtitle="4 Edge regions"
        />
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* API Requests & Latency Over Time Area Chart */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Real-Time API Traffic & Latency Curve"
            subtitle="Request volume (blue) vs gateway latency (purple) over 24 hours"
            action={
              <Badge variant="cyan" size="sm" dot>Live Telemetry</Badge>
            }
          />
          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockChartApiTraffic} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C5CFC" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#7C5CFC" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3} />
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
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="requests" stroke="#7C5CFC" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRequests)" name="API Requests" />
                <Area type="monotone" dataKey="latency" stroke="#00D4FF" strokeWidth={2} fillOpacity={1} fill="url(#colorLatency)" name="Latency (ms)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between pt-4 border-t border-[#233252]/60 text-xs text-[#98A5BF]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#7C5CFC]" /> API Requests/hr</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#00D4FF]" /> Average Latency (ms)</span>
            </div>
            <span className="text-[#20C997] font-semibold">Peak: 1.82M req/hr at 21:00</span>
          </div>
        </Card>

        {/* Provider GMV Share Donut */}
        <Card>
          <CardHeader
            title="Provider Market Share"
            subtitle="GGR distribution by upstream game provider"
          />
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockChartProviderShare}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
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
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [`${val}% of total volume`, 'Volume Share']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-[#233252]/60 text-xs">
            {mockChartProviderShare.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-[#98A5BF]">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-semibold text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Two Column Grid: Pending Operator Applications & Top Games */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Operator Applications Widget */}
        <Card>
          <CardHeader
            title="Pending Operator Approvals"
            subtitle={`${pendingOperators.length} organizations awaiting compliance verification`}
            action={
              <Link to="/admin/operators" className="text-xs text-[#7C5CFC] hover:underline flex items-center gap-1 font-semibold">
                <span>View All Operators</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            }
          />

          {pendingOperators.length === 0 ? (
            <div className="text-center py-8 text-xs text-[#98A5BF]">
              <CheckCircle className="w-8 h-8 text-[#20C997] mx-auto mb-2 opacity-60" />
              <p>All operator applications have been processed!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingOperators.map((op) => (
                <div
                  key={op.id}
                  className="p-3.5 rounded-xl bg-[#121A2D] border border-[#233252] hover:border-[#7C5CFC]/40 transition-all flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-sm truncate">{op.companyName}</span>
                      <Badge variant="warning" size="sm">KYC Pending</Badge>
                    </div>
                    <p className="text-xs text-[#98A5BF] mt-0.5 truncate">
                      {op.contactPerson} • {op.email} • {op.country}
                    </p>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      Type: <span className="text-[#A885FF]">{op.businessType}</span> • Reg: {op.registeredAt}
                    </p>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setSelectedOperatorForReview(op)}
                  >
                    Review
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Top Performing Games List */}
        <Card>
          <CardHeader
            title="Top Performing Games"
            subtitle="Ranked by total play sessions & operator integration count"
            action={
              <Link to="/admin/games" className="text-xs text-[#7C5CFC] hover:underline flex items-center gap-1 font-semibold">
                <span>Game Manager</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            }
          />

          <div className="space-y-3">
            {mockGames.slice(0, 4).map((game, index) => (
              <div
                key={game.id}
                className="p-3 rounded-xl bg-[#121A2D] border border-[#233252] flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-[#182238] border border-[#2D3E66] font-display font-bold text-xs flex items-center justify-center text-[#00D4FF] flex-shrink-0">
                    #{index + 1}
                  </div>
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

                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-bold text-[#20C997]">
                    {(game.playCount / 1000000).toFixed(2)}M plays
                  </span>
                  <p className="text-[10px] text-[#64748B]">★ {game.rating}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Activity Logs & Infrastructure Health Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Admin Audit Activity */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Real-Time Platform Audit Stream"
            subtitle="Administrative actions, key generations, and compliance events"
            action={
              <Badge variant="purple" size="sm">Immutable Ledger</Badge>
            }
          />
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#121A2D] text-[#98A5BF] uppercase font-semibold border-b border-[#233252]">
                <tr>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Target</th>
                  <th className="py-2.5 px-3">Actor / Role</th>
                  <th className="py-2.5 px-3">IP Address</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#233252]/60">
                {mockActivityLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#182238]/60 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-white flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        log.status === 'success' ? 'bg-[#20C997]' : log.status === 'warning' ? 'bg-[#FFB547]' : 'bg-[#7C5CFC]'
                      }`} />
                      {log.action}
                    </td>
                    <td className="py-2.5 px-3 text-[#A885FF] font-mono text-[11px]">{log.target}</td>
                    <td className="py-2.5 px-3 text-[#98A5BF]">
                      <div>{log.actor}</div>
                      <span className="text-[10px] text-[#64748B]">{log.role}</span>
                    </td>
                    <td className="py-2.5 px-3 text-[#64748B] font-mono">{log.ip}</td>
                    <td className="py-2.5 px-3 text-[#98A5BF]">{log.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Cloud Infrastructure Telemetry */}
        <Card>
          <CardHeader
            title="Cluster Infrastructure"
            subtitle="High availability gateway nodes"
          />
          <div className="space-y-3.5 text-xs">
            <div className="p-3 rounded-xl bg-[#121A2D] border border-[#233252]">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-white">Edge Gateway Cluster</span>
                <span className="text-[#20C997] font-bold">100% Up</span>
              </div>
              <p className="text-[11px] text-[#98A5BF]">AWS ap-southeast-1 & eu-central-1</p>
              <div className="mt-2 w-full bg-[#0B1020] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#20C997] h-full w-full" />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#121A2D] border border-[#233252]">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-white">Webhook Dispatch Engine</span>
                <span className="text-[#20C997] font-bold">99.98%</span>
              </div>
              <p className="text-[11px] text-[#98A5BF]">Queue latency: 12ms avg</p>
              <div className="mt-2 w-full bg-[#0B1020] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#00D4FF] h-full w-[99.9%]" />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#121A2D] border border-[#233252]">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-white">Database Shards (CockroachDB)</span>
                <span className="text-[#20C997] font-bold">Healthy</span>
              </div>
              <p className="text-[11px] text-[#98A5BF]">P99 Write: 4.8ms • Zero replication lag</p>
              <div className="mt-2 w-full bg-[#0B1020] h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#7C5CFC] h-full w-full" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Operator Review Application Modal */}
      {selectedOperatorForReview && (
        <Modal
          isOpen={!!selectedOperatorForReview}
          onClose={() => setSelectedOperatorForReview(null)}
          title={`Review Operator: ${selectedOperatorForReview.companyName}`}
          maxWidth="lg"
          footer={
            reviewActionSuccess ? (
              <Button variant="secondary" onClick={() => setSelectedOperatorForReview(null)}>Close</Button>
            ) : (
              <div className="flex items-center justify-between w-full">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleRejectOperator(selectedOperatorForReview.id)}
                >
                  Reject Application
                </Button>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedOperatorForReview(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleApproveOperator(selectedOperatorForReview.id)}
                  >
                    Approve Operator & Issue Production Keys
                  </Button>
                </div>
              </div>
            )
          }
        >
          {reviewActionSuccess ? (
            <div className="text-center py-6">
              <CheckCircle className="w-12 h-12 text-[#20C997] mx-auto mb-3" />
              <h4 className="font-semibold text-white text-base">Application Processed</h4>
              <p className="text-xs text-[#98A5BF] mt-1">{reviewActionSuccess}</p>
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              <div className="p-3 rounded-xl bg-[#0B1020] border border-[#233252] grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[#98A5BF]">Legal Entity:</span>
                  <p className="font-semibold text-white mt-0.5">{selectedOperatorForReview.companyName}</p>
                </div>
                <div>
                  <span className="text-[#98A5BF]">Country of Inc.:</span>
                  <p className="font-semibold text-white mt-0.5">{selectedOperatorForReview.country}</p>
                </div>
                <div>
                  <span className="text-[#98A5BF]">Registration No.:</span>
                  <p className="font-semibold text-white font-mono mt-0.5">{selectedOperatorForReview.registrationNumber || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-[#98A5BF]">Website:</span>
                  <p className="font-semibold text-[#00D4FF] mt-0.5 flex items-center gap-1">
                    <a href={selectedOperatorForReview.website} target="_blank" rel="noreferrer" className="hover:underline">
                      {selectedOperatorForReview.website}
                    </a>
                  </p>
                </div>
                <div>
                  <span className="text-[#98A5BF]">Contact Person:</span>
                  <p className="font-semibold text-white mt-0.5">{selectedOperatorForReview.contactPerson}</p>
                </div>
                <div>
                  <span className="text-[#98A5BF]">Business Email:</span>
                  <p className="font-semibold text-white mt-0.5">{selectedOperatorForReview.email}</p>
                </div>
              </div>

              <div>
                <span className="text-[#98A5BF] font-semibold">Compliance Due Diligence Notes:</span>
                <p className="p-3 rounded-xl bg-[#182238] border border-[#233252] text-white mt-1">
                  {selectedOperatorForReview.notes || 'Company passed automated Sanction & PEP screenings. Requested standard slot aggregator integration.'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-[#7C5CFC]/10 border border-[#7C5CFC]/30 text-[#A885FF]">
                <p className="font-semibold">⚠️ Action Impact:</p>
                <p className="mt-0.5 text-[11px]">
                  Approving this operator will automatically grant them access to the B2B Operator Portal, generate their live sandbox credentials, and allow game catalog licensing.
                </p>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};
