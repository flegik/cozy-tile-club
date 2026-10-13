import {type Tile} from './types';
import {rng,shuffle} from './random';
export {rng} from './random';
const masks=['.XXX./XXXXX/XXXXX/.XXX.','..X../.XXX./XXXXX/.XXX./..X..','XX.XX/XXXXX/.XXX./XXXXX','XXXXX/.XXX./XXXXX/.XXX.','.XXXX/XXXX./XXX../XXXX.','XXXXX/X.X.X/XXXXX/.XXX.','X.X.X/XXXXX/XXXXX/X.X.X'];
export const shapes=['Blüteninsel','Sternenkreuz','Schleifengarten','Wolkenbrücke','Mondbogen','Fenstergarten','Drei Türme'];
export type Candidate={seed:number;tiles:Tile[];shape:string;tier:number};
// Geometry and balanced motif permutation are independent of any solution path.
// Rejection/certification and behavioral calibration belong to the curator.
export function generate(seed:number,tier=0):Candidate{
 if(!Number.isSafeInteger(seed)||!Number.isInteger(tier)||tier<0||tier>3)throw new Error('Invalid generator parameters');
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
