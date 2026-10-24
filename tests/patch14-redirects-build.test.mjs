import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ensureNetlifyRedirects } from '../tools/patch14-ensure-netlify-redirects.mjs';

async function fixture(fn) {
  const dir = await mkdtemp(join(tmpdir(), 'netlify-dist-test-'));
  try { await fn(dir); } finally { await rm(dir, { recursive: true, force: true }); }
}

test('Netlify fallback is automatically created after a Vite build without public/_redirects', async () => fixture(async dir => {
  await writeFile(join(dir, 'index.html'), '<html></html>');
  assert.equal(await ensureNetlifyRedirects(dir), true);
  const rule = await readFile(join(dir, '_redirects'), 'utf8');
  assert.match(rule, /^\/\*\s+\/index\.html\s+200\s*$/m);
  assert.equal(await ensureNetlifyRedirects(dir), false, 'must not duplicate fallback');
  assert.equal(await readFile(join(dir, '_redirects'), 'utf8'), rule);
}));

test('Existing custom Netlify redirect rules are preserved', async () => fixture(async dir => {
  await writeFile(join(dir, 'index.html'), '<html></html>');
  await writeFile(join(dir, '_redirects'), '/old /new 301\n');
  await ensureNetlifyRedirects(dir);
  const text = await readFile(join(dir, '_redirects'), 'utf8');
  assert.match(text, /\/old \/new 301/);
  assert.match(text, /^\/\*\s+\/index\.html\s+200\s*$/m);
}));

test('Missing build cannot falsely pass the Netlify fallback step', async () => fixture(async dir => {
  await assert.rejects(ensureNetlifyRedirects(dir), { code: 'ENOENT' });
}));
