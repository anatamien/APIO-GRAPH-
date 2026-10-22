import {test,expect,type Page} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import {createProject,addPairs,type ProjectDocument} from '../../src/domain/model';
import {selectSeries} from './helpers';

const source=()=>addPairs(createProject(),[{x:2,y:2},{x:6,y:6}],'Original');
async function load(page:Page,name:string,project=source()){await page.locator('input[type=file]').setInputFiles({name,mimeType:'application/json',buffer:Buffer.from(JSON.stringify(project))});await expect(page.getByRole('tab',{name,exact:true})).toHaveAttribute('aria-selected','true');return project}
async function saved(page:Page){const pending=page.waitForEvent('download');await page.locator('header').getByRole('button',{name:'Сохранить',exact:true}).click();const download=await pending;return{name:download.suggestedFilename(),project:JSON.parse(await readFile((await download.path())!,'utf8')) as ProjectDocument}}
async function another(page:Page){await page.locator('header').getByRole('button',{name:'Новый проект',exact:true}).click();const panel=page.locator('.import-panel');await panel.getByLabel('Исходный текст',{exact:true}).fill('X;Y\n20;30\n40;50');await panel.getByRole('button',{name:'Построить',exact:true}).click();await expect(panel).toHaveCount(0)}

for(const change of ['edit','undo'] as const)test(`closing after an asynchronous save retains ${change} made while the snapshot was in flight`,async({page})=>{
 await page.addInitScript(()=>{
  const NativeWorker=Worker,w=window as unknown as {holdSave:boolean;heldSave?:()=>void};w.holdSave=true;
  window.Worker=class extends NativeWorker{
   private serialization:boolean;
   constructor(url:string|URL,options?:WorkerOptions){super(url,options);this.serialization=String(url).includes('serialize.worker')}
   override postMessage(message:unknown,transfer:Transferable[]|StructuredSerializeOptions=[]){
    const send=()=>super.postMessage(message,transfer as Transferable[]);
    if(this.serialization&&w.holdSave&&message&&typeof message==='object'&&'pretty'in message&&message.pretty===true){w.holdSave=false;w.heldSave=send}else send();
   }
  };
 });
 await page.goto('/');const p=await load(page,'concurrent.aph');await selectSeries(page,p.series[0].id);const marker=page.getByLabel('Размер маркера, pt',{exact:true});await marker.fill('5');
 await page.getByRole('button',{name:'Закрыть график: concurrent.aph',exact:true}).click();await page.getByRole('dialog').getByRole('button',{name:'Сохранить',exact:true}).click();
 await page.waitForFunction(()=>!!(window as unknown as {heldSave?:()=>void}).heldSave);if(change==='edit')await marker.fill('6');else await page.locator('header').getByRole('button',{name:'Отменить',exact:true}).click();
 const pending=page.waitForEvent('download');await page.evaluate(()=>(window as unknown as {heldSave:()=>void}).heldSave());const file=await pending;
 expect(JSON.parse(await readFile((await file.path())!,'utf8')).series[0].style.markerSizePt).toBe(5);
 await expect(page.getByRole('tab',{name:'concurrent.aph',exact:true})).toHaveAttribute('aria-description','Есть несохранённые изменения');
 expect((await saved(page)).project.series[0].style.markerSizePt).toBe(change==='edit'?6:3);
});

test('serialization resumes after browser pagehide and pageshow without losing source data',async({page})=>{
 await page.goto('/');const p=await load(page,'resumed.aph');expect((await saved(page)).project.datasets).toEqual(p.datasets);
 await page.evaluate(()=>{window.dispatchEvent(new PageTransitionEvent('pagehide',{persisted:true}));window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}))});
 expect((await saved(page)).project.datasets).toEqual(p.datasets);
});

test('new graphs keep the old unsaved graph, its view and Undo history and move plus after the last tab',async({page})=>{
 await page.goto('/');const p=await load(page,'first.aph');await selectSeries(page,p.series[0].id);await page.getByLabel('Размер маркера, pt',{exact:true}).fill('5');await page.getByRole('button',{name:'Закрыть',exact:true}).click();await page.mouse.move(400,300);await page.mouse.wheel(0,-200);await expect(page.getByRole('tab',{name:'first.aph',exact:true})).toHaveAttribute('aria-description','Есть несохранённые изменения');const before=(await page.locator('.new-project-button').boundingBox())!;
 await another(page);await expect(page.getByRole('tab')).toHaveCount(2);const after=(await page.locator('.new-project-button').boundingBox())!,last=(await page.getByRole('tab').last().boundingBox())!;expect(after.x).toBeGreaterThan(before.x+40);expect(after.x).toBeGreaterThan(last.x+last.width);await expect(page.locator('header select')).toHaveCount(0);const second=await saved(page);expect(second.project.datasets[0].points.map(({x,y})=>({x,y}))).toEqual([{x:20,y:30},{x:40,y:50}]);
 await page.getByRole('tab',{name:'first.aph',exact:true}).click();const first=await saved(page);expect(first.project.datasets).toEqual(p.datasets);expect(first.project.series[0].style.markerSizePt).toBe(5);expect(first.project.viewport).not.toEqual(p.viewport);await page.locator('header').getByRole('button',{name:'Отменить',exact:true}).click();expect((await saved(page)).project.series[0].style.markerSizePt).toBe(3);await page.getByRole('tab').last().click();expect((await saved(page)).project.datasets).toEqual(second.project.datasets);
 await page.getByRole('tab').first().focus();await page.keyboard.press('ArrowRight');await expect(page.getByRole('tab').last()).toBeFocused();await expect(page.getByRole('tab').last()).toHaveAttribute('aria-selected','true');await page.screenshot({path:'test-results/workspace-tabs.png'});
});

