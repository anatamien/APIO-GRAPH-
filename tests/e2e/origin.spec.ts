import {readWorkspace,writeWorkspace} from '../../src/features/workspace/archive';
import {workspaceRecoveryPresent} from './helpers';
import {test,expect,type Page} from '@playwright/test';
import {readFile,mkdir} from 'node:fs/promises';
import {ownOriginModel} from '../fixtures/origin';
import {originHash,writeOriginArchive,readOriginZip,writeOriginZip} from '../../src/features/origin/archive';
import {initialOriginView} from '../../src/features/origin/history';
import {addPairs,createProject,id} from '../../src/domain/model';

async function sourceOption(page:Page){await page.getByRole('button',{name:'Команды Origin',exact:true}).click();await page.getByRole('menuitem',{name:'Параметры сохранения',exact:true}).click();return page.getByRole('dialog')}
async function closeOptions(page:Page){await page.getByRole('dialog').getByRole('button',{name:'Закрыть',exact:true}).click()}
async function ownFile(columnCount=1,includeSource=true){
 const model=ownOriginModel(),resources=new Map([['original',new Uint8Array([1,2,3])]]),values=new Uint8Array(32),v=new DataView(values.buffer);v.setBigUint64(0,0x8000000000000000n,true);v.setFloat64(8,-1.23456789e-300,true);v.setFloat64(24,1.0000000000000002,true);
 const offsets=new Uint8Array(20),o=new DataView(offsets.buffer);o.setUint32(12,10,true);o.setUint32(16,10,true);
 for(const [id,kind,bytes]of [['v','f64',values],['k','tags',new Uint8Array([0,1,2,0])],['o','offsets',offsets],['t','text',new TextEncoder().encode('Own sample')]]as const){resources.set(id,bytes);model.resources.push({id,kind,size:bytes.length,sha256:await originHash(bytes)})}
 model.nodes.push({...model.nodes[0],id:'column',kind:'column',parentId:'sheet',nameHex:'41',properties:{commandHex:'436f6c2843292a3630'}});model.columns=[{nodeId:'column',rowCount:4,values:'v',tags:'k',textOffsets:'o',textBytes:'t',role:'X',originType:'mixed'}];
 for(let i=1;i<columnCount;i++){const nodeId=`column${i}`;model.nodes.push({...model.nodes[1],id:nodeId,kind:'column',parentId:'sheet',nameHex:Buffer.from(`C${i}`).toString('hex')});model.columns.push({...model.columns[0],nodeId})}
 const tabId=id();return {name:'Own Origin.aph',mimeType:'application/zip',buffer:Buffer.from(includeSource?await writeOriginArchive(model,resources,initialOriginView(model)):await writeWorkspace({id:id(),activeId:tabId,tabs:[{id:tabId,label:'Own Origin',origin:{model,resources,view:{...initialOriginView(model),includeSource:false}}}]}))};
}
test('Origin opens in its own tab, displays exact typed cells and preserves an existing graph',async({page})=>{
 const graph=addPairs(createProject(),[{x:2,y:7},{x:3,y:8}],'Retained');await page.goto('/');await page.locator('input[type=file]').setInputFiles({name:'Before.aph',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(graph))});await expect(page.getByTestId('chart')).toBeVisible();
 await page.locator('input[type=file]').setInputFiles(await ownFile());await expect(page.getByRole('region',{name:'Документ Origin'})).toBeVisible();await expect(page.getByRole('tab')).toHaveCount(2);
 const table=page.getByRole('table');await expect(table.getByText('1.0000000000000002',{exact:true})).toBeVisible();await expect(table.getByText('Own sample',{exact:true})).toBeVisible();await expect(table.getByText('−0',{exact:true})).toBeVisible();await expect(table.locator('td[data-kind=missing]')).toHaveText('—');
 await expect(page.locator('.app-header').getByRole('button',{name:'Экспорт',exact:true})).toBeHidden();await page.getByRole('tab',{name:'Before.aph',exact:true}).click();await expect(page.getByTestId('chart')).toBeVisible();await page.getByRole('tab',{name:'Own Origin.aph',exact:true}).click();await expect(table.getByText('Own sample',{exact:true})).toBeVisible();
});
test('column paging exposes every immutable source column without hiding data behind the tree',async({page})=>{
 await page.goto('/');await page.locator('input[type=file]').setInputFiles(await ownFile(17));await page.getByRole('button',{name:'Следующие столбцы',exact:true}).click();await expect(page.getByRole('columnheader',{name:'C16 X',exact:true})).toBeVisible();await page.getByRole('button',{name:'Предыдущие столбцы',exact:true}).click();await expect(page.getByRole('columnheader',{name:'A X',exact:true})).toBeVisible();
});
test('a malformed OPJ may be archived explicitly without inventing extracted data',async({page})=>{
 const original=Buffer.from('CPYA 4,3168\n');await page.goto('/');await page.locator('input[type=file]').setInputFiles({name:'Truncated own.opj',mimeType:'application/octet-stream',buffer:original});await page.getByRole('button',{name:'Открыть только архив исходника',exact:true}).click();await expect(page.getByRole('region',{name:'Документ Origin'})).toBeVisible();await expect(page.getByRole('table')).toHaveCount(0);const pending=page.waitForEvent('download');await page.locator('.app-header').getByRole('button',{name:'Сохранить',exact:true}).click();const workspace=await readWorkspace(new Uint8Array(await readFile((await(await pending).path())!))),archive=workspace.origin(workspace.manifest.activeId!);expect(archive.resources.get('original')).toEqual(new Uint8Array(original));expect(archive.model.columns).toEqual([]);
});
test('row blocks make the final observation of a three-million-row table accessible',async({page})=>{
 test.setTimeout(60000);const model=ownOriginModel(),rows=3000000,values=new Uint8Array(rows*8),tags=new Uint8Array(rows);new DataView(values.buffer).setFloat64((rows-1)*8,123456.789,true);
 const resources=new Map([['original',new Uint8Array([1,2,3])],['v',values],['k',tags]]);for(const [id,kind,bytes]of [['v','f64',values],['k','tags',tags]]as const)model.resources.push({id,kind,size:bytes.length,sha256:await originHash(bytes)});model.nodes.push({...model.nodes[0],id:'c',parentId:'sheet',kind:'column',nameHex:'41'});model.columns=[{nodeId:'c',rowCount:rows,values:'v',tags:'k',role:'X',originType:'f64'}];
 await page.goto('/');await page.locator('input[type=file]').setInputFiles({name:'Large own.aph',mimeType:'application/zip',buffer:Buffer.from(await writeOriginArchive(model,resources,initialOriginView(model)))});await page.getByRole('button',{name:'Последние строки',exact:true}).click();
 const scroll=page.locator('.origin-table-scroll');await expect(page.getByRole('rowheader',{name:'2900001',exact:true})).toBeVisible();await scroll.evaluate(el=>{el.scrollTop=el.scrollHeight});await expect(page.getByRole('rowheader',{name:'3000000',exact:true})).toBeVisible();await expect(page.getByRole('cell',{name:'123456.789',exact:true})).toBeVisible();expect(await scroll.evaluate(el=>el.scrollHeight)).toBeLessThan(33554432);expect(await page.getByRole('table').locator('tbody tr').count()).toBeLessThan(65);
});
test('discarding sixteen recovered Origin sessions permits a new document',async({page})=>{
 const file=await ownFile();await page.goto('/');await page.evaluate(async raw=>{const bytes=new Uint8Array(raw);await new Promise<void>((resolve,reject)=>{const r=indexedDB.open('apio-origin-recovery',1);r.onupgradeneeded=()=>r.result.createObjectStore('workspace');r.onerror=()=>reject(r.error);r.onsuccess=()=>{const db=r.result,tx=db.transaction('workspace','readwrite');tx.objectStore('workspace').put({activeIndex:0,tabs:Array.from({length:16},()=>({path:null,dirty:true,readOnly:false,bytes}))},'current');tx.oncomplete=()=>{db.close();resolve()};tx.onerror=()=>reject(tx.error)}})},[...file.buffer]);
 await page.reload();await page.getByRole('button',{name:'Не сохранять',exact:true}).click();await page.locator('input[type=file]').setInputFiles(file);await expect(page.getByRole('region',{name:'Документ Origin'})).toBeVisible();await expect(page.getByRole('alertdialog')).toHaveCount(0);
});
test('invalid passive metadata is rejected without losing an existing unsaved graph',async({page})=>{
 const file=await ownFile(),entries=readOriginZip(new Uint8Array(file.buffer)),model=JSON.parse(new TextDecoder().decode(entries.get('model.json')!));model.nodes[0].properties.labelHex='not hex';const modelBytes=new TextEncoder().encode(JSON.stringify(model)),manifest=JSON.parse(new TextDecoder().decode(entries.get('manifest.json')!));manifest.modelSHA256=await originHash(modelBytes);entries.set('model.json',modelBytes);entries.set('manifest.json',new TextEncoder().encode(JSON.stringify(manifest)));
 const graph=addPairs(createProject(),[{x:1,y:4}],'Retained');await page.goto('/');await page.locator('input[type=file]').setInputFiles({name:'Kept.aph',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(graph))});await expect(page.getByTestId('chart')).toBeVisible();const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.locator('input[type=file]').setInputFiles({name:'Bad.aph',mimeType:'application/zip',buffer:Buffer.from(writeOriginZip(entries))});await expect(page.getByRole('alertdialog')).toBeVisible();expect(errors).toEqual([]);await expect(page.getByTestId('chart')).toBeVisible();await expect(page.getByRole('tab')).toHaveCount(1);
});
test('common APH retains the complete original even when a legacy source preference was disabled',async({page})=>{
 await page.goto('/');await page.locator('input[type=file]').setInputFiles(await ownFile(1,false));const options=await sourceOption(page);await expect(options).toContainText('Общий .aph');await expect(options.getByRole('checkbox')).toHaveCount(0);await closeOptions(page);
 const pending=page.waitForEvent('download');await page.locator('.app-header').getByRole('button',{name:'Сохранить',exact:true}).click();const downloaded=await pending,bytes=new Uint8Array(await readFile((await downloaded.path())!)),container=await readWorkspace(bytes),result=container.origin(container.manifest.activeId!);expect(result.model.sourceResourceId).toBe('original');expect(result.resources.has('original')).toBe(true);expect(result.model.columns).toHaveLength(1);
 await page.locator('input[type=file]').setInputFiles({name:'Reopened.aph',mimeType:'application/zip',buffer:Buffer.from(bytes)});await page.getByRole('dialog').getByRole('button',{name:'Заменить рабочее пространство',exact:true}).click();await expect(page.getByRole('table').getByText('Own sample',{exact:true})).toBeVisible();await expect(await sourceOption(page)).toContainText('Общий .aph');
});
test('mixed recovery restores graph and Origin tabs with typed data',async({page})=>{
 await page.goto('/');await page.locator('input[type=file]').setInputFiles({name:'Before.aph',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(addPairs(createProject(),[{x:1,y:4}],'Before')))});await page.locator('input[type=file]').setInputFiles(await ownFile());await page.getByRole('button',{name:'Команды Origin',exact:true}).click();await page.getByRole('menu').getByRole('combobox').selectOption('utf-8');await page.getByRole('button',{name:'Команды Origin',exact:true}).click();await page.evaluate(()=>window.dispatchEvent(new Event('blur')));
 await expect.poll(()=>workspaceRecoveryPresent(page)).toBe(true);
 await page.reload();await page.getByRole('button',{name:'Восстановить',exact:true}).click();await expect(page.getByRole('tab')).toHaveCount(2);await expect(page.getByRole('table').getByText('Own sample',{exact:true})).toBeVisible();await expect(await sourceOption(page)).toContainText('Общий .aph');
});
for(const theme of ['light','dark','system']as const)test(`Origin ${theme} theme, language and small-window layout`,async({page})=>{
 await page.addInitScript(({theme})=>localStorage.setItem('apio.settings',JSON.stringify({theme,language:'ru'})),{theme});await page.goto('/');await page.locator('input[type=file]').setInputFiles(await ownFile());await expect(page.getByRole('table').getByText('Own sample',{exact:true})).toBeVisible();
 await page.locator('.app-header').getByRole('button',{name:'Настройки',exact:true}).click();await page.getByLabel('Тема',{exact:true}).selectOption(theme);await page.getByLabel('Язык',{exact:true}).selectOption('en');await page.getByRole('region',{name:'Settings',exact:true}).getByRole('button',{name:'Close',exact:true}).click();await expect(page.getByRole('region',{name:'Origin document'})).toBeVisible();
 await page.setViewportSize({width:760,height:680});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 if(process.env.APIO_SCREENSHOT_DIR){await mkdir(process.env.APIO_SCREENSHOT_DIR,{recursive:true});await page.screenshot({path:`${process.env.APIO_SCREENSHOT_DIR}/origin-${theme}-en-small.png`});}
});
test('Origin themes, RU/EN, larger controls and 100–200% display densities keep data and controls accessible',async({browser})=>{
 test.setTimeout(90000);const file=await ownFile();
 for(const theme of ['light','dark','system']as const)for(const language of ['ru','en']as const)for(const scale of [1,1.5,2]){
  const context=await browser.newContext({viewport:{width:1280,height:800},deviceScaleFactor:scale});
  try{const page=await context.newPage();await page.addInitScript(settings=>localStorage.setItem('apio.settings',JSON.stringify(settings)),{theme,language,largeUI:scale>1});await page.goto('http://127.0.0.1:1420/');await page.locator('input[type=file]').setInputFiles(file);
   await expect(page.getByRole('table').getByText('Own sample',{exact:true})).toBeVisible();await expect(page.getByRole('button',{name:language==='ru'?'Команды Origin':'Origin commands',exact:true})).toBeVisible();await expect(page.locator('.origin-report')).toHaveCount(0);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(await page.locator('.origin-table-scroll tbody tr').count()).toBeLessThan(65);
   if(process.env.APIO_SCREENSHOT_DIR&&theme!=='system'&&((language==='ru'&&scale===1)||(language==='en'&&scale===2))){await mkdir(process.env.APIO_SCREENSHOT_DIR,{recursive:true});await page.screenshot({path:`${process.env.APIO_SCREENSHOT_DIR}/origin-${theme}-${language}-${scale*100}pct.png`});}
  }finally{await context.close()}
 }
});
