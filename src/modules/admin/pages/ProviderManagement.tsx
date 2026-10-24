import React, { useState } from 'react';
import {
  Cpu,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  ShieldCheck,
  Server,
  Activity,
  Layers,
  Settings,
  Zap
} from 'lucide-react';
import { Card, CardHeader } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { mockProviders } from '../../../data/mock/gamesData';
import type { GameProvider } from '../../../types';

export const ProviderManagement: React.FC = () => {
  const [providers, setProviders] = useState<GameProvider[]>(mockProviders);
  const [selectedProvider, setSelectedProvider] = useState<GameProvider | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isTestingPing, setIsTestingPing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleTestConnection = (prov: GameProvider) => {
    setIsTestingPing(true);
    setTimeout(() => {
      setIsTestingPing(false);
      showToast(`Gateway ping test for ${prov.name} PASSED: ${prov.latencyMs}ms latency, 100% packets returned.`);
    }, 800);
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
            <Cpu className="w-6 h-6 text-[#7C5CFC]" />
            Upstream Game Provider Gateways
          </h1>
          <p className="text-xs text-[#98A5BF] mt-1">
            Configure upstream studio integrations, callback endpoints, currency support, and live latency diagnostics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isTestingPing ? 'animate-spin' : ''}`} />}
            onClick={() => {
              setIsTestingPing(true);
              setTimeout(() => {
                setIsTestingPing(false);
                showToast('All 6 Provider studio endpoints polled. Nominal latency.');
              }, 600);
            }}
          >
            Poll All Feeds
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Connect New Provider
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-3.5 rounded-xl bg-[#121A2D] border border-[#233252]">
          <span className="text-[11px] text-[#98A5BF] uppercase font-semibold">Active Providers</span>
          <p className="text-xl font-bold text-white font-display mt-1">5 Connected</p>
          <span className="text-[10px] text-[#20C997]">1 in Maintenance</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#121A2D] border border-[#233252]">
          <span className="text-[11px] text-[#98A5BF] uppercase font-semibold">Total Studio Titles</span>
          <p className="text-xl font-bold text-[#7C5CFC] font-display mt-1">742 Games</p>
          <span className="text-[10px] text-[#98A5BF]">Aggregated in single schema</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#121A2D] border border-[#233252]">
          <span className="text-[11px] text-[#98A5BF] uppercase font-semibold">Average Ping Latency</span>
          <p className="text-xl font-bold text-[#00D4FF] font-display mt-1">45.2 ms</p>
          <span className="text-[10px] text-[#20C997]">High-speed websocket feed</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#121A2D] border border-[#233252]">
          <span className="text-[11px] text-[#98A5BF] uppercase font-semibold">Gateway Availability</span>
          <p className="text-xl font-bold text-[#20C997] font-display mt-1">99.98%</p>
          <span className="text-[10px] text-[#98A5BF]">Past 90 days SLA</span>
        </div>
      </div>

      {/* Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {providers.map((prov) => (
          <Card key={prov.id} hoverEffect className="relative flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#233252]/60">
                <div className="flex items-center gap-3">
                  <img
                    src={prov.logo}
                    alt={prov.name}
                    className="w-11 h-11 rounded-xl object-cover border border-[#2D3E66] shadow-md"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-white font-display">{prov.name}</h3>
                    <span className="text-[10px] font-mono text-[#00D4FF] bg-[#00D4FF]/10 px-1.5 py-0.5 rounded border border-[#00D4FF]/20">
                      CODE: {prov.code}
                    </span>
                  </div>
                </div>

                <Badge
                  size="sm"
                  variant={prov.integrationStatus === 'connected' ? 'success' : 'warning'}
                  dot
                >
                  {prov.integrationStatus}
                </Badge>
              </div>

              {/* Description */}
              <p className="text-xs text-[#98A5BF] mt-3 line-clamp-2">
                {prov.description}
              </p>

              {/* Supported Categories Badges */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {prov.categories.map((cat) => (
                  <span
                    key={cat}
                    className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-[#0B1020] text-[#A885FF] border border-[#233252]"
                  >
                    {cat}
                  </span>
                ))}
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2 mt-4 p-2.5 rounded-xl bg-[#0B1020] border border-[#233252] text-xs">
                <div>
                  <span className="text-[10px] text-[#64748B] block">Available</span>
                  <span className="font-bold text-white">{prov.activeGames} / {prov.totalGames}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#64748B] block">Gateway Ping</span>
                  <span className="font-mono font-bold text-[#00D4FF]">{prov.latencyMs}ms</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#64748B] block">SLA Uptime</span>
                  <span className="font-mono font-bold text-[#20C997]">{prov.uptimePercent}%</span>
                </div>
              </div>

              {/* Mock Endpoint */}
              <div className="mt-3">
                <span className="text-[10px] text-[#64748B] uppercase font-semibold">Gateway Callback URI</span>
                <p className="font-mono text-[11px] text-[#98A5BF] truncate bg-[#121A2D] p-1.5 rounded-lg border border-[#233252] mt-0.5">
                  {prov.apiEndpointMock}
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between gap-2 pt-4 mt-4 border-t border-[#233252]/60">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Zap className="w-3 h-3 text-[#FFB547]" />}
                onClick={() => handleTestConnection(prov)}
                isLoading={isTestingPing}
              >
                Test Ping
              </Button>

              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Settings className="w-3 h-3" />}
                onClick={() => {
                  setSelectedProvider(prov);
                  setIsEditModalOpen(true);
                }}
              >
                Configure
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Configure Provider Modal */}
      {selectedProvider && isEditModalOpen && (
        <Modal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          title={`Configure Provider: ${selectedProvider.name}`}
          maxWidth="lg"
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <Button variant="outline" size="sm" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  showToast(`Provider configuration saved for ${selectedProvider.name}.`);
                  setIsEditModalOpen(false);
                }}
              >
                Save Configuration
              </Button>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            <Input label="Provider Display Name" defaultValue={selectedProvider.name} />
            <Input label="Aggregator Studio Code" defaultValue={selectedProvider.code} />
            <Input label="Upstream Callback Endpoint" defaultValue={selectedProvider.apiEndpointMock} />
            
            <div className="p-3 rounded-xl bg-[#0B1020] border border-[#233252]">
              <span className="font-semibold text-white block mb-1">Upstream Studio Credentials (Masked)</span>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <Input label="Client ID" defaultValue="nx_upstream_prod_8812a" disabled />
                <Input label="Secret Key" defaultValue="••••••••••••••••••••••••" disabled />
              </div>
              <p className="text-[10px] text-[#64748B] mt-1.5">
                🔒 Stored securely in platform key vault. Never exposed in plain client code.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#98A5BF] mb-1.5">
                Maintenance State
              </label>
              <select
                defaultValue={selectedProvider.status}
                className="w-full rounded-xl bg-[#0B1020] text-sm text-white border border-[#233252] p-2.5 outline-none"
              >
                <option value="active">Active (Available across all operators)</option>
                <option value="maintenance">Maintenance (Temporarily block new game launches)</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </Modal>
      )}

      {/* Add New Provider Modal */}
      {isAddModalOpen && (
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Connect Upstream Game Studio"
          maxWidth="lg"
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <Button variant="outline" size="sm" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="cyan"
                size="sm"
                onClick={() => {
                  showToast('Provider feed added. Running automated webhook handshake.');
                  setIsAddModalOpen(false);
                }}
              >
                Establish Connection
              </Button>
            </div>
          }
        >
          <div className="space-y-3.5 text-xs">
            <Input label="Studio Name" placeholder="e.g. NetEnt Studios / Red Tiger" required />
            <Input label="Provider Short Code" placeholder="e.g. NETENT" required />
            <Input label="API Base URL" placeholder="https://api.studio-provider.com/v2/games" required />
            <div className="grid grid-cols-2 gap-3">
              <Input label="API Secret Key" placeholder="••••••••••••••••" type="password" required />
              <Input label="Partner ID" placeholder="PTNR-99812" required />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
