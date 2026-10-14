import {CharacterArt} from './Characters';
// Original vector fan illustrations; the motif ID contract remains unchanged.
export const motifNames=['Hello Kitty','My Melody','Kuromi','Cinnamoroll','Pompompurin','Keroppi','Schleife','Erdbeer-Dessert','Kirschblüte','Mond'];
const line='#574359';
export function Motif({n,size=44}:{n:number;size?:number}){
 if(n>=0&&n<6)return <svg xmlns="http://www.w3.org/2000/svg" className={`motif motif-${n}`} width={size} height={size} viewBox="0 0 100 100" aria-label={motifNames[n]} role="img"><CharacterArt n={n}/></svg>;
 const common={stroke:line,strokeWidth:1.9,strokeLinejoin:'round' as const,strokeLinecap:'round' as const};
 return <svg className={`motif motif-${n}`} width={size} height={size} viewBox="0 0 64 64" aria-label={motifNames[n]} role="img">
 {n===6&&<><path d="M28 28Q6 8 8 32Q6 56 28 37M36 28Q58 8 56 32Q58 56 36 37" fill="#cab5dc" {...common}/><path d="m27 37-5 19 10-5 10 5-5-19" fill="#dbc7e9" {...common}/><rect x="26" y="25" width="12" height="15" rx="5" fill="#e5d5ee" {...common}/></>}
 {n===7&&<><path d="M10 28h44l-6 27H16Z" fill="#e4bfcf" {...common}/><path d="M13 28q-8-13 9-16q10-8 18 1q17 0 12 15Z" fill="#fff4e7" {...common}/><path d="M25 10q-3 12 7 17q11-4 8-17q-7-4-15 0" fill="#d78ba7" {...common}/><path d="m31 10-5-5 6 1 4-3 1 5" fill="#a7bc99" stroke="#698566" strokeWidth="1.3"/><path d="M22 35v12m10-12v12m10-12v12" stroke="#fbeced" strokeWidth="3"/></>}
 {n===8&&<>{[0,72,144,216,288].map(r=><path key={r} transform={`rotate(${r} 32 32)`} d="M32 32Q12 15 22 8l10 4 10-4q10 7-10 24" fill="#e8b7d0" {...common}/>)}<circle cx="32" cy="32" r="6" fill="#ead093" {...common}/>{[0,72,144,216,288].map(r=><path key={r} transform={`rotate(${r} 32 32)`} d="M32 29v-8" stroke="#b17996" strokeWidth="1.3"/>)}</>}
 {n===9&&<><path d="M42 8C9-1-1 49 31 56Q49 56 55 39C28 47 17 19 42 8" fill="#ebd3a2" {...common}/><path d="m48 12 2 7 7 2-7 2-2 7-2-7-7-2 7-2Z" fill="#c2a6d1" stroke={line} strokeWidth="1.2"/></>}
 </svg>;
}
