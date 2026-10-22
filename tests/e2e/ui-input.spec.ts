import {selectSeries} from './helpers';
import {test,expect,type Page} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import {createProject,addPairs,makeObject,type ProjectDocument} from '../../src/domain/model';

async function open(page:Page,p=addPairs(createProject(),[{x:2,y:2},{x:6,y:6}],'Measurements')){
 p.series=p.series.map(s=>({...s,mode:'line-points',style:{...s.style,markerVisible:true}}));p.legend.visible=false;await page.goto('/');await page.locator('input[type=file]').setInputFiles({name:'input.aph',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(p))});await expect(page.getByTestId('chart')).toBeVisible();return p;
}
async function save(page:Page):Promise<ProjectDocument>{const download=page.waitForEvent('download');await page.locator('header').getByRole('button',{name:'Сохранить',exact:true}).click();return JSON.parse(await readFile((await(await download).path())!,'utf8'))}

for(const lang of ['ru','en'] as const)test(`startup language persists; file and paste stay in the launcher until Plot (${lang})`,async({page})=>{
 await page.setViewportSize({width:600,height:720});await page.goto('/');await page.getByRole('combobox',{name:'Язык',exact:true}).selectOption(lang);await page.reload();
 const en=lang==='en';await expect(page.getByRole('combobox',{name:en?'Language':'Язык',exact:true})).toHaveValue(lang);
 await page.getByRole('button',{name:en?'New project':'Новый проект',exact:true}).click();
 const chooser=page.waitForEvent('filechooser');await page.getByRole('button',{name:en?'Open data file':'Открыть файл данных',exact:true}).click();await (await chooser).setFiles('tests/fixtures/import/tabs.tsv');
 const panel=page.locator('.standalone-import');await expect(panel.getByRole('heading',{name:en?'Import file':'Импорт файла',exact:true})).toBeVisible();await expect(panel.locator('.panel-header')).toContainText('tabs.tsv');await expect(panel.locator('textarea')).toHaveCount(0);await expect(panel.getByRole('table')).toContainText('9');await expect(page.getByTestId('chart')).toHaveCount(0);await expect(page.locator('.app-header')).toHaveCount(0);await expect(page.locator('.launcher-language')).toBeVisible();
 await panel.getByRole('button',{name:en?'Cancel':'Отмена',exact:true}).click();await expect(page.getByTestId('chart')).toHaveCount(0);
 await page.getByRole('button',{name:en?'Paste a table':'Вставить таблицу',exact:true}).click();await expect(panel.getByRole('heading',{name:en?'Paste a table':'Вставить таблицу',exact:true})).toBeVisible();await expect(panel.locator('.file-picker')).toHaveCount(0);await panel.getByRole('textbox').fill('X\tY\n1\t2\n3\t5');await expect(panel.getByRole('table')).toContainText('5');
 await expect(page.getByTestId('chart')).toHaveCount(0);await panel.getByRole('button',{name:en?'Plot':'Построить',exact:true}).click();await expect(page.getByTestId('chart')).toBeVisible();await expect(page.locator('.launcher-titlebar')).toHaveCount(0);await expect(page.locator('[data-series]')).toHaveCount(1);
});

test('file preview accepts a replacement file and plots its complete data without a paste field',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Новый проект',exact:true}).click();
 const choose=page.waitForEvent('filechooser');await page.getByRole('button',{name:'Открыть файл данных',exact:true}).click();await (await choose).setFiles('tests/fixtures/import/tabs.tsv');
 const panel=page.getByRole('dialog',{name:'Импорт файла',exact:true});await expect(panel.getByRole('table')).toContainText('9');await expect(panel.locator('textarea')).toHaveCount(0);
 const replace=page.waitForEvent('filechooser');await panel.getByRole('button',{name:'Выбрать другой файл',exact:true}).click();await (await replace).setFiles({name:'replacement.txt',mimeType:'text/plain',buffer:Buffer.from('time;reading\n20;30\n40;50')});
 await expect(panel.locator('.panel-header')).toContainText('replacement.txt');await expect(panel.getByRole('table')).toContainText('50');await expect(panel.locator('textarea')).toHaveCount(0);await expect(page.getByTestId('chart')).toHaveCount(0);
 await panel.getByRole('button',{name:'Построить',exact:true}).click();const p=await save(page);expect(p.datasets[0].points.map(({x,y})=>({x,y}))).toEqual([{x:20,y:30},{x:40,y:50}]);expect(p.project.title).toBe('replacement.txt');expect(p.axes.x.label).toBe('time');expect(p.axes.y.label).toBe('reading');
});

