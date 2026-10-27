export interface OriginFormat {
 family:'opj'|'opju'|'unknown';header:string;build:number|null;version:number|null;canDecode:boolean;
 reason?:'UNKNOWN_SIGNATURE'|'UNVERIFIED_PROFILE';
}
export const MAX_ORIGIN_SOURCE_BYTES=200*1024*1024;
/** Detection grants no claim of project completeness or visual fidelity. */
export function detectOrigin(bytes:Uint8Array):OriginFormat {
 if(bytes.byteLength>MAX_ORIGIN_SOURCE_BYTES)throw new Error('ORIGIN_TOO_LARGE');
 const prefix=new TextDecoder('ascii').decode(bytes.subarray(0,512)),match=/^(CPYA|CPYUA) (\d+)[,.](\d+)(?=\s|#|$)[^\r\n]*/.exec(prefix);
 if(!match)return {family:'unknown',header:prefix.split(/[\r\n]/)[0].slice(0,80),build:null,version:null,canDecode:false,reason:'UNKNOWN_SIGNATURE'};
 const lf=bytes.subarray(0,512).indexOf(10);if(lf<0)throw new Error('ORIGIN_TRUNCATED');
 const at=lf+1;if(at+5>bytes.length)throw new Error('ORIGIN_TRUNCATED');
 const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength),length=view.getUint32(at,true),body=at+5;
 if(bytes[at+4]!==10||length<0x23||length>4096||length>bytes.length-body-1||bytes[body+length]!==10)throw new Error('ORIGIN_TRUNCATED');
 const version=view.getFloat64(body+0x1b,true),family=match[1]==='CPYA'?'opj':'opju',rawBuild=Number(match[3]),build=Number.isSafeInteger(rawBuild)?rawBuild:null;
 const canDecode=family==='opj'&&match[2]==='4'&&Number.isFinite(version)&&([[2878,8.0724],[3116,9.200272],[3168,9.300226],[3478,9.850212],[3522,9.900225],[3551,9.950167]]).some(([b,v])=>build===b&&Math.abs(version-v)<1e-10);
 return {family,header:prefix.slice(0,lf).replace(/\r$/,''),build,version:Number.isFinite(version)?version:null,canDecode,...(!canDecode?{reason:'UNVERIFIED_PROFILE' as const}:{})};
}
