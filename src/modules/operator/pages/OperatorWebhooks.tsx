import React, { useEffect, useState } from 'react';
import { Webhook } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { operatorOperationsApi } from '../../../lib/api/operator';
import { useOperatorOperations } from '../../../lib/operator/useOperatorOperations';
const SUPPORTED = ['wallet.bet','wallet.win','wallet.refund'];
export const OperatorWebhooks: React.FC = () => {
  const { data, loading, error, refresh, getOperatorAccessToken } = useOperatorOperations(operatorOperationsApi.webhooks);
  const [url, setUrl] = useState(''); const [events, setEvents] = useState<string[]>([]);
  const [busy, setBusy] = useState(false); const [message, setMessage] = useState('');
  useEffect(() => { if (data) { setUrl(data.url); setEvents(data.events); } }, [data]);
  const save = async () => {
    setBusy(true); setMessage('');
    try { const token = await getOperatorAccessToken(); if (!token) throw Error('Session expired.');
      const result = await operatorOperationsApi.saveWebhook(token, url.trim(), events);
      setMessage(result.note); refresh();
    } catch (e) { setMessage(e instanceof Error ? e.message : 'Could not save.'); }
    finally { setBusy(false); }
  };
  return <div className="space-y-6"><div className="border-b border-[#233252] pb-4"><h1 className="text-2xl font-bold text-white flex items-center gap-2"><Webhook className="text-[#00D4FF]"/>Webhook Configuration</h1>
    <p className="text-xs text-[#98A5BF] mt-1">Store a future HTTPS callback destination. This release does not dispatch events, sign payloads, or send test pings.</p></div>
    <Card><label htmlFor="operator-hook-url" className="block text-sm text-white font-semibold mb-2">HTTPS callback URL</label>
      <input id="operator-hook-url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://hooks.yourcompany.com/provider" className="w-full max-w-xl rounded-lg border border-[#233252] bg-[#0B1020] p-3 text-white text-sm" />
      <p className="text-xs text-[#98A5BF] mt-2">Only public HTTPS hostnames are accepted. Clear the URL and deselect events to remove the draft.</p>
      <fieldset className="my-4"><legend className="text-sm text-white font-semibold mb-2">Planned events (not yet delivered)</legend>
        {SUPPORTED.map(ev => <label key={ev} className="block text-xs text-white mb-2"><input type="checkbox" checked={events.includes(ev)} onChange={e => setEvents(old => e.target.checked ? [...old,ev] : old.filter(x => x !== ev))} className="mr-2"/>{ev}</label>)}</fieldset>
      {loading && <p className="text-[#98A5BF] text-sm">Loading configuration…</p>}
      {error && <p className="text-[#FF5D73] text-sm" role="alert">{error}</p>}
      {message && <p role="status" className="text-[#00D4FF] text-sm mb-3">{message}</p>}
      <Button size="sm" disabled={busy || loading || !!error} onClick={() => void save()}>Save webhook draft</Button>
    </Card>
    <Card><h2 className="text-white font-semibold mb-2">Delivery status</h2><p className="text-sm text-[#98A5BF]">Disabled. No deliveries have been sent or verified. Real wallet callbacks use separately configured server-side provider integration, not this draft.</p></Card>
  </div>;
};
