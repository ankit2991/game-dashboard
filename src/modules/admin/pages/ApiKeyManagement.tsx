import React, { useState } from 'react';
import {
  KeyRound,
  Search,
  Plus,
  Copy,
  Eye,
  EyeOff,
  CheckCircle2,
  Trash2,
  AlertTriangle,
  ShieldCheck,
  Server,
  Globe
} from 'lucide-react';
import { Card, CardHeader } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';
import { mockApiKeys, mockOperators } from '../../../data/mock/adminData';
import type { ApiKey } from '../../../types';

export const ApiKeyManagement: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(mockApiKeys);
  const [revealedKeyIds, setRevealedKeyIds] = useState<Record<string, boolean>>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [keyToRevoke, setKeyToRevoke] = useState<ApiKey | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [envFilter, setEnvFilter] = useState<'all' | 'production' | 'sandbox'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleReveal = (id: string) => {
    setRevealedKeyIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard.`);
  };

  const handleRevokeKey = (keyId: string) => {
    setApiKeys((prev) =>
      prev.map((k) => (k.id === keyId ? { ...k, status: 'revoked' } : k))
    );
    showToast(`API Key ${keyToRevoke?.name} has been REVOKED immediately.`);
    setKeyToRevoke(null);
  };

  const filteredKeys = apiKeys.filter((k) => {
    const matchesSearch =
      k.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.operatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.prefix.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEnv = envFilter === 'all' || k.environment === envFilter;
    return matchesSearch && matchesEnv;
  });

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
            <KeyRound className="w-6 h-6 text-[#00D4FF]" />
            API Key & Gateway Credentials
          </h1>
          <p className="text-xs text-[#98A5BF] mt-1">
            Generate, rotate, and enforce CIDR IP allowlists for operator server-to-server game launch tokens.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="cyan"
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Provision API Key
          </Button>
        </div>
      </div>

      {/* Security Best Practice Notice */}
      <div className="p-4 rounded-2xl bg-[#7C5CFC]/10 border border-[#7C5CFC]/30 flex items-start gap-3 text-xs">
        <ShieldCheck className="w-5 h-5 text-[#A885FF] flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white">Cryptographic Security Policy:</span>
          <p className="text-[#98A5BF] mt-0.5">
            Production API keys grant access to real-money game sessions and wallet balance debit/credit webhooks.
            Never embed keys in client-side applications. IP allowlists are strictly enforced on all production endpoints.
          </p>
        </div>
      </div>

      {/* Filter and Table */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search by key name, operator, or prefix..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0B1020] text-xs text-[#F5F7FF] placeholder-[#64748B] border border-[#233252] focus:border-[#00D4FF] outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            {(['all', 'production', 'sandbox'] as const).map((env) => (
              <button
                key={env}
                onClick={() => setEnvFilter(env)}
                className={`px-3 py-1.5 rounded-xl capitalize font-medium transition-all ${
                  envFilter === env
                    ? 'bg-[#00D4FF] text-[#0B1020] font-bold shadow-sm'
                    : 'bg-[#0B1020] text-[#98A5BF] hover:text-white hover:bg-[#182238] border border-[#233252]'
                }`}
              >
                {env}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#121A2D] text-[#98A5BF] uppercase font-semibold border-b border-[#233252]">
              <tr>
                <th className="py-3 px-3">Key Identifier</th>
                <th className="py-3 px-3">Assigned Operator</th>
                <th className="py-3 px-3">Environment</th>
                <th className="py-3 px-3">Token Secret (Masked)</th>
                <th className="py-3 px-3">IP Allowlists</th>
                <th className="py-3 px-3 text-right">Rate Limit</th>
                <th className="py-3 px-3">Last Active</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#233252]/60">
              {filteredKeys.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-[#98A5BF]">
                    No credentials match the filter.
                  </td>
                </tr>
              ) : (
                filteredKeys.map((key) => {
                  const isRevealed = revealedKeyIds[key.id];

                  return (
                    <tr key={key.id} className="hover:bg-[#182238]/60 transition-colors">
                      {/* Name */}
                      <td className="py-3 px-3">
                        <span className="font-semibold text-white text-sm block">{key.name}</span>
                        <span className="text-[10px] font-mono text-[#64748B]">ID: {key.id}</span>
                      </td>

                      {/* Operator */}
                      <td className="py-3 px-3">
                        <span className="text-white font-medium">{key.operatorName}</span>
                      </td>

                      {/* Environment */}
                      <td className="py-3 px-3">
                        <Badge
                          size="sm"
                          variant={key.environment === 'production' ? 'purple' : 'cyan'}
                        >
                          {key.environment}
                        </Badge>
                      </td>

                      {/* Secret */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <code className="bg-[#0B1020] px-2 py-1 rounded border border-[#233252] text-[#00D4FF] font-mono text-[11px]">
                            {isRevealed ? key.maskedSecret : key.prefix}
                          </code>
                          <button
                            onClick={() => toggleReveal(key.id)}
                            className="p-1 text-[#98A5BF] hover:text-white"
                            title={isRevealed ? 'Hide secret' : 'Reveal secret'}
                          >
                            {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => handleCopy(key.maskedSecret, 'API Key')}
                            className="p-1 text-[#98A5BF] hover:text-[#00D4FF]"
                            title="Copy to clipboard"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* IP Allowlist */}
                      <td className="py-3 px-3 font-mono text-[11px] text-[#98A5BF]">
                        {key.ipAllowlist.join(', ')}
                      </td>

                      {/* Rate Limit */}
                      <td className="py-3 px-3 text-right font-mono text-white">
                        {key.rateLimitPerMin.toLocaleString()} req/m
                      </td>

                      {/* Last Used */}
                      <td className="py-3 px-3 text-[#98A5BF]">
                        {key.lastUsedAt}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 text-center">
                        <Badge
                          size="sm"
                          variant={key.status === 'active' ? 'success' : 'danger'}
                          dot
                        >
                          {key.status}
                        </Badge>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-right">
                        {key.status === 'active' && (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => setKeyToRevoke(key)}
                          >
                            Revoke
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Revoke Key Modal */}
      {keyToRevoke && (
        <Modal
          isOpen={!!keyToRevoke}
          onClose={() => setKeyToRevoke(null)}
          title={`Revoke Key: ${keyToRevoke.name}`}
          maxWidth="md"
          footer={
            <div className="flex items-center justify-between w-full">
              <Button variant="outline" size="sm" onClick={() => setKeyToRevoke(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleRevokeKey(keyToRevoke.id)}
              >
                Confirm Immediate Revocation
              </Button>
            </div>
          }
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-[#FF5D73]/10 border border-[#FF5D73]/30 text-[#FF5D73] flex items-start gap-2.5">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-bold">Irreversible Action</p>
                <p className="mt-0.5 text-[11px] text-[#98A5BF]">
                  Revoking this key will immediately drop all incoming API requests and active player sessions for{' '}
                  <strong className="text-white">{keyToRevoke.operatorName}</strong>.
                </p>
              </div>
            </div>
            <p className="text-[#98A5BF]">
              Are you sure you want to invalidate token prefix <code className="text-white font-mono">{keyToRevoke.prefix}</code>?
            </p>
          </div>
        </Modal>
      )}

      {/* Provision New Key Modal */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Provision New API Key"
          maxWidth="lg"
          footer={
            <div className="flex items-center justify-end gap-2 w-full">
              <Button variant="outline" size="sm" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="cyan"
                size="sm"
                onClick={() => {
                  showToast('New credentials generated and encrypted.');
                  setIsCreateModalOpen(false);
                }}
              >
                Generate Keypair
              </Button>
            </div>
          }
        >
          <div className="space-y-3.5 text-xs">
            <Input label="Key Name / Label" placeholder="e.g. Primary Production Gateway Key" required />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#98A5BF] mb-1.5">
                  Assign to Operator
                </label>
                <select className="w-full rounded-xl bg-[#0B1020] text-sm text-white border border-[#233252] p-2.5 outline-none">
                  {mockOperators.map((op) => (
                    <option key={op.id} value={op.id}>{op.companyName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#98A5BF] mb-1.5">
                  Environment
                </label>
                <select className="w-full rounded-xl bg-[#0B1020] text-sm text-white border border-[#233252] p-2.5 outline-none">
                  <option value="production">Production (Real Money)</option>
                  <option value="sandbox">Sandbox (Simulated Credit)</option>
                </select>
              </div>
            </div>
            <Input
              label="IP Allowlist (Comma separated IPv4 / CIDR)"
              placeholder="103.45.22.18, 103.45.22.19, 118.99.102.0/24"
            />
            <Input
              label="Rate Limit (Requests per minute)"
              defaultValue="10000"
            />
          </div>
        </Modal>
      )}
    </div>
  );
};
