import type {Calculation,Point,ProjectDocument} from '../../domain/model';
import {id} from '../../domain/model';
import {MathError,type CalculationResult,type XY} from '../../domain/math';
import {dependencyIndex,dependentCalculations,invalidateDependents,datasetUnits} from '../../domain/dependencies';
import {pointIndex} from '../../domain/geometry';
import {calculatePreview} from './operations';
import {packCoordinates,unpackCoordinates} from './pointBuffer';
import {packPeaks} from './signalBuffer';

export interface RecomputeJob {
 calculations:Calculation[];
 units:Record<string,{x:string;y:string}>;
 sources:{id:string;coordinates:Float64Array}[];
 previous:{id:string;x:Float64Array;anchored:number[]}[];
 sourceUnits?:Record<string,{x:string;y:string}>;
}
export interface NumericPatch {calculation:Calculation;datasetId?:string;coordinates?:Float64Array;indices?:Int32Array;peakValues?:Float64Array}
export interface CalculationPatch {calculation:Calculation;datasetId?:string;points?:Point[]}
/** Target plus descendants, and only dirty ancestors needed by that target. */
export function recomputeIds(p:ProjectDocument,targets?:readonly string[]):Set<string>{
 const index=dependencyIndex(p);if(index.errors.length)throw new MathError(index.errors[0]);
 const chosen=new Set(targets??p.calculations.filter(c=>c.status!=='valid').map(c=>c.id));
 for(const cid of chosen)if(!index.calculations.has(cid))throw new MathError('MATH_RESULT_MISSING');
 const results=[...chosen].flatMap(cid=>index.calculations.get(cid)!.resultDatasetId??[]);
 for(const cid of dependentCalculations(index,results))chosen.add(cid);
 const queue=[...chosen];
 for(let i=0;i<queue.length;i++)for(const source of index.calculations.get(queue[i])!.sourceDatasetIds){const parent=index.producers.get(source);if(parent&&parent.status!=='valid'&&!chosen.has(parent.id)){chosen.add(parent.id);queue.push(parent.id)}}
 return chosen;
}
export function createRecomputeJob(p:ProjectDocument,targets?:readonly string[]):RecomputeJob{
 const index=dependencyIndex(p),chosen=recomputeIds(p,targets),calculations=index.order.filter(c=>chosen.has(c.id));
 const external=new Set<string>();
 for(const c of calculations)for(const source of c.sourceDatasetIds)if(!chosen.has(index.producers.get(source)?.id??''))external.add(source);
 const anchors=[...p.objects.flatMap(o=>o.anchors),p.legend.anchor];
 const unitSources=new Set(calculations.filter(c=>c.kind==='area'&&c.parameters.baselineDatasetId).flatMap(c=>c.sourceDatasetIds));
 return {calculations:calculations.map(c=>{const copy={...c};delete copy.data;return copy}),...(unitSources.size?{sourceUnits:Object.fromEntries([...unitSources].map(did=>[did,datasetUnits(p,did)]))}:{}),units:Object.fromEntries(calculations.map(c=>[c.id,datasetUnits(p,c.sourceDatasetIds[0])])),sources:[...external].map(did=>({id:did,coordinates:packCoordinates(index.datasets.get(did)!.points)})),previous:calculations.flatMap(c=>{
  if(!c.resultDatasetId)return [];const d=index.datasets.get(c.resultDatasetId)!;
  const attached=anchors.filter(a=>a.mode==='point'&&a.datasetId===d.id);
  const ids=attached.length?pointIndex(d.points):undefined;
  return [{id:d.id,x:Float64Array.from(d.points,p=>p.x),anchored:attached.map(a=>a.mode==='point'?ids!.get(a.pointId)!:-1)}];
 })};
}
function matchingIndices(x:Float64Array,points:readonly XY[],kind:Calculation['kind'],sameSelection=true):Int32Array{
 if(sameSelection&&['savitzky-golay','moving-average','derivative','baseline'].includes(kind)&&x.length===points.length)return Int32Array.from(points,(_,i)=>i);
 const groups=new Map<number,{indices:number[];cursor:number}>();
 for(let i=0;i<x.length;i++){let group=groups.get(x[i]);if(!group){group={indices:[],cursor:0};groups.set(x[i],group)}group.indices.push(i)}
 return Int32Array.from(points,p=>{const group=groups.get(p.x);return group?.indices[group.cursor++]??-1});
}
/** Runs entirely inside the existing analysis Worker. No styles or document copies. */
export function executeRecomputeJob(job:RecomputeJob):NumericPatch[]{
 const datasets=new Map(job.sources.map(d=>[d.id,unpackCoordinates(d.coordinates)]));
 const previous=new Map(job.previous.map(d=>[d.id,d])),failed=new Set<string>(),patches:NumericPatch[]=[],date=new Date().toISOString();
 const cache=new WeakMap<XY[],Map<string,CalculationResult>>();
 const metadata=new Set(['sourceSeriesIds','sourceUnits','resultName','calculatedAt','lastAttemptAt']);
 const numericKey=(c:Calculation,paired=false)=>JSON.stringify([c.kind,c.algorithmVersion,Object.entries(c.parameters).filter(([key])=>!metadata.has(key)&&(!paired||key!=='output')).sort(([a],[b])=>a.localeCompare(b))],(_key,v:unknown)=>typeof v==='number'&&Object.is(v,-0)?{negativeZero:true}:v);
 const baselineOutputs=new Map<string,Set<unknown>>();for(const c of job.calculations)if(c.kind==='baseline'){const key=JSON.stringify(c.sourceDatasetIds)+numericKey(c,true);const outputs=baselineOutputs.get(key)??new Set();outputs.add(c.parameters.output??'corrected');baselineOutputs.set(key,outputs)}
 for(const c of job.calculations){
  try{
   const inputs=c.sourceDatasetIds.map(did=>{if(failed.has(did))throw new MathError('MATH_DEPENDENCY_INVALID');const values=datasets.get(did);if(!values)throw new MathError('MATH_SOURCE_MISSING');return values});
   const input=c.kind==='area'||inputs.length===1?inputs[0]:inputs.flat();
   const reference=c.kind==='area'&&typeof c.parameters.baselineDatasetId==='string'?datasets.get(c.parameters.baselineDatasetId):undefined;
   if(c.kind==='area'&&c.parameters.baselineDatasetId&&!reference)throw new MathError('MATH_SOURCE_MISSING');
   if(reference&&job.sourceUnits){const a=job.sourceUnits[c.sourceDatasetIds[0]],b=job.sourceUnits[String(c.parameters.baselineDatasetId)];if(a&&b&&(a.x!==b.x||a.y!==b.y))throw new MathError('SIGNAL_BASELINE_UNITS')}
   const paired=c.kind==='baseline'&&(baselineOutputs.get(JSON.stringify(c.sourceDatasetIds)+numericKey(c,true))?.size??0)>1;
   const key=numericKey(c,paired);
   let methods=cache.get(input);if(!methods){methods=new Map();cache.set(input,methods)}
   let result=methods.get(key);if(!result){result=calculatePreview(c.kind,input,paired?{...c.parameters,output:'both'}:c.parameters,reference);methods.set(key,result)}
   if(paired)result={points:c.parameters.output==='baseline'?result.points:result.companion!,summary:{...result.summary,output:String(c.parameters.output??'corrected')}};
   const patch:NumericPatch={calculation:{...c,status:'valid',summary:{...result.summary},parameters:{...c.parameters,sourceUnits:job.units[c.id],calculatedAt:date},algorithmVersion:1}};
   if(result.data?.peaks)patch.peakValues=packPeaks(result.data.peaks);
   if(c.resultDatasetId){
    const old=previous.get(c.resultDatasetId);if(!old)throw new MathError('MATH_RESULT_MISSING');
    const indices=matchingIndices(old.x,result.points,c.kind),surviving=old.anchored.length?new Set(indices):undefined;
    if(old.anchored.some(i=>!surviving!.has(i)))throw new MathError('MATH_ANCHORED_RESULT_SHAPE');
    datasets.set(c.resultDatasetId,result.points);Object.assign(patch,{datasetId:c.resultDatasetId,coordinates:packCoordinates(result.points),indices});
   }
   patches.push(patch);
  }catch(error){
   if(c.resultDatasetId)failed.add(c.resultDatasetId);
   patches.push({calculation:{...c,status:'invalid',summary:{...c.summary,errorCode:error instanceof MathError?error.code:'MATH_WORKER_FAILURE'},parameters:{...c.parameters,lastAttemptAt:date}}});
  }
 }
 return patches;
}
export function calculationInputsUnchanged(current:ProjectDocument,snapshot:ProjectDocument):boolean{
 if(current.axes.x.unit!==snapshot.axes.x.unit||current.axes.y.unit!==snapshot.axes.y.unit||current.calculations.length!==snapshot.calculations.length)return false;
 const index=dependencyIndex(current);
 if(current.calculations!==snapshot.calculations){const metadata=new Set(['sourceSeriesIds','sourceUnits','resultName','calculatedAt','lastAttemptAt']);for(const old of snapshot.calculations){const next=index.calculations.get(old.id);if(!next||next.kind!==old.kind||next.algorithmVersion!==old.algorithmVersion||next.sourceDatasetIds.join()!==old.sourceDatasetIds.join())return false;if(next.parameters!==old.parameters){const keys=new Set([...Object.keys(next.parameters),...Object.keys(old.parameters)]);for(const key of keys)if(!metadata.has(key)&&!Object.is(next.parameters[key],old.parameters[key]))return false}}}
 return snapshot.datasets.every(d=>index.datasets.get(d.id)?.points===d.points);
}
/** Merge into the latest view: concurrent color/visibility/pan changes survive. */
export function applyCalculationPatches(current:ProjectDocument,snapshot:ProjectDocument,patches:CalculationPatch[]):ProjectDocument{
 if(!calculationInputsUnchanged(current,snapshot))throw new MathError('MATH_PREVIEW_STALE');
 if(!patches.length)return current;
 const calculations=new Map(patches.map(p=>[p.calculation.id,p.calculation]));
 const changed=new Map(patches.filter(p=>p.datasetId&&p.points).map(p=>[p.datasetId!,p.points!]));
 const refresh=(a:ProjectDocument['legend']['anchor'])=>{if(a.mode!=='point'||!changed.has(a.datasetId))return a;const points=changed.get(a.datasetId)!,i=pointIndex(points).get(a.pointId);return i===undefined?a:{...a,fallbackX:points[i].x,fallbackY:points[i].y}};
 const oldCalculations=dependencyIndex(snapshot).calculations;
 return {...current,calculations:current.calculations.map(c=>{const patch=calculations.get(c.id);if(!patch)return c;const old=oldCalculations.get(c.id);const metadata=Object.fromEntries(['resultName','sourceSeriesIds'].filter(key=>key in c.parameters&&!Object.is(c.parameters[key],old?.parameters[key])).map(key=>[key,c.parameters[key]]));return {...patch,...(c.display?{display:c.display}:{}),...(patch.status!=='valid'&&c.data?{data:c.data}:{}),parameters:{...patch.parameters,...metadata}}}),datasets:changed.size?current.datasets.map(d=>changed.has(d.id)?{...d,points:changed.get(d.id)!}:d):current.datasets,objects:current.objects.map(o=>o.anchors.some(a=>a.mode==='point'&&changed.has(a.datasetId))?{...o,anchors:o.anchors.map(refresh)}:o),legend:{...current.legend,anchor:refresh(current.legend.anchor)}};
}
/** Editing parameters is one atomic command. Preview never mutates the document. */
export function replaceCalculation(p:ProjectDocument,calculationId:string,parameters:Record<string,unknown>,result:CalculationResult,name?:string):ProjectDocument{
 const c=p.calculations.find(c=>c.id===calculationId);if(!c)throw new MathError('MATH_RESULT_MISSING');
 const old=c.resultDatasetId?dependencyIndex(p).datasets.get(c.resultDatasetId):undefined;
 const attached=old?[...p.objects.flatMap(o=>o.anchors),p.legend.anchor].filter(a=>a.mode==='point'&&a.datasetId===old.id):[];
 const oldIndices=old&&attached.length?pointIndex(old.points):undefined;
 const previous=old?{x:Float64Array.from(old.points,p=>p.x),anchored:attached.map(a=>a.mode==='point'?oldIndices!.get(a.pointId)!:-1)}:undefined;
 let points:Point[]|undefined;
 if(previous&&c.resultDatasetId){
  const sameSelection=['rowRange','range','fitRange','sortCopy','duplicates'].every(key=>JSON.stringify(c.parameters[key])===JSON.stringify(parameters[key]));
  const indices=matchingIndices(previous.x,result.points,c.kind,sameSelection),surviving=new Set(indices);
  if(previous.anchored.some(i=>!surviving.has(i)))throw new MathError('MATH_ANCHORED_RESULT_SHAPE');
  points=result.points.map((point,i)=>({...point,id:indices[i]>=0?old!.points[indices[i]].id:id()}));
 }
 const baselineId=c.kind==='area'&&typeof parameters.baselineDatasetId==='string'?parameters.baselineDatasetId:undefined;
 const calculation:Calculation={...c,sourceDatasetIds:c.kind==='area'?(baselineId&&baselineId!==c.sourceDatasetIds[0]?[c.sourceDatasetIds[0],baselineId]:[c.sourceDatasetIds[0]]):c.sourceDatasetIds,parameters:{...parameters,resultName:name??c.parameters.resultName,sourceSeriesIds:c.parameters.sourceSeriesIds,sourceUnits:datasetUnits(p,c.sourceDatasetIds[0]),calculatedAt:new Date().toISOString()},summary:{...result.summary},...(result.data?{data:result.data}:{}),status:'valid',algorithmVersion:1};
 const next=applyCalculationPatches(p,p,[{calculation,datasetId:c.resultDatasetId??undefined,points}]);
 return c.resultDatasetId?invalidateDependents(next,[c.resultDatasetId]):next;
}
