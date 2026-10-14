// New vector portraits drawn for this fan edition. No external image dependencies.
// Broad clean silhouettes and restrained detail remain legible at 30–44 pixels.
const ink='#30262c',white='#fffefd';
const outline={stroke:ink,strokeWidth:1.7,strokeLinecap:'round' as const,strokeLinejoin:'round' as const};
export function CharacterArt({n}:{n:number}){
 if(n===0)return <g {...outline}>
  <path d="M18 39C14 32 13 18 18 16c5-2 13 5 17 10 9-3 20-3 29 0 5-7 13-11 18-8 4 4 2 15 0 22 6 6 8 13 7 21-1 19-18 29-40 29S11 80 11 62c0-9 2-17 7-23Z" fill={white}/>
  <path d="M19 23q6 1 11 6m43 0 6-6" stroke="#eadfe3" strokeWidth="1.2"/>
  <g fill="#ed618e"><path d="M70 27C63 11 56 11 53 22c-3 9 4 17 15 12M76 26c10-14 20-9 17 1-2 9-11 11-18 6"/><path d="m60 22 7 6m16-3-7 5" fill="none" stroke="#b63761" strokeWidth="1.2"/><ellipse cx="72" cy="29" rx="6" ry="7"/></g>
  <ellipse cx="34" cy="57" rx="3.2" ry="4.4" fill={ink} stroke="none"/><ellipse cx="66" cy="57" rx="3.2" ry="4.4" fill={ink} stroke="none"/><ellipse cx="50" cy="68" rx="4.3" ry="3.1" fill="#f4c94f" strokeWidth="1.3"/>
  <path d="M16 54 5 51m10 13H3m14 9L6 77m78-23 11-3M86 64h11M83 73l11 4" fill="none" strokeWidth="2"/>
 </g>;
 if(n===1)return <g {...outline}>
  <path d="M23 41C12 24 12 4 24 5c10 0 13 14 12 31 4-2 10-2 14-1C52 15 53 4 63 5c14 1 11 20 3 32 13 6 21 17 20 30-1 20-17 27-37 27S12 85 12 67c0-11 3-19 11-26Z" fill="#f08fbb"/>
  <path d="M23 12c5 5 7 14 6 22M63 12q6 6-4 21" fill="none" stroke="#f7b4d2" strokeWidth="3"/>
  <path d="M20 65c0-13 14-21 29-20 17-1 29 8 29 20 0 15-12 23-29 23S20 80 20 65Z" fill={white}/>
  <g fill="#fff4ec" strokeWidth="1.3"><ellipse cx="18" cy="39" rx="6" ry="4" transform="rotate(-30 18 39)"/><ellipse cx="22" cy="33" rx="4" ry="6"/><ellipse cx="28" cy="37" rx="6" ry="4" transform="rotate(30 28 37)"/><ellipse cx="27" cy="44" rx="4" ry="6"/><ellipse cx="19" cy="45" rx="4" ry="6"/><circle cx="23" cy="40" r="3.3" fill="#f4cb59"/></g>
  <ellipse cx="36" cy="65" rx="2.8" ry="3.8" fill={ink} stroke="none"/><ellipse cx="63" cy="65" rx="2.8" ry="3.8" fill={ink} stroke="none"/><ellipse cx="49.5" cy="73" rx="3.8" ry="2.5" fill="#f4ce5d" stroke="none"/><path d="M46 79q3.5 4 7 0" fill="none" strokeWidth="1.4"/>
 </g>;
 if(n===2)return <g {...outline}>
  <path d="M24 40 10 11l29 20c7-2 15-2 22 0L88 10 78 42c8 7 11 16 10 26-2 20-18 26-38 26S13 84 12 66c0-10 3-18 12-26Z" fill="#29252f" stroke="#65566e"/>
  <path d="M14 16 27 36m56-20-10 20" stroke="#514757" strokeWidth="1.2"/>
  <circle cx="10" cy="10" r="4" fill="#29252f" stroke="#65566e"/><circle cx="89" cy="9" r="4" fill="#29252f" stroke="#65566e"/>
  <path d="M21 61q8-2 13-11 7 6 16 6 10 0 17-6 4 9 12 11 5 22-29 27-33-4-29-27Z" fill={white}/>
  <g stroke="none"><path d="M40 43c-1-7 4-11 10-11s11 4 10 11c0 4-2 6-5 7v5H45v-5c-3-1-5-3-5-7Z" fill="#f395c5"/><ellipse cx="46" cy="42" rx="2.6" ry="3" fill="#29252f" stroke="#65566e"/><ellipse cx="54" cy="42" rx="2.6" ry="3" fill="#29252f" stroke="#65566e"/><path d="m48 48 2-3 2 3Z" fill="#29252f" stroke="#65566e"/><path d="M48 52v3m4-3v3" stroke="#29252f" strokeWidth="1"/>
  <ellipse cx="35" cy="67" rx="3" ry="4" fill={ink}/><ellipse cx="65" cy="67" rx="3" ry="4" fill={ink}/><ellipse cx="50" cy="75" rx="3" ry="2" fill="#f28cbe"/></g>
  <path d="m30 64-4-3m44 3 4-3M46 81q4 3 8-1" fill="none" strokeWidth="1.5"/>
 </g>;
 if(n===3)return <g stroke="#6092b5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
  <path d="M30 42C18 40 4 51 2 65c-1 12 7 16 14 9 10-10 12-21 16-27m38-5c12-2 26 9 28 23 1 12-7 16-14 9-10-10-12-21-16-27" fill={white}/>
  <path d="M28 47c-1-15 8-23 22-23s23 8 22 23c4 20-6 31-22 31S24 67 28 47Z" fill={white}/>
  <ellipse cx="39" cy="49" rx="3" ry="4" fill="#6da8d2" stroke="none"/><ellipse cx="61" cy="49" rx="3" ry="4" fill="#6da8d2" stroke="none"/>
  <ellipse cx="33" cy="59" rx="5.8" ry="3.3" fill="#f5bad3" stroke="none"/><ellipse cx="67" cy="59" rx="5.8" ry="3.3" fill="#f5bad3" stroke="none"/><path d="M43 59q2 6 7 0 5 6 7 0" fill="none" stroke="#6da8d2" strokeWidth="1.8"/>
 </g>;
 if(n===4)return <g stroke="#694c32" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
  <path d="M27 36C12 33 8 49 12 65c1 7 8 9 15 2m46-31c15-3 19 13 15 29-1 7-8 9-15 2" fill="#f8d779"/>
  <path d="M26 34q24-10 48 0c6 10 8 24 7 35-2 17-17 22-31 22S20 85 19 69c-1-13 1-25 7-35Z" fill="#ffe29b"/>
  <path d="M21 34c-1-9 11-16 29-16 15 0 27 6 29 13 3 8-9 10-29 10-19 0-29-1-29-7Z" fill="#896039"/><path d="M47 18c-4-10 3-11 6-7q2 4 0 7" fill="#896039"/>
  <ellipse cx="36" cy="56" rx="2.8" ry="3.7" fill="#694c32" stroke="none"/><ellipse cx="64" cy="56" rx="2.8" ry="3.7" fill="#694c32" stroke="none"/><ellipse cx="50" cy="65" rx="4" ry="2.7" fill="#694c32" stroke="none"/><path d="M50 68v5m-7-2q3 8 7 2 4 6 7-2" fill="none" strokeWidth="1.8"/>
 </g>;
 return <g {...outline}>
  <path d="M30 80q20-7 40 0l7 14H23Z" fill="#ef6871"/><path d="M34 80v13m11-15v16m11-16v16m11-14v13" stroke={white} strokeWidth="6"/>
  <ellipse cx="50" cy="60" rx="35" ry="25" fill="#97d65b"/>
  <circle cx="32" cy="35" r="21" fill={white}/><circle cx="68" cy="35" r="21" fill={white}/>
  <ellipse cx="38" cy="39" rx="6.5" ry="9" fill={ink} stroke="none"/><ellipse cx="62" cy="39" rx="6.5" ry="9" fill={ink} stroke="none"/>
  <ellipse cx="25" cy="65" rx="6.8" ry="3.7" fill="#f28b9f" stroke="none"/><ellipse cx="75" cy="65" rx="6.8" ry="3.7" fill="#f28b9f" stroke="none"/><path d="m43 64 7 7 7-7" fill="none" strokeWidth="2.3"/>
 </g>;
}
