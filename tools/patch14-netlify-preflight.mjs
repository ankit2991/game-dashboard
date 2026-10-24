/**
 * Check a Vite build BEFORE uploading dist/ through Netlify Drop.
 * Usage: npm ci && npm run build && node tools/patch14-netlify-preflight.mjs
 * Does not make internet requests and never needs private credentials.
 */
import { readFile, readdir } from 'node:fs/promises';
import { resolve, join } from 'node:path';

const dist = resolve('dist');
const requiredOrigin = 'https://game-provider-be-free.onrender.com';
async function check() {
  const html = await readFile(join(dist, 'index.html'), 'utf8');
  if (!html.includes('assets/')) throw new Error('No bundled assets referenced by dist/index.html');
  const redirects = await readFile(join(dist, '_redirects'), 'utf8');
  if (!/^\/\*\s+\/index\.html\s+200\s*$/m.test(redirects)) {
    throw new Error('Missing Netlify Drop SPA fallback in dist/_redirects');
  }
  const files = await readdir(join(dist, 'assets'));
  const js = files.filter(file => file.endsWith('.js'));
  if (!js.length) throw new Error('No built JavaScript found in dist/assets');
  const bodies = await Promise.all(js.map(f => readFile(join(dist, 'assets', f),'utf8')));
  if (!bodies.some(body => body.includes(requiredOrigin))) {
    throw new Error(`Backend URL not present in production bundle: ${requiredOrigin}. Check VITE_API_BASE_URL build settings.`);
  }
  if (bodies.some(body => /SUPER_ADMIN_PASSWORD_DIGEST|B2B_ADMIN_API_KEY|MONGODB_URI|LEADERBOARD_IDENTITY_KEY/.test(body))) {
    throw new Error('Potential secret variable name in deployed client bundle; review before publishing');
  }
  console.log(`PASS: Netlify Drop dist includes SPA fallback and Render API URL (${js.length} JS bundle(s)).`);
}
check().catch(error => { console.error('FAIL:',error.message);process.exitCode=1; });
