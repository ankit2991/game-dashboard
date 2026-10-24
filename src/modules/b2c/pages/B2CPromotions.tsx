import React from 'react';
import { Link } from 'react-router-dom';
import { Gift, Info, Gamepad2 } from 'lucide-react';
import { Card } from '../../../components/ui/Card';

/** No promotions API exists; do not display fabricated deposit bonuses or claim actions. */
export const B2CPromotions: React.FC = () => (
  <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-6">
    <div className="border-b border-[#233252]/70 pb-5">
      <h1 className="text-2xl sm:text-3xl font-black text-white font-display flex items-center gap-3"><Gift className="w-7 h-7 text-[#7C5CFC]" />Promotions</h1>
      <p className="text-[#98A5BF] text-sm mt-2">No promotions or financial rewards are configured for the current Game Provider.</p>
    </div>
    <Card className="max-w-3xl mx-auto">
      <div className="py-8 text-center space-y-4" role="status">
        <Info className="w-9 h-9 text-[#00D4FF] mx-auto" />
        <h2 className="text-lg font-bold text-white">No verified offers available</h2>
        <p className="text-sm text-[#98A5BF] max-w-xl mx-auto leading-relaxed">This backend does not currently provide a promotions API, offer eligibility, claim endpoints, deposit bonuses or cashback. No reward can be claimed from this page.</p>
        <Link to="/games" className="inline-flex gap-2 items-center text-[#00D4FF] border border-[#233252] rounded-xl px-4 py-2.5 hover:bg-[#182238]"><Gamepad2 size={17}/> Browse available games</Link>
      </div>
    </Card>
  </div>
);
