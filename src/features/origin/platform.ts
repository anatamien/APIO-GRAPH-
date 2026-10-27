import {identifyAttachment} from './attachmentType';
import {isDesktop,saveProject,savePassiveBytes,type OpenedFile} from '../../platform/files';
import {detectOrigin} from './detector';
import {validateOriginModel,type OriginModel,type OriginViewState} from './model';
import {OriginViewHistory,initialOriginView,type OriginTabState} from './history';
import {originHash,readOriginArchive,writeOriginArchive,validateOriginView} from './archive';
import {readOriginCells,type OriginCell} from './resources';
interface NativeRef {sessionId:string;model:OriginModel;view?:OriginViewState|null}
interface BrowserSession {model:OriginModel;resources:Map<string,Uint8Array>}
interface LinkedSession {resource:(id:string,offset:number,count:number)=>Promise<Uint8Array>;cells:(nodeId:string,start:number,count:number)=>Promise<OriginCell[]>;release:()=>void}
const linked=new Map<string,LinkedSession>();
export function registerWorkspaceOrigin(model:OriginModel,view:OriginViewState,provider:LinkedSession):OriginTabState{const sessionId=crypto.randomUUID();linked.set(sessionId,provider);return originTab({sessionId,model,view},false)}
const browser=new Map<string,BrowserSession>();
async function invoke<T>(command:string,args:Record<string,unknown>):Promise<T>{try{const m=await import('@tauri-apps/api/core');return await m.invoke<T>(command,args)}catch(e){throw new Error(String(e))}}
export function originTab(ref:NativeRef,dirty:boolean):OriginTabState{const model=validateOriginModel(ref.model);return {sessionId:ref.sessionId,model,history:new OriginViewHistory(ref.view?validateOriginView(ref.view,model):initialOriginView(model),dirty)}}
export async function openOrigin(file:OpenedFile,signal:AbortSignal,archiveOnly=false):Promise<OriginTabState>{
 signal.throwIfAborted();
 if(isDesktop()){const requestId=crypto.randomUUID(),cancel=()=>{void invoke('origin_cancel',{requestId}).catch(()=>{})};signal.addEventListener('abort',cancel,{once:true});try{const ref=await invoke<NativeRef>('origin_open',{path:file.path,requestId,archiveOnly});try{signal.throwIfAborted();return originTab(ref,!file.name.toLowerCase().endsWith('.aph'))}catch(error){await releaseOriginReference(ref.sessionId);throw error}}finally{signal.removeEventListener('abort',cancel)}}
 let session:BrowserSession,view:OriginViewState|undefined;
 if(file.bytes[0]===80&&file.bytes[1]===75){const result=await readOriginArchive(file.bytes);session=result;view=result.view}
 else {let detected:ReturnType<typeof detectOrigin>;try{detected=detectOrigin(file.bytes)}catch(error){if(!archiveOnly)throw error;detected={family:'unknown',header:'',build:null,version:null,canDecode:false,reason:'UNKNOWN_SIGNATURE'}}const sha=await originHash(file.bytes),reason=archiveOnly?'USER_ARCHIVE_ONLY':'SANDBOX_UNAVAILABLE_ON_OS';const model:OriginModel={format:'APIO_ORIGIN_DOCUMENT',schemaVersion:1,source:{name:file.name,size:file.bytes.length,sha256:sha,detected},decoder:{name:'archive-only',version:'1',revision:'oim-1'},nodes:[{id:'source',parentId:null,kind:'opaque',nameHex:Array.from(new TextEncoder().encode(file.name),b=>b.toString(16).padStart(2,'0')).join(''),sourceId:null,properties:{nameEncoding:'utf-8'},provenance:[{offset:0,length:file.bytes.length}],capabilities:{recognized:false,extracted:false,rendered:false,editable:false,recalculable:false,archived:true,unsupportedReason:reason}}],columns:[],resources:[{id:'original',kind:'original',size:file.bytes.length,sha256:sha}],relations:[],diagnostics:[{code:'ARCHIVE_ONLY',severity:'warning',nodeId:null,offset:null},{code:reason,severity:'warning',nodeId:null,offset:null}],coverage:{inventory:'partial',visualEquivalence:'unverified',opaqueRanges:[{offset:0,length:file.bytes.length}]},sourceResourceId:'original'};session={model,resources:new Map([['original',file.bytes]])}}
 signal.throwIfAborted();if(browser.size>=16)throw new Error('ORIGIN_SESSION_LIMIT');const sessionId=crypto.randomUUID();browser.set(sessionId,session);return originTab({sessionId,model:session.model,view},!file.name.toLowerCase().endsWith('.aph'));
}
export async function saveOrigin(origin:OriginTabState,path:string|null,saveAs:boolean):Promise<string|null>{
 if(isDesktop())return invoke('origin_save',{sessionId:origin.sessionId,view:origin.history.current,path,saveAs});
 const session=browser.get(origin.sessionId);if(!session)throw new Error('ORIGIN_SESSION_EXPIRED');return saveProject(await writeOriginArchive(origin.model,session.resources,origin.history.current),path??origin.model.source.name.replace(/\.(opj|opju|org)$/i,'')+'.aph',saveAs);
}
export async function releaseOriginReference(sessionId:string):Promise<void>{const provider=linked.get(sessionId);if(provider){linked.delete(sessionId);provider.release();return}if(isDesktop())await invoke('origin_release',{sessionId});else browser.delete(sessionId)}
export async function releaseOrigin(origin:OriginTabState):Promise<void>{await releaseOriginReference(origin.sessionId)}
export async function originCells(origin:OriginTabState,nodeId:string,start:number,count:number):Promise<OriginCell[]>{
 const provider=linked.get(origin.sessionId);if(provider)return provider.cells(nodeId,start,count);
 if(isDesktop())return invoke('origin_cells',{sessionId:origin.sessionId,nodeId,start,count});
 const session=browser.get(origin.sessionId),column=origin.model.columns.find(c=>c.nodeId===nodeId);if(!session||!column)throw new Error('ORIGIN_COLUMN_MISSING');return readOriginCells(column,session.resources,start,count);
}
/** Immutable binary chunks avoid JSON number arrays and their memory amplification. */
export async function originResource(origin:OriginTabState,id:string,signal?:AbortSignal):Promise<Uint8Array>{
 const resource=origin.model.resources.find(r=>r.id===id);if(!resource)throw new Error('ORIGIN_INVALID_RESOURCE');signal?.throwIfAborted();
 const provider=linked.get(origin.sessionId);if(provider){const bytes=new Uint8Array(resource.size);for(let at=0;at<bytes.length;at+=1024*1024){signal?.throwIfAborted();const n=Math.min(1024*1024,bytes.length-at);bytes.set(await provider.resource(id,at,n),at)}return bytes}
 if(!isDesktop()){const b=browser.get(origin.sessionId)?.resources.get(id);if(!b)throw new Error('ORIGIN_SESSION_EXPIRED');return b.slice()}
 const bytes=new Uint8Array(resource.size);for(let offset=0;offset<bytes.length;offset+=1024*1024){signal?.throwIfAborted();const count=Math.min(1024*1024,bytes.length-offset),part=await invoke<ArrayBuffer>('origin_resource',{sessionId:origin.sessionId,resourceId:id,offset,count});const chunk=new Uint8Array(part);if(chunk.byteLength!==count)throw new Error('ORIGIN_INVALID_RESOURCE');bytes.set(chunk,offset)}return bytes;
}
export async function originResourceSlice(origin:OriginTabState,id:string,offset:number,count:number):Promise<Uint8Array>{
 const resource=origin.model.resources.find(r=>r.id===id);if(!resource||!Number.isSafeInteger(offset)||!Number.isSafeInteger(count)||offset<0||count<0||count>1024*1024||offset>resource.size||count>resource.size-offset)throw new Error('ORIGIN_INVALID_RANGE');
 const provider=linked.get(origin.sessionId);if(provider)return provider.resource(id,offset,count);
 if(!isDesktop()){const bytes=browser.get(origin.sessionId)?.resources.get(id);if(!bytes)throw new Error('ORIGIN_SESSION_EXPIRED');return bytes.slice(offset,offset+count)}
 return new Uint8Array(await invoke<ArrayBuffer>('origin_resource',{sessionId:origin.sessionId,resourceId:id,offset,count}));
}
export async function exportOriginAttachment(origin:OriginTabState,nodeId:string):Promise<void>{
 const node=origin.model.nodes.find(n=>n.id===nodeId&&n.kind==='attachment');if(!node||typeof node.properties.resourceId!=='string')throw new Error('ORIGIN_ATTACHMENT_MISSING');
 const bytes=await originResource(origin,node.properties.resourceId),type=identifyAttachment(bytes.subarray(0,65536)),extensions:Record<string,Parameters<typeof savePassiveBytes>[1]>={'image/png':'png','image/jpeg':'jpg','image/gif':'gif','image/bmp':'bmp','application/pdf':'pdf','text/plain':'txt'},extension=extensions[type?.mime??'']??'bin';await savePassiveBytes(bytes,extension,'Origin-attachment');
}
export interface MixedRecoveryTab {path:string|null;dirty:boolean;readOnly:boolean;graphText?:string;origin?:NativeRef}
export interface MixedRecovery {activeIndex:number;tabs:MixedRecoveryTab[]}
export async function writeOriginRecovery(snapshot:{activeIndex:number;tabs:{path:string|null;dirty:boolean;readOnly:boolean;graphText?:string;sessionId?:string;view?:OriginViewState}[]}):Promise<void>{
 if(isDesktop()){await invoke('origin_recovery_write',{snapshot});return}
 const tabs=[];for(const tab of snapshot.tabs){if(tab.sessionId){const session=browser.get(tab.sessionId);if(!session||!tab.view)throw new Error('ORIGIN_SESSION_EXPIRED');tabs.push({...tab,bytes:await writeOriginArchive(session.model,session.resources,{...tab.view,includeSource:true})})}else tabs.push(tab)}
 await browserRecovery('write',{activeIndex:snapshot.activeIndex,tabs});
}
export async function readOriginRecovery():Promise<MixedRecovery|null>{
 if(isDesktop())return invoke('origin_recovery_read',{});
 const snapshot=await browserRecovery('read') as {activeIndex:number;tabs:({bytes?:Uint8Array;view?:OriginViewState}&MixedRecoveryTab)[]}|null;if(!snapshot)return null;
 const tabs:MixedRecoveryTab[]=[],pending=new Map<string,BrowserSession>();
 if(!Array.isArray(snapshot.tabs)||snapshot.tabs.length>16||!Number.isInteger(snapshot.activeIndex)||snapshot.activeIndex<0||snapshot.activeIndex>=snapshot.tabs.length)throw new Error('RECOVERY_INVALID');
 for(const tab of snapshot.tabs){if(tab.bytes){const session=await readOriginArchive(tab.bytes),sessionId=crypto.randomUUID();pending.set(sessionId,session);tabs.push({...tab,origin:{sessionId,model:session.model,view:tab.view?validateOriginView(tab.view,session.model):session.view}})}else tabs.push(tab)}
 if(browser.size+pending.size>16)throw new Error('ORIGIN_SESSION_LIMIT');for(const [id,session]of pending)browser.set(id,session);
 return {activeIndex:snapshot.activeIndex,tabs};
}
export async function clearOriginRecovery():Promise<void>{if(isDesktop())await invoke('origin_recovery_clear',{});else await browserRecovery('clear')}
async function browserRecovery(action:'read'|'write'|'clear',value?:unknown):Promise<unknown>{
 if(typeof indexedDB==='undefined'){if(action==='write')throw new Error('RECOVERY_UNAVAILABLE');return null}
 return new Promise((resolve,reject)=>{const request=indexedDB.open('apio-origin-recovery',1);request.onupgradeneeded=()=>request.result.createObjectStore('workspace');request.onerror=()=>reject(request.error);request.onsuccess=()=>{const db=request.result,tx=db.transaction('workspace',action==='read'?'readonly':'readwrite'),store=tx.objectStore('workspace');let result:unknown=null;if(action==='write')store.put(value,'current');else if(action==='clear')store.delete('current');else{const get=store.get('current');get.onsuccess=()=>{result=get.result??null}}tx.oncomplete=()=>{db.close();resolve(result)};tx.onabort=()=>{db.close();reject(tx.error)}}});
}

export async function extractOriginalOrigin(origin:OriginTabState){const id=origin.model.sourceResourceId;if(!id)throw new Error('ORIGIN_SOURCE_MISSING');const extension=origin.model.source.name.match(/\.(opj|opju|org)$/i)?.[1].toLowerCase() as 'opj'|'opju'|'org'|undefined;await savePassiveBytes(await originResource(origin,id),extension??'bin',origin.model.source.name)}
