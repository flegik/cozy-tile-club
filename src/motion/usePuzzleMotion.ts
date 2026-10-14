import {useCallback,useEffect,useLayoutEffect,useRef,useState} from 'react';
import type {Tile,State} from '../puzzle/types';
import {accessible} from '../puzzle/engine';
import {groupTray,trayTiles,stageMove,box,flightPath,type Box,type TrayTile} from './tray';
import {playSound} from '../audio/sound';
import {animateElement,type MotionAnimation} from './animate';
export type Frame={serial:number;kind:'select'|'undo';phase:'flight'|'land'|'match'|'settle';id:number;motif:number;source:Box;tokens:TrayTile[];final:TrayTile[];matched:number[];revealed:number[];sound:boolean;won:boolean};
export function usePuzzleMotion(tiles:Tile[],state:State){
 const [frame,setFrame]=useState<Frame|null>(null),[revealed,setRevealed]=useState<number[]>([]),[targetBox,setTargetBox]=useState<Box|null>(null),[matchBox,setMatchBox]=useState<Box|null>(null);const locked=useRef(false),epoch=useRef(0),animations=useRef(new Set<MotionAnimation>()),flightRef=useRef<HTMLDivElement|null>(null),trayRef=useRef<HTMLDivElement|null>(null),boardRef=useRef<HTMLDivElement|null>(null),previousRects=useRef(new Map<number,Box>());
 const reduced=()=>window.matchMedia?.('(prefers-reduced-motion: reduce)').matches===true;
 const cancel=useCallback(()=>{epoch.current++;locked.current=false;for(const a of animations.current)a.cancel();animations.current.clear();setFrame(null);setRevealed([]);setTargetBox(null);setMatchBox(null);},[]);
 function run(element:Element|null,keys:Keyframe[],duration:number,scope?:Set<MotionAnimation>){if(!element||reduced())return Promise.resolve();const a=animateElement(element,keys,duration);if(!a)return Promise.resolve();animations.current.add(a);scope?.add(a);return a.finished.catch(()=>{}).then(()=>{if(!scope){animations.current.delete(a);a.cancel();}});}
 function remember(){if(reduced()){previousRects.current.clear();return;}previousRects.current=new Map(Array.from(trayRef.current?.querySelectorAll<HTMLElement>('[data-tray-id]')??[]).map(el=>[Number(el.dataset.trayId),box(el)]));}
 const begin=(before:State,after:State,id:number,source:Box,sound:boolean)=>{if(locked.current)return false;locked.current=true;setTargetBox(null);setMatchBox(null);remember();const staged=stageMove(tiles,before,id);setRevealed([]);setFrame({serial:++epoch.current,kind:'select',phase:'flight',id,motif:tiles.find(t=>t.id===id)!.motif,source,tokens:staged.tokens,final:groupTray(trayTiles(tiles,after)),matched:staged.matched,revealed:tiles.filter(t=>!accessible(tiles,before,t.id)&&accessible(tiles,after,t.id)).map(t=>t.id),sound,won:after.status==='won'});return true;};
 const beginUndo=(before:State,after:State,id:number,sound:boolean)=>{const index=stageMove(tiles,after,id).index;const el=(frame?.id===id?flightRef.current:null)??trayRef.current?.querySelector(`[data-tray-id="${id}"]`)??trayRef.current?.querySelector(`[data-slot="${index}"]`);const source=el?box(el):{left:0,top:0,width:40,height:44};cancel();remember();locked.current=true;setFrame({serial:++epoch.current,kind:'undo',phase:'flight',id,motif:tiles.find(t=>t.id===id)!.motif,source,tokens:groupTray(trayTiles(tiles,after)),final:groupTray(trayTiles(tiles,after)),matched:[],revealed:[id],sound,won:false});playSound('undo',sound);};
 useLayoutEffect(()=>{
  if(!frame)return;const scope=new Set<MotionAnimation>();const animate=(el:Element|null,keys:Keyframe[],duration:number)=>run(el,keys,duration,scope);const serial=frame.serial;let alive=true;const valid=()=>alive&&serial===epoch.current;const token=(id:number)=>trayRef.current?.querySelector(`[data-tray-id="${id}"]`)??null;
  const shifts:Promise<void>[]=[];for(const el of trayRef.current?.querySelectorAll<HTMLElement>('[data-tray-id]')??[]){const old=previousRects.current.get(Number(el.dataset.trayId));if(old){const current=box(el),dx=old.left-current.left,dy=old.top-current.top;if(Math.abs(dx)+Math.abs(dy)>.1)shifts.push(animate(el,[{transform:`translate3d(${dx}px,${dy}px,0)`},{transform:'translate3d(0,0,0)'}],180));}}previousRects.current.clear();
  const advance=(phase:Frame['phase'],tokens=frame.tokens)=>{if(valid()){remember();setFrame({...frame,phase,tokens});}};
  void (async()=>{
   if(frame.phase==='flight'){
    const index=frame.tokens.findIndex(t=>t.id===frame.id);const target=frame.kind==='undo'?boardRef.current?.querySelector(`[data-tile-id="${frame.id}"]`):trayRef.current?.querySelector(`[data-slot="${index}"]`);
    if(!target){if(valid())cancel();return;}
    const destination=box(target);if(!reduced())setTargetBox(destination);await animate(flightRef.current,flightPath(frame.source,destination),340);if(!valid())return;setRevealed(frame.revealed);advance('land');
   }else if(frame.phase==='land'){
    playSound('land',frame.sound);const target=frame.kind==='undo'?boardRef.current?.querySelector(`[data-tile-id="${frame.id}"]`):token(frame.id);
    await animate(target??null,[{transform:'scale(.9)'},{transform:'scale(1.1)',offset:.5},{transform:'scale(1)'}],140);
    if(frame.kind==='select'&&frame.matched.length)advance('match');else advance('settle',frame.final);
   }else if(frame.phase==='match'){
    if(!reduced()){const rects=frame.matched.map(id=>token(id)).filter((el):el is Element=>!!el).map(box);if(rects.length){const left=Math.min(...rects.map(r=>r.left)),top=Math.min(...rects.map(r=>r.top));setMatchBox({left,top,width:Math.max(...rects.map(r=>r.left+r.width))-left,height:Math.max(...rects.map(r=>r.top+r.height))-top});}}playSound('match',frame.sound);await Promise.all(frame.matched.map(id=>animate(token(id),[{transform:'scale(1)',opacity:1},{transform:'scale(1.16)',opacity:1,offset:.3},{transform:'scale(1.05)',opacity:1,offset:.62},{transform:'scale(.62)',opacity:0}],320)));advance('settle',frame.final);
   }else{
    await Promise.all(shifts);if(valid()){if(frame.won)playSound('win',frame.sound);locked.current=false;setFrame(null);}
   }
  })();return()=>{alive=false;for(const animation of scope){animation.cancel();animations.current.delete(animation);}};
 },[frame]);
 useEffect(()=>{const hidden=()=>{if(document.visibilityState==='hidden')cancel();};const resize=()=>cancel();document.addEventListener('visibilitychange',hidden);window.addEventListener('pagehide',cancel);window.addEventListener('resize',resize);window.addEventListener('scroll',resize,{passive:true});return()=>{document.removeEventListener('visibilitychange',hidden);window.removeEventListener('pagehide',cancel);window.removeEventListener('resize',resize);window.removeEventListener('scroll',resize);epoch.current++;for(const a of animations.current)a.cancel();animations.current.clear();locked.current=false;};},[cancel]);
 function feedback(element:Element|null){void run(element,[{transform:'translateX(0)'},{transform:'translateX(-3px)',offset:.3},{transform:'translateX(3px)',offset:.6},{transform:'translateX(0)'}],140);}
 return{frame,locked,begin,beginUndo,cancel,feedback,flightRef,trayRef,boardRef,revealed,targetBox,matchBox,tokens:frame?.tokens??groupTray(trayTiles(tiles,state))};
}
