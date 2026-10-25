import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { gameActivationLabel, activationNeedsAttention } from '../src/lib/operator/integrationModel.ts';
const read = file => readFileSync(new URL(`../src/${file}`, import.meta.url), 'utf8');

test('Patch 2 operator statuses are descriptive rather than falsely E2E-ready', () => {
  assert.equal(gameActivationLabel({state:'approval_pending'}), 'Awaiting admin game approval');
  assert.equal(gameActivationLabel({state:'removal_pending'}), 'Removal pending admin sync');
  assert.equal(gameActivationLabel({state:'authorized_config_only'}), 'Authorized · configuration only');
  assert.equal(activationNeedsAttention({state:'approval_pending'}), true);
  assert.equal(activationNeedsAttention({state:'authorized_config_only'}), false);
});

test('Operator screens display actual requested vs authorized status from backend', () => {
  const catalog = read('modules/operator/pages/OperatorCatalog.tsx');
  const mine = read('modules/operator/pages/OperatorMyGames.tsx');
  const hook = read('lib/operator/useOperatorWorkspace.ts');
  const api = read('lib/api/operator.ts');
  assert.match(api, /\/operator\/integration/);
  assert.match(hook, /operatorWorkspaceApi\.integration/);
  assert.match(catalog, /gameActivationLabel/);
  assert.match(mine, /gameActivationLabel/);
  assert.match(mine, /removal_pending/);
});

test('One-time claim UI requires explicit password/consent and never persists issued secret', () => {
  const ui = read('modules/operator/pages/OperatorCredentials.tsx');
  const api = read('lib/api/operator.ts');
  assert.match(ui, /claimConfirm/);
  assert.match(ui, /type="password"/);
  assert.match(ui, /operatorWorkspaceApi\.claimKey/);
  assert.match(ui, /setIssued\(null\)/);
  assert.match(api, /\/operator\/credentials\/claim/);
  assert.doesNotMatch(ui, /localStorage\.|sessionStorage\.|console\.log/);
  assert.doesNotMatch(api, /VITE_PARTNER_API_KEY|x-b2b-admin-key|GAME_ADAPTER_KEY/);
});

test('Dedicated Integration Setup page is accessible in operator navigation', () => {
  const page = read('modules/operator/pages/OperatorIntegration.tsx');
  const layout = read('layouts/OperatorLayout.tsx');
  const app = read('App.tsx');
  assert.match(page, /operatorWorkspaceApi\.integration/);
  assert.match(page, /wallet or launch E2E tests/);
  assert.match(layout, /Integration Setup/);
  assert.match(app, /<Route path="integration" element=\{<OperatorIntegration \/>\}/);
});
