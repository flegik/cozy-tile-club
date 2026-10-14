import {test,expect} from 'vitest';
import {generate} from '../src/puzzle/generator';
import {solve} from '../src/puzzle/solver';
import {emptyState} from '../src/puzzle/types';
import {simulate,replay} from '../src/puzzle/simulation';
import {levels} from '../src/puzzle/levels';
import {acceptable,score,SIMULATION_SEED,TRIALS} from '../src/puzzle/curator';
import {accessible} from '../src/puzzle/engine';
test('500 candidate seeds are reproducible, balanced, layered and bounded; only proven candidates may ship',()=>{
 let solved=0,rejected=0;
 for(let seed=1;seed<=500;seed++){
  const l=generate(seed*7919,(seed-1)%4);expect(l).toEqual(generate(seed*7919,(seed-1)%4));
  const counts=new Map<number,number>();for(const t of l.tiles)counts.set(t.motif,(counts.get(t.motif)??0)+1);expect(counts.size).toBeGreaterThanOrEqual(5);for(const c of counts.values())expect(c%3).toBe(0);
  expect(new Set(l.tiles.map(t=>t.z)).size).toBeGreaterThanOrEqual(2);expect(l.tiles.filter(t=>!accessible(l.tiles,emptyState(),t.id)).length).toBeGreaterThan(5);
  const proof=solve(l.tiles,emptyState(),60000);if(proof.status==='solved'){solved++;expect(replay(l.tiles,proof.path).status).toBe('won');}else rejected++;
 }
 console.log('500 independent candidate seeds:',{solved,rejected});expect(solved).toBeGreaterThan(0);
},120000);
test('90,000 strategy runs reproduce all 30 calibrated level ratings exactly',()=>{
 expect(levels).toHaveLength(100);const layouts=new Set<string>();let lastScore=-1;
 for(const l of levels.slice(0,30)){
  expect(generate(l.seed,l.tier).tiles).toEqual(l.tiles);expect(replay(l.tiles,l.certificate).status).toBe('won');expect(replay(l.tiles,l.lossCertificate).status).toBe('lost');
  for(const strategy of ['random','greedy','lookahead'] as const){const stats=simulate(l.tiles,strategy,TRIALS,SIMULATION_SEED);expect(stats).toEqual(l.metrics[strategy]);}
  expect(acceptable(l.tier,l.metrics.random.rate,l.metrics.greedy.rate,l.metrics.lookahead.rate)).toBe(true);
  expect(l.metrics.score).toBe(score(l.metrics.greedy.rate,l.metrics.lookahead.rate));expect(l.metrics.score).toBeGreaterThanOrEqual(lastScore);lastScore=l.metrics.score;
  expect(l.metrics.motifs).toBeGreaterThanOrEqual(4);expect(l.metrics.choices).toBeGreaterThanOrEqual(2);expect(l.metrics.blocked).toBeGreaterThan(5);
  layouts.add(JSON.stringify(l.tiles.map(({x,y,z})=>[x,y,z]).sort()));
 }
 expect(layouts.size).toBe(30);
 console.log('All 90,000 behavior simulations reproduced exactly; every level has legal win and loss certificates.');
},240000);

import heldout from '../src/puzzle/heldout.json';
test('independent holdout stream reproduces 90,000 more games and confirms increasing tier challenge',()=>{
 const tierScores:number[][]=[[],[],[],[]];
 for(const l of levels.slice(0,30)){const data=heldout.results.find(x=>x.id===l.id)!;for(const strategy of ['random','greedy','lookahead'] as const)expect(simulate(l.tiles,strategy,heldout.trials,heldout.seed)).toEqual(data[strategy]);tierScores[l.tier].push(score(data.greedy.rate,data.lookahead.rate));expect(data.lookahead.rate-data.greedy.rate).toBeGreaterThan(.08);expect(data.greedy.rate).toBeLessThan(.85);}
 const averages=tierScores.map(v=>v.reduce((a,b)=>a+b,0)/v.length);for(let i=1;i<4;i++)expect(averages[i]).toBeGreaterThan(averages[i-1]);console.log('Holdout tier challenge indices:',averages);
},240000);
