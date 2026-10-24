import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('Patch 13 browser API client identifies feature-disabled 404 responses', () => {
  const source = readFileSync(new URL('../src/lib/api/client.ts', import.meta.url), 'utf8');
  for (const text of [
    'B2C_AUTH_ENABLED', 'LEADERBOARD_ENABLED',
    'B2B_OPERATOR_AUTH_ENABLED', 'SUPER_ADMIN_ENABLED',
  ]) assert.ok(source.includes(text));
  assert.match(source, /response\.status === 404 && envelope\?\.error\?\.code === 'NOT_FOUND'/);
  assert.match(source, /credentials: 'omit'/);
  assert.doesNotMatch(source, /import\.meta\.env\.VITE_(?:B2B_ADMIN_API_KEY|LEADERBOARD_IDENTITY_KEY)/);
});
