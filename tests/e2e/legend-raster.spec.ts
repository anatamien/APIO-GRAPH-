import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import {addPairs,createProject} from '../../src/domain/model';

test('legend toggle removes exported ink in PNG and JPEG and restores it at the same anchor',async({page},info)=>{
 const p=addPairs(createProject(),[{x:0,y:1},{x:1,y:2}],'Legend reference');
 p.page.widthPx=900;p.page.heightPx=600;p.viewport={xMin:0,xMax:4,yMin:0,yMax:10};p.legend.anchor={mode:'page',pageX:.72,pageY:.12};
 await page.goto('/');await page.locator('input[type=file]').setInputFiles({name:'legend-raster.aph',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(p))});
 const header=(name:string)=>page.locator('header').getByRole('button',{name,exact:true});
 const results=[];
 for(const visible of [true,false,true]){
  await header('Свойства графика').click();await page.getByLabel('Показывать легенду',{exact:true}).setChecked(visible);await header('Экспорт').click();
  const panel=page.locator('.export-panel'),fallback=panel.getByLabel('Продолжить с системным моноширинным шрифтом',{exact:true});if(await fallback.count())await fallback.check();
  const inks:Record<string,number>={};
  for(const format of ['png','jpeg']){
   await panel.getByLabel('Формат',{exact:true}).selectOption(format);const pending=page.waitForEvent('download');await panel.getByRole('button',{name:'Сохранить изображение',exact:true}).click();const bytes=await readFile((await(await pending).path())!);
   inks[format]=await page.evaluate(async({bytes,format})=>{
    const bitmap=await createImageBitmap(new Blob([Uint8Array.from(bytes)],{type:`image/${format}`})),canvas=document.createElement('canvas');canvas.width=bitmap.width;canvas.height=bitmap.height;const ctx=canvas.getContext('2d')!;ctx.drawImage(bitmap,0,0);bitmap.close();
    const pixels=ctx.getImageData(645,55,220,38).data;let ink=0;for(let i=0;i<pixels.length;i+=4)if(pixels[i]+pixels[i+1]+pixels[i+2]<450&&pixels[i+3]>200)ink++;return ink;
   },{bytes:[...bytes],format});
   if(visible)expect(inks[format]).toBeGreaterThan(20);else expect(inks[format]).toBeLessThan(4);
   if(results.length<2)await info.attach(`legend-${visible?'on':'off'}.${format==='jpeg'?'jpg':'png'}`,{body:bytes,contentType:`image/${format}`});
  }
  results.push(inks);
 }
 expect(results[2]).toEqual(results[0]);await info.attach('raster-legend-ink.json',{body:JSON.stringify(results,null,2),contentType:'application/json'});
});
