import {describe,it,expect} from 'vitest';
import {addPairs,createProject,id,type ProjectDocument} from '../../src/domain/model';
import {History,editPoint} from '../../src/domain/commands';
import {deserialize,serialize,validateProject,validateEdit} from '../../src/domain/project';
import {applySignalResult} from '../../src/features/analysis/signalOperations';
import {calculatePreview,recomputeProject} from '../../src/features/analysis/operations';
import {AnalysisWorkerClient,type AnalysisWorker,type WorkerRequest,type WorkerResponse} from '../../src/features/analysis/workerClient';
import {createRecomputeJob,executeRecomputeJob,applyCalculationPatches,calculationInputsUnchanged} from '../../src/features/analysis/recalculation';
import {peakFromBuffer,packPeaks} from '../../src/features/analysis/signalBuffer';
import {renderSvg} from '../../src/features/export/svgRenderer';
import {peakTableText} from '../../src/features/analysis/PeakResultsTable';
import {lineGeometry,regionGeometry} from '../../src/features/analysis/signalGeometry';
import {buildSignalGrid,installSignalGrid,observeSignalGrid} from '../../src/features/analysis/signalGrid';
import {unpackCoordinates} from '../../src/features/analysis/pointBuffer';
import {createCoordinates} from '../../src/domain/geometry';
import {SnapshotCache,unpackSnapshot} from '../../src/platform/serializationCache';
import {renderProject,previewProject} from '../../src/features/export/previewProject';
import {readFileSync} from 'node:fs';
const fixture=()=>addPairs(createProject(),[0,1,2,3,4].map(x=>({x,y:2+x+(x===2?4:0)})),'Raw');
const args={method:'manual',nodes:[{x:0,y:2},{x:4,y:6}],output:'both'};
function run(p:ProjectDocument){
 const patches=executeRecomputeJob(createRecomputeJob(p)).map(patch=>({calculation:patch.peakValues?{...patch.calculation,data:{peaks:Array.from({length:patch.peakValues.length/10},(_,i)=>peakFromBuffer(patch.peakValues!,i))}}:patch.calculation,datasetId:patch.datasetId,points:patch.coordinates?Array.from({length:patch.coordinates.length/2},(_,i)=>({x:patch.coordinates![i*2],y:patch.coordinates![i*2+1],id:patch.indices![i]>=0?p.datasets.find(d=>d.id===patch.datasetId)!.points[patch.indices![i]].id:id()})):undefined}));
 return applyCalculationPatches(p,p,patches);
}
describe('signal processing document pipeline',()=>{
 it('loads the synthetic three-tool example and reproduces its persisted scientific results',()=>{
  const p=deserialize(readFileSync('examples/signal-processing.aph','utf8')).project;expect(validateProject(p).errors).toEqual([]);const stale={...p,calculations:p.calculations.map(c=>({...c,status:'outdated' as const}))},q=run(stale);expect(q.calculations.every(c=>c.status==='valid')).toBe(true);expect(q.calculations[2].data!.peaks![0]).toMatchObject({x:2,y:1});expect(q.calculations[3].summary.integral).toBeCloseTo(1,12);expect(q.datasets[0]).toBe(p.datasets[0]);
 });
 it('adds two independent baseline results as one undoable command without altering raw coordinates',()=>{
  const p=fixture(),h=new History(p),result=calculatePreview('baseline',p.datasets[0].points,args);
  h.execute('AddSignalResult',q=>applySignalResult(q,q.series[0].id,'baseline',args,result,'Background'));
  const q=h.current;expect(q.calculations).toHaveLength(2);expect(q.datasets).toHaveLength(3);expect(q.datasets[0]).toBe(p.datasets[0]);expect(q.series[1].style.dash).toBe('dash');expect(q.series[2].style.dash).toBe('solid');expect(q.datasets[2].points.map(p=>p.y)).toEqual([0,0,4,0,0]);
  expect(h.labels).toEqual(['AddSignalResult']);h.undo();expect(h.current).toBe(p);h.redo();expect(h.current).toBe(q);
  expect(validateProject(q).errors).toEqual([]);
 });
 it('recalculates both outputs, descendants and complete peak tables, retaining IDs/styles',()=>{
  let p=fixture();p=applySignalResult(p,p.series[0].id,'baseline',args,calculatePreview('baseline',p.datasets[0].points,args),'Baseline');
  p=applySignalResult(p,p.series[2].id,'peaks',{},calculatePreview('peaks',p.datasets[2].points,{}),'Peaks');
  const raw=p.datasets[0],previous=p.datasets[2],edited=editPoint(p,raw.id,raw.points[2].id,{x:2,y:12}),q=run(edited);
  expect(edited.calculations.every(c=>c.status==='outdated')).toBe(true);expect(q.calculations.every(c=>c.status==='valid')).toBe(true);expect(q.calculations[2].data!.peaks![0].y).toBe(8);expect(q.datasets[2].points.map(p=>p.id)).toEqual(previous.points.map(p=>p.id));expect(q.series).toBe(p.series);expect(q.datasets[0]).toBe(edited.datasets[0]);expect(recomputeProject(edited).calculations[2].data).toEqual(q.calculations[2].data);expect(validateProject(q).errors).toEqual([]);
 });
 it('tracks the baseline as a second area dependency and merges concurrent display changes',()=>{
  let p=fixture();p=addPairs(p,[{x:0,y:1},{x:.5,y:2},{x:4,y:1}],'Reference');p.axes.x.unit='s';p.axes.y.unit='mV';
  const parameters={range:[.25,3.5],baselineDatasetId:p.datasets[1].id};p=applySignalResult(p,p.series[0].id,'area',parameters,calculatePreview('area',p.datasets[0].points,parameters,p.datasets[1].points),'Area');
  const calc=p.calculations[0];expect(calc.sourceDatasetIds).toEqual(p.datasets.map(d=>d.id));expect(calc.parameters.sourceUnits).toEqual({x:'s',y:'mV'});expect(p.datasets).toHaveLength(2);
  const edited=editPoint(p,p.datasets[1].id,p.datasets[1].points[1].id,{x:.5,y:3});expect(edited.calculations[0].status).toBe('outdated');
  const styled={...edited,calculations:edited.calculations.map(c=>({...c,display:{...c.display!,visible:false,stroke:'#FF0000'}}))};expect(calculationInputsUnchanged(styled,edited)).toBe(true);
  const patches=executeRecomputeJob(createRecomputeJob(edited));const q=applyCalculationPatches(styled,edited,patches);expect(q.calculations[0].display).toEqual(styled.calculations[0].display);expect(q.calculations[0].summary.integral).not.toBe(calc.summary.integral);
  const job=createRecomputeJob(edited);job.sourceUnits![p.datasets[1].id].y='V';expect(executeRecomputeJob(job)[0].calculation.summary.errorCode).toBe('SIGNAL_BASELINE_UNITS');
 });
 it('keeps the last confirmed data on failure and rejects stale application',()=>{
  let p=fixture();p=applySignalResult(p,p.series[0].id,'peaks',{},calculatePreview('peaks',p.datasets[0].points,{}),'Peaks');const data=p.calculations[0].data;
  const edited=editPoint(p,p.datasets[0].id,p.datasets[0].points[1].id,{x:0,y:2});const q=run(edited);expect(q.calculations[0].status).toBe('invalid');expect(q.calculations[0].data).toBe(data);
  expect(()=>applyCalculationPatches(edited,p,[])).toThrow('MATH_PREVIEW_STALE');expect(p.calculations[0].status).toBe('valid');
 });
 it('round-trips full-precision peak data, area units/display and negative zero',()=>{
  let p=fixture();for(const kind of ['peaks','area'] as const)p=applySignalResult(p,p.series[0].id,kind,{},calculatePreview(kind,p.datasets[0].points,{}),kind);
  p.calculations[0].data!.peaks![0].y=-0;const q=deserialize(serialize(p)).project;expect(q).toEqual(p);expect(Object.is(q.calculations[0].data!.peaks![0].y,-0)).toBe(true);expect(q.calculations[1].parameters.range).toEqual([0,4]);expect(validateEdit(p,{...p,calculatedAt:undefined} as ProjectDocument).errors.length).toBeGreaterThan(0);
 });
 it('migrates old 1.0 without changing any source, IDs, styles or metadata',()=>{
  const old={...fixture(),schemaVersion:'1.0.0'},q=deserialize(JSON.stringify(old)).project;expect(q.schemaVersion).toBe('1.1.0');expect({...q,schemaVersion:'1.0.0'}).toEqual(old);expect(validateProject(old).errors).toEqual([]);
  const invalid={...q,calculations:[{id:id(),kind:'peaks',sourceDatasetIds:[q.datasets[0].id],resultDatasetId:null,parameters:{},summary:{},status:'valid',algorithmVersion:1}]};expect(validateProject(invalid).errors.join()).toContain('MISSING_PEAK_RESULTS');
 });
 it('reuses validated legacy measurements on the first appearance edit after migration',()=>{
  const p=deserialize(JSON.stringify({...fixture(),schemaVersion:'1.0.0'})).project,point=p.datasets[0].points[0];let reads=0;Object.defineProperty(p.datasets[0].points,'0',{get:()=>{reads++;return point},enumerable:true,configurable:true});const q={...p,series:p.series.map(s=>({...s,visible:false}))};expect(validateEdit(p,q).errors).toEqual([]);expect(reads).toBe(0);
 });
 it('renders confirmed batched marks and signed region in SVG/BW, excluding draft handles',()=>{
  let p=fixture();p=applySignalResult(p,p.series[0].id,'peaks',{},calculatePreview('peaks',p.datasets[0].points,{}),'Peaks');p=applySignalResult(p,p.series[0].id,'area',{range:[.5,3.5]},calculatePreview('area',p.datasets[0].points,{range:[.5,3.5]}),'Area');
  for(const colorMode of ['original','strict-bw'] as const){const svg=renderSvg(p,{width:1200,height:800,colorMode});expect(svg).toContain('data-signal-peaks');expect(svg).toContain('data-signal-area');expect(svg).toContain('∫ =');expect(svg).not.toContain('data-signal-draft');if(colorMode==='strict-bw')expect(svg).toContain('url(#hatch)')}
  const q={...p,calculations:p.calculations.map(c=>({...c,display:{...c.display!,visible:false}}))};const svg=renderSvg(q,{width:1200,height:800});expect(svg).not.toContain('data-signal-peaks');expect(svg).not.toContain('data-signal-area');
 });
 it('uses physical clipped boundaries in area geometry and keeps data unchanged',()=>{
  const p=fixture(),copy=structuredClone(p),c=createCoordinates(p,1200,800);expect(regionGeometry(p.datasets[0].points,undefined,{range:[.5,3.5]},c,p,true)).toMatch(/^M.*Z$/);expect(regionGeometry(p.datasets[0].points,undefined,{range:[-1,3]},c,p,true)).toBe('');expect(lineGeometry(p.datasets[0].points,c,p,true)).toContain('L');expect(p).toEqual(copy);
 });
 it('bounds cold unordered screen-region work without sorting the full scientific array',()=>{
  const p=fixture(),source=Array.from({length:100001},(_,i)=>({x:100000-i,y:i%17}));let reads=0;const points=new Proxy(source,{get(target,key,receiver){if(typeof key==='string'&&/^\d+$/.test(key))reads++;return Reflect.get(target,key,receiver)}});p.viewport={xMin:0,xMax:100000,yMin:0,yMax:18};const c=createCoordinates(p,1200,800);expect(regionGeometry(points,undefined,{range:[0,100000],sortCopy:true},c,p,true)).toBe('');expect(reads).toBe(0);const grid=buildSignalGrid(points,{sortCopy:true});installSignalGrid(points,{sortCopy:true},unpackCoordinates(grid.coordinates),grid.index);reads=0;expect(regionGeometry(points,undefined,{range:[0,100000],sortCopy:true},c,p,true)).toMatch(/^M.*Z$/);expect(reads).toBe(0);
 });
 it('still draws a cold hidden unordered source when exact domain endpoints are not sampled',()=>{
  const p=fixture(),source=Array.from({length:10000},(_,x)=>({x,y:1}));[source[0],source[1]]=[source[1],source[0]];[source[9999],source[3]]=[source[3],source[9999]];p.viewport={xMin:0,xMax:9999,yMin:0,yMax:2};const c=createCoordinates(p,1200,800),grid=buildSignalGrid(source,{sortCopy:true});installSignalGrid(source,{sortCopy:true},unpackCoordinates(grid.coordinates),grid.index);expect(regionGeometry(source,undefined,{range:[0,9999],sortCopy:true},c,p,true)).toMatch(/^M.*Z$/);
 });
 it('aggregates every duplicate before display thinning and preserves the true mean',()=>{
  const p=fixture(),source=[{x:0,y:0},...Array.from({length:1000},(_,i)=>({x:1,y:i===999?100:0})),...Array.from({length:9000},(_,i)=>({x:i+2,y:0}))],parameters={range:[0,9001],duplicates:'mean',sortCopy:true};p.viewport={xMin:0,xMax:9001,yMin:0,yMax:2};const c=createCoordinates(p,1200,800),grid=buildSignalGrid(source,parameters),ordered=unpackCoordinates(grid.coordinates);installSignalGrid(source,parameters,ordered,grid.index);expect(ordered[1].y).toBeCloseTo(.1,12);const path=regionGeometry(source,undefined,parameters,c,p,true);expect(path).toContain(`${c.x(1)},${c.y(ordered[1].y)}`);expect(path).not.toContain(`${c.x(1)},${c.y(1.5625)}`);
 });
 it('notifies a subscriber if another component finished the grid between render and effect',()=>{
  const points=Array.from({length:5000},(_,x)=>({x,y:x%2})),grid=buildSignalGrid(points,{});installSignalGrid(points,{},unpackCoordinates(grid.coordinates),grid.index);let updates=0;const off=observeSignalGrid(points,{},()=>updates++);expect(updates).toBe(1);off();
 });
 it('shares immutable peak tables across saves and retains required area fields in export packets',()=>{
  let p=fixture();p=applySignalResult(p,p.series[0].id,'peaks',{},calculatePreview('peaks',p.datasets[0].points,{}),'Peaks');p=applySignalResult(p,p.series[0].id,'area',{range:[.5,3.5]},calculatePreview('area',p.datasets[0].points,{range:[.5,3.5]}),'Area');
  const cache=new SnapshotCache(),packet=cache.pack(p),resources=new Map(packet.resources.map(r=>[r.id,r.value]));expect(packet.root.project.calculations[0]).not.toHaveProperty('data');expect(unpackSnapshot(packet.root,resources)).toEqual(p);cache.acknowledge(packet.keep);const styled={...p,calculations:p.calculations.map(c=>({...c,display:{...c.display!,visible:false}}))};expect(cache.pack(styled).resources).toEqual([]);
  const exported=renderProject(p);expect(exported.calculations[1].parameters).toMatchObject({range:[.5,3.5]});expect(exported.calculations[1].parameters).not.toHaveProperty('calculatedAt');expect(renderSvg(exported,{width:1200,height:800})).toContain('data-signal-area');expect(renderSvg(previewProject(p,0),{width:1200,height:800,includeSeries:false})).toContain('data-area-label');
 });
 it('CSV/TSV preserves full values and blank undefined metrics without locale separator ambiguity',()=>{
  const peaks=calculatePreview('peaks',[{x:0,y:2},{x:.12345678912345678,y:0},{x:1,y:1}],{}).data!.peaks!;const csv=peakTableText(peaks,',');expect(csv.split('\r\n')[1]).toContain('max,,,,,true');expect(peakTableText(peaks,'\t').split('\r\n')[1].split('\t')).toHaveLength(9);expect(peakFromBuffer(packPeaks(peaks),0)).toEqual(peaks[0]);
 });
});
class ManualWorker implements AnalysisWorker{onmessage:((e:MessageEvent<WorkerResponse>)=>void)|null=null;onerror:((e:ErrorEvent)=>void)|null=null;request?:WorkerRequest;terminated=false;postMessage(r:WorkerRequest){this.request=r}terminate(){this.terminated=true}}
describe('signal Worker transport and cancellation',()=>{
 it('decodes nullable peak packets and preserves input array buffers',async()=>{
  const worker=new ManualWorker(),client=new AnalysisWorkerClient(()=>worker),points=Array.from({length:10001},(_,x)=>({x,y:x%2})),pending=client.run({type:'preview',kind:'peaks',points,parameters:{}});const request=worker.request!;expect(request).toHaveProperty('coordinates');const result=calculatePreview('peaks',points,{});worker.onmessage!(new MessageEvent('message',{data:{type:'preview-packed',requestId:request.requestId,coordinates:new Float64Array(),summary:result.summary,peaks:packPeaks(result.data!.peaks!)}}));const response=await pending;expect(response.type).toBe('preview');if(response.type==='preview')expect(response.result.data).toEqual(result.data);expect(points).toHaveLength(10001);expect(worker.terminated).toBe(true);
 });
 it('keeps full baseline outputs separate from Worker-prepared display outlines',async()=>{
  const worker=new ManualWorker(),client=new AnalysisWorkerClient(()=>worker),points=Array.from({length:12001},(_,x)=>({x,y:2+x})),pending=client.run({type:'preview',kind:'baseline',points,parameters:{output:'both'}}),request=worker.request!;
  const coordinates=Float64Array.from(points.flatMap(p=>[p.x,p.y])),companion=Float64Array.from(points.flatMap(p=>[p.x,0]));worker.onmessage!(new MessageEvent('message',{data:{type:'preview-packed',requestId:request.requestId,coordinates,companion,summary:{n:points.length},plot:{baseline:new Float64Array([0,2,12000,12002]),corrected:new Float64Array([0,0,12000,0])}}}));const response=await pending;if(response.type!=='preview')throw Error('preview expected');expect(response.result.points).toHaveLength(12001);expect(response.result.companion).toHaveLength(12001);expect(response.result.plot!.baseline).toHaveLength(2);expect(response.result.points[10000].y).toBe(10002);
 });
 it('cancels while materializing a massive peak packet and ignores a late response',async()=>{
  const worker=new ManualWorker(),client=new AnalysisWorkerClient(()=>worker),pending=client.run({type:'preview',kind:'peaks',points:fixture().datasets[0].points,parameters:{}}),request=worker.request!,onmessage=worker.onmessage!;const rejected=expect(pending).rejects.toMatchObject({name:'AbortError'});onmessage(new MessageEvent('message',{data:{type:'preview-packed',requestId:request.requestId,coordinates:new Float64Array(),summary:{},peaks:new Float64Array(1000000)}}));client.cancel();await rejected;expect(worker.terminated).toBe(true);
 });
});
