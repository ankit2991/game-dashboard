import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const file = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
test('Patch 3: wallet contract uses Operator bearer authentication and never embeds server secrets', () => {
  const operatorApi = file('src/lib/api/operator.ts');
  const adminApi = file('src/lib/api/admin.ts');
  const operatorUi = file('src/modules/operator/pages/OperatorIntegration.tsx');
  const adminUi = file('src/modules/admin/pages/ApiKeyManagement.tsx');
  assert.match(operatorApi, /apiRequest<OperatorWalletStatus>\('\/operator\/wallet'/);
  assert.match(operatorApi, /method: 'POST', accessToken: token/);
  assert.match(operatorUi, /Confirm Operator password/);
  assert.match(operatorUi, /Submit for Admin Balance Check/);
  assert.match(operatorUi, /setWalletApiKey\(''\)/);
  assert.match(adminApi, /'verify-wallet' \| 'reject-wallet'/);
  assert.match(adminUi, /\['provision','rotate-key','activate-key','verify-wallet','reject-wallet'\]/);
  assert.doesNotMatch(operatorUi, /localStorage|sessionStorage|VITE_B2B_WALLET_ENCRYPTION_KEY/);
  assert.doesNotMatch(adminUi, /VITE_B2B_WALLET_ENCRYPTION_KEY/);
});
