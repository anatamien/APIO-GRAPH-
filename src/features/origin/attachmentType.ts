export interface PassiveAttachmentType {label:string;mime:string;preview:'image'|'text'|'none'}
/** Signature detection grants no execution or decompression permission. */
export function identifyAttachment(bytes:Uint8Array):PassiveAttachmentType|null{
 const begins=(s:number[])=>s.every((v,i)=>bytes[i]===v),ascii=new TextDecoder('ascii').decode(bytes.subarray(0,16));
 if(begins([137,80,78,71,13,10,26,10]))return {label:'PNG',mime:'image/png',preview:'image'};
 if(begins([255,216,255]))return {label:'JPEG',mime:'image/jpeg',preview:'image'};
 if(ascii.startsWith('GIF87a')||ascii.startsWith('GIF89a'))return {label:'GIF',mime:'image/gif',preview:'image'};
 if(ascii.startsWith('BM')&&bytes.length>=14)return {label:'BMP',mime:'image/bmp',preview:'image'};
 if(ascii.startsWith('%PDF-'))return {label:'PDF',mime:'application/pdf',preview:'none'};
 if(begins([80,75,3,4]))return {label:'ZIP',mime:'application/zip',preview:'none'};
 if(begins([208,207,17,224,161,177,26,225]))return {label:'OLE compound document',mime:'application/x-ole-storage',preview:'none'};
 if(bytes.length&&bytes.every(v=>v>=32||v===9||v===10||v===13)){try{new TextDecoder('utf-8',{fatal:true}).decode(bytes);return {label:'UTF-8',mime:'text/plain',preview:'text'}}catch{/* Unknown encoding stays passive. */}}
 return null;
}
