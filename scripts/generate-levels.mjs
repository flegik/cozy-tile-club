import {spawnSync} from 'node:child_process';
const result=spawnSync(process.execPath,['node_modules/vitest/vitest.mjs','run','tests/generate.test.ts'],{stdio:'inherit',env:{...process.env,UPDATE_LEVELS:'1'}});process.exit(result.status??1);
