import {test,expect} from '@playwright/test';
test('PRJ new import opens a separate graph with its own save name',async({page})=>{
 await page.goto('/');await page.locator('input[type=file]').setInputFiles('examples/example.aph');
 await page.locator('header').getByRole('button',{name:'Импорт данных',exact:true}).click();
 const panel=page.getByRole('dialog',{name:'Импорт данных',exact:true});await panel.getByLabel('Исходный текст').fill('0 10\n1 20');await expect(panel.getByLabel('Новый график (отдельная вкладка)',{exact:true})).toBeChecked();await panel.getByRole('button',{name:'Построить',exact:true}).click();
 await expect(page.getByRole('tab')).toHaveCount(2);await expect(page.getByRole('tab',{selected:true})).toContainText('График');
 const dl=page.waitForEvent('download');await page.locator('header').getByRole('button',{name:'Сохранить',exact:true}).click();expect((await dl).suggestedFilename()).toMatch(/^График \d+\.aph$/);
});
test('MTH derived table rows are readable but cannot invalidate scientific recipes by editing',async({page})=>{
 await page.goto('/');await page.locator('input[type=file]').setInputFiles('examples/annotated-calculated.aph');await page.locator('header').getByRole('button',{name:'Таблица',exact:true}).click();
 const panel=page.getByRole('dialog',{name:'Таблица данных',exact:true});await panel.getByLabel('Серия / набор данных',{exact:true}).selectOption({label:'Линейный тренд'});await expect(panel.getByRole('button',{name:'Добавить строку',exact:true})).toBeDisabled();await panel.getByRole('button',{name:'Y 1: 1',exact:true}).dblclick();await expect(panel.getByRole('textbox',{name:'Y 1',exact:true})).toHaveCount(0);await expect(panel).toContainText('только для чтения');
});
