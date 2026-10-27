import {it,expect} from 'vitest';
import {identifyAttachment} from '../../src/features/origin/attachmentType';
it('recognizes passive signatures and keeps text, containers and unknown binary distinct',()=>{
 expect(identifyAttachment(new Uint8Array([137,80,78,71,13,10,26,10]))?.mime).toBe('image/png');expect(identifyAttachment(new Uint8Array([255,216,255,0]))?.mime).toBe('image/jpeg');expect(identifyAttachment(new TextEncoder().encode('GIF89a000000'))?.mime).toBe('image/gif');expect(identifyAttachment(new TextEncoder().encode('%PDF-1.7\n'))?.preview).toBe('none');expect(identifyAttachment(new Uint8Array([80,75,3,4]))?.preview).toBe('none');expect(identifyAttachment(new TextEncoder().encode('<script>alert(1)</script>'))?.preview).toBe('text');expect(identifyAttachment(new Uint8Array([0,1,2,3]))).toBeNull();expect(identifyAttachment(new Uint8Array([255,128]))).toBeNull();
});
