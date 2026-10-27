import {test,expect} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import {readWorkspace} from '../../src/features/workspace/archive';
test('PRJ new import opens a separate graph and common Save retains both independent graphs',async({page})=>{
 await page.goto('/');await page.locator('input[type=file]').setInputFiles('examples/example.aph');
 await page.locator('header').getByRole('button',{name:'Импорт данных',exact:true}).click();
 const panel=page.getByRole('dialog',{name:'Импорт данных',exact:true});await panel.getByLabel('Исходный текст').fill('0 10\n1 20');await expect(panel.getByLabel('Новый график (отдельная вкладка)',{exact:true})).toBeChecked();await panel.getByRole('button',{name:'Построить',exact:true}).click();
 await expect(page.getByRole('tab')).toHaveCount(2);await expect(page.getByRole('tab',{selected:true})).toContainText('График');
 const dl=page.waitForEvent('download');await page.locator('header').getByRole('button',{name:'Сохранить',exact:true}).click();const file=await dl;expect(file.suggestedFilename()).toBe('APIO GRAPH.aph');const archive=await readWorkspace(new Uint8Array(await readFile((await file.path())!)));expect(archive.manifest.tabs).toHaveLength(2);const current=archive.graph(archive.manifest.activeId!);expect(current.datasets[0].points.map(({x,y})=>[x,y])).toEqual([[0,10],[1,20]]);expect(archive.graph(archive.manifest.tabs[0].id).datasets).not.toEqual(current.datasets);
});
test('MTH derived table rows are readable but cannot invalidate scientific recipes by editing',async({page})=>{
 await page.goto('/');await page.locator('input[type=file]').setInputFiles('examples/annotated-calculated.aph');await page.locator('header').getByRole('button',{name:'Таблица',exact:true}).click();
 const panel=page.getByRole('dialog',{name:'Таблица данных',exact:true});await panel.getByLabel('Серия / набор данных',{exact:true}).selectOption({label:'Линейный тренд'});await expect(panel.getByRole('button',{name:'Добавить строку',exact:true})).toBeDisabled();await panel.getByRole('button',{name:'Y 1: 1',exact:true}).dblclick();await expect(panel.getByRole('textbox',{name:'Y 1',exact:true})).toHaveCount(0);await expect(panel).toContainText('только для чтения');
});
