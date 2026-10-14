export type MotionAnimation={finished:Promise<unknown>;cancel:()=>void;accelerate?:(factor:number)=>void};
const numbers=/-?\d*\.?\d+(?:e[-+]?\d+)?/gi;
function transformBetween(a:string,b:string,t:number){const left=a.match(numbers)?.map(Number)??[],right=b.match(numbers)?.map(Number)??[];if(left.length!==right.length)return t<1?a:b;let i=0;return b.replace(numbers,()=>String(left[i]+(right[i]-left[i++])*t));}
function ease(t:number){const curve=(s:number,a:number,b:number)=>3*(1-s)**2*s*a+3*(1-s)*s*s*b+s**3;let low=0,high=1;for(let i=0;i<14;i++){const s=(low+high)/2;if(curve(s,.22,.25)<t)low=s;else high=s;}return curve((low+high)/2,.68,1);}
// One cancellable requestAnimationFrame timeline. Only transform/opacity writes;
// geometry is measured once by the controller, never inside a frame callback.
// This works without WAAPI and retains intermediate frames in visual captures.
export function animateElement(element:Element,keys:Keyframe[],duration:number,maxSpeed=4):MotionAnimation|null{
 if(!(element instanceof HTMLElement)||typeof window.requestAnimationFrame!=='function')return null;
 const node=element;const original={transform:node.style.transform,opacity:node.style.opacity};let resolve!:()=>void,done=false,frame=0,released=false,elapsed=0,speed=1,lastTime:number|undefined;
 const finished=new Promise<void>(r=>resolve=r),offsets=keys.map((k,i)=>k.offset??i/(keys.length-1));
 function cancel(){if(released)return;released=true;window.cancelAnimationFrame(frame);node.style.transform=original.transform;node.style.opacity=original.opacity;if(!done){done=true;resolve();}}
 function tick(time:number){if(done)return;lastTime??=time;elapsed+=Math.max(0,time-lastTime)*speed;lastTime=time;const raw=Math.min(1,elapsed/duration),progress=raw===0?0:raw===1?1:ease(raw);let i=0;while(i<keys.length-2&&progress>offsets[i+1])i++;const a=keys[i],b=keys[i+1],t=Math.max(0,Math.min(1,(progress-offsets[i])/(offsets[i+1]-offsets[i]||1)));
  if(a.transform!==undefined&&b.transform!==undefined)node.style.transform=transformBetween(String(a.transform),String(b.transform),t);
  if(a.opacity!==undefined&&b.opacity!==undefined)node.style.opacity=String(Number(a.opacity)+(Number(b.opacity)-Number(a.opacity))*t);
  if(raw===1){done=true;resolve();}else frame=window.requestAnimationFrame(tick);
 }
 frame=window.requestAnimationFrame(tick);return{finished,cancel,accelerate:(factor:number)=>{speed=Math.max(speed,Math.min(maxSpeed,factor));}};
}
