import {describe,expect,it} from 'vitest';
import {detectOrigin} from '../../src/features/origin/detector';
import {readOriginCells,decodeOriginString} from '../../src/features/origin/resources';
import {validateOriginModel,type OriginColumn,type OriginModel} from '../../src/features/origin/model';

function header(signature='CPYA 4,3168 226 W64 #',version=9.300226){
 const prefix=new TextEncoder().encode(signature+'\n'),bytes=new Uint8Array(prefix.length+5+64+1),view=new DataView(bytes.buffer);
 view.setUint32(prefix.length,64,true);bytes[prefix.length+4]=10;view.setFloat64(prefix.length+5+0x1b,version,true);bytes[bytes.length-1]=10;bytes.set(prefix);return bytes;
}

describe('Origin format boundaries',()=>{
 it('admits only the inspected legacy profile and does not infer support from a filename',()=>{
  const bytes=header(),copy=bytes.slice();
  expect(detectOrigin(bytes)).toMatchObject({family:'opj',build:3168,version:9.300226,canDecode:true});
  expect(detectOrigin(header('CPYA 4,9999 226 W64 #'))).toMatchObject({family:'opj',canDecode:false,reason:'UNVERIFIED_PROFILE'});
  expect(detectOrigin(header('CPYUA 4,9999 226 W64 #'))).toMatchObject({family:'opju',canDecode:false});
  expect(detectOrigin(new TextEncoder().encode('unrecognized binary'))).toMatchObject({family:'unknown',canDecode:false});
  expect(bytes).toEqual(copy);
 });
 it('refuses truncated or overflowing header frames before decoding',()=>{
  expect(()=>detectOrigin(header().subarray(0,40))).toThrow('ORIGIN_TRUNCATED');
  const bad=header(),offset=bad.indexOf(10)+1;new DataView(bad.buffer).setUint32(offset,0xffffffff,true);
  expect(()=>detectOrigin(bad)).toThrow('ORIGIN_TRUNCATED');
  expect(detectOrigin(header(undefined,8.5))).toMatchObject({canDecode:false,reason:'UNVERIFIED_PROFILE'});
 });
});

function ownModel():OriginModel {
 return {format:'APIO_ORIGIN_DOCUMENT',schemaVersion:1,
  source:{name:'synthetic.opj',size:64,sha256:'a'.repeat(64),detected:{family:'unknown',header:'synthetic',build:null,version:null,canDecode:false,reason:'UNKNOWN_SIGNATURE'}},
  decoder:{name:'synthetic',version:'1',revision:'own-test'},
  nodes:[{id:'c',parentId:null,kind:'column',nameHex:'41',sourceId:'7',properties:{commandHex:'616c657274283129'},provenance:[{offset:0,length:64}],capabilities:{recognized:true,extracted:true,rendered:false,editable:false,recalculable:false,archived:false,unsupportedReason:null}}],
  columns:[{nodeId:'c',rowCount:1,values:'v',tags:'k',role:'X',originType:'f64'}],
  resources:[{id:'v',kind:'f64',size:8,sha256:'b'.repeat(64)},{id:'k',kind:'tags',size:1,sha256:'c'.repeat(64)}],relations:[],diagnostics:[],
  coverage:{inventory:'partial',visualEquivalence:'unverified',opaqueRanges:[{offset:0,length:64}]},sourceResourceId:null};
}

