import type {OriginFormat} from './detector';

export type OriginNodeKind='folder'|'workbook'|'worksheet'|'column'|'graph'|'layer'|'curve'|'text'|'matrix'|'note'|'attachment'|'opaque';
export interface OriginRange {offset:number;length:number}
export interface OriginCapabilities {
 recognized:boolean|null;extracted:boolean|null;rendered:boolean;editable:boolean;recalculable:boolean;
 archived:boolean;unsupportedReason:string|null;
}
export interface OriginNode {
 id:string;parentId:string|null;kind:OriginNodeKind;nameHex:string;sourceId:string|null;
 properties:Record<string,unknown>;capabilities:OriginCapabilities;provenance:OriginRange[];
}
export interface OriginColumn {
 nodeId:string;rowCount:number;values:string;tags:string;textOffsets?:string;textBytes?:string;
 role:'X'|'Y'|'Z'|'XErr'|'YErr'|'Label'|'unknown';originType:string;
}
export interface OriginResource {id:string;kind:'f64'|'tags'|'offsets'|'text'|'opaque'|'original';size:number;sha256:string}
export interface OriginDiagnostic {code:string;severity:'info'|'warning'|'error';nodeId:string|null;offset:number|null}
export interface OriginRelation {id:string;from:string;to:string|null;sourceTargetId:string;kind:string;resolved:boolean}
export interface OriginModel {
 format:'APIO_ORIGIN_DOCUMENT';schemaVersion:1;
 source:{name:string;size:number;sha256:string;detected:OriginFormat};
 decoder:{name:string;version:string;revision:string};
 nodes:OriginNode[];columns:OriginColumn[];resources:OriginResource[];relations:OriginRelation[];diagnostics:OriginDiagnostic[];
 coverage:{inventory:'partial'|'complete';visualEquivalence:'unverified';opaqueRanges:OriginRange[]};
 sourceResourceId:string|null;
}
export interface OriginViewState {encoding:string;selectedId:string|null;includedIds:string[];includeSource:boolean}
const kinds=new Set<OriginNodeKind>(['folder','workbook','worksheet','column','graph','layer','curve','text','matrix','note','attachment','opaque']);
const sha=/^[a-f0-9]{64}$/,hex=/^(?:[a-f0-9]{2})*$/;
const isHash=(v:unknown):v is string=>typeof v==='string'&&sha.test(v);
const validInt=(n:unknown,max:number):n is number=>Number.isSafeInteger(n)&&Number(n)>=0&&Number(n)<=max;
const record=(v:unknown):v is Record<string,unknown>=>!!v&&typeof v==='object'&&!Array.isArray(v);
function invalid():never{throw new Error('ORIGIN_INVALID_MODEL')}
/** Validate once at a trust boundary; navigation never revalidates large arrays. */
export function validateOriginModel(input:unknown):OriginModel {
 if(!record(input)||input.format!=='APIO_ORIGIN_DOCUMENT'||input.schemaVersion!==1)invalid();
 const m=input as unknown as OriginModel;
 if(!record(m.source)||typeof m.source.name!=='string'||m.source.name.length>4096||!validInt(m.source.size,200*1024*1024)||!isHash(m.source.sha256)||!record(m.source.detected)||!['opj','opju','unknown'].includes(m.source.detected.family)||typeof m.source.detected.canDecode!=='boolean')invalid();
 if(!record(m.decoder)||!['name','version','revision'].every(k=>typeof m.decoder[k as keyof typeof m.decoder]==='string'))invalid();
 if(!Array.isArray(m.nodes)||m.nodes.length>100000||!Array.isArray(m.resources)||m.resources.length>100000||!Array.isArray(m.columns)||m.columns.length>100000||!Array.isArray(m.relations)||m.relations.length>200000||!Array.isArray(m.diagnostics)||m.diagnostics.length>100000)invalid();
 if(!record(m.coverage)||!['partial','complete'].includes(m.coverage.inventory)||m.coverage.visualEquivalence!=='unverified'||!Array.isArray(m.coverage.opaqueRanges))invalid();
 const range=(r:OriginRange)=>{if(!record(r)||!validInt(r.offset,m.source.size)||!validInt(r.length,m.source.size-r.offset))invalid()};
 m.coverage.opaqueRanges.forEach(range);
 const resources=new Map<string,OriginResource>();let total=0;
 for(const r of m.resources){if(!record(r)||typeof r.id!=='string'||!r.id||resources.has(r.id)||!['f64','tags','offsets','text','opaque','original'].includes(r.kind)||!validInt(r.size,1024**3)||!isHash(r.sha256))invalid();resources.set(r.id,r);total+=r.size;if(total>1024**3)invalid()}
 if(m.sourceResourceId!==null&&(!resources.has(m.sourceResourceId)||resources.get(m.sourceResourceId)?.kind!=='original'||resources.get(m.sourceResourceId)?.sha256!==m.source.sha256||resources.get(m.sourceResourceId)?.size!==m.source.size))invalid();
 const nodes=new Map<string,OriginNode>();
 for(const n of m.nodes){
  if(!record(n)||typeof n.id!=='string'||!n.id||n.id.length>256||nodes.has(n.id)||!kinds.has(n.kind)||typeof n.nameHex!=='string'||n.nameHex.length>65536||!hex.test(n.nameHex)||(n.parentId!==null&&typeof n.parentId!=='string')||(n.sourceId!==null&&typeof n.sourceId!=='string')||!record(n.properties)||!Array.isArray(n.provenance)||!record(n.capabilities))invalid();
  const c=n.capabilities;if(!['recognized','extracted'].every(k=>[true,false,null].includes(c[k as 'recognized']))||!['rendered','editable','recalculable','archived'].every(k=>typeof c[k as 'rendered']==='boolean')||(c.unsupportedReason!==null&&typeof c.unsupportedReason!=='string'))invalid();
  // Phase 2 never advertises native Origin editing or computation.
  if(c.editable||c.recalculable)invalid();
  for(const [key,value]of Object.entries(n.properties))if(key.endsWith('Hex')&&(typeof value!=='string'||!hex.test(value)))invalid();
  n.provenance.forEach(range);nodes.set(n.id,n);
 }
 const done=new Set<string>();
 for(const n of m.nodes){let current:OriginNode|undefined=n;const path=new Set<string>();while(current&&!done.has(current.id)){if(path.has(current.id)||path.size>=128)invalid();path.add(current.id);if(current.parentId===null)break;current=nodes.get(current.parentId);if(!current)invalid()}for(const id of path)done.add(id)}
 const columnIds=new Set<string>();
 for(const c of m.columns){
  if(!record(c)||nodes.get(c.nodeId)?.kind!=='column'||columnIds.has(c.nodeId)||!validInt(c.rowCount,100000000)||!['X','Y','Z','XErr','YErr','Label','unknown'].includes(c.role)||typeof c.originType!=='string')invalid();columnIds.add(c.nodeId);
  if(resources.get(c.values)?.kind!=='f64'||resources.get(c.values)?.size!==c.rowCount*8||resources.get(c.tags)?.kind!=='tags'||resources.get(c.tags)?.size!==c.rowCount)invalid();
  if(c.textOffsets!==undefined||c.textBytes!==undefined){if(resources.get(c.textOffsets??'')?.kind!=='offsets'||resources.get(c.textOffsets??'')?.size!==(c.rowCount+1)*4||resources.get(c.textBytes??'')?.kind!=='text')invalid()}
 }
 const relations=new Set<string>();for(const r of m.relations){if(!record(r)||typeof r.id!=='string'||relations.has(r.id)||!nodes.has(r.from)||(r.to!==null&&!nodes.has(r.to))||typeof r.kind!=='string'||typeof r.sourceTargetId!=='string'||typeof r.resolved!=='boolean'||r.resolved!==(r.to!==null))invalid();relations.add(r.id)}
 for(const d of m.diagnostics)if(!record(d)||typeof d.code!=='string'||!['info','warning','error'].includes(d.severity)||(d.nodeId!==null&&!nodes.has(d.nodeId))||(d.offset!==null&&!validInt(d.offset,m.source.size)))invalid();
 if(new TextEncoder().encode(JSON.stringify(m)).length>16*1024*1024)invalid();
 return m;
}
