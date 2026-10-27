import type {OriginTabState} from './history';
import {originResource} from './platform';
import {resolvePage,type XYLink} from './resolve';
import type {ConvertRequest,OriginConversion} from './convert';
export class OriginWorkerClient {
 private worker:Worker;private sequence=0;private loaded=new Set<string>();private loading=new Map<string,Promise<void>>();private loadedBytes=0;private pending=new Map<number,{resolve:(value:unknown)=>void;reject:(error:Error)=>void}>();private controller=new AbortController();private initialized:Promise<unknown>;private cache=new Map<string,Promise<OriginConversion>>();
 constructor(private origin:OriginTabState){this.worker=new Worker(new URL('./origin.worker.ts',import.meta.url),{type:'module'});this.worker.onmessage=e=>{const pending=this.pending.get(e.data.id);if(!pending)return;this.pending.delete(e.data.id);if(e.data.error)pending.reject(new Error(e.data.error));else pending.resolve(e.data.result)};this.worker.onerror=()=>this.close();this.initialized=this.call('init',{model:origin.model});void this.initialized.catch(()=>{})}
 private call<T>(kind:string,payload:unknown,transfer:Transferable[]=[]):Promise<T>{if(this.controller.signal.aborted)return Promise.reject(new Error('ORIGIN_CANCELLED'));return new Promise((resolve,reject)=>{const id=++this.sequence;this.pending.set(id,{resolve:resolve as (value:unknown)=>void,reject});this.worker.postMessage({id,kind,payload},transfer)})}
 private async resource(id:string){
  if(this.loaded.has(id))return;
  const existing=this.loading.get(id);if(existing)return existing;
  const size=this.origin.model.resources.find(r=>r.id===id)?.size??0;
  if(this.loadedBytes+size>200*1024*1024)throw new Error('ORIGIN_WORKING_MEMORY_LIMIT');
  this.loadedBytes+=size;
  const pending=(async()=>{try{const bytes=await originResource(this.origin,id,this.controller.signal);await this.call('resource',{id,bytes:bytes.buffer},[bytes.buffer]);this.loaded.add(id)}catch(error){this.loadedBytes-=size;throw error}finally{this.loading.delete(id)}})();
  this.loading.set(id,pending);return pending;
 }
 private async columns(ids:string[]){await this.initialized;const selected=new Set(ids);for(const column of this.origin.model.columns.filter(c=>selected.has(c.nodeId)))for(const id of [column.values,column.tags,column.textOffsets,column.textBytes])if(id)await this.resource(id)}
 convert(request:ConvertRequest):Promise<OriginConversion>{const key=JSON.stringify(request);const existing=this.cache.get(key);if(existing)return existing;const promise=(async()=>{const links=request.links??resolvePage(this.origin.model,request.nodeId).links;await this.columns(links.flatMap(l=>[l.x,l.y]).filter((id):id is string=>!!id));return this.call<OriginConversion>('convert',request)})();this.cache.set(key,promise);while(this.cache.size>2)this.cache.delete(this.cache.keys().next().value!);promise.catch(()=>this.cache.delete(key));return promise}
 async tsv(columnIds:string[],start:number,end:number,encoding:string):Promise<string>{await this.columns(columnIds);return this.call('tsv',{columnIds,start,end,encoding})}
 close(){if(this.controller.signal.aborted)return;this.controller.abort();this.worker.terminate();for(const p of this.pending.values())p.reject(new Error('ORIGIN_CANCELLED'));this.pending.clear();this.cache.clear()}
}
export type {XYLink};
