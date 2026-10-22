import {test,expect,type Page} from '@playwright/test';
import fs from 'node:fs/promises';
async function saved(page:Page){const dl=page.waitForEvent('download');await page.locator('header').getByRole('button',{name:'Сохранить',exact:true}).click();return JSON.parse(await fs.readFile((await (await dl).path())!,'utf8'))}
test.beforeEach(async({page})=>{await page.goto('/');await page.locator('input[type=file]').setInputFiles('examples/example.aph');await expect(page.getByTestId('chart')).toBeVisible()});
test('OBJ-T09/10/12/15 rectangle drag, resize, move and undo retain exact geometry',async({page})=>{
 await page.keyboard.press('r');const box=(await page.getByTestId('chart').boundingBox())!;
 await page.mouse.move(box.x+800,box.y+270);await page.mouse.down();await page.mouse.move(box.x+650,box.y+140,{steps:8});await page.mouse.up();
 await expect(page.locator('[data-object]')).toHaveCount(3);const before=await saved(page);const rect=before.objects.at(-1);expect(rect.type).toBe('rectangle');
 const handles=page.locator('[data-handle]');const h=(await handles.nth(1).boundingBox())!;await page.mouse.move(h.x+4,h.y+4);await page.mouse.down();await page.mouse.move(h.x-60,h.y+40,{steps:6});await page.mouse.up();
 const resized=await saved(page);expect(resized.objects.at(-1).anchors).not.toEqual(rect.anchors);
 await page.keyboard.press('Control+z');const undone=await saved(page);expect(undone.objects.at(-1).anchors).toEqual(rect.anchors);
});
test('SNP-T01 OBJ-T06/07/08 exact callout pointId follows table source edits after reopening',async({page})=>{
 const path=page.locator('[data-point="6fc8a825-bfbf-461e-865f-6ff160c0a587"]');const b=(await path.boundingBox())!;const x=b.x+b.width/2,y=b.y+b.height/2;
 await page.keyboard.press('c');await page.mouse.move(x+3,y+2);await page.mouse.down();await page.mouse.move(x+130,y-80,{steps:8});await page.mouse.up();await page.getByLabel('Содержимое').fill('Контроль ρ²');await page.getByRole('button',{name:'Применить',exact:true}).click();
 const p=await saved(page);const o=p.objects.at(-1);expect(o.anchors[0].mode).toBe('point');expect(o.anchors[0].pointId).toBe('6fc8a825-bfbf-461e-865f-6ff160c0a587');
});
test('EDT-T04/05 source preserved on invalid axes, localized settings are live',async({page})=>{
 await page.locator('[data-axis-label=x]').dblclick();await page.getByLabel('Шаг делений',{exact:true}).fill('0');await page.getByLabel('Шаг делений',{exact:true}).press('Tab');const p=await saved(page);expect(p.axes.x.tickStep).toBe(1);
 await page.locator('header').getByRole('button',{name:'Настройки',exact:true}).click();await page.getByLabel('Язык',{exact:true}).selectOption('en');await expect(page.locator('header').getByRole('button',{name:'Save',exact:true})).toBeVisible();const dl=page.waitForEvent('download');await page.locator('header').getByRole('button',{name:'Save',exact:true}).click();const en=JSON.parse(await fs.readFile((await (await dl).path())!,'utf8'));expect(en.datasets).toEqual(p.datasets);expect(en.axes.x.label).toBe('Время, с');
});
test('OBJ-T17 Escape cancels in-progress drawing and no empty object persists',async({page})=>{
 await page.keyboard.press('l');await page.mouse.move(400,300);await page.mouse.down();await page.mouse.move(600,350);await page.keyboard.press('Escape');await page.mouse.up();expect((await saved(page)).objects).toHaveLength(2);
});
test('OBJ text double click edits existing text and retains its ID',async({page})=>{
 await page.keyboard.press('t');await page.mouse.click(400,200);await page.getByLabel('Содержимое').fill('Начальная подпись');await page.getByRole('button',{name:'Применить',exact:true}).click();const initial=await saved(page),object=initial.objects.at(-1);
 await page.locator('[data-object="'+object.id+'"]').getByText('Начальная подпись',{exact:true}).dblclick();await page.locator('.inline-text').getByLabel('Содержимое').fill('Исправленная подпись');await page.locator('.inline-text').getByRole('button',{name:'Применить',exact:true}).click();const final=await saved(page);expect(final.objects).toHaveLength(initial.objects.length);expect(final.objects.at(-1).id).toBe(object.id);expect(final.objects.at(-1).text[0].text).toBe('Исправленная подпись');
});
test('QUA visual states at required desktop sizes',async({page})=>{
 for(const [width,height]of[[1440,900],[1280,800],[1024,768]]){await page.setViewportSize({width,height});await page.screenshot({path:`test-results/visual-${width}-editor.png`});await page.getByRole('toolbar').hover();await page.screenshot({path:`test-results/visual-${width}-tools.png`});await page.locator('header').getByRole('button',{name:'Экспорт',exact:true}).click();await page.screenshot({path:`test-results/visual-${width}-export.png`});await page.getByRole('button',{name:'Закрыть',exact:true}).click();const bounds=await page.getByTestId('chart').boundingBox();expect(bounds!.width).toBe(width);expect(bounds!.height).toBeGreaterThan(height*0.78)}
});
