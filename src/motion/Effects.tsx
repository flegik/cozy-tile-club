import type {CSSProperties} from 'react';
import type {Box} from './tray';
import type {Frame} from './usePuzzleMotion';

export function Burst({rect,kind}:{rect:Box;kind:'select'|'land'|'match'}){
 const size=kind==='match'?Math.max(130,rect.width+24):Math.max(76,rect.width*1.45);
 const style:CSSProperties={left:rect.left+rect.width/2-size/2,top:rect.top+rect.height/2-size/2,width:size,height:size};
 return <div className={`motion-burst burst-${kind}`} style={style} aria-hidden="true" data-effect={kind}>
  <span className="burst-aura"/>
  <svg viewBox="0 0 140 140" fill="none">
   <circle className="burst-ring" cx="70" cy="70" r="30" stroke="currentColor" strokeWidth="1.5"/>
   {Array.from({length:kind==='match'?8:4},(_,i)=>{const angle=(i*(kind==='match'?45:90)-22)*Math.PI/180,x=70+47*Math.cos(angle),y=70+47*Math.sin(angle),r=i%2?4:6;return <path key={i} className="burst-star" d={`M${x} ${y-r} Q${x+1} ${y-1} ${x+r} ${y} Q${x+1} ${y+1} ${x} ${y+r} Q${x-1} ${y+1} ${x-r} ${y} Q${x-1} ${y-1} ${x} ${y-r}Z`} fill={i%2?'var(--tile)':'currentColor'}/>;})}
   {kind==='match'&&<><path className="burst-heart" d="M26 80C14 70 19 65 25 69C31 63 38 70 26 80Z" fill="currentColor"/><path className="burst-heart" d="M112 58C100 48 105 43 111 47C117 41 124 48 112 58Z" fill="currentColor"/></>}
  </svg>
 </div>;
}

// These effects are siblings of the moving/fading tiles. Match particles never
// inherit a tile's dissolve opacity, and no board tile is animated by them.
export function MotionEffects({frame,target,match}:{frame:Frame|null;target:Box|null;match:Box|null}){
 if(!frame||window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)return null;
 return <div className="motion-effects" aria-hidden="true">
  {frame.kind==='select'&&frame.phase==='flight'&&<Burst key={`${frame.serial}-select`} rect={frame.source} kind="select"/>}
  {target&&frame.phase!=='flight'&&<Burst key={`${frame.serial}-land`} rect={target} kind="land"/>}
  {match&&(frame.phase==='match'||frame.phase==='settle')&&<Burst key={`${frame.serial}-match`} rect={match} kind="match"/>}
 </div>;
}
