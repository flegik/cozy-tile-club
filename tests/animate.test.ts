// @vitest-environment jsdom
import {it,expect,vi,afterEach} from 'vitest';
import {animateElement} from '../src/motion/animate';
afterEach(()=>{vi.useRealTimers();vi.unstubAllGlobals();document.head.innerHTML='';document.body.innerHTML='';});
function setup(){vi.stubGlobal('CSS',{supports:()=>true});const el=document.createElement('div');document.body.append(el);return el;}
it('CSS fallback preserves exact flight transforms and resolves only its own completion event',async()=>{
 const el=setup();el.style.animation='existing 1s';const a=animateElement(el,[{transform:'translate3d(0,0,0)',offset:0},{transform:'translate3d(20px,400px,0) scale(.8)',offset:1}],340)!;
 const name=el.style.animation.split(' ')[0];expect(document.head.textContent).toContain('100%{transform:translate3d(20px,400px,0) scale(.8);}');
 let complete=false;void a.finished.then(()=>complete=true);el.dispatchEvent(new Event('animationend'));await Promise.resolve();expect(complete).toBe(false);
 const event=new Event('animationend');Object.defineProperty(event,'animationName',{value:name});el.dispatchEvent(event);await a.finished;expect(complete).toBe(true);expect(el.style.animation).toBe('existing 1s');expect(document.head.querySelector('style')).toBeNull();a.cancel();
});
it('CSS cancellation and missing-event watchdog release input and remove styles without leaking timers',async()=>{
 vi.useFakeTimers();const el=setup();const a=animateElement(el,[{opacity:1},{opacity:0}],250)!;a.cancel();await a.finished;expect(vi.getTimerCount()).toBe(0);expect(document.head.querySelector('style')).toBeNull();
 const b=animateElement(el,[{opacity:1},{opacity:0}],250)!;await vi.advanceTimersByTimeAsync(370);await b.finished;expect(el.style.animation).toBe('');expect(vi.getTimerCount()).toBe(0);
});
