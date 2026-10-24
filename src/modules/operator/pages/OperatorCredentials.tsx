import React, { useState } from 'react';
import {
  KeyRound,
  Copy,
  Eye,
  EyeOff,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Server,
  Globe,
  Plus
} from 'lucide-react';
import { Card, CardHeader } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';

export const OperatorCredentials: React.FC = () => {
  const [showProdSecret, setShowProdSecret] = useState(false);
  const [showSandboxSecret, setShowSandboxSecret] = useState(false);
  const [isRegenerateModalOpen, setIsRegenerateModalOpen] = useState(false);
  const [selectedKeyType, setSelectedKeyType] = useState<'sandbox' | 'production'>('production');
  const [ipList, setIpList] = useState(['103.45.22.18', '103.45.22.19', '118.99.102.5']);
  const [newIp, setNewIp] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCopy = (val: string, label: string) => {
    navigator.clipboard.writeText(val);
    showToast(`${label} copied to clipboard!`);
  };

  const handleAddIp = () => {
    if (!newIp.trim()) return;
    setIpList([...ipList, newIp.trim()]);
    setNewIp('');
    showToast('IP address added to allowlist.');
  };

  const handleRemoveIp = (ip: string) => {
    setIpList(ipList.filter((item) => item !== ip));
    showToast(`Removed ${ip} from allowlist.`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-14 right-6 z-50 bg-[#00D4FF] text-[#0B1020] px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#233252]/60">
        <div>
          <h1 className="text-2xl font-bold font-display text-white tracking-tight flex items-center gap-2.5">
            <KeyRound className="w-6 h-6 text-[#00D4FF]" />
            Operator API Credentials & Keys
          </h1>
          <p className="text-xs text-[#98A5BF] mt-1">
            Manage your server-to-server gateway credentials, HMAC signing secrets, and CIDR IP allowlists.
          </p>
        </div>
      </div>

      {/* Security Warning Notice */}
      <div className="p-4 rounded-2xl bg-[#FFB547]/10 border border-[#FFB547]/30 flex items-start gap-3 text-xs">
        <AlertTriangle className="w-5 h-5 text-[#FFB547] flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-white">Do Not Expose Secrets in Client Applications:</span>
          <p className="text-[#98A5BF] mt-0.5">
            Your Secret Key gives unrestricted access to mutate player wallet balances and create session tokens.
            Always call Nexus endpoints from your backend servers. Production API requests originating from unregistered IP addresses will be blocked with a 403 Forbidden error.
          </p>
        </div>
      </div>

      {/* Production Credentials Card */}
      <Card>
        <CardHeader
          title="Production Gateway Keypair"
          subtitle="Active credentials for real-money gameplay on live domains"
          action={<Badge variant="success" size="sm" dot>Live Production</Badge>}
        />

        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#98A5BF] mb-1">
              Client ID (Public Identifier)
            </label>
            <div className="flex items-center gap-2 max-w-xl">
              <input
                type="text"
                readOnly
                value="op_asia_gaming_live_881"
                className="w-full bg-[#0B1020] text-white font-mono p-2.5 rounded-xl border border-[#233252] outline-none"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy('op_asia_gaming_live_881', 'Client ID')}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#98A5BF] mb-1">
              Production Secret Key (HMAC-SHA256 Token)
            </label>
            <div className="flex items-center gap-2 max-w-xl">
              <input
                type={showProdSecret ? 'text' : 'password'}
                readOnly
                value="nx_live_9a8f4920b7c1e309d44f8e71aa99014"
                className="w-full bg-[#0B1020] text-[#00D4FF] font-mono p-2.5 rounded-xl border border-[#233252] outline-none"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowProdSecret(!showProdSecret)}
                title={showProdSecret ? 'Hide secret' : 'Reveal secret'}
              >
                {showProdSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy('nx_live_9a8f4920b7c1e309d44f8e71aa99014', 'Production Secret Key')}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-[#64748B] pt-1">
            <span>Created: 2023-05-01</span>
            <span>Last used: Active (Just now)</span>
            <button
              onClick={() => {
                setSelectedKeyType('production');
                setIsRegenerateModalOpen(true);
              }}
              className="text-[#FF5D73] hover:underline font-semibold"
            >
              Rotate Production Key
            </button>
          </div>
        </div>
      </Card>

      {/* Sandbox Credentials Card */}
      <Card>
        <CardHeader
          title="Sandbox Staging Keypair"
          subtitle="Use for local development, staging tests, and QA automated pipelines"
          action={<Badge variant="cyan" size="sm">⚡ Sandbox Testing</Badge>}
        />

        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#98A5BF] mb-1">
              Sandbox Secret Key
            </label>
            <div className="flex items-center gap-2 max-w-xl">
              <input
                type={showSandboxSecret ? 'text' : 'password'}
                readOnly
                value="nx_test_41cb8290fa10e791bb4021dd09"
                className="w-full bg-[#0B1020] text-[#A885FF] font-mono p-2.5 rounded-xl border border-[#233252] outline-none"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSandboxSecret(!showSandboxSecret)}
              >
                {showSandboxSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy('nx_test_41cb8290fa10e791bb4021dd09', 'Sandbox Secret Key')}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* IP Allowlist Manager */}
      <Card>
        <CardHeader
          title="Production Server IP Allowlist (CIDR)"
          subtitle="Only backend servers matching these IPv4 addresses can authenticate production sessions"
        />

        <div className="space-y-3 text-xs max-w-xl">
          <div className="flex flex-wrap gap-2">
            {ipList.map((ip) => (
              <span
                key={ip}
                className="px-3 py-1.5 rounded-xl bg-[#0B1020] border border-[#233252] font-mono text-white flex items-center gap-2"
              >
                {ip}
                <button
                  onClick={() => handleRemoveIp(ip)}
                  className="text-[#98A5BF] hover:text-[#FF5D73]"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              placeholder="e.g. 192.168.1.50 or 203.0.113.0/24"
              value={newIp}
              onChange={(e) => setNewIp(e.target.value)}
              className="flex-1 bg-[#0B1020] text-white text-xs p-2.5 rounded-xl border border-[#233252] outline-none font-mono"
            />
            <Button variant="cyan" size="sm" onClick={handleAddIp}>
              Add IP Address
            </Button>
          </div>
        </div>
      </Card>

      {/* Rotate Key Confirmation Modal */}
      {isRegenerateModalOpen && (
        <Modal
          isOpen={isRegenerateModalOpen}
          onClose={() => setIsRegenerateModalOpen(false)}
          title={`Rotate ${selectedKeyType.toUpperCase()} Key`}
          maxWidth="md"
          footer={
            <div className="flex items-center justify-between w-full">
              <Button variant="outline" size="sm" onClick={() => setIsRegenerateModalOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  showToast('New secret key generated! Old token remains valid for 12 hours.');
                  setIsRegenerateModalOpen(false);
                }}
              >
                Confirm Immediate Key Rotation
              </Button>
            </div>
          }
        >
          <div className="space-y-3 text-xs">
            <p className="text-white">
              Are you sure you want to rotate your <strong className="text-[#00D4FF]">{selectedKeyType}</strong> API key?
            </p>
            <p className="text-[#98A5BF]">
              A new secret token will be created. We enforce a 12-hour grace period during which your existing key will continue to operate to ensure zero downtime during server deploys.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};
