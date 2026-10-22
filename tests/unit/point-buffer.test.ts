import {it,expect} from 'vitest';
import {packCoordinates,unpackCoordinates} from '../../src/features/analysis/pointBuffer';
import {calculatePreview} from '../../src/features/analysis/operations';
it('transfers a separate IEEE-754 buffer while retaining the original measurements',()=>{
 const points=[{x:-0,y:Number.MIN_VALUE},{x:1.0000000000000002,y:1e308}],packed=packCoordinates(points),received=structuredClone(packed,{transfer:[packed.buffer]});
 expect(packed.byteLength).toBe(0);expect(unpackCoordinates(received)).toEqual(points);expect(Object.is(unpackCoordinates(received)[0].x,-0)).toBe(true);expect(points[1].y).toBe(1e308);
});
it('uses the same rows and mathematical result after binary transfer',()=>{
 const points=[{x:0,y:99},{x:1,y:3},{x:2,y:5},{x:3,y:99}],decoded=unpackCoordinates(packCoordinates(points));
 const result=calculatePreview('linear-fit',decoded,{rowRange:[2,3]});expect(result.summary.a).toBeCloseTo(2,12);expect(result.summary.b).toBeCloseTo(1,12);
 expect(()=>unpackCoordinates(new Float64Array(3))).toThrow();
});
