import {downloadedGraph} from './projectDownload';
import {test,expect,type Page} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import {addPairs,createProject} from '../../src/domain/model';
const header=(p:Page,name:string)=>p.locator('header').getByRole('button',{name,exact:true});
async function save(p:Page){const pending=p.waitForEvent('download');await header(p,'Сохранить').click();return await downloadedGraph(await readFile((await(await pending).path())!))}
test('unconfirmed append and partial row leave document and history unchanged; confirmed pairs stay on current axes',async({page})=>{
 await page.goto('/');const p=addPairs(createProject(),[{x:1,y:2},{x:3,y:4}],'A');p.viewport={xMin:-20,xMax:20,yMin:-10,yMax:10};
 await page.locator('input[type=file]').setInputFiles({name:'A.aph',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(p))});await header(page,'Таблица').click();const table=page.locator('.data-panel');const before=await save(page);
 await expect(table.getByRole('button',{name:'Дублировать строку',exact:true})).toBeDisabled();await expect(table.getByRole('button',{name:'Удалить строку',exact:true})).toBeDisabled();
 const chartBox=(await page.getByTestId('chart').boundingBox())!,panelBox=(await table.boundingBox())!,clip={x:chartBox.x,y:chartBox.y,width:panelBox.x-chartBox.x,height:chartBox.height},imageBefore=await page.screenshot({clip});
 await table.getByRole('button',{name:'Добавить данные к графику',exact:true}).click();await table.getByRole('button',{name:'Ввести вручную',exact:true}).click();
 expect((await save(page)).datasets).toEqual(before.datasets);await table.getByRole('textbox',{name:'Новая точка X',exact:true}).fill('17.2');
 await expect(table.getByRole('button',{name:'Добавить точку',exact:true})).toBeDisabled();await table.getByRole('button',{name:'Отмена',exact:true}).click();
 const cancel=await save(page);for(const key of ['series','datasets','viewport','legend'] as const)expect(cancel[key]).toEqual(before[key]);await expect(header(page,'Отменить')).toBeDisabled();expect(await page.screenshot({clip})).toEqual(imageBefore);
 await table.getByRole('button',{name:'Добавить данные к графику',exact:true}).click();await table.getByRole('button',{name:'Вставить таблицу',exact:true}).click();
 const imp=page.locator('.import-panel');await imp.getByLabel('Исходный текст',{exact:true}).fill('10;15\n11;16');await imp.getByRole('button',{name:'Построить',exact:true}).click();
 const after=await save(page);expect(after.datasets).toHaveLength(2);expect(after.datasets[0]).toEqual(before.datasets[0]);expect(after.datasets[1].points.map((v:{x:number;y:number})=>[v.x,v.y])).toEqual([[10,15],[11,16]]);expect(after.viewport).toEqual(before.viewport);await expect(page.getByRole('tab')).toHaveCount(1);
});
test('copy table preserves the IEEE sign of negative zero',async({page,context})=>{
 await context.grantPermissions(['clipboard-read','clipboard-write']);await page.goto('/');const p=addPairs(createProject(),[{x:-0,y:1},{x:2,y:-0}],'signed');
 const json=JSON.stringify(p).replace('"x":0','"x":-0').replace('"y":0','"y":-0');await page.locator('input[type=file]').setInputFiles({name:'signed.aph',mimeType:'application/json',buffer:Buffer.from(json)});await header(page,'Таблица').click();await page.getByRole('button',{name:'Копировать таблицу',exact:true}).click();expect((await page.evaluate(()=>navigator.clipboard.readText())).replace(/\r\n/g,'\n')).toBe('-0\t1\n2\t-0');
});
test('global clipboard import restores explicit new-tab destination after canceling a table append',async({page})=>{
 await page.goto('/');const p=addPairs(createProject(),[{x:0,y:1},{x:1,y:2}],'A');await page.locator('input[type=file]').setInputFiles({name:'A.aph',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(p))});
 await header(page,'Таблица').click();await page.getByRole('button',{name:'Добавить данные к графику',exact:true}).click();await page.getByRole('button',{name:'Вставить таблицу',exact:true}).click();await page.getByRole('button',{name:'Закрыть',exact:true}).click();
 await page.locator('.chart-host').evaluate(el=>{const data=new DataTransfer();data.setData('text/plain','2 3\n3 4');el.dispatchEvent(new ClipboardEvent('paste',{clipboardData:data,bubbles:true,cancelable:true}))});
 await expect(page.getByLabel('Новый график (отдельная вкладка)',{exact:true})).toBeChecked();await page.getByRole('button',{name:'Построить',exact:true}).click();await expect(page.getByRole('tab')).toHaveCount(2);
});
test('a row is committed only after both coordinates, cancel never creates a fabricated zero point',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Новый проект',exact:true}).click();await page.getByRole('button',{name:'Вручную',exact:true}).click();const table=page.locator('.data-panel');
 await table.getByRole('button',{name:'Добавить строку',exact:true}).click();await expect(table.locator('[data-point-id]')).toHaveCount(0);
 await table.getByRole('textbox',{name:'Новая точка X',exact:true}).fill('-2.5e1');await table.getByRole('textbox',{name:'Новая точка Y',exact:true}).fill('7');await table.getByRole('button',{name:'Добавить точку',exact:true}).click();
 const p=await save(page);expect(p.datasets).toHaveLength(1);expect(p.datasets[0].points).toEqual([{id:expect.any(String),x:-25,y:7}]);
});
