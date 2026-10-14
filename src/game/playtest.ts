import {levels} from '../puzzle/levels';
import type {Save,Mode} from '../save/store';
export type Metrics={attempts:number;wins:number;losses:number;seconds:number;undos:number;hints:number;restarts:number};
export type Tracking=Record<Mode,Record<string,Metrics>>;
const blank=():Metrics=>({attempts:0,wins:0,losses:0,seconds:0,undos:0,hints:0,restarts:0});
export function readTracking(raw:any):Tracking{const result:Tracking={normal:{},cozy:{}};for(const mode of ['normal','cozy'] as const)for(let id=1;id<=levels.length;id++){const row=raw?.[mode]?.[id];if(!row)continue;const clean=blank();for(const key of Object.keys(clean) as (keyof Metrics)[])clean[key]=Number.isFinite(row[key])&&row[key]>=0?Math.min(row[key],Number.MAX_SAFE_INTEGER):0;result[mode][id]=clean;}return result;}
export function bumpTracking(save:Save,level:number,key:keyof Metrics,amount=1,mode:Mode=save.mode):Save{if(!Number.isFinite(amount)||amount<=0)return save;const row=save.tracking[mode][level]??blank();return {...save,tracking:{...save.tracking,[mode]:{...save.tracking[mode],[level]:{...row,[key]:row[key]+amount}}}};}
export function playtestReport(save:Save){return{version:1,exportedAt:new Date().toISOString(),levelPack:save.pack,notes:'Lokale Daten seit Einführung des Trackings. Spielzeit zählt sichtbares, aktives Spielen ohne Dialoge. Siege und Niederlagen zählen je Versuch höchstens einmal; ein durch Rückgängig geretteter Versuch kann beide enthalten. Fortgesetzte ältere Versuche werden nicht rückwirkend gezählt.',modes:save.tracking};}
