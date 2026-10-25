import React, { useState } from 'react';
import { BookOpen, Copy, ExternalLink, LockKeyhole, ShieldCheck } from 'lucide-react';
import { apiBaseUrl } from '../../../lib/api/client';

/** Human-readable reference matching the checked-in OpenAPI contract.
 * Partner API secrets are only shown through a deliberate one-time password-confirmed claim. They are NEVER inserted in example requests or saved by React. */
export const OperatorDocs: React.FC = () => {
  const [message, setMessage] = useState<string | null>(null);
  const examples = [
    {
      name: 'Public games catalog',
      about: 'The public catalog lists the seven configured game IDs and demo links. A catalog entry does not mean its wallet adapter has passed E2E tests.',
      code: `GET ${apiBaseUrl}/games`,
    },
    {
      name: 'Partner identity (server to server)',
      about: 'Pass the Partner API key from your operator backend, never from browser JavaScript or a VITE_* variable.',
      code: `curl "${apiBaseUrl}/partner/me" -H 'Authorization: Bearer <PARTNER_API_KEY>'`,
    },
    {
      name: 'Partner demo launch (server to server)',
      about: 'The partner must be authorized to launch the requested game; demo mode does not create a wallet session.',
      code: `curl -X POST "${apiBaseUrl}/launch" \\\n  -H 'Authorization: Bearer <PARTNER_API_KEY>' \\\n  -H 'Content-Type: application/json' \\\n  -d '{"gameId":"pinball","mode":"demo"}'`,
    },
    {
      name: 'Partner sandbox ticket (server to server)',
      about: 'This issues a short-lived adapter handoff token. The game backend must exchange it securely before accessing any sandbox wallet contract.',
      code: `curl -X POST "${apiBaseUrl}/launch" \\\n  -H 'Authorization: Bearer <PARTNER_API_KEY>' \\\n  -H 'Content-Type: application/json' \\\n  -d '{"gameId":"pinball","mode":"provider","externalPlayerId":"player_example"}'`,
    },
    {
      name: 'Adapter token exchange (game backend only)',
      about: 'The game backend supplies its private game-specific adapter key. Never place this key in the game frontend.',
      code: `curl -X POST "${apiBaseUrl}/launch/consume" \\\n  -H 'X-Game-Adapter-Key: <GAME_ADAPTER_KEY>' \\\n  -H 'Content-Type: application/json' \\\n  -d '{"gameId":"pinball","launchToken":"<LAUNCH_TOKEN>","exchangeId":"exchange_00123456"}'`,
    },
    {
      name: 'Browser sandbox availability (public, read-only)',
      about: 'Reports whether handoff configuration exists for each game. It does NOT verify that the game backend has consumed tickets or that money can be settled.',
      code: `GET ${apiBaseUrl}/player/launch-options`,
    },
  ];
  const copy = async (value: string) => {
    try { await navigator.clipboard.writeText(value); setMessage('Example copied'); }
    catch { setMessage('Unable to copy: select the snippet manually'); }
  };
  return <div className="mx-auto max-w-5xl space-y-6">
    <div className="space-y-2">
      <h1 className="text-2xl font-bold text-white flex items-center gap-3"><BookOpen className="h-6 w-6 text-[#00D4FF]"/>Game Provider API Reference</h1>
      <p className="text-sm text-[#98A5BF]">Real endpoints supported by this backend. These are integration examples, not proof that an external game backend is already deployed.</p>
    </div>
    <div className="rounded-xl bg-[#182238] border border-[#233252] p-4 space-y-2">
      <div className="flex items-center gap-2 text-white font-medium"><ShieldCheck className="w-5 h-5 text-[#20C997]"/>Sandbox only — no live-money support</div>
      <p className="text-sm text-[#98A5BF]">Operator accounts and Partner API keys are separate. Admin must approve the requested games and provision a Partner. The operator can then securely claim a newly rotated API key once on the Credentials page. Wallet transactions require a separately authorized server-side adapter and sandbox operator wallet.</p>
      <p className="text-xs text-[#98A5BF] break-all">API base: <code>{apiBaseUrl}</code></p>
    </div>
    <div className="space-y-4">{examples.map(item => <section key={item.name} className="rounded-xl border border-[#233252] bg-[#121A2D] p-5 space-y-3">
      <h2 className="text-white font-semibold flex gap-2 items-center"><LockKeyhole className="w-4 h-4 text-[#00D4FF]"/>{item.name}</h2>
      <p className="text-[#98A5BF] text-xs">{item.about}</p>
      <div className="relative"><pre className="overflow-x-auto whitespace-pre-wrap break-all rounded-lg bg-[#090F20] border border-[#233252] p-4 pr-12 text-xs text-[#CFE6F4]">{item.code}</pre>
        <button type="button" aria-label={`Copy ${item.name}`} onClick={() => void copy(item.code)} className="absolute right-3 top-3 text-[#98A5BF] hover:text-white"><Copy className="w-4 h-4"/></button></div>
    </section>)}</div>
    <div className="rounded-xl border border-[#233252] bg-[#121A2D] p-4 space-y-2">
      <p className="text-white font-semibold">Adapter integration checklist</p>
      <p className="text-sm text-[#98A5BF]">Each game backend must securely read the one-time fragment token, exchange it using its server-only adapter key, verify the response, and integrate sandbox wallet callbacks. No automatic claim of successful end-to-end integration is made here.</p>
      <a href="https://game-provider-be-free.onrender.com/api/v1/provider" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[#00D4FF] text-sm">Provider feature status <ExternalLink className="w-4 h-4"/></a>
    </div>
    {message && <p role="status" className="text-xs text-[#20C997]">{message}</p>}
  </div>;
};
