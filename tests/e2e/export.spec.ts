import { readFile } from 'node:fs/promises';
import { expect, test, type Locator, type Page } from '@playwright/test';
import { addPairs, createProject, makeObject, type ProjectDocument } from '../../src/domain/model';
import {largeProject} from '../fixtures/large-data';

const headerButton = (page: Page, name: string) => page.locator('header').getByRole('button', { name, exact: true });
const exportPanel = (page: Page) => page.locator('.export-panel');
const scriptText = '<script>alert(1)</script>';
test('large preview is bounded but saved SVG retains every original measurement',async({page})=>{
 const p=largeProject(10000);p.series[0].mode='line-points';p.series[0].style.markerVisible=true;await load(page,p);await headerButton(page,'Экспорт').click();const panel=exportPanel(page);
 await expect.poll(()=>panel.locator('img').getAttribute('src')).toMatch(/^blob:/);
 const displayed=await panel.locator('img').evaluate(async el=>((await(await fetch((el as HTMLImageElement).src)).text()).match(/data-point=/g)??[]).length);expect(displayed).toBeLessThan(6000);
 await panel.getByLabel('Формат',{exact:true}).selectOption('svg');const fallback=panel.getByLabel('Продолжить с системным моноширинным шрифтом',{exact:true});if(await fallback.count())await fallback.check();
 const file=await downloadImage(page,panel),svg=file.bytes.toString('utf8');expect((svg.match(/data-point=/g)??[]).length).toBe(10000);expect(svg).toContain(p.datasets[0].points[9999].id);
});

function fixture(seriesCount = 1, outside = false): ProjectDocument {
 let project = createProject();
 project.project.title = 'Export reference';
 project.viewport = { xMin: 0, xMax: 4, yMin: 0, yMax: 10 };
 for (let i = 0; i < seriesCount; i++) project = addPairs(project, Array.from({ length: 5 }, (_, x) => ({ x, y: x + i * 1.5 + 1 })), `S${i + 1}`);
 const text = makeObject('text', [{ mode: 'page', pageX: outside ? 0.99 : 0.12, pageY: 0.16 }], outside ? 'OUTSIDE THE PAGE' : scriptText);
 text.name = 'Literal label';
 project.objects.push(text);project.series=project.series.map(s=>({...s,mode:'line-points',style:{...s.style,markerVisible:true}}));
 return project;
}

