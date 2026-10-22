function u32(n:number):Uint8Array{return new Uint8Array([n>>>24,(n>>>16)&255,(n>>>8)&255,n&255])}
function join(parts:Uint8Array[]):Uint8Array{const result=new Uint8Array(parts.reduce((n,p)=>n+p.length,0));let at=0;for(const part of parts){result.set(part,at);at+=part.length}return result}
function crc(bytes:Uint8Array):number{let value=0xffffffff;for(const byte of bytes){value^=byte;for(let i=0;i<8;i++)value=(value>>>1)^((value&1)?0xedb88320:0)}return (value^0xffffffff)>>>0}
export function rasterDpi(bytes:Uint8Array,format:'png'|'jpeg',dpi:number):Uint8Array{
 if(!Number.isFinite(dpi)||dpi<36||dpi>2400)throw new Error('INVALID_DPI');
 if(format==='png'){
  if(bytes[0]!==137||bytes[1]!==80)throw new Error('INVALID_PNG');
  const density=Math.round(dpi/0.0254),data=join([new TextEncoder().encode('pHYs'),u32(density),u32(density),new Uint8Array([1])]),chunk=join([u32(9),data,u32(crc(data))]);
  const parts:Uint8Array[]=[bytes.slice(0,8)];let inserted=false;
  for(let at=8;at<bytes.length;){if(at+12>bytes.length)throw new Error('INVALID_PNG');const length=new DataView(bytes.buffer,bytes.byteOffset+at,4).getUint32(0),end=at+12+length;if(end>bytes.length)throw new Error('INVALID_PNG');const name=new TextDecoder().decode(bytes.slice(at+4,at+8));if(!inserted&&(name==='IDAT'||name==='IEND')){parts.push(chunk);inserted=true}if(name!=='pHYs')parts.push(bytes.slice(at,end));at=end}
  if(!inserted)throw new Error('INVALID_PNG');return join(parts);
 }
 if(bytes[0]!==255||bytes[1]!==216)throw new Error('INVALID_JPEG');
 const density=Math.round(dpi),hi=density>>>8,lo=density&255;
 const result=bytes.slice();
 for(let at=2;at+4<result.length;){if(result[at]!==255)break;const marker=result[at+1];if(marker===218||marker===217)break;const length=(result[at+2]<<8)|result[at+3];if(length<2||at+2+length>result.length)break;if(marker===224&&new TextDecoder().decode(result.slice(at+4,at+9))==='JFIF\0'&&length>=16){result[at+11]=1;result.set([hi,lo,hi,lo],at+12);return result}at+=2+length}
 const jfif=new Uint8Array([255,224,0,16,74,70,73,70,0,1,2,1,hi,lo,hi,lo,0,0]);return join([result.slice(0,2),jfif,result.slice(2)]);
}
