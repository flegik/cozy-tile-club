// @vitest-environment jsdom
import React,{act} from 'react';import {createRoot,type Root} from 'react-dom/client';import {it,expect,beforeEach,afterEach,vi} from 'vitest';import App from '../src/App';import {fresh,SAVE_KEY} from '../src/save/store';import {levels} from '../src/puzzle/levels';
vi.mock('../src/motion/animate',()=>({animateElement:()=>{let resolve!:()=>void;const finished=new Promise<void>(r=>resolve=r);const animation={finished,cancel:resolve,resolve};animations.push(animation);return animation;}}));
let root:Root,container:HTMLDivElement,animations:Array<{resolve:()=>void;cancel:()=>void}>;
(globalThis as any).IS_REACT_ACT_ENVIRONMENT=true;
beforeEach(async()=>{animations=[];localStorage.clear();localStorage.setItem(SAVE_KEY,JSON.stringify({...fresh(),tutorialCompleted:true,sound:false}));container=document.createElement('div');document.body.append(container);root=createRoot(container);await act(async()=>root.render(<App/>));await button('Spielen');});
afterEach(async()=>{await act(async()=>root.unmount());container.remove();});
const saved=()=>JSON.parse(localStorage.getItem(SAVE_KEY)!);
async function button(text:string){await act(async()=>[...container.querySelectorAll('button')].find(b=>b.textContent?.includes(text))!.click());}
async function tile(){const el=container.querySelector<HTMLButtonElement>('.tile.free')!;const id=Number(el.dataset.tileId);await act(async()=>el.click());return id;}
it('distinct rapid taps commit immediately during flight; duplicate taps are ignored and all flights start immediately',async()=>{
 const a=container.querySelector<HTMLButtonElement>('[data-tile-id="14"]')!,b=container.querySelector<HTMLButtonElement>('[data-tile-id="19"]')!,c=container.querySelector<HTMLButtonElement>('[data-tile-id="21"]')!;
 await act(async()=>{a.click();a.click();b.click();c.click();});
 expect(saved().campaigns.normal.active.state.removed).toEqual([14,19,21]);expect(saved().campaigns.normal.active.state.tray).toEqual([]);
 expect(container.querySelectorAll('[data-pending-id]')).toHaveLength(2);expect(container.querySelectorAll('[data-flight-id]')).toHaveLength(3);expect(animations.length).toBeGreaterThanOrEqual(3);
 expect(container.querySelector<HTMLButtonElement>('.tile.free')!.disabled).toBe(false);
 await button('Rückgängig');expect(saved().campaigns.normal.active.state.removed).toEqual([14,19]);expect(saved().campaigns.normal.active.state.tray).toEqual([2,2]);expect(saved().campaigns.normal.active.help.undo).toBe(2);expect(container.querySelectorAll('[data-pending-id]')).toHaveLength(0);
});
it('restart clears queued presentation and late animation completion cannot replay accepted moves',async()=>{
 await act(async()=>{container.querySelector<HTMLButtonElement>('[data-tile-id="14"]')!.click();container.querySelector<HTMLButtonElement>('[data-tile-id="19"]')!.click();});
 expect(saved().campaigns.normal.active.state.removed).toHaveLength(2);await act(async()=>container.querySelector<HTMLButtonElement>('[aria-label="Neu starten"]')!.click());
 await act(async()=>{for(const a of [...animations])a.resolve();});
 expect(saved().campaigns.normal.active.state.removed).toEqual([]);expect(container.querySelector('[data-pending-id]')).toBeNull();expect(container.querySelector('[data-motion-phase="idle"]')).toBeTruthy();
});
it('a rapid legal loss sequence still respects seven slots and rejects extra input after logical loss',async()=>{
 await act(async()=>{for(const id of levels[0].lossCertificate)container.querySelector<HTMLButtonElement>(`[data-tile-id="${id}"]`)!.click();container.querySelector<HTMLButtonElement>('[data-tile-id="5"]')!.click();});
 const state=saved().campaigns.normal.active.state;expect(state.status).toBe('lost');expect(state.tray).toHaveLength(7);expect(state.removed).toEqual(levels[0].lossCertificate);
 expect(container.querySelector('[aria-label="Leiste voll"]')).toBeNull();
 await button('Rückgängig');expect(saved().campaigns.normal.active.state.status).toBe('playing');expect(saved().campaigns.normal.active.help.undo).toBe(2);expect(container.querySelector('[data-pending-id]')).toBeNull();
});
it('actual saved state commits once immediately; rapid repeat cannot duplicate a tile; Undo cancels visual flight and charges once',async()=>{const el=container.querySelector<HTMLButtonElement>('.tile.free')!;await act(async()=>{el.dispatchEvent(new MouseEvent('click',{bubbles:true}));el.dispatchEvent(new MouseEvent('click',{bubbles:true}));});expect(saved().campaigns.normal.active.state.removed).toHaveLength(1);expect(container.querySelector('[data-motion-phase="flight"]')).toBeTruthy();await button('Rückgängig');expect(saved().campaigns.normal.active.state.removed).toEqual([]);expect(saved().campaigns.normal.active.help.undo).toBe(2);await act(async()=>animations[0].resolve());expect(saved().campaigns.normal.active.state.removed).toEqual([]);});
it('restart and mode navigation abort flights while preserving independent saved attempts, help and common room',async()=>{await tile();await act(async()=>container.querySelector<HTMLButtonElement>('[aria-label="Neu starten"]')!.click());expect(saved().campaigns.normal.active.state.removed).toEqual([]);expect(saved().campaigns.normal.active.help).toEqual({undo:3,hint:1});const id=await tile();await act(async()=>container.querySelector<HTMLButtonElement>('[aria-label="Zurück"]')!.click());expect(container.querySelector('.flying-tile')).toBeNull();await act(async()=>container.querySelector<HTMLButtonElement>('[data-mode="cozy"]')!.click());expect(saved().campaigns.normal.active.state.removed).toEqual([id]);expect(saved().campaigns.cozy.active).toBeNull();await act(async()=>container.querySelector<HTMLButtonElement>('[data-mode="normal"]')!.click());await act(async()=>container.querySelector<HTMLButtonElement>('[aria-label^="Level 1,"]')!.click());expect(container.querySelector('[data-motion-phase="idle"]')).toBeTruthy();expect(container.querySelectorAll('[data-tray-id]')).toHaveLength(1);expect(saved().placed).toEqual(fresh().placed);});
it('covered tile gives feedback but never changes engine state or uses any help',async()=>{const el=container.querySelector<HTMLButtonElement>('.tile.covered')!;await act(async()=>el.click());expect(animations.length).toBeGreaterThan(0);expect(saved().campaigns.normal.active.state.removed).toEqual([]);expect(saved().campaigns.normal.active.help).toEqual({undo:3,hint:1});});

it('full animation preference overrides reduced device motion and survives reload parsing',async()=>{
 vi.stubGlobal('matchMedia',()=>({matches:true}));
 await act(async()=>root.unmount());
 const save={...saved(),motion:'full'};localStorage.setItem(SAVE_KEY,JSON.stringify(save));root=createRoot(container);await act(async()=>root.render(<App/>));await act(async()=>container.querySelector<HTMLButtonElement>('.home-actions .primary')!.click());
 expect(document.documentElement.dataset.motion).toBe('full');await tile();
 expect(animations.length).toBeGreaterThan(0);expect(container.querySelector('[data-effect="select"]')).toBeTruthy();expect(saved().motion).toBe('full');vi.unstubAllGlobals();
});
