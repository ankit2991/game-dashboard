import test from 'node:test';
import assert from 'node:assert/strict';
import { safeOperatorGames, makeSelection } from '../src/lib/operator/workspaceModel.ts';
import { validateOperatorProfile } from '../src/lib/operator/operatorModel.ts';
const games=[{gameId:'pinball',name:'Pinball',order:1,gameMode:'single_player'},
  {gameId:'galaga',name:'Galaga',order:3,gameMode:'single_player'}];
test('Patch 8: catalog only accepts known format & sorts by backend order',()=>{
  assert.deepEqual(safeOperatorGames([...games].reverse()).map(g=>g.gameId),['pinball','galaga']);
  assert.deepEqual(safeOperatorGames([...games,{...games[0]}, {gameId:'invalid/path',name:'bad'}]).map(g=>g.gameId),['pinball','galaga']);
  assert.throws(()=>safeOperatorGames(undefined),/Invalid operator catalog/);
});
test('Patch 8: selections add/remove stable IDs, refuse invalid ones',()=>{
  assert.deepEqual(makeSelection([], 'galaga', games),['galaga']);
  assert.deepEqual(makeSelection(['galaga'], 'galaga', games),[]);
  assert.throws(()=>makeSelection([], 'fake-slot',games),/Unknown or disabled/);
});
test('Patch 8: real provisioned profile is allowed; invalid values still rejected',()=>{
  const user={id:'7bf28866-45d6-49ce-beb8-76541aef335b',email:'operator@example.com',
    companyName:'A Company',contactPerson:'Operator',status:'approved',partnerProvisioned:true};
  assert.equal(validateOperatorProfile(user).partnerProvisioned,true);
  assert.throws(()=>validateOperatorProfile({...user,partnerProvisioned:'yes'}),/Invalid operator/);
});
