import {describe,it,expect} from 'vitest';
import {addPairs,createProject,id,makeObject,makeSeries,type ProjectDocument,type CalculationKind} from '../../src/domain/model';
import {History,editPoint} from '../../src/domain/commands';
import {dependencyIndex,dependentCalculations,invalidateDataEdit,removalPlan,removeDataNode,datasetUnits} from '../../src/domain/dependencies';
import {serialize,deserialize,validateProject} from '../../src/domain/project';
import {addCalculation,calculatePreview,recomputeProject} from '../../src/features/analysis/operations';
import {createRecomputeJob,executeRecomputeJob,applyCalculationPatches,replaceCalculation,recomputeIds,calculationInputsUnchanged,type CalculationPatch} from '../../src/features/analysis/recalculation';
import {buildDataTree,flattenDataTree} from '../../src/features/analysis/dataTree';
import {editViewport} from '../../src/domain/editViewport';
import {AnalysisWorkerClient,type AnalysisWorker,type WorkerRequest,type WorkerResponse} from '../../src/features/analysis/workerClient';

const add=(p:ProjectDocument,source:number,kind:CalculationKind,parameters:Record<string,unknown>={},name=kind)=>addCalculation(p,p.series[source].id,kind,parameters,calculatePreview(kind,p.datasets.find(d=>d.id===p.series[source].datasetId)!.points,parameters),name);
function fixture(){
 let p=addPairs(createProject(),Array.from({length:17},(_,x)=>({x,y:3+x*x})),'A');p=addPairs(p,[{x:0,y:1},{x:1,y:2},{x:2,y:3}],'B');
 p=add(p,0,'savitzky-golay',{window:5,degree:2});p=add(p,2,'derivative');p=add(p,0,'linear-fit');p=add(p,0,'statistics');p=add(p,0,'integral');return p;
}
function run(p:ProjectDocument,targets?:string[]):ProjectDocument{
 const job=createRecomputeJob(p,targets),patches:CalculationPatch[]=executeRecomputeJob(job).map(patch=>({calculation:patch.calculation,datasetId:patch.datasetId,points:patch.coordinates?Array.from({length:patch.coordinates.length/2},(_,i)=>({x:patch.coordinates![i*2],y:patch.coordinates![i*2+1],id:patch.indices![i]>=0?p.datasets.find(d=>d.id===patch.datasetId)!.points[patch.indices![i]].id:id()})):undefined}));
 return applyCalculationPatches(p,p,patches);
}
describe('1.1 dependency management',()=>{
 it('builds two independent roots and places operations under their immediate dataset, with scalar leaves',()=>{
  const p=fixture(),tree=buildDataTree(p);expect(tree.roots).toEqual(p.datasets.slice(0,2).map(d=>`dataset:${d.id}`));
  expect(tree.nodes.get(`calculation:${p.calculations[1].id}`)?.parent).toBe(`dataset:${p.datasets[2].id}`);
  expect(tree.nodes.get(`dataset:${p.datasets[3].id}`)?.parent).toBe(`calculation:${p.calculations[1].id}`);
  expect(tree.nodes.get(`calculation:${p.calculations[3].id}`)?.children).toEqual([]);
  expect(p.calculations.slice(-2).map(c=>c.resultDatasetId)).toEqual([null,null]);
 });
 it('indexes only metadata, caches across appearance and navigation, and never iterates points',()=>{
  const p=fixture();for(const d of p.datasets)d.points=new Proxy(d.points,{get(target,key,receiver){if(key!== 'length'&&key!==Symbol.toStringTag)throw Error('Measurement access');return Reflect.get(target,key,receiver)}});
  const index=dependencyIndex(p);expect(buildDataTree(p).nodes.size).toBe(10);
  const q={...p,series:p.series.map(s=>({...s,visible:false})),viewport:{xMin:1,xMax:5,yMin:1,yMax:10}};
  expect(dependencyIndex(q)).toBe(index);expect(dependentCalculations(index,[p.datasets[0].id]).size).toBe(5);
 });
 it('invalidates all A descendants, shares B and untouched series/data arrays, and follows units',()=>{
  const p=fixture(),q=editPoint(p,p.datasets[0].id,p.datasets[0].points[1].id,{x:1,y:100});
  expect(q.calculations.every(c=>c.status==='outdated')).toBe(true);expect(q.datasets[1]).toBe(p.datasets[1]);expect(q.series).toBe(p.series);
  const withB=add(p,1,'statistics');const edited=editPoint(withB,withB.datasets[0].id,withB.datasets[0].points[1].id,{x:1,y:100});expect(edited.calculations.at(-1)).toBe(withB.calculations.at(-1));
  const units=invalidateDataEdit(p,{...p,axes:{...p.axes,y:{...p.axes.y,unit:'mV'}}},'SetAxis');expect(units.calculations.every(c=>c.status==='outdated')).toBe(true);
 });
 it('recalculates selected branch in order, preserves every style and viewport, and retains exact IDs',()=>{
  const original=fixture(),p=editPoint(original,original.datasets[0].id,original.datasets[0].points[4].id,{x:4,y:50});
  const q=run(p,[p.calculations[1].id]);
  expect(q.calculations.map(c=>c.status)).toEqual(['valid','valid','outdated','outdated','outdated']);
  expect(q.datasets[2].points.map(p=>p.id)).toEqual(original.datasets[2].points.map(p=>p.id));expect(q.series).toBe(original.series);expect(q.viewport).toBe(original.viewport);
  const reference=recomputeProject(p);expect(q.datasets[3].points).toEqual(reference.datasets[3].points);expect(validateProject(q).errors).toEqual([]);
 });
 it('sends only needed external inputs and prior X coordinates, not documents, styles, objects or source IDs',()=>{
  const p=fixture(),job=createRecomputeJob(p,[p.calculations[1].id]);
  expect(Object.keys(job)).toEqual(['calculations','units','sources','previous']);expect(job.sources).toHaveLength(1);expect(job.sources[0].id).toBe(p.datasets[2].id);
  expect(Object.keys(job.sources[0])).toEqual(['id','coordinates']);expect(job.sources[0].coordinates).toBeInstanceOf(Float64Array);
  expect(job.previous[0].x).toBeInstanceOf(Float64Array);expect(job.previous[0]).not.toHaveProperty('points');
 });
 it('merges worker patches into concurrent styling/navigation, but rejects edited inputs or changed units',()=>{
  const p=fixture(),changed={...p,series:p.series.map((s,i)=>i===2?{...s,visible:false}:s),viewport:{xMin:1,xMax:4,yMin:0,yMax:20}};
  const patches=[{calculation:{...p.calculations[3],summary:{meanY:42}}}];const q=applyCalculationPatches(changed,p,patches);
  expect(q.series).toBe(changed.series);expect(q.viewport).toBe(changed.viewport);
  const edited=editPoint(p,p.datasets[0].id,p.datasets[0].points[0].id,{x:0,y:99});expect(()=>applyCalculationPatches(edited,p,patches)).toThrow('MATH_PREVIEW_STALE');
  expect(calculationInputsUnchanged({...p,axes:{...p.axes,x:{...p.axes.x,unit:'s'}}},p)).toBe(false);
 });
 it('edits existing parameters atomically; preview/cancel leaves the project unchanged, Undo restores parameters/data/view',()=>{
  const p=fixture(),history=new History(p),args={window:7,degree:2},preview=calculatePreview('savitzky-golay',p.datasets[0].points,args);
  expect(history.canUndo).toBe(false);expect(p.calculations[0].parameters.window).toBe(5);
  history.execute('UpdateCalculation',q=>editViewport(q,replaceCalculation(q,p.calculations[0].id,args,preview),'UpdateCalculation'));
  expect(history.labels).toEqual(['UpdateCalculation']);expect(history.current.datasets).toHaveLength(p.datasets.length);expect(history.current.calculations[0].parameters.window).toBe(7);expect(history.current.calculations[1].status).toBe('outdated');expect(history.current.series).toBe(p.series);
  history.undo();expect(history.current).toBe(p);history.redo();expect(history.current.viewport).toBe(p.viewport);
 });
 it('removing an X/row range from edited parameters really removes it',()=>{
  const p=fixture(),c={...p.calculations[0],parameters:{...p.calculations[0].parameters,rowRange:[2,9]}};
  const q={...p,calculations:p.calculations.map((a,i)=>i===0?c:a)};
  const result=replaceCalculation(q,c.id,{window:5,degree:2},calculatePreview(c.kind,p.datasets[0].points,{window:5,degree:2}));
  expect(result.calculations[0].parameters).not.toHaveProperty('rowRange');
 });
 it('requires confirmation for deleting a branch and detaches all linked objects without orphan IDs',()=>{
  const p=fixture(),d=p.datasets[3],point=d.points[2];p.objects=[makeObject('marker',[{mode:'point',datasetId:d.id,pointId:point.id,fallbackX:point.x,fallbackY:point.y,offsetXpx:0,offsetYpx:0}])];
  const key=`calculation:${p.calculations[0].id}` as const,plan=removalPlan(p,key);expect(plan.calculations.size).toBe(2);expect(plan.linked).toBe(1);expect(()=>removeDataNode(p,key)).toThrow('DATA_HAS_DEPENDENCIES');
  const q=removeDataNode(p,key,true);expect(q.calculations).toHaveLength(3);expect(q.datasets).toHaveLength(3);expect(q.objects[0].anchors[0]).toEqual({mode:'data',x:point.x,y:point.y});expect(validateProject(q)).toEqual({errors:[],warnings:[]});expect(p.datasets).toHaveLength(5);
 });
 it('keeps separate curve identities for multiple curves on a dataset',()=>{
  const p=fixture();p.series=[...p.series,makeSeries(p.datasets[0].id,'A alternative',20)];const tree=buildDataTree(p);
  expect(tree.nodes.has(`series:${p.series.at(-1)!.id}`)).toBe(true);
  const q=removeDataNode(p,`series:${p.series[0].id}`,true);expect(q.datasets).toBeDefined();expect(q.datasets).toEqual(p.datasets);expect(validateProject(q).errors).toEqual([]);
 });
 it('retains previous results and reports errors all the way down a failed branch',()=>{
  let p=addPairs(createProject(),[{x:0,y:1},{x:1,y:2},{x:2,y:4}],'A');p=add(p,0,'exponential-fit');p=add(p,1,'derivative');
  p=editPoint(p,p.datasets[0].id,p.datasets[0].points[0].id,{x:0,y:-1});const q=run(p);
  expect(q.calculations.map(c=>c.status)).toEqual(['invalid','invalid']);expect(q.calculations[1].summary.errorCode).toBe('MATH_DEPENDENCY_INVALID');expect(q.datasets[1]).toBe(p.datasets[1]);expect(q.datasets[2]).toBe(p.datasets[2]);
 });
 it('refuses changed output grids with attached points, and retains old data',()=>{
  let p=addPairs(createProject(),[{x:0,y:1},{x:1,y:2},{x:2,y:4}],'A');p=add(p,0,'linear-fit');const d=p.datasets[1],pt=d.points[1];p.objects=[makeObject('marker',[{mode:'point',datasetId:d.id,pointId:pt.id,fallbackX:pt.x,fallbackY:pt.y,offsetXpx:0,offsetYpx:0}])];
  p=editPoint(p,p.datasets[0].id,p.datasets[0].points[0].id,{x:-1,y:1});const q=run(p);expect(q.calculations[0].summary.errorCode).toBe('MATH_ANCHORED_RESULT_SHAPE');expect(q.datasets[1]).toBe(d);
 });
 it('does not silently retarget an anchored observation when an edited row range has the same length',()=>{
  let p=addPairs(createProject(),Array.from({length:8},(_,x)=>({x,y:x*x})),'A');p=add(p,0,'savitzky-golay',{window:3,degree:2,rowRange:[1,5]});const d=p.datasets[1],point=d.points[0];p.objects=[makeObject('marker',[{mode:'point',datasetId:d.id,pointId:point.id,fallbackX:point.x,fallbackY:point.y,offsetXpx:0,offsetYpx:0}])];
  const args={window:3,degree:2,rowRange:[2,6]},preview=calculatePreview('savitzky-golay',p.datasets[0].points,args);
  expect(()=>replaceCalculation(p,p.calculations[0].id,args,preview)).toThrow('MATH_ANCHORED_RESULT_SHAPE');expect(p.datasets[1]).toBe(d);
 });
 it('preserves scalar values/units/statuses in current round-trip and Undo/Redo',()=>{
  let p=fixture();p.axes.x.unit='s';p.axes.y.unit='mV';p=add(p,3,'statistics');
  expect(datasetUnits(p,p.datasets[3].id)).toEqual({x:'s',y:'mV/s'});expect(p.calculations.at(-1)!.parameters.sourceUnits).toEqual({x:'s',y:'mV/s'});
  const q=deserialize(serialize(p)).project;expect(q).toEqual(p);expect(q.schemaVersion).toBe('1.1.0');
  const history=new History(p);history.execute('Delete',q=>removeDataNode(q,`calculation:${q.calculations.at(-1)!.id}`,true));history.undo();expect(history.current).toBe(p);history.redo();expect(history.current.calculations).toHaveLength(p.calculations.length-1);
 });
 it('rejects cycles and broken sources before a background request is started',()=>{
  const p=fixture(),c=p.calculations[0];const cycle={...p,calculations:p.calculations.map((a,i)=>i===0?{...a,sourceDatasetIds:[p.datasets[3].id]}:a)};expect(()=>recomputeIds(cycle,[c.id])).toThrow('MATH_DEPENDENCY_CYCLE');
  expect(()=>recomputeIds({...p,datasets:p.datasets.slice(1)},[c.id])).toThrow('MATH_SOURCE_MISSING');
 });
 it('handles 1000 dependency nodes without recursive rendering or point iteration',()=>{
  const p=createProject(),raw=id();p.datasets=[{id:raw,name:'Raw',role:'raw',source:{kind:'manual'},points:[]}];let source=raw;
  for(let i=0;i<1000;i++){const cid=id(),did=id();p.calculations.push({id:cid,kind:'moving-average',sourceDatasetIds:[source],resultDatasetId:did,parameters:{window:1},algorithmVersion:1,status:'valid',summary:{}});p.datasets.push({id:did,name:`Result ${i}`,role:'derived',source:{kind:'calculation',calculationId:cid},points:[]});source=did}
  const tree=buildDataTree(p);expect(flattenDataTree(tree,new Set())).toHaveLength(2001);expect(flattenDataTree(tree,new Set([`dataset:${raw}` as const]))).toHaveLength(1);expect(dependencyIndex(p).order).toHaveLength(1000);
 });
});

