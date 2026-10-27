import {downloadedGraph} from './projectDownload';
import {test,expect,type Page} from '@playwright/test';
import {readFile} from 'node:fs/promises';
import {addPairs,createProject,type ProjectDocument} from '../../src/domain/model';
import {addCalculation,calculatePreview} from '../../src/features/analysis/operations';
import {autoRange} from '../../src/domain/geometry';
const header=(p:Page,name:string)=>p.locator('header').getByRole('button',{name,exact:true});
async function save(page:Page):Promise<ProjectDocument>{const pending=page.waitForEvent('download');await header(page,'Сохранить').click();return await downloadedGraph(await readFile((await(await pending).path())!))}
function fixture(){
 let p=addPairs(createProject(),Array.from({length:31},(_,x)=>({x,y:Math.sin(x/4)*10+20})),'A');
 const smoothed=calculatePreview('moving-average',p.datasets[0].points,{window:5});
 p=addCalculation(p,p.series[0].id,'moving-average',{window:5},smoothed,'B');
 const derivative=calculatePreview('derivative',p.datasets[1].points,{sort:true});
 p=addCalculation(p,p.series[1].id,'derivative',{sort:true},derivative,'C');
 p.series.forEach((s,i)=>{s.style.stroke=['#000000','#C62828','#698464'][i];s.style.markerStroke=s.style.stroke});p.viewport={xMin:-10,xMax:45,yMin:-15,yMax:40};return p;
}
async function load(page:Page,p:ProjectDocument){await page.goto('/');await page.locator('input[type=file]').setInputFiles({name:'independent.aph',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(p))});await expect(page.locator('[data-series]')).toHaveCount(3);await header(page,'Свойства графика').click()}
test('both hide orders preserve the exact viewport and independent real calculation flags through undo/reopen',async({page})=>{
 const p=fixture();await load(page,p);const panel=page.locator('.graph-properties');
 for(const order of [[0,1,1,0],[1,0,0,1]])for(const i of order){
  await panel.getByLabel('Текущая серия',{exact:true}).selectOption(p.series[i].id);
  await panel.getByLabel('Видимость',{exact:true}).click();p.series[i].visible=!p.series[i].visible;
  const saved=await save(page);expect(saved.series.map(s=>[s.id,s.visible])).toEqual(p.series.map(s=>[s.id,s.visible]));expect(saved.viewport).toEqual(p.viewport);
  for(const s of p.series)await expect(page.locator(`[data-series="${s.id}"]`)).toHaveCount(s.visible?1:0);
 }
 const before=await save(page);await header(page,'Отменить').click();await header(page,'Повторить').click();expect((await save(page)).series).toEqual(before.series);
 await page.locator('input[type=file]').setInputFiles({name:'reopen.aph',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(before))});expect((await save(page)).series).toEqual(before.series);
});
test('real derived curves and point outlines retain independent custom colors in light and True Black',async({page})=>{
 const p=fixture();await load(page,p);const panel=page.locator('.graph-properties');
 for(const [i,color] of ['#000000','#C62828','#698464'].entries()){
  await panel.getByLabel('Текущая серия',{exact:true}).selectOption(p.series[i].id);
  await panel.locator('.color-picker').first().locator('input[type=color]').fill(color);
  for(const mode of ['Линия','Точки','Оба']){await panel.getByRole('radio',{name:mode,exact:true}).click();const paths=page.locator(`[data-series="${p.series[i].id}"] path[stroke="${color}"]`);await expect(paths.first()).toHaveCSS('stroke',`rgb(${color.slice(1).match(/../g)!.map(h=>parseInt(h,16)).join(', ')})`)}
 }
 const saved=await save(page);expect(saved.series.map(s=>s.style.stroke)).toEqual(['#000000','#C62828','#698464']);expect(saved.datasets).toEqual(p.datasets);expect(saved.calculations).toEqual(p.calculations);
 await header(page,'Настройки').click();await page.getByLabel('Тема',{exact:true}).selectOption('dark');
 for(const s of saved.series.slice(1)){const path=page.locator(`[data-series="${s.id}"] path[stroke="${s.style.stroke}"]`).first();await expect(path).toHaveCSS('stroke',`rgb(${s.style.stroke.slice(1).match(/../g)!.map(h=>parseInt(h,16)).join(', ')})`)}
 expect(autoRange(saved).xMax).toBeGreaterThan(30);
});
