import {test,expect,type Page} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import {addPairs,createProject,makeObject} from '../../src/domain/model';

const button=(page:Page,name:string)=>page.locator('header').getByRole('button',{name,exact:true});
async function fixture(page:Page,background='#FFFFFF'){
 let p=addPairs(createProject(),[{x:0,y:1},{x:5,y:8},{x:10,y:4}],'Default');p=addPairs(p,[{x:0,y:3},{x:10,y:6}],'Custom');p.series[1].style.stroke='#D04040';p.page.background=background;
 p.objects=[makeObject('text',[{mode:'page',pageX:.3,pageY:.25}],'Annotation')];
 await page.goto('/');await page.locator('input[type=file]').setInputFiles({name:'theme-curves.aph',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(p))});return p;
}
async function setTheme(page:Page,theme:string){await button(page,'Настройки').click();await page.getByLabel('Тема',{exact:true}).selectOption(theme);await page.locator('.panel').getByRole('button',{name:'Закрыть',exact:true}).click()}

test('light, dark and both system themes adapt the default canvas and curve without changing saved colors or data',async({page},info)=>{
 const p=await fixture(page),chart=page.getByTestId('chart');expect(p.series[0].style.stroke).toBe('#000000');
 for(const [theme,systemDark] of [['light',false],['dark',false],['system',true],['system',false]] as const){
  await page.emulateMedia({colorScheme:systemDark?'dark':'light'});await setTheme(page,theme);const dark=theme==='dark'||theme==='system'&&systemDark,ink=dark?'rgb(255, 255, 255)':'rgb(0, 0, 0)';
  await expect(chart.locator('[data-canvas-paper]')).toHaveCSS('fill',dark?'rgb(0, 0, 0)':'rgb(255, 255, 255)');
  await expect(chart.locator('[data-target="axis:y"] text').first()).toHaveCSS('fill',ink);await expect(chart.locator('[data-canvas-grid] line').first()).toHaveCSS('stroke',ink);
  await expect(chart.locator(`[data-series="${p.series[0].id}"] path[stroke="#000000"]`).first()).toHaveCSS('stroke',ink);await expect(chart.locator(`[data-series="${p.series[1].id}"] path[stroke="#D04040"]`).first()).toHaveCSS('stroke','rgb(208, 64, 64)');
  await expect(chart.locator('[data-object] text')).toHaveCSS('fill',ink);
  if(theme!=='system')await page.screenshot({path:info.outputPath(`canvas-${theme}.png`)});
 }
 const pending=page.waitForEvent('download');await button(page,'Сохранить').click();const saved=JSON.parse(await readFile((await(await pending).path())!,'utf8'));expect(saved.datasets).toEqual(p.datasets);expect(saved.series).toEqual(p.series);expect(saved.page).toEqual(p.page);expect(saved.objects).toEqual(p.objects);
 await setTheme(page,'dark');await button(page,'Экспорт').click();const panel=page.locator('.export-panel');await panel.getByLabel('Формат',{exact:true}).selectOption('svg');const fallback=panel.getByLabel('Продолжить с системным моноширинным шрифтом',{exact:true});if(await fallback.count())await fallback.check();const download=page.waitForEvent('download');await panel.getByRole('button',{name:'Сохранить изображение',exact:true}).click();const svg=await readFile((await(await download).path())!,'utf8');expect(svg).toContain('fill="#FFFFFF"');expect(svg).toContain('stroke="#000000"');expect(svg).toContain('stroke="#D04040"');expect(svg).not.toContain('var(--plot');expect(svg).not.toContain('data-canvas-');
});

test('an explicitly colored project background retains its stored appearance',async({page})=>{
 await fixture(page,'#FFF4CC');await setTheme(page,'dark');const chart=page.getByTestId('chart');await expect(chart.locator(':scope > rect')).toHaveCSS('fill','rgb(255, 244, 204)');await expect(chart).not.toHaveAttribute('data-canvas-themed');await expect(chart.locator('[data-series] path[stroke="#000000"]').first()).toHaveCSS('stroke','rgb(0, 0, 0)');
});

test('tabs use a quiet border and tool icons enlarge without moving their hit targets or neighbors',async({page},info)=>{
 await fixture(page);await setTheme(page,'dark');const tab=page.getByRole('tab',{selected:true}).locator('..');await expect(tab).toHaveCSS('box-shadow','none');await expect(tab).toHaveCSS('border-top-color','rgb(66, 66, 68)');await expect(page.getByRole('tab',{selected:true})).toHaveCSS('font-weight','600');
 const toolbar=page.getByRole('toolbar');await toolbar.locator('.tool-trigger').hover();await expect(toolbar.locator('.tool-items').first()).toHaveCSS('transform','matrix(1, 0, 0, 1, 0, 0)');
 const tool=toolbar.getByRole('button',{name:'Увеличить масштаб',exact:true}),neighbor=toolbar.getByRole('button',{name:'Уменьшить масштаб',exact:true}),targetBox=await tool.boundingBox(),neighborBox=await neighbor.boundingBox();await tool.hover();await expect.poll(()=>tool.locator('svg').evaluate(e=>new DOMMatrix(getComputedStyle(e).transform).a)).toBeCloseTo(1.1,2);expect(await tool.boundingBox()).toEqual(targetBox);expect(await neighbor.boundingBox()).toEqual(neighborBox);await page.screenshot({path:info.outputPath('tabs-tools-dark.png')});
 await page.emulateMedia({reducedMotion:'reduce'});await expect(tool.locator('svg')).toHaveCSS('transform','none');await page.emulateMedia({reducedMotion:'no-preference'});await button(page,'Настройки').click();await page.getByLabel('Анимация',{exact:true}).uncheck();await page.getByRole('button',{name:'Закрыть',exact:true}).click();await toolbar.locator('.tool-trigger').hover();await tool.hover();await expect(tool.locator('svg')).toHaveCSS('transform','none');
});
