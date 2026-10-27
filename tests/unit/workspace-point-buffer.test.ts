import {it,expect} from 'vitest';
import {encodePointBuffer,decodePointBuffer,pointBufferCount} from '../../src/features/workspace/pointBuffer';
import {id} from '../../src/domain/model';
it('preserves IDs, acquisition order, binary64 extreme values and negative zero',()=>{
 const points=[{id:id(),x:-0,y:Number.MIN_VALUE},{id:id(),x:Number.MAX_VALUE,y:-Number.MAX_VALUE},{id:id(),x:Math.PI,y:1.0000000000000002}],before=structuredClone(points),encoded=encodePointBuffer(points),decoded=decodePointBuffer(encoded);expect(pointBufferCount(encoded)).toBe(3);expect(decoded).toEqual(points);expect(Object.is(decoded[0].x,-0)).toBe(true);expect(points).toEqual(before);expect(encodePointBuffer(decoded)).toEqual(encoded);expect(decoded[0]).not.toBe(points[0]);
});
it('rejects nonfinite values, corrupt counts/signatures, invalid IDs and truncated or trailing data',()=>{
 const p=[{id:id(),x:1,y:2}],bytes=encodePointBuffer(p);expect(()=>encodePointBuffer([{...p[0],x:Infinity}])).toThrow('WORKSPACE_INVALID_POINTS');expect(()=>encodePointBuffer([{...p[0],id:'x'}])).toThrow('WORKSPACE_INVALID_POINTS');expect(()=>decodePointBuffer(bytes.subarray(0,-1))).toThrow();const trailing=new Uint8Array(bytes.length+1);trailing.set(bytes);expect(()=>decodePointBuffer(trailing)).toThrow();for(const offset of [0,8,12,16]){const bad=bytes.slice();bad[offset]=255;expect(()=>decodePointBuffer(bad)).toThrow()}
 const nonfinite=bytes.slice();new DataView(nonfinite.buffer).setFloat64(52,NaN,true);expect(()=>decodePointBuffer(nonfinite)).toThrow('WORKSPACE_INVALID_POINTS');expect(decodePointBuffer(encodePointBuffer([]))).toEqual([]);
});