describe('OIM trust boundary',()=>{
 it('keeps passive metadata but rejects corrupt relations and cycles before a tab can be opened',()=>{
  expect(validateOriginModel(ownModel()).nodes[0].properties).toEqual({commandHex:'616c657274283129'});
  const cycle=ownModel();cycle.nodes[0].parentId='c';expect(()=>validateOriginModel(cycle)).toThrow('ORIGIN_INVALID_MODEL');
  const missing=ownModel();missing.relations=[{id:'r',from:'c',to:'absent',sourceTargetId:'9',kind:'x',resolved:true}];expect(()=>validateOriginModel(missing)).toThrow('ORIGIN_INVALID_MODEL');
  const bad=ownModel();bad.resources[0].size=7;expect(()=>validateOriginModel(bad)).toThrow('ORIGIN_INVALID_MODEL');
 });
 it('refuses coerced hashes and false native-computation capabilities',()=>{
  const hash=ownModel();(hash.source as unknown as {sha256:unknown}).sha256=['a'.repeat(64)];
  expect(()=>validateOriginModel(hash)).toThrow('ORIGIN_INVALID_MODEL');
  const calculation=ownModel();calculation.nodes[0].capabilities.recalculable=true;expect(()=>validateOriginModel(calculation)).toThrow('ORIGIN_INVALID_MODEL');
  const metadata=ownModel();metadata.nodes[0].properties.labelHex='not hex';expect(()=>validateOriginModel(metadata)).toThrow('ORIGIN_INVALID_MODEL');
 });
});

describe('typed Origin cell resources',()=>{
 const column:OriginColumn={nodeId:'column:7',rowCount:5,values:'v',tags:'k',textOffsets:'o',textBytes:'t',role:'X',originType:'mixed'};
 const numbers=new Uint8Array(40),view=new DataView(numbers.buffer);
 view.setBigUint64(0,0x8000000000000000n,true);view.setBigUint64(8,1n,true);
 view.setFloat64(16,-1.23456789e-300,true);view.setBigUint64(32,0x7ff800000000002an,true);
 const offsets=new Uint8Array(24);new DataView(offsets.buffer).setUint32(16,2,true);new DataView(offsets.buffer).setUint32(20,2,true);
 const resources=new Map([['v',numbers],['k',new Uint8Array([0,128,1,2,0])],['o',offsets],['t',new Uint8Array([0xc0,0xc1])]]);
 it('preserves row positions, signed zero, subnormal bits, special bits and distinct missing cells',()=>{
  const cells=readOriginCells(column,resources,0,5);
  expect(cells[0]).toMatchObject({kind:'number',bits:'8000000000000000',value:-0,masked:false});
  expect(Object.is(cells[0].value,-0)).toBe(true);
  expect(cells[1]).toMatchObject({kind:'number',bits:'0000000000000001',value:Number.MIN_VALUE,masked:true});
  expect(cells[2]).toMatchObject({kind:'missing',value:null});
  expect(cells[3]).toMatchObject({kind:'text',bytesHex:'c0c1',value:null});
  expect(cells[4]).toMatchObject({kind:'special',bits:'7ff800000000002a',value:null});
  expect(readOriginCells(column,resources,3,1)).toHaveLength(1);
 });
 it('rejects out-of-range pages, malformed lengths, offsets and resource substitution',()=>{
  expect(()=>readOriginCells(column,resources,-1,1)).toThrow('ORIGIN_INVALID_RANGE');
  expect(()=>readOriginCells(column,resources,4,2)).toThrow('ORIGIN_INVALID_RANGE');
  expect(()=>readOriginCells(column,new Map(resources).set('v',new Uint8Array(1)),0,1)).toThrow('ORIGIN_INVALID_RESOURCE');
  const bad=offsets.slice();new DataView(bad.buffer).setUint32(16,300,true);
  expect(()=>readOriginCells(column,new Map(resources).set('o',bad),3,1)).toThrow('ORIGIN_INVALID_RESOURCE');
 });
 it('changes display encoding reversibly while retaining raw bytes and rejecting invalid hex',()=>{
  expect(decodeOriginString('c0c1','windows-1251')).toBe('АБ');
  expect(decodeOriginString('c0c1','utf-8')).toBeNull();
  expect(()=>decodeOriginString('c0q1','windows-1251')).toThrow('ORIGIN_INVALID_BYTES');
 });
 it('does not accept a fabricated empty model as a fully restored Origin document',()=>{
  expect(()=>validateOriginModel({format:'APIO_ORIGIN_DOCUMENT',schemaVersion:1})).toThrow('ORIGIN_INVALID_MODEL');
 });
});
