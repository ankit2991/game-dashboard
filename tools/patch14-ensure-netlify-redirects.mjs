/** Ensure the manual Netlify Drop bundle contains the SPA fallback. */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
const dist = resolve('dist');
async function run() {
  const html = await readFile(join(dist, 'index.html'), 'utf8');
  if (!html) throw new Error('Build dist/index.html before preparing Netlify redirects');
  await mkdir(dist, { recursive: true });
  const redirects = join(dist, '_redirects');
  let contents = '';
  try { contents = await readFile(redirects, 'utf8'); } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
  if (!/^\/\*\s+\/index\.html\s+200\s*$/m.test(contents)) {
    await writeFile(redirects, '/*    /index.html   200\n');
    console.log('PASS: Added Netlify SPA fallback to dist/_redirects');
  } else console.log('PASS: Netlify SPA fallback already exists in dist/_redirects');
}
run().catch(error => { console.error('FAIL:', error.message); process.exitCode = 1; });
