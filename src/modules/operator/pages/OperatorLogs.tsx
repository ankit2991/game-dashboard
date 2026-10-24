import React, { useState } from 'react';
import {
  Terminal,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Copy,
  Clock,
  Download,
  AlertCircle
} from 'lucide-react';
import { Card, CardHeader } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';

interface LogItem {
  id: string;
  timestamp: string;
  method: 'POST' | 'GET';
  endpoint: string;
  status: 200 | 400 | 403 | 500;
  latencyMs: number;
  environment: 'production' | 'sandbox';
  requestPayload: string;
  responsePayload: string;
}

export const OperatorLogs: React.FC = () => {
  const [selectedLog, setSelectedLog] = useState<LogItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | '200' | 'errors'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const logs: LogItem[] = [
    {
      id: 'req_8812a09',
      timestamp: '2024-10-23 09:44:12',
      method: 'POST',
      endpoint: '/v1/games/launch',
      status: 200,
      latencyMs: 41,
      environment: 'production',
      requestPayload: JSON.stringify({ game_id: 'game_gates_olympus', player_id: 'usr_882194', currency: 'MYR' }, null, 2),
      responsePayload: JSON.stringify({ status: 'success', launch_url: 'https://play.nexus-provider.internal/launch?token=tok_99182a' }, null, 2)
    },
    {
      id: 'req_8812a08',
      timestamp: '2024-10-23 09:44:05',
      method: 'POST',
      endpoint: '/v1/wallet/bet',
      status: 200,
      latencyMs: 38,
      environment: 'production',
      requestPayload: JSON.stringify({ player_id: 'usr_882194', amount: 50.00, currency: 'MYR', game_id: 'game_gates_olympus' }, null, 2),
      responsePayload: JSON.stringify({ status: 'SUCCESS', balance: 8370.50 }, null, 2)
    },
    {
      id: 'req_8812a07',
      timestamp: '2024-10-23 09:43:50',
      method: 'POST',
      endpoint: '/v1/games/launch',
      status: 403,
      latencyMs: 12,
      environment: 'production',
      requestPayload: JSON.stringify({ game_id: 'game_unlicensed_title', player_id: 'usr_11928' }, null, 2),
      responsePayload: JSON.stringify({ error: 'GAME_NOT_LICENSED', message: 'Title is not enabled on your operator catalog' }, null, 2)
    },
    {
      id: 'req_8812a06',
      timestamp: '2024-10-23 09:42:18',
      method: 'GET',
      endpoint: '/v1/catalog/games?category=slots',
      status: 200,
      latencyMs: 64,
      environment: 'production',
      requestPayload: '{}',
      responsePayload: JSON.stringify({ total: 742, page: 1, count: 25 }, null, 2)
    }
  ];

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.endpoint.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === '200'
        ? log.status === 200
        : log.status !== 200;
    return matchesSearch && matchesStatus;
  });

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
            <Terminal className="w-6 h-6 text-[#00D4FF]" />
            Real-Time Gateway Integration Logs
          </h1>
          <p className="text-xs text-[#98A5BF] mt-1">
            Audit raw inbound HTTP requests, HMAC headers, latency benchmarks, and payload diagnostics.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          leftIcon={<Download className="w-3.5 h-3.5" />}
          onClick={() => showToast('Log stream exported to JSON.')}
        >
          Export Logs
        </Button>
      </div>

      {/* Table */}
      <Card>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search request ID or endpoint..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0B1020] text-xs text-[#F5F7FF] placeholder-[#64748B] border border-[#233252] focus:border-[#00D4FF] outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            {(['all', '200', 'errors'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-xl capitalize font-semibold transition-all ${
                  statusFilter === s
                    ? 'bg-[#00D4FF] text-[#0B1020]'
                    : 'bg-[#0B1020] text-[#98A5BF] hover:text-white border border-[#233252]'
                }`}
              >
                {s === 'all' ? 'All Requests' : s === '200' ? 'Success (200)' : 'Errors Only'}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#121A2D] text-[#98A5BF] uppercase font-semibold border-b border-[#233252]">
              <tr>
                <th className="py-3 px-3">Request ID</th>
                <th className="py-3 px-3">Method & Path</th>
                <th className="py-3 px-3 text-center">Status</th>
                <th className="py-3 px-3 text-right">Latency</th>
                <th className="py-3 px-3">Environment</th>
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-3 text-right">Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#233252]/60">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#182238]/60 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-white text-[11px]">{log.id}</td>
                  <td className="py-3 px-3">
                    <span className="font-mono text-[#A885FF] font-bold mr-2">{log.method}</span>
                    <span className="font-mono text-white">{log.endpoint}</span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                      log.status === 200 ? 'bg-[#20C997]/20 text-[#20C997]' : 'bg-[#FF5D73]/20 text-[#FF5D73]'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-white">{log.latencyMs}ms</td>
                  <td className="py-3 px-3">
                    <Badge variant={log.environment === 'production' ? 'purple' : 'cyan'} size="sm">
                      {log.environment}
                    </Badge>
                  </td>
                  <td className="py-3 px-3 text-[#98A5BF] font-mono text-[11px]">{log.timestamp}</td>
                  <td className="py-3 px-3 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedLog(log)}
                    >
                      Inspect
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Log Detail Inspector Modal */}
      {selectedLog && (
        <Modal
          isOpen={!!selectedLog}
          onClose={() => setSelectedLog(null)}
          title={`HTTP Inspector: ${selectedLog.id}`}
          maxWidth="lg"
          footer={
            <Button variant="primary" size="sm" onClick={() => setSelectedLog(null)}>
              Close
            </Button>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#0B1020] border border-[#233252]">
              <div>
                <span className="text-[#98A5BF]">{selectedLog.method}</span>
                <p className="font-mono font-bold text-white text-sm">{selectedLog.endpoint}</p>
              </div>
              <span className={`px-2.5 py-1 rounded font-mono font-bold text-xs ${
                selectedLog.status === 200 ? 'bg-[#20C997]/20 text-[#20C997]' : 'bg-[#FF5D73]/20 text-[#FF5D73]'
              }`}>
                {selectedLog.status} OK
              </span>
            </div>

            <div>
              <span className="font-semibold text-white block mb-1">Request Body</span>
              <pre className="p-3 rounded-xl bg-[#0B1020] border border-[#233252] text-[#00D4FF] font-mono text-[11px] overflow-x-auto">
                {selectedLog.requestPayload}
              </pre>
            </div>

            <div>
              <span className="font-semibold text-white block mb-1">Response Body</span>
              <pre className="p-3 rounded-xl bg-[#0B1020] border border-[#233252] text-[#20C997] font-mono text-[11px] overflow-x-auto">
                {selectedLog.responsePayload}
              </pre>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
