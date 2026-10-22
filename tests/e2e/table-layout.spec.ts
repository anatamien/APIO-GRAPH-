import {test,expect,type Page} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import {addPairs,createProject,makeSeries} from '../../src/domain/model';
import {addCalculation,calculatePreview} from '../../src/features/analysis/operations';
const header=(p:Page,name:string)=>p.locator('header').getByRole('button',{name,exact:true});
for(const language of ['ru','en'])for(const theme of ['light','dark','system'])test(`table layout ${language}/${theme}: virtual rows, shared datasets, derived properties and narrow large UI`,async({page},info)=>{
 await page.addInitScript(({language,theme})=>localStorage.setItem('apio.settings',JSON.stringify({language,theme})),{language,theme});await page.emulateMedia({colorScheme:'dark'});
 const raw=addPairs(createProject(),Array.from({length:100000},(_,x)=>({x,y:Math.sin(x/20)})),'A');raw.series.push(makeSeries(raw.datasets[0].id,'A alternate',1));
 const result=calculatePreview('moving-average',raw.datasets[0].points,{window:5}),p=addCalculation(raw,raw.series[0].id,'moving-average',{window:5},result,'B');
 await page.goto('/');await page.locator('input[type=file]').setInputFiles({name:'table.aph',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(p))});await header(page,language==='ru'?'Таблица':'Data table').click();
 const panel=page.locator('.data-panel'),selector=panel.getByLabel(language==='ru'?'Серия / набор данных':'Series / dataset',{exact:true});await expect(selector.locator('option')).toHaveCount(3);
 await selector.selectOption(p.series[1].id);await expect(panel.locator('table')).toHaveAttribute('aria-rowcount','100001');
 const grid=panel.locator('.data-grid');await grid.evaluate(el=>el.scrollTop=34*50000);await expect(panel.locator('[data-point-id]').first()).toHaveAttribute('aria-rowindex',String(49996+2));expect(await panel.locator('[data-point-id]').count()).toBeLessThan(40);
 const bounds=await panel.evaluate(el=>({width:el.clientWidth,overflow:el.scrollWidth-el.clientWidth,grid:el.querySelector('.data-grid')!.clientHeight}));expect(bounds.width).toBeLessThanOrEqual(480);expect(bounds.overflow).toBe(0);expect(bounds.grid).toBeGreaterThan(200);
 await page.screenshot({path:info.outputPath(`table-${language}-${theme}.png`)});
 await selector.selectOption(p.series[2].id);await expect(panel.getByRole('button',{name:language==='ru'?'Добавить строку':'Add row',exact:true})).toBeDisabled();await panel.getByRole('button',{name:language==='ru'?'Свойства выбранной серии':'Selected series properties',exact:true}).click();await expect(page.getByLabel(language==='ru'?'Текущая серия':'Current series',{exact:true})).toHaveValue(p.series[2].id);
 await header(page,language==='ru'?'Настройки':'Settings').click();await page.getByLabel(language==='ru'?'Увеличенный интерфейс':'Larger interface',{exact:true}).check();await page.setViewportSize({width:700,height:500});await header(page,language==='ru'?'Таблица':'Data table').click();await page.screenshot({path:info.outputPath(`table-${language}-${theme}-700-large.png`)});
 expect(await panel.evaluate(el=>el.scrollWidth-el.clientWidth)).toBe(0);await expect(panel.getByRole('button',{name:language==='ru'?'Добавить данные к графику':'Add data to graph',exact:true})).toBeVisible();
});
test('table file append and cancel leave the other open graph intact',async({page})=>{
 const p=addPairs(createProject(),[{x:0,y:1},{x:1,y:2}],'A');await page.goto('/');await page.locator('input[type=file]').setInputFiles({name:'A.aph',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(p))});await header(page,'Таблица').click();
 let chooser=page.waitForEvent('filechooser');await page.getByRole('button',{name:'Добавить данные к графику',exact:true}).click();await page.getByRole('button',{name:'Из файла',exact:true}).click();await(await chooser).setFiles({name:'new.txt',mimeType:'text/plain',buffer:Buffer.from('2 3\n3 4')});
 await expect(page.locator('.import-destination')).toHaveCount(0);await page.getByRole('button',{name:'Закрыть',exact:true}).click();await expect(header(page,'Отменить')).toBeDisabled();await expect(page.getByRole('tab')).toHaveCount(1);
 await header(page,'Таблица').click();chooser=page.waitForEvent('filechooser');await page.getByRole('button',{name:'Добавить данные к графику',exact:true}).click();await page.getByRole('button',{name:'Из файла',exact:true}).click();await(await chooser).setFiles({name:'new.txt',mimeType:'text/plain',buffer:Buffer.from('2 3\n3 4')});await page.getByRole('button',{name:'Построить',exact:true}).click();
 const pending=page.waitForEvent('download');await header(page,'Сохранить').click();const saved=JSON.parse(await readFile((await(await pending).path())!,'utf8'));expect(saved.datasets).toHaveLength(2);expect(saved.datasets[0]).toEqual(p.datasets[0]);expect(saved.viewport).toEqual(p.viewport);await expect(page.getByRole('tab')).toHaveCount(1);
});
