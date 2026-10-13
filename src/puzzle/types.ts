export type Tile = {id:number; x:number; y:number; z:number; motif:number};
export type Level = {id:number; seed:number; tiles:Tile[]; shape:string; difficulty:number; metrics:{choices:number; depth:number; traps:number; lookahead:number; score:number}; certificate:number[]};
export type State = {removed:number[]; tray:number[]; status:'playing'|'won'|'lost'};
export const emptyState = ():State => ({removed:[],tray:[],status:'playing'});
