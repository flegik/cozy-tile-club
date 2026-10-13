export const motifNames=['Erdbeere','Schleife','Kuschelbär','Herz','Stern','Blüte','Mond','Hase','Tasse','Wolke'];
export function Motif({n,size=44}:{n:number;size?:number}){
 const stroke='#81576f';const common={stroke,strokeWidth:2.4,strokeLinejoin:'round' as const};
 return <svg width={size} height={size} viewBox="0 0 64 64" aria-label={motifNames[n]} role="img">
 {n===0&&<><path d="M14 24Q32 12 50 24Q55 40 34 56Q29 58 16 43Q8 30 14 24" fill="#f59db6" {...common}/><path d="m32 25-12-9 10 2 4-10 4 10 9-2-9 9" fill="#afd3ad" {...common}/>{[22,33,43].map((x,i)=><path key={x} d={`m${x} ${32+i*4} 0 3`} stroke="#fff4d1" strokeWidth="3" strokeLinecap="round"/>)}</>}
 {n===1&&<><path d="M29 27Q7 6 8 32Q7 57 29 37M35 27Q57 6 56 32Q57 57 35 37" fill="#c8b0e4" {...common}/><rect x="26" y="24" width="12" height="17" rx="5" fill="#e6d1f4" {...common}/></>}
 {n===2&&<><circle cx="17" cy="19" r="9" fill="#e9bd99" {...common}/><circle cx="47" cy="19" r="9" fill="#e9bd99" {...common}/><ellipse cx="32" cy="35" rx="23" ry="21" fill="#e9bd99" {...common}/><ellipse cx="32" cy="43" rx="10" ry="8" fill="#fff1d9"/><circle cx="24" cy="33" r="2.5" fill={stroke}/><circle cx="40" cy="33" r="2.5" fill={stroke}/><path d="m29 40 3 3 3-3" {...common} fill="none"/></>}
 {n===3&&<path d="M32 55C-8 30 12 4 32 21C52 4 72 30 32 55" fill="#f1a5c4" {...common}/>}
 {n===4&&<path d="m32 7 8 16 18 3-13 13 3 18-16-8-16 8 3-18L6 26l18-3Z" fill="#ffdb96" {...common}/>}
 {n===5&&<>{[0,60,120,180,240,300].map(r=><ellipse key={r} cx="32" cy="18" rx="11" ry="13" transform={`rotate(${r} 32 32)`} fill="#e8b1d2" {...common}/>)}<circle cx="32" cy="32" r="10" fill="#ffe5a6" {...common}/></>}
 {n===6&&<><path d="M43 8C9-1-1 50 33 57Q49 56 55 39C27 48 18 19 43 8" fill="#ffe2a0" {...common}/><path d="m49 14 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" fill="#c7b6df"/></>}
 {n===7&&<><ellipse cx="22" cy="17" rx="7" ry="15" fill="#f2e8f7" {...common}/><ellipse cx="42" cy="17" rx="7" ry="15" fill="#f2e8f7" {...common}/><ellipse cx="32" cy="40" rx="23" ry="19" fill="#f2e8f7" {...common}/><circle cx="24" cy="38" r="2" fill={stroke}/><circle cx="40" cy="38" r="2" fill={stroke}/><path d="m29 45 3 2 3-2" {...common} fill="none"/><circle cx="19" cy="44" r="4" fill="#edbfd0"/><circle cx="45" cy="44" r="4" fill="#edbfd0"/></>}
 {n===8&&<><path d="M46 26Q62 23 57 39Q55 44 46 44" fill="none" {...common}/><path d="M12 25H48L45 46Q32 57 15 46Z" fill="#acd6cf" {...common}/><path d="M23 18q-6-5 0-10m12 10q-6-5 0-10" stroke="#baa4bd" strokeWidth="3" fill="none"/><path d="M32 43c-12-7-6-15 0-9c6-6 12 2 0 9" fill="#fff2df"/></>}
 {n===9&&<><path d="M13 49C-4 41 7 24 20 29C20 6 48 6 48 29C67 23 70 47 52 50Z" fill="#c4dfee" {...common}/><circle cx="25" cy="35" r="2" fill={stroke}/><circle cx="42" cy="35" r="2" fill={stroke}/><path d="M29 41q4 4 8 0" fill="none" {...common}/></>}
 </svg>;
}
