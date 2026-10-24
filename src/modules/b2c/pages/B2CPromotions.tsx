import React, { useState } from 'react';
import {
  Gift,
  Sparkles,
  Flame,
  Calendar,
  CheckCircle2,
  Clock,
  Coins,
  ArrowRight
} from 'lucide-react';
import { Card, CardHeader } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';

export const B2CPromotions: React.FC = () => {
  const [selectedPromo, setSelectedPromo] = useState<any | null>(null);

  const promos = [
    {
      id: 'promo_welcome',
      title: '100% Welcome Multiplier Bonus up to $1,000',
      tag: 'New Players',
      badgeVariant: 'purple' as const,
      description: 'Double your initial gaming bankroll with 50 Free Spins on Gates of Olympus 1000.',
      validUntil: '31 Dec 2026',
      terms: 'Minimum deposit $20. 35x wagering requirements apply on bonus funds. Valid on all Video Slots.'
    },
    {
      id: 'promo_cashdrop',
      title: 'Weekly $50,000 Multiplier Cash Drop',
      tag: 'All Players',
      badgeVariant: 'cyan' as const,
      description: 'Play any Spribe Crash or Aviator game to trigger random multiplier drops and cash prizes.',
      validUntil: 'Weekly Recurring',
      terms: 'No minimum bet required. Cash prizes credited instantly with zero wagering requirement.'
    },
    {
      id: 'promo_vip_cashback',
      title: 'VIP 15% Weekly Loss Rebate',
      tag: 'VIP Club',
      badgeVariant: 'success' as const,
      description: 'Get up to 15% real money cashback on net casino losses every Monday morning.',
      validUntil: 'Permanent Privilege',
      terms: 'Available to VIP Tier Gold and above. Automatically credited every Monday at 00:00 UTC.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-[#233252]/60">
        <h1 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight flex items-center gap-2.5">
          <Gift className="w-7 h-7 text-[#7C5CFC]" />
          Promotions & Exclusive Player Bonuses
        </h1>
        <p className="text-xs text-[#98A5BF] mt-1">
          Boost your gameplay with deposit matches, daily cash drops, and VIP cashback privileges.
        </p>
      </div>

      {/* Promos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {promos.map((p) => (
          <Card key={p.id} hoverEffect className="flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant={p.badgeVariant} size="sm">{p.tag}</Badge>
                <span className="text-[11px] text-[#64748B] flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3" /> {p.validUntil}
                </span>
              </div>

              <h3 className="font-bold text-white text-base font-display">{p.title}</h3>
              <p className="text-xs text-[#98A5BF] leading-relaxed">{p.description}</p>
            </div>

            <div className="pt-4 mt-4 border-t border-[#233252]/60 flex items-center justify-between">
              <button
                onClick={() => setSelectedPromo(p)}
                className="text-xs text-[#00D4FF] hover:underline font-semibold"
              >
                Terms & Conditions
              </button>
              <Button variant="primary" size="sm">
                Claim Offer
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Terms Modal */}
      {selectedPromo && (
        <Modal
          isOpen={!!selectedPromo}
          onClose={() => setSelectedPromo(null)}
          title={`Promo Details: ${selectedPromo.title}`}
          maxWidth="md"
          footer={
            <Button variant="primary" size="sm" onClick={() => setSelectedPromo(null)}>
              Got it
            </Button>
          }
        >
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white">Full Promotional Terms</h4>
            <p className="text-[#98A5BF] leading-relaxed">{selectedPromo.terms}</p>
          </div>
        </Modal>
      )}
    </div>
  );
};
