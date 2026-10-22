import {it,expect} from 'vitest';
import {rasterDpi} from '../../src/features/export/dpiMetadata';
it('EXP PNG stores 300 DPI as 11811 pixels/metre and replaces existing density',()=>{
 const image=new Uint8Array(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aZ9sAAAAASUVORK5CYII=','base64'));
 const output=rasterDpi(image,'png',300),at=Buffer.from(output).indexOf('pHYs');expect(at).toBeGreaterThan(0);const view=new DataView(output.buffer);expect(view.getUint32(at+4)).toBe(11811);expect(view.getUint32(at+8)).toBe(11811);expect(output[at+12]).toBe(1);expect(Buffer.from(rasterDpi(output,'png',600)).toString('latin1').split('pHYs')).toHaveLength(2);
});
it('EXP JPEG carries explicit JFIF DPI while retaining compressed image bytes',()=>{
 const image=new Uint8Array([255,216,255,217]),output=rasterDpi(image,'jpeg',300);
 expect([...output.slice(2,8)]).toEqual([255,224,0,16,74,70]);expect([...output.slice(13,18)]).toEqual([1,1,44,1,44]);expect([...output.slice(-2)]).toEqual([255,217]);
});

const png = () => new Uint8Array(Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aZ9sAAAAASUVORK5CYII=', 'base64'));
function pngChunks(image: Uint8Array) {
 const bytes = Buffer.from(image);
 const chunks: { name: string; data: Buffer; crc: number }[] = [];
 for (let offset = 8; offset < bytes.length;) {
  const size = bytes.readUInt32BE(offset);
  chunks.push({ name: bytes.toString('ascii', offset + 4, offset + 8), data: bytes.subarray(offset + 8, offset + 8 + size), crc: bytes.readUInt32BE(offset + 8 + size) });
  offset += size + 12;
 }
 return chunks;
}

it('EXP PNG density has the independent zlib CRC reference and retains IHDR/IDAT bytes', () => {
 const image = png(), original = image.slice(), output = rasterDpi(image, 'png', 300);
 const chunks = pngChunks(output), density = chunks.find(chunk => chunk.name === 'pHYs')!;
 // Python zlib.crc32(b'pHYs' + struct.pack('>IIB', 11811, 11811, 1)).
 expect(density.crc).toBe(0x78a53f76);
 expect(chunks.filter(chunk => chunk.name !== 'pHYs')).toEqual(pngChunks(image));
 expect(chunks.findIndex(chunk => chunk.name === 'pHYs')).toBeLessThan(chunks.findIndex(chunk => chunk.name === 'IDAT'));
 expect(image).toEqual(original);
 const replaced = pngChunks(rasterDpi(output, 'png', 600)).filter(chunk => chunk.name === 'pHYs');
 expect(replaced).toHaveLength(1);
 expect(replaced[0].crc).toBe(0x14944341);
});

it('EXP PNG accepts a byte view with a nonzero buffer offset', () => {
 const image = png(), storage = new Uint8Array(image.length + 17);
 storage.set(image, 11);
 const output = rasterDpi(storage.subarray(11, 11 + image.length), 'png', 300);
 expect(pngChunks(output).find(chunk => chunk.name === 'pHYs')!.data.readUInt32BE(0)).toBe(11811);
 expect([...storage.subarray(0, 11)]).toEqual(new Array(11).fill(0));
});

it('EXP JPEG replaces an existing JFIF density without duplicating headers or changing the scan', () => {
 const scan = new Uint8Array([255, 216, 255, 219, 0, 4, 1, 2, 255, 218, 0, 2, 11, 22, 33, 255, 217]);
 const image = rasterDpi(scan, 'jpeg', 300), original = image.slice(), output = rasterDpi(image, 'jpeg', 600);
 expect(Buffer.from(output).toString('latin1').split('JFIF\0')).toHaveLength(2);
 expect([...output.slice(13, 18)]).toEqual([1, 2, 88, 2, 88]);
 expect(output.slice(20)).toEqual(scan.slice(2));
 expect(image).toEqual(original);
});

it('EXP rejects invalid density and truncated raster containers', () => {
 for (const dpi of [NaN, Infinity, 35, 2401]) expect(() => rasterDpi(png(), 'png', dpi)).toThrow('INVALID_DPI');
 expect(() => rasterDpi(png().slice(0, 20), 'png', 300)).toThrow('INVALID_PNG');
 expect(() => rasterDpi(new Uint8Array([0, 0]), 'png', 300)).toThrow('INVALID_PNG');
 expect(() => rasterDpi(new Uint8Array([0, 0]), 'jpeg', 300)).toThrow('INVALID_JPEG');
});
