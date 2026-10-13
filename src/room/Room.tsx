import {catalog,item,iso,sorted,canPlace,type Placed} from './engine';
function Furn({id,x,y}:{id:string;x:number;y:number}){
 const f=item(id),p=iso(x+f.w/2,y+f.h/2),c=f.color;
 const box=(w:number,d:number,h:number)=><><path d={`M${-w} 0 0 ${-d} ${w} 0 0 ${d}Z`} fill={c} stroke="#b394a4"/><path d={`M${-w} 0v${-h}L0 ${-d-h} ${w} ${-h}v${h}L0 ${d}Z`} fill={c} stroke="#b394a4"/><path d={`M${-w} ${-h} 0 ${-d-h} ${w} ${-h} 0 ${d-h}Z`} fill="#fff0df" stroke="#b394a4"/><path d={`M0 ${d-h}v${h}`} stroke="#b394a4"/></>;
 return <g transform={`translate(${p.x},${p.y})`} strokeLinecap="round" strokeLinejoin="round"><ellipse cy="5" rx={f.w*17+5} ry={f.h*7+5} fill="#76586b" opacity=".12"/>
 {f.kind==='bed'&&<>{box(48,30,14)}<path d="M-44-17v-31Q-20-57 1-66v31" fill={c} stroke="#b394a4" strokeWidth="3"/><path d="M-27-38 4-54 33-39 2-23Z" fill="#fffbef" stroke="#cba5b9"/><path d="M-40-11 0-31 43-10 0 10Z" fill={c} stroke="#b394a4"/>{[-17,0,17].map(o=><path key={o} d={`M${o-22} ${o/2-8}l40-20`} stroke="#fff5eb" strokeWidth="3" opacity=".6"/>)}</>}
 {f.kind==='sofa'&&<>{box(50,20,16)}<path d="M-48-13v-27L0-63 50-38v27L0-36Z" fill={c} stroke="#b394a4"/><path d="m-38-34 16-8 8 14-17 8Z" fill="#fff1e5"/><path d="m14-47 18 8-8 14-18-8Z" fill="#efe2f6"/></>}
 {(f.kind==='table'||f.kind==='desk')&&<><path d="M-31-5v28m62-28v28M0 8v23" stroke="#bf9e80" strokeWidth="5"/>{box(37,18,10)}<ellipse cy="-12" rx="12" ry="6" fill="#fff4e0" stroke="#b394a4"/><path d="M-6-17q0-11 7-11q7 0 7 11Z" fill="#e6b8d4" stroke="#b394a4"/>{f.kind==='desk'&&<><path d="M-20-27v-28l35 0v28Z" fill="#997b99" stroke="#b394a4"/><path d="M-16-31v-20H11v20Z" fill="#e0cce5"/></>}</>}
 {(f.kind==='shelf'||f.kind==='cabinet')&&<>{box(f.w*20,14,65)}<path d="M-19-17v-40L0-47v40Z" fill="#b48f7e"/>{[-44,-24].map(y=><g key={y}><path d={`M-19 ${y} 0 ${y+9}`} stroke="#ead1b5" strokeWidth="3"/>{[0,1,2].map(i=><path key={i} d={`M${-15+i*5} ${y-3+i*2}v-12`} stroke={['#d8b8d7','#b2cdd2','#f7d2a8'][i]} strokeWidth="4"/>)}</g>)}</>}
 {(f.kind==='plant'||f.kind==='flower')&&<><path d="M-12-7-8 14Q0 21 8 14L12-7Z" fill="#fff0da" stroke="#b394a4"/><ellipse cy="-7" rx="12" ry="6" fill="#c6a18c"/><path d="M0-8v-38" stroke="#92ae88" strokeWidth="3"/>{[-1,1].flatMap(sign=>[-18,-32,-42].map(y=><ellipse key={`${sign}-${y}`} cx={sign*9} cy={y} rx="11" ry="6" transform={`rotate(${sign*40} ${sign*9} ${y})`} fill="#a6c19c" stroke="#7f9f7e"/>))}{f.kind==='flower'&&<g transform="translate(0,-47)">{[0,72,144,216,288].map(r=><ellipse key={r} cy="-6" rx="6" ry="8" transform={`rotate(${r})`} fill={c}/>)}<circle r="5" fill="#ffe2a3"/></g>}</>}
 {f.kind==='lamp'&&<><ellipse cy="6" rx="13" ry="6" fill={c} stroke="#b394a4"/><path d="M0 4v-43" stroke="#c6a18c" strokeWidth="4"/><path d="M-18-32-11-56H11L18-32Q0-23-18-32" fill={c} stroke="#b394a4"/><ellipse cy="-34" rx="25" ry="10" fill="#ffe8ba" opacity=".2"/></>}
 {(f.kind==='bear'||f.kind==='bunny')&&<><ellipse cy="-5" rx="16" ry="18" fill={c} stroke="#b394a4"/>{[-1,1].map(s=><ellipse key={s} cx={s*12} cy="-39" rx="7" ry={f.kind==='bunny'?17:7} fill={c} stroke="#b394a4"/>)}<circle cy="-27" r="18" fill={c} stroke="#b394a4"/><circle cx="-6" cy="-29" r="2" fill="#80596d"/><circle cx="6" cy="-29" r="2" fill="#80596d"/><path d="m-3-22 3 2 3-2" fill="none" stroke="#80596d"/></>}
 {f.kind==='stool'&&<>{box(22,12,18)}<ellipse cy="-17" rx="23" ry="12" fill={c} stroke="#b394a4"/><path d="m-5-19 5 3 5-3" stroke="#f5e7ee" fill="none"/></>}
 </g>;
}
export function Room({placed,wall,floor,selected,onCell,onSelect}:{placed:Placed[];wall:string;floor:string;selected:string|null;onCell:(x:number,y:number)=>void;onSelect:(id:string)=>void}){
 return <svg className="room-svg" viewBox="0 0 420 410" role="img" aria-label="Dein isometrisches Zimmer: zwei Wände und sieben mal sieben Bodenfelder">
 <defs><pattern id="wallpaper" width="18" height="18" patternUnits="userSpaceOnUse"><rect width="18" height="18" fill={wall}/><path d="M8 0v18" stroke="#ffffff" opacity=".28" strokeWidth="3"/></pattern><linearGradient id="window" x2="0" y2="1"><stop stopColor="#b0bddc"/><stop offset="1" stopColor="#e4d6ed"/></linearGradient></defs>
 <ellipse cx="210" cy="340" rx="184" ry="29" fill="#604965" opacity=".09"/>
 <path d="M35 271 210 180 385 271v14L210 377 35 285Z" fill="#c4b1c4"/>
 <path d="M35 271V123L210 32 385 123v148L210 180Z" fill="url(#wallpaper)" stroke="#b9a1b8" strokeWidth="3"/>
 <path d="M210 32v148" stroke="#fff2eb" strokeWidth="5"/><path d="M35 125 210 34 385 125" fill="none" stroke="#fff2eb" strokeWidth="6"/>
 <path d="M64 206v-60q20-41 50-27v61Z" fill="url(#window)" stroke="#fff4e5" strokeWidth="5"/><path d="M87 134v61m-22-26 47-24" stroke="#fff4e5" strokeWidth="3"/>
 <path d="M91 139a10 10 0 1 0 7 17a10 10 0 0 1-7-17" fill="#ffedba"/>
 <path d="M288 141v-45l41 22v45Z" fill="#fff2e5" stroke="#c4a888" strokeWidth="4"/><path d="M306 146c-23-26-7-31 2-13c8-9 24 5-2 13" fill="#e8afcb"/>
 <path d="M238 101v-36l29 15v36Z" fill="#e9dbf4" stroke="#fff1dc" strokeWidth="4"/><path d="m252 78 3 9 7 6-6 0-2 6-3-9-7-6 6 0Z" fill="#fff0b5"/>
 {Array.from({length:49},(_,i)=>{const x=i%7,y=Math.floor(i/7),p=iso(x,y);const valid=selected&&canPlace(placed,selected,x,y);return <path key={i} d={`M${p.x} ${p.y}l25 13-25 13-25-13Z`} fill={selected&&valid?'#dbecd9':floor} stroke="#ffffff" strokeOpacity=".45" strokeWidth="1" onClick={()=>onCell(x,y)} role="button" aria-label={`Platz ${x+1}, ${y+1}${valid?', verfügbar':''}`} tabIndex={selected?0:-1} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onCell(x,y);}}}/>;})}
 {sorted(placed).map(p=><g key={p.id} onClick={()=>onSelect(p.id)} role="button" tabIndex={0} aria-label={`${item(p.id).name} auswählen`} onKeyDown={e=>{if(e.key==='Enter')onSelect(p.id);}}><Furn {...p}/>{selected===p.id&&<circle cx={iso(p.x,p.y).x} cy={iso(p.x,p.y).y} r="6" fill="#b477aa" stroke="white"/>}</g>)}
 </svg>;
}
export {catalog};

export function FurnitureThumbnail({kind}:{kind:string}){const f=catalog.find(f=>f.kind===kind);return f&&f.w>0?<svg width="88" height="80" viewBox="0 0 180 150" aria-hidden="true"><g transform="translate(-120,-100)"><Furn id={f.id} x={0} y={0}/></g></svg>:<svg width="88" height="80" viewBox="0 0 100 100" aria-hidden="true"><path d={kind==='wall'?'M20 80V20L80 40v40Z':'M10 55 50 30 90 55 50 80Z'} fill={f?.color} stroke="#ba9aaf" strokeWidth="2"/><path d="M35 32v40m16-32v32m15-26v26" stroke="#fff8f1" strokeWidth="3" opacity=".5"/></svg>;}
