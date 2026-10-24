/** Patch21 final Netlify Drop preflight; zero network access or secrets. */
import { readFile, stat } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';

export const GAME_IDS = ['pinball','whack-a-mole','galaga','liars-dice','ship-captain-crew','bomberboy','tower-rush'];

export async function verifyBuiltFrontend({ root = process.cwd() } = {}) {
  const problems = [];
  const dist = resolve(root, 'dist');
  const read = async path => { try { return await readFile(path, 'utf8'); } catch { problems.push(`Missing file: ${path}`); return ''; } };
  const html = await read(join(dist, 'index.html'));
  const redirects = await read(join(dist, '_redirects'));
  if (!/^\/\*\s+\/index\.html\s+200\s*$/m.test(redirects)) problems.push('Netlify SPA fallback is missing from dist/_redirects');
  const scripts = [...html.matchAll(/(?:src|href)=["']\/?(assets\/[^"']+\.js)["']/g)].map(m => m[1]);
  if (!scripts.length) problems.push('No Vite JS asset in dist/index.html');
  let matchesBackend = false;
  const backend = 'https://game-provider-be-free.onrender.com';
  for (const asset of scripts) {
    const js = await read(join(dist, asset));
    if (js.includes(backend)) matchesBackend = true;
    if (/MONGODB_URI|SUPER_ADMIN_PASSWORD_DIGEST|B2B_ADMIN_API_KEY|LEADERBOARD_IDENTITY_KEY/.test(js)) {
      problems.push(`Potential server-only variable name in ${asset}`);
    }
  }
  if (!matchesBackend) problems.push('Vite bundle does not contain Render backend URL');
  for (const game of GAME_IDS) {
    const file = join(dist,'game-icons',`${game}.png`);
    try {
      const stats = await stat(file);
      if (stats.size < 8) problems.push(`Invalid PNG asset: ${game}`);
      else {
        const bytes = await readFile(file);
        if (bytes.subarray(0,8).toString('hex') !== '89504e470d0a1a0a') problems.push(`Invalid PNG header: ${game}`);
      }
    } catch { problems.push(`Missing game icon: ${game}`); }
  }
  return {ok:problems.length===0, failures:problems, scripts:scripts.length, games:GAME_IDS.length};
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  verifyBuiltFrontend().then(result => {
    if (!result.ok) { for (const p of result.failures) console.error('FAIL:', p); process.exitCode=1; }
    else console.log(`PASS: Patch 21 Netlify release readiness: ${result.games} icons, ${result.scripts} bundles, Render URL, SPA fallback.`);
  }).catch(error=>{console.error(`FAIL: ${error?.message}`);process.exitCode=1;});
}
