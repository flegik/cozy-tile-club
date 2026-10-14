// @vitest-environment jsdom
import {it,expect,vi,afterEach} from 'vitest';
import {animateElement} from '../src/motion/animate';
afterEach(()=>{vi.unstubAllGlobals();document.body.innerHTML='';});
function setup(){const callbacks=new Map<number,FrameRequestCallback>();let next=0;vi.stubGlobal('requestAnimationFrame',(fn:FrameRequestCallback)=>{callbacks.set(++next,fn);return next;});vi.stubGlobal('cancelAnimationFrame',(id:number)=>callbacks.delete(id));const el=document.createElement('div');document.body.append(el);return{el,callbacks,tick:(time:number)=>{const pending=[...callbacks.values()];callbacks.clear();for(const fn of pending)fn(time);}};}
it('frame timeline renders intermediate geometry then reaches the exact destination before completing',async()=>{
 const {el,tick,callbacks}=setup();const a=animateElement(el,[{transform:'translate3d(0px,0px,0) scale(1)',opacity:1,offset:0},{transform:'translate3d(20px,400px,0) scale(.8)',opacity:0,offset:1}],340)!;
 let complete=false;void a.finished.then(()=>complete=true);tick(0);tick(170);expect(el.style.transform).not.toContain('400px');expect(Number(el.style.opacity)).toBeGreaterThan(0);expect(Number(el.style.opacity)).toBeLessThan(1);expect(complete).toBe(false);tick(340);await a.finished;expect(el.style.transform).toBe('translate3d(20px,400px,0) scale(0.8)');expect(el.style.opacity).toBe('0');expect(callbacks.size).toBe(0);a.cancel();expect(el.style.transform).toBe('');expect(el.style.opacity).toBe('');
});
it('cancellation restores original styles, resolves completion and ignores callbacks already dispatched',async()=>{
 const {el,tick,callbacks}=setup();el.style.transform='scale(.9)';const a=animateElement(el,[{transform:'scale(1)'},{transform:'scale(1.1)'}],110)!;tick(0);tick(50);const late=[...callbacks.values()];a.cancel();await a.finished;expect(callbacks.size).toBe(0);for(const fn of late)fn(110);expect(el.style.transform).toBe('scale(.9)');a.cancel();
});
