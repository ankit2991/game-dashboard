import React from 'react';
import { Link } from 'react-router-dom';
import { Info } from 'lucide-react';
import { Card } from '../../../components/ui/Card';

/** Preserves legacy bookmarks without claiming unsupported server functionality. */
export const UnavailablePlayerFeature: React.FC<{ feature: 'favorites' | 'security' }> = ({ feature }) => {
  const favorites = feature === 'favorites';
  return <Card className="max-w-3xl mx-auto"><div className="p-6 space-y-3">
    <h1 className="text-xl font-bold text-white flex items-center gap-2"><Info size={22} className="text-[#FFB547]"/>{favorites ? 'Saved games are not available' : 'Account security settings are not available'}</h1>
    <p className="text-[#98A5BF] text-sm leading-relaxed">{favorites
      ? 'Your player account does not have a saved-games or favorites API. The full game catalog is available, but games shown there are not personal favorites.'
      : 'The provider does not offer a password-change, 2FA enrollment, or session-device-management API for players. Do not treat this page as a security settings screen.'}</p>
    <Link to={favorites ? '/games' : '/player/profile'} className="inline-flex text-[#00D4FF] text-sm underline">{favorites ? 'Browse available games' : 'Return to your profile'}</Link>
  </div></Card>;
};
