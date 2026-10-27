import {validateOriginModel,type OriginModel,type OriginViewState} from './model';
import {readStoredZip,writeStoredZip,resourceHash} from '../../platform/storedZip';
const originZipPolicy={maximumBytes:200*1024*1024,maximumEntryBytes:200*1024*1024,maximumEntries:60000,validPath:(s:string)=>s==='manifest.json'||s==='model.json'||/^resources\/\d+\.bin$/.test(s),errorPrefix:'ORIGIN'};
export const originHash=resourceHash;
export function writeOriginZip(entries:ReadonlyMap<string,Uint8Array>):Uint8Array{return writeStoredZip(entries,originZipPolicy)}
export function readOriginZip(bytes:Uint8Array):Map<string,Uint8Array>{return readStoredZip(bytes,originZipPolicy)}
const encoder=new TextEncoder();
export function validateOriginView(input:unknown,model:OriginModel):OriginViewState{
 const v=input as OriginViewState,ids=new Set(model.nodes.map(n=>n.id));
 if(!v||v.tabName!==undefined&&(typeof v.tabName!=='string'||!v.tabName.trim()||v.tabName.length>300)||!['utf-8','windows-1251','windows-1252','shift_jis'].includes(v.encoding)||typeof v.includeSource!=='boolean'||(v.selectedId!==null&&!ids.has(v.selectedId))||!Array.isArray(v.includedIds)||v.includedIds.length>ids.size||new Set(v.includedIds).size!==v.includedIds.length||v.includedIds.some(id=>!ids.has(id)))throw new Error('ORIGIN_INVALID_VIEW');return v;
}
export async function writeOriginArchive(input:OriginModel,resources:ReadonlyMap<string,Uint8Array>,view:OriginViewState):Promise<Uint8Array>{
 validateOriginView(view,input);const model:OriginModel={...input,sourceResourceId:view.includeSource?input.sourceResourceId:null,resources:input.resources.filter(r=>view.includeSource||r.id!==input.sourceResourceId),nodes:view.includeSource?input.nodes:input.nodes.map(n=>({...n,capabilities:{...n.capabilities,archived:false}}))};validateOriginModel(model);
 const modelBytes=encoder.encode(JSON.stringify(model)),entries=new Map<string,Uint8Array>([['model.json',modelBytes]]),listed:{id:string;path:string}[]=[];
 for(const [i,r]of model.resources.entries()){const bytes=resources.get(r.id);if(!bytes||bytes.length!==r.size||await originHash(bytes)!==r.sha256)throw new Error('ORIGIN_RESOURCE_HASH');const path=`resources/${i}.bin`;listed.push({id:r.id,path});entries.set(path,bytes)}
 const manifest={format:'APIO_ORIGIN_CONTAINER',version:1,minimumReader:'1.4',modelSHA256:await originHash(modelBytes),view,resources:listed};entries.set('manifest.json',encoder.encode(JSON.stringify(manifest)));return writeOriginZip(entries);
}
export async function readOriginArchive(bytes:Uint8Array):Promise<{model:OriginModel;resources:Map<string,Uint8Array>;view:OriginViewState}>{
 const entries=readOriginZip(bytes),manifestBytes=entries.get('manifest.json'),modelBytes=entries.get('model.json');if(!manifestBytes||manifestBytes.length>16*1024*1024||!modelBytes||modelBytes.length>16*1024*1024)throw new Error('ORIGIN_INVALID_ARCHIVE');
 const manifest=JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(manifestBytes)) as {format:string;version:number;minimumReader:string;modelSHA256:string;view:unknown;resources:{id:string;path:string}[]};
 if(manifest.format!=='APIO_ORIGIN_CONTAINER'||manifest.version!==1||manifest.minimumReader!=='1.4')throw new Error('ORIGIN_ARCHIVE_VERSION');if(manifest.modelSHA256!==await originHash(modelBytes))throw new Error('ORIGIN_RESOURCE_HASH');
 const model=validateOriginModel(JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(modelBytes))),view=validateOriginView(manifest.view,model),resources=new Map<string,Uint8Array>();
 if(!Array.isArray(manifest.resources)||manifest.resources.length!==model.resources.length||entries.size!==model.resources.length+2)throw new Error('ORIGIN_INVALID_ARCHIVE');
 const paths=new Set<string>();
 for(const entry of manifest.resources){const bytes=entries.get(entry.path),r=model.resources.find(r=>r.id===entry.id);if(!/^resources\/\d+\.bin$/.test(entry.path)||paths.has(entry.path)||!bytes||!r||resources.has(entry.id)||bytes.length!==r.size||await originHash(bytes)!==r.sha256)throw new Error('ORIGIN_RESOURCE_HASH');resources.set(entry.id,bytes);paths.add(entry.path)}
 return {model,view,resources};
}
