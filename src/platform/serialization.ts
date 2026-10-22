import type {ProjectDocument} from '../domain/model';
import {serialize} from '../domain/project';
import {SnapshotCache,type SerializationResponse,type SerializationRequest} from './serializationCache';

const cache=new SnapshotCache();let worker:Worker|null=null,generation=0,queue:Promise<unknown>=Promise.resolve(),rejectActive:((reason:unknown)=>void)|null=null,disposed=false;
function enqueue<T>(work:()=>Promise<T>):Promise<T>{const next=queue.catch(()=>{}).then(work);queue=next;return next}
function stop(error=new Error('SERIALIZATION_STOPPED')){worker?.terminate();worker=null;cache.reset();rejectActive?.(error);rejectActive=null}
function dispose(){disposed=true;stop()}
const hide=()=>{disposed=true;stop()},show=()=>{disposed=false};
if(typeof window!=='undefined'){window.addEventListener?.('pagehide',hide);window.addEventListener?.('pageshow',show)}
if(import.meta.hot)import.meta.hot.dispose(()=>{window.removeEventListener('pagehide',hide);window.removeEventListener('pageshow',show);dispose()});
function send(request:SerializationRequest):Promise<SerializationResponse>{
 return new Promise((resolve,reject)=>{
  if(disposed){reject(new Error('SERIALIZATION_STOPPED'));return}
  worker??=new Worker(new URL('./serialize.worker.ts',import.meta.url),{type:'module'});rejectActive=reject;
  worker.onmessage=(event:MessageEvent<SerializationResponse>)=>{if(event.data.id!==request.id)return;rejectActive=null;if(event.data.error){cache.reset();reject(new Error(event.data.error))}else resolve(event.data)};
  worker.onerror=event=>{const error=new Error(event.message||'SERIALIZATION_FAILED');stop(error)};
  try{worker.postMessage(request)}catch(error){stop(error instanceof Error?error:new Error(String(error)))}
 });
}
async function run(project:ProjectDocument,pretty:boolean,binary:boolean):Promise<SerializationResponse>{
 if(typeof Worker==='undefined'){const text=serialize(project,pretty);return binary?{id:0,bytes:new TextEncoder().encode(text).buffer}:{id:0,text}}
 return enqueue(async()=>{const packet=cache.pack(project),result=await send({id:++generation,type:'serialize',packet,pretty,binary});cache.acknowledge(packet.keep);return result});
}
/** Stable source arrays stay in one Worker. Native output transfers UTF-8 buffers. */
export async function serializeAsync(project:ProjectDocument,pretty=false):Promise<string>{const result=await run(project,pretty,false);if(typeof result.text!=='string')throw new Error('SERIALIZATION_FAILED');return result.text}
export async function serializeBytesAsync(project:ProjectDocument,pretty=false):Promise<Uint8Array>{const result=await run(project,pretty,true);if(!result.bytes)throw new Error('SERIALIZATION_FAILED');return new Uint8Array(result.bytes)}
export async function retainSerializationCache(project:ProjectDocument):Promise<void>{
 await enqueue(async()=>{if(!worker)return;const packet=cache.pack(project);await send({id:++generation,type:'retain',keep:packet.keep});cache.acknowledge(packet.keep.filter(id=>!packet.resources.some(r=>r.id===id)))});
}
