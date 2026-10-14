export type MotionAnimation={finished:Promise<unknown>;cancel:()=>void};
let nextAnimation=0;
// Native completion when available; CSS keyframes retain the same geometry on
// browsers without WAAPI. A single completion watchdog prevents a missing
// animationend event from locking input. Cancellation removes all resources.
export function animateElement(element:Element,keys:Keyframe[],duration:number):MotionAnimation|null{
 if(typeof element.animate==='function'){
  try{const a=element.animate(keys,{duration,easing:'cubic-bezier(.22,.68,.25,1)',fill:'both'});if(typeof (a as Partial<Animation>).finished?.then==='function')return a;a.cancel();}catch{/* CSS fallback */}
 }
 if(!(element instanceof HTMLElement)||!window.CSS?.supports?.('animation-name','cozy-motion'))return null;
 const name=`cozy-motion-${++nextAnimation}`,style=document.createElement('style'),old=element.style.animation;
 style.textContent=`@keyframes ${name}{${keys.map((k,i)=>`${100*(k.offset??i/(keys.length-1))}%{${k.transform!==undefined?`transform:${k.transform};`:''}${k.opacity!==undefined?`opacity:${k.opacity};`:''}}`).join('')}}`;
 document.head.append(style);let resolve!:()=>void,done=false;const finished=new Promise<void>(r=>resolve=r);
 const end=(event:Event)=>{if(event.target===element&&(event as AnimationEvent).animationName===name)finish();};
 const finish=()=>{if(done)return;done=true;clearTimeout(watchdog);element.removeEventListener('animationend',end);element.removeEventListener('animationcancel',end);element.style.animation=old;style.remove();resolve();};
 element.addEventListener('animationend',end);element.addEventListener('animationcancel',end);
 element.style.animation=`${name} ${duration}ms cubic-bezier(.22,.68,.25,1) both`;
 const watchdog=window.setTimeout(finish,duration+120);
 return{finished,cancel:finish};
}
