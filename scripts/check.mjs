import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
function scan(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,entry.name);if(entry.isDirectory())scan(p);else if(p.endsWith('.js')){const r=spawnSync(process.execPath,['--check',p],{stdio:'inherit'});if(r.status!==0)process.exit(1);}}}
scan('src');console.log('All source JavaScript files passed syntax checks.');
