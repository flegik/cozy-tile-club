import type {Tile,State} from '../puzzle/types';
export type TrayTile={id:number;motif:number};
// Stable visual IDs are derived from the persisted selection history. The
// authoritative tray order and triple-removal rules are never rewritten.
export function trayTiles(tiles:Tile[],state:State):TrayTile[]{let result:TrayTile[]=[];for(const id of state.removed){const tile=tiles.find(t=>t.id===id);if(!tile)continue;result.push({id,motif:tile.motif});if(result.filter(t=>t.motif===tile.motif).length===3)result=result.filter(t=>t.motif!==tile.motif);}return result;}
export function groupTray(tokens:TrayTile[]):TrayTile[]{const groups=new Map<number,TrayTile[]>();for(const t of tokens){if(!groups.has(t.motif))groups.set(t.motif,[]);groups.get(t.motif)!.push(t);}return [...groups.values()].flat();}
export function stageMove(tiles:Tile[],before:State,id:number){const tile=tiles.find(t=>t.id===id)!;const tokens=groupTray([...trayTiles(tiles,before),{id,motif:tile.motif}]);const matches=tokens.filter(t=>t.motif===tile.motif);return{tokens,index:tokens.findIndex(t=>t.id===id),matched:matches.length===3?matches.map(t=>t.id):[]};}
export type Box={left:number;top:number;width:number;height:number};
export const box=(element:Element):Box=>{const r=element.getBoundingClientRect();return{left:r.left,top:r.top,width:r.width,height:r.height};};
export function flightPath(source:Box,target:Box){const dx=target.left+target.width/2-source.left-source.width/2,dy=target.top+target.height/2-source.top-source.height/2,scale=target.width/(source.width||1),lift=Math.min(70,Math.abs(dy)*.13+24);return[{transform:'translate3d(0,0,0) scale(1)',offset:0},...Array.from({length:9},(_,i)=>{const t=i/8;return{transform:`translate3d(${dx*t}px,${-3*(1-t)+dy*t-2*lift*t*(1-t)}px,0) scale(${1.08+(scale-1.08)*t})`,offset:.1+.9*t};})];}
