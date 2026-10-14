import {move} from './engine';
import {solve,type SolveResult} from './solver';
import type {Tile,State} from './types';
// A stored proof is only a fast path after replaying every remaining move with
// the real engine. Arbitrary safe player choices still use the independent solver.
export function continuation(tiles:Tile[],state:State,certificate:number[]|undefined,budget:number):SolveResult{
 if(state.status==='lost')return{status:'unsolvable',path:[],nodes:0};
 if(certificate?.length===tiles.length){let current=state;const path:number[]=[];for(const id of certificate){if(state.removed.includes(id))continue;const next=move(tiles,current,id);if(next===current)break;path.push(id);current=next;}if(current.status==='won')return{status:'solved',path,nodes:0};}
 return solve(tiles,state,budget);
}
