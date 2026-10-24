import test from 'node:test';
import assert from 'node:assert/strict';
import { transactionPaging, amountLabel, validateTransactionPage, validateWalletOverview } from '../src/lib/wallet/walletModel.ts';

const wallet = { mode:'sandbox_only', configured:true, balanceMinor:null, currency:null, decimals:null, balanceStatus:'unavailable', canDeposit:false, canWithdraw:false, transactionHistoryAvailable:true };
const tx = { transactionId:'game-tx-12345678', gameId:'pinball', operation:'bet', amountMinor:125, currency:'COIN', status:'succeeded', createdAt:'2026-10-24T00:00:00.000Z', updatedAt:'2026-10-24T00:00:00.000Z' };
const page = { source:'provider_ledger', mode:'sandbox_only', configured:true, limit:20, offset:0, total:1, transactions:[tx] };

test('Patch 6 read-only wallet never accepts an invented balance or cashier', () => {
  assert.deepEqual(validateWalletOverview(wallet),wallet);
  assert.throws(()=>validateWalletOverview({...wallet,balanceMinor:842050}),/Invalid/);
  assert.throws(()=>validateWalletOverview({...wallet,canDeposit:true}),/Invalid/);
  assert.throws(()=>validateWalletOverview({...wallet,transactionHistoryAvailable:false}),/Invalid/);
});
test('Patch 6 ledger contract validates pagination and records', () => {
  assert.deepEqual(transactionPaging(0),{limit:20,offset:0});
  assert.deepEqual(transactionPaging(20),{limit:20,offset:20});
  for (const offset of [-1,1,10020,Infinity]) assert.throws(()=>transactionPaging(offset),/Invalid/);
  assert.deepEqual(validateTransactionPage(page,0),page);
  assert.throws(()=>validateTransactionPage({...page,transactions:[{...tx,amountMinor:-10}]},0),/Invalid/);
  assert.throws(()=>validateTransactionPage({...page,transactions:[{...tx,operation:'deposit'}]},0),/Invalid/);
  assert.throws(()=>validateTransactionPage({...page,transactions:[{...tx,sessionToken:'SECRET'}]},20),/Invalid/);
  assert.equal(amountLabel(125,'COIN'),'125 COIN (minor units)');
  assert.equal(amountLabel(125,'MYR'),'125 MYR (minor units)');
});
