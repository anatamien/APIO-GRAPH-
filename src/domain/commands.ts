import type { ProjectDocument, ID, XY, Anchor } from './model';
import { detachAnchor,type Coordinates } from './geometry';
import {navigateProject} from './project';
import {visualState,visibilityDescription} from './visualHistory';
export type Transform = (p: ProjectDocument) => ProjectDocument;
interface Entry {label:string;before:ProjectDocument;after:ProjectDocument;bytes:number;visual:boolean;description?:{label:string;curveName:string}}
/** Compare changed branches only; untouched measurement arrays are shared and skipped. */
export function sameValue(a:unknown,b:unknown):boolean{
 if(Object.is(a,b))return true;
 if(!a||!b||typeof a!=='object'||typeof b!=='object'||Array.isArray(a)!==Array.isArray(b))return false;
 const ak=Object.keys(a),bk=Object.keys(b);if(ak.length!==bk.length)return false;
 return ak.every(key=>Object.hasOwn(b,key)&&sameValue((a as Record<string,unknown>)[key],(b as Record<string,unknown>)[key]));
}
export class History {
  private document:ProjectDocument; private past:Entry[]=[];private future:Entry[]=[];private saved:ProjectDocument; private memory=0;private view:ProjectDocument|null=null;private offset=0;
  constructor(p:ProjectDocument){this.document=p;this.saved=p}
  get current(){return this.view??this.document}
  get dirty(){return this.document!==this.saved} get canUndo(){return this.past.length>0}get canRedo(){return this.future.length>0}
  get labels(){return this.past.map(a=>a.label)}
  get index(){return this.past.length}
  get steps(){return [{number:this.offset,label:'historyInitial'},...[...this.past,...[...this.future].reverse()].map((a,i)=>({number:this.offset+i+1,label:a.label}))]}
  get visualSteps(){return [{number:this.offset,index:0,label:'historyInitial',curveName:undefined as string|undefined},...[...this.past,...[...this.future].reverse()].flatMap((a,i)=>a.visual?[{number:this.offset+i+1,index:i+1,label:a.description?.label??a.label,curveName:a.description?.curveName}]:[])]}
  snapshot(index:number):ProjectDocument|undefined{const entries=[...this.past,...[...this.future].reverse()];return index===0?(entries[0]?.before??this.document):entries[index-1]?.after}
  jump(index:number){if(!Number.isInteger(index)||index<0||index>=this.steps.length)return;while(this.index>index)this.undo();while(this.index<index)this.redo()}
  // View changes share all data and never change the saved document identity.
  navigate(viewport:ProjectDocument['viewport']){const next=navigateProject(this.current,viewport);if(next)this.view=next}
  execute(label:string,apply:Transform){const before=this.document,current=this.current,after=apply(current);if(sameValue(after,current))return;const bytes=after.datasets===before.datasets?2048:after.datasets.reduce((n,d)=>n+(before.datasets.includes(d)?0:d.points.length*64),2048),visual=!sameValue(visualState(current),visualState(after));this.past.push({label,before,after,bytes,visual,description:visual?visibilityDescription(current,after):undefined});this.memory+=bytes;this.future=[];this.document=after;this.view=null;while((this.past.length>200||this.memory>64*1024*1024)&&this.past.length>1){this.memory-=this.past.shift()!.bytes;this.offset++}}
  undo(){const a=this.past.pop();if(a){this.memory-=a.bytes;this.future.push(a);this.document=a.before;this.view=null}}
  redo(){const a=this.future.pop();if(a){this.past.push(a);this.memory+=a.bytes;this.document=a.after;this.view=null}}
  markSaved(){this.saved=this.document}
  /** Confirm the revision actually written, even if editing or Undo continued. */
  saveCheckpoint():()=>void{const written=this.document;return()=>{this.saved=written}}
}
function invalidate(p:ProjectDocument,datasetId:ID):ProjectDocument {
  const changed=new Set([datasetId]);let more=true;const calculations=p.calculations.map(c=>({...c}));
  while(more){more=false;for(const c of calculations)if(c.sourceDatasetIds.some(d=>changed.has(d))){c.status='outdated';if(c.resultDatasetId&&!changed.has(c.resultDatasetId)){changed.add(c.resultDatasetId);more=true}}}
  return {...p,calculations};
}
export function editPoint(p:ProjectDocument,datasetId:ID,pointId:ID,xy:XY):ProjectDocument {
  if(p.datasets.find(d=>d.id===datasetId)?.role==='derived')throw new Error('DERIVED_READ_ONLY');
  if(!Number.isFinite(xy.x)||!Number.isFinite(xy.y))throw new Error('INVALID_NUMBER');
  const refresh=(a:Anchor):Anchor=>a.mode==='point'&&a.datasetId===datasetId&&a.pointId===pointId?{...a,fallbackX:xy.x,fallbackY:xy.y}:a;
  return invalidate({...p,datasets:p.datasets.map(d=>d.id===datasetId?{...d,points:d.points.map(pt=>pt.id===pointId?{...pt,...xy}:pt)}:d),objects:p.objects.map(o=>({...o,anchors:o.anchors.map(refresh)})),legend:{...p.legend,anchor:refresh(p.legend.anchor)}},datasetId);
}
export function deletePoint(p:ProjectDocument,datasetId:ID,pointId:ID,detach:boolean,coordinates?:Coordinates):ProjectDocument {
  if(p.datasets.find(d=>d.id===datasetId)?.role==='derived')throw new Error('DERIVED_READ_ONLY');
  const attached=(a:Anchor)=>a.mode==='point'&&a.datasetId===datasetId&&a.pointId===pointId;
  const links=p.objects.some(o=>o.anchors.some(attached))||attached(p.legend.anchor);if(links&&!detach)throw new Error('POINT_HAS_LINKS');
  const convert=(a:Anchor):Anchor=>attached(a)?detachAnchor(p,a,coordinates):a;
  return invalidate({...p,datasets:p.datasets.map(d=>d.id===datasetId?{...d,points:d.points.filter(pt=>pt.id!==pointId)}:d),objects:p.objects.map(o=>({...o,anchors:o.anchors.map(convert)})),legend:{...p.legend,anchor:convert(p.legend.anchor)}},datasetId);
}
