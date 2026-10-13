import {writeFileSync} from 'node:fs';
import {buildPack,SIMULATION_SEED,TRIALS} from '../src/puzzle/curator';
const result=buildPack(console.log);
writeFileSync('src/puzzle/levels.json',JSON.stringify(result.pack));
writeFileSync('src/puzzle/calibration.json',JSON.stringify({version:2,simulationSeed:SIMULATION_SEED,trialsPerStrategy:TRIALS,...result.audit},null,2)+'\n');
console.log('DONE',result.audit);
