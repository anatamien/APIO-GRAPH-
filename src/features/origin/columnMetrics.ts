import type {OriginColumn} from './model';
import type {OriginTabState} from './history';
import {originResourceSlice} from './platform';
const cached=new WeakMap<OriginTabState,Map<string,string>>();
/** Full-column measurement uses bounded binary blocks; no full cell array crosses IPC. */
export async function numericColumnMetrics(origin:OriginTabState,columns:OriginColumn[],signal:AbortSignal,onResult:(id:string,longest:string)=>void){
 const cache=cached.get(origin)??new Map<string,string>();cached.set(origin,cache);const worker=new Worker(new URL('./columnMetrics.worker.ts',import.meta.url),{type:'module'});let sequence=0,closed=false;const pending=new Map<number,{resolve:(s:string)=>void;reject:(e:Error)=>void}>();
 const close=()=>{closed=true;worker.terminate();for(const p of pending.values())p.reject(new Error('ORIGIN_CANCELLED'));pending.clear()};signal.addEventListener('abort',close,{once:true});worker.onmessage=({data})=>{pending.get(data.id)?.resolve(data.longest);pending.delete(data.id)};worker.onerror=close;
 try{for(const column of columns){signal.throwIfAborted();const key=column.values+':'+column.tags+':'+column.rowCount,existing=cache.get(key);if(existing!==undefined){onResult(column.nodeId,existing);continue}let longest='';for(let at=0;at<column.rowCount;at+=65536){signal.throwIfAborted();const count=Math.min(65536,column.rowCount-at),[values,tags]=await Promise.all([originResourceSlice(origin,column.values,at*8,count*8),originResourceSlice(origin,column.tags,at,count)]);signal.throwIfAborted();if(closed)throw new Error('ORIGIN_CANCELLED');const value=await new Promise<string>((resolve,reject)=>{const id=++sequence;pending.set(id,{resolve,reject});worker.postMessage({id,values:values.buffer,tags:tags.buffer},[values.buffer,tags.buffer])});if(value.length>longest.length){longest=value;onResult(column.nodeId,longest)}}cache.set(key,longest);onResult(column.nodeId,longest)}}finally{signal.removeEventListener('abort',close);close()}
}
