import {serialize} from '../domain/project';
import {unpackSnapshot,type SerializationRequest,type SerializationResponse} from './serializationCache';
const resources=new Map<number,unknown>();
const scope=self as unknown as {onmessage:((e:MessageEvent<SerializationRequest>)=>void)|null;postMessage:(result:SerializationResponse,transfer?:Transferable[])=>void};
scope.onmessage=({data})=>{
 const keep=new Set(data.type==='retain'?data.keep:data.packet.keep);
 try{
  if(data.type==='retain'){scope.postMessage({id:data.id});return}
  for(const resource of data.packet.resources)resources.set(resource.id,resource.value);
  const text=serialize(unpackSnapshot(data.packet.root,resources),data.pretty);
  if(data.binary){const bytes=new TextEncoder().encode(text);scope.postMessage({id:data.id,bytes:bytes.buffer},[bytes.buffer])}else scope.postMessage({id:data.id,text});
 }catch(error){scope.postMessage({id:data.id,error:String(error)})}
 finally{for(const id of resources.keys())if(!keep.has(id))resources.delete(id)}
};
