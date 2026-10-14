import {accessible,move} from './engine';
import {solve} from './solver';
import {emptyState,type Tile} from './types';
import {free,step,fromState,type Compact} from './simulation';
// Structural density along a certified path, not a count of all possible solutions.
export function analyze(tiles:Tile[],certificate:number[]){
 let state=emptyState(),effective=0,decisions=0,positions=0,matchHorizon=0,horizonUnknown=0,safe=0,unsafe=0,unknown=0;
 const dependencies=tiles.map(t=>tiles.filter(u=>u.z>t.z&&Math.abs(t.x-u.x)<.94&&Math.abs(t.y-u.y)<.94).map(u=>u.id));
 const chain=(id:number):number=>1+Math.max(0,...dependencies[id].map(chain));
 for(let index=0;index<certificate.length;index++){
  const available=tiles.filter(t=>accessible(tiles,state,t.id));
  const options=new Set(available.map(t=>t.motif+':'+tiles.filter(u=>dependencies[u.id].includes(t.id)&&dependencies[u.id].filter(id=>!state.removed.includes(id)).length===1).map(u=>u.id).join(','))).size;
  effective+=options;positions++;if(options>1)decisions++;
  if(index%6===0&&state.status==='playing'){
   // Sample public choice conflicts, report exhausted searches as unknown.
   for(const t of available.slice(0,6)){const next=move(tiles,state,t.id),result=solve(tiles,next,12000);if(result.status==='solved')safe++;else if(result.status==='unsolvable')unsafe++;else unknown++;}
   if(state.tray.length){const b=fromState(tiles,state);let frontier:Compact[]=[b.state],found=false,nodes=0;
    for(let depth=1;depth<=6&&!found;depth++){const unique=new Map<bigint,Compact>();search: for(const s of frontier)for(const id of free(b,s)){if(++nodes>6000)break search;const next=step(b,s,id);if(next.used<s.used){matchHorizon=Math.max(matchHorizon,depth);found=true;break;}if(next.used<7)unique.set(next.removed,next);}if(nodes>6000)break;frontier=[...unique.values()];}
    if(!found)horizonUnknown++;
   }
  }
  state=move(tiles,state,certificate[index]);
 }
 return{effectiveChoices:Number((effective/positions).toFixed(3)),decisionDensity:Number((decisions/positions).toFixed(3)),dependencyEdges:dependencies.reduce((a,b)=>a+b.length,0),longestChain:Math.max(...tiles.map(t=>chain(t.id))),matchHorizon,horizonUnknown,safe,unsafe,unknown};
}
