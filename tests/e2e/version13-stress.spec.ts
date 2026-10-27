import {test,expect} from '@playwright/test';
import {mkdir,writeFile} from 'node:fs/promises';
import {execFile} from 'node:child_process';

test('1.3 opt-in full-data optimizer and uncertainty export stress',async({page},info)=>{
 test.skip(!process.env.APIO_V13_STRESS,'Opt-in numerical/export measurements');test.setTimeout(900000);
 const rows:unknown[]=[];await page.goto('/');
 const session=await page.context().browser()!.newBrowserCDPSession(),{processInfo}=await session.send('SystemInfo.getProcessInfo'),ids=processInfo.map(p=>p.id).filter(Number.isSafeInteger),stop=info.outputPath('memory-sampling-complete');
 const command=`$taskPeakWS=0; $taskPeakPrivate=0; $taskSamples=0; while(-not(Test-Path -LiteralPath '${stop.replaceAll("'","''")}')){$taskProcesses=Get-Process -Id ${ids.join(',')} -ErrorAction SilentlyContinue; $taskPeakWS=[math]::Max($taskPeakWS,($taskProcesses|Measure-Object WorkingSet64 -Sum).Sum); $taskPeakPrivate=[math]::Max($taskPeakPrivate,($taskProcesses|Measure-Object PrivateMemorySize64 -Sum).Sum); $taskSamples++; Start-Sleep -Milliseconds 100}; [pscustomobject]@{sampledPeakWorkingSetMiB=$taskPeakWS/1MB;sampledPeakPrivateMiB=$taskPeakPrivate/1MB;samples=$taskSamples;samplingIntervalMs=100}|ConvertTo-Json -Compress`;
 const sampledMemory=new Promise<string>((resolve,reject)=>execFile('powershell.exe',['-NoProfile','-Command',command],{windowsHide:true},(error,output)=>error?reject(error):resolve(output)));
 try{
 for(const count of [10000,100000,1000000])for(const model of ['gaussian','lorentzian','pseudo-voigt']){
  const row=await page.evaluate(async({count,model})=>{
   const mathPath='/src/domain/math/peakFit.ts',clientPath='/src/features/analysis/workerClient.ts';
   const {initialPeakFit,peakProfile}=await import(/* @vite-ignore */ mathPath),{AnalysisWorkerClient}=await import(/* @vite-ignore */ clientPath);
   const points=Array.from({length:count},(_,i)=>{const x=-5+10*i/(count-1);return{x,y:.2+peakProfile(model,x,.35,3,1.2,.4)}}),options=initialPeakFit(points,1,model);
   options.timeLimitMs=120000;const intervals:number[]=[],heap:number[]=[];let last=performance.now();
   const timer=setInterval(()=>{const now=performance.now();intervals.push(now-last);last=now;const memory=(performance as Performance&{memory?:{usedJSHeapSize:number}}).memory;if(memory)heap.push(memory.usedJSHeapSize)},10);
   const started=performance.now();try{const response=await new AnalysisWorkerClient().run({type:'preview',kind:'peak-fit',points,parameters:options});const fit=response.result.data.peakFit;return{count,model,ms:performance.now()-started,n:fit.n,iterations:fit.iterations,rmse:fit.rmse,center:fit.components[0].center,height:fit.components[0].height,fwhm:fit.components[0].fwhm,eta:fit.components[0].eta,uiTimerMaxMs:Math.max(...intervals),sampledMainHeapMiB:Math.max(...heap)/1024**2}}finally{clearInterval(timer)}
  },{count,model});
  expect(row.n).toBe(count);expect(row.center).toBeCloseTo(.35,5);expect(row.fwhm).toBeCloseTo(1.2,5);expect(row.rmse).toBeLessThan(1e-6);rows.push(row);
  await mkdir(process.env.APIO_V13_STRESS!,{recursive:true});await writeFile(`${process.env.APIO_V13_STRESS}/scientific.json`,JSON.stringify({rows},null,2));
 }
 const exported=await page.evaluate(async()=>{
  const modelPath='/src/domain/model.ts',svgPath='/src/features/export/svgClient.ts',archivePath='/src/features/workspace/archive.ts';
  const {createProject,addPairs,id}=await import(/* @vite-ignore */ modelPath),{buildSvg}=await import(/* @vite-ignore */ svgPath),{writeWorkspace,readWorkspace}=await import(/* @vite-ignore */ archivePath);
  const count=1000000,p=addPairs(createProject(),Array.from({length:count},(_,x)=>({x,y:Math.sin(x/10000),errorY:.02})),'Full measurements');p.series[0].style.markerVisible=false;
  const intervals:number[]=[];let last=performance.now();const timer=setInterval(()=>{const now=performance.now();intervals.push(now-last);last=now},10),start=performance.now();
  try{const svg=await buildSvg(p,{width:1200,height:800},new AbortController().signal),exportMs=performance.now()-start,segments=(svg.match(/M/g)??[]).length,bytes=new Blob([svg]).size,tab=id(),at=performance.now(),aph=await writeWorkspace({id:id(),activeId:tab,tabs:[{id:tab,label:'Errors',project:p}]}),archive=await readWorkspace(aph),restored=archive.graph(tab);return{count,exportMs,bytes,segments,archiveMs:performance.now()-at,archiveBytes:aph.length,first:restored.datasets[0].points[0],last:restored.datasets[0].points[count-1],uiTimerMaxMs:Math.max(...intervals)}}finally{clearInterval(timer)}
 });
 expect(exported.segments).toBeGreaterThanOrEqual(3000000);expect(exported.first.errorY).toBe(.02);expect(exported.last.errorY).toBe(.02);rows.push(exported);await writeFile(`${process.env.APIO_V13_STRESS}/scientific.json`,JSON.stringify({rows},null,2));
 }finally{await writeFile(stop,'complete');const memory=JSON.parse(await sampledMemory);await writeFile(`${process.env.APIO_V13_STRESS}/sampled-memory.json`,JSON.stringify({...memory,scope:'Isolated Edge browser/renderers/GPU processes, including dedicated Worker memory; sampled rather than continuous peak'},null,2))}
});
