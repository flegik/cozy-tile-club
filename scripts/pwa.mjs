import {readdirSync,readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
function list(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(f=>f.isDirectory()?list(`${dir}/${f.name}`):[`${dir}/${f.name}`]);}
const files=list('dist').filter(f=>!f.endsWith('/sw.js'));const hash=createHash('sha256');files.forEach(f=>hash.update(readFileSync(f)));const version=hash.digest('hex').slice(0,12);
writeFileSync('dist/sw.js',`const PREFIX='cozy-tile-club:'+new URL('./',self.location).pathname+':';const CACHE=PREFIX+'${version}';const ASSETS=${JSON.stringify(files.map(f=>'./'+f.slice(5)))};
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const url=new URL(e.request.url),root=new URL('./',self.location);if(e.request.method!=='GET'||url.origin!==root.origin||!url.pathname.startsWith(root.pathname))return;e.respondWith(caches.open(CACHE).then(c=>c.match(e.request)).then(hit=>hit||fetch(e.request).catch(()=>e.request.mode==='navigate'?caches.open(CACHE).then(c=>c.match(new URL('./index.html',self.location).href)):Response.error())));});
`);
console.log('Offline shell precached:',files.length,'files, version',version);
