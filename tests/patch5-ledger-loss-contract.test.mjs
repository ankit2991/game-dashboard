import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateTransactionPage, transactionQuery, transactionOperationLabel,
  transactionAmountLabel, amountLabel,
} from '../src/lib/wallet/walletModel.ts';

const base = { transactionId: 'ledger-bet-12345', gameId: 'liars-dice', operation: 'bet',
  amountMinor: 50, currency: 'COIN', status: 'succeeded',
  createdAt: '2026-10-25T15:02:00.000Z', updatedAt: '2026-10-25T15:03:00.000Z' };
const zeroLoss = { ...base, transactionId: 'ledger-bot-loss-12345', operation: 'loss', amountMinor: 0 };
const page = rows => ({ source: 'provider_ledger', mode: 'sandbox_only', configured: true,
  limit: 20, offset: 0, total: rows.length, transactions: rows });

test('Patch 5: valid zero-amount bot-loss does not crash mixed wallet history', () => {
  const rows = [zeroLoss, base, { ...base, transactionId: 'ledger-win-12345', operation: 'win', amountMinor: 125 },
    { ...base, transactionId: 'ledger-refund-12345', operation: 'refund', amountMinor: 50, status: 'indeterminate' }];
  assert.deepEqual(validateTransactionPage(page(rows), 0).transactions, rows);
  assert.equal(transactionOperationLabel('loss'), 'Bot loss (record only)');
  assert.equal(transactionAmountLabel(zeroLoss), '0 COIN (minor units) · no wallet movement');
  assert.equal(transactionAmountLabel(base), '50 COIN (minor units)');
  assert.equal(amountLabel(0, 'COIN'), '0 COIN (minor units)');
});

test('Patch 5: bot-loss filtering matches server-side contract and page status', () => {
  assert.deepEqual(transactionQuery(0, { operation: 'loss', status: 'succeeded' }),
    { limit: 20, offset: 0, operation: 'loss', status: 'succeeded' });
  assert.deepEqual(validateTransactionPage({ ...page([zeroLoss]), total: 4 }, 0,
    { operation: 'loss', status: 'succeeded' }).transactions, [zeroLoss]);
  assert.throws(() => validateTransactionPage(page([base]), 0,
    { operation: 'loss', status: 'succeeded' }), /Invalid transaction record/);
  assert.throws(() => transactionQuery(0, { operation: 'withdraw', status: 'all' }), /Invalid/);
});

test('Patch 5: zero is valid ONLY for loss, never misreport it as win/bet/refund', () => {
  for (const operation of ['bet', 'win', 'refund']) {
    assert.throws(() => validateTransactionPage(page([{ ...base, operation, amountMinor: 0 }]), 0), /Invalid transaction record/);
  }
  for (const amountMinor of [1, -1, 0.5, NaN, Infinity]) {
    assert.throws(() => validateTransactionPage(page([{ ...zeroLoss, amountMinor }]), 0), /Invalid transaction record/);
  }
  for (const bad of [
    { ...zeroLoss, operation: 'deposit' },
    { ...zeroLoss, status: 'complete' },
    { ...zeroLoss, currency: 'INVALID_CURRENCY' },
    { ...zeroLoss, transactionId: 'invalid' },
    { ...zeroLoss, updatedAt: 'not a date' },
  ]) {
    assert.throws(() => validateTransactionPage(page([bad]), 0), /Invalid transaction record/);
  }
});

// This test guards the render paths too, without requiring a browser DOM.
test('Patch 5: recent activity and history both use shared transaction label helpers', async () => {
  const fs = await import('node:fs/promises');
  const playerWallet = await fs.readFile(new URL('../src/modules/b2c/pages/PlayerWallet.tsx', import.meta.url), 'utf8');
  const history = await fs.readFile(new URL('../src/modules/b2c/pages/PlayerTransactions.tsx', import.meta.url), 'utf8');
  assert.match(playerWallet, /transactionAmountLabel\(tx\)/);
  assert.match(playerWallet, /transactionOperationLabel\(tx\.operation\)/);
  assert.match(history, /transactionAmountLabel\(tx\)/);
  assert.match(history, /transactionAmountLabel\(selected\)/);
  assert.match(history, /'refund', 'loss'/);
});