async function load(page: Page, project = fixture()) {
 await page.goto('/');
 await page.locator('input[type=file]').setInputFiles({ name: 'export-reference.aph', mimeType: 'application/vnd.apio-graph+json', buffer: Buffer.from(JSON.stringify(project)) });
 await expect(page.locator('[data-series]')).toHaveCount(project.series.length);
}
async function saved(page: Page): Promise<ProjectDocument> {
 const pending = page.waitForEvent('download');
 await headerButton(page, 'Сохранить').click();
 const download = await pending;
 return JSON.parse(await readFile((await download.path())!, 'utf8')) as ProjectDocument;
}
async function physicalExport(page: Page) {
 await headerButton(page, 'Экспорт').click();
 const panel = exportPanel(page);
 await panel.getByLabel('Размер в', { exact: true }).selectOption('mm');
 await panel.getByLabel('DPI', { exact: true }).selectOption('300');
 await panel.getByLabel('Сохранять пропорции', { exact: true }).uncheck();
 for (const [name, value] of [['Ширина', '177.8'], ['Высота', '127']]) {
  await panel.getByLabel(name, { exact: true }).fill(value);
  await panel.getByLabel(name, { exact: true }).press('Tab');
 }
 const fallback = panel.getByLabel('Продолжить с системным моноширинным шрифтом', { exact: true });
 if (await fallback.count()) await fallback.check();
 await expect(panel.getByText('2100 × 1500 px', { exact: false })).toBeVisible();
 return panel;
}
async function downloadImage(page: Page, panel: Locator) {
 const pending = page.waitForEvent('download');
 await panel.getByRole('button', { name: 'Сохранить изображение', exact: true }).click();
 const download = await pending;
 return { bytes: await readFile((await download.path())!), name: download.suggestedFilename() };
}
function pngInfo(bytes: Buffer) {
 expect([...bytes.subarray(0, 8)]).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
 const density: { x: number; y: number; unit: number; crc: number }[] = [];
 for (let offset = 8; offset < bytes.length;) {
  const size = bytes.readUInt32BE(offset);
  expect(offset + size + 12).toBeLessThanOrEqual(bytes.length);
  if (bytes.toString('ascii', offset + 4, offset + 8) === 'pHYs') density.push({ x: bytes.readUInt32BE(offset + 8), y: bytes.readUInt32BE(offset + 12), unit: bytes[offset + 16], crc: bytes.readUInt32BE(offset + 17) });
  offset += size + 12;
 }
 return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20), density };
}
function jpegInfo(bytes: Buffer) {
 expect([...bytes.subarray(0, 2)]).toEqual([255, 216]);
 let width = 0, height = 0, components = 0;
 const density: { unit: number; x: number; y: number }[] = [];
 for (let offset = 2; offset + 4 <= bytes.length;) {
  expect(bytes[offset]).toBe(255);
  const marker = bytes[offset + 1];
  if (marker === 0xda || marker === 0xd9) break;
  const size = bytes.readUInt16BE(offset + 2);
  expect(size).toBeGreaterThanOrEqual(2);
  expect(offset + 2 + size).toBeLessThanOrEqual(bytes.length);
  if (marker === 0xe0 && bytes.toString('ascii', offset + 4, offset + 9) === 'JFIF\0') density.push({ unit: bytes[offset + 11], x: bytes.readUInt16BE(offset + 12), y: bytes.readUInt16BE(offset + 14) });
  if ([0xc0, 0xc1, 0xc2].includes(marker)) { height = bytes.readUInt16BE(offset + 5); width = bytes.readUInt16BE(offset + 7); components = bytes[offset + 9]; }
  offset += size + 2;
 }
 return { width, height, components, density };
}
async function decoded(page: Page, bytes: Buffer, mime: string) {
 return page.evaluate(async ({ data, type }) => {
  const bitmap = await createImageBitmap(new Blob([Uint8Array.from(data)], { type }));
  const canvas = document.createElement('canvas');
  canvas.width = bitmap.width; canvas.height = bitmap.height;
  const context = canvas.getContext('2d')!;
  context.drawImage(bitmap, 0, 0);
  const pixel = [...context.getImageData(0, 0, 1, 1).data];
  const result = { width: bitmap.width, height: bitmap.height, pixel };
  bitmap.close();
  return result;
 }, { data: [...bytes], type: mime });
}

test('EXP-T01/02/06 PNG and JPEG contain actual 300 DPI metadata, exact dimensions, and correct opacity', async ({ page }) => {
 await load(page);
 const before = await saved(page), panel = await physicalExport(page);
 await panel.getByLabel('Прозрачный фон', { exact: true }).check();
 await panel.getByLabel('Формат', { exact: true }).selectOption('png');
 const png = await downloadImage(page, panel), info = pngInfo(png.bytes);
 expect(png.name).toMatch(/\.png$/i);
 expect(info).toMatchObject({ width: 2100, height: 1500, density: [{ x: 11811, y: 11811, unit: 1, crc: 0x78a53f76 }] });
 expect(info.density).toHaveLength(1);
 const pngPixels = await decoded(page, png.bytes, 'image/png');
 expect(pngPixels).toMatchObject({ width: 2100, height: 1500 });
 expect(pngPixels.pixel[3]).toBe(0);

 await panel.getByLabel('Формат', { exact: true }).selectOption('jpeg');
 await expect(panel.getByText('JPEG требует непрозрачный фон; будет использован выбранный цвет.', { exact: true })).toBeVisible();
 const jpeg = await downloadImage(page, panel);
 expect(jpeg.name).toMatch(/\.jpeg$/i);
 expect(jpegInfo(jpeg.bytes)).toEqual({ width: 2100, height: 1500, components: 3, density: [{ unit: 1, x: 300, y: 300 }] });
 expect(await decoded(page, jpeg.bytes, 'image/jpeg')).toEqual({ width: 2100, height: 1500, pixel: [255, 255, 255, 255] });
 const after = await saved(page);
 expect(after.datasets).toEqual(before.datasets);
 expect(after.series).toEqual(before.series);
 expect(after.axes).toEqual(before.axes);
 expect(after.objects).toEqual(before.objects);
 expect(after.page).toEqual(before.page);
 expect(after.viewport).toEqual(before.viewport);
});

