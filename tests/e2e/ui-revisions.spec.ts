import {downloadedGraph} from './projectDownload';
import {enterEditor} from './helpers';
import {test,expect,type Page} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import {createProject,addPairs,makeObject,type ProjectDocument} from '../../src/domain/model';

async function open(page:Page,p=addPairs(createProject(),[{x:0,y:0},{x:10,y:10}],'Source')){
 p.series=p.series.map(s=>({...s,mode:'line-points',style:{...s.style,markerVisible:true}}));p.legend.visible=false;await page.goto('/');await page.locator('input[type=file]').setInputFiles({name:'ui.aph',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(p))});await expect(page.locator('.welcome-screen')).toHaveCount(0);return p;
}
async function saved(page:Page):Promise<ProjectDocument>{const pending=page.waitForEvent('download');await page.locator('header').getByRole('button',{name:'Сохранить',exact:true}).click();return await downloadedGraph(await readFile((await (await pending).path())!))}
async function text(page:Page,value:string,x=350,y=240){await page.keyboard.press('t');const box=(await page.getByTestId('chart').boundingBox())!;await page.mouse.click(box.x+x,box.y+y);await page.locator('.inline-text textarea').fill(value);await page.locator('.inline-text').getByRole('button',{name:'Применить'}).click()}

test('welcome hides the canvas; both project creation routes and project opening work',async({page})=>{
 await page.goto('/');await expect(page.getByTestId('chart')).toHaveCount(0);await expect(page.getByRole('button',{name:'Открыть проект',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Новый проект',exact:true}).click();await expect(page.getByTestId('chart')).toHaveCount(0);await page.getByRole('button',{name:'Вручную',exact:true}).click();await expect(page.getByRole('dialog',{name:'Таблица данных',exact:true})).toBeVisible();
 await open(page);await expect(page.getByTestId('chart')).toBeVisible();
});

for(const language of ['ru','en'] as const)test(`file import reuses preview, aligns X/Y and radio controls at 1024×768 (${language})`,async({page})=>{
 await page.setViewportSize({width:1024,height:768});await page.goto('/');await enterEditor(page);
 if(language==='en'){await page.locator('header').getByRole('button',{name:'Настройки',exact:true}).click();await page.getByLabel('Язык',{exact:true}).selectOption('en');await page.getByRole('button',{name:'Close',exact:true}).click()}
 await page.locator('header').getByRole('button',{name:language==='ru'?'Импорт данных':'Import data',exact:true}).click();
 const chooser=page.waitForEvent('filechooser');await page.getByRole('button',{name:language==='ru'?'Выбрать файл':'Choose file',exact:true}).click();await (await chooser).setFiles('tests/fixtures/import/tabs.tsv');
 const panel=page.locator('.import-panel');await expect(panel.locator('textarea')).toHaveCount(0);await expect(panel.getByRole('heading',{name:language==='ru'?'Импорт файла':'Import file',exact:true})).toBeVisible();await expect(panel.locator('.panel-header')).toContainText('tabs.tsv');await expect(panel.locator('table')).toBeVisible();
 const boxes=await panel.locator('.mapping-row select').evaluateAll(nodes=>nodes.map(n=>n.getBoundingClientRect().toJSON()));expect(boxes[0].y).toBe(boxes[1].y);expect(boxes[1].x).toBeGreaterThan(boxes[0].x+boxes[0].width);
 for(const radio of await panel.getByRole('radio').all()){const box=(await radio.boundingBox())!;expect(box.width).toBeLessThanOrEqual(18);expect(box.height).toBeLessThanOrEqual(18)}
 await panel.getByRole('button',{name:language==='ru'?'Построить':'Plot',exact:true}).click();await expect(page.locator('[data-series]')).toHaveCount(1);
 await page.screenshot({path:`test-results/ui-import-${language}.png`});
});

test('panels dock, float, clamp on resize, redock by keyboard and keep their header visible',async({page})=>{
 await open(page);await page.locator('header').getByRole('button',{name:'Настройки',exact:true}).click();const panel=page.locator('.panel');
 const chart=(await page.getByTestId('chart').boundingBox())!,initial=(await panel.boundingBox())!;expect(initial.y).toBe(chart.y);expect(initial.y+initial.height).toBe(chart.y+chart.height);
 const header=panel.locator('.panel-header'),h=(await header.boundingBox())!;await page.mouse.move(h.x+40,h.y+20);await page.mouse.down();await page.mouse.move(h.x-300,h.y+100,{steps:8});await page.mouse.up();await expect(panel).toHaveAttribute('data-docked','false');
 await page.setViewportSize({width:1024,height:768});
 // ResizeObserver clamps the panel before the next paint, after the resize task.
 await expect.poll(async()=>{const b=(await panel.boundingBox())!;return b.x+b.width}).toBeLessThanOrEqual(1024);
 const floating=(await panel.boundingBox())!;expect(floating.x).toBeGreaterThanOrEqual(0);expect(floating.y).toBeGreaterThanOrEqual(chart.y);
 await header.focus();await page.keyboard.press('Escape');await expect(panel).toHaveAttribute('data-docked','true');await expect(panel.getByRole('button',{name:'Закрыть',exact:true})).toBeVisible();
});

test('history previews without mutation; click and keyboard restore states and a new edit removes redo',async({page})=>{
 await open(page);await text(page,'First');await text(page,'Second',500,320);await expect(page.locator('[data-selected-object]')).toHaveCount(0);
 await page.locator('header').getByRole('button',{name:'История',exact:true}).click();const entries=page.locator('.history-list button');await expect(entries).toHaveCount(3);
 await entries.nth(1).hover();await expect(page.locator('[data-object]')).toHaveCount(1);await page.mouse.move(100,100);await expect(page.locator('[data-object]')).toHaveCount(2);
 await entries.nth(0).focus();await expect(page.locator('[data-object]')).toHaveCount(0);await page.keyboard.press('Escape');await expect(page.locator('[data-object]')).toHaveCount(2);await expect(page.locator('.history-panel')).toBeVisible();
 await page.keyboard.press('ArrowDown');await expect(page.locator('[data-object]')).toHaveCount(1);await page.keyboard.press('Enter');await expect(page.locator('[data-object]')).toHaveCount(1);await expect(page.locator('header').getByRole('button',{name:'Повторить',exact:true})).toBeEnabled();
 await page.getByRole('button',{name:'Закрыть',exact:true}).click();await text(page,'Branch',450,380);await page.locator('header').getByRole('button',{name:'История',exact:true}).click();await expect(entries).toHaveCount(3);await expect(page.locator('header').getByRole('button',{name:'Повторить',exact:true})).toBeDisabled();
 expect((await saved(page)).objects.map(o=>o.text[0].text)).toEqual(['First','Branch']);
});

test('middle button pans with a drawing tool, symmetric zoom and fit preserve data and Undo',async({page})=>{
 const original=await open(page);const before=await saved(page);await page.keyboard.press('r');
 await page.mouse.move(400,300);await page.mouse.down({button:'middle'});await page.mouse.move(500,380,{steps:10});await page.mouse.up({button:'middle'});await page.mouse.move(550,420);
 const after=await saved(page);expect(after.viewport).not.toEqual(before.viewport);expect(after.datasets).toEqual(original.datasets);expect(after.objects).toEqual(original.objects);await expect(page.locator('header').getByRole('button',{name:'Отменить',exact:true})).toBeDisabled();expect(await page.title()).not.toContain('•');
 await page.keyboard.press('z');await page.mouse.click(400,300);await page.keyboard.press('x');await page.mouse.click(400,300);const restored=await saved(page);for(const key of Object.keys(after.viewport) as (keyof typeof after.viewport)[])expect(restored.viewport[key]).toBeCloseTo(after.viewport[key],10);
 await page.locator('header').getByRole('button',{name:'Показать все',exact:true}).click();await expect(page.locator('footer button')).toHaveCount(0);await page.locator('header').getByRole('button',{name:'История',exact:true}).click();await expect(page.locator('.history-list button')).toHaveCount(1);
});

test('text selection uses an external move handle; two texts move and export without handles',async({page})=>{
 await open(page);await text(page,'First');await text(page,'Second',500,320);await expect(page.locator('[data-handle]')).toHaveCount(0);
 const first=page.locator('[data-object]').filter({hasText:'First'});await first.locator('text').click();await expect(page.locator('[data-selected-object] circle[data-handle=center]')).toHaveCount(1);await expect(page.locator('[data-selected-object] rect[data-handle]')).toHaveCount(0);
 const h=(await page.locator('circle[data-handle=center]').boundingBox())!;await page.mouse.move(h.x+4,h.y+4);await page.mouse.down();await page.mouse.move(h.x+44,h.y+34,{steps:6});await page.mouse.up();await page.keyboard.press('Escape');await expect(page.locator('[data-handle]')).toHaveCount(0);
 await page.locator('header').getByRole('button',{name:'Экспорт',exact:true}).click();await page.getByLabel('Формат',{exact:true}).selectOption('svg');const pending=page.waitForEvent('download');await page.getByRole('button',{name:'Сохранить изображение'}).click();const svg=await readFile((await (await pending).path())!,'utf8');expect(svg).toContain('First');expect(svg).toContain('Second');expect(svg).not.toContain('data-handle');expect(svg).not.toContain('data-selected-object');
});

test('compact palettes retain exact custom colors and line-only keeps snap candidates and all data',async({page})=>{
 const p=await open(page,addPairs(createProject(),[{x:2,y:2},{x:6,y:6}],'Source'));await page.keyboard.press('v');
 const point=page.locator('[data-point]').first(),box=(await point.boundingBox())!;await page.mouse.click(box.x+box.width/2,box.y+box.height/2);
 const inspector=page.locator('.inspector');await expect(inspector).toBeVisible();await expect(inspector.locator('.color-picker').first().locator(':scope > .swatches button')).toHaveCount(8);
 const color=inspector.locator('.color-picker').first();await color.locator('summary').click();await color.getByLabel('Цвет HEX',{exact:true}).fill('#123ABC');await color.getByLabel('Цвет HEX',{exact:true}).press('Enter');
 await inspector.getByLabel('Показывать точки',{exact:true}).uncheck();await expect(page.locator('[data-point]')).toHaveCount(0);let result=await saved(page);expect(result.datasets).toEqual(p.datasets);expect(result.series[0].style.stroke).toBe('#123ABC');expect(result.series[0].mode).toBe('line');expect(result.viewport).toEqual(p.viewport);
 await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await expect(page.getByRole('tooltip')).toBeVisible();await inspector.getByLabel('Показывать точки',{exact:true}).check();await expect(page.locator('[data-point]')).toHaveCount(2);result=await saved(page);expect(result.datasets).toEqual(p.datasets);
});

test('callout connector never crosses actual rotated multiline glyph bounds, including exported SVG',async({page})=>{
 const p=addPairs(createProject(),[{x:0,y:0},{x:10,y:10}],'Source'),o=makeObject('callout',[{mode:'data',x:1,y:1},{mode:'data',x:5,y:5}],'Long caption\nSecond line');p.objects=[o];await open(page,p);
 const geometry=page.locator(`[data-object="${o.id}"]`);
 for(const [x,y,angle] of [[1,1,0],[9,1,0],[9,9,30],[1,9,-45],[5,9,90],[5.2,5,0]]){
  const changed=structuredClone(p);changed.objects[0].anchors[0]={mode:'data',x,y};changed.extensions.textRotation={[o.id]:angle};await page.locator('input[type=file]').setInputFiles({name:'callout.aph',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(changed))});
  const check=await geometry.evaluate(g=>{const text=g.querySelector('text')!,box=text.getBBox(),root=(g as SVGElement).ownerSVGElement!,matrix=text.getScreenCTM()!.inverse().multiply(root.getScreenCTM()!);for(const line of g.querySelectorAll('line'))for(let k=0;k<=100;k++){const t=k/100,pt=root.createSVGPoint();pt.x=Number(line.getAttribute('x1'))*(1-t)+Number(line.getAttribute('x2'))*t;pt.y=Number(line.getAttribute('y1'))*(1-t)+Number(line.getAttribute('y2'))*t;const q=pt.matrixTransform(matrix);if(q.x>=box.x&&q.x<=box.x+box.width&&q.y>=box.y&&q.y<=box.y+box.height)return {clear:false,rootScale:root.getScreenCTM()!.a}}return {clear:true,rootScale:root.getScreenCTM()!.a}});expect(check.clear,JSON.stringify({x,y,angle,...check})).toBe(true);
 }
 await page.screenshot({path:'test-results/ui-callout.png'});
 await page.locator('header').getByRole('button',{name:'Экспорт',exact:true}).click();await page.getByLabel('Формат',{exact:true}).selectOption('svg');
 const pending=page.waitForEvent('download');await page.getByRole('button',{name:'Сохранить изображение'}).click();const exported=await readFile((await (await pending).path())!,'utf8');
 const clear=await page.evaluate(({exported,id})=>{const holder=document.createElement('div');holder.style.cssText='position:fixed;left:-10000px';holder.innerHTML=exported;document.body.append(holder);try{const object=holder.querySelector(`[data-object="${id}"]`)!,label=object.querySelector('text')!,box=label.getBBox(),inverse=label.getCTM()!.inverse();for(const line of object.querySelectorAll('line'))for(let k=0;k<=100;k++){const t=k/100,point=new DOMPoint(Number(line.getAttribute('x1'))*(1-t)+Number(line.getAttribute('x2'))*t,Number(line.getAttribute('y1'))*(1-t)+Number(line.getAttribute('y2'))*t).matrixTransform(line.getCTM()!).matrixTransform(inverse);if(point.x>=box.x&&point.x<=box.x+box.width&&point.y>=box.y&&point.y<=box.y+box.height)return false}return true}finally{holder.remove()}},{exported,id:o.id});expect(clear).toBe(true);
});

test('tool disclosure supports click, keyboard, gentle hover and reduced motion without shifting its neighbors',async({page})=>{
 const project=addPairs(createProject(),[{x:0,y:0},{x:10,y:10}],'Source');project.objects=[makeObject('rectangle',[{mode:'page',pageX:.2,pageY:.3},{mode:'page',pageX:.4,pageY:.5}])];await open(page,project);await page.locator('[data-object] rect').click();const toolbar=page.getByRole('toolbar');await expect(toolbar).not.toHaveClass(/expanded/);
 expect((await toolbar.locator('.tool-trigger').boundingBox())!.width).toBe(44);expect(await toolbar.locator('.tool-trigger').evaluate(e=>getComputedStyle(e).borderTopWidth)).toBe('1px');
 await toolbar.locator('.tool-trigger').focus();await page.keyboard.press('Enter');await expect(toolbar.locator('.tool-items button').first()).toBeFocused();await expect(toolbar.locator('.tool-trigger')).toBeHidden();await page.keyboard.press('ArrowRight');await expect(toolbar.getByRole('button',{name:'Перемещение',exact:true})).toBeFocused();await page.keyboard.press('Escape');await expect(toolbar).not.toHaveClass(/expanded/);await expect(toolbar.locator('.tool-trigger')).toBeFocused();
 await toolbar.locator('.tool-trigger').click();await expect(toolbar).toHaveClass(/expanded/);const zoom=toolbar.getByRole('button',{name:'Увеличить масштаб',exact:true}),neighbor=toolbar.getByRole('button',{name:'Уменьшить масштаб',exact:true});
 await expect(toolbar.locator('.tool-items').first()).toBeVisible();await expect(toolbar.locator('.tool-items').first()).toHaveCSS('transform','matrix(1, 0, 0, 1, 0, 0)');const before=(await neighbor.boundingBox())!;
 await zoom.hover();await expect.poll(()=>zoom.locator('svg').evaluate(e=>new DOMMatrix(getComputedStyle(e).transform).a)).toBeCloseTo(1.1,2);expect((await neighbor.boundingBox())!.x).toBeCloseTo(before.x);
 await page.emulateMedia({reducedMotion:'reduce'});await expect(zoom.locator('svg')).toHaveCSS('transform','none');await expect(toolbar.locator('.tool-reveal').first()).toHaveCSS('transition-duration','0s');await page.emulateMedia({colorScheme:'dark'});await expect(toolbar).toHaveCSS('background-color','rgba(0, 0, 0, 0)');expect((await saved(page)).objects).toEqual(project.objects);
});
