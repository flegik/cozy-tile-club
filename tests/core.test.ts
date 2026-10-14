import {describe,it,expect} from 'vitest';
import {accessible,move,undo} from '../src/puzzle/engine';
import {solve} from '../src/puzzle/solver';
import {emptyState,type Tile,type State} from '../src/puzzle/types';
import {prepare,free,step,replay} from '../src/puzzle/simulation';
import {levels} from '../src/puzzle/levels';
import {canPlace,place,sorted} from '../src/room/engine';
import {fresh,reward,purchase,parseSave,restartCampaign,startAttempt,playTile,campaign} from '../src/save/store';
const tiles:Tile[]=Array.from({length:9},(_,id)=>({id,x:id%3,y:Math.floor(id/3),z:0,motif:Math.floor(id/3)}));
describe('actual puzzle rules',()=>{
 it('blocks partial overlaps but allows touching edges',()=>{const t=[tiles[0],{...tiles[1],x:.42,z:1}];expect(accessible(t,emptyState(),0)).toBe(false);expect(accessible(t,emptyState(),1)).toBe(true);expect(accessible([{...tiles[1],x:1,z:1},tiles[0]],emptyState(),0)).toBe(true);});
 it('ignores blocked, missing and duplicate tiles',()=>{const s=move(tiles,emptyState(),0);expect(move(tiles,s,0)).toBe(s);expect(move(tiles,s,20)).toBe(s);});
 it('matches after third tile and wins',()=>{let s=emptyState();for(let id=0;id<9;id++)s=move(tiles,s,id);expect(s).toEqual({removed:[0,1,2,3,4,5,6,7,8],tray:[],status:'won'});});
 it('resolves a match on the seventh slot before checking loss',()=>{const t=tiles.map((t,i)=>({...t,motif:i===6?0:i<2?0:i}));let s=emptyState();for(let i=0;i<7;i++)s=move(t,s,i);expect(s.tray).toHaveLength(4);expect(s.status).toBe('playing');});
 it('loses at seven unmatched tiles and cannot move further',()=>{const t=tiles.map(t=>({...t,motif:t.id}));let s=emptyState();for(let i=0;i<7;i++)s=move(t,s,i);expect(s.status).toBe('lost');expect(move(t,s,7)).toBe(s);});
 it('undo restores exact previous state including loss',()=>{const s=move(tiles,emptyState(),0);expect(undo([emptyState(),s])).toEqual({state:s,history:[emptyState()]});expect(undo([])).toBeNull();});
});
describe('independent solver',()=>{
 it('proves every shipped level with actual engine replay',()=>{expect(levels).toHaveLength(100);for(const l of levels){const r=solve(l.tiles,emptyState(),150000);expect(r.status).toBe('solved');let s=emptyState();for(const id of r.path)s=move(l.tiles,s,id);expect(s.status).toBe('won');}});
 it('distinguishes budget exhaustion and true failure',()=>{expect(solve(tiles,emptyState(),0).status).toBe('budget');expect(solve(tiles.slice(0,1),emptyState()).status).toBe('unsolvable');});
 it('agrees with exhaustive gameplay oracle on all reachable small states',()=>{
 const t:Tile[]=Array.from({length:9},(_,id)=>({id,x:id%3,y:id<3?0:id<6?.42:1.6,z:id<3?0:id<6?1:0,motif:id%3}));const memo=new Map<string,boolean>();
 function oracle(s:State):boolean{if(s.status==='won')return true;if(s.status==='lost')return false;const key=JSON.stringify([s.removed.slice().sort((a,b)=>a-b),s.tray.slice().sort()]);if(memo.has(key))return memo.get(key)!;
 const result=t.some(tile=>{const next=move(t,s,tile.id);return next!==s&&oracle(next);});memo.set(key,result);return result;}
 const seen=new Set<string>();const queue=[emptyState()];let compared=0;while(queue.length){const s=queue.pop()!;const key=JSON.stringify([s.removed.slice().sort((a,b)=>a-b),s.tray.slice().sort()]);if(seen.has(key))continue;seen.add(key);expect(solve(t,s,50000).status).toBe(oracle(s)?'solved':'unsolvable');compared++;for(const tile of t){const next=move(t,s,tile.id);if(next!==s)queue.push(next);}}expect(oracle(emptyState())).toBe(true);expect(compared).toBeGreaterThan(100);
 });
 it('safe hint remains solvable after a non-certificate player choice',()=>{const l=levels[12];const first=l.tiles.find(t=>accessible(l.tiles,emptyState(),t.id)&&t.id!==l.certificate[0])!;const s=move(l.tiles,emptyState(),first.id);const r=solve(l.tiles,s,150000);if(r.status==='solved'){expect(solve(l.tiles,move(l.tiles,s,r.path[0]),150000).status).toBe('solved');}else expect(r.status).toBe('unsolvable');});
});
describe('room and progression',()=>{
 it('rejects footprint collisions, out-of-bounds and fractional cells',()=>{const p=place([],'bed',0,0);expect(canPlace(p,'table',1,1)).toBe(false);expect(canPlace(p,'table',6,0)).toBe(false);expect(canPlace(p,'plant',.5,2)).toBe(false);expect(canPlace(p,'plant',3,3)).toBe(true);expect(canPlace(p,'bed',4,4)).toBe(true);});
 it('moving replaces existing instance; depth ordering stable',()=>{const p=place(place([],'plant',0,0),'plant',4,4);expect(p).toHaveLength(1);expect(sorted([...p,{id:'table',x:1,y:1}])[0].id).toBe('table');});
 it('rewards once and purchases obey funds/unlock/ownership',()=>{const s=reward(fresh(),1);expect(s.hearts).toBe(70);expect(reward(s,1)).toBe(s);expect(reward(s,1.5)).toBe(s);expect(reward(s,30)).toBe(s);const p=purchase(s,'bed');expect(p.hearts).toBe(10);expect(purchase(p,'bed')).toBe(p);expect(purchase(fresh(),'bunny')).toEqual(fresh());});
 it('round-trips save and rejects corrupted data',()=>{const s=reward(fresh(),1);expect(parseSave(JSON.stringify(s))).toEqual(s);expect(parseSave('{')).toEqual(fresh());expect(parseSave(JSON.stringify({...s,hearts:-2}))).toMatchObject({hearts:40,campaigns:{normal:{completed:[1]}}});});
 it('persists and validates midgame with limited help',()=>{const l=levels[0];const s=playTile(startAttempt(fresh(),1),l.certificate[0]);expect(parseSave(JSON.stringify(s))).toEqual(s);campaign(s).active!.state.removed.push(999);expect(campaign(parseSave(JSON.stringify(s))).active).toBeNull();});
});

