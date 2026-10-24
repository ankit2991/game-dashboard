import test from 'node:test';
import assert from 'node:assert/strict';
import { validateLaunchCapabilities } from '../src/lib/launch/capabilitiesModel.ts';

const base = {scope:'configuration_only',games:[{gameId:'pinball',demoAvailable:true,
  providerHandoffConfigured:false,gameBackendConfigured:true,adapterKeyConfigured:true,
  adapterHandshakeVerified:false,browserE2eVerified:false,liveMoneySupported:false,
  blockers:['PILOT_GAME_NOT_ALLOWED','SANDBOX_WALLET_READ_ONLY']}]};
test('Adapter key configured is not proof of a tested server-to-server handshake or gameplay E2E',()=>{
  const result=validateLaunchCapabilities(base);
  assert.equal(result.games[0].adapterKeyConfigured,true);
  assert.equal(result.games[0].adapterHandshakeVerified,false);
  assert.equal(result.games[0].providerHandoffConfigured,false);
  assert.throws(()=>validateLaunchCapabilities({...base,games:[{...base.games[0],adapterHandshakeVerified:true}]}));
  assert.throws(()=>validateLaunchCapabilities({...base,games:[{...base.games[0],browserE2eVerified:true}]}));
});
