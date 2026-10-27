/** Strict stored-only ZIP envelope: no decompression, paths supplied by each format policy. */
export interface ZipPolicy {maximumBytes:number;maximumEntryBytes:number;maximumEntries:number;validPath:(name:string)=>boolean;errorPrefix:string}
const encoder=new TextEncoder();
export async function resourceHash(bytes:Uint8Array):Promise<string>{const input=bytes.buffer instanceof ArrayBuffer?new Uint8Array(bytes.buffer,bytes.byteOffset,bytes.byteLength):new Uint8Array(bytes);return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',input)),b=>b.toString(16).padStart(2,'0')).join('')}
const crcTable=Uint32Array.from({length:256},(_,n)=>{for(let i=0;i<8;i++)n=n&1?0xedb88320^(n>>>1):n>>>1;return n>>>0});
function crc32(b:Uint8Array){let n=0xffffffff;for(const c of b)n=crcTable[(n^c)&255]^(n>>>8);return (n^0xffffffff)>>>0}
export function writeStoredZip(entries:ReadonlyMap<string,Uint8Array>,policy:ZipPolicy):Uint8Array{
 const {maximumBytes:maxBytes,maximumEntries:maxEntries,validPath,errorPrefix}=policy;
 if(entries.size>maxEntries)throw new Error(`${errorPrefix}_ARCHIVE_LIMIT`);
 const locals:Uint8Array[]=[],central:Uint8Array[]=[];let size=0;
 for(const [name,bytes]of entries){if(!validPath(name)||name.length>100||bytes.length>policy.maximumEntryBytes)throw new Error(`${errorPrefix}_INVALID_ARCHIVE`);const key=encoder.encode(name),crc=crc32(bytes),header=new Uint8Array(30+key.length),v=new DataView(header.buffer);
  v.setUint32(0,0x04034b50,true);v.setUint16(4,20,true);v.setUint32(14,crc,true);v.setUint32(18,bytes.length,true);v.setUint32(22,bytes.length,true);v.setUint16(26,key.length,true);header.set(key,30);
  const c=new Uint8Array(46+key.length),cv=new DataView(c.buffer);cv.setUint32(0,0x02014b50,true);cv.setUint16(4,20,true);cv.setUint16(6,20,true);cv.setUint32(16,crc,true);cv.setUint32(20,bytes.length,true);cv.setUint32(24,bytes.length,true);cv.setUint16(28,key.length,true);cv.setUint32(42,size,true);c.set(key,46);central.push(c);locals.push(header,bytes);size+=header.length+bytes.length;
  if(size>maxBytes)throw new Error(`${errorPrefix}_ARCHIVE_LIMIT`);
 }
 const cdSize=central.reduce((n,b)=>n+b.length,0);if(size+cdSize+22>maxBytes)throw new Error(`${errorPrefix}_ARCHIVE_LIMIT`);const end=new Uint8Array(22),e=new DataView(end.buffer);e.setUint32(0,0x06054b50,true);e.setUint16(8,entries.size,true);e.setUint16(10,entries.size,true);e.setUint32(12,cdSize,true);e.setUint32(16,size,true);
 const out=new Uint8Array(size+cdSize+22);let at=0;for(const b of [...locals,...central,end]){out.set(b,at);at+=b.length}return out;
}
export function readStoredZip(bytes:Uint8Array,policy:ZipPolicy):Map<string,Uint8Array>{
 const {maximumBytes:maxBytes,maximumEntries:maxEntries,validPath,errorPrefix}=policy;
 try{
  if(bytes.length<22||bytes.length>maxBytes)throw 0;const v=new DataView(bytes.buffer,bytes.byteOffset,bytes.length),end=bytes.length-22,u16=(at:number)=>v.getUint16(at,true),u32=(at:number)=>v.getUint32(at,true);
  if(u32(end)!==0x06054b50||u16(end+4)||u16(end+6)||u16(end+20)||u16(end+8)!==u16(end+10))throw 0;
  const count=u16(end+10),start=u32(end+16);if(count>maxEntries||start>end||u32(end+12)!==end-start)throw 0;const entries=new Map<string,Uint8Array>();let at=start,local=0;
  for(let i=0;i<count;i++){
   if(at+46>end||u32(at)!==0x02014b50||u16(at+8)||u16(at+10)||u16(at+30)||u16(at+32)||u16(at+34)||u32(at+38)||u32(at+42)!==local)throw 0;
   const crc=u32(at+16),size=u32(at+24),nameLength=u16(at+28);if(size>policy.maximumEntryBytes||u32(at+20)!==size||at+46+nameLength>end)throw 0;const name=new TextDecoder('utf-8',{fatal:true}).decode(bytes.subarray(at+46,at+46+nameLength));
   if(!validPath(name)||entries.has(name)||local+30>start||u32(local)!==0x04034b50||u16(local+6)||u16(local+8)||u32(local+14)!==crc||u32(local+18)!==size||u32(local+22)!==size||u16(local+26)!==nameLength||u16(local+28))throw 0;
   const key=new TextDecoder().decode(bytes.subarray(local+30,local+30+nameLength)),data=local+30+nameLength;if(key!==name||data>start||size>start-data)throw 0;const payload=bytes.subarray(data,data+size);if(crc32(payload)!==crc)throw 0;entries.set(name,payload);local=data+size;at+=46+nameLength;
  }
  if(local!==start||at!==end)throw 0;return entries;
 }catch{throw new Error(`${errorPrefix}_INVALID_ARCHIVE`)}
}
