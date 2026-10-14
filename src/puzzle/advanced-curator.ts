import {generate} from './generator';
import {solve} from './solver';
import {simulate,replay} from './simulation';
import {analyze} from './analysis';
import {emptyState,type Level} from './types';
export const ADVANCED_SEED=0xC02E6026,HOLDOUT_SEED=0x51A7F602,ADVANCED_TRIALS=1000;
export const stages=[
 {tier:4,count:10,name:'Schwer',shallow:[.18,.4],deep:[.55,.9],gain:.12},
 {tier:5,count:20,name:'Sehr schwer',shallow:[.04,.3],deep:[.42,.7],gain:.15},
 {tier:6,count:20,name:'Experte',shallow:[0,.18],deep:[.28,.52],gain:.18},
 {tier:7,count:15,name:'Master',shallow:[0,.1],deep:[.16,.35],gain:.14},
 {tier:8,count:5,name:'Finale',shallow:[0,.06],deep:[.08,.22],gain:.08}
];
export const EXTENSION_TARGET=30+stages.reduce((sum,stage)=>sum+stage.count,0);
export function advancedAccept(tier:number,g:number,s:number,d:number,tolerance=0){const band=stages.find(t=>t.tier===tier)!;return g<=.12&&s>=band.shallow[0]-tolerance&&s<=band.shallow[1]+tolerance&&d>=band.deep[0]-tolerance&&d<=band.deep[1]+tolerance&&d-s>=band.gain-tolerance;}
export const layoutKey=(l:Pick<Level,'tiles'>)=>l.tiles.map(t=>`${t.x.toFixed(2)},${t.y.toFixed(2)},${t.z}`).sort().join('|');
export function similarity(a:Pick<Level,'tiles'>,b:Pick<Level,'tiles'>){const x=new Set(layoutKey(a).split('|')),y=new Set(layoutKey(b).split('|'));let common=0;for(const k of x)if(y.has(k))common++;return common/(x.size+y.size-common);}
export function curateExtension(original:Level[],onLevel:(l:Level,validation:unknown,audit:unknown)=>void,onProgress:(s:string)=>void){
 const pack=[...original],validation:any[]=[];const audit={candidates:0,uncertified:0,quickRejected:0,fullRejected:0,duplicateRejected:0};
 let end=30;for(const band of stages){end+=band.count;const needed=Math.max(0,end-Math.max(original.length,end-band.count));if(!needed)continue;const found:Level[]=[];
  for(let attempt=1;found.length<needed&&attempt<=7000;attempt++){
   const seed=(Math.imul(attempt,7919)+Math.imul(band.tier+1,104729))>>>0,candidate=generate(seed,band.tier);audit.candidates++;
   const proof=solve(candidate.tiles,emptyState(),30000);if(proof.status!=='solved'){audit.uncertified++;continue;}
   const greedy=simulate(candidate.tiles,'greedy',64,ADVANCED_SEED);if(greedy.rate>.12){audit.quickRejected++;continue;}
   const shallow=simulate(candidate.tiles,'lookahead',64,ADVANCED_SEED);if(shallow.rate>band.shallow[1]+.08||shallow.rate<band.shallow[0]-.08){audit.quickRejected++;continue;}
   const deep=simulate(candidate.tiles,'advanced',64,ADVANCED_SEED);if(!advancedAccept(band.tier,greedy.rate,shallow.rate,deep.rate,.06)){audit.quickRejected++;continue;}
   if([...pack,...found].some(l=>similarity(l,candidate)>.85)){audit.duplicateRejected++;continue;}
   const random=simulate(candidate.tiles,'random',ADVANCED_TRIALS,ADVANCED_SEED),g=simulate(candidate.tiles,'greedy',ADVANCED_TRIALS,ADVANCED_SEED),s=simulate(candidate.tiles,'lookahead',ADVANCED_TRIALS,ADVANCED_SEED),d=simulate(candidate.tiles,'advanced',ADVANCED_TRIALS,ADVANCED_SEED);
   if(!advancedAccept(band.tier,g.rate,s.rate,d.rate)||!random.lossPath.length){audit.fullRejected++;continue;}
   const heldout={random:simulate(candidate.tiles,'random',ADVANCED_TRIALS,HOLDOUT_SEED),greedy:simulate(candidate.tiles,'greedy',ADVANCED_TRIALS,HOLDOUT_SEED),lookahead:simulate(candidate.tiles,'lookahead',ADVANCED_TRIALS,HOLDOUT_SEED),advanced:simulate(candidate.tiles,'advanced',ADVANCED_TRIALS,HOLDOUT_SEED)};
   if(!advancedAccept(band.tier,heldout.greedy.rate,heldout.lookahead.rate,heldout.advanced.rate,.025)){audit.fullRejected++;continue;}
   if(replay(candidate.tiles,proof.path).status!=='won'||replay(candidate.tiles,random.lossPath).status!=='lost')throw Error('Invalid certificate');
   const analysis=analyze(candidate.tiles,proof.path);if(analysis.effectiveChoices<2||analysis.decisionDensity<.5||analysis.unsafe<1){audit.fullRejected++;continue;}
   const choices=candidate.tiles.filter(t=>!candidate.tiles.some(u=>u.z>t.z&&Math.abs(t.x-u.x)<.94&&Math.abs(t.y-u.y)<.94)).length;
   if(choices<4||choices>candidate.tiles.length*.6){audit.fullRejected++;continue;}
   const l:Level={...candidate,id:0,difficulty:0,certificate:proof.path,lossCertificate:random.lossPath,metrics:{choices,depth:Math.max(...candidate.tiles.map(t=>t.z))+1,blocked:candidate.tiles.length-choices,motifs:new Set(candidate.tiles.map(t=>t.motif)).size,score:Number((100*(1-.6*g.rate-.4*s.rate)).toFixed(2)),random,greedy:g,lookahead:s,advanced:d,solverNodes:proof.nodes,analysis,challenge:Number((100*(1-.1*g.rate-.25*s.rate-.65*d.rate)).toFixed(2))}};
   found.push(l);validation.push({seed,...heldout});onLevel(l,heldout,audit);onProgress(`${band.name} ${found.length}/${needed} seed ${seed} shallow ${s.rate} advanced ${d.rate} candidates ${audit.candidates}`);
  }
  if(found.length!==needed)throw Error('Insufficient calibrated levels in '+band.name);
  found.sort((a,b)=>a.metrics.challenge!-b.metrics.challenge!);pack.push(...found);
 }
 for(let i=original.length;i<pack.length;i++){pack[i].id=i+1;pack[i].difficulty=i+1;}return{pack,validation,audit};
}
