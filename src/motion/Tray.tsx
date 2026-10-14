import type {RefObject} from 'react';
import {Motif} from '../assets/Motif';
import type {Frame} from './usePuzzleMotion';
import type {TrayTile} from './tray';
export function AnimatedTray({tokens,frame,trayRef}:{tokens:TrayTile[];frame:Frame|null;trayRef:RefObject<HTMLDivElement|null>}){
 return <><div className="tray-label"><span>Sammelleiste</span><span>{tokens.length} / 7</span></div><div ref={trayRef} className={`tray animated-tray ${tokens.length===7&&!frame?.matched.length&&frame?.phase!=='flight'?'tray-full':''}`} data-motion-phase={frame?.phase??'idle'} aria-label={`Sammelleiste, ${tokens.length} von 7 Plätzen`}>
 {Array.from({length:7},(_,i)=><div className="slot" data-slot={i} key={i} style={{gridColumn:i+1,gridRow:1}}/>)}
 {tokens.map((t,i)=><div key={t.id} data-tray-id={t.id} data-motif={t.motif} className={`tray-token ${frame?.kind==='select'&&frame.phase==='flight'&&frame.id===t.id?'in-flight':''} ${frame?.phase==='match'&&frame.matched.includes(t.id)?'matching':''}`} style={{gridColumn:i+1,gridRow:1}}><Motif n={t.motif} size={34}/>{frame?.phase==='match'&&frame.matched.includes(t.id)&&<span className="match-sparkles" aria-hidden="true">{Array.from({length:6},(_,j)=><i key={j} style={{'--spark-angle':`${j*60}deg`} as React.CSSProperties}>✦</i>)}</span>}</div>)}
 </div></>;
}
