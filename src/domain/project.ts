import check from './generated/aphValidator.js';
import type { ProjectDocument, Anchor,Point } from './model';
import {pointIndex,assertAxisRange} from './geometry';
export interface Validation { errors: string[]; warnings: string[] }
const validatedProjects=new WeakSet<ProjectDocument>();
/** View-only navigation preserves validated immutable branches, never edit history. */
export function navigateProject(previous:ProjectDocument,viewport:ProjectDocument['viewport']):ProjectDocument|undefined{
 if(!Object.values(viewport).every(Number.isFinite)||viewport.xMin>=viewport.xMax||viewport.yMin>=viewport.yMax)return;
 try{assertAxisRange(previous.axes.x,viewport.xMin,viewport.xMax);assertAxisRange(previous.axes.y,viewport.yMin,viewport.yMax)}catch{return}
 const next={...previous,viewport};if(validatedProjects.has(previous))validatedProjects.add(next);return next;
}
/** Only internal immutable edits may reuse previously checked measurement branches. */
export function validateEdit(previous:ProjectDocument,next:ProjectDocument):Validation{return validateDocument(next,validatedProjects.has(previous)?previous:undefined)}
export function validateProject(input:unknown):Validation{return validateDocument(input)}
function validateDocument(input: unknown,previous?:ProjectDocument): Validation {
  const errors:string[]=[],warnings:string[]=[];
  const unchanged=new Set<Point[]>(previous?.datasets.map(d=>d.points));
  const candidate=input as ProjectDocument;
  const schemaInput=previous&&candidate&&Array.isArray(candidate.datasets)?{...candidate,datasets:candidate.datasets.map(d=>{
   if(d&&unchanged.has(d.points))return {...d,points:[]};
   const old=previous.datasets.find(before=>before.id===d?.id);
   // Keep the schema's one-million-point limit effective before filtering.
   if(!old||!Array.isArray(d?.points)||d.points.length>1_000_000)return d;
   const ids=pointIndex(old.points);return {...d,points:d.points.filter(pt=>{if(!pt||typeof pt!=='object'||typeof pt.id!=='string')return true;const index=ids.get(pt.id);return index===undefined||old.points[index]!==pt})};
  })}:input;
  if(!check(schemaInput)){validatedProjects.delete(candidate);return {errors:(check.errors??[]).map(e=>`${e.instancePath || '/'}: ${e.message}`),warnings}}
  const p=input as ProjectDocument;
  const unique=(items:{id:string}[],path:string)=>{const ids=new Set<string>();for(const a of items){if(ids.has(a.id))errors.push(`${path}: DUPLICATE_ID ${a.id}`);ids.add(a.id)}};
  for(const key of ['datasets','series','objects','calculations'] as const)unique(p[key],`/${key}`);
  const ds=new Map(p.datasets.map(d=>[d.id,d])); const cs=new Map(p.calculations.map(c=>[c.id,c]));
  for(const d of p.datasets){if(!unchanged.has(d.points))unique(d.points,`/datasets/${d.id}/points`);if(d.role==='derived'&&(!d.source.calculationId||!cs.has(d.source.calculationId)))errors.push(`/datasets/${d.id}: MISSING_CALCULATION`);if(d.role==='derived'&&d.source.kind!=='calculation')errors.push(`/datasets/${d.id}: INVALID_SOURCE`);if(d.role==='derived'&&cs.get(d.source.calculationId??'')?.resultDatasetId!==d.id)errors.push(`/datasets/${d.id}: RESULT_OWNERSHIP`);if(d.role==='raw'&&(d.source.kind==='calculation'||d.source.calculationId))errors.push(`/datasets/${d.id}: INVALID_SOURCE`)}
  for(const s of p.series)if(!ds.has(s.datasetId))errors.push(`/series/${s.id}: MISSING_DATASET`);
  for(const [k,a]of Object.entries(p.axes)){
    if(!(a.min<a.max))errors.push(`/axes/${k}: INVALID_RANGE`);
    if(a.tickMode==='manual'){
      const min=k==='x'?p.viewport.xMin:p.viewport.yMin,max=k==='x'?p.viewport.xMax:p.viewport.yMax;
      const first=Math.ceil((min-a.tickOrigin)/a.tickStep-1e-10),last=Math.floor((max-a.tickOrigin)/a.tickStep+1e-10),count=last-first+1;
      if(!Number.isFinite(count)||count>10001)errors.push(`/axes/${k}: TOO_MANY_TICKS`);
      else if(count>50)warnings.push(`/axes/${k}: MANY_TICKS`);
      if(min+a.tickStep===min||max-a.tickStep===max)errors.push(`/axes/${k}: STEP_BELOW_PRECISION`);
    }
  }
  if(!(p.viewport.xMin<p.viewport.xMax&&p.viewport.yMin<p.viewport.yMax))errors.push('/viewport: INVALID_RANGE');
  const anchor=(a:Anchor,path:string)=>{if(a.mode==='point'){const points=ds.get(a.datasetId)?.points;if(!points||!pointIndex(points).has(a.pointId))warnings.push(`${path}: MISSING_POINT`)}};
  for(const o of p.objects){const count=['text','line','marker'].includes(o.type)?1:2;if(o.anchors.length!==count)errors.push(`/objects/${o.id}/anchors: INVALID_COUNT`);if(o.type==='line'&&(!Number.isFinite(o.geometry.directionX)||!Number.isFinite(o.geometry.directionY)||Math.hypot(o.geometry.directionX??0,o.geometry.directionY??0)===0))errors.push(`/objects/${o.id}/geometry: INVALID_DIRECTION`);o.anchors.forEach((a,i)=>anchor(a,`/objects/${o.id}/anchors/${i}`))}
  anchor(p.legend.anchor,'/legend/anchor');
  const visited=new Set<string>(),active=new Set<string>();
  const visit=(did:string)=>{if(active.has(did)){errors.push(`/datasets/${did}: CYCLIC_CALCULATION`);return}if(visited.has(did))return;visited.add(did);active.add(did);const d=ds.get(did),c=d?.source.calculationId?cs.get(d.source.calculationId):undefined;if(c)for(const source of c.sourceDatasetIds)visit(source);active.delete(did)};
  const results=new Set<string>();
  for(const c of p.calculations){
    for(const did of c.sourceDatasetIds)if(!ds.has(did))errors.push(`/calculations/${c.id}: MISSING_SOURCE`);
    if(c.status==='valid'&&c.sourceDatasetIds.some(did=>{const producer=ds.get(did)?.source.calculationId;return producer&&cs.get(producer)?.status!=='valid'}))errors.push(`/calculations/${c.id}: STALE_DEPENDENCY`);
    if(new Set(c.sourceDatasetIds).size!==c.sourceDatasetIds.length)errors.push(`/calculations/${c.id}: DUPLICATE_SOURCE`);
    if(c.resultDatasetId){
      const d=ds.get(c.resultDatasetId);
      if(!d)errors.push(`/calculations/${c.id}: MISSING_RESULT`);
      else if(d.role!=='derived'||d.source.kind!=='calculation'||d.source.calculationId!==c.id)errors.push(`/calculations/${c.id}: RESULT_OWNERSHIP`);
      if(results.has(c.resultDatasetId))errors.push(`/calculations/${c.id}: DUPLICATE_RESULT`);results.add(c.resultDatasetId);
    }
  }
  for(const d of p.datasets)visit(d.id);
  // The generated strict-number schema already checks every typed numeric field.
  // Only these three schema escape hatches require a recursive numeric/depth walk.
  const finite=(v:unknown,path:string,depth=0,before?:unknown)=>{
   if(depth>60){errors.push(`${path}: TOO_DEEP`);return}
   if(previous&&v===before)return;
   if(typeof v==='number'&&!Number.isFinite(v))errors.push(`${path}: NONFINITE`);
   else if(v&&typeof v==='object')for(const[k,x]of Object.entries(v)){
    const old=before&&typeof before==='object'&&Object.hasOwn(before,k)?(before as Record<string,unknown>)[k]:undefined;
    finite(x,`${path}/${k}`,depth+1,old);
   }
  };
  finite(p.extensions,'/extensions',1,previous?.extensions);for(const c of p.calculations){const old=previous?.calculations.find(before=>before.id===c.id);finite(c.parameters,`/calculations/${c.id}/parameters`,3,old?.parameters);finite(c.summary,`/calculations/${c.id}/summary`,3,old?.summary)}
  if(!errors.length)validatedProjects.add(p);else validatedProjects.delete(p);return {errors,warnings};
}
export function serialize(p: ProjectDocument,pretty=true): string {
 const v=validateProject(p);if(v.errors.length)throw new Error(v.errors.join('\n'));
 // JSON permits -0, but JSON.stringify normalizes it. Reserve an absent token
 // so scientific input retains its IEEE sign without altering user text.
 let text:string,collision:boolean,token:string;
 do{token=`__negative_zero_${crypto.randomUUID()}__`;collision=false;text=JSON.stringify(p,(key,value:unknown)=>{if(key.includes(token)||(typeof value==='string'&&value.includes(token)))collision=true;return typeof value==='number'&&Object.is(value,-0)?token:value},pretty?2:undefined)}while(collision);
 return text.split(JSON.stringify(token)).join('-0')+'\n';
}
export function deserialize(text: string): {project: ProjectDocument; warnings: string[]} {
  if(new TextEncoder().encode(text).length>200*1024*1024)throw new Error('FILE_TOO_LARGE');
  const raw:unknown=JSON.parse(text.replace(/^\uFEFF/,'')); const v=validateProject(raw);
  if(v.errors.length)throw new Error(v.errors.join('\n'));return {project:raw as ProjectDocument,warnings:v.warnings};
}
