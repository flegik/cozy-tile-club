import {type Tile,type State,emptyState} from './types';
import {accessible,move} from './engine';
import {rng} from './random';
export type Strategy='random'|'greedy'|'lookahead'|'advanced';
export type Simulation={trials:number;wins:number;rate:number;lossPath:number[];meanPeak:number;meanDecisions:number};
export function prepare(tiles:Tile[]){
 const bits=tiles.map(t=>1n<<BigInt(t.id));
 const blockers=tiles.map(t=>tiles.reduce((m,u,i)=>u.z>t.z&&Math.abs(t.x-u.x)<.94&&Math.abs(t.y-u.y)<.94?m|bits[i]:m,0n));
 const all=bits.reduce((a,b)=>a|b,0n),motifs=Math.max(...tiles.map(t=>t.motif))+1;
 return {tiles,bits,blockers,all,motifs,evaluations:new Map<bigint,number>(),lookahead:new Map<bigint,number[]>(),advanced:new Map<bigint,number[]>()};
}
type Board=ReturnType<typeof prepare>;
export type Compact={removed:bigint;counts:number[];used:number};
export function free(b:Board,s:Compact){const ids:number[]=[];for(let i=0;i<b.tiles.length;i++)if(!(s.removed&b.bits[i])&&(b.blockers[i]&~s.removed)===0n)ids.push(i);return ids;}
export function step(b:Board,s:Compact,i:number):Compact{const counts=[...s.counts],m=b.tiles[i].motif;counts[m]=(counts[m]+1)%3;return{removed:s.removed|b.bits[i],counts,used:s.used+(counts[m]===0?-2:1)};}
function evaluate(b:Board,s:Compact){const hit=b.evaluations.get(s.removed);if(hit!==undefined)return hit;if(s.used>=7)return -10000;if(s.removed===b.all)return 10000;const ids=free(b,s);const supply=Array(b.motifs).fill(0);for(const i of ids)supply[b.tiles[i].motif]++;
 let closable=0,stranded=0;for(let m=0;m<b.motifs;m++){if(s.counts[m]&&supply[m]>=3-s.counts[m])closable+=s.counts[m];else if(s.counts[m]&&supply[m]===0)stranded+=s.counts[m];}
 const score=-s.used*14+closable*8-stranded*13+Math.min(ids.length,10)*.5;if(b.evaluations.size<200000)b.evaluations.set(s.removed,score);return score;
}
// Three-ply bounded beam search. Uses only the full-information layer atlas,
// no certificate, solver, or hidden tie-break information. No recursive retries.
function lookScores(b:Board,s:Compact,ids:number[]){const cached=b.lookahead.get(s.removed);if(cached)return cached;const result=ids.map(i=>{const first=step(b,s,i);let frontier=[first];let best=evaluate(b,first);if(first.used>=7)return -10000;
 for(let depth=0;depth<2;depth++){
  const next=frontier.flatMap(state=>state.removed===b.all?[state]:free(b,state).map(j=>step(b,state,j))).filter(state=>state.used<7);
  if(!next.length)return -10000;
  next.sort((a,c)=>evaluate(b,c)-evaluate(b,a));frontier=next.slice(0,4);best=evaluate(b,frontier[0]);
 }
 return best;
});if(b.lookahead.size<100000)b.lookahead.set(s.removed,result);return result;}
// Six-ply beam search with independent per-root scores and deduplicated frontiers.
// Same public atlas information as the three-ply policy; never reads a certificate.
function advancedScores(b:Board,s:Compact,ids:number[]){const cached=b.advanced.get(s.removed);if(cached)return cached;
 const scores=ids.map(i=>{const first=step(b,s,i);if(first.used>=7)return -10000;let frontier=[first];
 for(let depth=1;depth<6;depth++){const unique=new Map<bigint,Compact>();for(const state of frontier){if(state.removed===b.all){unique.set(state.removed,state);continue;}for(const id of free(b,state)){const next=step(b,state,id);if(next.used<7)unique.set(next.removed,next);}}
 if(!unique.size)return -10000;frontier=[...unique.values()].sort((a,c)=>evaluate(b,c)-evaluate(b,a)).slice(0,6);}
 return evaluate(b,frontier[0]);});if(b.advanced.size<100000)b.advanced.set(s.removed,scores);return scores;
}
export function simulate(tiles:Tile[],strategy:Strategy,trials=1000,seed=1):Simulation{
 const b=prepare(tiles);let wins=0,totalPeak=0,totalChoices=0;let lossPath:number[]=[];
 for(let trial=0;trial<trials;trial++){
  const random=rng((seed+Math.imul(trial+1,2654435761))>>>0);let s:Compact={removed:0n,counts:Array(b.motifs).fill(0),used:0},peak=0;const path:number[]=[];let decisions=0;
  while(s.used<7&&s.removed!==b.all){const ids=free(b,s);if(!ids.length)break;let candidates=ids;
   if(ids.length>1)decisions++;
   if(strategy==='greedy'){const max=Math.max(...ids.map(i=>s.counts[tiles[i].motif]));candidates=ids.filter(i=>s.counts[tiles[i].motif]===max);}
   if(strategy==='lookahead'||strategy==='advanced'){const scores=strategy==='advanced'?advancedScores(b,s,ids):lookScores(b,s,ids),best=Math.max(...scores);candidates=ids.filter((_,i)=>scores[i]===best);}
   const i=candidates[Math.floor(random()*candidates.length)];path.push(tiles[i].id);s=step(b,s,i);peak=Math.max(peak,s.used);
  }
  if(s.removed===b.all&&s.used===0)wins++;else if(!lossPath.length&&s.used>=7)lossPath=path;
  totalPeak+=peak;totalChoices+=decisions;
 }
 return{trials,wins,rate:wins/trials,lossPath,meanPeak:Number((totalPeak/trials).toFixed(2)),meanDecisions:Number((totalChoices/trials).toFixed(2))};
}
export function replay(tiles:Tile[],path:number[]){let s=emptyState();for(const id of path){if(!accessible(tiles,s,id))throw new Error('Illegal simulation path');s=move(tiles,s,id);}return s;}
export function fromState(tiles:Tile[],state:State){const b=prepare(tiles);return{...b,state:{removed:state.removed.reduce((m,id)=>m|(1n<<BigInt(id)),0n),counts:Array.from({length:b.motifs},(_,m)=>state.tray.filter(t=>t===m).length),used:state.tray.length}};}
