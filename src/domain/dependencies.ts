import type {Calculation, Dataset, ProjectDocument, Series} from './model';
import {detachAnchor, type Coordinates} from './geometry';

export interface DependencyIndex {
 datasets: Map<string, Dataset>;
 calculations: Map<string, Calculation>;
 producers: Map<string, Calculation>;
 dependents: Map<string, Calculation[]>;
 order: Calculation[];
 errors: string[];
}
const graphs = new WeakMap<Dataset[], WeakMap<Calculation[], DependencyIndex>>();
const seriesIndexes = new WeakMap<Series[], Map<string, Series[]>>();
const unitIndexes=new WeakMap<DependencyIndex,{x:string;y:string;source?:unknown;values:Map<string,{x:string;y:string}>}>();
/** Metadata only: never visits, clones or samples the measurement arrays. */
export function dependencyIndex(p: Pick<ProjectDocument,'datasets'|'calculations'>): DependencyIndex {
 let byCalculations=graphs.get(p.datasets);
 const cached=byCalculations?.get(p.calculations);if(cached)return cached;
 const datasets=new Map(p.datasets.map(d=>[d.id,d])),calculations=new Map(p.calculations.map(c=>[c.id,c]));
 const producers=new Map<string,Calculation>(),dependents=new Map<string,Calculation[]>(),errors:string[]=[];
 for(const c of p.calculations){
  if(c.resultDatasetId){if(producers.has(c.resultDatasetId))errors.push('DUPLICATE_RESULT');producers.set(c.resultDatasetId,c);const d=datasets.get(c.resultDatasetId);if(!d||d.role!=='derived'||d.source.calculationId!==c.id)errors.push('MATH_RESULT_MISSING')}
  for(const source of c.sourceDatasetIds){if(!datasets.has(source))errors.push('MATH_SOURCE_MISSING');const list=dependents.get(source);if(list)list.push(c);else dependents.set(source,[c])}
 }
 const degrees=new Map<string,number>(),queue:Calculation[]=[],order:Calculation[]=[];
 for(const c of p.calculations){const degree=c.sourceDatasetIds.filter(d=>producers.has(d)).length;degrees.set(c.id,degree);if(!degree)queue.push(c)}
 for(let i=0;i<queue.length;i++){const c=queue[i];order.push(c);for(const child of c.resultDatasetId?dependents.get(c.resultDatasetId)??[]:[]){const degree=degrees.get(child.id)!-1;degrees.set(child.id,degree);if(!degree)queue.push(child)}}
 if(order.length!==p.calculations.length)errors.push('MATH_DEPENDENCY_CYCLE');
 const result={datasets,calculations,producers,dependents,order,errors};
 if(!byCalculations){byCalculations=new WeakMap();graphs.set(p.datasets,byCalculations)}byCalculations.set(p.calculations,result);return result;
}
export function seriesByDataset(series:Series[]):Map<string,Series[]>{
 const cached=seriesIndexes.get(series);if(cached)return cached;
 const result=new Map<string,Series[]>();for(const s of series){const list=result.get(s.datasetId);if(list)list.push(s);else result.set(s.datasetId,[s])}seriesIndexes.set(series,result);return result;
}
export function datasetUnits(p:ProjectDocument,datasetId:string):{x:string;y:string}{
 const index=dependencyIndex(p),cached=unitIndexes.get(index);
 if(cached&&cached.x===p.axes.x.unit&&cached.y===p.axes.y.unit&&cached.source===p.extensions.datasetUnits)return cached.values.get(datasetId)??{x:p.axes.x.unit,y:p.axes.y.unit};
 const units=new Map<string,{x:string;y:string}>();
 for(const d of p.datasets)if(d.role==='raw')units.set(d.id,(p.extensions.datasetUnits as Record<string,{x:string;y:string}>|undefined)?.[d.id]??{x:p.axes.x.unit,y:p.axes.y.unit});
 for(const c of index.order){const source=units.get(c.sourceDatasetIds[0])??{x:p.axes.x.unit,y:p.axes.y.unit};if(c.resultDatasetId)units.set(c.resultDatasetId,c.kind==='derivative'?{x:source.x,y:`${source.y||'Y'}/${source.x||'X'}`}:source)}
 unitIndexes.set(index,{x:p.axes.x.unit,y:p.axes.y.unit,source:p.extensions.datasetUnits,values:units});return units.get(datasetId)??{x:p.axes.x.unit,y:p.axes.y.unit};
}
export function dependentCalculations(index:DependencyIndex,datasetIds:Iterable<string>):Set<string>{
 const result=new Set<string>(),queue=[...datasetIds];
 for(let i=0;i<queue.length;i++)for(const c of index.dependents.get(queue[i])??[]){if(result.has(c.id))continue;result.add(c.id);if(c.resultDatasetId)queue.push(c.resultDatasetId)}
 return result;
}
export function invalidateDependents(p:ProjectDocument,datasetIds:Iterable<string>):ProjectDocument{
 const dirty=dependentCalculations(dependencyIndex(p),datasetIds);let changed=false;
 const calculations=p.calculations.map(c=>{if(!dirty.has(c.id)||c.status==='outdated')return c;changed=true;return {...c,status:'outdated' as const}});
 return changed?{...p,calculations}:p;
}
/** Every edit path, including imports and unit changes, uses the same invalidation rule.
 * Recalculation explicitly supplies its own topologically consistent statuses. */
