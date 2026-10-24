import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserRound, Edit2, Play, Wallet, Trophy, CalendarDays, Shield } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { Card, CardHeader } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { useProviderCatalog } from '../../../lib/catalog/useProviderCatalog';
import { getCatalogArtwork } from '../../../lib/catalog/catalogModel';
import type { PlayerProfile } from '../../../lib/api/player';

function memberSince(value: string | undefined) {
  if (!value || !Number.isFinite(Date.parse(value))) return 'Not available';
  return new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

export const PlayerOverview: React.FC = () => {
  const { user, loadPlayerProfile, updatePlayerProfile } = useAuth();
  const catalog = useProviderCatalog();
  const [profileState, setProfileState] = useState<PlayerProfile | null>(null);
  const playerId = user?.role === 'player' ? user.id : null;
  // Never render a prior account's private profile during a session/account change.
  const profile = profileState?.id === playerId ? profileState : null;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [locale, setLocale] = useState('en');
  const [editError, setEditError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    setProfileState(null);
    loadPlayerProfile().then(result => {
      if (result.id !== playerId) throw new Error('Profile does not match the active player session.');
      if (active) setProfileState(result);
    })
      .catch((cause: unknown) => {
        if (active) { setProfileState(null); setError(cause instanceof Error ? cause.message : 'Unable to load profile.'); }
      }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [loadPlayerProfile, playerId, revision]);

  const openEdit = () => {
    if (!profile) return;
    setDisplayName(profile.displayName);
    setLocale(profile.locale);
    setEditError(null);
    setEditing(true);
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setEditError(null);
    const name = displayName.trim();
    if (name.length < 1 || name.length > 60 || !/^[a-zA-Z]{2,3}(?:-[a-zA-Z0-9]{2,8}){0,3}$/.test(locale)) {
      setEditError('Enter a display name (1–60 characters) and a valid locale (e.g. en or zh-CN).');
      return;
    }
    setSaving(true);
    try {
      const updated = await updatePlayerProfile({ displayName: name, locale });
      if (updated.id !== playerId) throw new Error('Account changed while updating the profile.');
      setProfileState(updated);
      setEditing(false);
      setNotice('Your profile was updated on the server.');
    } catch (cause) {
      setEditError(cause instanceof Error ? cause.message : 'Unable to update profile.');
    } finally { setSaving(false); }
  };

  if (loading || (profileState !== null && profile === null)) return <div role="status" className="text-[#98A5BF] p-8">Loading your account from the backend…</div>;
  if (error || !profile) return (
    <Card><div role="alert" className="space-y-3 p-6">
      <p className="text-white font-bold">Account details are unavailable</p>
      <p className="text-sm text-[#FFB547]">{error || 'Could not verify your profile.'}</p>
      <Button variant="outline" onClick={() => setRevision(i => i + 1)}>Try again</Button>
    </div></Card>
  );

  return (
    <div className="space-y-6">
      {notice && <div role="status" className="rounded-xl p-3 border border-[#20C997]/50 text-[#20C997] text-sm flex justify-between gap-3">{notice}<button type="button" onClick={() => setNotice(null)} aria-label="Dismiss notification">×</button></div>}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#182238] via-[#1F2C49] to-[#182238] border border-[#2D3E66] flex flex-col sm:flex-row justify-between gap-5 items-start sm:items-center">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-16 h-16 rounded-2xl bg-[#7C5CFC]/20 border border-[#7C5CFC]/40 flex-shrink-0 flex items-center justify-center"><UserRound className="w-8 h-8 text-[#A885FF]" /></div>
          <div className="min-w-0 space-y-1">
            <h1 className="text-xl sm:text-2xl font-bold text-white break-words">{profile.displayName}</h1>
            <p className="text-xs text-[#00D4FF] break-all">@{profile.username}</p>
            <p className="text-xs text-[#98A5BF] break-all">{profile.email}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" leftIcon={<Edit2 className="w-4 h-4" />} onClick={openEdit}>Edit Profile</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#121A2D] border border-[#233252] p-5 rounded-2xl">
          <p className="text-xs text-[#98A5BF] flex items-center gap-2"><CalendarDays className="w-4 h-4" /> Member since</p>
          <p className="font-bold text-white mt-2">{memberSince(profile.createdAt)}</p>
        </div>
        <div className="bg-[#121A2D] border border-[#233252] p-5 rounded-2xl">
          <p className="text-xs text-[#98A5BF] flex items-center gap-2"><Shield className="w-4 h-4" /> Account</p>
          <p className="font-bold text-white mt-2">B2C Player</p>
          <p className="text-xs text-[#64748B] mt-1">KYC status not provided by the backend</p>
        </div>
        <div className="bg-[#121A2D] border border-[#233252] p-5 rounded-2xl">
          <p className="text-xs text-[#98A5BF] flex items-center gap-2"><Wallet className="w-4 h-4" /> Wallet & statistics</p>
          <p className="font-bold text-[#FFB547] mt-2">Sandbox ledger</p>
          <p className="text-xs text-[#64748B] mt-1">Verified balance unavailable; read-only transaction history available if operator configured</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader title="Available Games" subtitle="Live catalog from the Game Provider" action={<Link to="/games" className="text-xs text-[#00D4FF] hover:underline">All games →</Link>} />
          {catalog.loading ? <p className="text-sm text-[#98A5BF]">Loading games…</p>
            : catalog.error ? <p role="alert" className="text-sm text-[#FFB547]">{catalog.error}</p>
            : catalog.games.length === 0 ? <p className="text-sm text-[#98A5BF]">No games are currently available.</p>
            : <div className="space-y-2">{catalog.games.slice(0, 4).map(game => (
              <Link to={`/play/${game.gameId}`} key={game.gameId} className="flex justify-between items-center gap-2 p-3 rounded-xl border border-[#233252] hover:border-[#7C5CFC] bg-[#121A2D]">
                <span className="flex items-center gap-3 min-w-0"><img src={getCatalogArtwork(game.gameId).icon ?? undefined} alt={`${game.name} icon`} className="w-10 h-10 object-contain rounded-lg bg-[#0B1020] shrink-0" loading="lazy" /><span className="font-semibold text-white text-sm">{game.name}</span></span><Play className="w-4 h-4 text-[#00D4FF]" />
              </Link>
            ))}</div>}
        </Card>
        <Card>
          <CardHeader title="Account Activity" subtitle="Authenticated account status" />
          <p className="text-sm text-[#98A5BF] mb-4">Your account profile does not include an authoritative wallet balance or gameplay statistics. Provider transactions, if available, are read separately from the sandbox ledger.</p>
          <div className="flex flex-wrap gap-2">
            <Link to="/leaderboard"><Button variant="outline" size="sm" leftIcon={<Trophy className="w-4 h-4" />}>Public Leaderboard</Button></Link>
            <Link to="/player/wallet"><Button variant="outline" size="sm" leftIcon={<Wallet className="w-4 h-4" />}>Sandbox Wallet</Button></Link>
          </div>
          <p className="text-xs text-[#64748B] mt-4">Public game rankings do not identify individual B2C accounts.</p>
        </Card>
      </div>

      {editing && <Modal isOpen={editing} onClose={() => { if (!saving) setEditing(false); }} title="Edit Player Profile" maxWidth="md"
        footer={<div className="flex justify-end gap-2 w-full"><Button variant="outline" size="sm" disabled={saving} onClick={() => setEditing(false)}>Cancel</Button><Button form="edit-player-profile" type="submit" variant="primary" size="sm" isLoading={saving}>Save Changes</Button></div>}>
        <form id="edit-player-profile" onSubmit={handleSave} className="space-y-4">
          <Input label="Display Name" value={displayName} onChange={event => setDisplayName(event.target.value)} maxLength={60} required />
          <Input label="Locale" value={locale} onChange={event => setLocale(event.target.value)} placeholder="en" required />
          <Input label="Email (read-only)" value={profile.email} disabled helperText="Email changes are not supported by this API." />
          <Input label="Username (read-only)" value={profile.username} disabled />
          {editError && <p role="alert" className="text-xs text-[#FF5D73]">{editError}</p>}
        </form>
      </Modal>}
    </div>
  );
};
