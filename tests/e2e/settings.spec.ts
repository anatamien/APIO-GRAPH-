import {enterEditor} from './helpers';
import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import {createProject,makeObject} from '../../src/domain/model';

test('SYS-T03/EDT/EXP localized controls, source markers, aspect ratio and system dark theme',async({page})=>{
 await page.emulateMedia({colorScheme:'dark'});await page.goto('/');await enterEditor(page);
 await page.locator('header').getByRole('button',{name:'Настройки',exact:true}).click();
 await page.getByLabel('Исходные маркеры',{exact:true}).uncheck();
 await page.getByLabel('Язык',{exact:true}).selectOption('en');
 expect(await page.locator('.app-header').evaluate(el=>getComputedStyle(el).backgroundColor)).toBe('rgb(0, 0, 0)');
 await expect(page.getByLabel('Source markers',{exact:true})).not.toBeChecked();
 await expect(page.getByLabel('Legend X (0–1)',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Close',exact:true}).click();
 await page.locator('header').getByRole('button',{name:'Export',exact:true}).click();
 await page.getByLabel('Width',{exact:true}).fill('1800');await page.getByLabel('Width',{exact:true}).press('Tab');
 await expect(page.getByLabel('Height',{exact:true})).toHaveValue('1200');
 await page.getByLabel('Lock aspect ratio',{exact:true}).uncheck();
 await page.getByLabel('Height',{exact:true}).fill('900');await page.getByLabel('Height',{exact:true}).press('Tab');
 await expect(page.getByLabel('Width',{exact:true})).toHaveValue('1800');
});

test('OBJ-T11 percentage opacity and text rotation persist through aph',async({page})=>{
 const p=createProject(),o=makeObject('text',[{mode:'page',pageX:0.3,pageY:0.35}],'User label ρ');p.objects.push(o);
 await page.goto('/');await enterEditor(page);await page.locator('input[type=file]').setInputFiles({name:'rotation.aph',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(p))});
 await page.locator(`[data-object="${o.id}"] text`).dblclick();
 for(const [name,value]of[['Поворот, °','45'],['Непрозрачность, %','20']]){await page.getByLabel(name,{exact:true}).fill(value);await page.getByLabel(name,{exact:true}).press('Tab')}
 await expect(page.locator(`[data-object="${o.id}"] text`)).toHaveAttribute('transform',/rotate\(45 /);
 await page.locator(`[data-object="${o.id}"] text`).click();await page.keyboard.press('Control+d');await expect(page.locator('[data-object]')).toHaveCount(2);
 const pending=page.waitForEvent('download');await page.locator('header').getByRole('button',{name:'Сохранить',exact:true}).click();
 const saved=JSON.parse(await readFile((await (await pending).path())!,'utf8'));
 expect(saved.objects[0].style.strokeOpacity).toBe(.2);expect(saved.extensions.textRotation[o.id]).toBe(45);expect(saved.extensions.textRotation[saved.objects[1].id]).toBe(45);
 expect(saved.objects[0].text[0].text).toBe('User label ρ');
});

test('IMP-T14 unknown encoding requires explicit preview; original source rows are saved',async({page})=>{
 await page.goto('/');await enterEditor(page);
 await page.locator('header').getByRole('button',{name:'Настройки',exact:true}).click();
 // Windows-1251: "Х У\n0 1\n1 2". Invalid UTF-8 must not be silently replaced.
 await page.locator('input[type=file]').setInputFiles({name:'encoding.txt',mimeType:'text/plain',buffer:Buffer.from([0xd5,32,0xd3,10,48,32,49,10,49,32,50])});
 await expect(page.locator('.panel')).toHaveCount(1);
 await page.keyboard.press('Escape');await expect(page.locator('.panel')).toHaveCount(0);
 await page.locator('input[type=file]').setInputFiles({name:'encoding.txt',mimeType:'text/plain',buffer:Buffer.from([0xd5,32,0xd3,10,48,32,49,10,49,32,50])});
 await expect(page.getByText('Выберите кодировку файла.',{exact:false})).toBeVisible();
 await expect(page.getByLabel('Предпросмотр',{exact:true})).toHaveValue('Х У\n0 1\n1 2');
 await page.getByRole('button',{name:'Применить',exact:true}).click();
 await expect(page.getByRole('dialog',{name:'Импорт файла',exact:true})).toBeVisible();await expect(page.locator('.import-panel textarea')).toHaveCount(0);
 await page.getByRole('button',{name:'Построить',exact:true}).click();
 const pending=page.waitForEvent('download');await page.locator('header').getByRole('button',{name:'Сохранить',exact:true}).click();
 const saved=JSON.parse(await readFile((await (await pending).path())!,'utf8'));
 expect(saved.axes.x.label).toBe('Х');expect(saved.axes.y.label).toBe('У');
 expect(Object.values(saved.extensions.sourceRows[saved.datasets[0].id])).toEqual([2,3]);
});
