import type {ProjectDocument,Point} from '../../domain/model';
import {validateProject} from '../../domain/project';
import {validateOriginModel,type OriginModel,type OriginViewState} from '../origin/model';
import {validateOriginView} from '../origin/archive';
import {readOriginCells} from '../origin/resources';
import {readStoredZip,writeStoredZip,resourceHash} from '../../platform/storedZip';
import {encodePointBuffer,decodePointBuffer} from './pointBuffer';

export const WORKSPACE_LIMIT=512*1024*1024;
export const workspaceZipPolicy={maximumBytes:WORKSPACE_LIMIT,maximumEntryBytes:200*1024*1024,maximumEntries:60000,validPath:(s:string)=>s==='manifest.json'||/^resources\/[a-f0-9]{64}\.bin$/.test(s),errorPrefix:'WORKSPACE'};
const pointBuffers=new WeakMap<readonly Point[],{bytes:Uint8Array;hash:string}>();
const encoder=new TextEncoder(),decoder=new TextDecoder('utf-8',{fatal:true});
const uuid=/^[a-f0-9]{8}-[a-f0-9]{4}-[1-8][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/;
const hash=/^[a-f0-9]{64}$/;
type GraphMetadata=Omit<ProjectDocument,'datasets'>&{datasets:(Omit<ProjectDocument['datasets'][number],'points'>&{pointsResource:string})[]};
export type StoredTab={id:string;label:string;kind:'graph';document:string}|{id:string;label:string;kind:'origin';model:string;view:OriginViewState;resources:{id:string;hash:string}[]};
export interface WorkspaceManifest {format:'APIO_GRAPH_WORKSPACE';version:1;required:string[];id:string;activeId:string|null;tabs:StoredTab[];resources:{hash:string;size:number}[]}
export interface TabPacket {tab:StoredTab;resources:Map<string,Uint8Array>}
export type SaveTab={id:string;label:string;project:ProjectDocument}|{id:string;label:string;origin:{model:OriginModel;view:OriginViewState;resources:Map<string,Uint8Array>}}|{packet:TabPacket};
export interface WorkspaceInput {id:string;activeId:string|null;tabs:SaveTab[]}
const json=(value:unknown)=>{let token:string,text:string,collision:boolean;do{token=`__negative_zero_${crypto.randomUUID()}__`;collision=false;text=JSON.stringify(value,(key,value)=>{if(key.includes(token)||typeof value==='string'&&value.includes(token))collision=true;return typeof value==='number'&&Object.is(value,-0)?token:value})}while(collision);const bytes=encoder.encode(text.split(JSON.stringify(token)).join('-0'));if(bytes.length>16*1024*1024)throw new Error('WORKSPACE_METADATA_LIMIT');return bytes};
function parse(bytes:Uint8Array|undefined):unknown{if(!bytes||bytes.length>16*1024*1024)throw new Error('WORKSPACE_METADATA_LIMIT');return JSON.parse(decoder.decode(bytes))}
function keys(value:object,allowed:string[]){if(Object.keys(value).some(k=>!allowed.includes(k)))throw new Error('WORKSPACE_INVALID_MANIFEST')}
function validLabel(s:unknown):s is string{return typeof s==='string'&&s.length>0&&s.length<=1024&&!/[\x00-\x1f]/.test(s)}
function stripRecovery(p:ProjectDocument):ProjectDocument{const extensions={...p.extensions};delete extensions.apioWorkspaceRecovery;return {...p,extensions}}
export class WorkspaceArchive {
 private preparedActive:{id:string;project:ProjectDocument}|null=null;
 private origins=new Map<string,{model:OriginModel;view:OriginViewState;resources:Map<string,Uint8Array>}>();
 constructor(readonly manifest:WorkspaceManifest,private resources:Map<string,Uint8Array>){}
 packet(id:string):TabPacket{const tab=this.manifest.tabs.find(t=>t.id===id);if(!tab)throw new Error('WORKSPACE_TAB_MISSING');const hashes=tab.kind==='origin'?[tab.model,...tab.resources.map(r=>r.hash)]:[tab.document,...this.graphMetadata(tab).datasets.map(d=>d.pointsResource)];return {tab,resources:new Map(hashes.map(h=>[h,this.resource(h)]))}}
 private resource(h:string){const bytes=this.resources.get(h);if(!bytes)throw new Error('WORKSPACE_RESOURCE_MISSING');return bytes}
 private graphMetadata(tab:Extract<StoredTab,{kind:'graph'}>):GraphMetadata{return parse(this.resource(tab.document)) as GraphMetadata}
 graph(id:string):ProjectDocument{if(this.preparedActive?.id===id){const project=this.preparedActive.project;this.preparedActive=null;return project}const tab=this.manifest.tabs.find(t=>t.id===id);if(tab?.kind!=='graph')throw new Error('WORKSPACE_TAB_KIND');const raw=this.graphMetadata(tab);if(!raw||!Array.isArray(raw.datasets)||raw.datasets.length>10000)throw new Error('WORKSPACE_INVALID_GRAPH');const p:ProjectDocument={...raw,datasets:raw.datasets.map(d=>{if(!d||typeof d!=='object'||'points'in d||!hash.test(d.pointsResource))throw new Error('WORKSPACE_INVALID_GRAPH');const {pointsResource,...metadata}=d;return {...metadata,points:decodePointBuffer(this.resource(pointsResource))}})};const checked=validateProject(p);if(checked.errors.length)throw new Error(checked.errors.join('\n'));return p}
 /** Retain only the validated active graph until its first hydration, then release the worker reference. */
 validateTab(tab:StoredTab){if(tab.kind==='graph'){const project=this.graph(tab.id);if(tab.id===this.manifest.activeId)this.preparedActive={id:tab.id,project}}else this.origin(tab.id)}
 origin(id:string):{model:OriginModel;view:OriginViewState;resources:Map<string,Uint8Array>}{const cached=this.origins.get(id);if(cached)return cached;const tab=this.manifest.tabs.find(t=>t.id===id);if(tab?.kind!=='origin')throw new Error('WORKSPACE_TAB_KIND');const model=validateOriginModel(parse(this.resource(tab.model))),view=validateOriginView(tab.view,model);if(!Array.isArray(tab.resources)||tab.resources.length!==model.resources.length)throw new Error('WORKSPACE_INVALID_ORIGIN');const resources=new Map<string,Uint8Array>();for(const r of tab.resources){if(!r||resources.has(r.id))throw new Error('WORKSPACE_INVALID_ORIGIN');const expected=model.resources.find(e=>e.id===r.id),bytes=this.resource(r.hash);if(!expected||r.hash!==expected.sha256||bytes.length!==expected.size)throw new Error('WORKSPACE_INVALID_ORIGIN');resources.set(r.id,bytes)}
  // Validate every column's tags and offsets without retaining a second cell array.
  for(const c of model.columns)for(let at=0;at<c.rowCount;at+=1000)readOriginCells(c,resources,at,Math.min(1000,c.rowCount-at));const result={model,view,resources};this.origins.set(id,result);return result;}
}
export async function writeWorkspace(input:WorkspaceInput):Promise<Uint8Array>{
 if(!uuid.test(input.id)||input.tabs.length>100)throw new Error('WORKSPACE_TAB_LIMIT');const resources=new Map<string,Uint8Array>(),tabs:StoredTab[]=[];let total=0;
 const add=async(bytes:Uint8Array,knownHash?:string)=>{if(bytes.length>workspaceZipPolicy.maximumEntryBytes)throw new Error('WORKSPACE_RESOURCE_LIMIT');const h=knownHash??await resourceHash(bytes);if(!resources.has(h)){total+=bytes.length;if(total>WORKSPACE_LIMIT)throw new Error('WORKSPACE_ARCHIVE_LIMIT');resources.set(h,bytes)}return h};
 for(const entry of input.tabs){if('packet'in entry){const packet=entry.packet;for(const [h,b]of packet.resources){if(h!==await add(b))throw new Error('WORKSPACE_RESOURCE_HASH')}tabs.push(packet.tab)}else if('project'in entry){const p=stripRecovery(entry.project),checked=validateProject(p);if(checked.errors.length)throw new Error(checked.errors.join('\n'));const datasets=[];for(const d of p.datasets){const {points,...metadata}=d;let cached=pointBuffers.get(points);if(!cached){const bytes=encodePointBuffer(points);cached={bytes,hash:await resourceHash(bytes)};pointBuffers.set(points,cached)}datasets.push({...metadata,pointsResource:await add(cached.bytes,cached.hash)})}tabs.push({id:entry.id,label:entry.label,kind:'graph',document:await add(json({...p,datasets}))})}else{const o=entry.origin,model=validateOriginModel(o.model);validateOriginView(o.view,model);const refs=[];for(const r of model.resources){const bytes=o.resources.get(r.id);if(!bytes||bytes.length!==r.size||await add(bytes)!==r.sha256)throw new Error('WORKSPACE_RESOURCE_HASH');refs.push({id:r.id,hash:r.sha256})}tabs.push({id:entry.id,label:entry.label,kind:'origin',model:await add(json(model)),view:o.view,resources:refs})}}
 const manifest:WorkspaceManifest={format:'APIO_GRAPH_WORKSPACE',version:1,required:['graph-1.1','points-1','origin-oim-1',...(tabs.some(t=>t.kind==='graph'&&(parse(resources.get(t.document)) as GraphMetadata).schemaVersion.startsWith('1.2.'))?['graph-1.2']:[]),...(tabs.some(t=>t.kind==='graph'&&(parse(resources.get(t.document)) as GraphMetadata).schemaVersion.startsWith('1.3.'))?['graph-1.3']:[]),...(tabs.some(t=>t.kind==='graph'&&(parse(resources.get(t.document)) as GraphMetadata).datasets.some(d=>resources.get(d.pointsResource)?.[7]===50))?['points-2']:[])],id:input.id,activeId:input.activeId,tabs,resources:[...resources].map(([hash,bytes])=>({hash,size:bytes.length}))};validateManifest(manifest);
 const entries=new Map([['manifest.json',json(manifest)],...[...resources].map(([h,b])=>[`resources/${h}.bin`,b] as [string,Uint8Array])]);return writeStoredZip(entries,workspaceZipPolicy);
}
export function workspaceKind(bytes:Uint8Array):boolean{
 if(bytes.length<30)return false;const v=new DataView(bytes.buffer,bytes.byteOffset,bytes.length);if(v.getUint32(0,true)!==0x04034b50)return false;const n=v.getUint16(26,true),size=v.getUint32(18,true);if(n!==13||size>16*1024*1024||30+n+size>bytes.length||decoder.decode(bytes.subarray(30,30+n))!=='manifest.json')return false;try{return (parse(bytes.subarray(43,43+size)) as {format?:string}).format==='APIO_GRAPH_WORKSPACE'}catch{return false}
}
function validateManifest(value:unknown):WorkspaceManifest{
 const m=value as WorkspaceManifest;if(!m||typeof m!=='object')throw new Error('WORKSPACE_INVALID_MANIFEST');keys(m,['format','version','required','id','activeId','tabs','resources']);
 if(m.format!=='APIO_GRAPH_WORKSPACE'||m.version!==1||!Array.isArray(m.required)||m.required.length>8||m.required.some(v=>!['graph-1.1','graph-1.2','graph-1.3','points-1','points-2','origin-oim-1'].includes(v)))throw new Error('WORKSPACE_NEWER_READER');
 if(!uuid.test(m.id)||!Array.isArray(m.tabs)||m.tabs.length>100||!Array.isArray(m.resources)||m.resources.length>59999)throw new Error('WORKSPACE_INVALID_MANIFEST');const ids=new Set<string>(),hashes=new Set<string>();
 for(const t of m.tabs){if(!t||typeof t!=='object'||!uuid.test(t.id)||ids.has(t.id)||!validLabel(t.label))throw new Error('WORKSPACE_INVALID_MANIFEST');ids.add(t.id);if(t.kind==='graph'){keys(t,['id','label','kind','document']);if(!hash.test(t.document))throw new Error('WORKSPACE_INVALID_MANIFEST')}else if(t.kind==='origin'){keys(t,['id','label','kind','model','view','resources']);if(!hash.test(t.model)||!Array.isArray(t.resources)||t.resources.length>50000)throw new Error('WORKSPACE_INVALID_MANIFEST');for(const r of t.resources){keys(r,['id','hash']);if(typeof r.id!=='string'||!hash.test(r.hash))throw new Error('WORKSPACE_INVALID_MANIFEST')}}else throw new Error('WORKSPACE_INVALID_MANIFEST')}
 if(m.tabs.length?!ids.has(m.activeId??''):m.activeId!==null)throw new Error('WORKSPACE_INVALID_MANIFEST');for(const r of m.resources){if(!r||typeof r!=='object')throw new Error('WORKSPACE_INVALID_MANIFEST');keys(r,['hash','size']);if(!hash.test(r.hash)||hashes.has(r.hash)||!Number.isSafeInteger(r.size)||r.size<0||r.size>workspaceZipPolicy.maximumEntryBytes)throw new Error('WORKSPACE_INVALID_MANIFEST');hashes.add(r.hash)}return m;
}
export async function readWorkspace(bytes:Uint8Array):Promise<WorkspaceArchive>{
 if(!workspaceKind(bytes))throw new Error('WORKSPACE_INVALID_ARCHIVE');const entries=readStoredZip(bytes,workspaceZipPolicy),manifest=validateManifest(parse(entries.get('manifest.json'))),resources=new Map<string,Uint8Array>();if(entries.size!==manifest.resources.length+1)throw new Error('WORKSPACE_UNLISTED_RESOURCE');
 for(const r of manifest.resources){const b=entries.get(`resources/${r.hash}.bin`);if(!b||b.length!==r.size||await resourceHash(b)!==r.hash)throw new Error('WORKSPACE_RESOURCE_HASH');resources.set(r.hash,b)}const archive=new WorkspaceArchive(manifest,resources),referenced=new Set<string>();
 for(const tab of manifest.tabs){archive.validateTab(tab);for(const h of archive.packet(tab.id).resources.keys())referenced.add(h)}if(referenced.size!==resources.size)throw new Error('WORKSPACE_UNLISTED_RESOURCE');return archive;
}
