import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Gamepad2, Info, LockKeyhole, Users, UserRound } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { CatalogStatus } from '../../../components/catalog/CatalogStatus';
import { useProviderCatalog } from '../../../lib/catalog/useProviderCatalog';
import { getCatalogArtwork, getSafeDemoUrl } from '../../../lib/catalog/catalogModel';
import { launchApi, validateLaunchResponse, type BrowserGameLaunch, type LaunchMode } from '../../../lib/api/launch';
import { isLaunchTicketFresh } from '../../../lib/launch/launchModel';
import type { LaunchCapabilitiesResponse } from '../../../lib/launch/capabilitiesModel';
import { useAuth } from '../../../context/AuthContext';

/** Patch 4: a launch must be approved by the BE, not simulated in React. */
export const B2CGamePlayer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { games, loading, error, refresh } = useProviderCatalog();
  const { user, getPlayerAccessToken, isInitializing } = useAuth();
  const game = games.find((entry) => entry.gameId === id);
  const art = game ? getCatalogArtwork(game.gameId) : null;
  const demo = game ? getSafeDemoUrl(game.demoUrl) : null;
  const [capabilities, setCapabilities] = useState<LaunchCapabilitiesResponse | null>(null);
  const [capabilityError, setCapabilityError] = useState<string | null>(null);
  const [capabilityLoading, setCapabilityLoading] = useState(true);
  const selectedCapability = capabilities?.games.find(entry => entry.gameId === id);
  const providerConfigured = selectedCapability?.providerHandoffConfigured === true;
  const [pending, setPending] = useState<LaunchMode | null>(null);
  const [launch, setLaunch] = useState<BrowserGameLaunch | null>(null);
  const [launchError, setLaunchError] = useState<string | null>(null);
  const [launchTime, setLaunchTime] = useState(Date.now());
  const [failedMode, setFailedMode] = useState<LaunchMode>('demo');
  const request = useRef<AbortController | null>(null);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    setLaunch(null);
    setLaunchError(null);
    setPending(null);
    return () => { alive.current = false; request.current?.abort(); request.current = null; };
  }, [id]);

  useEffect(() => {
    const controller = new AbortController();
    setCapabilities(null);
    setCapabilityError(null);
    setCapabilityLoading(true);
    launchApi.capabilities(controller.signal)
      .then(value => { if (!controller.signal.aborted) setCapabilities(value); })
      .catch(cause => { if (!controller.signal.aborted) setCapabilityError(cause instanceof Error ? cause.message : 'Launch status unavailable.'); })
      .finally(() => { if (!controller.signal.aborted) setCapabilityLoading(false); });
    return () => controller.abort();
  }, [id]);

  // Never leave an expired link clickable: render a fresh-ticket action instead.
  useEffect(() => {
    if (!launch || launch.mode !== 'provider' || !launch.expiresAt) return;
    setLaunchTime(Date.now());
    const remaining = Date.parse(launch.expiresAt) - Date.now() - 10_000;
    const timer = window.setTimeout(() => setLaunchTime(Date.now()), Math.max(0, remaining));
    return () => window.clearTimeout(timer);
  }, [launch]);

  const startGame = async (mode: LaunchMode) => {
    if (!game || pending || (mode === 'provider' && !providerConfigured)) return;
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setPending(mode);
    setLaunch(null);
    setLaunchError(null);
    try {
      let accessToken: string | undefined;
      if (mode === 'provider') {
        const token = await getPlayerAccessToken();
        if (!token) throw new Error('Sign in with a player account to start a provider session.');
        accessToken = token;
      }
      if (controller.signal.aborted) return;
      const issued = await launchApi.start(game.gameId, mode, { accessToken, signal: controller.signal });
      const safe = validateLaunchResponse(issued, game.gameId, mode, game.demoUrl);
      if (alive.current && !controller.signal.aborted) setLaunch(safe);
    } catch (cause) {
      if (alive.current && !controller.signal.aborted) {
        setFailedMode(mode);
        setLaunchError(cause instanceof Error ? cause.message : 'Cannot start the game right now.');
      }
    } finally {
      if (request.current === controller) request.current = null;
      if (alive.current && !controller.signal.aborted) setPending(null);
    }
  };

  const launchFresh = launch ? isLaunchTicketFresh(launch, launchTime) : false;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-5 min-h-[55vh]">
      <Link to="/games" className="inline-flex gap-2 items-center text-[#00D4FF] hover:underline text-sm"><ArrowLeft className="w-4 h-4"/>Back to games</Link>
      <CatalogStatus loading={loading} error={error} empty={!games.length && !loading && !error} retry={refresh}/>
      {!loading && !error && games.length > 0 && !game && <div role="alert" className="p-8 bg-[#121A2D] border border-[#233252] rounded-2xl text-[#98A5BF]">This game is not in the enabled provider catalog. <Link to="/games" className="text-[#00D4FF] underline">Browse games</Link>.</div>}
      {!loading && !error && game && art && <div className="rounded-3xl bg-[#121A2D] border border-[#233252] overflow-hidden">
        <div className="p-8 sm:p-12 flex items-center justify-center relative min-h-52" style={{ background: `radial-gradient(circle at center, ${art.accent}40, #121A2D 70%)` }}><img src={art.icon ?? undefined} alt={`${game.name} icon`} className="h-52 w-52 sm:h-64 sm:w-64 object-contain drop-shadow-2xl" /></div>
        <div className="p-6 sm:p-10 space-y-5">
          <div className="flex flex-wrap gap-3 items-center"><Badge variant="cyan">{art.genre}</Badge><Badge variant={providerConfigured ? 'success' : 'neutral'}>{providerConfigured ? 'Sandbox handoff configured' : 'Demo only / Sandbox unavailable'}</Badge></div>
          <h1 className="text-3xl font-black font-display text-white">{game.name}</h1>
          <p className="text-[#98A5BF] text-sm">{art.blurb}</p>
          <p className="text-[#98A5BF] text-xs flex items-center gap-2">{game.gameMode === 'multiplayer' ? <Users className="w-4 h-4"/> : <UserRound className="w-4 h-4"/>}{game.gameMode === 'multiplayer' ? 'Multiplayer' : 'Single player'} · Game ID: {game.gameId}</p>
          <div className="rounded-xl p-4 bg-[#182238] border border-[#233252] flex gap-3"><Info className="w-5 h-5 shrink-0 text-[#00D4FF]"/><p className="text-[#98A5BF] text-xs">Demo uses the external game without a provider wallet. Provider mode requires a signed-in player, an approved backend adapter and a configured sandbox wallet. Real-money play is not supported.</p></div>
          <div className="flex flex-wrap gap-3 items-center">
            {demo ? <button type="button" onClick={() => void startGame('demo')} disabled={!!pending} className="inline-flex gap-2 items-center px-6 py-3.5 rounded-xl font-semibold bg-[#7C5CFC] hover:bg-[#6947eb] disabled:opacity-60 text-white">{pending === 'demo' ? 'Preparing demo…' : 'Start demo'} <Gamepad2 className="w-4 h-4"/></button>
              : <span className="text-[#FFB547] text-sm">No demo URL is configured.</span>}
            {providerConfigured && <button type="button" onClick={() => void startGame('provider')} disabled={!!pending || isInitializing || !demo} className="inline-flex gap-2 items-center px-6 py-3.5 rounded-xl font-semibold bg-[#182238] border border-[#445472] hover:bg-[#233252] disabled:opacity-60 text-white"><LockKeyhole className="w-4 h-4"/>{pending === 'provider' ? 'Checking session…' : 'Start provider sandbox'}</button>}
          </div>
          {providerConfigured && !isInitializing && user?.role !== 'player' && <p className="text-[#98A5BF] text-sm">Provider mode requires your real player account. <Link to="/login" className="underline text-[#00D4FF]">Sign in</Link>.</p>}
          {capabilityLoading && <p className="text-[#98A5BF] text-xs" role="status">Checking sandbox launch configuration…</p>}
          {capabilityError && <p role="alert" className="text-[#FFB547] text-xs">Sandbox launch status unavailable: {capabilityError}. Demo launch remains available.</p>}
          {selectedCapability && !providerConfigured && <p className="text-[#98A5BF] text-xs">Sandbox launch is not configured for this game. Demo play is separate from the provider wallet.</p>}
          {selectedCapability?.providerHandoffConfigured && !selectedCapability.gameBackendConfigured && <p className="text-[#FFB547] text-xs">Game backend URL is not configured; a successful handoff cannot be verified.</p>}
          {id === 'pinball' && selectedCapability?.providerHandoffConfigured && user?.role === 'player' && <p className="text-[#98A5BF] text-xs">Before playing, check your <Link to="/player/wallet" className="underline text-[#00D4FF]">verified COIN wallet</Link>. Demo credits and Provider COIN are separate. After playing, refresh the wallet to see the operator-confirmed balance and transaction history.</p>}
          {id === 'pinball' && selectedCapability?.pinballSandboxPilotConfigured && <p className="text-[#00D4FF] text-xs">Pinball COIN pilot is configured on the Provider. The game itself must also run the verified provider-enabled FE and BE; no real money is supported.</p>}
          {id !== 'pinball' && selectedCapability?.sandboxPilotConfigured && <p className="text-[#00D4FF] text-xs">The COIN pilot is configured for this game on the Provider. Its own FE and BE still need to support and deploy the signed launch and authoritative wallet callbacks. Static settings do not prove gameplay is integrated; no real money is supported.</p>}
          {providerConfigured && <p className="text-[#98A5BF] text-xs">Configuration is present, but a complete game backend handoff has not been verified. Sandbox only.</p>}
          {launchError && <div role="alert" className="border border-red-500/40 bg-red-500/10 rounded-xl p-4 text-sm text-red-300">{launchError} <button type="button" onClick={() => { setLaunchError(null); void startGame(failedMode); }} className="underline ml-2">Retry launch</button></div>}
          {launch && <div role="status" className="rounded-xl bg-[#162A29] border border-emerald-700/40 p-5 space-y-3">
            <p className="text-white font-semibold">{launch.mode === 'demo' ? 'Demo is ready' : 'Sandbox launch ticket created'}</p>
            <p className="text-[#98A5BF] text-xs">{launch.mode === 'demo' ? 'Opens the separately hosted demo with no real-money wallet.' : 'Open the game before the one-time ticket expires. the game backend must accept it before a wallet session exists; a ticket alone does not prove that the game is integrated.'}</p>
            {launch.mode === 'provider' && launch.expiresAt && <p className="text-[#98A5BF] text-xs">Ticket expires: {new Date(launch.expiresAt).toLocaleString()}</p>}
            {launchFresh ? <button type="button" onClick={() => {
              // Check again at the actual click, not merely at render time.
              if (!isLaunchTicketFresh(launch)) { setLaunchTime(Date.now()); return; }
              const url = validateLaunchResponse(launch, game.gameId, launch.mode, game.demoUrl).launchUrl;
              window.open(url, '_blank', 'noopener,noreferrer');
            }} className="inline-flex gap-2 items-center px-5 py-3 rounded-xl bg-[#00D4FF] text-[#091526] font-bold text-sm">Open {launch.mode === 'demo' ? 'demo' : 'sandbox game'} <ArrowUpRight className="w-4 h-4"/></button>
              : <div role="alert" className="space-y-2"><p className="text-amber-300 text-sm">Your launch ticket has expired. Generate a new one before opening the game.</p><button type="button" disabled={!!pending} onClick={() => void startGame('provider')} className="inline-flex items-center px-5 py-3 rounded-xl bg-[#00D4FF] text-[#091526] font-bold text-sm disabled:opacity-60">Generate fresh launch ticket</button></div>}
          </div>}
        </div>
      </div>}
    </div>
  );
};
