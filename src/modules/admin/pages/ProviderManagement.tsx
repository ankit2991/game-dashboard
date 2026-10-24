import React from 'react';
import {Server, RefreshCw, ShieldAlert} from 'lucide-react';
import {adminApi} from '../../../lib/api/admin';
import {useAdminPortalData} from '../../../lib/api/useAdminPortalData';
import {Button} from '../../../components/ui/Button';
import {connectionHint} from '../../../lib/launch/connectionLabels';

/** Configuration visibility only. It cannot certify an external game wallet integration. */
export const ProviderManagement:React.FC=()=>{
  const {data,loading,error,reload}=useAdminPortalData(adminApi.integrations);
  return <div className="space-y-5"><div className="flex items-center justify-between gap-3 border-b border-[#233252] pb-4">
    <div><h1 className="text-2xl text-white font-bold flex items-center gap-2"><Server className="text-[#00D4FF]"/>Game Provider Integration Status</h1><p className="text-[#98A5BF] text-xs mt-1">Server-side configuration checks, not live game/backend or wallet settlement tests.</p></div>
    <Button size="sm" variant="outline" onClick={()=>void reload()} leftIcon={<RefreshCw className="w-4 h-4"/>}>Refresh</Button></div>
    <div className="border border-[#233252] rounded-lg bg-[#121A2D] p-3 text-[#98A5BF] text-xs flex gap-2"><ShieldAlert className="w-4 h-4 shrink-0"/>Sandbox COIN is fake credit. A game must consume the one-time handoff and settle via its own trusted backend; configuring a URL or key alone is insufficient.</div>
    {loading && <p role="status" className="text-[#98A5BF] text-sm">Checking backend configuration…</p>}
    {error && <p role="alert" className="text-[#FF5D73] text-sm">Unable to retrieve integration diagnostics: {error}</p>}
    {data && <>
      <div className="border border-[#233252] rounded-lg bg-[#121A2D] p-4 space-y-2">
        <div className="text-white font-semibold">Player Sandbox Wallet — {data.wallet.configurationReady ? (data.wallet.balanceProvider === 'provider_sandbox' ? 'Internal MongoDB COIN wallet configured — check player balance to verify' : 'External wallet configured — remote balance not verified') : 'Configuration blocked'}</div>
        {!data.wallet.walletWritesEnabled && <div className="text-xs text-[#FFB547]">Game betting and payout transactions are disabled. Patch 1 enables balance preview only.</div>}
        {data.wallet.blockers.length ? <ul className="list-disc list-inside text-xs text-[#FFB547] space-y-1">{data.wallet.blockers.map(code=><li key={code}>{connectionHint(code)}</li>)}</ul>
          : <p className="text-xs text-[#98A5BF]">Check the player's real read-only balance from the player portal and verify a separate game backend end-to-end before enabling launch.</p>}
      </div>
      <div className="border border-[#233252] rounded-xl bg-[#121A2D] overflow-x-auto"><table className="w-full text-left text-sm"><thead className="text-[#98A5BF] border-b border-[#233252]"><tr><th className="p-3">Game</th><th className="p-3">Catalog</th><th className="p-3">Provider configuration</th><th className="p-3">Missing requirements</th></tr></thead><tbody className="text-[#CDD6E8]">{data.games.map(game=><tr key={game.gameId} className="border-b border-[#233252]/50"><td className="p-3 text-white">{game.name}</td><td className="p-3">{game.catalogEnabled?'Enabled':'Disabled'}</td><td className="p-3">{game.providerConfigurationReady?'Awaiting external E2E verification':'Blocked'}</td><td className="p-3"><div className="space-y-1 text-xs">{game.blockers.map(code=><p key={code} className="text-[#FFB547]">{connectionHint(code)}</p>)}{!game.blockers.length && <span>Game backend adapter and settlement have not been verified</span>}</div></td></tr>)}</tbody></table></div>
    </>}
  </div>;
};
