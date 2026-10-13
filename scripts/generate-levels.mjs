import {spawnSync} from 'node:child_process';
const result=spawnSync(process.execPath,['node_modules/vite-node/vite-node.mjs','scripts/curate.ts'],{stdio:'inherit'});process.exit(result.status??1);
