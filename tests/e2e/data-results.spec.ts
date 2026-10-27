import {downloadedGraph} from './projectDownload';
import {test,expect,type Page} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import {addPairs,createProject,id,makeObject,type CalculationKind,type ProjectDocument} from '../../src/domain/model';
import {addCalculation,calculatePreview} from '../../src/features/analysis/operations';
import {buildDataTree,flattenDataTree} from '../../src/features/analysis/dataTree';
import type {DataNodeKey} from '../../src/domain/dependencies';

const header=(p:Page,name:string)=>p.locator('header').getByRole('button',{name,exact:true});
const add=(p:ProjectDocument,i:number,kind:CalculationKind,parameters:Record<string,unknown>={},name=kind)=>addCalculation(p,p.series[i].id,kind,parameters,calculatePreview(kind,p.datasets.find(d=>d.id===p.series[i].datasetId)!.points,parameters),name);
function fixture(){
 let p=addPairs(createProject(),Array.from({length:17},(_,x)=>({x,y:3+x*x})),'A');p=addPairs(p,[{x:0,y:1},{x:1,y:2},{x:2,y:3}],'B');
 p.axes.x.unit='s';p.axes.y.unit='mV';p=add(p,0,'savitzky-golay',{window:5,degree:2});p=add(p,2,'derivative');p=add(p,0,'linear-fit');p=add(p,0,'statistics');p=add(p,0,'integral');
 p.viewport={xMin:-2,xMax:20,yMin:-20,yMax:300};p.series[3].style.stroke='#C62828';p.series[3].style.strokeWidthPt=2.5;p.series[3].order=8;p.objects=[makeObject('text',[{mode:'page',pageX:.1,pageY:.12}],'Reference A')];return p;
}
async function load(page:Page,p:ProjectDocument){await page.goto('/');await page.locator('input[type=file]').setInputFiles({name:'results.aph',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(p))});await expect(page.getByTestId('chart')).toBeVisible()}
async function save(page:Page):Promise<ProjectDocument>{const pending=page.waitForEvent('download');await header(page,'Сохранить').click();return await downloadedGraph(await readFile((await(await pending).path())!))}
async function openTree(page:Page){if(await page.locator('.data-results-panel').count())return;if(!await page.locator('.graph-properties').count())await header(page,'Свойства графика').click();await page.getByRole('button',{name:'Данные и результаты',exact:true}).click();await expect(page.locator('.result-tree')).toBeVisible()}
async function node(page:Page,p:ProjectDocument,key:DataNodeKey){
 const rows=flattenDataTree(buildDataTree(p),new Set()),i=rows.findIndex(row=>row.key===key);expect(i).toBeGreaterThanOrEqual(0);
 await page.locator('.result-tree').evaluate((el,y)=>{el.scrollTop=y},i*64);const row=page.locator(`[data-node="${key}"]`);await expect(row).toBeVisible();return row;
}
async function menu(page:Page,p:ProjectDocument,key:DataNodeKey){const row=await node(page,p,key);await row.getByRole('button',{name:/Действия с узлом/}).click();return page.getByRole('menu',{name:'Действия с узлом',exact:true})}

