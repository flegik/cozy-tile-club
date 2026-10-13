import {type Tile,type State} from './types';
export function overlaps(a:Tile,b:Tile){return Math.abs(a.x-b.x)<0.94 && Math.abs(a.y-b.y)<0.94;}
export function accessible(tiles:Tile[],state:State,id:number){const t=tiles.find(t=>t.id===id);return !!t&&!state.removed.includes(id)&&!tiles.some(u=>u.z>t.z&&!state.removed.includes(u.id)&&overlaps(t,u));}
export function move(tiles:Tile[],state:State,id:number):State{
 if(state.status!=='playing'||!accessible(tiles,state,id))return state;
 const motif=tiles.find(t=>t.id===id)!.motif;
 let tray=[...state.tray,motif];
 if(tray.filter(m=>m===motif).length===3)tray=tray.filter(m=>m!==motif);
 const removed=[...state.removed,id];
 return {removed,tray,status:tray.length>=7?'lost':removed.length===tiles.length&&tray.length===0?'won':'playing'};
}
export function undo(history:State[]):{state:State;history:State[]}|null{if(!history.length)return null;return{state:history.at(-1)!,history:history.slice(0,-1)};}
