// @vitest-environment jsdom
import React,{act} from 'react';
import {createRoot,type Root} from 'react-dom/client';
import {beforeEach,afterEach,it,expect,vi} from 'vitest';
import App from '../src/App';
import {fresh,SAVE_KEY} from '../src/save/store';
import {solve} from '../src/puzzle/solver';
import {levels} from '../src/puzzle/levels';
let root:Root;let container:HTMLDivElement;
(globalThis as any).IS_REACT_ACT_ENVIRONMENT=true;
class FakeWorker{onmessage:any;onerror:any;terminated=false;terminate(){this.terminated=true;}postMessage(data:any){queueMicrotask(()=>{if(!this.terminated)this.onmessage?.({data:solve(data.tiles,data.state,data.budget)});});}}
beforeEach(async()=>{vi.stubGlobal('Worker',FakeWorker);localStorage.clear();localStorage.setItem(SAVE_KEY,JSON.stringify({...fresh(),sound:false}));container=document.createElement('div');document.body.append(container);root=createRoot(container);await act(async()=>root.render(<App/>));});
afterEach(async()=>{await act(async()=>root.unmount());container.remove();vi.unstubAllGlobals();});
function find(text:string){const button=[...container.querySelectorAll('button')].find(b=>b.textContent?.includes(text));if(!button)throw new Error('Missing button '+text);return button;}
async function click(element:Element){await act(async()=>{element.dispatchEvent(new MouseEvent('click',{bubbles:true}));await Promise.resolve();});}
it('plays an entire level through touch-equivalent click events, rewards once, persists and unlocks next level',async()=>{
 await click(find('Level 1 spielen'));
 for(const id of levels[0].certificate){const tile=container.querySelectorAll('.tile');const target=[...tile].find(t=>t.getAttribute('aria-label')===`${['Erdbeere','Schleife','Kuschelbär','Herz','Stern','Blüte','Mond','Hase','Tasse','Wolke'][levels[0].tiles[id].motif]}, Ebene ${levels[0].tiles[id].z+1}`&&!(t as HTMLButtonElement).disabled);
 // IDs distinguish duplicate motifs and are not inferred from display labels.
 const exact=container.querySelector(`[data-tile-id="${id}"]`)??target;expect(exact).toBeTruthy();await click(exact!);
 }
 expect(container.textContent).toContain('Wunderbar gemacht!');const save=JSON.parse(localStorage.getItem(SAVE_KEY)!);expect(save.completed).toEqual([1]);expect(save.hearts).toBe(70);await click(find('Nächstes Level'));expect(container.textContent).toContain('Level 2');
});
it('navigates shop, buys a bed, places and removes it without losing ownership',async()=>{await click(find('Mein Zimmer'));await click(find('Zum Shop'));const article=[...container.querySelectorAll('article')].find(a=>a.textContent?.includes('Wolkentraum-Bett'))!;expect((article.querySelector('button') as HTMLButtonElement).disabled).toBe(true);
 await act(async()=>root.unmount());const s={...fresh(),hearts:100,sound:false,completed:[1]};localStorage.setItem(SAVE_KEY,JSON.stringify(s));root=createRoot(container);await act(async()=>root.render(<App/>));await click(find('Mein Zimmer'));await click(find('Zum Shop'));const bedArticle=[...container.querySelectorAll('article')].find(a=>a.textContent?.includes('Wolkentraum-Bett'))!;await click(bedArticle.querySelector('button')!);expect(JSON.parse(localStorage.getItem(SAVE_KEY)!).hearts).toBe(40);await click(find('Zimmer'));await click(find('Wolkentraum-Bett'));await click(container.querySelector('[aria-label="Platz 6, 1, verfügbar"]')!);expect(JSON.parse(localStorage.getItem(SAVE_KEY)!).placed.some((p:any)=>p.id==='bed')).toBe(true);await click(find('Entfernen'));const saved=JSON.parse(localStorage.getItem(SAVE_KEY)!);expect(saved.owned).toContain('bed');expect(saved.placed.some((p:any)=>p.id==='bed')).toBe(false);});
it('hint, layer atlas, undo and resume retain the active puzzle state',async()=>{await click(find('Level 1 spielen'));await click(find('Hinweis'));expect(container.querySelector('.hinted')).toBeTruthy();await click(container.querySelector('.hinted')!);await click(find('Ebenen'));expect(container.textContent).toContain('Ein Blick unter die Kacheln');await click(find('Undo'));expect(JSON.parse(localStorage.getItem(SAVE_KEY)!).active.state.removed).toEqual([]);await click(container.querySelector('.tile:not(:disabled)')!);await click(container.querySelector('[aria-label="Zurück"]')!);await click(container.querySelector('[aria-label="Zurück"]')!);expect(container.textContent).toContain('Level 1 fortsetzen');await click(find('Level 1 fortsetzen'));expect(JSON.parse(localStorage.getItem(SAVE_KEY)!).active.state.removed).toHaveLength(1);});
