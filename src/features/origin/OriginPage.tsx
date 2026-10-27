import {useEffect,useMemo,useState} from 'react';
import {ChartSpline,Table2} from 'lucide-react';
import type {T} from '../../app/controls';
import type {ProjectDocument} from '../../domain/model';
import {syncArea,activateArea,plotAreas,areaProject} from '../../domain/plotAreas';
import {fitContent} from '../../domain/fitContent';
import {PageCanvas} from '../chart/PageCanvas';
import {loadSettings} from '../settings/store';
import type {OriginTabState} from './history';
import type {OriginNode} from './model';
import {originName,originIndex,resolvePage,type XYLink} from './resolve';
import type {OriginWorkerClient} from './workerClient';
export function OriginPage({origin,node,worker,t,onData,onTransfer}:{origin:OriginTabState;node:OriginNode;worker:OriginWorkerClient;t:T;onData:(id:string)=>void;onTransfer:(links?:XYLink[])=>void}){
 const resolution=useMemo(()=>resolvePage(origin.model,node.id),[origin.model,node.id]),index=originIndex(origin.model),[project,setProject]=useState<ProjectDocument|null>(null),[error,setError]=useState(''),[loading,setLoading]=useState(true);
 useEffect(()=>{let alive=true;setLoading(true);worker.convert({nodeId:node.id,encoding:origin.history.current.encoding}).then(result=>{if(alive){setProject(result.project);setLoading(false)}}).catch(error=>{if(alive){setError(String(error));setLoading(false)}});return()=>{alive=false}},[worker,node.id,origin.history.current.encoding]);
 useEffect(()=>{const key=(e:KeyboardEvent)=>{if(e.key!=='F9'||e.target instanceof HTMLElement&&e.target.closest('input,textarea,select,[contenteditable]'))return;e.preventDefault();setProject(p=>{if(!p)return p;const layout=plotAreas(p);if(!layout)return {...p,viewport:fitContent(p,p.page.widthPx,p.page.heightPx)};const areas=layout.areas.map(a=>({...a,viewport:fitContent(areaProject(p,a),p.page.widthPx,p.page.heightPx)}));return {...p,viewport:areas.find(a=>a.id===layout.activeId)!.viewport,extensions:{...p.extensions,plotAreas:{...layout,areas}}}})};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[]);
 const known=resolution.layers.flatMap(layer=>(index.children.get(layer.id)??[]).filter(n=>n.kind==='curve').flatMap(curve=>{const links=index.links.get(curve.id),x=links?.get('x'),y=links?.get('y');return x&&y&&index.columns.has(x)&&index.columns.has(y)?[{curveId:curve.id,layerId:layer.id,x,y}]:[]}));
 const name=(id:string)=>{const n=index.nodes.get(id);return n?originName(n,origin.history.current.encoding,t):id};
 return <><div className="origin-content-actions"><button disabled={!project} onClick={()=>onTransfer()}><ChartSpline size={15}/>{t('originTransfer')}</button>{!project&&!loading&&known.length>0&&<button onClick={()=>onTransfer(known.map(({x,y})=>({x,y})))}>{t('originPlot')}</button>}<details className="origin-page-data"><summary><Table2 size={14}/>{t('originShowData')}</summary><div>{known.map(link=><button key={link.curveId} onClick={()=>onData(index.nodes.get(link.y)?.parentId??link.y)}>{name(link.y)} · {name(link.x!)}</button>)}</div></details></div>
 {loading&&<p className="origin-empty" role="status">{t('originWorking')}</p>}
 {!!resolution.issues.length&&<details className="origin-page-issues"><summary>{t('originPartialView')}</summary><ul>{resolution.issues.map((issue,i)=><li key={i}>{name(issue.nodeId)} · {issue.code}<button onClick={()=>onData(issue.nodeId)}>{t('originTechnical')}</button></li>)}</ul></details>}
 {project?<div className="origin-page-preview"><PageCanvas project={project} tool="pan" setTool={()=>{}} selection={[]} onSelect={()=>{}} onChange={()=>{}} onNavigate={v=>setProject(p=>p?syncArea({...p,viewport:v}):p)} onAreaActivate={id=>setProject(p=>p?activateArea(p,id):p)} onAreaNavigate={(id,v)=>setProject(p=>p?syncArea({...activateArea(p,id),viewport:v}):p)} settings={loadSettings()} t={t} onImport={()=>{}} onManual={()=>{}} readOnly/></div>:!loading&&<div className="origin-object-summary"><ChartSpline size={32}/><p>{t('originNoData')}</p>{error&&<p role="status">{error}</p>}<ul>{resolution.layers.map(layer=><li key={layer.id}>{name(layer.id)} · {(index.children.get(layer.id)??[]).filter(n=>n.kind==='curve').length}</li>)}</ul></div>}
 </>;
}
