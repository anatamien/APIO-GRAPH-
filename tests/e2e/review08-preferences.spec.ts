import {test,expect} from '@playwright/test';
import {createProject,addPairs} from '../../src/domain/model';
test('08 confirmed arrow parameters persist and apply only to a newly drawn arrow',async({page})=>{
 const p=addPairs(createProject(),[{x:0,y:0},{x:1,y:1}],'Source');await page.goto('/');await page.locator('input[type=file]').setInputFiles({name:'Preferences.aph',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(p))});
 const draw=async(key:string,y:number)=>{await page.getByTestId('chart').click({position:{x:800,y:500}});await page.keyboard.press(key);await page.mouse.move(350,y);await page.mouse.down();await page.mouse.move(520,y+35,{steps:4});await page.mouse.up();await page.locator('[data-object]').last().locator('line').last().dblclick()};
 await draw('a',220);await page.getByLabel('Толщина, pt',{exact:true}).fill('2.75');await draw('a',320);await expect(page.getByLabel('Толщина, pt',{exact:true})).toHaveValue('2.75');await draw('l',420);await expect(page.getByLabel('Толщина, pt',{exact:true})).toHaveValue('1');
 await page.reload();await page.locator('input[type=file]').setInputFiles({name:'Old unchanged.aph',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(p))});await expect(page.getByTestId('chart')).toBeVisible();await draw('a',520);await expect(page.getByLabel('Толщина, pt',{exact:true})).toHaveValue('2.75');
});
