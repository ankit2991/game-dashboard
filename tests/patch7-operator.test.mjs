import test from 'node:test';
import assert from 'node:assert/strict';
import { operatorTarget, validateOperatorProfile } from '../src/lib/operator/operatorModel.ts';
const user = {
  id:'7bf28866-45d6-49ce-beb8-76541aef335b', email:'operator@example.com',
  companyName:'Example Games Ltd',contactPerson:'Test Operator',website:'https://example.com',
  phone:'+123456789',country:'Egypt',businessType:'Aggregator',registrationNumber:'',
  status:'pending',createdAt:'2026-10-24T00:00:00Z',updatedAt:'2026-10-24T00:00:00Z',
  partnerProvisioned:false,
};
test('Patch 7 operator access transitions come from actual backend approval status',()=>{
  assert.equal(operatorTarget('pending'),'/operator/pending-approval');
  assert.equal(operatorTarget('approved'),'/operator/dashboard');
  assert.equal(operatorTarget('rejected'),'/access-denied');
  assert.equal(operatorTarget('suspended'),'/access-denied');
});
test('Patch 7 UI rejects invented approval, account data and partner credentials',()=>{
  assert.deepEqual(validateOperatorProfile(user),user);
  for(const invalid of [
    {...user,status:'super_admin'}, {...user,status:'active'},
    {...user,id:'fake-operator'}, {...user,partnerProvisioned:'fake'},
    {...user,contactPerson:''}, {...user,email:'not-an-email'},
  ]) assert.throws(()=>validateOperatorProfile(invalid),/Invalid operator/);
});