test('1.1 immediate dependencies, independent styles and visibility survive tab switch and round-trip',async({page})=>{
 const p=fixture();await load(page,p);await openTree(page);
 await expect(await node(page,p,`calculation:${p.calculations[1].id}`)).toHaveAttribute('aria-level','4');
 let actions=await menu(page,p,`dataset:${p.datasets[3].id}`);await actions.getByRole('menuitem',{name:'Скрыть',exact:true}).click();
 let saved=await save(page);expect(saved.series.map(s=>s.visible)).toEqual([true,true,true,false,true]);expect(saved.viewport).toEqual(p.viewport);expect(saved.datasets).toEqual(p.datasets);
 actions=await menu(page,p,`dataset:${p.datasets[3].id}`);await actions.getByRole('menuitem',{name:'Свойства',exact:true}).click();await expect(page.getByLabel('Текущая серия',{exact:true})).toHaveValue(p.series[3].id);
 await page.locator('.color-picker').first().locator('input[type=color]').fill('#00838F');saved=await save(page);expect(saved.series[3].style.stroke).toBe('#00838F');expect(saved.series[2]).toEqual(p.series[2]);expect(saved.series[4]).toEqual(p.series[4]);
 await page.locator('input[type=file]').setInputFiles('examples/example.aph');await page.getByRole('tab').first().click();await openTree(page);expect((await save(page)).series).toEqual(saved.series);
 await page.locator('input[type=file]').setInputFiles({name:'round-trip.aph',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(saved))});expect((await save(page)).objects).toEqual(p.objects);
});
test('1.1 source editing invalidates only descendants, targeted worker recalculation preserves view, style and IDs',async({page})=>{
 let p=fixture();p=add(p,1,'statistics');await load(page,p);await openTree(page);
 const actions=await menu(page,p,`dataset:${p.datasets[0].id}`);await actions.getByRole('menuitem',{name:'Открыть таблицу',exact:true}).click();
 await expect(page.getByLabel('Серия / набор данных',{exact:true})).toHaveValue(p.series[0].id);await page.getByRole('button',{name:'Y 5: 19',exact:true}).dblclick();await page.getByLabel('Y 5',{exact:true}).fill('50');await page.getByLabel('Y 5',{exact:true}).press('Enter');
 const stale=await save(page);expect(stale.calculations.map(c=>c.status)).toEqual(['outdated','outdated','outdated','outdated','outdated','valid']);
 await openTree(page);await expect(await node(page,stale,`calculation:${p.calculations[1].id}`)).toContainText('Требует пересчета');
 await page.getByRole('button',{name:'Пересчитать устаревшие',exact:true}).click();await expect(page.getByRole('button',{name:'Пересчитать устаревшие',exact:true})).toHaveCount(0);
 const next=await save(page);expect(next.calculations.every(c=>c.status==='valid')).toBe(true);expect(next.series).toEqual(p.series);expect(next.viewport).toEqual(p.viewport);expect(next.datasets[1]).toEqual(p.datasets[1]);expect(next.datasets[3].points.map(p=>p.id)).toEqual(p.datasets[3].points.map(p=>p.id));
 const expected=calculatePreview('savitzky-golay',next.datasets[0].points,{window:5,degree:2});next.datasets[2].points.forEach((p,i)=>expect(p.y).toBeCloseTo(expected.points[i].y,12));
 await header(page,'Отменить').click();expect((await save(page)).calculations.map(c=>c.status)).toEqual(stale.calculations.map(c=>c.status));
});
test('1.1 existing SG parameters preview/cancel is read-only; Apply makes one reversible edit',async({page})=>{
 const p=fixture();await load(page,p);await openTree(page);
 let actions=await menu(page,p,`calculation:${p.calculations[0].id}`);await actions.getByRole('menuitem',{name:'Изменить параметры обработки',exact:true}).click();
 await expect(page.getByLabel('Окно наблюдений',{exact:true})).toHaveValue('5');await page.getByLabel('Окно наблюдений',{exact:true}).fill('7');await page.getByRole('button',{name:'Рассчитать',exact:true}).click();await expect(page.locator('.analysis-panel').getByRole('button',{name:'Применить',exact:true})).toBeVisible();
 expect((await save(page)).calculations).toEqual(p.calculations);await page.locator('.analysis-panel').getByRole('button',{name:'Отмена',exact:true}).click();expect((await save(page)).datasets).toEqual(p.datasets);
 await openTree(page);actions=await menu(page,p,`calculation:${p.calculations[0].id}`);await actions.getByRole('menuitem',{name:'Изменить параметры обработки',exact:true}).click();await page.getByLabel('Окно наблюдений',{exact:true}).fill('7');await page.getByRole('button',{name:'Рассчитать',exact:true}).click();await page.locator('.analysis-panel').getByRole('button',{name:'Применить',exact:true}).click();
 const changed=await save(page);expect(changed.calculations).toHaveLength(5);expect(changed.calculations[0].parameters.window).toBe(7);expect(changed.calculations[1].status).toBe('outdated');expect(changed.series).toEqual(p.series);
 await header(page,'Отменить').click();const undone=await save(page);expect(undone.calculations).toEqual(p.calculations);expect(undone.datasets).toEqual(p.datasets);await expect(header(page,'Отменить')).toBeDisabled();await header(page,'Повторить').click();expect((await save(page)).calculations).toEqual(changed.calculations);
});
test('1.1 cascade deletion warns, cancel preserves everything, confirm detaches anchors and Undo restores them',async({page})=>{
 const p=fixture(),d=p.datasets[3],pt=d.points[3];p.objects.push(makeObject('marker',[{mode:'point',datasetId:d.id,pointId:pt.id,fallbackX:pt.x,fallbackY:pt.y,offsetXpx:4,offsetYpx:0}]));await load(page,p);await openTree(page);
 const actions=await menu(page,p,`calculation:${p.calculations[0].id}`);await actions.getByRole('menuitem',{name:'Удалить',exact:true}).click();const dialog=page.getByRole('alertdialog',{name:'Удалить',exact:true});await expect(dialog).toContainText('Расчеты: 2');await expect(dialog).toContainText('Связанные объекты');await dialog.getByRole('button',{name:'Отмена',exact:true}).click();expect((await save(page)).datasets).toEqual(p.datasets);
 await actions.getByRole('menuitem',{name:'Удалить',exact:true}).click();await dialog.getByRole('button',{name:'Подтвердить',exact:true}).click();const removed=await save(page);expect(removed.calculations).toHaveLength(3);expect(removed.datasets).toHaveLength(3);expect(removed.objects[1].anchors[0].mode).toBe('data');
 await header(page,'Отменить').click();expect((await save(page)).objects).toEqual(p.objects);
});
test('1.1 scalar result cards expose numeric summaries, units, rename and persistence without phantom curves',async({page})=>{
 const p=fixture();await load(page,p);await openTree(page);const actions=await menu(page,p,`calculation:${p.calculations[4].id}`);
 await expect(page.locator('.result-details')).toContainText('mV');await expect(page.locator('.result-details')).toContainText('s');await expect(page.locator('.result-details dd').first()).toHaveText(String(p.calculations[4].summary.integral));
 await actions.getByRole('menuitem',{name:'Переименовать',exact:true}).click();await page.locator('.result-details input').fill('Area A');await page.locator('.result-details').getByRole('button',{name:'Применить',exact:true}).click();const changed=await save(page);expect(changed.calculations[4].parameters.resultName).toBe('Area A');expect(changed.datasets).toEqual(p.datasets);expect(changed.series).toEqual(p.series);
 await page.locator('input[type=file]').setInputFiles({name:'scalar.aph',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(changed))});await openTree(page);await expect(await node(page,changed,`calculation:${changed.calculations[4].id}`)).toContainText('Area A');
});
test('1.1 1000 operations are virtualized, searchable and keyboard accessible; panel state survives properties',async({page},info)=>{
 const p=addPairs(createProject(),[{x:0,y:0},{x:1,y:2},{x:2,y:4}],'A');for(let i=0;i<1000;i++)p.calculations.push({id:id(),kind:'statistics',sourceDatasetIds:[p.datasets[0].id],resultDatasetId:null,parameters:{resultName:`Result ${i}`},algorithmVersion:1,status:'valid',summary:{n:3,meanY:2}});
 await load(page,p);const start=performance.now();await openTree(page);const openMs=performance.now()-start;expect(await page.getByRole('treeitem').count()).toBeLessThan(30);
 await page.getByLabel('Поиск',{exact:true}).fill('Result 999');await expect(page.getByRole('treeitem')).toHaveCount(2);await page.getByRole('tree').focus();await page.keyboard.press('End');await expect(page.getByRole('treeitem',{selected:true})).toContainText('Result 999');await page.keyboard.press('Shift+F10');await expect(page.getByRole('menu')).toBeVisible();
 await page.getByLabel('Поиск',{exact:true}).fill('');await page.getByRole('button',{name:'Свернуть все',exact:true}).click();await expect(page.getByRole('treeitem')).toHaveCount(1);await page.getByRole('treeitem').click();await page.locator('.result-panel-navigation').getByRole('button',{name:'Свойства',exact:true}).click();await page.getByRole('button',{name:'Данные и результаты',exact:true}).click();await expect(page.getByRole('treeitem')).toHaveCount(1);
 await page.locator('.result-tree-tools').getByRole('button',{name:'Развернуть все',exact:true}).click();await page.getByRole('tree').evaluate(el=>{el.scrollTop=1600});await page.getByRole('tree').focus();await page.keyboard.press('Home');await expect.poll(()=>page.getByRole('tree').evaluate(el=>el.scrollTop)).toBe(0);await expect(page.getByRole('treeitem',{selected:true})).toContainText('A');
 await page.keyboard.press('End');await expect(page.getByRole('treeitem',{selected:true})).toContainText('Result 999');await expect(page.getByRole('treeitem',{selected:true})).toBeInViewport();
 await info.attach('tree-performance.json',{body:JSON.stringify({operations:1000,openMs,domRows:await page.getByRole('treeitem').count()}),contentType:'application/json'});
});
test('1.1 add data stays in current graph while top plus makes a separate tab',async({page})=>{
 const p=fixture();await load(page,p);await openTree(page);await page.getByRole('button',{name:'Добавить данные или расчет',exact:true}).click();await page.getByRole('button',{name:'Ввести новую серию вручную',exact:true}).click();await page.getByLabel('Новая точка X',{exact:true}).fill('1.25');await page.getByLabel('Новая точка Y',{exact:true}).fill('8');await page.getByRole('button',{name:'Добавить точку',exact:true}).click();const appended=await save(page);expect(appended.datasets).toHaveLength(6);expect(appended.datasets.slice(0,5)).toEqual(p.datasets);await expect(page.getByRole('tab')).toHaveCount(1);
 await header(page,'Новый проект').click();await page.getByLabel('Исходный текст',{exact:true}).fill('0 100\n1 200');await page.getByRole('button',{name:'Построить',exact:true}).click();await expect(page.getByRole('tab')).toHaveCount(2);expect((await save(page)).datasets).toHaveLength(1);await page.getByRole('tab').first().click();expect((await save(page)).datasets).toEqual(appended.datasets);
});
test('1.1 changing selection/collapse does not render scientific traces; changing one color renders only that trace',async({page})=>{
 await page.addInitScript(()=>Object.assign(window,{traceRenders:{}}));
 // Count actual function invocations. Reused Fiber children retain old flags and
 // would overcount skipped renders when only an unrelated panel commits.
 await page.route('**/src/features/chart/ChartScene.tsx*',async route=>{
  const response=await route.fetch(),body=await response.text();expect(body).toContain('const pointMode =');
  await route.fulfill({response,body:body.replace('const pointMode =','globalThis.traceRenders[s.id] = (globalThis.traceRenders[s.id] ?? 0) + 1; const pointMode =')});
 });
 const p=fixture();await load(page,p);await openTree(page);
 const probe=()=>page.evaluate(()=>(window as unknown as {traceRenders:Record<string,number>}).traceRenders);const before=await probe();expect(before[p.series[0].id]).toBeGreaterThan(0);
 await (await node(page,p,`dataset:${p.datasets[2].id}`)).click();await page.locator('.result-tree-tools').getByRole('button',{name:'Свернуть все',exact:true}).click();await page.locator('.result-tree-tools').getByRole('button',{name:'Развернуть все',exact:true}).click();expect(await probe()).toEqual(before);
 await page.locator('.result-panel-navigation').getByRole('button',{name:'Свойства',exact:true}).click();await page.locator('.color-picker').first().locator('input[type=color]').fill('#00838F');
 const after=await probe();for(const s of p.series)expect(after[s.id]-before[s.id]).toBe(s.id===p.series[2].id?1:0);
});
test('1.1 a dataset without a visible curve still has its table and can be a calculation source',async({page})=>{
 const p=fixture();p.series=p.series.slice(1);await load(page,p);await openTree(page);let actions=await menu(page,p,`dataset:${p.datasets[0].id}`);await actions.getByRole('menuitem',{name:'Открыть таблицу',exact:true}).click();await expect(page.getByLabel('Серия / набор данных',{exact:true})).toHaveValue(`dataset:${p.datasets[0].id}`);await expect(page.getByRole('button',{name:'Y 5: 19',exact:true})).toBeVisible();
 await openTree(page);actions=await menu(page,p,`dataset:${p.datasets[0].id}`);await actions.getByRole('menuitem',{name:'Использовать как источник',exact:true}).click();await expect(page.getByLabel('Исходная серия',{exact:true})).toHaveValue(`dataset:${p.datasets[0].id}`);await page.getByRole('button',{name:'Рассчитать',exact:true}).click();await page.getByRole('button',{name:'Добавить результат',exact:true}).click();const result=await save(page);expect(result.calculations.at(-1)!.sourceDatasetIds).toEqual([p.datasets[0].id]);expect(result.series).toHaveLength(p.series.length+1);
});
test('1.1 tree visibility is honored by SVG/PNG/JPEG and strict monochrome export',async({page})=>{
 const p=fixture();await load(page,p);await openTree(page);const actions=await menu(page,p,`dataset:${p.datasets[0].id}`);await actions.getByRole('menuitem',{name:'Скрыть',exact:true}).click();
 await header(page,'Экспорт').click();const panel=page.locator('.export-panel');
 for(const format of ['svg','png','jpeg']){
  await panel.getByLabel('Формат',{exact:true}).selectOption(format);await panel.getByLabel('Цветовой режим',{exact:true}).selectOption('strict-bw');const pending=page.waitForEvent('download');await panel.getByRole('button',{name:'Сохранить изображение',exact:true}).click();const bytes=await readFile((await(await pending).path())!);
  if(format==='svg'){const svg=bytes.toString('utf8');expect(svg).not.toContain(`data-series="${p.series[0].id}"`);expect(svg).toContain(`data-series="${p.series[3].id}"`);expect(svg).not.toContain('Данные и результаты');expect(svg).toContain('Reference A')}
  else if(format==='png')expect([...bytes.subarray(0,8)]).toEqual([137,80,78,71,13,10,26,10]);else expect([...bytes.subarray(0,2)]).toEqual([255,216]);
 }
});
test('1.1 cancel and Undo during a background recalculation never apply an obsolete answer',async({page})=>{
 const p=fixture();await load(page,p);await header(page,'Таблица').click();await page.getByRole('button',{name:'Y 5: 19',exact:true}).dblclick();await page.getByLabel('Y 5',{exact:true}).fill('50');await page.getByLabel('Y 5',{exact:true}).press('Enter');const stale=await save(page);await openTree(page);
 let release!:()=>void;let gate=new Promise<void>(resolve=>release=resolve);await page.route('**/analysis.worker.ts*',async route=>{await gate;await route.continue().catch(()=>{})});
 try{
  await page.getByRole('button',{name:'Пересчитать устаревшие',exact:true}).click();await expect(page.locator('.data-results-panel [role=status]')).toContainText('Вычисление');await page.locator('.data-results-panel [role=status]').getByRole('button',{name:'Отмена',exact:true}).click();release();await expect(page.locator('.data-results-panel [role=status]')).toHaveCount(0);expect((await save(page)).calculations).toEqual(stale.calculations);
  gate=new Promise<void>(resolve=>release=resolve);await page.getByRole('button',{name:'Пересчитать устаревшие',exact:true}).click();await expect(page.locator('.data-results-panel [role=status]')).toContainText('Вычисление');await page.keyboard.press('Control+z');release();await expect(page.locator('.data-results-panel [role=status]')).toHaveCount(0);const undone=await save(page);expect(undone.datasets).toEqual(p.datasets);expect(undone.calculations).toEqual(p.calculations);
 }finally{release();await page.unroute('**/analysis.worker.ts*')}
});
for(const theme of ['light','dark'] as const)test(`1.1 ${theme} panel keeps short lists and details together; compact forms and scalar summaries stay reachable`,async({page},info)=>{
 await page.addInitScript(theme=>localStorage.setItem('apio.settings',JSON.stringify({theme,language:'ru',pinned:true})),theme);
 await page.setViewportSize({width:1440,height:1400});
 const single=addPairs(createProject(),[{x:0,y:1},{x:1,y:3},{x:2,y:5}],'Measurement A');await load(page,single);await openTree(page);
 const tree=page.getByRole('tree'),details=page.locator('.result-details'),panel=page.locator('.data-results-panel');
 await expect(details).toBeInViewport();const listBox=(await tree.boundingBox())!,detailsBox=(await details.boundingBox())!;
 expect(listBox.height).toBeLessThan(80);expect(detailsBox.y-listBox.y-listBox.height).toBeLessThanOrEqual(16);
 await expect(details.getByRole('button',{name:'Открыть таблицу',exact:true})).toBeInViewport();
 await expect(page.locator('.result-tree-counts')).toContainText('Наборы: 1');await expect(page.locator('.result-tree-counts')).toContainText('Расчеты: 0');
 const add=panel.getByRole('button',{name:'Добавить данные или расчет',exact:true}),icon=await add.locator('svg').first().boundingBox(),label=await add.locator('span').boundingBox();expect(icon!.x+icon!.width).toBeLessThan(label!.x);
 await page.screenshot({path:info.outputPath(`source-tall-${theme}.png`)});
 const unchanged=await save(page);expect(unchanged.datasets).toEqual(single.datasets);expect(unchanged.series).toEqual(single.series);
 const p=fixture();await page.locator('input[type=file]').setInputFiles({name:'statistics.aph',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(p))});await openTree(page);
 const target=`calculation:${p.calculations[3].id}`;await tree.focus();await page.keyboard.press('Home');
 const at=flattenDataTree(buildDataTree(p),new Set()).findIndex(row=>row.key===target);for(let i=0;i<at;i++)await page.keyboard.press('ArrowDown');
 await expect(page.locator(`[data-node="${target}"]`)).toHaveAttribute('aria-selected','true');await expect(page.locator(`[data-node="${target}"]`)).toBeInViewport();
 for(const [width,height] of [[1440,900],[760,500]]){
  await page.setViewportSize({width,height});await page.evaluate(()=>document.documentElement.dataset.ui='large');
  const actions=await menu(page,p,`calculation:${p.calculations[3].id}`);await actions.getByRole('menuitem',{name:'Переименовать',exact:true}).click();
  const input=details.getByRole('textbox');await input.scrollIntoViewIfNeeded();await expect(input).toBeInViewport();await input.fill('A very long calculation title with units and a scientific result');await input.press('Escape');await expect(input).toHaveCount(0);
  await actions.getByRole('menuitem',{name:'Удалить',exact:true}).click();const dialog=details.getByRole('alertdialog');await dialog.getByRole('button',{name:'Отмена',exact:true}).click();await expect(dialog).toHaveCount(0);
  await actions.getByRole('menuitem').first().press('Escape');const values=details.locator('dd');await values.last().scrollIntoViewIfNeeded();await expect(values.last()).toBeInViewport();
  expect(await panel.locator('.panel-body').evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);
  expect(await details.locator('.analysis-summary').evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);
  await page.screenshot({path:info.outputPath(`statistics-${width}-${theme}.png`)});
 }
 expect((await save(page)).calculations).toEqual(p.calculations);
});

