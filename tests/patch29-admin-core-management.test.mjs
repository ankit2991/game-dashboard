import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read = path => readFileSync(new URL('../src/'+path,import.meta.url),'utf8');
test('Admin credential UI uses authenticated API methods with explicit one-time secret display',()=>{
  const ui=read('modules/admin/pages/ApiKeyManagement.tsx');
  const api=read('lib/api/admin.ts');
  assert.match(ui,/adminApi\.manageKey/);
  for(const action of ['provision','sync-games','rotate-key','suspend-key','activate-key']){
    assert.ok(ui.includes(action));assert.ok(api.includes(action));
  }
  assert.match(ui,/getAdminAccessToken/);
  assert.match(ui,/Confirm administrator password/);
  assert.match(ui,/setIssued\(null\)/);
  assert.doesNotMatch(ui,/localStorage\.|sessionStorage\.|console\.|import\.meta\.env/);
  assert.doesNotMatch(api,/x-b2b-admin-key|B2B_ADMIN_API_KEY|apiKey\s*:\s*['"]/);
});
test('Operator admin page distinguishes account status from partner API access',()=>{
  const ui=read('modules/admin/pages/OperatorManagement.tsx');
  assert.match(ui,/partnerStatus/);
  assert.match(ui,/syncRequired/);
  assert.match(ui,/rotationRequestedAt/);
  assert.match(ui,/adminApi\.decision/);
});
