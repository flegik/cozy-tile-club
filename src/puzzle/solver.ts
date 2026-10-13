// Independent rule implementation: does NOT call engine accessibility or move.
import {type Tile,type State} from './types';
export type SolveResult={status:'solved'|'unsolvable'|'budget';path:number[];nodes:number};
export function solve(tiles:Tile[],state:State,budget=60000):SolveResult{
 const blockers=tiles.map(t=>tiles.filter(u=>u.z>t.z&&Math.abs(t.x-u.x)<0.94&&Math.abs(t.y-u.y)<0.94).map(u=>1n<<BigInt(u.id)).reduce((a,b)=>a|b,0n));
 const all=tiles.reduce((m,t)=>m|(1n<<BigInt(t.id)),0n);
 const start=state.removed.reduce((m,id)=>m|(1n<<BigInt(id)),0n);
 const counts=Array.from({length:Math.max(...tiles.map(t=>t.motif))+1},(_,m)=>state.tray.filter(t=>t===m).length);
 let nodes=0,exceeded=false; const dead=new Set<string>();
 const visit=(removed:bigint,c:number[],used:number):number[]|null=>{
  if(++nodes>budget){exceeded=true;return null;}
  if(used>=7)return null;
  if(removed===all)return used===0?[]:null;
  const key=removed.toString(36)+':'+c.join('');if(dead.has(key))return null;
  const available=tiles.filter((t,i)=>!(removed&(1n<<BigInt(t.id)))&&(blockers[i]&~removed)===0n).sort((a,b)=>c[b.motif]-c[a.motif]||b.z-a.z||a.id-b.id);
  // Same motif + same blocker consequences can be symmetric, but keep all moves for correctness.
  for(const t of available){const next=[...c];next[t.motif]++;let size=used+1;if(next[t.motif]===3){next[t.motif]=0;size-=3;}
   const tail=visit(removed|(1n<<BigInt(t.id)),next,size);if(tail)return[t.id,...tail];if(exceeded)return null;
  }
  dead.add(key);return null;
 };
 if(state.status==='lost')return{status:'unsolvable',path:[],nodes:0};
 const path=visit(start,counts,state.tray.length);
 return{status:path?'solved':exceeded?'budget':'unsolvable',path:path??[],nodes};
}
