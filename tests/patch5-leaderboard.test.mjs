import test from 'node:test';
import assert from 'node:assert/strict';
import { getLeaderboardQuery, validateLeaderboardListing, PAGE_SIZE } from '../src/lib/leaderboard/leaderboardModel.ts';

const entry = { rank: 1, player: { label: 'Player-123456789a' }, winningRounds: 4,
  bestPayoutMinor: 200, totalPayoutMinor: 400 };
const global = {scope: 'global', gameId: null, sort: 'best_payout_minor', currency: 'COIN',
  decimals: 0, source: 'confirmed_wallet_ledger', limit: 20, offset: 0, totalPlayers: 1, entries: [entry]};

test('global and per-game query use backend-supported parameters and constrain offsets', () => {
  assert.deepEqual(getLeaderboardQuery(null,0),{path:'/leaderboards/global',query:{limit:PAGE_SIZE,offset:0}});
  assert.deepEqual(getLeaderboardQuery('pinball',20),{path:'/leaderboards/games/pinball',query:{limit:20,offset:20}});
  for(const invalid of ['../admin','a/../../','?x=y','PINBALL']) assert.throws(()=>getLeaderboardQuery(invalid,0),/Invalid/);
  for(const invalid of [-20,1,1001,Infinity]) assert.throws(()=>getLeaderboardQuery(null,invalid),/Invalid/);
});

test('verified listing accepts verified B2C usernames or anonymous labels, and verified COIN winnings', () => {
  assert.equal(validateLeaderboardListing(global,null,0).entries[0].player.label,'Player-123456789a');
  for (const username of ['cr5213123', 'Player_009', 'abc']) {
    assert.equal(validateLeaderboardListing({...global, entries: [{...entry, player: {label: username}}]},null,0)
      .entries[0].player.label, username);
  }
  for (const invalid of ['Alice@example.com', 'xy', 'x'.repeat(25), '<script>', 'bad-name', '']) {
    assert.throws(()=>validateLeaderboardListing({...global,entries:[{...entry,player:{label:invalid}}]},null,0),/Invalid/);
  }
  const game={...global,scope:'game',gameId:'pinball'};
  assert.equal(validateLeaderboardListing(game,'pinball',0).entries[0].winningRounds,4);
  assert.throws(()=>validateLeaderboardListing({...global,entries:[{...entry,player:{label:'Alice@example.com'}}]},null,0),/Invalid/);
  assert.throws(()=>validateLeaderboardListing({...global,entries:[{...entry,rank:14}]},null,0),/Invalid/);
  assert.throws(()=>validateLeaderboardListing({...global,entries:[{...entry,bestPayoutMinor:-1}]},null,0),/Invalid/);
  assert.throws(()=>validateLeaderboardListing({...global,sort:'best_score'},null,0),/Invalid/);
  assert.throws(()=>validateLeaderboardListing({...global,entries:[{...entry,accessToken:'secret'}]},null,0),/Invalid/);
});

test('empty boards validate and offset pagination uses true server ranks', () => {
  assert.deepEqual(validateLeaderboardListing({...global,totalPlayers:0,entries:[]},null,0).entries,[]);
  const next = {...global,offset:20,totalPlayers:21,entries:[{...entry,rank:21}]};
  assert.equal(validateLeaderboardListing(next,null,20).entries[0].rank,21);
});
