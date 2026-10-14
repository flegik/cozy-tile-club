import {readFileSync,writeFileSync} from 'node:fs';
import {levels} from '../src/puzzle/levels';
import {simulate} from '../src/puzzle/simulation';
import {analyze} from '../src/puzzle/analysis';
import {ADVANCED_SEED,HOLDOUT_SEED,ADVANCED_TRIALS,advancedAccept} from '../src/puzzle/advanced-curator';
import {solve} from '../src/puzzle/solver';import {emptyState} from '../src/puzzle/types';
const stored=JSON.parse(readFileSync('src/puzzle/advanced-calibration.json','utf8'));let runs=0;
for(const l of levels.slice(30)){
 const row=stored.results.find((r:any)=>r.id===l.id&&r.seed===l.seed);if(!row)throw Error('Missing holdout '+l.id);
 for(const strategy of ['random','greedy','lookahead','advanced'] as const){const training=simulate(l.tiles,strategy,ADVANCED_TRIALS,ADVANCED_SEED),validation=simulate(l.tiles,strategy,ADVANCED_TRIALS,HOLDOUT_SEED);if(JSON.stringify(training)!==JSON.stringify(l.metrics[strategy])||JSON.stringify(validation)!==JSON.stringify(row.validation[strategy]))throw Error('Simulation changed '+l.id+' '+strategy);runs+=2*ADVANCED_TRIALS;}
 if(solve(l.tiles,emptyState(),30000).status!=='solved')throw Error('Missing independent proof '+l.id);
 if(!advancedAccept(l.tier,row.validation.greedy.rate,row.validation.lookahead.rate,row.validation.advanced.rate,.025))throw Error('Holdout band '+l.id);
 if(JSON.stringify(analyze(l.tiles,l.certificate))!==JSON.stringify(l.metrics.analysis))throw Error('Analysis changed '+l.id);
 console.log(`Level ${l.id} fully reproduced (${runs} runs)`);
}
console.log('PASS',runs,'reproduced simulations');
