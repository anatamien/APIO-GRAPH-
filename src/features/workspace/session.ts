import {History} from '../../domain/commands';
import {createProject,id} from '../../domain/model';
import {DeferredHistory,graphName,tabDirty,type Workspace,type GraphTab} from '../../domain/workspace';
import {registerWorkspaceOrigin,originResource,releaseOrigin} from '../origin/platform';
import {WorkspaceReader,serializeWorkspace} from './client';
import type {SaveTab,WorkspaceInput} from './archive';
export interface WorkspaceSnapshot {input:Promise<WorkspaceInput>;structure:string;confirm:()=>void;tabs:{id:string;dirty:boolean;path:string|null;readOnly:boolean}[];activeId:string|null;commonPath:string|null}
/** Capture all references and checkpoints synchronously before any I/O or worker await. */
export function captureWorkspace(workspace:Workspace,signal?:AbortSignal):WorkspaceSnapshot{
 const tabs=workspace.tabs.filter(t=>!t.placeholder||t.history.dirty),activeId=tabs.some(t=>t.id===workspace.activeId)?workspace.activeId:tabs[0]?.id??null,workspaceId=workspace.id,structure=workspace.structure,confirms:(()=>void)[]=[],pending:Promise<SaveTab>[]=[];

 for(const tab of tabs){signal?.throwIfAborted();const label=graphName(tab,'Graph');if(tab.deferred){const deferred=tab.deferred;pending.push(deferred.packet().then(packet=>({packet:{...packet,tab:{...packet.tab,id:tab.id,label}}})));continue}
  if(tab.origin){const origin=tab.origin,view=origin.history.current;confirms.push(origin.history.saveCheckpoint());pending.push((async()=>{const resources=new Map<string,Uint8Array>();for(const r of origin.model.resources)resources.set(r.id,await originResource(origin,r.id,signal));return {id:tab.id,label,origin:{model:origin.model,view,resources}}})())}
  else{const project=tab.history.current;confirms.push(tab.history.saveCheckpoint());pending.push(Promise.resolve({id:tab.id,label,project}))}
 }
 return {input:Promise.all(pending).then(tabs=>({id:workspaceId,activeId,tabs})),structure,confirm:()=>{for(const confirm of confirms)confirm();workspace.acknowledgeStructure(structure)},tabs:tabs.map(t=>({id:t.id,dirty:tabDirty(t),path:t.path,readOnly:t.readOnly})),activeId,commonPath:workspace.commonPath};
}
export async function workspaceBytes(snapshot:WorkspaceSnapshot,signal?:AbortSignal){return serializeWorkspace(await snapshot.input,signal)}
export async function prepareWorkspace(bytes:Uint8Array,signal?:AbortSignal){
 const reader=new WorkspaceReader();let retained=1;const retain=()=>{retained++;let released=false;return()=>{if(released)return;released=true;if(--retained===0)reader.close()}};const releaseGuard=()=>{if(--retained===0)reader.close()};const tabs:GraphTab[]=[];
 try{const manifest=await reader.open(bytes,signal);
  for(const entry of manifest.tabs){signal?.throwIfAborted();const tab:GraphTab={id:entry.id,label:entry.label,history:new DeferredHistory(),path:null,readOnly:false,number:0,placeholder:false};if(entry.kind==='origin'){const o=await reader.origin(entry.id);tab.history=new History(createProject());tab.origin=registerWorkspaceOrigin(o.model,o.view,{resource:(resourceId,offset,count)=>reader.resource(entry.id,resourceId,offset,count),cells:(nodeId,start,count)=>reader.cells(entry.id,nodeId,start,count),release:retain()})}else tab.deferred={load:()=>reader.graph(entry.id),packet:()=>reader.packet(entry.id),release:retain()};tabs.push(tab)}
  const active=tabs.find(t=>t.id===manifest.activeId);if(active?.deferred){const d=active.deferred;active.history=new History(await d.load());active.deferred=undefined;d.release()}signal?.throwIfAborted();releaseGuard();return {manifest,tabs,dispose:()=>disposeWorkspaceTabs(tabs)};
 }catch(error){await disposeWorkspaceTabs(tabs);reader.close();throw error}
}
export async function disposeWorkspaceTabs(tabs:GraphTab[]){for(const tab of tabs){tab.deferred?.release();if(tab.origin)await releaseOrigin(tab.origin)}}
export function remapWorkspaceTab(tab:GraphTab){return {...tab,id:id()}}
