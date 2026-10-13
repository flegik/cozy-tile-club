import {it,expect} from 'vitest';
import {mkdtempSync,mkdirSync,writeFileSync,readFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';
import {execFileSync} from 'node:child_process';
import vm from 'node:vm';
it('precache includes lazy worker and icons; offline navigations return shell and never fake asset responses',async()=>{
 const dir=mkdtempSync(join(tmpdir(),'cozy-pwa-'));mkdirSync(join(dir,'dist/assets'),{recursive:true});for(const f of ['index.html','assets/app.js','assets/solver-worker.js','icon-192.png'])writeFileSync(join(dir,'dist',f),f);
 try{execFileSync(process.execPath,[resolve('scripts/pwa.mjs')],{cwd:dir});const sw=readFileSync(join(dir,'dist/sw.js'),'utf8');const handlers:Record<string,any>={};const requests:string[]=[];const deleted:string[]=[];
 const context={self:{location:new URL('https://example.com/game/sw.js'),addEventListener:(name:string,fn:any)=>{handlers[name]=fn;},skipWaiting:async()=>{},clients:{claim:async()=>{}}},caches:{open:async()=>({addAll:async(assets:string[])=>{requests.push(...assets);}}),keys:async()=>['cozy-old','other-app'],delete:async(key:string)=>{deleted.push(key);},match:async(request:any)=>String(request).endsWith('index.html')?'offline-shell':undefined},fetch:async()=>{throw new Error('offline');},URL,Response};
 vm.runInNewContext(sw,context);let wait:Promise<any>=Promise.resolve();handlers.install({waitUntil:(p:Promise<any>)=>wait=p});await wait;expect(requests).toContain('./assets/solver-worker.js');expect(requests).toContain('./icon-192.png');handlers.activate({waitUntil:(p:Promise<any>)=>wait=p});await wait;expect(deleted).toEqual(['cozy-old']);
 let response:Promise<any>=Promise.resolve();handlers.fetch({request:{url:'https://example.com/game/',method:'GET',mode:'navigate'},respondWith:(p:Promise<any>)=>response=p});expect(await response).toBe('offline-shell');handlers.fetch({request:{url:'https://example.com/game/missing.js',method:'GET',mode:'cors'},respondWith:(p:Promise<any>)=>response=p});expect((await response).type).toBe('error');
 }finally{rmSync(dir,{recursive:true,force:true});}
});
