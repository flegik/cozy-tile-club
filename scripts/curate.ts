import {writeFileSync,readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {curateExtension,ADVANCED_SEED,HOLDOUT_SEED,ADVANCED_TRIALS,EXTENSION_TARGET} from '../src/puzzle/advanced-curator';
import type {Level} from '../src/puzzle/types';
const original=JSON.parse(readFileSync('tests/fixtures/released-30.json','utf8')) as Level[];
const existing=JSON.parse(readFileSync('src/puzzle/levels.json','utf8')) as Level[];
if(JSON.stringify(existing.slice(0,30))!==JSON.stringify(original))throw Error('Released levels changed; refusing generation');
if(existsSync('src/puzzle/release-lock.json')){const lock=JSON.parse(readFileSync('src/puzzle/release-lock.json','utf8'));for(const level of existing){const hash=lock[String(level.id)];if(hash&&createHash('sha256').update(JSON.stringify(level)).digest('hex')!==hash)throw Error('Released level '+level.id+' changed; refusing generation');}}
if(existing.length>=EXTENSION_TARGET){console.log(EXTENSION_TARGET+' released levels already present; refusing to regenerate them.');process.exit(0);}
const records:any[]=[];const prior=existsSync('src/puzzle/advanced-calibration.json')?JSON.parse(readFileSync('src/puzzle/advanced-calibration.json','utf8')):null;
const result=curateExtension(existing,(level,validation,audit)=>{records.push({level,validation});writeFileSync('/tmp/cozy-extension-checkpoint.json',JSON.stringify({records,audit}));},console.log);
writeFileSync('src/puzzle/levels.json',JSON.stringify(result.pack));
writeFileSync('src/puzzle/advanced-calibration.json',JSON.stringify({version:1,originalDigest:createHash('sha256').update(JSON.stringify(original)).digest('hex'),seed:ADVANCED_SEED,holdoutSeed:HOLDOUT_SEED,trials:ADVANCED_TRIALS,audit:result.audit,results:result.pack.slice(30).map(l=>({id:l.id,seed:l.seed,validation:result.validation.find(r=>r.seed===l.seed)??prior?.results.find((r:any)=>r.id===l.id&&r.seed===l.seed)?.validation}))}));
writeFileSync('src/puzzle/release-lock.json',JSON.stringify(Object.fromEntries(result.pack.map(l=>[l.id,createHash('sha256').update(JSON.stringify(l)).digest('hex')]))));
console.log('DONE',result.audit);