for(const theme of ['light','dark','system'] as const)for(const language of ['ru','en'] as const)test(`1.1 layout ${theme}/${language}, standard and narrow large interface`,async({page},info)=>{
 await page.addInitScript(({theme,language})=>localStorage.setItem('apio.settings',JSON.stringify({theme,language,pinned:true})),{theme,language});const p=fixture();await load(page,p);
 await header(page,language==='ru'?'Свойства графика':'Graph properties').click();await page.getByRole('button',{name:language==='ru'?'Данные и результаты':'Data and results',exact:true}).click();
 await expect(page.locator('.data-results-panel')).toBeVisible();await expect(page.locator('.result-tree')).toHaveCSS('overflow-x','auto');
 const tree=page.getByRole('tree');await tree.focus();await page.keyboard.press('Home');await page.keyboard.press('ArrowRight');
 await page.screenshot({path:info.outputPath(`tree-${theme}-${language}.png`)});
 await page.setViewportSize({width:760,height:650});await page.evaluate(()=>document.documentElement.dataset.ui='large');await page.emulateMedia({colorScheme:'dark',reducedMotion:'reduce'});
 const overflow=await page.locator('.data-results-panel').evaluate(el=>el.scrollWidth>el.clientWidth);expect(overflow).toBe(false);await expect(tree).toBeVisible();
 const collapse=page.locator('.panel-header button').first();await collapse.click();await expect(page.locator('.data-results-panel')).toHaveAttribute('data-collapsed','true');await collapse.click();await expect(tree).toBeVisible();
});
