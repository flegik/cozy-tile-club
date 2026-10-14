// @vitest-environment jsdom
import React,{act} from 'react';
import {createRoot,type Root} from 'react-dom/client';
import {beforeEach,afterEach,it,expect,vi} from 'vitest';
import {readFileSync} from 'node:fs';
import App from '../src/App';
import {fresh,SAVE_KEY} from '../src/save/store';

let root:Root,container:HTMLDivElement,css:HTMLStyleElement,clock:number,next:number,callbacks:Map<number,FrameRequestCallback>;
(globalThis as any).IS_REACT_ACT_ENVIRONMENT=true;
beforeEach(async()=>{
 clock=0;next=0;callbacks=new Map();vi.stubGlobal('matchMedia',()=>({matches:false}));
 vi.stubGlobal('requestAnimationFrame',(fn:FrameRequestCallback)=>{callbacks.set(++next,fn);return next;});
 vi.stubGlobal('cancelAnimationFrame',(id:number)=>callbacks.delete(id));
 css=document.createElement('style');css.textContent=readFileSync('src/style.css','utf8');document.head.append(css);
 localStorage.clear();localStorage.setItem(SAVE_KEY,JSON.stringify({...fresh(),tutorialCompleted:true,sound:false}));
 container=document.createElement('div');document.body.append(container);root=createRoot(container);await act(async()=>root.render(<App/>));
 await act(async()=>[...container.querySelectorAll('button')].find(b=>b.textContent?.startsWith('Spielen'))!.click());
});
afterEach(async()=>{await act(async()=>root.unmount());container.remove();css.remove();vi.unstubAllGlobals();});
const tile=(id:number)=>container.querySelector<HTMLButtonElement>(`[data-tile-id="${id}"]`)!;
const phase=()=>container.querySelector('[data-motion-phase]')!.getAttribute('data-motion-phase');
async function step(){await act(async()=>{clock+=20;const pending=[...callbacks.values()];callbacks.clear();for(const fn of pending)fn(clock);});}
async function idle(){for(let i=0;i<80&&phase()!=='idle';i++)await step();expect(phase()).toBe('idle');}
async function pick(id:number){await act(async()=>tile(id).click());}

it('reduced motion commits the move without scheduling frames or constructing invisible effect elements',async()=>{
 vi.stubGlobal('matchMedia',()=>({matches:true}));await pick(14);
 expect(phase()).toBe('idle');expect(callbacks.size).toBe(0);expect(container.querySelector('.motion-effects')).toBeNull();
 expect(JSON.parse(localStorage.getItem(SAVE_KEY)!).campaigns.normal.active.state.removed).toEqual([14]);
});

it('unselected and newly revealed board nodes keep their surface opacity and never restart an entry animation',async()=>{
 const untouched=tile(23),revealed=tile(4),before=getComputedStyle(untouched).opacity;
 expect(getComputedStyle(untouched).animation).toBe('none');expect(getComputedStyle(untouched).transition).toBe('none');
 await pick(14);expect(tile(23)).toBe(untouched);expect(getComputedStyle(untouched).opacity).toBe(before);await idle();
 expect(tile(4)).toBe(revealed);expect(revealed.classList.contains('newly-free')).toBe(true);expect(getComputedStyle(revealed).animation).toBe('none');
 await pick(19);expect(revealed.classList.contains('newly-free')).toBe(false);expect(getComputedStyle(revealed).animation).toBe('none');expect(getComputedStyle(revealed).opacity).toBe('1');
 await idle();expect(tile(23)).toBe(untouched);expect(getComputedStyle(untouched).opacity).toBe(before);expect(getComputedStyle(untouched).animation).toBe('none');
});

it('real frame driver keeps matched tiles dissolved until React removes them; particles are outside fading tokens',async()=>{
 for(const id of [14,16,19]){await pick(id);await idle();}
 await pick(21);expect(container.querySelector('[data-effect="select"]')).toBeTruthy();
 for(let i=0;i<60&&phase()!=='land';i++)await step();expect(phase()).toBe('land');
 expect(container.querySelector('[data-effect="land"]')).toBeTruthy();expect(container.querySelectorAll('[data-tray-id]')).toHaveLength(4);
 for(let i=0;i<30&&phase()!=='match';i++)await step();expect(phase()).toBe('match');
 const matched=[...container.querySelectorAll<HTMLElement>('.tray-token.matching')];expect(matched).toHaveLength(3);
 const burst=container.querySelector('[data-effect="match"]')!;expect(burst.closest('[data-tray-id]')).toBeNull();expect(burst.querySelectorAll('.burst-star')).toHaveLength(8);
 // First callback establishes the animation clock; the next sixteen reach 320ms.
 await step();for(let i=0;i<15;i++)await step();
 await act(async()=>{clock+=20;const pending=[...callbacks.values()];callbacks.clear();for(const fn of pending)fn(clock);for(let i=0;i<6;i++)await Promise.resolve();expect(matched.every(el=>el.style.opacity==='0')).toBe(true);});
 await idle();expect(matched.every(el=>!el.isConnected)).toBe(true);expect(container.querySelector('[data-tray-id="16"]')).toBeTruthy();expect(container.querySelector('[data-effect]')).toBeNull();
});
