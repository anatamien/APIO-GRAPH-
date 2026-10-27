import {History} from './commands';
import {createProject,id,type ProjectDocument} from './model';
import {deserialize,serialize,validateProject} from './project';
import type {TabPacket} from '../features/workspace/archive';
import type {OriginTabState} from '../features/origin/history';

export interface GraphTab {id:string;history:History;path:string|null;readOnly:boolean;number:number;placeholder:boolean;origin?:OriginTabState;label?:string;deferred?:{load:()=>Promise<ProjectDocument>;packet:()=>Promise<TabPacket>;release:()=>void}}
export function tabDirty(tab:GraphTab):boolean{return tab.origin?.history.dirty??tab.history.dirty}
export class DeferredHistory extends History {constructor(){super(createProject())}override get current():ProjectDocument{throw new Error('WORKSPACE_GRAPH_NOT_LOADED')}}
const recoveryKey='apioWorkspaceRecovery';
export class Workspace {
 tabs:GraphTab[]=[];
 activeId='';
 id=id();commonPath:string|null=null;private savedStructure='';
 get unified(){return this.commonPath!==null||this.tabs.length>1||this.tabs.some(t=>!!t.origin||!!t.deferred)}
 get structure(){return this.tabs.filter(t=>!t.placeholder).map(t=>t.id).join(',')}
 get structureDirty(){return this.commonPath!==null&&this.structure!==this.savedStructure}
 acknowledgeStructure(structure:string){this.savedStructure=structure}
 async materialize(tab:GraphTab){if(!tab.deferred)return;const deferred=tab.deferred,p=await deferred.load();if(tab.deferred!==deferred)return;tab.history=new History(p);tab.deferred=undefined;deferred.release()}
 applyTabs(tabs:GraphTab[],activeId:string|null,path:string|null,workspaceId:string,append=false){if(tabs.length+(append?this.tabs.filter(t=>!t.placeholder).length:0)>100)throw new Error('WORKSPACE_TAB_LIMIT');if(append&&!tabs.length)return;const used=new Set(append?this.tabs.map(t=>t.id):[]);let selected=activeId;for(const tab of tabs){const prior=tab.id;if(used.has(tab.id))tab.id=id();used.add(tab.id);if(prior===activeId)selected=tab.id;tab.number=++this.sequence}if(append)this.tabs=[...this.tabs.filter(t=>!t.placeholder),...tabs];else{this.tabs=tabs;this.id=workspaceId;this.commonPath=path;this.savedStructure=this.structure}this.activeId=selected??'';if(!this.tabs.length)this.blank();}
 private sequence=0;
 private grantedPaths=new Set<string>();
 constructor(){this.blank()}
 get active():GraphTab{return this.tabs.find(tab=>tab.id===this.activeId)!}
 get dirty():boolean{return this.structureDirty||this.tabs.some(tab=>tabDirty(tab)&&!tab.readOnly)}
 private make(project:ProjectDocument,path:string|null,readOnly:boolean,dirty:boolean):GraphTab{
  const history=new History(dirty?createProject():project);if(dirty)history.execute('ImportBatch',()=>project);
  return {id:id(),history,path,readOnly,number:++this.sequence,placeholder:false};
 }
 private blank(){const tab=this.make(createProject(),null,false,false);tab.placeholder=true;this.tabs.push(tab);this.activeId=tab.id}
 add(project:ProjectDocument,{path=null,readOnly=false,dirty=false}:{path?:string|null;readOnly?:boolean;dirty?:boolean}={}):GraphTab{
  if(this.tabs.length>=100)throw new Error('WORKSPACE_TAB_LIMIT');const first=this.active,empty=first?.placeholder&&!first.history.dirty&&!first.path&&!first.history.current.datasets.length&&!first.history.current.objects.length;
  const tab=this.make(project,path,readOnly,dirty);
  if(path)this.grantedPaths.add(path);
  if(this.tabs.length===1&&empty){tab.number=first.number;this.sequence--;this.tabs=[tab]}else this.tabs.push(tab);
  this.activeId=tab.id;return tab;
 }
 activate(tabId:string){if(this.tabs.some(tab=>tab.id===tabId))this.activeId=tabId}
 addOrigin(origin:OriginTabState,path:string|null=null):GraphTab{const tab=this.add(createProject(),{path,dirty:false});tab.origin=origin;return tab}
 restoreMixed(entries:({origin:OriginTabState;path:string|null;dirty:boolean;readOnly:boolean}|{graphText:string;path:string|null;dirty:boolean;readOnly:boolean})[],activeIndex:number){
  if(!entries.length||entries.length>16||!Number.isInteger(activeIndex)||activeIndex<0||activeIndex>=entries.length)throw new Error('RECOVERY_INVALID');
  const prepared=entries.map(entry=>'origin'in entry?{entry,project:createProject()}:({entry,project:deserialize(entry.graphText).project}));
  const tabs=prepared.map(({entry,project})=>{const tab=this.make(project,entry.path,entry.readOnly,'origin'in entry?false:entry.dirty);if('origin'in entry)tab.origin=entry.origin;return tab});this.tabs=tabs;this.activeId=tabs[activeIndex].id;
 }
 savedPath(tab:GraphTab,path:string){tab.path=path;this.grantedPaths.add(path)}
 recoveryPath():string|null{return this.active.path&&this.grantedPaths.has(this.active.path)?this.active.path:null}
 close(tabId:string){const index=this.tabs.findIndex(tab=>tab.id===tabId);if(index<0)return;this.tabs.splice(index,1);if(!this.tabs.length)this.blank();else if(this.activeId===tabId)this.activeId=this.tabs[Math.min(index,this.tabs.length-1)].id}
 /** A regular recovery project contains the other open documents in its extensions. */
 recoveryDocument():ProjectDocument{
  if(this.tabs.some(tab=>tab.origin))throw new Error('ORIGIN_MIXED_RECOVERY_REQUIRED');
  const active=this.active.history.current;
  return {...active,extensions:{...active.extensions,[recoveryKey]:{version:2,activeIndex:this.tabs.findIndex(tab=>tab.id===this.activeId),tabs:this.tabs.map(tab=>({document:tab.id===this.activeId?null:tab.history.current,path:tab.path,readOnly:tab.readOnly,dirty:tab.history.dirty}))}}};
 }
 recovery():string{return serialize(this.recoveryDocument(),false)}
 restore(text:string,path:string|null){
  const project=deserialize(text).project,raw=project.extensions[recoveryKey];
  if(raw===undefined){this.tabs=[this.make(project,path,false,true)];this.activeId=this.tabs[0].id;this.grantedPaths=new Set(path?[path]:[]);return}
  if(!raw||typeof raw!=='object'||!('version'in raw)||(raw.version!==1&&raw.version!==2)||!('tabs'in raw)||!Array.isArray(raw.tabs)||!raw.tabs.length||!('activeIndex'in raw)||!Number.isInteger(raw.activeIndex))throw new Error('RECOVERY_INVALID');
  const index=raw.activeIndex as number;if(index<0||index>=raw.tabs.length)throw new Error('RECOVERY_INVALID');
  // Validate every document before replacing the current workspace.
  const entries=raw.tabs.map((entry:unknown,tabIndex:number)=>{
   if(!entry||typeof entry!=='object'||!('document'in entry)||!('path'in entry)||(entry.path!==null&&typeof entry.path!=='string')||!('readOnly'in entry)||typeof entry.readOnly!=='boolean'||!('dirty'in entry)||typeof entry.dirty!=='boolean')throw new Error('RECOVERY_INVALID');
   const { [recoveryKey]:_metadata,...extensions}=project.extensions;void _metadata;
   const document=raw.version===2&&tabIndex===index&&entry.document===null?{...project,extensions}:entry.document;
   const result=validateProject(document);if(result.errors.length)throw new Error(result.errors.join('\n'));
   return {project:document as ProjectDocument,path:entry.path as string|null,readOnly:entry.readOnly,dirty:entry.dirty};
  });
  this.tabs=entries.map(entry=>this.make(entry.project,entry.path,entry.readOnly,entry.dirty&&!entry.readOnly));this.activeId=this.tabs[index].id;this.grantedPaths=new Set(path?[path]:[]);
 }
}
export function graphName(tab:GraphTab,unnamed:string):string{
 const alias=tab.origin?.history.current.tabName??(!tab.deferred?tab.history.current.extensions.tabName:undefined);if(typeof alias==='string'&&alias.trim())return alias;
 if(tab.label)return tab.label;
 if(tab.path)return tab.path.split(/[\\/]/).pop()!;
 if(tab.origin)return tab.origin.model.source.name;
 const name=tab.history.current.project.title.trim();
 return name&&!['Untitled','Untitled.aph','Новый проект','New project'].includes(name)?name:`${unnamed} ${tab.number}`;
}
export function graphFilename(tab:GraphTab,unnamed:string):string{return graphName(tab,unnamed).replace(/\.(aph|txt|csv|tsv|opj|opju|org)$/i,'')+'.aph'}