test('header plus keeps the current chart and its unsaved changes in a separate tab',async({page})=>{
 const original=await open(page);await page.locator('header').getByRole('button',{name:'Новый проект',exact:true}).click();const panel=page.locator('.import-panel');await expect(page.getByTestId('chart')).toBeVisible();await expect(panel.getByLabel('Новый график (отдельная вкладка)',{exact:true})).toBeChecked();
 await panel.getByRole('button',{name:'Отмена',exact:true}).click();expect((await save(page)).datasets).toEqual(original.datasets);
 await selectSeries(page,original.series[0].id);await page.getByLabel('Размер маркера, pt',{exact:true}).fill('5');
 await page.locator('header').getByRole('button',{name:'Новый проект',exact:true}).click();await panel.getByRole('textbox').fill('X Y\n20 30\n40 50');await panel.getByRole('button',{name:'Построить',exact:true}).click();
 await expect(panel).toHaveCount(0);await expect(page.getByRole('tab')).toHaveCount(2);expect((await save(page)).datasets[0].points.map(({x,y})=>({x,y}))).toEqual([{x:20,y:30},{x:40,y:50}]);await page.getByRole('tab',{name:'input.aph',exact:true}).click();const retained=await save(page);expect(retained.datasets).toEqual(original.datasets);expect(retained.series[0].style.markerSizePt).toBe(5);

});

test('tiny points have a generous hit area and hidden series remain editable from the header',async({page})=>{
 const p=addPairs(createProject(),[{x:2,y:2},{x:6,y:6}],'Measurements');p.series[0].mode='points';p.series[0].style.markerSizePt=0;await open(page,p);
 const point=await page.locator('[data-point]').first().evaluate(e=>{const m=(e as SVGGraphicsElement).getScreenCTM()!;return{x:m.e,y:m.f}});await page.mouse.click(point.x+8,point.y);await expect(page.locator('.inspector')).toBeVisible();
 await page.getByLabel('Показывать точки',{exact:true}).uncheck();await page.getByRole('button',{name:'Закрыть',exact:true}).click();await page.mouse.click(point.x+8,point.y);await expect(page.locator('.inspector')).toBeVisible();
 await page.getByLabel('Видимость',{exact:true}).uncheck();await page.getByRole('button',{name:'Закрыть',exact:true}).click();await selectSeries(page,p.series[0].id);await expect(page.getByLabel('Видимость',{exact:true})).not.toBeChecked();await page.getByLabel('Видимость',{exact:true}).check();await page.getByLabel('Показывать точки',{exact:true}).check();await page.getByLabel('Размер маркера, pt',{exact:true}).fill('3');await expect(page.locator('[data-point]')).toHaveCount(2);expect((await save(page)).datasets).toEqual(p.datasets);
});

test('text inspector omits line controls and adding text runs while preserving existing rich text',async({page})=>{
 const p=createProject(),o=makeObject('text',[{mode:'page',pageX:.3,pageY:.4}],'Normal');o.text.push({text:'2',baseline:'super',bold:true,italic:false});p.objects=[o];await open(page,p);await page.locator('[data-object] text').click();
 const panel=page.locator('.inspector');await expect(panel.getByLabel('Штрих',{exact:true})).toHaveCount(0);await expect(panel.getByLabel('Толщина, pt',{exact:true})).toHaveCount(0);await expect(panel.getByRole('button',{name:'+ Текст',exact:true})).toHaveCount(0);await panel.getByLabel('Содержимое',{exact:true}).fill('Updated2');const after=await save(page);expect(after.objects[0].text).toEqual([{...o.text[0],text:'Updated'},o.text[1]]);
});

test('hover replaces the central button with two smoothly sliding wings that meet without a gap',async({page})=>{
 await open(page);const toolbar=page.getByRole('toolbar'),trigger=toolbar.locator('.tool-trigger'),before=(await toolbar.boundingBox())!;
 const frames=await toolbar.evaluate(async e=>{e.dispatchEvent(new PointerEvent('pointerover',{bubbles:true}));const sample=()=>Array.from(e.querySelectorAll('.tool-items')).map(n=>new DOMMatrix(getComputedStyle(n).transform).m41);await new Promise(r=>setTimeout(r,90));const early=sample();await new Promise(r=>setTimeout(r,400));return{early,late:sample()}});
 expect(frames.early[0]).toBeGreaterThan(0);expect(frames.early[0]).toBeLessThan(18);expect(frames.early[1]).toBeLessThan(0);expect(frames.late[0]).toBeCloseTo(0);expect(frames.late[1]).toBeCloseTo(0);await expect(trigger).toBeHidden();expect(await toolbar.boundingBox()).toEqual(before);const left=(await toolbar.locator('.tool-wing-before').boundingBox())!,right=(await toolbar.locator('.tool-wing-after').boundingBox())!;expect(left.x+left.width).toBeCloseTo(right.x,1);
 for(const wing of await toolbar.locator('.tool-reveal').all()){expect(await wing.evaluate(e=>getComputedStyle(e).overflowX)).toBe('clip');const b=(await wing.boundingBox())!;expect(b.x).toBeGreaterThan(0);expect(b.x+b.width).toBeLessThan(1440)}await page.screenshot({path:'test-results/input-bilateral-tools.png'});await toolbar.evaluate(e=>e.dispatchEvent(new PointerEvent('pointerout',{bubbles:true,relatedTarget:document.body})));await expect(toolbar).not.toHaveClass(/expanded/);await expect(trigger).toBeVisible();
});

