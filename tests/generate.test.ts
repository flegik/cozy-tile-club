import {test,expect} from 'vitest';
import {writeFileSync,readFileSync} from 'node:fs';
import {generate} from '../src/puzzle/generator';
import {move} from '../src/puzzle/engine';
import {emptyState} from '../src/puzzle/types';
test('generate verified release pack (30) and stress 500 deterministic seeds',()=>{
 const pack=[];let maximum=0;
 for(let seed=1;seed<=500;seed++){
  const difficulty=1+(seed-1)%30;const l=generate(seed*7919,difficulty);const again=generate(seed*7919,difficulty);expect(l).toEqual(again);
  const counts=new Map<number,number>();for(const t of l.tiles)counts.set(t.motif,(counts.get(t.motif)??0)+1);for(const c of counts.values())expect(c%3).toBe(0);
  let s=emptyState();for(const id of l.certificate){const next=move(l.tiles,s,id);expect(next).not.toBe(s);s=next;maximum=Math.max(maximum,s.tray.length);}expect(s.status).toBe('won');
  if(seed<=30)pack.push(l);
 }
 pack.sort((a,b)=>a.metrics.score-b.metrics.score||a.tiles.length-b.tiles.length);pack.forEach((l,i)=>{l.id=i+1;l.difficulty=i+1;});
 if(process.env.UPDATE_LEVELS==='1')writeFileSync('src/puzzle/levels.json',JSON.stringify(pack));else expect(JSON.parse(readFileSync('src/puzzle/levels.json','utf8'))).toEqual(pack);
 console.log(`500 seeds generated twice, solved independently and replayed; max tray ${maximum}; scores ${pack[0].metrics.score}–${pack.at(-1)!.metrics.score}`);
},120000);
