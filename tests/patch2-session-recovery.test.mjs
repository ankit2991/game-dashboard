import test from 'node:test';
import assert from 'node:assert/strict';
import { isLaunchTicketFresh } from '../src/lib/launch/launchModel.ts';

const now = Date.parse('2026-10-25T21:00:00Z');
const launch = expiry => ({gameId:'tower-rush',mode:'provider',walletMode:'sandbox_only',launchUrl:'https://tower-rush-fe.vercel.app/',expiresAt:new Date(expiry).toISOString()});
test('fresh provider ticket opens with ten seconds of cold-start margin',()=>{
  assert.equal(isLaunchTicketFresh(launch(now+15_000), now),true);
  assert.equal(isLaunchTicketFresh(launch(now+10_000), now),false);
});
test('expired and malformed tickets are never usable, demo is unaffected',()=>{
  assert.equal(isLaunchTicketFresh(launch(now-10), now),false);
  assert.equal(isLaunchTicketFresh({...launch(now+20000),expiresAt:'broken'},now),false);
  assert.equal(isLaunchTicketFresh({gameId:'tower-rush',mode:'demo',walletMode:'local_demo',launchUrl:'https://tower-rush-fe.vercel.app/'},now),true);
});
