import {History} from './commands';
import {createProject,id,type ProjectDocument} from './model';
import {deserialize,serialize,validateProject} from './project';

export interface GraphTab {id:string;history:History;path:string|null;readOnly:boolean;number:number;placeholder:boolean}
const recoveryKey='apioWorkspaceRecovery';
export class Workspace {
 tabs:GraphTab[]=[];
 activeId='';
 private sequence=0;
 private grantedPaths=new Set<string>();
 constructor(){this.blank()}
 get active():GraphTab{return this.tabs.find(tab=>tab.id===this.activeId)!}
 get dirty():boolean{return this.tabs.some(tab=>tab.history.dirty&&!tab.readOnly)}
 private make(project:ProjectDocument,path:string|null,readOnly:boolean,dirty:boolean):GraphTab{
  const history=new History(dirty?createProject():project);if(dirty)history.execute('ImportBatch',()=>project);
  return {id:id(),history,path,readOnly,number:++this.sequence,placeholder:false};
 }
 private blank(){const tab=this.make(createProject(),null,false,false);tab.placeholder=true;this.tabs.push(tab);this.activeId=tab.id}
 add(project:ProjectDocument,{path=null,readOnly=false,dirty=false}:{path?:string|null;readOnly?:boolean;dirty?:boolean}={}):GraphTab{
  const first=this.active,empty=first?.placeholder&&!first.history.dirty&&!first.path&&!first.history.current.datasets.length&&!first.history.current.objects.length;
  const tab=this.make(project,path,readOnly,dirty);
  if(path)this.grantedPaths.add(path);
  if(this.tabs.length===1&&empty){tab.number=first.number;this.sequence--;this.tabs=[tab]}else this.tabs.push(tab);
  this.activeId=tab.id;return tab;
 }
 activate(tabId:string){if(this.tabs.some(tab=>tab.id===tabId))this.activeId=tabId}
 savedPath(tab:GraphTab,path:string){tab.path=path;this.grantedPaths.add(path)}
 recoveryPath():string|null{return this.active.path&&this.grantedPaths.has(this.active.path)?this.active.path:null}
 close(tabId:string){const index=this.tabs.findIndex(tab=>tab.id===tabId);if(index<0)return;this.tabs.splice(index,1);if(!this.tabs.length)this.blank();else if(this.activeId===tabId)this.activeId=this.tabs[Math.min(index,this.tabs.length-1)].id}
 /** A regular recovery project contains the other open documents in its extensions. */
 recoveryDocument():ProjectDocument{
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
 if(tab.path)return tab.path.split(/[\\/]/).pop()!;
 const name=tab.history.current.project.title.trim();
 return name&&!['Untitled','Untitled.aph','Новый проект','New project'].includes(name)?name:`${unnamed} ${tab.number}`;
}
export function graphFilename(tab:GraphTab,unnamed:string):string{return graphName(tab,unnamed).replace(/\.(aph|txt|csv|tsv)$/i,'')+'.aph'}
