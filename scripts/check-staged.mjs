import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
const root=execFileSync('git',['rev-parse','--show-toplevel'],{encoding:'utf8'}).trim();
const files=execFileSync('git',process.argv.includes('--all')?['ls-files','-z']:['diff','--cached','--name-only','--diff-filter=ACMR','-z'],{encoding:'utf8',cwd:root}).split('\0').filter(Boolean);
const productRoot=path.dirname(import.meta.dirname);
const productRelative=path.relative(root,productRoot).replaceAll('\\','/');
const prefix=productRelative?productRelative+'/':'';
const docs=/^docs\/(?:\d{2}-[A-Z-]+|APIO_GRAPH_MASTER|IMPLEMENTATION_GUIDE|ACCEPTANCE_STATUS|USER_GUIDE|THIRD_PARTY_NOTICES)\.md$/;
const top=new Set(['README.md','README.ru.md','LICENSE','CHANGELOG.md','CONTRIBUTING.md','.editorconfig','.gitattributes','.gitignore','index.html','package.json','pnpm-lock.yaml','tsconfig.json','vite.config.ts','playwright.config.ts','eslint.config.js']);
const forbidden=[];
for(const file of files){
 const rel=file.startsWith(prefix)?file.slice(prefix.length):file;
 const community=/^\.github\/(?:workflows\/[a-z-]+\.ya?ml|ISSUE_TEMPLATE\/[a-z_]+\.ya?ml|pull_request_template\.md)$/.test(rel);
 const distributionDocs=/^docs\/(?:images\/[\w-]+\.png|licenses\/(?:README\.md|[\w.+-]+\/[\w.-]+))$/.test(rel);
 const originSource=/^src-tauri\/native\/origin\/(?:liborigin\/)?(?:[\w.-]+\.(?:cpp|h|hpp|hh|md)|CMakeLists\.txt|COPYING)$/.test(rel);
 const allowed=file==='README.md'||file==='LICENSE'||/^\.github\/workflows\/[a-z-]+\.ya?ml$/.test(file)||file.startsWith(prefix)&&(top.has(rel)||community||distributionDocs||docs.test(rel)||/^schemas\/[^/]+\.json$/.test(rel)||/^examples\/[^/]+\.aph$/.test(rel)||/^design\/(?:VISUAL_REFERENCE\.md|reference\/[^/]+\.(?:png|html))$/.test(rel)||/^src\/(?!.*(?:^|\/)\.)(?:[\w-]+\/)*[\w.-]+\.(?:ts|tsx|css|json|js)$/.test(rel)||/^tests\/(?:unit|integration|e2e)\/(?:[\w-]+\/)*[\w.-]+\.tsx?$/.test(rel)||/^tests\/fixtures\/(?:[\w-]+\/)*[\w.-]+\.(?:txt|csv|tsv|json|aph|ts)$/.test(rel)||/^scripts\/[\w-]+\.mjs$/.test(rel)||['scripts/signal-references.py','scripts/peak-references.py'].includes(rel)||/^src-tauri\/(?:README\.md|Cargo\.(?:toml|lock)|build\.rs|tauri(?:\.macos)?\.conf\.json|installer-hooks\.nsh|Info\.plist|(?:src|capabilities|permissions)\/(?:[\w-]+\/)*[\w.-]+\.(?:rs|json|toml)|icons\/[\w@.-]+\.(?:svg|png|ico|icns))$/.test(rel));
 if(!allowed&&!originSource){forbidden.push(file);continue}
 if(/\.(?:png|ico|icns)$/.test(file))continue;
 const staged=execFileSync('git',['show',':'+file],{cwd:root,maxBuffer:4*1024*1024,encoding:'utf8'});
 if(/-----BEGIN [A-Z ]*PRIVATE KEY-----|\bAKIA[0-9A-Z]{16}\b|\bgh[pousr]_[a-zA-Z0-9]{30,}\b|\bsk-(?:proj-)?[a-zA-Z0-9_-]{35,}\b/.test(staged))forbidden.push(file+' (credential pattern)');
}
if(forbidden.length){process.stderr.write(forbidden.join('\n')+'\n');process.exit(1)}
execFileSync('git',['diff','--cached','--check'],{stdio:'inherit',cwd:root});
process.stdout.write(`Checked ${files.length} product paths.\n`);
// Ensure checks are run from a real checkout rather than an exported directory.
if(!fs.existsSync(path.join(root,'.git')))process.exit(1);
