/**
 * Ensure Netlify Drop's SPA routing file exists in dist/.
 * Vite ordinarily copies public/_redirects, but a post-build check protects
 * against local copies that omitted public/ or an incomplete previous build.
 *
 * Run automatically after `vite build` or before `preflight:netlify`.
 * Does not require an internet connection and never embeds credentials.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const fallback = '/*    /index.html   200';
const hasFallback = content => /^\/\*\s+\/index\.html\s+200\s*$/m.test(content);

export async function ensureNetlifyRedirects(distDir = resolve('dist')) {
  // Do not create an invalid dist/ folder when Vite has not built the app.
  await readFile(join(distDir, 'index.html'), 'utf8');
  const target = join(distDir, '_redirects');
  let original = '';
  try {
    original = await readFile(target, 'utf8');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  if (hasFallback(original)) {
    console.log('PASS: Netlify SPA fallback already exists in dist/_redirects');
    return false;
  }
  const result = original.trimEnd() + (original.trim() ? '\n' : '') + fallback + '\n';
  await writeFile(target, result, 'utf8');
  console.log('PASS: Netlify SPA fallback written to dist/_redirects');
  return true;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  ensureNetlifyRedirects().catch(error => {
    console.error(`FAIL: Cannot prepare Netlify redirects: ${error.message}`);
    process.exitCode = 1;
  });
}
