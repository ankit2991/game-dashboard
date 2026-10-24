import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = path => readFileSync(new URL(path,import.meta.url),'utf8');
const FRONTEND = 'https://strong-banoffee-1b55f4.netlify.app';
const BACKEND = 'https://game-provider-be-free.onrender.com';

test('Patch 14: Netlify production build config resolves to the real Render backend (public URL, no secrets)',()=>{
  const env=read('../.env.production');
  assert.match(env,new RegExp(`^VITE_API_BASE_URL=${BACKEND.replace(/\./g,'\\.')}$`,'m'));
  assert.doesNotMatch(env,/^\s*(?:SUPER_ADMIN_PASSWORD|B2B_ADMIN_API_KEY|MONGODB_URI|LEADERBOARD_IDENTITY_KEY)\s*=/m);
  assert.match(read('../.gitignore'),/^!\.env\.production$/m);
  const client=read('../src/lib/api/client.ts');
  assert.match(client,/import\.meta\.env\.VITE_API_BASE_URL/);
  assert.match(client,/url\.protocol !== 'https:'/);
  assert.match(client,/credentials: 'omit'/);
  assert.match(client,/const DEFAULT_TIMEOUT_MS = 60000;/);
});

test('Patch 14: Netlify Git build + Drop upload both serve BrowserRouter deep links',()=>{
  const netlify=read('../netlify.toml');
  const redirects=read('../public/_redirects');
  assert.match(netlify,/command\s*=\s*"npm ci && npm run build"/);
  assert.match(netlify,/publish\s*=\s*"dist"/);
  assert.match(netlify,/from\s*=\s*"\/\*"/);
  assert.match(netlify,/to\s*=\s*"\/index\.html"/);
  assert.match(netlify,/status\s*=\s*200/);
  assert.match(redirects,/^\/\*\s+\/index\.html\s+200\s*$/m);
  for (const route of ['/admin/login','/operator/login','/register','/leaderboard','/player']) {
    assert.ok(read('../src/App.tsx').includes(route) || route==='/leaderboard' && read('../src/App.tsx').includes('path="leaderboard"'),`${route} missing`);
  }
  assert.match(read('../PATCH_14_NETLIFY_RENDER_GUIDE.md'),new RegExp(FRONTEND.replace(/\./g,'\\.')));
});
