import {convertOrigin,type ConvertRequest} from './convert';
import type {OriginModel} from './model';
import {readOriginCells,decodeOriginString} from './resources';
let model:OriginModel;const resources=new Map<string,Uint8Array>();
self.onmessage=(event:MessageEvent)=>{
 const {id,kind,payload}=event.data as {id:number;kind:string;payload:Record<string,unknown>};
 try{
  let result:unknown;
  if(kind==='init'){model=payload.model as OriginModel;result=true}
  else if(kind==='resource'){resources.set(String(payload.id),new Uint8Array(payload.bytes as ArrayBuffer));result=true}
  else if(kind==='convert')result=convertOrigin(model,resources,payload as unknown as ConvertRequest);
  else if(kind==='tsv'){
   const {columnIds,start,end,encoding}=payload as unknown as {columnIds:string[];start:number;end:number;encoding:string},columns=columnIds.map(id=>model.columns.find(c=>c.nodeId===id)!);
   if(columns.some(c=>!c)||!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start<0||end<start||end>100000000||(end-start+1)*columns.length>10000000)throw new Error('ORIGIN_INVALID_RANGE');
   const lines:string[]=[];let length=0;
   const quote=(s:string)=>/[\t\r\n"]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s;
   for(let at=start;at<=end;at+=500){const count=Math.min(500,end-at+1),data=columns.map(c=>at<c.rowCount?readOriginCells(c,resources,at,Math.min(count,c.rowCount-at)):[]);for(let row=0;row<count;row++){const line=data.map(c=>{const cell=c[row];if(!cell||cell.kind==='missing')return '';if(cell.kind==='number')return Object.is(cell.value,-0)?'-0':String(cell.value);if(cell.kind==='text')return quote(decodeOriginString(cell.bytesHex??'',encoding)??`0x${cell.bytesHex}`);return `0x${cell.bits}`}).join('\t');length+=line.length+1;if(length>200*1024*1024)throw new Error('FILE_TOO_LARGE');lines.push(line)}}result=lines.join('\n');
  }else throw new Error('ORIGIN_WORKER_COMMAND');
  self.postMessage({id,result});
 }catch(error){self.postMessage({id,error:String(error)})}
};
