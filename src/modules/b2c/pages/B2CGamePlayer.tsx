import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  RotateCw,
  Sparkles,
  Flame,
  Coins,
  ShieldCheck,
  Heart,
  Info,
  CheckCircle2,
  Play
} from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { mockGames } from '../../../data/mock/gamesData';
import type { Game } from '../../../types';

export const B2CGamePlayer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const game = mockGames.find((g) => g.id === id) || mockGames[0];
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [simulatedBalance, setSimulatedBalance] = useState(5000.00);
  const [betAmount, setBetAmount] = useState(10.00);
  const [lastWin, setLastWin] = useState<number | null>(null);
  const [multiplier, setMultiplier] = useState<string | null>(null);
  const [reelIcons, setReelIcons] = useState(['⚡', '💎', '👑', '7️⃣', '🍒']);
  const [isFavorite, setIsFavorite] = useState(false);

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleSpin = () => {
    if (simulatedBalance < betAmount) {
      alert('Insufficient demo credit. Refresh to reload credits.');
      return;
    }

    setIsSpinning(true);
    setLastWin(null);
    setMultiplier(null);
    setSimulatedBalance((prev) => prev - betAmount);

    // Randomize slot icons
    const iconsPool = ['⚡', '💎', '👑', '7️⃣', '🍒', '🔔', '🍇', '💰'];
    const timer = setInterval(() => {
      setReelIcons([
        iconsPool[Math.floor(Math.random() * iconsPool.length)],
        iconsPool[Math.floor(Math.random() * iconsPool.length)],
        iconsPool[Math.floor(Math.random() * iconsPool.length)],
        iconsPool[Math.floor(Math.random() * iconsPool.length)],
        iconsPool[Math.floor(Math.random() * iconsPool.length)]
      ]);
    }, 100);

    setTimeout(() => {
      clearInterval(timer);
      setIsSpinning(false);

      // 60% chance of win in demo mode
      const isWin = Math.random() > 0.4;
      if (isWin) {
        const mult = (Math.random() * 4 + 1.5).toFixed(1);
        const winVal = parseFloat((betAmount * parseFloat(mult)).toFixed(2));
        setMultiplier(`${mult}x`);
        setLastWin(winVal);
        setSimulatedBalance((prev) => prev + winVal);
      }
    }, 1200);
  };

  const relatedGames = mockGames.filter((g) => g.id !== game.id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Top Breadcrumb & Controls */}
      <div className="flex items-center justify-between">
        <Link
          to="/games"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#98A5BF] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Games Lobby</span>
        </Link>

        <div className="flex items-center gap-2">
          <Badge variant="cyan" size="sm" dot>
            Provider Stream: 60 FPS
          </Badge>
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className={`p-2 rounded-xl bg-[#182238] border border-[#233252] transition-colors ${
              isFavorite ? 'text-[#FF5D73]' : 'text-[#98A5BF] hover:text-white'
            }`}
            title="Favorite"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Game Screen Stage */}
      <div className="relative rounded-3xl overflow-hidden bg-[#000000] border border-[#2D3E66] shadow-2xl aspect-[16/9] min-h-[420px] sm:min-h-[540px] flex flex-col justify-between">
        {/* Top Floating Overlay Bar */}
        <div className="p-4 bg-gradient-to-b from-[#0B1020]/90 to-transparent flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <img
              src={game.thumbnail}
              alt={game.title}
              className="w-10 h-10 rounded-xl object-cover border border-white/20"
            />
            <div>
              <h2 className="font-bold text-white text-sm font-display">{game.title}</h2>
              <span className="text-[10px] text-[#00D4FF]">{game.providerName} • RTP: {game.rtp}%</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-xl bg-[#182238]/80 text-[#98A5BF] hover:text-white backdrop-blur-md border border-white/10"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-[#182238]/80 text-[#98A5BF] hover:text-white backdrop-blur-md border border-white/10"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Center Interactive Simulated Slot / Game Area */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center relative z-10">
          {/* Animated Glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className={`w-96 h-96 rounded-full blur-3xl transition-opacity duration-500 ${isSpinning ? 'bg-[#7C5CFC]/30 opacity-100' : lastWin ? 'bg-[#20C997]/30 opacity-100' : 'bg-[#00D4FF]/10 opacity-30'}`} />
          </div>

          {/* Slot Reels Container */}
          <div className="relative z-10 p-3 sm:p-6 rounded-2xl sm:rounded-3xl bg-[#121A2D]/80 border-2 border-[#7C5CFC]/50 backdrop-blur-xl shadow-2xl flex items-center justify-center gap-2 sm:gap-4 md:gap-6 max-w-full">
            {reelIcons.map((icon, idx) => (
              <div
                key={idx}
                className={`w-11 sm:w-16 md:w-20 h-16 sm:h-24 md:h-28 rounded-xl sm:rounded-2xl bg-[#0B1020] border border-[#2D3E66] flex items-center justify-center text-2xl sm:text-4xl md:text-5xl shadow-inner transition-transform flex-shrink-0 ${
                  isSpinning ? 'animate-bounce' : ''
                }`}
              >
                {icon}
              </div>
            ))}
          </div>

          {/* Win Announcement Banner */}
          {lastWin && !isSpinning && (
            <div className="mt-4 px-6 py-2 rounded-full bg-gradient-to-r from-[#20C997] to-[#00D4FF] text-[#0B1020] font-black text-sm sm:text-base font-display shadow-2xl animate-in zoom-in-95 flex items-center gap-2">
              <Sparkles className="w-5 h-5 fill-current" />
              <span>BIG WIN: +${lastWin.toFixed(2)} ({multiplier})!</span>
            </div>
          )}

          <p className="text-[11px] text-[#98A5BF] mt-3">
            Simulated Game Canvas • Verified by Nexus Provably Fair Engine
          </p>
        </div>

        {/* Bottom Interactive Dashboard Console */}
        <div className="p-4 bg-gradient-to-t from-[#0B1020] via-[#0B1020]/95 to-transparent border-t border-[#233252] flex flex-wrap items-center justify-between gap-4 z-20">
          {/* Balance & Bet Settings */}
          <div className="flex items-center gap-4">
            <div className="px-3 py-1.5 rounded-xl bg-[#182238] border border-[#2D3E66]">
              <span className="text-[10px] text-[#98A5BF] block">Demo Credit</span>
              <span className="font-mono font-bold text-sm text-[#00D4FF]">
                ${simulatedBalance.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-[#98A5BF] font-semibold">Bet:</span>
              {[5, 10, 25, 50].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setBetAmount(amt)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                    betAmount === amt
                      ? 'bg-[#7C5CFC] text-white shadow-md'
                      : 'bg-[#182238] text-[#98A5BF] hover:text-white'
                  }`}
                >
                  ${amt}
                </button>
              ))}
            </div>
          </div>

          {/* Big Spin Action Button */}
          <Button
            variant="primary"
            size="lg"
            isLoading={isSpinning}
            onClick={handleSpin}
            className="px-8 font-black font-display text-sm tracking-wider shadow-xl shadow-[#7C5CFC]/40"
            leftIcon={<RotateCw className={`w-4 h-4 ${isSpinning ? 'animate-spin' : ''}`} />}
          >
            {isSpinning ? 'SPINNING...' : 'SPIN / BET'}
          </Button>
        </div>
      </div>

      {/* Game Information & Specifications */}
      <Card>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[#98A5BF] block">Theoretical RTP</span>
            <span className="text-base font-bold text-[#20C997] font-mono">{game.rtp}%</span>
          </div>
          <div>
            <span className="text-[#98A5BF] block">Volatility Level</span>
            <span className="text-base font-bold text-white">{game.volatility}</span>
          </div>
          <div>
            <span className="text-[#98A5BF] block">Min / Max Bet</span>
            <span className="text-base font-bold text-[#00D4FF] font-mono">${game.minBet.toFixed(2)} - ${game.maxBet.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-[#98A5BF] block">Studio Engine</span>
            <span className="text-base font-bold text-white">{game.providerName}</span>
          </div>
        </div>
      </Card>

      {/* Related Games Carousel */}
      <div className="space-y-3 pt-2">
        <h3 className="text-base font-bold text-white font-display">More Games You Might Like</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {relatedGames.map((rg) => (
            <div
              key={rg.id}
              onClick={() => navigate(`/play/${rg.id}`)}
              className="p-3 rounded-2xl bg-[#121A2D] border border-[#233252] hover:border-[#7C5CFC]/40 transition-all cursor-pointer group flex items-center gap-3"
            >
              <img
                src={rg.thumbnail}
                alt={rg.title}
                className="w-12 h-12 rounded-xl object-cover border border-[#2D3E66]"
              />
              <div className="min-w-0">
                <p className="font-bold text-white text-xs truncate group-hover:text-[#00D4FF]">{rg.title}</p>
                <span className="text-[10px] text-[#98A5BF]">{rg.providerName}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
