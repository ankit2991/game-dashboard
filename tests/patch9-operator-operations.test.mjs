import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const src = name => readFileSync(new URL('../src/'+name, import.meta.url), 'utf8');

test('Patch 9 operator pages use scoped APIs, not mock transaction or HTTP fixtures', () => {
  for(const name of ['OperatorTransactions','OperatorLogs','OperatorWebhooks','OperatorTeam']) {
    const contents = src('modules/operator/pages/'+name+'.tsx');
    assert.match(contents,/useOperatorOperations/,name);
    assert.match(contents,/operatorOperationsApi/,name);
    assert.doesNotMatch(contents, /mockTransactions|mockChartApiTraffic|nexus-provider\.internal|asiagaming\.net|2024-10-23/, name);
    assert.doesNotMatch(contents,/200 OK Handshake Successful|Webhook configurations saved and registered/,name);
  }
});
test('Patch 9 documents that draft members/webhooks do not grant access or dispatch events',()=>{
  assert.match(src('modules/operator/pages/OperatorTeam.tsx'),/no access|access was not granted/i);
  assert.match(src('modules/operator/pages/OperatorWebhooks.tsx'),/does not dispatch|do not dispatch/i);
  assert.match(src('modules/operator/pages/OperatorLogs.tsx'),/not recorded|not raw HTTP logs/i);
  assert.match(src('modules/operator/pages/OperatorTransactions.tsx'),/minor units/i);
});
