import {test,expect,type Page} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import {addPairs,createProject} from '../../src/domain/model';
const header=(page:Page,name:string)=>page.locator('header').getByRole('button',{name,exact:true});
async function load(page:Page,multi=false){let p=addPairs(createProject(),Array.from({length:5500},(_,x)=>({x,y:Math.sin(x/100)})),'Измерения');if(multi)p=addPairs(p,[{x:1,y:2}],'Second');await page.goto('/');await page.locator('input[type=file]').setInputFiles({name:'spectrum.aph',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(p))});await expect.poll(async()=>{const chart=page.getByTestId('chart'),b=(await chart.boundingBox())!,v=(await chart.getAttribute('viewBox'))!.split(' ').map(Number);return v[2]===b.width&&v[3]===b.height}).toBe(true);return p}
async function saved(page:Page){const wait=page.waitForEvent('download');await header(page,'Сохранить').click();return JSON.parse(await readFile((await(await wait).path())!,'utf8'))}
test('completing an import backup does not close a panel opened in the new tab',async({page})=>{
 await page.addInitScript(()=>{
  const NativeWorker=Worker,w=window as unknown as {finishImportBackup?:()=>void};let held=false;
  window.Worker=class extends NativeWorker{
   private serialization:boolean;
   constructor(url:string|URL,options?:WorkerOptions){super(url,options);this.serialization=String(url).includes('serialize.worker')}
   override postMessage(message:unknown,transfer:Transferable[]|StructuredSerializeOptions=[]){const send=()=>super.postMessage(message,transfer as Transferable[]);if(this.serialization&&!held&&message&&typeof message==='object'&&'pretty'in message&&message.pretty===false){held=true;w.finishImportBackup=send}else send()}
  };
 });
 await load(page);await header(page,'Новый проект').click();await page.getByLabel('Исходный текст',{exact:true}).fill('X Y\n1 2\n3 4');await page.getByRole('button',{name:'Построить',exact:true}).click();
 await page.waitForFunction(()=>!!(window as unknown as {finishImportBackup?:()=>void}).finishImportBackup);
 await header(page,'Таблица').click();await expect(page.getByRole('dialog',{name:'Таблица данных',exact:true})).toBeVisible();
 await page.evaluate(()=>(window as unknown as {finishImportBackup:()=>void}).finishImportBackup());
 await expect.poll(()=>page.evaluate(()=>!!localStorage.getItem('apio-graph.recovery.v1'))).toBe(true);
 await expect(page.getByRole('dialog',{name:'Таблица данных',exact:true})).toBeVisible();
});
test('one click opens graph properties and hidden measurements and legend remain independently editable',async({page})=>{
 const p=await load(page,true);await header(page,'Свойства графика').click();const panel=page.locator('.graph-properties');await expect(panel).toBeVisible();await expect(panel.getByLabel('Текущая серия')).toHaveValue(p.series[0].id);
 await expect(page.locator('[data-point]')).toHaveCount(0);await expect(panel.getByLabel('Показывать точки',{exact:true})).not.toBeChecked();await panel.getByLabel('Показывать точки',{exact:true}).check();await expect(page.locator('[data-point]').first()).toBeVisible();
 await panel.getByLabel('Показывать легенду',{exact:true}).uncheck();await expect(page.locator('[data-target=legend]')).toHaveCount(0);
 await panel.getByLabel('Видимость',{exact:true}).uncheck();await panel.getByLabel('Текущая серия').selectOption(p.series[1].id);await panel.getByLabel('Текущая серия').selectOption(p.series[0].id);await expect(panel.getByLabel('Видимость',{exact:true})).not.toBeChecked();
 const q=await saved(page);expect(q.datasets).toEqual(p.datasets);expect(q.legend.anchor).toEqual(p.legend.anchor);expect(q.legend.visible).toBe(false);
});
test('closing properties after selecting another series closes once and retains selection for reopening',async({page})=>{
 const p=await load(page,true);await header(page,'Свойства графика').click();await page.getByLabel('Текущая серия').selectOption(p.series[1].id);
 await page.locator('.graph-properties').getByRole('button',{name:'Закрыть',exact:true}).click();await expect(page.locator('.graph-properties')).toHaveCount(0);
 await header(page,'Свойства графика').click();await expect(page.getByLabel('Текущая серия')).toHaveValue(p.series[1].id);
});
test('switching series resets invalid drafts even when both actual values are identical',async({page})=>{
 const p=await load(page,true);await header(page,'Свойства графика').click();const panel=page.locator('.graph-properties');
 await panel.getByLabel('Толщина, pt',{exact:true}).fill('99');await panel.getByLabel('Текущая серия').selectOption(p.series[1].id);
 await expect(panel.getByLabel('Толщина, pt',{exact:true})).toHaveValue('1.3');await expect(panel.getByLabel('Толщина, pt',{exact:true})).toHaveAttribute('aria-invalid','false');
 expect((await saved(page)).series).toEqual(p.series);
});
test('File is removed and Open and Save As remain available without shortcuts',async({page})=>{
 await load(page);await expect(page.locator('.file-menu-button')).toHaveCount(0);await expect(header(page,'Открыть')).toBeVisible();await header(page,'Варианты сохранения').click();await expect(page.getByRole('menuitem',{name:'Сохранить как',exact:true})).toBeVisible();
 const download=page.waitForEvent('download');await page.getByRole('menuitem',{name:'Сохранить как',exact:true}).click();await download;await page.keyboard.press('Control+k');await expect(page.locator('.project-menu')).toHaveCount(0);
});
test('the selected tab remains visible after shrinking a window with many open graphs',async({page})=>{
 const p=await load(page);for(let i=0;i<6;i++)await page.locator('input[type=file]').setInputFiles({name:`Measured spectrum ${i} long title.aph`,mimeType:'application/json',buffer:Buffer.from(JSON.stringify({...p,project:{...p.project,id:crypto.randomUUID()}}))});
 await expect(page.getByRole('tab',{selected:true})).toHaveAttribute('aria-label','Measured spectrum 5 long title.aph');await page.setViewportSize({width:700,height:500});
 await expect.poll(async()=>{const tab=(await page.getByRole('tab',{selected:true}).boundingBox())!,list=(await page.locator('.tab-list').boundingBox())!;return tab.x>=list.x-1&&tab.x+tab.width<=list.x+list.width+1}).toBe(true);
});
test('20 tool cycles close within 250ms and menus, focus and pin remain stable',async({page})=>{
 await load(page);const toolbar=page.getByRole('toolbar'),trigger=toolbar.locator('.tool-trigger');
 const times=[];for(let i=0;i<20;i++){
  await page.mouse.move(600,700);await trigger.hover();await expect(toolbar).toHaveClass(/expanded/);await page.waitForTimeout(190);
  const t=await toolbar.evaluate(async el=>{const start=performance.now();el.dispatchEvent(new PointerEvent('pointerout',{bubbles:true,relatedTarget:document.body}));while(el.classList.contains('expanded'))await new Promise(requestAnimationFrame);return performance.now()-start});times.push(t);
  await page.waitForTimeout(185);await expect(trigger).toBeVisible();
 }
 expect(Math.max(...times)).toBeLessThan(110);
 await page.mouse.move(600,700);await trigger.hover();await toolbar.getByRole('button',{name:'Другие инструменты',exact:true}).click();await toolbar.locator('.tool-more').hover();await page.waitForTimeout(120);await expect(toolbar.locator('.tool-more')).toBeVisible();
 await toolbar.getByRole('button',{name:'Закрепить инструменты',exact:true}).click();await page.mouse.move(600,700);await page.waitForTimeout(280);await expect(toolbar).toHaveClass(/expanded/);
 await toolbar.getByRole('button',{name:'Закрепить инструменты',exact:true}).click();await page.keyboard.press('ArrowRight');await page.mouse.move(600,700);await page.waitForTimeout(280);await expect(toolbar).toHaveClass(/expanded/);
 await page.keyboard.press('Escape');await expect(trigger).toBeVisible();
});
test('mouse selection collapses on leaving while real keyboard focus holds tools open',async({page})=>{
 await load(page);const toolbar=page.getByRole('toolbar');await toolbar.locator('.tool-trigger').hover();await toolbar.getByRole('button',{name:'Стрелка',exact:true}).click();await page.mouse.move(400,400);await expect(toolbar).not.toHaveClass(/expanded/);
 await toolbar.locator('.tool-trigger').focus();await page.keyboard.press('Enter');await page.keyboard.press('ArrowRight');await page.mouse.move(400,400);await page.waitForTimeout(280);await expect(toolbar).toHaveClass(/expanded/);
});
for(const [width,height] of [[1280,800],[900,650],[700,500]])test(`left tools reserve a stable rail outside every axis at ${width}x${height}`,async({page})=>{
 await page.setViewportSize({width,height});await load(page);await header(page,'Настройки').click();await page.getByLabel('Панель слева',{exact:true}).check();await page.getByLabel('Увеличенный интерфейс',{exact:true}).check();await page.getByRole('button',{name:'Закрыть',exact:true}).click();
 const chart=page.getByTestId('chart'),before=(await chart.boundingBox())!;await page.locator('.tool-trigger').hover();await page.waitForTimeout(210);
 const tools=(await page.locator('.tool-wings').boundingBox())!;expect(tools.x+tools.width).toBeLessThanOrEqual(before.x);expect(tools.y).toBeGreaterThanOrEqual(44);expect(tools.y+tools.height).toBeLessThanOrEqual(height);
 expect(await chart.boundingBox()).toEqual(before);await page.mouse.move(width-30,height-30);await page.waitForTimeout(280);expect(await chart.boundingBox()).toEqual(before);
 for(const button of await page.locator('header>button').all()){const b=(await button.boundingBox())!;expect(b.x).toBeGreaterThanOrEqual(0);expect(b.x+b.width).toBeLessThanOrEqual(width)}
});
for(const theme of ['light','dark'] as const)test(`${theme} uses shared typography and leaves scientific SVG and data unchanged`,async({page})=>{
 const p=await load(page);const before=await page.getByTestId('chart').innerHTML();await header(page,'Настройки').click();await page.getByLabel('Тема',{exact:true}).selectOption(theme);await page.getByRole('button',{name:'Закрыть',exact:true}).click();await header(page,'Свойства графика').click();
 await expect(page.locator('.panel-header h2')).toHaveCSS('font-size','16px');await expect(page.locator('.graph-properties')).toHaveCSS('width','380px');if(theme==='dark')await expect(page.locator('.app')).toHaveCSS('background-color','rgb(0, 0, 0)');
 expect(await page.getByTestId('chart').innerHTML()).toBe(before);expect((await saved(page)).datasets).toEqual(p.datasets);
});
for(const language of ['ru','en'])test(`visual journal labels and legend roundtrip/export remain correct (${language})`,async({page},info)=>{
 await page.addInitScript(language=>localStorage.setItem('apio.settings',JSON.stringify({language,theme:'light'})),language);
 const p=await load(page),en=language==='en',button=(ru:string,english:string)=>header(page,en?english:ru);
 await button('Свойства графика','Graph properties').click();const panel=page.locator('.graph-properties');
 await panel.getByLabel(en?'Visible':'Видимость',{exact:true}).uncheck();await panel.getByLabel(en?'Width, pt':'Толщина, pt',{exact:true}).fill('2');await panel.getByLabel(en?'Visible':'Видимость',{exact:true}).check();
 await button('История','History').click();const entries=page.locator('.history-list button');await expect(entries).toHaveCount(3);await expect(entries.nth(1)).toContainText(en?'hidden':'Скрыта кривая');await expect(entries.nth(2)).toContainText(en?'shown':'Показана кривая');
 await page.screenshot({path:info.outputPath(`history-events-light-${language}.png`)});
 await button('Отменить','Undo').click();await button('Повторить','Redo').click();await expect(entries.last()).toHaveAttribute('aria-current','step');
 await button('Настройки','Settings').click();await page.getByLabel(en?'Theme':'Тема',{exact:true}).selectOption('dark');await button('История','History').click();await page.screenshot({path:info.outputPath(`history-events-dark-${language}.png`)});
 await button('Свойства графика','Graph properties').click();await panel.getByLabel(en?'Show legend':'Показывать легенду',{exact:true}).uncheck();
 const pending=page.waitForEvent('download');await button('Сохранить','Save').click();const download=await pending,bytes=await readFile((await download.path())!);const q=JSON.parse(bytes.toString('utf8'));expect(q.legend.anchor).toEqual(p.legend.anchor);expect(q.legend.visible).toBe(false);expect(q.datasets).toEqual(p.datasets);
 await page.locator('input[type=file]').setInputFiles({name:'legend-off.aph',mimeType:'application/json',buffer:bytes});await expect(page.locator('[data-target=legend]')).toHaveCount(0);
 await button('Экспорт','Export').click();await page.getByLabel(en?'Format':'Формат',{exact:true}).selectOption('svg');const file=page.waitForEvent('download');await page.getByRole('button',{name:en?'Save image':'Сохранить изображение',exact:true}).click();const svg=await readFile((await(await file).path())!,'utf8');expect(svg).not.toContain('data-target="legend"');expect(svg).toContain('data-series=');
});
