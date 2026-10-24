import test from 'node:test';
import assert from 'node:assert/strict';
import { validateWalletOverview } from '../src/lib/wallet/walletModel.ts';
const valid = {mode:'sandbox_only',configured:true,balanceMinor:10000,currency:'COIN',decimals:0,
  balanceStatus:'verified',balanceSource:'provider_sandbox', canDeposit:false,canWithdraw:false,transactionHistoryAvailable:true,configurationBlockers:[]};
test('Only source-attributed verified COIN balances reach the player UI',()=>{
  assert.equal(validateWalletOverview(valid).balanceMinor,10000);
  assert.equal(validateWalletOverview({...valid,balanceSource:'operator_sandbox'}).balanceMinor,10000);
  assert.throws(()=>validateWalletOverview({...valid,balanceSource:null}));
  assert.throws(()=>validateWalletOverview({...valid,balanceMinor:-1}));
  assert.throws(()=>validateWalletOverview({...valid,currency:'USD'}));
});
test('Unavailable never falls back to locally fabricated COIN',()=>{
  const unavailable = {...valid, balanceStatus:'unavailable', balanceMinor:null, currency:null, decimals:null, balanceSource:null};
  assert.equal(validateWalletOverview(unavailable).balanceMinor,null);
  assert.throws(()=>validateWalletOverview({...unavailable,balanceMinor:10000}));
});
