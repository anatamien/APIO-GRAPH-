import {test,expect,type Page} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import {addPairs,createProject,makeObject,type ProjectDocument} from '../../src/domain/model';
import {selectSeries} from './helpers';

const text='NewX;NewY\n1000;2000\n1001;2001';
const file={name:'new-data.txt',mimeType:'text/plain',buffer:Buffer.from(text)};
const header=(page:Page,name:string)=>page.locator('header').getByRole('button',{name,exact:true});
async function saved(page:Page){
 const pending=page.waitForEvent('download');await header(page,'Сохранить').click();
 const download=await pending;
 return JSON.parse(await readFile((await download.path())!,'utf8')) as ProjectDocument;
}

for(const route of ['toolbar-text','toolbar-file','external-file','drop','clipboard','plus-text','plus-file'] as const){
 test(`new data through ${route} opens independent axes in a new tab and preserves the previous unsaved graph`,async({page})=>{
  const original=addPairs(createProject(),[{x:2,y:3},{x:6,y:7}],'Original');
  original.axes.x={...original.axes.x,mode:'manual',min:-100,max:100,label:'Original X',unit:'s',tickMode:'manual',tickStep:50};
  original.axes.y={...original.axes.y,mode:'manual',min:-200,max:200,label:'Original Y',unit:'V'};
  original.viewport={xMin:-100,xMax:100,yMin:-200,yMax:200};
  original.objects=[makeObject('text',[{mode:'data',x:4,y:5}],'Keep my annotation')];
  original.page.background='#EEEEEE';original.editor.showPointMarkers=false;
  await page.goto('/');
  await page.locator('input[type=file]').setInputFiles({name:'original.aph',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(original))});
  await selectSeries(page,original.series[0].id);await page.getByLabel('Размер маркера, pt',{exact:true}).fill('7');
  await page.getByRole('button',{name:'Закрыть',exact:true}).click();
  const before=(await page.locator('.new-project-button').boundingBox())!;
  if(route.startsWith('toolbar')||route.startsWith('plus')){
   await header(page,route.startsWith('plus')?'Новый проект':'Импорт данных').click();
   if(route.endsWith('file')){
    const chooser=page.waitForEvent('filechooser');await page.locator('.import-panel').getByRole('button',{name:'Выбрать файл',exact:true}).click();await(await chooser).setFiles(file);
   }else await page.getByLabel('Исходный текст',{exact:true}).fill(text);
  }else if(route==='external-file')await page.locator('input[type=file]').setInputFiles(file);
  else if(route==='drop')await page.evaluate(({text})=>{
   const data=new DataTransfer();data.items.add(new File([text],'new-data.txt',{type:'text/plain'}));
   document.querySelector('.app')!.dispatchEvent(new DragEvent('drop',{dataTransfer:data,bubbles:true,cancelable:true}));
  },{text});
  else await page.evaluate(({text})=>{
   const data=new DataTransfer();data.setData('text/plain',text);
   document.body.dispatchEvent(new ClipboardEvent('paste',{clipboardData:data,bubbles:true,cancelable:true}));
  },{text});
  const panel=page.locator('.import-panel');
  await expect(panel.getByRole('radio').first()).toBeChecked();
  await expect(page.locator('.welcome-screen')).toHaveCount(0);
  await panel.getByRole('button',{name:'Построить',exact:true}).click();await expect(panel).toHaveCount(0);
  await expect(page.getByRole('tab')).toHaveCount(2);await expect(page.getByRole('tab').last()).toHaveAttribute('aria-selected','true');
  await expect(page.getByRole('tab',{name:'original.aph',exact:true})).toHaveAttribute('aria-description','Есть несохранённые изменения');
  const after=(await page.locator('.new-project-button').boundingBox())!,last=(await page.getByRole('tab').last().boundingBox())!;
  expect(after.x).toBeGreaterThan(before.x+40);expect(after.x).toBeGreaterThan(last.x+last.width);
  const next=await saved(page);
  expect(next.project.id).not.toBe(original.project.id);expect(next.datasets).toHaveLength(1);expect(next.series).toHaveLength(1);
  expect(next.datasets[0].points.map(({x,y})=>({x,y}))).toEqual([{x:1000,y:2000},{x:1001,y:2001}]);
  expect(next.datasets[0].id).not.toBe(original.datasets[0].id);
  expect(next.objects).toEqual([]);expect(next.calculations).toEqual([]);expect(next.page).toEqual(createProject().page);expect(next.editor.showPointMarkers).toBe(true);
  expect(next.axes.x).toMatchObject({mode:'auto',label:'NewX',unit:'',tickMode:'auto'});expect(next.axes.y).toMatchObject({mode:'auto',label:'NewY',unit:''});
  expect(next.viewport.xMin).toBeLessThan(1000);expect(next.viewport.xMin).toBeGreaterThan(999);expect(next.viewport.xMax).toBeGreaterThan(1001);expect(next.viewport.xMax).toBeLessThan(1002);
  expect(next.viewport.yMin).toBeLessThan(2000);expect(next.viewport.yMin).toBeGreaterThan(1999);expect(next.viewport.yMax).toBeGreaterThan(2001);expect(next.viewport.yMax).toBeLessThan(2002);
  await page.getByRole('tab',{name:'original.aph',exact:true}).click();const previous=await saved(page);
  for(const key of ['axes','viewport','datasets','objects','calculations','page','editor','extensions'] as const)expect(previous[key]).toEqual(original[key]);
  expect(previous.series[0].style.markerSizePt).toBe(7);await header(page,'Отменить').click();expect((await saved(page)).series).toEqual(original.series);
  await page.getByRole('tab').last().click();expect((await saved(page)).datasets).toEqual(next.datasets);
 });
}
