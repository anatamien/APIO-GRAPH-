import {readFile,writeFile,mkdir,readdir,realpath,copyFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {dirname,resolve,join,relative} from 'node:path';
import {execFileSync} from 'node:child_process';

// Redistributed dependencies keep their original copyright and license texts.
const root=resolve(import.meta.dirname,'..'),destination=join(root,'docs/licenses');
const records=[],seen=new Set(),missing=[];
await mkdir(destination,{recursive:true});
async function collect(kind,name,version,license,directory,extra){
 const folder=`${kind}-${name.replaceAll('@','').replaceAll('/','-')}-${version}`;
 const files=(await readdir(directory,{withFileTypes:true})).filter(e=>e.isFile()&&/^(?:licen[cs]e|copying|notice|copyright)(?:[.-]|$)/i.test(e.name)).map(e=>join(directory,e.name));
 if(extra){const file=resolve(directory,extra);if(!relative(directory,file).startsWith('..')&&!files.includes(file))files.push(file)}
 if(!files.length){
  // Some published crates omit their workspace-level license; retain the
  // upstream texts checked into this product's notices directory.
  try{for(const entry of await readdir(join(destination,folder),{withFileTypes:true}))if(entry.isFile()&&/^(?:licen[cs]e|copying|notice|copyright)(?:[.-]|$)/i.test(entry.name))files.push(join(destination,folder,entry.name))}catch{}
 }
 if(!files.length){missing.push(`${kind}: ${name}@${version}`);return}
 await mkdir(join(destination,folder),{recursive:true});
 for(const file of files){const target=join(destination,folder,file.split(/[\\/]/).at(-1));if(resolve(file)!==resolve(target))await copyFile(file,target)}
 records.push({kind,name,version,license:typeof license==='string'?license:license?.type??'See license files',folder,files:files.map(f=>f.split(/[\\/]/).at(-1))});
}
async function npmPackage(name,from){
 const req=createRequire(join(from,'package.json'));let file;
 try{file=req.resolve(`${name}/package.json`)}catch{file=req.resolve(name);let directory=dirname(file);for(;;){try{const p=JSON.parse(await readFile(join(directory,'package.json'),'utf8'));if(p.name===name){file=join(directory,'package.json');break}}catch{}const parent=dirname(directory);if(parent===directory)throw Error(`Cannot locate ${name}`);directory=parent}}
 file=await realpath(file);if(seen.has(file))return;seen.add(file);
 const pkg=JSON.parse(await readFile(file,'utf8')),directory=dirname(file);
 await collect('npm',pkg.name,pkg.version,pkg.license,directory);
 for(const dependency of Object.keys(pkg.dependencies??{}))await npmPackage(dependency,directory);
}
const pkg=JSON.parse(await readFile(join(root,'package.json'),'utf8'));
for(const dependency of Object.keys(pkg.dependencies))await npmPackage(dependency,root);
const metadata=JSON.parse(execFileSync('cargo',['metadata','--manifest-path',join(root,'src-tauri/Cargo.toml'),'--locked','--offline','--format-version','1','--filter-platform','x86_64-pc-windows-msvc'],{encoding:'utf8',maxBuffer:8*1024*1024}));
const nodes=new Map(metadata.resolve.nodes.map(n=>[n.id,n])),reachable=new Set();
function visit(id){if(reachable.has(id))return;reachable.add(id);for(const next of nodes.get(id)?.dependencies??[])visit(next)}visit(metadata.resolve.root);
for(const crate of metadata.packages.filter(p=>p.source&&reachable.has(p.id)))await collect('cargo',crate.name,crate.version,crate.license,dirname(crate.manifest_path),crate.license_file);
if(missing.length)throw Error(`Missing license texts:\n${missing.join('\n')}`);
records.sort((a,b)=>`${a.kind}:${a.name}:${a.version}`.localeCompare(`${b.kind}:${b.name}:${b.version}`));
await writeFile(join(destination,'README.md'),'# Redistributed dependency licenses\n\nOriginal texts collected from the locked dependencies used for the Windows x64 build. Build-time Rust dependencies are included as well. Each dependency retains its own license. WebView2 is a separately licensed Microsoft component, distributed through its unmodified, signed offline installer; it is not covered by the APIO GRAPH GPL license. System fonts are not redistributed.\n\n| Dependency | License | Original texts |\n|---|---|---|\n'+records.map(r=>`| ${r.kind}: ${r.name} ${r.version} | ${r.license} | ${r.files.map(f=>`[${f}](${r.folder}/${f})`).join(', ')} |`).join('\n')+'\n');
console.log(JSON.stringify({dependencies:records.length,licenseFiles:records.reduce((n,r)=>n+r.files.length,0),missing},null,2));
