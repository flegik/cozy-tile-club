import {catalog,type Placed,canPlace} from '../room/engine';
import {levels} from '../puzzle/levels';
import {emptyState,type State} from '../puzzle/types';
import type {Theme} from '../theme/tokens';
import type {SolveResult} from '../puzzle/solver';
import {move} from '../puzzle/engine';
import {readTracking,bumpTracking,type Tracking} from '../game/playtest';
import {HELP_LIMITS,LEVEL_REWARD} from '../game/config';
export type Mode='normal'|'cozy';
export type Attempt={level:number;state:State;history:State[];help:{undo:number;hint:number};hinted:number|null;observed?:string[]};
export type Campaign={completed:number[];rewarded:number[];active:Attempt|null};
export type Save={tutorialCompleted:boolean;tracking:Tracking;version:3;pack:2;migrated:boolean;hearts:number;owned:string[];placed:Placed[];wall:string;floor:string;sound:boolean;theme:Theme;themeChosen:boolean;mode:Mode;campaigns:Record<Mode,Campaign>};
export const freshCampaign=():Campaign=>({completed:[],rewarded:[],active:null});
export const fresh=():Save=>({tutorialCompleted:false,tracking:{normal:{},cozy:{}},version:3,pack:2,migrated:false,hearts:40,owned:['plant','table'],placed:[{id:'plant',x:0,y:0},{id:'table',x:3,y:3}],wall:'#f3d2df',floor:'#ead9ce',sound:true,theme:'dark',themeChosen:false,mode:'normal',campaigns:{normal:freshCampaign(),cozy:freshCampaign()}});
export const campaign=(save:Save,mode:Mode=save.mode)=>save.campaigns[mode];
export const nextLevel=(save:Save)=>Math.min(levels.length,campaign(save).completed.length+1);
export function switchMode(save:Save,mode:Mode):Save{return save.mode===mode?save:{...save,mode};}
export function setTheme(save:Save,theme:Theme):Save{return{...save,theme,themeChosen:true};}
function updateCampaign(save:Save,value:Campaign,mode:Mode=save.mode):Save{return{...save,campaigns:{...save.campaigns,[mode]:value}};}
export function reward(save:Save,level:number,mode:Mode=save.mode):Save{const c=campaign(save,mode);if(c.completed.includes(level)||!Number.isInteger(level)||level<1||level>levels.length||level>c.completed.length+1)return save;return{...updateCampaign(save,{...c,completed:[...c.completed,level],rewarded:c.rewarded.includes(level)?c.rewarded:[...c.rewarded,level]},mode),hearts:save.hearts+(c.rewarded.includes(level)?0:LEVEL_REWARD)};}
export const shopProgress=(save:Save)=>Math.max(save.campaigns.normal.completed.length,save.campaigns.cozy.completed.length);
export function purchase(save:Save,id:string):Save{const f=catalog.find(f=>f.id===id);if(!f||save.owned.includes(id)||save.hearts<f.price||shopProgress(save)+1<f.unlock)return save;return{...save,hearts:save.hearts-f.price,owned:[...save.owned,id]};}
export function startAttempt(save:Save,id:number):Save{const c=campaign(save);if(!Number.isInteger(id)||id<1||id>levels.length||id>c.completed.length+1)return save;const restart=c.active?.level===id;save=bumpTracking(save,id,"attempts");if(restart)save=bumpTracking(save,id,"restarts");return updateCampaign(save,{...c,active:{level:id,state:emptyState(),history:[],help:{...HELP_LIMITS},hinted:null,observed:[]}});}
export function playTile(save:Save,id:number):Save{const c=campaign(save),a=c.active;if(!a)return save;const l=levels.find(l=>l.id===a.level)!;const state=move(l.tiles,a.state,id);if(state===a.state)return save;let next=updateCampaign(save,{...c,active:{...a,state,history:[...a.history,a.state],hinted:null}});if(state.status!=='playing'&&!a.observed?.includes(state.status)){next=bumpTracking(next,a.level,state.status==='won'?'wins':'losses');next=updateCampaign(next,{...campaign(next),active:{...campaign(next).active!,observed:[...(a.observed??[]),state.status]}});}if(state.status==='won')next=reward(next,a.level);return next;}
export function undoAttempt(save:Save):Save{const c=campaign(save),a=c.active;if(!a||a.help.undo<=0||!a.history.length)return save;save=bumpTracking(save,a.level,"undos");return updateCampaign(save,{...c,active:{...a,state:a.history.at(-1)!,history:a.history.slice(0,-1),help:{...a.help,undo:a.help.undo-1},hinted:null}});}
// Verify the returned continuation against gameplay before charging a hint.
// Expected state identity protects against stale worker/import/restart responses.
export function applyHint(save:Save,result:SolveResult,expected:State):Save{const c=campaign(save),a=c.active;if(!a||a.state!==expected||a.state.status!=='playing'||a.help.hint<=0||result.status!=='solved'||!result.path.length)return save;const l=levels.find(l=>l.id===a.level)!;let state=a.state;for(const id of result.path){const next=move(l.tiles,state,id);if(next===state)return save;state=next;}if(state.status!=='won')return save;save=bumpTracking(save,a.level,'hints');return updateCampaign(save,{...c,active:{...a,help:{...a.help,hint:a.help.hint-1},hinted:result.path[0]}});}
export function restartCampaign(save:Save):Save{const c=campaign(save);return updateCampaign(save,{...c,completed:[],active:null});}
function validIds(values:unknown):number[]{return Array.isArray(values)?[...new Set<number>(values.filter(n=>Number.isInteger(n)&&n>=1&&n<=levels.length))]:[];}
function completedIds(values:unknown):number[]{const ids=validIds(values),result:number[]=[];for(let id=1;id<=levels.length&&ids.includes(id);id++)result.push(id);return result;}
function readAttempt(raw:any,completed:number[],legacy:boolean):Attempt|null{
 if(!raw||!Number.isInteger(raw.level)||raw.level<1||raw.level>Math.min(levels.length,completed.length+1))return null;
 const l=levels.find(l=>l.id===raw.level);if(!l||!raw.state||!Array.isArray(raw.state.removed)||!Array.isArray(raw.state.tray)||!Array.isArray(raw.history))return null;
 let state=emptyState();const history:State[]=[];
 for(const id of raw.state.removed){const next=move(l.tiles,state,id);if(next===state)return null;history.push(state);state=next;}
 if(JSON.stringify(state.tray)!==JSON.stringify(raw.state.tray)||state.status!==raw.state.status||history.length!==raw.history.length||!history.every((h,i)=>raw.history[i]&&h.status===raw.history[i].status&&JSON.stringify(h.removed)===JSON.stringify(raw.history[i].removed)&&JSON.stringify(h.tray)===JSON.stringify(raw.history[i].tray)))return null;
 const remaining=(value:unknown,limit:number)=>Number.isInteger(value)&&Number(value)>=0?Math.min(Number(value),limit):0;
 const hinted=!legacy&&Number.isInteger(raw.hinted)&&state.status==='playing'&&move(l.tiles,state,raw.hinted)!==state?raw.hinted:null;
 return{level:l.id,state,history,observed:Array.isArray(raw.observed)?raw.observed.filter((v:unknown)=>v==='won'||v==='lost'):(state.status==='playing'?[]:[state.status]),help:legacy?{...HELP_LIMITS}:{undo:remaining(raw.help?.undo,HELP_LIMITS.undo),hint:remaining(raw.help?.hint,HELP_LIMITS.hint)},hinted};
}
function readCampaign(raw:any,legacy:boolean,packMatches:boolean):Campaign{const completed=completedIds(raw?.completed),rewarded=[...new Set([...validIds(raw?.rewarded),...completed])];return{completed,rewarded,active:packMatches?readAttempt(raw?.active,completed,legacy):null};}
export function parseSave(raw:string|null):Save{
 try{const s=JSON.parse(raw??'null');if(!s||![1,2,3].includes(s.version))return fresh();const base=fresh();
 const owned=Array.isArray(s.owned)?[...new Set<string>(s.owned.filter((id:string)=>catalog.some(f=>f.id===id)))]:base.owned;let placed:Placed[]=[];
 for(const p of Array.isArray(s.placed)?s.placed:base.placed)if(p&&owned.includes(p.id)&&!placed.some(q=>q.id===p.id)&&canPlace(placed,p.id,p.x,p.y))placed.push({id:p.id,x:p.x,y:p.y});
 const walls=['#f3d2df',...catalog.filter(f=>f.kind==='wall').map(f=>f.color)],floors=['#ead9ce',...catalog.filter(f=>f.kind==='floor').map(f=>f.color)];
 const legacy=s.version!==3,packMatches=s.pack===2;
 const campaigns:Save['campaigns']=legacy?{normal:readCampaign(s,true,s.version===2&&packMatches),cozy:freshCampaign()}:{normal:readCampaign(s.campaigns?.normal,false,packMatches),cozy:readCampaign(s.campaigns?.cozy,false,packMatches)};
 const validTheme=s.theme==='light'||s.theme==='dark';
 // Old versions did not distinguish automatic light from an explicit selection.
 // Preserve their valid stored theme rather than overwrite a possible preference.
 const themeChosen=validTheme&&(legacy||s.themeChosen===true);
 return{...base,tutorialCompleted:s.tutorialCompleted===true,tracking:readTracking(s.tracking),migrated:legacy||!packMatches||s.migrated===true,hearts:Number.isSafeInteger(s.hearts)&&s.hearts>=0?s.hearts:base.hearts,owned,placed,wall:walls.includes(s.wall)?s.wall:base.wall,floor:floors.includes(s.floor)?s.floor:base.floor,sound:typeof s.sound==='boolean'?s.sound:true,theme:themeChosen?s.theme:'dark',themeChosen,mode:!legacy&&s.mode==='cozy'?'cozy':'normal',campaigns};
 }catch{return fresh();}
}
// Keep the original key so existing installations migrate in place.
export const SAVE_KEY='cozy-tile-club-v1';
export function load(){try{return parseSave(localStorage.getItem(SAVE_KEY));}catch{return fresh();}}
export function persist(save:Save){try{localStorage.setItem(SAVE_KEY,JSON.stringify(save));return true;}catch{return false;}}
