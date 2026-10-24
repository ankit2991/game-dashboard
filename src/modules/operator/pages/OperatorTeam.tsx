import React, { useState } from 'react';
import { Users } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { operatorOperationsApi, type TeamRole } from '../../../lib/api/operator';
import { useOperatorOperations } from '../../../lib/operator/useOperatorOperations';
export const OperatorTeam: React.FC = () => {
  const { data, loading, error, refresh, getOperatorAccessToken } = useOperatorOperations(operatorOperationsApi.team);
  const [name, setName] = useState(''); const [email, setEmail] = useState('');
  const [role, setRole] = useState<TeamRole>('Developer');
  const [busy, setBusy] = useState(false); const [message, setMessage] = useState('');
  const add = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setMessage('');
    try { const token = await getOperatorAccessToken(); if (!token) throw Error('Session expired.');
      await operatorOperationsApi.addTeamDraft(token, { name: name.trim(), email: email.trim(), role });
      setName(''); setEmail(''); setMessage('Roster entry saved. No invitation email was sent; access was not granted.'); refresh();
    } catch (err) { setMessage(err instanceof Error ? err.message : 'Could not add entry'); }
    finally { setBusy(false); }
  };
  const remove = async (id: string) => {
    setBusy(true); setMessage(''); try { const token = await getOperatorAccessToken(); if (!token) throw Error('Session expired.');
      await operatorOperationsApi.removeTeamDraft(token, id); refresh();
    } catch (err) { setMessage(err instanceof Error ? err.message : 'Could not remove entry'); }
    finally { setBusy(false); }
  };
  return <div className="space-y-6"><div className="border-b border-[#233252] pb-4"><h1 className="text-2xl font-bold text-white flex items-center gap-2"><Users className="text-[#00D4FF]"/>Operator Team Roster</h1>
      <p className="text-[#98A5BF] text-xs mt-1">Manage proposed team entries. Invitations, member login and role-based access are not yet enabled; only the authenticated account owner can access this portal.</p></div>
    <Card><form className="flex flex-wrap gap-3 items-end" onSubmit={e => void add(e)}><label className="text-[#98A5BF] text-xs">Full name<input required minLength={2} maxLength={80} value={name} onChange={e => setName(e.target.value)} className="block rounded-lg bg-[#0B1020] border border-[#233252] text-white p-2 mt-1"/></label>
      <label className="text-[#98A5BF] text-xs">Email<input required type="email" maxLength={254} value={email} onChange={e => setEmail(e.target.value)} className="block rounded-lg bg-[#0B1020] border border-[#233252] text-white p-2 mt-1"/></label>
      <label className="text-[#98A5BF] text-xs">Proposed role<select value={role} onChange={e => setRole(e.target.value as TeamRole)} className="block rounded-lg bg-[#0B1020] border border-[#233252] text-white p-2 mt-1"><option>Developer</option><option>Finance</option><option>Operations</option></select></label>
      <Button type="submit" size="sm" disabled={busy || loading || !!error}>Save roster entry</Button></form>
      {message && <p role="status" className="text-[#00D4FF] text-xs mt-3">{message}</p>}
      {error && <p role="alert" className="text-[#FF5D73] text-xs mt-3">{error}</p>}
    </Card>
    <Card><h2 className="text-white font-semibold mb-3">Proposed members ({data?.members.length ?? 0})</h2>
      {loading ? <p role="status" className="text-[#98A5BF]">Loading roster…</p> : error ? <p className="text-[#FF5D73] text-sm">Roster unavailable. <button type="button" className="underline" onClick={refresh}>Retry</button></p> : !data?.members.length ? <p className="text-[#98A5BF] text-sm">No roster entries saved.</p> :
        <div className="space-y-2">{data.members.map(m => <div key={m.id} className="flex gap-3 items-center justify-between border-t border-[#233252] pt-3 text-sm"><div><p className="text-white">{m.name} · {m.role}</p><p className="text-[#98A5BF] text-xs">{m.email} · Draft (no access)</p></div><Button size="sm" variant="danger" disabled={busy} onClick={() => void remove(m.id)}>Remove</Button></div>)}</div>}
    </Card>
  </div>;
};
