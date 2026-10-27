import type {ProjectDocument} from '../../domain/model';
import {SnapshotCache} from '../../platform/serializationCache';
import type {OriginModel,OriginViewState} from '../origin/model';
import type {OriginCell} from '../origin/resources';
import type {TabPacket,WorkspaceInput,WorkspaceManifest} from './archive';
export class WorkspaceReader {
 private worker=new Worker(new URL('./workspace.worker.ts',import.meta.url),{type:'module'});private sequence=0;private pending=new Map<number,{resolve:(v:unknown)=>void;reject:(e:Error)=>void}>();private closed=false;
 constructor(){this.worker.onmessage=({data})=>{const p=this.pending.get(data.id);if(!p)return;this.pending.delete(data.id);if(data.error)p.reject(new Error(data.error));else p.resolve(data.result)};this.worker.onerror=()=>this.close()}
 call<T>(kind:string,payload:Record<string,unknown>,signal?:AbortSignal,transfer:Transferable[]=[]):Promise<T>{signal?.throwIfAborted();if(this.closed)return Promise.reject(new Error('WORKSPACE_CLOSED'));return new Promise((resolve,reject)=>{const id=++this.sequence,cancel=()=>this.close(),cleanup=()=>signal?.removeEventListener('abort',cancel);signal?.addEventListener('abort',cancel,{once:true});this.pending.set(id,{resolve:v=>{cleanup();resolve(v as T)},reject:e=>{cleanup();reject(e)}});this.worker.postMessage({id,kind,payload},transfer)})}
 open(bytes:Uint8Array,signal?:AbortSignal){const owned=bytes.buffer instanceof ArrayBuffer&&bytes.byteOffset===0&&bytes.byteLength===bytes.buffer.byteLength?bytes:bytes.slice();return this.call<WorkspaceManifest>('open',{bytes:owned},signal,[owned.buffer as ArrayBuffer])}
 graph(tabId:string){return this.call<ProjectDocument>('graph',{tabId})}
 packet(tabId:string){return this.call<TabPacket>('packet',{tabId})}
 origin(tabId:string){return this.call<{model:OriginModel;view:OriginViewState}>('origin',{tabId})}
 cells(tabId:string,nodeId:string,start:number,count:number){return this.call<OriginCell[]>('cells',{tabId,nodeId,start,count})}
 resource(tabId:string,resourceId:string,offset:number,count:number){return this.call<Uint8Array>('resource',{tabId,resourceId,offset,count})}
 close(){this.closed=true;this.worker.terminate();for(const p of this.pending.values())p.reject(new Error('WORKSPACE_CANCELLED'));this.pending.clear()}
}
let writer:WorkspaceReader|undefined,queue:Promise<unknown>=Promise.resolve();const caches=new Map<string,SnapshotCache>();
/** Immutable point arrays cross the worker boundary once per revision, not once per style/save. */
export function serializeWorkspace(input:WorkspaceInput,signal?:AbortSignal):Promise<Uint8Array>{
 const run=async()=>{signal?.throwIfAborted();writer??=new WorkspaceReader();const packets=new Map<string,ReturnType<SnapshotCache['pack']>>(),alive=new Set<string>();const tabs=input.tabs.map(tab=>{if(!('project'in tab))return tab;alive.add(tab.id);const cache=caches.get(tab.id)??new SnapshotCache();caches.set(tab.id,cache);const packed=cache.pack(tab.project);packets.set(tab.id,packed);return {id:tab.id,label:tab.label,packed}});for(const id of caches.keys())if(!alive.has(id))caches.delete(id);
  try{const bytes=await writer.call<Uint8Array>('save',{input:{...input,tabs}},signal);for(const [id,p]of packets)caches.get(id)!.acknowledge(p.keep);return bytes}catch(error){writer.close();writer=undefined;caches.clear();throw error}};
 const next=queue.catch(()=>{}).then(run);queue=next;return next;
}
if(import.meta.hot)import.meta.hot.dispose(()=>{writer?.close();caches.clear()});
