import {catalog,type Placed,item,canPlace} from '../room/engine';
import {levels} from '../puzzle/levels';
import {emptyState,type State} from '../puzzle/types';
import {move} from '../puzzle/engine';
export type Save={version:2;pack:2;migrated:boolean;rewarded:number[];hearts:number;completed:number[];owned:string[];placed:Placed[];wall:string;floor:string;cozy:boolean;sound:boolean;active:{level:number;state:State;history:State[]}|null};
export const fresh=():Save=>({version:2,pack:2,migrated:false,rewarded:[],hearts:40,completed:[],owned:['plant','table'],placed:[{id:'plant',x:0,y:0},{id:'table',x:3,y:3}],wall:'#f3d2df',floor:'#ead9ce',cozy:false,sound:true,active:null});
export function reward(save:Save,level:number):Save{if(save.completed.includes(level)||!Number.isInteger(level)||level<1||level>30||level>save.completed.length+1)return save;return{...save,hearts:save.hearts+(save.rewarded.includes(level)?0:30),completed:[...save.completed,level],rewarded:save.rewarded.includes(level)?save.rewarded:[...save.rewarded,level]};}
export function purchase(save:Save,id:string):Save{const f=catalog.find(f=>f.id===id);if(!f||save.owned.includes(id)||save.hearts<f.price||save.completed.length+1<f.unlock)return save;return{...save,hearts:save.hearts-f.price,owned:[...save.owned,id]};}
export function parseSave(raw:string|null):Save{
 try{const s=JSON.parse(raw??'null');if(!s||![1,2].includes(s.version)||!Number.isSafeInteger(s.hearts)||s.hearts<0||!Array.isArray(s.completed)||!Array.isArray(s.owned)||!Array.isArray(s.placed))return fresh();
 if(s.completed.some((n:unknown)=>!Number.isInteger(n)||Number(n)<1||Number(n)>30)||new Set(s.completed).size!==s.completed.length||s.completed.some((_:unknown,i:number)=>!s.completed.includes(i+1)))return fresh();
 const base=fresh();const owned=[...new Set<string>(s.owned.filter((id:string)=>catalog.some(f=>f.id===id)))];let placed:Placed[]=[];
 for(const p of s.placed)if(p&&owned.includes(p.id)&&!placed.some(q=>q.id===p.id)&&canPlace(placed,p.id,p.x,p.y))placed.push({id:p.id,x:p.x,y:p.y});
 const allowedWall=['#f3d2df',...catalog.filter(f=>f.kind==='wall').map(f=>f.color)];const allowedFloor=['#ead9ce',...catalog.filter(f=>f.kind==='floor').map(f=>f.color)];
 let active:Save['active']=null;
 if(s.version===2&&s.pack===2&&s.active&&Number.isInteger(s.active.level)){const l=levels.find(l=>l.id===s.active.level);const target=s.active.state;if(l&&target&&Array.isArray(target.removed)&&Array.isArray(target.tray)&&Array.isArray(s.active.history)){
  let state=emptyState();const history:State[]=[];let valid=true;for(const id of target.removed){const next=move(l.tiles,state,id);if(next===state){valid=false;break;}history.push(state);state=next;}
  if(valid&&JSON.stringify(state.tray)===JSON.stringify(target.tray)&&state.status===target.status&&history.length===s.active.history.length&&history.every((h,i)=>JSON.stringify(h)===JSON.stringify(s.active.history[i])))active={level:l.id,state,history};
 }}
 const migration=s.version!==2||s.pack!==2;
 const rewarded=s.version===1?s.completed:Array.isArray(s.rewarded)?[...new Set<number>(s.rewarded.filter((n:unknown)=>Number.isInteger(n)&&Number(n)>=1&&Number(n)<=30))]:s.completed;
 return{...base,migrated:migration||s.migrated===true,rewarded:[...new Set<number>([...rewarded,...s.completed])],hearts:s.hearts,completed:s.completed,owned,placed,wall:allowedWall.includes(s.wall)?s.wall:base.wall,floor:allowedFloor.includes(s.floor)?s.floor:base.floor,cozy:!migration&&s.cozy===true,sound:typeof s.sound==='boolean'?s.sound:true,active};
 }catch{return fresh();}
}
export const SAVE_KEY='cozy-tile-club-v1';
export function load(){try{return parseSave(localStorage.getItem(SAVE_KEY));}catch{return fresh();}}
export function persist(save:Save){try{localStorage.setItem(SAVE_KEY,JSON.stringify(save));return true;}catch{return false;}}

export function restartCampaign(save:Save):Save{return{...save,completed:[],active:null,cozy:false};}
