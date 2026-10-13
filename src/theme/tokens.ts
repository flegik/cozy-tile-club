export type Theme='light'|'dark';
export const themes={
 light:{bg:'#f3edf0',surface:'#fffaf8',surface2:'#f5e8ed',surface3:'#ead8e3',text:'#503e52',muted:'#766276',accent:'#885478',accentSoft:'#eed5e3',border:'#d2bdcc',primary:'#6e4b71',primaryText:'#fff8fb',tile:'#fff8ed',tileText:'#503e52',board:'#eee3e5',danger:'#924b68',success:'#466c59'},
 dark:{bg:'#1c1a27',surface:'#272331',surface2:'#332c40',surface3:'#49394f',text:'#f3e6ef',muted:'#c3aec4',accent:'#e3b5d7',accentSoft:'#47354b',border:'#67556d',primary:'#d8b3d2',primaryText:'#302535',tile:'#e8dce9',tileText:'#44364b',board:'#312c3e',danger:'#f0b1c7',success:'#b5d7c1'}
} as const;
export function themeStyle(theme:Theme){return Object.fromEntries(Object.entries(themes[theme]).map(([key,value])=>['--'+key.replace(/[A-Z]/g,c=>'-'+c.toLowerCase()).replace(/([a-z])(\d)/g,'$1-$2'),value]));}
export function blend(a:string,b:string,weight:number){return '#'+[1,3,5].map(i=>Math.round(parseInt(a.slice(i,i+2),16)*(1-weight)+parseInt(b.slice(i,i+2),16)*weight).toString(16).padStart(2,'0')).join('');}
