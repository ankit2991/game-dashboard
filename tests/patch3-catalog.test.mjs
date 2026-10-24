import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { once } from 'node:events';
import { readEnv } from '../../BE/src/config/env.js';
import { createApp } from '../../BE/src/app.js';
import { normalizeCatalog, filterCatalog, getSafeDemoUrl, getCatalogArtwork } from '../src/lib/catalog/catalogModel.ts';

const env = { NODE_ENV: 'development', PORT: '0', CORS_ORIGINS: 'http://localhost:5175' };
async function serverTest(rawEnv, execute) {
  const server = http.createServer(createApp(readEnv(rawEnv)));
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  try { await execute(`http://127.0.0.1:${server.address().port}`); }
  finally { await new Promise((resolve) => server.close(resolve)); }
}
async function getGames(origin, headers) {
  const res = await fetch(`${origin}/api/v1/games`, { headers });
  assert.equal(res.status, 200);
  const envelope = await res.json();
  assert.equal(envelope.ok, true);
  assert.ok(Array.isArray(envelope.data.games));
  return { envelope, games: normalizeCatalog(envelope.data.games), response: res };
}

test('real backend serves 7 catalog games in correct order with only public data', async () => {
  await serverTest(env, async (origin) => {
    const { games, envelope, response } = await getGames(origin, { Origin: 'http://localhost:5175' });
    assert.equal(response.headers.get('access-control-allow-origin'), 'http://localhost:5175');
    assert.equal(envelope.meta.total, 7);
    assert.deepEqual(games.map((g) => g.gameId), ['pinball', 'whack-a-mole', 'galaga', 'liars-dice', 'ship-captain-crew', 'bomberboy', 'tower-rush']);
    assert.equal(filterCatalog(games, '', 'multiplayer', 'order').length, 2);
    assert.equal(filterCatalog(games, '', 'single_player', 'order').length, 5);
    assert.equal(filterCatalog(games, 'GaLa', 'all', 'order')[0].gameId, 'galaga');
    assert.equal(filterCatalog(games, 'Dice', 'all', 'order')[0].gameId, 'liars-dice');
    assert.equal(filterCatalog(games, 'arcade', 'all', 'order').length, 3);
    assert.equal(filterCatalog(games, '', 'all', 'az')[0].name, 'Bomberboy');
    for (const game of games) {
      assert.equal(Object.hasOwn(game, 'backendUrl'), false);
      assert.equal(Object.hasOwn(game, 'apiKey'), false);
      assert.ok(getCatalogArtwork(game.gameId));
    }
  });
});

test('disabled games are absent, including empty catalog (no phantom mock fallback)', async () => {
  await serverTest({ ...env, GAME_GALAGA_ENABLED: 'false' }, async (origin) => {
    const { games } = await getGames(origin);
    assert.equal(games.length, 6);
    assert.equal(games.some((g) => g.gameId === 'galaga'), false);
    const detail = await fetch(`${origin}/api/v1/games/galaga`);
    assert.equal(detail.status, 404);
  });
  const flags = ['PINBALL', 'WHACK_A_MOLE', 'GALAGA', 'LIARS_DICE', 'SHIP_CAPTAIN_CREW', 'BOMBERBOY', 'TOWER_RUSH'];
  await serverTest(Object.fromEntries([...Object.entries(env), ...flags.map((key) => [`GAME_${key}_ENABLED`, 'false'])]), async (origin) => {
    const { games } = await getGames(origin);
    assert.deepEqual(games, []);
  });
});

test('catalog rejects malformed and duplicate records and filters links', () => {
  const good = { gameId: 'pinball', name: 'Pinball', order: 1, gameMode: 'single_player', demoUrl: 'https://example.com', integrationStatus: 'not_connected', providerLaunchAvailable: false };
  assert.deepEqual(normalizeCatalog([good])[0].gameId, 'pinball');
  assert.throws(() => normalizeCatalog([good, good]), /Invalid game entry/);
  assert.throws(() => normalizeCatalog([{ ...good, name: '' }]), /Invalid game entry/);
  assert.throws(() => normalizeCatalog([{ ...good, providerLaunchAvailable: 'true' }]), /Invalid game entry/);
  assert.throws(() => normalizeCatalog({ games: [] }), /Invalid games catalog response/);
  assert.equal(getSafeDemoUrl('javascript:alert(1)'), null);
  assert.equal(getSafeDemoUrl('http://example.com/game'), null);
  assert.equal(getSafeDemoUrl('https://username:password@example.com'), null);
  assert.equal(getSafeDemoUrl('https://example.com/demo'), 'https://example.com/demo');
});
