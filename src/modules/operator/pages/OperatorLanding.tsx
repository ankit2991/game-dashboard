import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Building2, BookOpen, Gamepad2, LockKeyhole, RefreshCw, ShieldCheck, Wallet } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { useProviderCatalog } from '../../../lib/catalog/useProviderCatalog';
import { getCatalogArtwork } from '../../../lib/catalog/catalogModel';

/** Public operator page: every game and count is derived from the provider API. */
export const OperatorLanding: React.FC = () => {
  const { games, loading, error, refresh } = useProviderCatalog();
  return (
    <div className="min-h-screen bg-[#0B1020] text-[#F5F7FF] flex flex-col font-sans">
      <header className="border-b border-[#233252] bg-[#121A2D]/90 sticky top-0 z-30 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-4 items-center justify-between">
          <Link to="/operator" className="flex items-center gap-3 font-display font-bold tracking-wide text-lg">
            <span className="p-2 rounded-xl bg-[#182238] border border-[#233252]"><Building2 className="text-[#00D4FF]" size={22} /></span>
            NEXUS <span className="text-[#00D4FF]">PROVIDER</span>
          </Link>
          <nav className="flex items-center gap-2 sm:gap-3 text-xs">
            <Link to="/operator/docs" className="text-[#98A5BF] hover:text-white px-2 py-2">API reference</Link>
            <Link to="/operator/login"><Button size="sm" variant="outline">Operator login</Button></Link>
            <Link to="/operator/register"><Button size="sm" variant="cyan">Register company</Button></Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="px-4 sm:px-6 pt-16 pb-12 border-b border-[#233252]">
          <div className="max-w-5xl mx-auto text-center space-y-5">
            <Badge variant="cyan" size="md">Game provider · Sandbox stage</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold font-display leading-tight">One API for the <span className="text-[#00D4FF]">configured game catalog</span></h1>
            <p className="text-[#98A5BF] text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
              Browse games currently enabled in our backend catalog and request access as an operator.
              Demo launches and sandbox provider handoffs are different features; financial settlement and production availability are not implied.
            </p>
            <div className="flex justify-center flex-wrap gap-3">
              <Link to="/operator/register"><Button variant="cyan" rightIcon={<ArrowRight size={16}/>}>Request operator account</Button></Link>
              <Link to="/operator/docs"><Button variant="outline" leftIcon={<BookOpen size={16}/>}>Read API reference</Button></Link>
            </div>
            <div className="mx-auto max-w-xl rounded-xl border border-[#233252] bg-[#121A2D] px-5 py-4 mt-8" aria-live="polite">
              <div className="text-xs text-[#98A5BF]">Backend catalog status</div>
              {loading ? <div role="status" className="mt-1 text-white font-semibold">Loading catalog…</div>
                : error ? <div className="mt-2 text-sm text-[#FFB547]" role="alert">Catalog unavailable: {error} <button onClick={refresh} className="inline-flex items-center gap-1 ml-2 text-[#00D4FF] underline"><RefreshCw size={13}/> Retry</button></div>
                : <div className="mt-1 text-white text-xl font-bold">{games.length} enabled {games.length === 1 ? 'game' : 'games'}</div>}
              <div className="text-xs text-[#64748B] mt-2">Counts reflect the API response, not a claim of launch readiness or uptime.</div>
            </div>
          </div>
        </section>

        <section id="games" className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
          <div className="flex justify-between items-end gap-4 mb-6">
            <div><h2 className="text-2xl font-bold text-white font-display">Available titles</h2><p className="text-[#98A5BF] text-xs mt-2">Only games returned by the live catalog API are listed.</p></div>
            <Link to="/games" className="text-[#00D4FF] text-sm hover:underline">Player game catalog →</Link>
          </div>
          {!loading && !error && games.length === 0 && <p role="status" className="p-6 border border-[#233252] rounded-xl text-[#98A5BF]">No games are currently enabled by the provider.</p>}
          {error && <p className="p-6 border border-[#233252] rounded-xl text-[#98A5BF]">Games cannot be shown until the catalog API responds successfully.</p>}
          {loading && <p role="status" className="p-6 text-[#98A5BF]">Loading games…</p>}
          {!loading && !error && games.length > 0 && <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {games.map(game => <Link to={`/play/${game.gameId}`} key={game.gameId} className="flex items-center gap-3 p-4 rounded-2xl border border-[#233252] bg-[#121A2D] hover:border-[#00D4FF]/60 transition-colors min-w-0">
              <img src={getCatalogArtwork(game.gameId).icon ?? undefined} alt={`${game.name} icon`} className="w-12 h-12 rounded-xl object-contain shrink-0" loading="lazy"/>
              <span className="min-w-0"><span className="block text-white font-semibold text-sm break-words">{game.name}</span><span className="text-[#98A5BF] text-xs">View game details</span></span>
            </Link>)}
          </div>}
        </section>

        <section className="bg-[#121A2D]/60 border-y border-[#233252] px-4 sm:px-6 py-14">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">How operator onboarding works</h2>
            <div className="grid md:grid-cols-3 gap-5">
              {[
                { icon: Building2, title: '1. Register', description: 'Submit your operator account details. A new account starts in pending approval.' },
                { icon: ShieldCheck, title: '2. Obtain approval', description: 'An administrator reviews your account. Approval does not automatically issue partner API keys.' },
                { icon: LockKeyhole, title: '3. Configure sandbox', description: 'An administrator provisions access to selected games. Game adapters and sandbox wallet integration must pass separate checks.' },
              ].map(step => <article key={step.title} className="rounded-2xl bg-[#0B1020] border border-[#233252] p-6 space-y-3">
                <step.icon className="text-[#00D4FF]" size={24}/><h3 className="font-bold">{step.title}</h3><p className="text-[#98A5BF] text-xs leading-relaxed">{step.description}</p>
              </article>)}
            </div>
            <div className="flex flex-wrap gap-2 justify-center mt-7 text-xs text-[#98A5BF]"><Wallet size={16}/><span>Live-money settlement, guaranteed SLA, instant key issuance, and third-party studios are not advertised as active features.</span><Gamepad2 size={16}/></div>
          </div>
        </section>
      </main>
      <footer className="px-6 py-6 border-t border-[#233252] text-[#98A5BF] text-xs text-center">Game Provider · Sandbox integration portal · <Link to="/operator/docs" className="text-[#00D4FF]">API documentation</Link></footer>
    </div>
  );
};
