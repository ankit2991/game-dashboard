import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read = path => readFileSync(new URL('../src/'+path,import.meta.url),'utf8');
test('Patch 10 does not authenticate super admin through demo persona, timeout, or fake 2FA',()=>{
  const login=read('modules/admin/pages/AdminLogin.tsx');
  const context=read('context/AuthContext.tsx');
  const dev=read('components/common/DevRoleSwitcher.tsx');
  assert.match(login,/await loginAdmin\(/);
  assert.doesNotMatch(login,/loginAs\(|setTimeout\(|otpCode|Quick Demo|alex\.mercer|Verify2FA/);
  assert.match(context,/role !== 'player'/);
  assert.doesNotMatch(context,/role === 'super_admin' \? MOCK_PERSONAS/);
  assert.doesNotMatch(dev,/loginAs\('super_admin'\)/);
});
test('Patch 10 operator dashboard reads real account list and writes status only via API',()=>{
  const page=read('modules/admin/pages/OperatorManagement.tsx');
  assert.match(page,/adminApi\.operators/);
  assert.match(page,/adminApi\.decision/);
  assert.match(page,/getAdminAccessToken/);
  assert.doesNotMatch(page,/mockOperators|productionEnabled|mockChartApiTraffic|Create Operator Account/);
});
test('Patch 10 keeps internal B2B admin key out of browser client',()=>{
  const api=read('lib/api/admin.ts');
  const session=read('lib/auth/adminSession.ts');
  assert.doesNotMatch(api,/B2B_ADMIN_API_KEY|adminApiKey|x-b2b-admin-key/);
  assert.match(api,/\/admin\/portal\/operators/);
  assert.match(session,/sessionStorage/);
  assert.doesNotMatch(session,/localStorage\.setItem/);
});
