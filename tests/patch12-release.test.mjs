import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');

test('Patch 12: Vercel SPA deployment refreshes B2C, B2B and Super Admin deep links', () => {
  const deployment = JSON.parse(read('../vercel.json'));
  assert.equal(deployment.outputDirectory,'dist');
  assert.equal(deployment.buildCommand,'npm run build');
  assert.ok(deployment.rewrites.some(x => x.source === '/(.*)' && x.destination === '/index.html'));
  const app=read('../src/App.tsx');
  for (const route of ['/admin/login','/operator/login','/player']) assert.ok(app.includes(route));
});

test('Patch 12: FE requires explicit HTTPS Render API origin in production and never embeds privileged keys', () => {
  const client=read('../src/lib/api/client.ts');
  assert.match(client,/if \(!development\) throw new Error\('VITE_API_BASE_URL must be set/);
  assert.match(client,/url\.protocol !== 'https:'/);
  assert.match(client,/credentials: 'omit'/);
  assert.doesNotMatch(client,/['"]X-B2B-Admin-Key['"]|GAME_PINBALL_ADAPTER_KEY/);
  const env=read('../.env.example');
  assert.match(env,/VITE_API_BASE_URL=/);
  assert.doesNotMatch(env,/^VITE_(B2B_ADMIN_API_KEY|MONGODB_URI|GAME_PINBALL_ADAPTER_KEY)=/m);
});
