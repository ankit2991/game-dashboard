'use strict';
/**
 * Frontend auth transport regression check. Run after `npm ci`:
 *   npm run test:auth-client
 * It transpiles only the FE TS modules under test, mocks the browser and verifies
 * exact request bodies, Bearer header, refresh single-flight and storage choices.
 */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const modules = new Map();
const store = () => {
  const items = new Map();
  return {
    getItem: key => items.get(key) ?? null,
    setItem: (key, value) => items.set(key, String(value)),
    removeItem: key => items.delete(key),
  };
};
global.localStorage = store();
global.sessionStorage = store();
const TOKEN = 'A'.repeat(43);
const REFRESH = 'B'.repeat(43);
const NEXT = 'C'.repeat(43);
const requestLog = [];
let refreshCount = 0;
const profile = { id: 'player-test-1', username: 'qa_player',
  email: 'qa@example.com', displayName: 'QA', locale: 'en', createdAt: '2026-10-24T00:00:00Z' };
const session = (refresh = REFRESH) => ({ user: profile, accessToken: TOKEN,
  refreshToken: refresh, tokenType: 'Bearer', expiresIn: 900,
  refreshExpiresAt: '2026-11-24T00:00:00Z' });
global.fetch = async (url, request) => {
  requestLog.push({ url, ...request });
  let data;
  if (url === '/api/v1/auth/register') {
    const b = JSON.parse(request.body);
    assert.deepEqual(Object.keys(b).sort(), ['email', 'username', 'password', 'displayName'].sort());
    assert.equal(b.password, 'long-test-password');
    data = session();
  } else if (url === '/api/v1/auth/login') {
    assert.deepEqual(JSON.parse(request.body), { identifier: 'qa_player', password: 'long-test-password' });
    data = session();
  } else if (url === '/api/v1/auth/refresh') {
    refreshCount++;
    const b = JSON.parse(request.body);
    assert.equal(b.refreshToken, REFRESH);
    await new Promise(resolve => setTimeout(resolve, 5));
    data = session(NEXT);
  } else if (url === '/api/v1/users/me') {
    assert.equal(request.headers.Authorization, 'Bearer ' + TOKEN);
    data = { user: profile };
  } else if (url === '/api/v1/auth/logout') {
    assert.equal(JSON.parse(request.body).refreshToken, NEXT);
    data = { revoked: true };
  } else throw new Error('Unexpected browser request ' + url);
  return { ok: true, status: 200, headers: new Headers({ 'Content-Type': 'application/json' }),
    json: async () => ({ ok: true, data }) };
};

function load(file) {
  const full = path.join(root, file) + '.ts';
  if (modules.has(full)) return modules.get(full).exports;
  const module = { exports: {} };
  modules.set(full, module);
  let source = fs.readFileSync(full, 'utf8');
  if (file === 'src/lib/api/client') {
    source = source.replace('import.meta.env.VITE_API_BASE_URL', 'undefined')
      .replace('import.meta.env.DEV', 'true');
  }
  const out = ts.transpileModule(source, { fileName: full, compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
  }, reportDiagnostics: true });
  assert.equal(out.diagnostics?.length || 0, 0);
  const requireLocal = name => {
    if (!name.startsWith('.')) throw new Error('Unexpected module import: ' + name);
    return load(path.normalize(path.join(path.dirname(file), name)));
  };
  Function('require', 'module', 'exports', out.outputText)(requireLocal, module, module.exports);
  return module.exports;
}

(async () => {
  const { playerApi } = load('src/lib/api/player');
  const vault = load('src/lib/auth/playerSession');
  global.localStorage.setItem('nexus_auth_session', '{"role":"player"}');
  vault.clearLegacyMockSession();
  assert.equal(global.localStorage.getItem('nexus_auth_session'), null);
  const r = await playerApi.register({ email: profile.email, username: profile.username,
    password: 'long-test-password', displayName: profile.displayName });
  assert.equal(r.user.id, profile.id);
  const logged = await playerApi.login('qa_player', 'long-test-password');
  vault.persistRefresh(logged.refreshToken, false);
  assert.equal(vault.readPersistedRefresh().remember, false);
  assert.equal(global.localStorage.getItem('game_provider_player_refresh_v1'), null);
  vault.persistRefresh(logged.refreshToken, true);
  assert.equal(vault.readPersistedRefresh().remember, true);
  const [one, two] = await Promise.all([
    vault.refreshOnce(logged.refreshToken), vault.refreshOnce(logged.refreshToken),
  ]);
  assert.equal(refreshCount, 1, 'duplicate restore must not replay rotating refresh token');
  assert.deepEqual(one, two);
  vault.persistRefresh(one.refreshToken, true);
  assert.equal(vault.readPersistedRefresh().refreshToken, NEXT);
  assert.equal((await playerApi.me(one.accessToken)).user.id, profile.id);
  await playerApi.logout(one.refreshToken);
  vault.clearPersistedRefresh();
  assert.equal(vault.readPersistedRefresh(), null);
  assert.ok(requestLog.every(x => x.credentials === 'omit' && x.cache === 'no-store'));
  console.log('PASS: FE Patch 2 register/login/profile/refresh-once/logout and Remember Me');
})().catch(error => { console.error(error); process.exitCode = 1; });
