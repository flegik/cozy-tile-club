import {createHash} from 'node:crypto';
import lock from '../src/puzzle/release-lock.json';
import {it,expect} from 'vitest';
import released from './fixtures/released-30.json';
import {levels} from '../src/puzzle/levels';
import {generate} from '../src/puzzle/generator';
import {solve} from '../src/puzzle/solver';
import {continuation} from '../src/puzzle/continuation';
import {replay,simulate} from '../src/puzzle/simulation';
import {emptyState} from '../src/puzzle/types';
import {fresh,reward,startAttempt,playTile,undoAttempt,applyHint,parseSave,switchMode,campaign} from '../src/save/store';
import {bumpTracking} from '../src/game/playtest';
import {similarity,advancedAccept,ADVANCED_SEED,HOLDOUT_SEED} from '../src/puzzle/advanced-curator';
it('preserves released level objects exactly and exposes unique sequential IDs 1–100',()=>{expect(levels).toHaveLength(100);for(const l of levels)expect(createHash('sha256').update(JSON.stringify(l)).digest('hex')).toBe((lock as Record<string,string>)[l.id]);expect(levels.slice(0,30)).toEqual(released);expect(levels.map(l=>l.id)).toEqual(Array.from({length:100},(_,i)=>i+1));});
it('independently proves new levels, replays win/loss certificates, validates density, geometry and balanced motifs',()=>{
 for(const l of levels.slice(30)){
  expect(generate(l.seed,l.tier).tiles).toEqual(l.tiles);const result=solve(l.tiles,emptyState(),30000);expect(result.status).toBe('solved');expect(replay(l.tiles,result.path).status).toBe('won');expect(replay(l.tiles,l.certificate).status).toBe('won');expect(replay(l.tiles,l.lossCertificate).status).toBe('lost');
  const counts=new Map<number,number>();const occupied=new Set<string>();for(const t of l.tiles){expect(t.x).toBeGreaterThanOrEqual(0);expect(t.x).toBeLessThanOrEqual(4.6);expect(t.y).toBeGreaterThanOrEqual(0);expect(t.y).toBeLessThanOrEqual(3.6);expect(t.z).toBeLessThan(6);expect(t.id).toBeGreaterThanOrEqual(0);expect(t.motif).toBeLessThan(10);counts.set(t.motif,(counts.get(t.motif)??0)+1);occupied.add(`${t.x},${t.y},${t.z}`);}expect(occupied.size).toBe(l.tiles.length);for(const n of counts.values())expect(n%3).toBe(0);
  expect(l.tiles.length).toBeLessThanOrEqual(42);expect(l.metrics.analysis!.effectiveChoices).toBeGreaterThanOrEqual(2);expect(l.metrics.analysis!.unsafe).toBeGreaterThan(0);expect(l.metrics.blocked/l.tiles.length).toBeGreaterThanOrEqual(.4);
  expect(advancedAccept(l.tier,l.metrics.greedy.rate,l.metrics.lookahead.rate,l.metrics.advanced!.rate)).toBe(true);
 }
},120000);
it('all layouts are distinct and no new layout is a near duplicate of another',()=>{for(let i=30;i<levels.length;i++)for(let j=0;j<i;j++)expect(similarity(levels[i],levels[j])).toBeLessThanOrEqual(.85);expect(new Set(levels.slice(30).map(l=>l.shape)).size).toBeGreaterThanOrEqual(12);});
it('quick independent behavioral smoke samples preserve planning advantage and stage trend',()=>{
 const rows:number[][]=Array.from({length:5},()=>[]);for(const l of levels.slice(30)){const g=simulate(l.tiles,'greedy',24,HOLDOUT_SEED+71),a=simulate(l.tiles,'advanced',24,HOLDOUT_SEED+71);rows[l.tier-4].push(a.rate);expect(a.rate).toBeGreaterThanOrEqual(g.rate);}
 const means=rows.map(xs=>xs.reduce((a,b)=>a+b,0)/xs.length);for(let i=1;i<means.length;i++)expect(means[i]).toBeLessThan(means[i-1]);
},120000);
it('Normal 47 ↔ Cozy 12 preserves exact active state, help, shared room and tracking above level 30',()=>{
 let s=fresh();for(let id=1;id<47;id++)s=reward(s,id);s=startAttempt(s,47);s=playTile(s,levels[46].certificate[0]);s=applyHint(s,continuation(levels[46].tiles,campaign(s).active!.state,levels[46].certificate,200000),campaign(s).active!.state);s=undoAttempt(s);s=bumpTracking(s,47,'seconds',37);const normal=structuredClone(campaign(s));
 s=switchMode(s,'cozy');for(let id=1;id<12;id++)s=reward(s,id);s=startAttempt(s,12);s=playTile(s,levels[11].certificate[0]);const cozy=structuredClone(campaign(s)),room=structuredClone(s.placed),hearts=s.hearts;
 s=parseSave(JSON.stringify(s));expect(s.tracking.normal[47].seconds).toBe(37);expect(s.placed).toEqual(room);expect(s.hearts).toBe(hearts);expect(campaign(s)).toEqual(cozy);s=switchMode(s,'normal');expect(campaign(s)).toEqual(normal);s=switchMode(s,'cozy');expect(campaign(s)).toEqual(cozy);
});
it('legacy active attempts survive unchanged and level 30 opens 31 without pack/schema migration',()=>{
 let s=fresh();for(let id=1;id<30;id++)s=reward(s,id);s=startAttempt(s,30);s=playTile(s,levels[29].certificate[0]);s=undoAttempt(s);const active=structuredClone(campaign(s).active);s=parseSave(JSON.stringify(s));expect(campaign(s).active).toEqual(active);expect(s.version).toBe(3);expect(s.pack).toBe(2);for(const id of levels[29].certificate)s=playTile(s,id);s=startAttempt(s,31);expect(campaign(s).active!.level).toBe(31);
});
it('level 100 finishes and rewards once in each mode; no phantom level 101; tracks the finale',()=>{
 let s=fresh();for(let id=1;id<100;id++)s=reward(s,id);const hearts=s.hearts;s=startAttempt(s,100);for(const id of levels[99].certificate)s=playTile(s,id);expect(campaign(s).completed).toHaveLength(100);expect(s.hearts).toBe(hearts+30);expect(startAttempt(s,101)).toBe(s);s=startAttempt(s,100);for(const id of levels[99].certificate)s=playTile(s,id);expect(s.hearts).toBe(hearts+30);expect(parseSave(JSON.stringify(s)).tracking.normal[100].wins).toBe(2);
 s=switchMode(s,'cozy');for(let id=1;id<=100;id++)s=reward(s,id);expect(s.hearts).toBe(hearts+30+3000);expect(campaign(s).completed).toHaveLength(100);
});
it('stored certificates are validated, arbitrary moves fall back to the independent solver and budgets remain explicit',()=>{const l=levels[99];const s=replay(l.tiles,l.certificate.slice(0,5)),result=continuation(l.tiles,s,l.certificate,0);expect(result.status).toBe('solved');expect(replay(l.tiles,[...s.removed,...result.path]).status).toBe('won');expect(continuation(l.tiles,emptyState(),[999],0).status).toBe('budget');expect(continuation(l.tiles,replay(l.tiles,l.lossCertificate),l.certificate,200000).status).toBe('unsolvable');});
it('500 advanced candidate seeds remain reproducible and balanced; exhausted proofs are rejected explicitly',()=>{
 let solved=0,budgeted=0;for(let seed=1;seed<=500;seed++){const tier=4+(seed%5),l=generate(seed*7919,tier);expect(generate(seed*7919,tier)).toEqual(l);const counts=new Map<number,number>();for(const t of l.tiles)counts.set(t.motif,(counts.get(t.motif)??0)+1);for(const n of counts.values())expect(n%3).toBe(0);const r=solve(l.tiles,emptyState(),15000);if(r.status==='solved'){solved++;expect(replay(l.tiles,r.path).status).toBe('won');}else if(r.status==='budget')budgeted++;}expect(solved).toBeGreaterThan(0);console.log('Advanced generator 500 seeds:',{solved,budgeted});
},120000);
