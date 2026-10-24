import React, { useState } from 'react';
import {
  Webhook,
  Plus,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Copy,
  ExternalLink,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { Card, CardHeader } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Modal } from '../../../components/ui/Modal';

export const OperatorWebhooks: React.FC = () => {
  const [webhookUrl, setWebhookUrl] = useState('https://api.asiagaming.net/v2/nexus-webhook');
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleTestWebhook = () => {
    setIsTesting(true);
    setTimeout(() => {
      setIsTesting(false);
      setTestSuccess(true);
    }, 700);
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
            <Webhook className="w-6 h-6 text-[#00D4FF]" />
            Real-Time Webhook Endpoints
          </h1>
          <p className="text-xs text-[#98A5BF] mt-1">
            Configure destination URLs for atomic player wallet debits, win credits, and session heartbeat timeouts.
          </p>
        </div>

        <Button
          variant="cyan"
          size="sm"
          leftIcon={<Zap className="w-3.5 h-3.5" />}
          onClick={() => {
            setTestSuccess(false);
            setIsTestModalOpen(true);
          }}
        >
          Send Test Webhook Ping
        </Button>
      </div>

      {/* Webhook Configuration Card */}
      <Card>
        <CardHeader
          title="Primary Wallet Webhook URL"
          subtitle="All player bets and wins will be dispatched to this endpoint with HMAC-SHA256 signatures"
          action={<Badge variant="success" size="sm" dot>Active & Verified</Badge>}
        />

        <div className="space-y-4 text-xs max-w-xl">
          <Input
            label="Destination Endpoint (HTTPS Required)"
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#98A5BF] mb-2">
              Subscribed Event Types
            </label>
            <div className="space-y-2">
              {[
                { id: 'wallet.bet', label: 'wallet.bet (Synchronous balance debit on spin/wager)' },
                { id: 'wallet.win', label: 'wallet.win (Instant credit for multiplier wins and jackpots)' },
                { id: 'wallet.refund', label: 'wallet.refund (Automatic round cancellation refund)' },
                { id: 'session.timeout', label: 'session.timeout (Player idle disconnect notification)' }
              ].map((ev) => (
                <label key={ev.id} className="flex items-center gap-2 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 rounded bg-[#0B1020] border-[#2D3E66] text-[#00D4FF] focus:ring-[#00D4FF] accent-[#00D4FF]"
                  />
                  <span>{ev.label}</span>
                </label>
              ))}
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => showToast('Webhook configurations saved and registered.')}
          >
            Update Webhook Settings
          </Button>
        </div>
      </Card>

      {/* Delivery History Table */}
      <Card>
        <CardHeader
          title="Recent Webhook Deliveries"
          subtitle="Last 5 attempts with roundtrip latency and HTTP response codes"
        />

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#121A2D] text-[#98A5BF] uppercase font-semibold border-b border-[#233252]">
              <tr>
                <th className="py-2.5 px-3">Event Type</th>
                <th className="py-2.5 px-3">Transaction Reference</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Roundtrip</th>
                <th className="py-2.5 px-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#233252]/60">
              {[
                { ev: 'wallet.win', ref: 'REF-PRAG-982104', status: 200, time: '38ms', date: 'Just now' },
                { ev: 'wallet.bet', ref: 'REF-PRAG-982103', status: 200, time: '34ms', date: '14s ago' },
                { ev: 'wallet.win', ref: 'REF-SPRIBE-33102', status: 200, time: '41ms', date: '45s ago' }
              ].map((item, idx) => (
                <tr key={idx} className="hover:bg-[#182238]/60 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-[#00D4FF] font-bold">{item.ev}</td>
                  <td className="py-2.5 px-3 font-mono text-white">{item.ref}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="bg-[#20C997]/20 text-[#20C997] font-mono px-2 py-0.5 rounded font-bold text-[10px]">
                      {item.status} OK
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-[#98A5BF]">{item.time}</td>
                  <td className="py-2.5 px-3 text-[#98A5BF] font-mono text-[11px]">{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Test Webhook Modal */}
      {isTestModalOpen && (
        <Modal
          isOpen={isTestModalOpen}
          onClose={() => setIsTestModalOpen(false)}
          title="Send Test Webhook Ping"
          maxWidth="md"
          footer={
            <div className="flex items-center justify-between w-full">
              <Button variant="outline" size="sm" onClick={() => setIsTestModalOpen(false)}>
                Close
              </Button>
              <Button
                variant="cyan"
                size="sm"
                onClick={handleTestWebhook}
                isLoading={isTesting}
              >
                Dispatch Test Payload
              </Button>
            </div>
          }
        >
          <div className="space-y-3 text-xs">
            <p className="text-[#98A5BF]">
              We will send a dummy <code className="text-[#00D4FF]">ping.test</code> event signed with your secret key to verify handshake compatibility.
            </p>

            {testSuccess && (
              <div className="p-3 rounded-xl bg-[#20C997]/15 border border-[#20C997]/40 text-[#20C997] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <div>
                  <p className="font-bold">200 OK Handshake Successful!</p>
                  <p className="text-[11px] text-[#98A5BF]">Server returned valid JSON within 34ms.</p>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
