import test from 'node:test';
import assert from 'node:assert/strict';
import { validateLaunchResponse } from '../src/lib/launch/launchModel.ts';

const reference = 'https://pinballfe.vercel.app/';
const token = 'x'.repeat(43);
const launchId = 'fcf0b66d-e6e3-4574-8057-410000000001';
const expiresAt = new Date(Date.now() + 120_000).toISOString();
const demo = { gameId: 'pinball', mode: 'demo', launchUrl: reference, walletMode: 'local_demo' };
const provider = { gameId: 'pinball', mode: 'provider', launchUrl: `${reference}#provider_launch_token=${token}&provider_launch_id=${launchId}`,
  launchId, expiresAt, status: 'sandbox_launch_ready', walletMode: 'sandbox_only' };

test('demo link validates exactly to allowed catalog game', () => {
  assert.deepEqual(validateLaunchResponse(demo, 'pinball', 'demo', reference), demo);
  assert.throws(() => validateLaunchResponse(demo, 'galaga', 'demo', reference), /Invalid game/);
  assert.throws(() => validateLaunchResponse({ ...demo, launchUrl: 'javascript:alert(1)' }, 'pinball', 'demo', reference), /safe/);
  assert.throws(() => validateLaunchResponse({ ...demo, launchUrl: 'https://evil.com/' }, 'pinball', 'demo', reference), /match/);
  assert.throws(() => validateLaunchResponse({ ...demo, launchUrl: `${reference}#script` }, 'pinball', 'demo', reference), /Invalid demo/);
  assert.throws(() => validateLaunchResponse({ ...demo, launchUrl: `${reference}?secret=test` }, 'pinball', 'demo', reference), /match/);
});

test('provider handoff accepts token only in fragment with matching launch id and expiry', () => {
  assert.deepEqual(validateLaunchResponse(provider, 'pinball', 'provider', reference), provider);
  assert.throws(() => validateLaunchResponse({ ...provider, expiresAt: '2020-01-01T00:00:00Z' }, 'pinball', 'provider', reference), /Invalid provider/);
  assert.throws(() => validateLaunchResponse({ ...provider, launchUrl: `${reference}#provider_launch_token=${token}&provider_launch_id=wrong` }, 'pinball', 'provider', reference), /Invalid provider/);
  assert.throws(() => validateLaunchResponse({ ...provider, launchUrl: `${reference}?provider_launch_token=${token}` }, 'pinball', 'provider', reference), /match/);
  assert.throws(() => validateLaunchResponse({ ...provider, walletMode: 'local_demo' }, 'pinball', 'provider', reference), /Invalid provider/);
  assert.throws(() => validateLaunchResponse({ ...provider, launchUrl: `https://evil.com/#provider_launch_token=${token}` }, 'pinball', 'provider', reference), /match/);
});
