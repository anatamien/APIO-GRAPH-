import type {Point} from '../../domain/model';

const signature=new Uint8Array([65,80,73,79,80,84,83,49]),headerSize=16,recordSize=52,maxPoints=1000000;
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const textDecoder=new TextDecoder('utf-8',{fatal:true});
export function encodePointBuffer(points:readonly Point[]):Uint8Array{
 if(points.length>maxPoints)throw new Error('WORKSPACE_POINT_LIMIT');
 const bytes=new Uint8Array(headerSize+points.length*recordSize),view=new DataView(bytes.buffer);bytes.set(signature);view.setUint32(8,points.length,true);view.setUint32(12,0x01020304,true);
 for(let i=0;i<points.length;i++){const p=points[i],at=headerSize+i*recordSize;if(!uuid.test(p.id)||!Number.isFinite(p.x)||!Number.isFinite(p.y))throw new Error('WORKSPACE_INVALID_POINTS');for(let j=0;j<36;j++)bytes[at+j]=p.id.charCodeAt(j);view.setFloat64(at+36,p.x,true);view.setFloat64(at+44,p.y,true)}return bytes;
}
export function pointBufferCount(bytes:Uint8Array):number{
 if(bytes.length<headerSize||signature.some((b,i)=>bytes[i]!==b))throw new Error('WORKSPACE_INVALID_POINTS');const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength),count=view.getUint32(8,true);
 if(count>maxPoints||view.getUint32(12,true)!==0x01020304||bytes.length!==headerSize+count*recordSize)throw new Error('WORKSPACE_INVALID_POINTS');return count;
}
/** Returned objects have the original IDs and numbers; no display sampling or numeric text round-trip. */
export function decodePointBuffer(bytes:Uint8Array):Point[]{
 const count=pointBufferCount(bytes),view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength),points:Point[]=new Array(count);
 for(let i=0;i<count;i++){const at=headerSize+i*recordSize,id=textDecoder.decode(bytes.subarray(at,at+36)),x=view.getFloat64(at+36,true),y=view.getFloat64(at+44,true);if(!uuid.test(id)||!Number.isFinite(x)||!Number.isFinite(y))throw new Error('WORKSPACE_INVALID_POINTS');points[i]={id,x,y}}return points;
}