test('wheel zooms about the cursor in Select and drawing modes without adding undo steps',async({page})=>{
 const original=await open(page),start=await save(page);const chart=(await page.getByTestId('chart').boundingBox())!,x=chart.x+400,y=chart.y+300;
 const pointBefore=await page.locator('[data-point]').first().evaluate(e=>({x:(e as SVGGraphicsElement).getScreenCTM()!.e,y:(e as SVGGraphicsElement).getScreenCTM()!.f}));
 await page.mouse.move(x,y);await page.mouse.wheel(0,-200);await expect.poll(async()=>page.locator('[data-point]').first().evaluate(e=>(e as SVGGraphicsElement).getScreenCTM()!.e)).not.toBe(pointBefore.x);
 const zoomed=await save(page);expect(zoomed.viewport.xMax-zoomed.viewport.xMin).toBeLessThan(start.viewport.xMax-start.viewport.xMin);expect(zoomed.viewport.yMax-zoomed.viewport.yMin).toBeLessThan(start.viewport.yMax-start.viewport.yMin);
 const pointAfter=await page.locator('[data-point]').first().evaluate(e=>({x:(e as SVGGraphicsElement).getScreenCTM()!.e,y:(e as SVGGraphicsElement).getScreenCTM()!.f}));expect((pointAfter.x-x)/(pointBefore.x-x)).toBeCloseTo(Math.exp(.4),6);expect((pointAfter.y-y)/(pointBefore.y-y)).toBeCloseTo(Math.exp(.4),6);
 await page.keyboard.press('r');await page.mouse.move(x,y);await page.mouse.wheel(0,200);await expect.poll(async()=>page.locator('[data-point]').first().evaluate(e=>(e as SVGGraphicsElement).getScreenCTM()!.e)).toBeCloseTo(pointBefore.x,6);
 const restored=await save(page);expect(restored.datasets).toEqual(original.datasets);expect(restored.objects).toEqual(original.objects);for(const key of Object.keys(start.viewport) as (keyof typeof start.viewport)[])expect(restored.viewport[key]).toBeCloseTo(start.viewport[key],12);await expect(page.locator('header').getByRole('button',{name:'Отменить',exact:true})).toBeDisabled();
});

for(const kind of ['settings','series','export'] as const)test(`${kind} panel collapses to its draggable header and reopens with its state preserved`,async({page})=>{
 const p=await open(page);if(kind==='series')await selectSeries(page,p.series[0].id);else await page.locator('header').getByRole('button',{name:kind==='settings'?'Настройки':'Экспорт',exact:true}).click();
 const panel=page.locator('.panel'),body=panel.locator('.panel-body');if(kind==='settings')await page.getByLabel('Увеличенный интерфейс',{exact:true}).check();if(kind==='series')await page.getByLabel('Размер маркера, pt',{exact:true}).fill('7');if(kind==='export')await page.getByLabel('Формат',{exact:true}).selectOption('svg');
 await panel.getByRole('button',{name:'Свернуть панель',exact:true}).click();await expect(panel).toHaveAttribute('data-collapsed','true');await expect(body).toBeHidden();expect((await panel.boundingBox())!.height).toBeLessThanOrEqual(56);await expect(panel.getByRole('button',{name:'Развернуть панель',exact:true})).toHaveAttribute('aria-expanded','false');
 const header=panel.locator('.panel-header'),before=(await header.boundingBox())!;await page.mouse.move(before.x+45,before.y+20);await page.mouse.down();await page.mouse.move(300,600,{steps:8});await page.mouse.up();const moved=(await panel.boundingBox())!;expect(moved.x).toBeLessThan(before.x-100);expect(moved.y).toBeGreaterThan(before.y+100);expect(moved.height).toBeLessThanOrEqual(56);
 await panel.getByRole('button',{name:'Развернуть панель',exact:true}).click();await expect(body).toBeVisible();await expect(panel).toHaveAttribute('data-collapsed','false');const expanded=(await panel.boundingBox())!;expect(expanded.x).toBeCloseTo(moved.x,0);expect(expanded.y+expanded.height).toBeLessThanOrEqual(900);if(kind==='settings')await expect(page.getByLabel('Увеличенный интерфейс',{exact:true})).toBeChecked();if(kind==='series')await expect(page.getByLabel('Размер маркера, pt',{exact:true})).toHaveValue('7');if(kind==='export')await expect(page.getByLabel('Формат',{exact:true})).toHaveValue('svg');
});
