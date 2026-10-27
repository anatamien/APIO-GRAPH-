import {readWorkspace,writeWorkspace,type WorkspaceArchive,type WorkspaceInput,type SaveTab} from './archive';
import {unpackSnapshot,type PackedSnapshot} from '../../platform/serializationCache';
import {readOriginCells} from '../origin/resources';
let archive:WorkspaceArchive|null=null;
const cached=new Map<string,Map<number,unknown>>();
const scope=self as unknown as {onmessage:((e:MessageEvent<{id:number;kind:string;payload:Record<string,unknown>}>)=>void)|null;postMessage:(message:unknown,transfer?:Transferable[])=>void};
scope.onmessage=async(e)=>{const {id,kind,payload:p}=e.data;try{
 let result:unknown;const transfer:Transferable[]=[];
 if(kind==='open'){archive=await readWorkspace(p.bytes as Uint8Array);result=archive.manifest}
 else if(kind==='graph')result=archive!.graph(p.tabId as string);
 else if(kind==='packet')result=archive!.packet(p.tabId as string);
 else if(kind==='origin'){const {model,view}=archive!.origin(p.tabId as string);result={model,view}}
 else if(kind==='resource'){const o=archive!.origin(p.tabId as string),b=o.resources.get(p.resourceId as string);if(!b)throw new Error('WORKSPACE_RESOURCE_MISSING');result=b.slice(p.offset as number,(p.offset as number)+(p.count as number));transfer.push((result as Uint8Array).buffer)}
 else if(kind==='cells'){const o=archive!.origin(p.tabId as string),c=o.model.columns.find(c=>c.nodeId===p.nodeId);if(!c)throw new Error('ORIGIN_COLUMN_MISSING');result=readOriginCells(c,o.resources,p.start as number,p.count as number)}
 else if(kind==='save'){
  const input=p.input as WorkspaceInput,tabs=[];const alive=new Set<string>();
  for(const raw of input.tabs){if('packed'in raw){const entry=raw as unknown as {id:string;label:string;packed:PackedSnapshot};alive.add(entry.id);const values=cached.get(entry.id)??new Map<number,unknown>();cached.set(entry.id,values);for(const r of entry.packed.resources)values.set(r.id,r.value);tabs.push({id:entry.id,label:entry.label,project:unpackSnapshot(entry.packed.root,values)});const keep=new Set(entry.packed.keep);for(const k of values.keys())if(!keep.has(k))values.delete(k)}else tabs.push(raw)}
  for(const key of cached.keys())if(!alive.has(key))cached.delete(key);const bytes=await writeWorkspace({...input,tabs:tabs as SaveTab[]});result=bytes;transfer.push(bytes.buffer);
 }else throw new Error('WORKSPACE_REQUEST');scope.postMessage({id,result},transfer);
}catch(error){scope.postMessage({id,error:String(error)})}};
