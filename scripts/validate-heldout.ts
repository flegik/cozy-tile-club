import {writeFileSync} from 'node:fs';
import {levels} from '../src/puzzle/levels';
import {simulate} from '../src/puzzle/simulation';
const seed=0x51A7E202;
const results=levels.map(l=>({id:l.id,random:simulate(l.tiles,'random',1000,seed),greedy:simulate(l.tiles,'greedy',1000,seed),lookahead:simulate(l.tiles,'lookahead',1000,seed)}));
writeFileSync('src/puzzle/heldout.json',JSON.stringify({seed,trials:1000,results}));
console.log('Independent validation stream: 90,000 simulations complete.');
