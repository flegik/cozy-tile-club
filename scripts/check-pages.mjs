import {readFileSync,existsSync} from 'node:fs';
import assert from 'node:assert/strict';
const root=new URL('https://flegik.github.io/cozy-tile-club/');
const html=readFileSync('dist/index.html','utf8');
for(const match of html.matchAll(/(?:src|href)="([^\"]+)"/g)){const url=new URL(match[1],root);assert(url.pathname.startsWith(root.pathname),`Escaping base: ${url}`);assert(existsSync('dist/'+url.pathname.slice(root.pathname.length)),`Missing file: ${url}`);}
assert(html.includes('apple-mobile-web-app-capable'));assert(html.includes('black-translucent'));assert(html.includes('viewport-fit=cover'));
const manifest=JSON.parse(readFileSync('dist/manifest.webmanifest','utf8'));for(const key of ['id','scope','start_url'])assert.equal(new URL(manifest[key],root).href,root.href);assert.equal(manifest.display,'standalone');
for(const icon of manifest.icons)assert(existsSync('dist/'+new URL(icon.src,root).pathname.slice(root.pathname.length)));
const png=readFileSync('dist/apple-touch-icon.png');assert.equal(png.readUInt32BE(16),180);assert.equal(png.readUInt32BE(20),180);
const sw=readFileSync('dist/sw.js','utf8');const assets=JSON.parse(sw.match(/const ASSETS=(\[[^;]+\]);/)[1]);for(const path of assets){const url=new URL(path,root);assert(url.pathname.startsWith(root.pathname));assert(existsSync('dist/'+url.pathname.slice(root.pathname.length)));}assert(assets.some(a=>a.includes('solver.worker')));assert(assets.includes('./apple-touch-icon.png'));
console.log(`Pages subpath checks passed: ${assets.length} precached files, 180×180 Apple icon, standalone metadata and manifest scope.`);
