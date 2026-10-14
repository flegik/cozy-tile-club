import {type Tile} from './types';
import {rng,shuffle} from './random';
export {rng} from './random';
const masks=['.XXX./XXXXX/XXXXX/.XXX.','..X../.XXX./XXXXX/.XXX./..X..','XX.XX/XXXXX/.XXX./XXXXX','XXXXX/.XXX./XXXXX/.XXX.','.XXXX/XXXX./XXX../XXXX.','XXXXX/X.X.X/XXXXX/.XXX.','X.X.X/XXXXX/XXXXX/X.X.X'];
export const shapes=['Blüteninsel','Sternenkreuz','Schleifengarten','Wolkenbrücke','Mondbogen','Fenstergarten','Drei Türme'];
export type Candidate={seed:number;tiles:Tile[];shape:string;tier:number};
// Geometry and balanced motif permutation are independent of any solution path.
// Rejection/certification and behavioral calibration belong to the curator.
export function generate(seed:number,tier=0):Candidate{
 if(!Number.isSafeInteger(seed)||!Number.isInteger(tier)||tier<0||tier>8)throw new Error('Invalid generator parameters');
 if(tier>=4)return generateAdvanced(seed,tier);
 const random=rng(seed),motifs=5+tier,groups=motifs+(tier===0?3:4),count=groups*3;
 const mask=(seed>>>0)%masks.length,cells=masks[mask].split('/').flatMap((row,y)=>[...row].flatMap((c,x)=>c==='X'?[{x,y}]:[]));
 const offset=[.32,.45,.57][Math.floor(random()*3)];const tiles:Tile[]=[];
 // Layer layouts vary by seed: randomized missing upper cells, two to three levels.
 const footprint=tier===0?12+(seed>>>0)%3:10+(seed>>>0)%3;
 const base=shuffle(cells,random).slice(0,footprint);const positions:{x:number;y:number;z:number}[]=[];
 for(let z=0;positions.length<count;z++){const layer=shuffle(base,random);for(const p of layer){if(positions.length===count)break;positions.push({x:p.x+(z%2)*offset,y:p.y+(z%2)*offset,z});}}
 const bag=shuffle(Array.from({length:groups},(_,g)=>Array(3).fill(g%motifs)).flat(),random);
 for(let i=0;i<positions.length;i++)tiles.push({id:i,...positions[i],motif:bag[i]});
 return{seed,tiles,shape:shapes[mask],tier};
}

// Appended campaign generator: legacy tiers above stay byte-for-byte reproducible.
const advancedMasks=[
 'XXXXX/X...X/XXXXX/.XXX.', 'XX.XX/XXXXX/XX.XX/.XXX.',
 '.XXX./XX.XX/XXXXX/X...X', 'X.X.X/.XXX./XXXXX/XX.XX',
 'XXXXX/XX.XX/.XXX./X.X.X', 'XX.../XXXX./.XXXX/...XX',
 'X...X/XXXXX/.XXX./XXXXX', '.XXXX/XX.XX/XXXX./.XXX.',
 'XXX../.XXXX/XXXX./..XXX', 'XX.XX/.XXX./XX.XX/XXXXX',
 '.XXX./XXXXX/X.X.X/XXXXX', 'XXXX./.XXXX/XXXX./.XXXX',
 'XXXXX/.X.X./XXXXX/X...X', 'X.X.X/XX.XX/XXXXX/.XXX.'
];
const advancedNames=['Rosengalerie','Samtportal','Kirschblütenhof','Sternenpassage','Mondterrasse','Lavendelband','Wolkentor','Teegarten','Dessertpfad','Schleifenhof','Lilienbrücke','Mauve-Pavillon','Lichterfenster','Sternenatelier'];
function generateAdvanced(seed:number,tier:number):Candidate{
 const random=rng(seed),mask=(seed>>>0)%advancedMasks.length;
 const cells=advancedMasks[mask].split('/').flatMap((row,y)=>[...row].flatMap((c,x)=>c==='X'?[{x,y}]:[]));
 const motifs=tier===4?8:tier===5?9:10,groups=tier===4?12:tier===5?13:14,count=groups*3;
 const footprint=9+Math.floor(random()*5),base=shuffle(cells,random).slice(0,footprint);
 const positions:{x:number;y:number;z:number}[]=[];const offsets=[[0,0],[.36,.53],[.57,.22],[.18,.58],[.48,.42]];
 const style=Math.floor(random()*4);
 for(let z=0;positions.length<count;z++){
  // Staggered terraces, alternating diagonals, mirrored arches and irregular caps.
  const shifted=shuffle(style===3&&z>0?cells:base,random);
  const [dx,dy]=offsets[style===0?z%2:style===1?z%offsets.length:style===2?(z%2?2:3):z%3];
  const limit=Math.min(shifted.length,footprint-(z>0?Math.floor(random()*3):0));
  for(const p of shifted.slice(0,limit)){if(positions.length===count)break;positions.push({x:p.x+dx,y:p.y+dy,z});}
 }
 const bag=shuffle(Array.from({length:groups},(_,g)=>Array(3).fill(g%motifs)).flat(),random);
 return{seed,tier,shape:advancedNames[mask],tiles:positions.map((p,id)=>({id,...p,motif:bag[id]}))};
}
