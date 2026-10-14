import {writeFileSync} from 'node:fs';
import {levels} from '../src/puzzle/levels';import {continuation} from '../src/puzzle/continuation';import {replay} from '../src/puzzle/simulation';import {accessible,move} from '../src/puzzle/engine';
const rows:any[]=[];
for(const l of levels.slice(30))for(const cut of [0,Math.floor(l.tiles.length/3),Math.floor(l.tiles.length*2/3)]){
 const state=replay(l.tiles,l.certificate.slice(0,cut));const options=l.tiles.filter(t=>accessible(l.tiles,state,t.id));
 for(const id of [null,options.find(t=>t.id!==l.certificate[cut])?.id].filter(id=>id!==undefined)){
 const s=id===null?state:move(l.tiles,state,id!);const start=performance.now(),r=continuation(l.tiles,s,l.certificate,200000);const ms=performance.now()-start;
 if(r.status==='solved'&&replay(l.tiles,[...s.removed,...r.path]).status!=='won')throw Error('Invalid runtime solution');rows.push({id:l.id,cut,alternative:id!==null,status:r.status,nodes:r.nodes,ms:Number(ms.toFixed(2))});
 }}
writeFileSync('src/puzzle/runtime-validation.json',JSON.stringify({environment:'Node 24 Linux host; desktop timings are not Android/iPhone measurements',budget:200000,results:rows}));
const sorted=rows.map(r=>r.ms).sort((a,b)=>a-b);console.log({queries:rows.length,p95:sorted[Math.floor(sorted.length*.95)],max:sorted.at(-1),budgets:rows.filter(r=>r.status==='budget').length,fastProofs:rows.filter(r=>r.nodes===0&&r.status==='solved').length});
