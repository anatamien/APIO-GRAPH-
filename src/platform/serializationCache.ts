import type {ProjectDocument,Point} from '../domain/model';
const recoveryKey='apioWorkspaceRecovery';
interface RecoveryMetadata {tabs:({document:ProjectDocument|null}&Record<string,unknown>)[];[key:string]:unknown}
function recovery(value:unknown):RecoveryMetadata|undefined{
 if(!value||typeof value!=='object'||!('tabs'in value)||!Array.isArray(value.tabs))return;
 if(value.tabs.every(e=>e&&typeof e==='object'&&'document'in e&&(e.document===null||(typeof e.document==='object'&&e.document.format==='APIO_GRAPH_PROJECT'))))return value as RecoveryMetadata;
}
export interface PackedProject {project:ProjectDocument;pointKeys:number[];extensionRefs:Record<string,number>;tabs?:(PackedProject|null)[]}
export interface PackedSnapshot {root:PackedProject;resources:{id:number;value:unknown}[];keep:number[]}
export type SerializationRequest={id:number;type:'serialize';packet:PackedSnapshot;pretty:boolean;binary:boolean}|{id:number;type:'retain';keep:number[]};
export interface SerializationResponse {id:number;error?:string;text?:string;bytes?:ArrayBuffer}

/** Mirror immutable source branches once, without detaching the document's data. */
export class SnapshotCache {
 private tokens=new WeakMap<object,number>();private sequence=0;private known=new Set<number>();
 acknowledge(keep:number[]){this.known=new Set(keep)}
 reset(){this.known.clear()}
 pack(project:ProjectDocument):PackedSnapshot{
  const keep=new Set<number>(),resources:PackedSnapshot['resources']=[];
  const resource=(value:object)=>{let id=this.tokens.get(value);if(id===undefined){id=++this.sequence;this.tokens.set(value,id)}if(!keep.has(id)&&!this.known.has(id))resources.push({id,value});keep.add(id);return id};
  const pack=(p:ProjectDocument):PackedProject=>{
   const pointKeys=p.datasets.map(d=>resource(d.points)),extensionRefs:Record<string,number>=Object.create(null),extensions:Record<string,unknown>=Object.create(null);let tabs:PackedProject['tabs'];
   for(const [key,value] of Object.entries(p.extensions)){
    const meta=key===recoveryKey?recovery(value):undefined;
    if(meta){extensions[key]={...meta,tabs:meta.tabs.map(e=>({...e,document:null}))};tabs=meta.tabs.map(e=>e.document?pack(e.document):null)}
    else if(value&&typeof value==='object')extensionRefs[key]=resource(value);else extensions[key]=value;
   }
   return {project:{...p,datasets:p.datasets.map(d=>({...d,points:[]})),extensions},pointKeys,extensionRefs,tabs};
  };
  return {root:pack(project),resources,keep:[...keep]};
 }
}
export function unpackSnapshot(packet:PackedProject,resources:Map<number,unknown>):ProjectDocument{
 const get=(id:number)=>{if(!resources.has(id))throw new Error('SERIALIZATION_RESOURCE_MISSING');return resources.get(id)};
 const extensions:Record<string,unknown>=Object.assign(Object.create(null),packet.project.extensions);for(const [key,id] of Object.entries(packet.extensionRefs))extensions[key]=get(id);
 if(packet.tabs){const meta=recovery(extensions[recoveryKey]);if(!meta)throw new Error('SERIALIZATION_RECOVERY_INVALID');extensions[recoveryKey]={...meta,tabs:meta.tabs.map((entry,i)=>({...entry,document:packet.tabs![i]?unpackSnapshot(packet.tabs![i]!,resources):null}))}}
 return {...packet.project,datasets:packet.project.datasets.map((d,i)=>({...d,points:get(packet.pointKeys[i]) as Point[]})),extensions};
}
