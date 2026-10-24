import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

export const CatalogStatus: React.FC<{ loading: boolean; error: string | null; empty: boolean; retry: () => void }> = ({ loading, error, empty, retry }) => {
  if (loading) return (
    <div className="rounded-2xl bg-[#121A2D] border border-[#233252] p-10 text-center text-[#98A5BF] text-sm" role="status">
      <RefreshCw className="w-7 h-7 mx-auto mb-3 animate-spin text-[#00D4FF]" /> Loading games from the provider…
    </div>
  );
  if (error) return (
    <div className="rounded-2xl bg-[#121A2D] border border-[#FF5D73]/30 p-8 text-center" role="alert">
      <AlertCircle className="w-7 h-7 mx-auto mb-3 text-[#FF5D73]" />
      <p className="font-bold text-white">Game catalog is currently unavailable</p>
      <p className="text-xs text-[#98A5BF] mt-2 mb-4">{error}</p>
      <Button variant="outline" onClick={retry}><RefreshCw className="w-4 h-4 mr-2" /> Retry</Button>
    </div>
  );
  if (empty) return <div className="rounded-2xl bg-[#121A2D] border border-[#233252] p-10 text-center text-[#98A5BF] text-sm">No games are currently enabled in the provider catalog.</div>;
  return null;
};