test('EXP-T03/04 SVG preserves literal user text and gives four strict BW series distinct dashes and markers', async ({ page }) => {
 const dialogs: string[] = [];
 page.on('dialog', dialog => { dialogs.push(dialog.message()); void dialog.dismiss(); });
 await load(page, fixture(4));
 await expect(page.locator('[data-object] text')).toHaveText(scriptText);
 const before = await saved(page), panel = await physicalExport(page);
 await panel.getByLabel('Формат', { exact: true }).selectOption('svg');
 await panel.getByLabel('Цветовой режим', { exact: true }).selectOption('strict-bw');
 const image = await downloadImage(page, panel), svg = image.bytes.toString('utf8');
 expect(image.name).toMatch(/\.svg$/i);
 expect(svg).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
 const inspected = await page.evaluate(text => {
  const document = new DOMParser().parseFromString(text, 'image/svg+xml');
  const root = document.documentElement;
  return {
   width: root.getAttribute('width'), height: root.getAttribute('height'), viewBox: root.getAttribute('viewBox'),
   scripts: document.querySelectorAll('script').length,
   literal: [...document.querySelectorAll('text')].some(node => node.textContent === '<script>alert(1)</script>'),
   series: [...document.querySelectorAll('[data-series]')].map(group => {
    const paths = group.querySelectorAll('path');
    return { stroke: paths[0].getAttribute('stroke'), dash: paths[0].getAttribute('stroke-dasharray') ?? '', marker: paths[1].getAttribute('d'), markerStroke: paths[1].getAttribute('stroke') };
   }),
  };
 }, svg);
 expect(inspected).toMatchObject({ width: '2100', height: '1500', viewBox: '0 0 672 480', scripts: 0, literal: true });
 expect(inspected.series).toHaveLength(4);
 expect(new Set(inspected.series.map(series => series.dash)).size).toBe(4);
 expect(new Set(inspected.series.map(series => series.marker)).size).toBe(4);
 expect(inspected.series.every(series => series.stroke === '#000000' && series.markerStroke === '#000000')).toBe(true);
 expect(dialogs).toEqual([]);
 const after = await saved(page);
 expect(after.series).toEqual(before.series);
 expect(after.datasets).toEqual(before.datasets);
 expect(after.axes).toEqual(before.axes);
 expect(after.objects).toEqual(before.objects);
});

test('EXP clipped labels block the download and identify the out-of-page text', async ({ page }) => {
 await load(page, fixture(1, true));
 const panel = await physicalExport(page);
 await panel.getByLabel('Формат', { exact: true }).selectOption('svg');
 let downloads = 0;
 page.on('download', () => { downloads++; });
 await panel.getByRole('button', { name: 'Сохранить изображение', exact: true }).click();
 await expect(panel.getByRole('alert')).toContainText('Некоторые надписи выходят за страницу.');
 await expect(panel.getByRole('alert')).toContainText('OUTSIDE THE PAGE');
 expect(downloads).toBe(0);
 await expect(panel.getByRole('button', { name: 'Сохранить изображение', exact: true })).toBeEnabled();
});

test('EXP window resize changes screen layout without changing exported SVG geometry', async ({ page }) => {
 await load(page);
 const before = await saved(page), panel = await physicalExport(page);
 await panel.getByLabel('Формат', { exact: true }).selectOption('svg');
 const wide = await downloadImage(page, panel);
 await page.setViewportSize({ width: 1024, height: 768 });
 await expect(panel).toBeVisible();
 const narrow = await downloadImage(page, panel);
 expect(narrow.bytes.toString('utf8')).toBe(wide.bytes.toString('utf8'));
 const after = await saved(page);
 expect(after.viewport).toEqual(before.viewport);
 expect(after.page).toEqual(before.page);
 expect(after.axes).toEqual(before.axes);
 expect(after.datasets).toEqual(before.datasets);
});
