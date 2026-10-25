import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SPA_RULE = '/* /index.html 200';

/**
 * Ensure Netlify Drop and Git builds both serve client-side routes.
 * Return true only when the redirect file was changed. Do not treat a missing
 * Vite build as a successful deployment and preserve any custom rules.
 */
export async function ensureNetlifyRedirects(distDir = 'dist') {
  const dir = resolve(distDir);
  // A _redirects file without an index.html would hide a failed build.
  await readFile(resolve(dir, 'index.html'));
  const target = resolve(dir, '_redirects');
  let content = '';
  try { content = await readFile(target, 'utf8'); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  const hasRule = content.split(/\r?\n/).some(line => /^\/\*\s+\/index\.html\s+200(?:\s+.*)?$/.test(line.trim()));
  if (hasRule) return false;
  await writeFile(target, content + (content && !content.endsWith('\n') ? '\n' : '') + SPA_RULE + '\n');
  return true;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const changed = await ensureNetlifyRedirects('dist');
    console.log(changed ? 'Netlify SPA fallback added.' : 'Netlify SPA fallback verified.');
  } catch (error) {
    console.error('Netlify SPA fallback failed:', error.message);
    process.exitCode = 1;
  }
}
