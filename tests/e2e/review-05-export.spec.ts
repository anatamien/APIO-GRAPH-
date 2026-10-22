import {test,expect,type Page} from '@playwright/test';
import {addPairs,createProject} from '../../src/domain/model';

async function openExport(page:Page){
 const p=addPairs(createProject(),[{x:0,y:2},{x:2,y:4}],'Spectrum');p.page.widthPx=1200;p.page.heightPx=800;
 await page.goto('/');await page.locator('input[type=file]').setInputFiles({name:'export-review.aph',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(p))});await page.locator('header').getByRole('button',{name:'Экспорт',exact:true}).click();const panel=page.locator('.export-panel');await expect(panel.locator('img')).toHaveAttribute('src',/^blob:/);return panel;
}

test('05.1 pixel steps are integer and reversible without moving or unfocusing the panel',async({page},info)=>{
 const panel=await openExport(page),width=panel.getByLabel('Ширина',{exact:true}),height=panel.getByLabel('Высота',{exact:true});await width.focus();const b=(await width.boundingBox())!,before=await panel.boundingBox();
 for(let i=0;i<10;i++){await width.press('ArrowUp');expect(Number(await height.inputValue())%1).toBe(0);await expect(width).toBeFocused();const box=(await width.boundingBox())!;expect(Math.abs(box.y-b.y)).toBeLessThanOrEqual(1)}
 await expect(width).toHaveValue('1210');await expect(height).toHaveValue('807');for(let i=0;i<10;i++)await width.press('ArrowDown');await expect(width).toHaveValue('1200');await expect(height).toHaveValue('800');expect(await panel.boundingBox()).toEqual(before);
 await width.fill('1200.1');await expect(width).toHaveValue('1200');await expect(height).toHaveValue('800');await width.fill('');await expect(width).toHaveValue('');await width.press('Escape');await expect(width).toHaveValue('1200');await panel.getByLabel('Сохранять пропорции',{exact:true}).uncheck();await height.fill('700');await width.fill('1000');await expect(height).toHaveValue('700');await page.screenshot({path:info.outputPath('export-pixels.png')});
});

test('05.4 color changes preserve preview slot, field geometry, scroll and the previous image while busy',async({page},info)=>{
 const panel=await openExport(page),mode=panel.getByLabel('Цветовой режим',{exact:true}),width=panel.getByLabel('Ширина',{exact:true}),body=panel.locator('.panel-body'),first=(await width.boundingBox())!;
 const samples=[];for(const value of ['grayscale','strict-bw','original','strict-bw','grayscale','original']){
  const previous=await panel.locator('img').getAttribute('src');await mode.focus();await mode.selectOption(value);await expect(mode).toBeFocused();expect(await panel.locator('img').getAttribute('src')).toBe(previous);
  const box=(await width.boundingBox())!,scroll=await body.evaluate(e=>e.scrollTop);samples.push({value,y:box.y,scroll});expect(Math.abs(box.y-first.y)).toBeLessThanOrEqual(1);await expect.poll(()=>panel.locator('img').getAttribute('src')).not.toBe(previous);
  expect(Math.abs((await width.boundingBox())!.y-first.y)).toBeLessThanOrEqual(1);
 }await info.attach('geometry.json',{body:JSON.stringify(samples,null,2),contentType:'application/json'});await page.screenshot({path:info.outputPath('export-stable-mode.png')});
});

test('05.4 rapid preview changes and closing release obsolete blobs and never restore a stale mode',async({page})=>{
 await page.addInitScript(()=>{const live=new Set<string>(),create=URL.createObjectURL.bind(URL),revoke=URL.revokeObjectURL.bind(URL);URL.createObjectURL=b=>{const u=create(b);live.add(u);return u};URL.revokeObjectURL=u=>{live.delete(u);revoke(u)};Object.assign(window,{reviewLiveUrls:live})});const panel=await openExport(page),mode=panel.getByLabel('Цветовой режим',{exact:true});for(let i=0;i<15;i++)await mode.selectOption(i%2?'original':'strict-bw');await mode.selectOption('strict-bw');await expect(panel.locator('.export-preview-slot')).toHaveAttribute('aria-busy','false');const svg=await panel.locator('img').evaluate(async e=>(await(await fetch((e as HTMLImageElement).src)).text()));expect(svg).not.toContain('#E9EDF0');await expect.poll(()=>page.evaluate(()=>((window as unknown as {reviewLiveUrls:Set<string>}).reviewLiveUrls.size))).toBe(1);await panel.getByRole('button',{name:'Закрыть',exact:true}).click();await expect.poll(()=>page.evaluate(()=>((window as unknown as {reviewLiveUrls:Set<string>}).reviewLiveUrls.size))).toBe(0);
});
