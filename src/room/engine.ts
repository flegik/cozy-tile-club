export type Furniture={id:string;name:string;kind:string;price:number;unlock:number;w:number;h:number;color:string};
export type Placed={id:string;x:number;y:number};
export const catalog:Furniture[]=[
 {id:'bed',name:'Rose Ribbon Bett',kind:'bed',price:60,unlock:1,w:2,h:3,color:'#f5b9ce'},
 {id:'sofa',name:'Rose Lounge Sofa',kind:'sofa',price:50,unlock:2,w:3,h:1,color:'#e7a4bd'},
 {id:'desk',name:'Atelier-Schreibtisch',kind:'desk',price:45,unlock:3,w:2,h:1,color:'#d7b08a'},
 {id:'shelf',name:'Sammlungsregal',kind:'shelf',price:40,unlock:1,w:1,h:1,color:'#d2b395'},
 {id:'plant',name:'Monstera',kind:'plant',price:20,unlock:1,w:1,h:1,color:'#9fbd9b'},
 {id:'table',name:'Tea Table',kind:'table',price:30,unlock:1,w:2,h:1,color:'#dfbf9f'},
 {id:'lamp',name:'Moonlight Stehlampe',kind:'lamp',price:25,unlock:2,w:1,h:1,color:'#ffe0a0'},
 {id:'bear',name:'Pudding-Plüsch',kind:'bear',price:35,unlock:4,w:1,h:1,color:'#e7bb9a'},
 {id:'flower',name:'Kirschblüten-Vase',kind:'flower',price:20,unlock:1,w:1,h:1,color:'#e6a5c1'},
 {id:'stool',name:'Lavendel-Pouf',kind:'stool',price:25,unlock:2,w:1,h:1,color:'#c6b5e1'},
 {id:'bunny',name:'Melody-Plüsch',kind:'bunny',price:40,unlock:5,w:1,h:1,color:'#ede2f3'},
 {id:'cabinet',name:'Mint-Kommode',kind:'cabinet',price:45,unlock:3,w:2,h:1,color:'#adc7c6'},
 {id:'mint-wall',name:'Mint Streifentapete',kind:'wall',price:25,unlock:1,w:0,h:0,color:'#d4e7da'},
 {id:'lavender-wall',name:'Lavendel-Tapete',kind:'wall',price:25,unlock:3,w:0,h:0,color:'#d8c9e9'},
 {id:'cream-floor',name:'Cremefliesen',kind:'floor',price:30,unlock:2,w:0,h:0,color:'#f5e5c9'}
];
export const item=(id:string)=>catalog.find(f=>f.id===id)!;
export function canPlace(placed:Placed[],id:string,x:number,y:number){const f=item(id);if(!f||f.w===0||!Number.isInteger(x)||!Number.isInteger(y)||x<0||y<0||x+f.w>7||y+f.h>7)return false;
 return !placed.filter(p=>p.id!==id).some(p=>{const o=item(p.id);return x<p.x+o.w&&x+f.w>p.x&&y<p.y+o.h&&y+f.h>p.y;});}
export function place(placed:Placed[],id:string,x:number,y:number){return canPlace(placed,id,x,y)?[...placed.filter(p=>p.id!==id),{id,x,y}]:placed;}
export const iso=(x:number,y:number)=>({x:210+(x-y)*25,y:180+(x+y)*13});
export function sorted(placed:Placed[]){return [...placed].sort((a,b)=>(a.x+a.y)-(b.x+b.y)||a.x-b.x);}
