import {test,expect} from '@playwright/test';
import {addPairs,createProject} from '../../src/domain/model';

for(const [width,height] of [[1280,800],[900,650],[700,500]])test(`interface matrix ${width}x${height}: RU/EN, light/dark/system, 100/125/150% pixel density`,async({browser},info)=>{
 test.setTimeout(120000);const rows=[];
 for(const language of ['ru','en'])for(const theme of ['light','dark','system-light','system-dark'])for(const density of [1,1.25,1.5]){
  const dark=theme==='dark'||theme==='system-dark',largeUI=density>1;
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:density,colorScheme:theme==='system-light'?'light':'dark'});
  const page=await context.newPage(),errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  try{
   await page.addInitScript(({language,theme,largeUI})=>localStorage.setItem('apio.settings',JSON.stringify({language,theme:theme.startsWith('system')?'system':theme,largeUI})),{language,theme,largeUI});
   await page.goto('/');const p=addPairs(createProject(),[{x:-20,y:-1e6},{x:0,y:0},{x:20,y:1e6}],'Measurement');
   await page.locator('input[type=file]').setInputFiles({name:'spectrum.aph',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(p))});
   const en=language==='en',header=(name:string)=>page.locator('header').getByRole('button',{name,exact:true});
   await header(en?'Graph properties':'Свойства графика').click();const panel=page.locator('.graph-properties'),body=panel.locator('.panel-body');await expect(panel).toBeVisible();
   await expect(page.locator('.app')).toHaveCSS('background-color',dark?'rgb(0, 0, 0)':'rgb(246, 246, 247)');
   await expect(panel.locator('h2')).toHaveCSS('font-size','16px');await expect(panel.getByLabel(en?'Show legend':'Показывать легенду',{exact:true})).toBeChecked();
   expect(await body.evaluate(e=>e.scrollWidth<=e.clientWidth+1)).toBe(true);
   await header(en?'Data table':'Таблица').click();const table=page.locator('.data-panel');await expect(table).toBeVisible();expect(await table.evaluate(e=>e.scrollWidth<=e.clientWidth+1)).toBe(true);await expect(table.getByRole('button',{name:en?'Add data to graph':'Добавить данные к графику',exact:true})).toBeVisible();await header(en?'Graph properties':'Свойства графика').click();
   for(const button of await page.locator('header>button').all()){const b=(await button.boundingBox())!;expect(b.x).toBeGreaterThanOrEqual(0);expect(b.x+b.width).toBeLessThanOrEqual(width)}
   await expect(page.getByTestId('chart').locator(':scope>rect')).toHaveCSS('fill',dark?'rgb(0, 0, 0)':'rgb(255, 255, 255)');
   if(width===1280&&density===1){
    await page.screenshot({path:info.outputPath(`properties-${theme}-${language}.png`)});
    await panel.getByRole('button',{name:en?'Close':'Закрыть',exact:true}).click();
    for(const [ru,english] of [['Настройки','Settings'],['Математика','Mathematics'],['Экспорт','Export'],['История','History'],['Таблица','Data table'],['Импорт данных','Import data']]){
     await header(en?english:ru).click();const current=page.locator('.panel');await expect(current).toBeVisible();
     expect(await current.evaluate(e=>e.getBoundingClientRect().right<=innerWidth)).toBe(true);
     await page.screenshot({path:info.outputPath(`${english.replaceAll(' ','-').toLowerCase()}-${theme}-${language}.png`)});
     await current.getByRole('button',{name:en?'Close':'Закрыть',exact:true}).click();
    }
   }
   expect(errors).toEqual([]);rows.push({width,height,language,theme,density,largeUI,passed:true});
  }finally{await context.close()}
 }
 await info.attach('matrix.json',{body:JSON.stringify(rows,null,2),contentType:'application/json'});
});
