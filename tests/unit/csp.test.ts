import {it,expect} from 'vitest';
import {execFileSync} from 'node:child_process';
it('SYS-004 PRJ-001 validates examples under disabled runtime code generation',()=>{
 const script="const fs=require('node:fs');import('./src/domain/generated/aphValidator.js').then(({default:validate})=>{for(const n of ['empty','example','annotated-calculated']){if(!validate(JSON.parse(fs.readFileSync('examples/'+n+'.aph','utf8'))))process.exit(1)}})";
 expect(()=>execFileSync(process.execPath,['--disallow-code-generation-from-strings','-e',script])).not.toThrow();
});
