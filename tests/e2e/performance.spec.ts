import {downloadedGraph} from './projectDownload';
import {enterEditor} from './helpers';
import {test,expect} from '@playwright/test';
import {createProject,addPairs,makeObject} from '../../src/domain/model';
import {serialize} from '../../src/domain/project';
import os from 'node:os';
import {readFile,writeFile} from 'node:fs/promises';
import {largePoints,largeProject} from '../fixtures/large-data';
test('QUA-003/004 full 100k preparation <=5s and 10k drag p95 <=33.34ms',async({page},testInfo)=>{
 test.setTimeout(90000);
 const results:Record<string,unknown>={os:`${os.type()} ${os.release()}`,cpu:os.cpus()[0].model,logicalCpus:os.cpus().length,ramGiB:os.totalmem()/1024**3,viewport:'1440×900',engine:'Microsoft Edge / Playwright',scale:1};
 for(const n of[10000,100000]){
  let seed=12345;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32};
  let p=addPairs(createProject(),Array.from({length:n},(_,i)=>({x:i,y:Math.sin(i/110)+random()*0.01})),'Benchmark');
  p={...p,viewport:{xMin:0,xMax:n,yMin:-2,yMax:2},axes:{x:{...p.axes.x,mode:'manual',min:0,max:n},y:{...p.axes.y,mode:'manual',min:-2,max:2}}};
  for(let i=0;i<(n===10000?30:50);i++)p.objects.push(makeObject('rectangle',[{mode:'data',x:n*(0.1+0.01*i),y:1.4},{mode:'data',x:n*(0.11+0.01*i),y:1.6}]));
  const fixtureStart=performance.now(),file=testInfo.outputPath(`benchmark-${n}.aph`);await writeFile(file,serialize(p));results['fixture'+n+'Ms']=performance.now()-fixtureStart;await page.goto('/');const start=performance.now();await page.locator('input[type=file]').setInputFiles(file);await expect(page.locator('[data-series]')).toHaveCount(1);await expect(page.locator('[data-object]')).toHaveCount(p.objects.length);const prepared=performance.now()-start;results[`prepare${n}Ms`]=prepared;await testInfo.attach('prepare'+n+'.json',{body:JSON.stringify(results,null,2),contentType:'application/json'});expect(prepared).toBeLessThanOrEqual(5000);
  if(n===10000){const obj=page.locator(`[data-object="${p.objects[0].id}"] rect`).first(),b=(await obj.boundingBox())!;await page.mouse.move(b.x+b.width/2,b.y+b.height/2);await page.mouse.down();
   const framesPromise=page.evaluate(()=>new Promise<number[]>(resolve=>{const frames:number[]=[];let start=0,last=0;function frame(t:number){if(!start)start=t;if(last)frames.push(t-last);last=t;if(t-start>2200)resolve(frames);else requestAnimationFrame(frame)}requestAnimationFrame(frame)}));
   for(let i=0;i<60;i++){await page.mouse.move(b.x+b.width/2+Math.sin(i/8)*60,b.y+b.height/2+Math.cos(i/8)*25);await page.waitForTimeout(20)}await page.mouse.up();const frames=(await framesPromise).sort((a,b)=>a-b),p95=frames[Math.floor((frames.length-1)*.95)];results.dragP95Ms=p95;results.frameCount=frames.length;expect(p95).toBeLessThanOrEqual(33.34);
  }
 }
 await testInfo.attach('performance.json',{body:JSON.stringify(results,null,2),contentType:'application/json'});
});