describe('gameplay rework guarantees',()=>{
 it('Level 1 has a proven win AND an actually reachable seven-slot loss',()=>{const l=levels[0];expect(new Set(l.tiles.map(t=>t.motif)).size).toBeGreaterThanOrEqual(4);expect(solve(l.tiles,emptyState(),200000).status).toBe('solved');expect(replay(l.tiles,l.lossCertificate).status).toBe('lost');expect(replay(l.tiles,l.lossCertificate).tray).toHaveLength(7);expect(l.metrics.greedy.rate).toBeLessThan(.85);});
 it('normal play starts with Cozy off; legacy default does not survive migration',()=>{expect(fresh().mode).toBe('normal');const old={...fresh(),version:1,cozy:true,hearts:200,completed:[1,2],owned:['plant','table','bed'],placed:[{id:'bed',x:0,y:0}],active:{level:1,state:emptyState(),history:[]}};const migrated=parseSave(JSON.stringify(old));expect(migrated.version).toBe(3);expect(migrated.mode).toBe('normal');expect(migrated.campaigns.normal.active).toBeNull();expect(migrated.hearts).toBe(200);expect(migrated.placed).toEqual(old.placed);expect(migrated.owned).toEqual(old.owned);expect(migrated.campaigns.normal.completed).toEqual([1,2]);expect(migrated.campaigns.normal.rewarded).toEqual([1,2]);expect(migrated.migrated).toBe(true);});
 it('voluntary restart preserves room/economy and prevents duplicate heart farming',()=>{const s=reward(fresh(),1),r=restartCampaign(s);expect(campaign(r).completed).toEqual([]);expect(r.hearts).toBe(s.hearts);expect(r.placed).toEqual(s.placed);expect(r.owned).toEqual(s.owned);const won=reward(r,1);expect(won.hearts).toBe(s.hearts);expect(campaign(won).completed).toEqual([1]);expect(campaign(won).rewarded).toEqual([1]);});
 it('compact simulation transitions agree with gameplay at every reachable small state',()=>{const b=prepare(tiles);const seen=new Set<string>();const queue=[emptyState()];while(queue.length){const s=queue.pop()!,key=s.removed.slice().sort((a,b)=>a-b).join();if(seen.has(key))continue;seen.add(key);const c={removed:s.removed.reduce((m,id)=>m|(1n<<BigInt(id)),0n),counts:Array.from({length:3},(_,m)=>s.tray.filter(v=>v===m).length),used:s.tray.length};if(s.status!=='playing')continue;expect(free(b,c).map(i=>tiles[i].id)).toEqual(tiles.filter(t=>accessible(tiles,s,t.id)).map(t=>t.id));for(const i of free(b,c)){const next=move(tiles,s,tiles[i].id),compact=step(b,c,i);expect(compact.used).toBe(next.tray.length);expect(compact.counts).toEqual(Array.from({length:3},(_,m)=>next.tray.filter(v=>v===m).length));queue.push(next);}}expect(seen.size).toBeGreaterThan(100);});
});
