import type {Simulation} from './simulation';
export type Tile = {id:number; x:number; y:number; z:number; motif:number};
export type Level = {id:number; seed:number; tiles:Tile[]; shape:string; difficulty:number; tier:number; certificate:number[];lossCertificate:number[];metrics:{choices:number;depth:number;blocked:number;motifs:number;score:number;random:Simulation;greedy:Simulation;lookahead:Simulation;solverNodes:number;advanced?:Simulation;analysis?:{effectiveChoices:number;decisionDensity:number;dependencyEdges:number;longestChain:number;matchHorizon:number;horizonUnknown:number;safe:number;unsafe:number;unknown:number};challenge?:number}};
export type State = {removed:number[]; tray:number[]; status:'playing'|'won'|'lost'};
export const emptyState = ():State => ({removed:[],tray:[],status:'playing'});
