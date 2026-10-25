import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Building2, Search, RefreshCw, ShieldCheck, ShieldAlert } from 'lucide-react';
import {Link} from 'react-router-dom';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { adminApi, type AdminDecision, type AdminOperator } from '../../../lib/api/admin';
import { useAuth } from '../../../context/AuthContext';

const actionsFor = (status: AdminOperator['status']): {action: AdminDecision; label: string}[] => {
  if (status === 'pending') return [{action:'approve', label:'Approve'}, {action:'reject', label:'Reject'}];
  if (status === 'approved') return [{action:'suspend', label:'Suspend'}];
  return [{action:'reopen', label:'Reopen for review'}];
};

/** Operators from the server, not the old six demo licensees. Approval never provisions API keys. */
export const OperatorManagement: React.FC = () => {
  const {getAdminAccessToken, logout} = useAuth();
  const [operators, setOperators] = useState<AdminOperator[]>([]);
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | AdminOperator['status']>('all');
  const [selection, setSelection] = useState<{operator: AdminOperator; action: AdminDecision; label: string} | null>(null);

  const reload = useCallback(async (signal?: AbortSignal) => {
    setError(''); setLoading(true);
    try {
      const access = await getAdminAccessToken();
      if (!access) throw new Error('Your admin session has expired. Sign in again.');
      const data = await adminApi.operators(access, signal);
      if (!signal?.aborted) setOperators(data.operators);
    } catch (cause) {
      if (!signal?.aborted) setError(cause instanceof Error ? cause.message : 'Unable to load operators.');
    } finally { if (!signal?.aborted) setLoading(false); }
  }, [getAdminAccessToken]);

  useEffect(() => { const controller = new AbortController(); void reload(controller.signal);
    return () => controller.abort(); }, [reload]);

  const visible = useMemo(() => operators.filter(op => {
    const query = search.trim().toLowerCase();
    return (filter === 'all' || op.status === filter) &&
      [op.companyName, op.contactPerson, op.email, op.country].some(v => v.toLowerCase().includes(query));
  }), [operators, search, filter]);

  async function decide() {
    if (!selection || working) return;
    setWorking(true); setError(''); setMessage('');
    try {
      const access = await getAdminAccessToken();
      if (!access) throw new Error('Your admin session expired. Sign in again.');
      const {operator} = await adminApi.decision(access, selection.operator.id, selection.action);
      await reload();
      setMessage(`${operator.companyName}: ${operator.status}. Check API Key Management for actual partner status.`);
      setSelection(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to update operator status.');
      setSelection(null); await reload();
    } finally { setWorking(false); }
  }

  return <div className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#233252]">
      <div><h1 className="text-2xl font-bold text-white flex gap-2 items-center"><Building2 className="w-6 h-6 text-[#00D4FF]"/>B2B Operator Approvals</h1>
        <p className="text-xs text-[#98A5BF] mt-1">Review applications and account status. Manage partner credentials separately under API Key Management.</p></div>
      <Button variant="outline" size="sm" onClick={() => void reload()} leftIcon={<RefreshCw className="w-4 h-4"/>}>Refresh</Button>
    </div>
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {(['all','pending','approved','suspended'] as const).map(status => <button key={status} onClick={() => setFilter(status)}
        className={`rounded-xl border p-3 text-left ${filter === status ? 'border-[#00D4FF] bg-[#00D4FF]/10' : 'border-[#233252] bg-[#121A2D]'}`}>
        <p className="text-xs text-[#98A5BF] capitalize">{status === 'all' ? 'Total applications' : status}</p>
        <p className="text-xl text-white font-bold mt-1">{status === 'all' ? operators.length : operators.filter(op => op.status === status).length}</p>
      </button>)}
    </div>
    {error && <p role="alert" className="text-sm text-[#FF5D73] border border-[#FF5D73]/30 bg-[#FF5D73]/10 rounded-lg p-3">{error}</p>}
    {message && <p role="status" className="text-sm text-[#20C997] border border-[#20C997]/30 bg-[#20C997]/10 rounded-lg p-3">{message}</p>}
    <Card>
      <div className="relative max-w-lg mb-5"><Search className="w-4 h-4 absolute left-3 top-3 text-[#98A5BF]"/>
        <input aria-label="Search operators" placeholder="Search by company, contact, email or country"
          className="w-full bg-[#0B1020] border border-[#233252] text-white text-xs rounded-lg pl-9 pr-3 py-2.5"
          value={search} onChange={e => setSearch(e.target.value)}/></div>
      {loading ? <p className="text-[#98A5BF] text-sm p-4">Loading operators from backend…</p> :
        <div className="overflow-x-auto"><table className="w-full text-xs text-left text-[#98A5BF]">
          <thead><tr className="border-b border-[#233252]">
            <th className="p-3">Company</th><th className="p-3">Contact</th><th className="p-3">Country</th>
            <th className="p-3">Approval</th><th className="p-3">Selected / Allowed Games</th><th className="p-3">Partner API</th><th className="p-3">Actions</th></tr></thead>
          <tbody>{visible.map(op => <tr key={op.id} className="border-b border-[#233252]/60">
            <td className="p-3"><strong className="text-white">{op.companyName}</strong><p className="text-[11px] break-all">{op.website}</p></td>
            <td className="p-3">{op.contactPerson}<p className="text-[11px]">{op.email}</p></td>
            <td className="p-3">{op.country}</td>
            <td className="p-3"><Badge variant={op.status === 'approved' ? 'success' : op.status === 'pending' ? 'warning' : 'danger'}>{op.status}</Badge></td>
            <td className="p-3">{op.selectedGames?.length ?? 0} / {op.allowedGames?.length ?? 0}
              {op.syncRequired && <p className="text-[#FFB547]">Sync required</p>}</td>
            <td className="p-3">{op.partnerProvisioned ? (op.partnerStatus === 'active' ? 'Active' : 'Suspended') : 'Not provisioned'}
              {op.rotationRequestedAt && <p className="text-[#FFB547]">Rotation requested</p>}</td>
            <td className="p-3"><div className="flex gap-2 flex-wrap">{actionsFor(op.status).map(({action,label}) =>
              <Button key={action} size="sm" variant={action === 'approve' ? 'primary' : 'outline'}
                onClick={() => setSelection({operator:op, action, label})}>{label}</Button>)}</div></td>
          </tr>)}</tbody></table>
          {visible.length === 0 && <p className="text-center text-[#98A5BF] p-6">No registered operators match your filters.</p>}
        </div>}
    </Card>
    <div className="flex gap-2 text-xs text-[#98A5BF] items-start"><ShieldAlert className="w-4 h-4 shrink-0 text-[#FFB547]"/>
      Approval and partner API access are separate. Open API Key Management for provisioning, game sync, and activation. Live money is not supported.</div>
    <p className="text-xs text-[#98A5BF]">For provisioning, key rotation, and partner access controls go to <Link to="/admin/api-keys" className="text-[#00D4FF] underline">API Key Management</Link>.</p>
    <Modal isOpen={Boolean(selection)} onClose={() => !working && setSelection(null)} title="Confirm operator status change" maxWidth="md"
      footer={<div className="flex gap-2 justify-end"><Button variant="outline" onClick={() => setSelection(null)}>Cancel</Button>
        <Button variant="primary" isLoading={working} onClick={() => void decide()} leftIcon={<ShieldCheck className="w-4 h-4"/>}>Confirm</Button></div>}>
      <p className="text-sm text-[#98A5BF]">{selection?.label} <strong className="text-white">{selection?.operator.companyName}</strong>?</p>
      <p className="text-xs text-[#FFB547] mt-3">This action affects the operator's server-side status and may immediately restrict access.</p>
    </Modal>
  </div>;
};
