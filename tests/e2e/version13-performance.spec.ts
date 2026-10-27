import {test,expect,type Page} from '@playwright/test';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {execFile} from 'node:child_process';
import os from 'node:os';
import {createProject,makeSeries} from '../../src/domain/model';
import {largeProject} from '../fixtures/large-data';
import {downloadedGraph} from './projectDownload';

function percentiles(values:number[]){
 const sorted=[...values].sort((a,b)=>a-b);
 const at=(p:number)=>sorted[Math.floor((sorted.length-1)*p)]??null;
 return {p50:at(.5),p95:at(.95),p99:at(.99),max:sorted.at(-1)??null};
}
async function frames(page:Page,gesture:'idle'|'pan'|'zoom'){
 const chart=page.getByTestId('chart'),b=(await chart.boundingBox())!;
 await page.mouse.move(b.x+b.width*.6,b.y+b.height*.6);
 if(gesture==='pan')await page.mouse.down({button:'middle'});
 const times=await chart.evaluate(async(el,gesture)=>{
  const b=el.getBoundingClientRect(),x=b.x+b.width*.6,y=b.y+b.height*.6,intervals:number[]=[];let last=0;
  for(let i=0;i<80;i++){
   const time=await new Promise<number>(resolve=>requestAnimationFrame(resolve));if(last)intervals.push(time-last);last=time;
   if(gesture==='pan')el.dispatchEvent(new PointerEvent('pointermove',{bubbles:true,pointerId:1,button:1,buttons:4,clientX:x+Math.sin(i/8)*30,clientY:y+Math.cos(i/8)*12}));
   if(gesture==='zoom')el.dispatchEvent(new WheelEvent('wheel',{bubbles:true,cancelable:true,clientX:x,clientY:y,deltaY:i%2?-3:3}));
  }return intervals;
 },gesture);
 if(gesture==='pan')await page.mouse.up({button:'middle'});
 return percentiles(times);
}
test('1.3 opt-in comparable navigation and action measurements',async({playwright},info)=>{
 test.skip(!process.env.APIO_V13_PERF,'Opt-in measurements on an isolated local browser');test.setTimeout(900000);
 const rows:Record<string,unknown>[]=[],counts=process.env.APIO_V13_QUICK?[10000]:[0,10000,100000,1000000];
 for(const count of counts)for(const seriesCount of count?[1,5,30]:[0]){
  const project=count?largeProject(count):createProject();
  if(count)project.series=Array.from({length:seriesCount},(_,i)=>makeSeries(project.datasets[0].id,`Signal ${i+1}`,i));
  const fixture=info.outputPath(`input-${count}-${seriesCount}.aph`);await writeFile(fixture,JSON.stringify(project));
  const browser=await playwright.chromium.launch({channel:'msedge',headless:true,args:['--enable-precise-memory-info']});
  try{
   const page=await browser.newPage({viewport:{width:1440,height:900}}),cdp=await browser.newBrowserCDPSession();
   const memory=async()=>{
    const {processInfo}=await cdp.send('SystemInfo.getProcessInfo'),ids=processInfo.map(p=>p.id).filter(Number.isSafeInteger);
    const raw=await new Promise<string>((resolve,reject)=>execFile('powershell.exe',['-NoProfile','-Command',`$taskProcesses=Get-Process -Id ${ids.join(',')} -ErrorAction SilentlyContinue; [pscustomobject]@{workingSet=($taskProcesses|Measure-Object WorkingSet64 -Sum).Sum;privateBytes=($taskProcesses|Measure-Object PrivateMemorySize64 -Sum).Sum}|ConvertTo-Json -Compress`],{windowsHide:true},(e,out)=>e?reject(e):resolve(out)));
    return JSON.parse(raw) as {workingSet:number;privateBytes:number};
   };
   const start=performance.now();await page.goto('/');await expect(page.locator('input[type=file]')).toBeAttached();
   const bootMs=performance.now()-start,before=await memory(),opened=performance.now();
   await page.locator('input[type=file]').setInputFiles(fixture);await expect(page.getByTestId('chart')).toHaveAttribute('data-raw-point-count',String(count),{timeout:90000});
   const openMs=performance.now()-opened,loaded=await memory(),idle=await frames(page,'idle'),pan=await frames(page,'pan'),zoom=await frames(page,'zoom');
   const header=(name:string)=>page.locator('.app-header').getByRole('button',{name,exact:true}),actions:Record<string,number>={};
   if(count){
    let at=performance.now();await header('Свойства графика').click();const properties=page.locator('.graph-properties');await expect(properties).toBeVisible();actions.propertiesMs=performance.now()-at;
    const visible=properties.getByLabel('Видимость',{exact:true});at=performance.now();await visible.uncheck();await expect(page.locator(`[data-series="${project.series[0].id}"]`)).toHaveCount(0);actions.hideMs=performance.now()-at;await visible.check();
    await properties.getByRole('button',{name:'Данные и результаты',exact:true}).click();const tree=page.locator('.data-results-panel');
    at=performance.now();await tree.getByRole('button',{name:'Свернуть все',exact:true}).click();await tree.getByRole('button',{name:'Развернуть все',exact:true}).click();actions.collapseExpandMs=performance.now()-at;
    await tree.getByRole('button',{name:'Закрыть',exact:true}).click();
   }
   const saves:number[]=[];let outputBytes=0;
   for(let i=0;i<2;i++){
    const at=performance.now(),pending=page.waitForEvent('download');await header('Сохранить').click();const file=await pending,bytes=await readFile((await file.path())!);saves.push(performance.now()-at);outputBytes=bytes.length;
    const restored=await downloadedGraph(bytes);expect(restored.datasets.map(d=>d.points.length)).toEqual(project.datasets.map(d=>d.points.length));
    if(count){expect(restored.datasets[0].points[0]).toEqual(project.datasets[0].points[0]);expect(restored.datasets[0].points[count-1]).toEqual(project.datasets[0].points[count-1])}
   }
   const saved=await memory();rows.push({count,seriesCount,bootMs,openMs,idle,pan,zoom,actions,saveMs:saves,outputBytes,memorySnapshots:[before,loaded,saved],observedMaxWorkingSetMiB:Math.max(before.workingSet,loaded.workingSet,saved.workingSet)/1024**2});
   await mkdir(process.env.APIO_V13_PERF!,{recursive:true});await writeFile(`${process.env.APIO_V13_PERF}/navigation.json`,JSON.stringify({environment:{os:os.release(),cpu:os.cpus()[0].model,ramGiB:os.totalmem()/1024**3,viewport:'1440x900',browser:'Edge headless, development server',memory:'Three OS process snapshots including browser/renderers/workers; not absolute peak'},rows},null,2));
  }finally{await browser.close()}
 }
});
