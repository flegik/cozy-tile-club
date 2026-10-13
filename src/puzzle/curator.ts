import {generate} from './generator';
import {solve} from './solver';
import {simulate,replay} from './simulation';
import {accessible} from './engine';
import {emptyState,type Level} from './types';
export const SIMULATION_SEED=0xC02E2026;
export const TRIALS=1000;
export const score=(greedy:number,lookahead:number)=>Number((100*(1-.6*greedy-.4*lookahead)).toFixed(2));
export const bands=[[15,33],[36,50],[54,67],[72,90]] as const;
export function acceptable(tier:number,r:number,g:number,l:number){const s=score(g,l);return r<.4&&g<.85&&l>g+.08&&s>=bands[tier][0]&&s<=bands[tier][1]&&(tier<2?l>=.9:tier===2?l>=.65:l>=.2)&& (tier===3?l<=.68:true);}
export function buildPack(onProgress:(message:string)=>void=()=>{}){
 const pack:Level[]=[];const counts=[5,10,10,5];const audit={candidates:0,uncertified:0,behaviorRejected:0,fullRunsRejected:0};
 for(let tier=0;tier<4;tier++){
  const found:Level[]=[];
  for(let attempt=1;found.length<counts[tier]&&attempt<=2500;attempt++){
   const seed=(Math.imul(attempt,7919)+Math.imul(tier+1,104729))>>>0;const candidate=generate(seed,tier);audit.candidates++;
   const proof=solve(candidate.tiles,emptyState(),60000);if(proof.status!=='solved'){audit.uncertified++;continue;}
   const g=simulate(candidate.tiles,'greedy',128,SIMULATION_SEED).rate;
   if(g>=.85||(tier===0&&g<.4)||(tier===1&&(g<.15||g>.5))||(tier===2&&g>.3)||(tier===3&&g>.15)){audit.behaviorRejected++;continue;}
   const r=simulate(candidate.tiles,'random',128,SIMULATION_SEED).rate,l=simulate(candidate.tiles,'lookahead',64,SIMULATION_SEED).rate;
   if(!acceptable(tier,r,g,l)){audit.behaviorRejected++;continue;}
   const random=simulate(candidate.tiles,'random',TRIALS,SIMULATION_SEED),greedy=simulate(candidate.tiles,'greedy',TRIALS,SIMULATION_SEED),lookahead=simulate(candidate.tiles,'lookahead',TRIALS,SIMULATION_SEED);
   if(!acceptable(tier,random.rate,greedy.rate,lookahead.rate)||!random.lossPath.length){audit.fullRunsRejected++;continue;}
   if(replay(candidate.tiles,proof.path).status!=='won'||replay(candidate.tiles,random.lossPath).status!=='lost')throw new Error('Engine disagrees with certificate');
   const free=candidate.tiles.filter(t=>accessible(candidate.tiles,emptyState(),t.id)).length;
   const level:Level={...candidate,id:0,difficulty:0,certificate:proof.path,lossCertificate:random.lossPath,metrics:{choices:free,depth:Math.max(...candidate.tiles.map(t=>t.z))+1,blocked:candidate.tiles.length-free,motifs:new Set(candidate.tiles.map(t=>t.motif)).size,score:score(greedy.rate,lookahead.rate),random,greedy,lookahead,solverNodes:proof.nodes}};
   found.push(level);onProgress(`tier ${tier+1}: ${found.length}/${counts[tier]}, seed ${seed}, random ${random.rate}, greedy ${greedy.rate}, look ${lookahead.rate}, candidates ${audit.candidates}`);
  }
  if(found.length!==counts[tier])throw new Error('Insufficient calibrated candidates in tier '+tier);
  found.sort((a,b)=>a.metrics.score-b.metrics.score);pack.push(...found);
 }
 pack.forEach((l,i)=>{l.id=i+1;l.difficulty=i+1;});return{pack,audit};
}
