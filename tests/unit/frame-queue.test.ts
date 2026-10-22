import {it,expect} from 'vitest';
import {frameQueue} from '../../src/domain/frameQueue';
it('coalesces a burst to its latest value and flushes the actual release position',()=>{
 let frame:(()=>void)|undefined;let requests=0;const values:number[]=[];
 const queue=frameQueue<number>(n=>values.push(n),fn=>{requests++;frame=fn;return requests},()=>{frame=undefined});
 queue.push(1);queue.push(2);queue.push(3);expect(requests).toBe(1);expect(values).toEqual([]);frame!();expect(values).toEqual([3]);
 queue.push(4);queue.flush(5);expect(values).toEqual([3,5]);expect(frame).toBeUndefined();queue.push(6);queue.cancel();expect(values).toEqual([3,5]);
});