class NumericWorker implements AnalysisWorker{
 onmessage:((event:MessageEvent<WorkerResponse>)=>void)|null=null;
 onerror:((event:ErrorEvent)=>void)|null=null;
 request?:WorkerRequest;terminated=false;
 postMessage(request:WorkerRequest){this.request=request}
 terminate(){this.terminated=true}
}
describe('1.1 packed worker results',()=>{
 it('returns only result patches and reuses source and style branches and surviving point IDs',async()=>{
  const p=fixture(),worker=new NumericWorker(),client=new AnalysisWorkerClient(()=>worker),pending=client.run({type:'recompute',project:p,targets:[p.calculations[0].id]});
  const request=worker.request!;expect(request.type).toBe('recompute');if(request.type!=='recompute')throw Error('wrong request');expect(request).not.toHaveProperty('project');
  worker.onmessage!(new MessageEvent('message',{data:{type:'recomputed',requestId:request.requestId,patches:executeRecomputeJob(request.job)}}));
  const result=await pending;expect(result.type).toBe('recompute');if(result.type!=='recompute')throw Error('wrong result');expect(result.project.datasets[0]).toBe(p.datasets[0]);expect(result.project.series).toBe(p.series);expect(result.project.datasets[2].points.map(p=>p.id)).toEqual(p.datasets[2].points.map(p=>p.id));expect(worker.terminated).toBe(true);
 });
 it('can cancel while a large numeric packet is being materialized, with no partial project change',async()=>{
  const p=fixture(),worker=new NumericWorker(),client=new AnalysisWorkerClient(()=>worker),pending=client.run({type:'recompute',project:p,targets:[p.calculations[0].id]});
  const rejected=expect(pending).rejects.toMatchObject({name:'AbortError'}),request=worker.request!;
  const coordinates=new Float64Array(200000),indices=new Int32Array(100000).fill(-1);
  worker.onmessage!(new MessageEvent('message',{data:{type:'recomputed',requestId:request.requestId,patches:[{calculation:p.calculations[0],datasetId:p.datasets[2].id,coordinates,indices}]}}));
  client.cancel();await rejected;expect(worker.terminated).toBe(true);expect(p.datasets[2].points).toHaveLength(17);
 });
});
