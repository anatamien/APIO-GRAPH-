import type {OriginColumn} from './model';
export interface OriginCell {kind:'number'|'missing'|'special'|'text'|'unknown';value:number|null;bits:string;bytesHex?:string;masked:boolean}
export function decodeOriginString(bytesHex:string,encoding:string):string|null {
 if(!/^(?:[0-9a-f]{2})*$/.test(bytesHex))throw new Error('ORIGIN_INVALID_BYTES');
 const bytes=Uint8Array.from(bytesHex.match(/../g)??[],v=>parseInt(v,16));
 try{return new TextDecoder(encoding,{fatal:true}).decode(bytes)}catch{return null}
}
/** Resources are immutable and already hash-checked by the broker/archive reader. */
export function readOriginCells(column:OriginColumn,resources:ReadonlyMap<string,Uint8Array>,start:number,count:number):OriginCell[] {
 if(!Number.isSafeInteger(start)||!Number.isSafeInteger(count)||start<0||count<0||count>1000||start>column.rowCount||count>column.rowCount-start)throw new Error('ORIGIN_INVALID_RANGE');
 const resource=(id:string|undefined,size?:number)=>{const b=id?resources.get(id):undefined;if(!b||(size!==undefined&&b.length!==size))throw new Error('ORIGIN_INVALID_RESOURCE');return b};
 const v=resource(column.values,column.rowCount*8),k=resource(column.tags,column.rowCount),view=new DataView(v.buffer,v.byteOffset,v.byteLength);
 const o=column.textOffsets?resource(column.textOffsets,(column.rowCount+1)*4):undefined,t=column.textBytes?resource(column.textBytes):undefined,offsets=o?new DataView(o.buffer,o.byteOffset,o.byteLength):undefined;
 const cells:OriginCell[]=[];
 for(let row=start;row<start+count;row++){
  const tag=k[row],bits=view.getBigUint64(row*8,true).toString(16).padStart(16,'0'),value=view.getFloat64(row*8,true),masked=!!(tag&128),kind=tag&127;
  if(kind>3)throw new Error('ORIGIN_INVALID_RESOURCE');
  if(kind===2){
   if(!offsets||!t)throw new Error('ORIGIN_INVALID_RESOURCE');const from=offsets.getUint32(row*4,true),to=offsets.getUint32((row+1)*4,true);
   if(from>to||to>t.length)throw new Error('ORIGIN_INVALID_RESOURCE');
   const bytesHex=Array.from(t.subarray(from,to),b=>b.toString(16).padStart(2,'0')).join('');
   cells.push({kind:'text',value:null,bits,bytesHex,masked});
  }else cells.push({kind:kind===1?'missing':kind===3?'unknown':Number.isFinite(value)?'number':'special',value:kind===0&&Number.isFinite(value)?value:null,bits,masked});
 }
 return cells;
}
