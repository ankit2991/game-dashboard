import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

for (const path of ['src/layouts/B2CLayout.tsx', 'src/layouts/PlayerDashboardLayout.tsx']) {
  test(`Header ${path} uses the same server-verified wallet model as Player Wallet`, () => {
    const content = readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
    assert.match(content, /usePlayerWallet\(\{ refreshOnResume: true \}\)/);
    assert.match(content, /verifiedCoinBalanceLabel\(verifiedWallet/);
    assert.match(content, /\{balanceLabel\}/);
    assert.doesNotMatch(content, />Balance unavailable</i);
  });
}