test('IMP-T15/QUA-004 100k CSV import and preparation <=5s, every observation retained',async({page},testInfo)=>{
 test.setTimeout(60000);
 const points=largePoints(100000),buffer=Buffer.from('X,Y\n'+points.map(pt=>`${pt.x},${pt.y}`).join('\n'));
 await page.goto('/');
 const heapBefore=await page.evaluate(()=>((performance as Performance&{memory?:{usedJSHeapSize:number}}).memory?.usedJSHeapSize??null));
 const parsingWorker=page.waitForEvent('worker',worker=>worker.url().includes('parse.worker'));
 const start=performance.now();await page.locator('input[type=file]').setInputFiles({name:'large.csv',mimeType:'text/csv',buffer});
 await parsingWorker;
 await expect(page.getByText('Корректных строк: 100000',{exact:false})).toBeVisible();
 await expect(page.locator('.import-panel textarea')).toHaveCount(0);await expect(page.getByRole('table',{name:'Предпросмотр данных',exact:true}).locator('tbody tr')).toHaveCount(100);
 await page.getByRole('button',{name:'Построить',exact:true}).click();await expect(page.locator('[data-series]')).toHaveCount(1);
 const preparedMs=performance.now()-start;
 const heapAfter=await page.evaluate(()=>((performance as Performance&{memory?:{usedJSHeapSize:number}}).memory?.usedJSHeapSize??null));
 await testInfo.attach('csv-performance.json',{body:JSON.stringify({preparedMs,sourceBytes:buffer.length,heapBefore,heapAfter,engine:await page.evaluate(()=>navigator.userAgent)},null,2),contentType:'application/json'});
 expect(preparedMs).toBeLessThanOrEqual(5000);
 await expect.poll(()=>page.evaluate(async()=>{const modulePath='/src/platform/files.ts';const {readRecovery}=await import(modulePath);const recovery=await readRecovery();return recovery?JSON.parse(recovery.text).datasets[0]?.points.length:0})).toBe(100000);
 page.on('dialog',dialog=>dialog.accept());await page.reload();await page.getByRole('button',{name:'Восстановить',exact:true}).click();await expect(page.getByTestId('chart')).toHaveAttribute('data-raw-point-count','100000');await expect(page.getByRole('alertdialog')).toHaveCount(0);
 const pending=page.waitForEvent('download');await page.locator('header').getByRole('button',{name:'Сохранить',exact:true}).click();
 const saved=await downloadedGraph(await readFile((await(await pending).path())!));
 expect(saved.datasets[0].points).toHaveLength(points.length);expect(saved.datasets[0].points[99999].x).toBe(points[99999].x);expect(saved.datasets[0].points[99999].y).toBe(points[99999].y);
});

test('QUA 1m observations load with simplified display and exact source retained',async({page},testInfo)=>{
 test.setTimeout(120000);
 const fixture=largeProject(1000000);fixture.series[0].mode='line-points';fixture.series[0].style.markerVisible=true;const buffer=Buffer.from(JSON.stringify(fixture));
 const file=testInfo.outputPath('million.aph');await writeFile(file,buffer);
 await page.goto('/');const start=performance.now();
 await page.locator('input[type=file]').setInputFiles(file);
 await expect(page.locator('[data-series]')).toHaveCount(1,{timeout:60000});
 const preparedMs=performance.now()-start;const displayed=await page.locator('[data-series] [data-point],[data-series] [data-marker-ids]').evaluateAll(elements=>elements.reduce((n,e)=>n+(e.getAttribute('data-marker-ids')?.split(' ').length??1),0));
 expect(displayed).toBeLessThan(10000);expect(displayed).toBeGreaterThan(1000);
 await expect(page.getByTestId('chart')).toHaveAttribute('data-raw-point-count','1000000');
 await testInfo.attach('million-performance.json',{body:JSON.stringify({preparedMs,displayed,sourcePoints:1000000,sourceBytes:buffer.length}),contentType:'application/json'});
 const pending=page.waitForEvent('download');await page.locator('header').getByRole('button',{name:'Сохранить',exact:true}).click();
 const saved=await downloadedGraph(await readFile((await(await pending).path())!));
 expect(saved.datasets[0].points).toHaveLength(1000000);expect(saved.datasets[0].points[999999]).toEqual(fixture.datasets[0].points[999999]);
});

test('IMP large preview remains cancelable and canceled parsing commits no data',async({page})=>{
 const buffer=Buffer.from('X,Y\n'+largePoints(100000).map(pt=>`${pt.x},${pt.y}`).join('\n'));
 await page.goto('/');const worker=page.waitForEvent('worker',value=>value.url().includes('parse.worker'));
 await page.locator('input[type=file]').setInputFiles({name:'cancel.csv',mimeType:'text/csv',buffer});await worker;
 const start=performance.now();await page.getByRole('button',{name:'Отмена',exact:true}).click();
 expect(performance.now()-start).toBeLessThan(1500);
 await expect(page.locator('[data-series]')).toHaveCount(0);await expect(page.locator('header')).toHaveCount(0);await expect(page.getByTestId('chart')).toHaveCount(0);await enterEditor(page);await expect(page.locator('header').getByRole('button',{name:'Отменить',exact:true})).toBeDisabled();
 const pending=page.waitForEvent('download');await page.locator('header').getByRole('button',{name:'Сохранить',exact:true}).click();
 const saved=await downloadedGraph(await readFile((await(await pending).path())!));expect(saved.datasets).toEqual([]);
});