export function invalidateDataEdit(before:ProjectDocument,next:ProjectDocument,label:string):ProjectDocument{
 if(before===next||label==='recalculate'||label==='UpdateCalculation')return next;
 const index=dependencyIndex(before),changed:string[]=[];
 if(before.axes.x.unit!==next.axes.x.unit||before.axes.y.unit!==next.axes.y.unit)changed.push(...next.datasets.filter(d=>d.role==='raw').map(d=>d.id));
 else if(before.datasets!==next.datasets)for(const d of next.datasets)if(index.datasets.has(d.id)&&index.datasets.get(d.id)!.points!==d.points)changed.push(d.id);
 return changed.length?invalidateDependents(next,changed):next;
}
export type DataNodeKey = `dataset:${string}`|`calculation:${string}`|`series:${string}`;
export interface RemovalPlan {datasets:Set<string>;calculations:Set<string>;series:Set<string>;linked:number}
export function removalPlan(p:ProjectDocument,key:DataNodeKey):RemovalPlan{
 const index=dependencyIndex(p),[kind,id]=key.split(':'),datasets=new Set<string>(),calculations=new Set<string>(),series=new Set<string>();
 if(kind==='series'){if(p.series.some(s=>s.id===id))series.add(id)}
 else if(kind==='dataset'){if(index.datasets.has(id)){datasets.add(id);const producer=index.producers.get(id);if(producer)calculations.add(producer.id)}}
 else {const c=index.calculations.get(id);if(c){calculations.add(id);if(c.resultDatasetId)datasets.add(c.resultDatasetId)}}
 for(const cid of dependentCalculations(index,datasets)){calculations.add(cid);const result=index.calculations.get(cid)?.resultDatasetId;if(result)datasets.add(result)}
 for(const s of p.series)if(datasets.has(s.datasetId))series.add(s.id);
 const anchors=[...p.objects.flatMap(o=>o.anchors),p.legend.anchor];
 return {datasets,calculations,series,linked:anchors.filter(a=>a.mode==='point'&&datasets.has(a.datasetId)).length};
}
export function removeDataNode(p:ProjectDocument,key:DataNodeKey,confirmed=false,coordinates?:Coordinates):ProjectDocument{
 const plan=removalPlan(p,key);if(!plan.datasets.size&&!plan.calculations.size&&!plan.series.size)return p;
 if(!confirmed&&(plan.calculations.size||plan.linked))throw new Error('DATA_HAS_DEPENDENCIES');
 const detach=(a:ProjectDocument['legend']['anchor'])=>a.mode==='point'&&plan.datasets.has(a.datasetId)?detachAnchor(p,a,coordinates):a;
 const clean=(key:string,ids:Set<string>)=>{const old=p.extensions[key];return old&&typeof old==='object'&&!Array.isArray(old)?Object.fromEntries(Object.entries(old).filter(([id])=>!ids.has(id))):old};
 return {...p,datasets:plan.datasets.size?p.datasets.filter(d=>!plan.datasets.has(d.id)):p.datasets,series:p.series.filter(s=>!plan.series.has(s.id)),calculations:p.calculations.filter(c=>!plan.calculations.has(c.id)).map(c=>{
  const old=c.parameters.sourceSeriesIds;if(!Array.isArray(old)||!old.some(id=>plan.series.has(id)))return c;
  return {...c,parameters:{...c.parameters,sourceSeriesIds:old.filter(id=>!plan.series.has(id))}};
 }),objects:p.objects.map(o=>o.anchors.some(a=>a.mode==='point'&&plan.datasets.has(a.datasetId))?{...o,anchors:o.anchors.map(detach)}:o),legend:{...p.legend,anchor:detach(p.legend.anchor)},extensions:{...p.extensions,...(p.extensions.seriesMarkers?{seriesMarkers:clean('seriesMarkers',plan.series)}:{}),...(p.extensions.sourceRows?{sourceRows:clean('sourceRows',plan.datasets)}:{})}};
}
