import assert from 'node:assert/strict';
import test from 'node:test';
import { validateLeaderboardListing, getLeaderboardQuery } from '../src/lib/leaderboard/leaderboardModel.ts';
const entry={rank:1,player:{label:'Player-123456789a'},winningRounds:3,bestPayoutMinor:350,totalPayoutMinor:500};
const listing={scope:'global',gameId:null,sort:'best_payout_minor',currency:'COIN',decimals:0,
 source:'confirmed_wallet_ledger',limit:20,offset:0,totalPlayers:1,entries:[entry]};
test('Patch 6 accepts verified COIN money rankings, preserves pagination and rejects browser score',()=>{
 assert.equal(validateLeaderboardListing(listing,null,0).entries[0].bestPayoutMinor,350);
 assert.equal(validateLeaderboardListing({...listing,scope:'game',gameId:'pinball'},'pinball',0).entries[0].totalPayoutMinor,500);
 assert.deepEqual(getLeaderboardQuery(null,0),{path:'/leaderboards/global',query:{limit:20,offset:0}});
 for(const change of [
  {sort:'wins'},{currency:'USD'},{decimals:2},{source:'submitted_scores'},
  {entries:[{...entry,score:10000}]},{entries:[{...entry,bestPayoutMinor:-2}]},
  {entries:[{...entry,totalPayoutMinor:4}]},{entries:[{...entry,player:{label:'x'}}]},
 ]) assert.throws(()=>validateLeaderboardListing({...listing,...change},null,0),/Invalid/);
});