test('imported file names label tabs without Untitled and the empty launch tab is reused',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Новый проект',exact:true}).click();await page.getByRole('button',{name:'Вставить таблицу',exact:true}).click();await page.getByLabel('Исходный текст',{exact:true}).fill('X Y\n1 2\n3 4');await page.locator('.import-panel').getByRole('button',{name:'Построить',exact:true}).click();await expect(page.getByRole('tab')).toHaveCount(1);await expect(page.locator('header')).not.toContainText('Untitled');
 await page.locator('header').getByRole('button',{name:'Новый проект',exact:true}).click();const chooser=page.waitForEvent('filechooser');await page.locator('.import-panel').getByRole('button',{name:'Выбрать файл',exact:true}).click();await(await chooser).setFiles({name:'Co 0.05 NaOH.txt',mimeType:'text/plain',buffer:Buffer.from('X Y\n5 8\n9 12')});await page.locator('.import-panel').getByRole('button',{name:'Построить',exact:true}).click();await expect(page.getByRole('tab')).toHaveCount(2);await expect(page.getByRole('tab',{name:'Co 0.05 NaOH.txt',exact:true})).toHaveAttribute('aria-selected','true');expect((await saved(page)).name).toBe('Co 0.05 NaOH.aph');
});

test('closing an inactive dirty tab saves that graph rather than the active one and Cancel retains it',async({page})=>{
 await page.goto('/');const first=await load(page,'first.aph');await selectSeries(page,first.series[0].id);await page.getByLabel('Размер маркера, pt',{exact:true}).fill('7');const second=await load(page,'second.aph',addPairs(createProject(),[{x:8,y:9}],'Second'));
 await page.getByRole('button',{name:'Закрыть график: first.aph',exact:true}).click();const dialog=page.getByRole('dialog');await expect(dialog).toContainText('first.aph');await dialog.getByRole('button',{name:'Отмена',exact:true}).click();await expect(page.getByRole('tab')).toHaveCount(2);await expect(page.getByRole('tab',{name:'second.aph',exact:true})).toHaveAttribute('aria-selected','true');
 await page.getByRole('button',{name:'Закрыть график: first.aph',exact:true}).click();const pending=page.waitForEvent('download');await dialog.getByRole('button',{name:'Сохранить',exact:true}).click();const file=await pending,p=JSON.parse(await readFile((await file.path())!,'utf8')) as ProjectDocument;expect(file.suggestedFilename()).toBe('first.aph');expect(p.datasets).toEqual(first.datasets);expect(p.series[0].style.markerSizePt).toBe(7);await expect(page.getByRole('tab')).toHaveCount(1);expect((await saved(page)).project.datasets).toEqual(second.datasets);
 await page.getByRole('button',{name:'Закрыть график: second.aph',exact:true}).click();await expect(page.locator('.welcome-screen')).toBeVisible();await expect(page.locator('header')).toHaveCount(0);
});

test('recovery includes inactive dirty graphs when the active graph is clean',async({page})=>{
 await page.goto('/');const first=await load(page,'first.aph');await selectSeries(page,first.series[0].id);await page.getByLabel('Размер маркера, pt',{exact:true}).fill('6');await load(page,'second.aph');await page.evaluate(()=>window.dispatchEvent(new Event('blur')));await expect.poll(()=>page.evaluate(()=>{const saved=localStorage.getItem('apio-graph.recovery.v1');return saved?JSON.parse(JSON.parse(saved).text).extensions.apioWorkspaceRecovery.tabs.length:0})).toBe(2);
 page.on('dialog',dialog=>dialog.accept());await page.reload();await page.getByRole('button',{name:'Восстановить',exact:true}).click();await expect(page.getByRole('tab')).toHaveCount(2);await expect(page.getByRole('tab',{name:'second.aph',exact:true})).toHaveAttribute('aria-selected','true');await page.getByRole('tab',{name:'first.aph',exact:true}).click();const recovered=await saved(page);expect(recovered.project.datasets).toEqual(first.datasets);expect(recovered.project.series[0].style.markerSizePt).toBe(6);expect(recovered.project.extensions.apioWorkspaceRecovery).toBeUndefined();
});
