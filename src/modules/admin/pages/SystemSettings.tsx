import React from 'react';
import { Settings, Lock, RefreshCw } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { adminApi } from '../../../lib/api/admin';
import { useAdminPortalData } from '../../../lib/api/useAdminPortalData';

const featureNames: Record<string,string> = {
  b2cAuth:'Player authentication', operatorAuth:'Operator authentication',
  partnerManagement:'Partner management', leaderboards:'Leaderboards',
  leaderboardSubmissions:'Leaderboard result submissions', providerLaunch:'B2C provider launch',
  sandboxWalletTransactions:'Sandbox wallet transactions', adminPortal:'Super Admin portal',
};
export const SystemSettings: React.FC = () => {
  const {data, loading, error, reload} = useAdminPortalData(adminApi.settings);
  return <div className="space-y-6">
    <div className="flex flex-wrap justify-between items-center gap-3 border-b border-[#233252] pb-4">
      <div><h1 className="text-white text-2xl font-bold flex gap-2 items-center"><Settings className="w-5 h-5 text-[#7C5CFC]"/>Platform Settings</h1>
        <p className="text-xs text-[#98A5BF] mt-1">Safe read-only view of effective server configuration.</p></div>
      <Button size="sm" variant="outline" onClick={() => void reload()} leftIcon={<RefreshCw className="w-4 h-4"/>}>Refresh</Button>
    </div>
    {loading && <p role="status" className="text-sm text-[#98A5BF]">Loading server settings…</p>}
    {error && <p role="alert" className="text-sm text-[#FF5D73]">{error}</p>}
    {data && <><Card><h2 className="text-white font-semibold flex items-center gap-2"><Lock className="w-4 h-4 text-[#FFB547]"/>Configuration is server-managed</h2>
      <p className="text-[#98A5BF] text-sm mt-2">Settings are set using environment variables on the backend host. Edits require authorized deployment access and a service restart. There is no browser Save button because this API is read-only.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5 text-sm">
        <div><p className="text-[#98A5BF] text-xs">Environment</p><p className="text-white font-semibold">{data.environment}</p></div>
        <div><p className="text-[#98A5BF] text-xs">Storage backend</p><p className="text-white font-semibold uppercase">{data.storeBackend}</p></div>
        <div><p className="text-[#98A5BF] text-xs">Allowed browser origins</p><p className="text-white font-semibold">{data.corsOriginCount}</p></div>
        <div><p className="text-[#98A5BF] text-xs">Real money</p><Badge variant="danger">Unsupported</Badge></div>
      </div></Card>
      <Card><h2 className="text-white font-semibold mb-4">Feature flags</h2>
        <div className="grid md:grid-cols-2 gap-2">{Object.entries(data.features).map(([key,enabled]) =>
          <div key={key} className="flex justify-between gap-3 py-3 px-2 border-b border-[#233252]/60 text-sm">
            <span className="text-[#98A5BF]">{featureNames[key] || key}</span>
            <Badge variant={enabled?'success':'warning'}>{enabled?'Enabled':'Disabled'}</Badge>
          </div>)}</div></Card>
      <p className="text-xs text-[#98A5BF]">Secrets, credentials, wallet URLs, database connection strings and administrator password digests are never returned to the browser.</p>
    </>}
  </div>;
};
