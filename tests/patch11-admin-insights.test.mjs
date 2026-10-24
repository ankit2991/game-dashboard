import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read = relative => readFileSync(new URL('../src/'+relative,import.meta.url),'utf8');

test('Patch 11: admin screens use protected backend APIs, not fictional platform figures',()=>{
 for(const name of ['AdminDashboard','AnalyticsReports','GameManagement','SystemSettings']) {
   const src=read('modules/admin/pages/'+name+'.tsx');
   assert.match(src,/useAdminPortalData/);
   assert.match(src,/adminApi\.(overview|games|settings)/);
   for(const mock of ['mockAdminMetrics','mockGames','mockProviders','mockChartMonthlyGrowth','mockChartApiTraffic']) {
     assert.ok(!src.includes(mock),`${name} must not use ${mock}`);
   }
   assert.doesNotMatch(src,/742 aggregated|14\.82M|42ms|Financial snapshot CSV generated|Simulated/);
 }
});
test('Patch 11: admin only fetches safe read-only endpoints and does not transmit server admin keys',()=>{
 const api=read('lib/api/admin.ts');
 assert.match(api,/\/admin\/portal\/overview/);
 assert.match(api,/\/admin\/portal\/games/);
 assert.match(api,/\/admin\/portal\/settings/);
 assert.doesNotMatch(api,/B2B_ADMIN_API_KEY|adminApiKey|x-b2b-admin-key|\/portal\/settings.*method: 'POST'/);
 const settings=read('modules/admin/pages/SystemSettings.tsx');
 const games=read('modules/admin/pages/GameManagement.tsx');
 assert.doesNotMatch(settings,/Save All Changes|configuration saved/);
 assert.doesNotMatch(games,/toggleFeatured|toggleStatus|setGames\(/);
});
test('Patch 11: no fabricated financial history or live-money claims in reports',()=>{
 const reports=read('modules/admin/pages/AnalyticsReports.tsx');
 assert.match(reports,/Financial reports unavailable/);
 assert.match(reports,/exportCsv/);
 assert.match(reports,/data\.operators/);
 assert.match(reports,/data\.games/);
 const dash=read('modules/admin/pages/AdminDashboard.tsx');
 assert.match(dash,/data\.players\.registered/);
 assert.match(dash,/data\.pendingApplications/);
});
