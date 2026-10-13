import {type Tile,type Level,emptyState} from './types';
import {accessible,move} from './engine';
import {solve} from './solver';
export function rng(seed:number){let s=seed>>>0;return()=>{s+=0x6D2B79F5;let t=s;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;};}
const shapes=['Blütenherz','Wolkenkissen','Sternengarten','Schleifentraum','Mondlicht'];
export function generate(seed:number,difficulty=1,id=1):Level{
 if(!Number.isSafeInteger(seed)||!Number.isInteger(difficulty)||difficulty<1||difficulty>100)throw new Error('Invalid generator parameters');
 const random=rng(seed); const groups=6+Math.floor(difficulty/3);const total=groups*3;const shape=(seed>>>0)%5;
 const tiles:Tile[]=[];
 // Offset layers with partial overlap; all motifs remain inspectable in the layer atlas.
 const masks=['.X.X./XXXXX/XXXXX/.XXX./..X..','.XXX./XXXXX/XXXXX/.XXX./.....','..X../XXXXX/.XXX./XXXXX/..X..','XX.XX/XXXXX/.XXX./XXXXX/XX.XX','.XXXX/XXXX./XXX../XXXX./.XXXX'];
 const cells=masks[shape].split('/').flatMap((row,y)=>[...row].flatMap((cell,x)=>cell==='X'?[{x,y}]:[]));
 for(let i=0;i<total;i++){const z=Math.floor(i/cells.length);const p=cells[i%cells.length];tiles.push({id:i,x:p.x+(z%2)*.42,y:p.y+(z%2)*.42,z,motif:0});}
 // Obtain a legal geometric removal sequence, then assign balanced triples.
 let st=emptyState();const order:number[]=[];
 while(order.length<tiles.length){const free=tiles.filter(t=>accessible(tiles,st,t.id));const pick=free[Math.floor(random()*free.length)];order.push(pick.id);st={...st,removed:[...st.removed,pick.id]};}
 const motifCount=Math.min(10,3+Math.floor(difficulty/4));
 const braid=difficulty<10?1:difficulty<20?2:3;
 for(let g=0;g<groups;){const batch=Math.min(braid,groups-g);const motifs:number[]=[];while(motifs.length<batch){const motif=Math.floor(random()*motifCount);if(!motifs.includes(motif))motifs.push(motif);}
  for(let k=0;k<3;k++)for(let b=0;b<batch;b++)tiles[order[g*3+k*batch+b]].motif=motifs[b];g+=batch;
 }
 // Prove actual gameplay, independently of the constructed ordering.
 const proof=solve(tiles,emptyState(),150000);if(proof.status!=='solved')throw new Error('Uncertified level rejected');
 let playing=emptyState(),choices=0,traps=0,lookahead=0;
 for(let i=0;i<proof.path.length;i++){
  const free=tiles.filter(t=>accessible(tiles,playing,t.id));choices+=free.length;
  if(i%6===0){for(const t of free.slice(0,4)){const next=move(tiles,playing,t.id);const result=solve(tiles,next,3000);if(result.status==='unsolvable')traps++;if(result.nodes>100)lookahead++;}}
  playing=move(tiles,playing,proof.path[i]);
 }
 const avg=Number((choices/tiles.length).toFixed(1));const actualDepth=Math.max(...tiles.map(t=>t.z))+1;
 return{id,seed,tiles,shape:shapes[shape],difficulty,certificate:proof.path,metrics:{choices:avg,depth:actualDepth,traps,lookahead,score:Math.round(avg+actualDepth*4+traps*3+lookahead*2+motifCount)}};
}
