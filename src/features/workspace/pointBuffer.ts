import type {Point} from '../../domain/model';
const signature=new Uint8Array([65,80,73,79,80,84,83]),headerSize=16,maxPoints=1000000;
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const textDecoder=new TextDecoder('utf-8',{fatal:true});
function format(bytes:Uint8Array){if(bytes.length<headerSize||signature.some((b,i)=>bytes[i]!==b)||![49,50].includes(bytes[7]))throw new Error('WORKSPACE_INVALID_POINTS');return{version:bytes[7]-48,recordSize:bytes[7]===50?72:52}}
export function encodePointBuffer(points:readonly Point[]):Uint8Array{
 if(points.length>maxPoints)throw new Error('WORKSPACE_POINT_LIMIT');const version=points.some(p=>p.errorX!==undefined||p.errorY!==undefined)?2:1,recordSize=version===2?72:52;
 const bytes=new Uint8Array(headerSize+points.length*recordSize),view=new DataView(bytes.buffer);bytes.set(signature);bytes[7]=48+version;view.setUint32(8,points.length,true);view.setUint32(12,0x01020304,true);
 for(let i=0;i<points.length;i++){const p=points[i],at=headerSize+i*recordSize;if(!uuid.test(p.id)||!Number.isFinite(p.x)||!Number.isFinite(p.y)||[p.errorX,p.errorY].some(v=>v!==undefined&&(!Number.isFinite(v)||v<0)))throw new Error('WORKSPACE_INVALID_POINTS');for(let j=0;j<36;j++)bytes[at+j]=p.id.charCodeAt(j);view.setFloat64(at+36,p.x,true);view.setFloat64(at+44,p.y,true);if(version===2){view.setUint32(at+52,(p.errorX!==undefined?1:0)|(p.errorY!==undefined?2:0),true);view.setFloat64(at+56,p.errorX??0,true);view.setFloat64(at+64,p.errorY??0,true)}}return bytes;
}
export function pointBufferCount(bytes:Uint8Array):number{
 const {recordSize}=format(bytes),view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength),count=view.getUint32(8,true);
 if(count>maxPoints||view.getUint32(12,true)!==0x01020304||bytes.length!==headerSize+count*recordSize)throw new Error('WORKSPACE_INVALID_POINTS');return count;
}
/** APIOPTS1 stays byte-compatible. Version2 adds explicit presence flags and binary64 ΔX/ΔY, without sentinels. */
export function decodePointBuffer(bytes:Uint8Array):Point[]{
 const count=pointBufferCount(bytes),{version,recordSize}=format(bytes),view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength),points:Point[]=new Array(count);
 for(let i=0;i<count;i++){const at=headerSize+i*recordSize,id=textDecoder.decode(bytes.subarray(at,at+36)),x=view.getFloat64(at+36,true),y=view.getFloat64(at+44,true);if(!uuid.test(id)||!Number.isFinite(x)||!Number.isFinite(y))throw new Error('WORKSPACE_INVALID_POINTS');let errors:Pick<Point,'errorX'|'errorY'>={};if(version===2){const flags=view.getUint32(at+52,true),errorX=view.getFloat64(at+56,true),errorY=view.getFloat64(at+64,true);if(flags>3||!Number.isFinite(errorX)||errorX<0||!Number.isFinite(errorY)||errorY<0||!(flags&1)&&errorX!==0||!(flags&2)&&errorY!==0)throw new Error('WORKSPACE_INVALID_POINTS');errors={...(flags&1?{errorX}:{}),...(flags&2?{errorY}:{})}}points[i]={id,x,y,...errors}}return points;
}
