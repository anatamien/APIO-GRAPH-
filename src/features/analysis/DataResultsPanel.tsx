import {PeakFitReport} from './PeakFitPanel';
import {importedSnapshot} from '../../domain/importedSnapshots';
import {memo,useEffect,useMemo,useRef,useState,type KeyboardEvent} from 'react';
import {ChartSpline,ChevronDown,ChevronRight,Eye,EyeOff,MoreHorizontal,Plus,Shapes,Sigma,SlidersHorizontal,Table2} from 'lucide-react';
import {Panel,Field,Check,NumberField,type T} from '../../app/controls';
import {ColorPicker} from '../inspector/ColorPicker';
import type {CalculationDisplay} from '../../domain/signalTypes';
import {addTranslations} from '../../app/i18n';
import type {ProjectDocument} from '../../domain/model';
import {dependencyIndex,removalPlan,removeDataNode,type DataNodeKey} from '../../domain/dependencies';
import {createCoordinates} from '../../domain/geometry';
import {MathError} from '../../domain/math';
import {AnalysisWorkerClient} from './workerClient';
import {applyCalculationPatches,calculationInputsUnchanged} from './recalculation';
import {buildDataTree,flattenDataTree,parameterText,calculationName,type TreeRow} from './dataTree';
import {Summary} from './AnalysisPanel';
import './data-results.css';
addTranslations({
 'data.importedResult':['Импортированный результат · без пересчета','Imported result · no recalculation'],'data.results':['Данные и результаты','Data and results'],'data.raw':['Исходный набор','Source dataset'],'data.derived':['Расчетный набор','Calculated dataset'],'data.curve':['Кривая','Curve'],'data.valid':['Актуален','Up to date'],'data.outdated':['Требует пересчета','Recalculation required'],'data.invalid':['Ошибка расчета','Calculation error'],
 'data.add':['Добавить данные или расчет','Add data or calculation'],'data.import':['Импортировать в текущий график','Import into current graph'],'data.manual':['Ввести новую серию вручную','Enter a new series manually'],'data.calculate':['Рассчитать по выбранному источнику','Calculate from selected source'],'data.rename':['Переименовать','Rename'],'data.edit':['Изменить параметры обработки','Edit processing parameters'],'data.useSource':['Использовать как источник','Use as source'],'data.table':['Открыть таблицу','Open table'],'data.properties':['Свойства','Properties'],'data.menu':['Действия с узлом','Node actions'],'data.expand':['Развернуть все','Expand all'],'data.collapse':['Свернуть все','Collapse all'],'data.yes':['Да','Yes'],
 'data.removeWarning':['Удалить выбранную ветвь? Расчеты и их потомки будут удалены. Отмена сохраняет всё.','Delete this branch? Calculations and their descendants will be removed. Cancel keeps everything.'],'data.linkWarning':['Связанные объекты будут отвязаны на текущих координатах:','Linked objects will be detached at their current coordinates:'],'data.datasets':['Наборы','Datasets'],'data.calculations':['Расчеты','Calculations'],'data.recalculateAll':['Пересчитать устаревшие','Recalculate outdated'],'data.noCurve':['Численный результат · без кривой','Numeric result · no curve'],'data.noResults':['Добавьте измерения или выберите источник для расчета.','Add measurements or select a calculation source.'],'RemoveDataNode':['Удалить данные и зависимости','Remove data and dependencies'],'RenameDataNode':['Переименовать данные','Rename data'],'UpdateCalculation':['Изменить параметры расчета','Update calculation parameters'],
});
export interface DataPanelState {collapsed:Set<DataNodeKey>;selected?:DataNodeKey;query:string;scrollTop:number}
export const createDataPanelState=():DataPanelState=>({collapsed:new Set(),query:'',scrollTop:0});
interface Props {project:ProjectDocument;t:T;state:DataPanelState;selectedSeriesId?:string;onChange:(label:string,fn:(p:ProjectDocument)=>ProjectDocument)=>void;onSelect:(id?:string)=>void;onProperties:(id:string)=>void;onAnalysis:(sourceId?:string,calculationId?:string)=>void;onTable:(seriesId?:string,manual?:boolean)=>void;onImport:(source:'file'|'text')=>void;onObjects:()=>void;onClose:()=>void}
const rowHeight=64;
const TreeItem=memo(function TreeItem({row,name,description,status,visible,expanded,selected,onPick,onToggle,onVisible,onMenu,t}:{row:TreeRow;name:string;description:string;status?:string;visible?:boolean;expanded?:boolean;selected:boolean;onPick:(key:DataNodeKey)=>void;onToggle:(key:DataNodeKey)=>void;onVisible:(key:DataNodeKey)=>void;onMenu:(key:DataNodeKey)=>void;t:T}){
 const NodeIcon=row.key.startsWith('calculation:')?Sigma:row.key.startsWith('series:')?ChartSpline:Table2;
 return <div id={`data-node-${row.key}`} role="treeitem" aria-level={row.depth} aria-posinset={row.pos} aria-setsize={row.size} aria-selected={selected} aria-expanded={expanded} className="result-tree-row" data-node={row.key} style={{paddingLeft:Math.min(row.depth-1,6)*12+10}} onClick={()=>onPick(row.key)} onContextMenu={e=>{e.preventDefault();onMenu(row.key)}}>
  {expanded===undefined?<NodeIcon className="result-node-icon" size={16} aria-hidden="true"/>:<button className="result-tree-toggle" tabIndex={-1} aria-label={t(expanded?'data.collapseBranch':'data.expandBranch')} onClick={e=>{e.stopPropagation();onToggle(row.key)}}>{expanded?<ChevronDown size={14}/>:<ChevronRight size={14}/>}</button>}
  <span className="result-tree-caption" title={`${name}\n${description}${status?`\n${t(`data.${status}`)}`:''}`}><strong>{name}</strong><small>{description}</small>{status&&<small className={`result-status ${status}`}>{t(`data.${status}`)}</small>}</span>
  <span className="result-tree-row-actions">{visible!==undefined&&<button tabIndex={-1} aria-label={`${t(visible?'data.hide':'data.show')} · ${name}`} aria-pressed={visible} onClick={e=>{e.stopPropagation();onVisible(row.key)}}>{visible?<Eye size={15}/>:<EyeOff size={15}/>}</button>}
  <button tabIndex={-1} aria-label={`${t('data.menu')} · ${name}`} onClick={e=>{e.stopPropagation();onMenu(row.key)}}><MoreHorizontal size={15}/></button></span>
 </div>;
});
addTranslations({'data.hide':['Скрыть','Hide'],'data.show':['Показать','Show'],'data.collapseBranch':['Свернуть ветвь','Collapse branch'],'data.expandBranch':['Развернуть ветвь','Expand branch']});
addTranslations({'data.unitsUnspecified':['Не заданы','Not specified']});
export function DataResultsPanel({project:p,t,state,selectedSeriesId,onChange,onSelect,onProperties,onAnalysis,onTable,onImport,onObjects,onClose}:Props){
 const [collapsed,setCollapsed]=useState(state.collapsed),[selected,setSelected]=useState<DataNodeKey|undefined>(()=>{const old=state.selected?buildDataTree(p).nodes.get(state.selected):undefined;const s=p.series.find(s=>s.id===selectedSeriesId);return s&&old?.seriesId!==s.id?`dataset:${s.datasetId}`:state.selected}),[query,setQuery]=useState(state.query),[scrollTop,setScrollTop]=useState(state.scrollTop),[height,setHeight]=useState(320);
 const [menu,setMenu]=useState(false),[adding,setAdding]=useState(false),[renaming,setRenaming]=useState(false),[draft,setDraft]=useState(''),[removing,setRemoving]=useState(false),[error,setError]=useState(''),[busy,setBusy]=useState(false);
 const scroller=useRef<HTMLDivElement>(null),menuRef=useRef<HTMLDivElement>(null),selectionRow=useRef(-1),latest=useRef(p),client=useRef<AnalysisWorkerClient|null>(null);latest.current=p;
 const running=useRef<ProjectDocument|null>(null);
 if(!client.current)client.current=new AnalysisWorkerClient();
 const tree=useMemo(()=>buildDataTree(p),[p.datasets,p.series,p.calculations]),index=dependencyIndex(p),seriesIds=useMemo(()=>new Map(p.series.map(s=>[s.id,s])),[p.series]);
 const node=selected?tree.nodes.get(selected):undefined,s=node?.seriesId?seriesIds.get(node.seriesId):undefined,d=node?.datasetId?index.datasets.get(node.datasetId):undefined,c=node?.calculationId?index.calculations.get(node.calculationId):undefined;
 const nameFor=(key:DataNodeKey)=>{const n=tree.nodes.get(key)!;return key.startsWith('calculation:')?calculationName(p,index.calculations.get(n.calculationId!)!,t):key.startsWith('series:')?seriesIds.get(n.seriesId!)!.name:index.datasets.get(n.datasetId!)!.name};
 const matches=useMemo(()=>{
  if(!query.trim())return undefined;const found=new Set<DataNodeKey>(),q=query.trim().toLocaleLowerCase();
  for(const n of tree.nodes.values()){const calc=n.calculationId?index.calculations.get(n.calculationId):undefined;const texts=[n.datasetId?index.datasets.get(n.datasetId)?.name:'',n.seriesId?seriesIds.get(n.seriesId)?.name:'',calc?calculationName(p,calc,t):'',calc?t(calc.kind):''];if(texts.some(text=>text?.toLocaleLowerCase().includes(q))){let current:typeof n|undefined=n;while(current&&!found.has(current.key)){found.add(current.key);current=current.parent?tree.nodes.get(current.parent):undefined}}}return found;
 },[query,tree,index,seriesIds,t]);
 const rows=useMemo(()=>flattenDataTree(tree,collapsed,matches),[tree,collapsed,matches]);
 selectionRow.current=rows.findIndex(row=>row.key===selected);
 useEffect(()=>{
  const el=scroller.current;if(!el)return;const initial=selectionRow.current;el.scrollTop=selected!==state.selected&&initial>=0?initial*rowHeight:state.scrollTop;
  let previous=el.clientHeight;
  const obs=new ResizeObserver(()=>{
   const next=el.clientHeight;if(!next)return;const y=selectionRow.current*rowHeight;
   // Keep a visible selection in view when a scalar card or window resize
   // reduces the tree viewport. Preserve a user's scroll away from selection.
   if(next<previous&&y>=el.scrollTop&&y<el.scrollTop+previous)el.scrollTop=Math.max(el.scrollTop,y+rowHeight-next);
   previous=next;setHeight(next);
  });obs.observe(el);return()=>obs.disconnect();
 },[state]);
 useEffect(()=>()=>client.current?.cancel(),[]);
 useEffect(()=>{if(running.current&&!calculationInputsUnchanged(p,running.current)){client.current?.cancel();running.current=null;setBusy(false);setError('MATH_PREVIEW_STALE')}},[p.datasets,p.calculations,p.axes.x.unit,p.axes.y.unit]);
 useEffect(()=>{if(menu)menuRef.current?.querySelector<HTMLButtonElement>('[role=menuitem]:not(:disabled)')?.focus({preventScroll:true})},[menu,selected]);
 useEffect(()=>{state.collapsed=collapsed;state.selected=selected;state.query=query;state.scrollTop=scrollTop},[state,collapsed,selected,query,scrollTop]);
 const pick=(key:DataNodeKey)=>{setSelected(key);setMenu(false);setRemoving(false);setRenaming(false);setError('');onSelect(tree.nodes.get(key)?.seriesId);scroller.current?.focus({preventScroll:true})};
 const toggle=(key:DataNodeKey)=>setCollapsed(old=>{const next=new Set(old);if(next.has(key))next.delete(key);else next.add(key);return next});
 const visibility=(key:DataNodeKey)=>{const n=tree.nodes.get(key),sid=n?.seriesId,cid=n?.calculationId;if(sid)onChange('SetSeriesVisibility',q=>({...q,series:q.series.map(s=>s.id===sid?{...s,visible:!s.visible}:s)}));else if(cid)onChange('SetResultVisibility',q=>({...q,calculations:q.calculations.map(c=>c.id===cid&&c.display?{...c,display:{...c.display,visible:!c.display.visible}}:c)}))};
 const display=(patch:Partial<CalculationDisplay>)=>{if(c?.display)onChange('SetResultDisplay',q=>({...q,calculations:q.calculations.map(a=>a.id===c.id&&a.display?{...a,display:{...a.display,...patch}}:a)}))};
 const openMenu=(key:DataNodeKey)=>{pick(key);setMenu(true)};
 function navigate(e:KeyboardEvent){
  if(!['ArrowDown','ArrowUp','ArrowLeft','ArrowRight','Home','End','Enter','Delete','F10'].includes(e.key))return;e.preventDefault();e.stopPropagation();
  const i=rows.findIndex(row=>row.key===selected),row=rows[Math.max(0,i)];if(!row)return;
  let next=i;
  if(e.key==='ArrowDown')next=Math.min(rows.length-1,i+1);if(e.key==='ArrowUp')next=Math.max(0,i-1);if(e.key==='Home')next=0;if(e.key==='End')next=rows.length-1;
  if(e.key==='ArrowRight'){if(collapsed.has(row.key))toggle(row.key);else if(tree.nodes.get(row.key)?.children.length)next=Math.min(rows.length-1,i+1)}
  if(e.key==='ArrowLeft'){if(tree.nodes.get(row.key)?.children.length&&!collapsed.has(row.key))toggle(row.key);else next=rows.findIndex(r=>r.key===tree.nodes.get(row.key)?.parent)}
  if(e.key==='Enter'){if(s)onProperties(s.id);else setMenu(true)}if(e.key==='Delete')setRemoving(true);if(e.key==='F10'&&e.shiftKey)setMenu(true);
  if(next>=0){if(next!==i)pick(rows[next].key);const el=scroller.current;if(el){const y=next*rowHeight,viewHeight=el.clientHeight;if(y<el.scrollTop)el.scrollTop=y;else if(y+rowHeight>el.scrollTop+viewHeight)el.scrollTop=y+rowHeight-viewHeight}}
 }
 async function recalculate(target?:string){
  const snapshot=latest.current;running.current=snapshot;setBusy(true);setError('');
  try{const result=await client.current!.run({type:'recompute',project:snapshot,targets:target?[target]:undefined});if(result.type!=='recompute'||!result.patches)return;running.current=null;onChange('recalculate',q=>applyCalculationPatches(q,snapshot,result.patches!))}
  catch(reason){if(!(reason instanceof Error&&reason.name==='AbortError'))setError(reason instanceof MathError?reason.code:'MATH_WORKER_FAILURE')}
  finally{running.current=null;setBusy(false)}
 }
 const start=Math.max(0,Math.floor(scrollTop/rowHeight)-3),end=Math.min(rows.length,start+Math.ceil(height/rowHeight)+7),plan=selected?removalPlan(p,selected):undefined;
 const rawUnits=c?.parameters.sourceUnits;
 const units=rawUnits&&typeof rawUnits==='object'&&'x'in rawUnits&&'y'in rawUnits&&typeof rawUnits.x==='string'&&typeof rawUnits.y==='string'?{x:rawUnits.x,y:rawUnits.y}:undefined;
 const xUnit=units?.x||p.axes.x.unit,yUnit=units?.y||p.axes.y.unit;
 const scalarUnit=c?.kind==='integral'||c?.kind==='area'?(xUnit||yUnit?`${xUnit||p.axes.x.label||'X'} × ${yUnit||p.axes.y.label||'Y'}`:t('data.unitsUnspecified')):c?.kind==='peaks'?`X: ${xUnit||'—'} · Y: ${yUnit||'—'}`:yUnit||t('data.unitsUnspecified');
 return <Panel title={t('data.results')} className={`data-results-panel${c&&!c.resultDatasetId?' scalar-selection':''}`} t={t} onClose={onClose}>
  <div className="result-panel-navigation"><button disabled={!s&&!c?.display} onClick={()=>s?onProperties(s.id):c&&onAnalysis(undefined,c.id)}><SlidersHorizontal size={16}/>{t('data.properties')}</button><button onClick={onObjects}><Shapes size={16}/>{t('graphObjects')}</button></div>
  <button className="data-add-menu" aria-expanded={adding} onClick={()=>setAdding(!adding)}><Plus size={16}/><span>{t('data.add')}</span><ChevronDown size={16}/></button>
  {adding&&<div className="data-add-options"><button onClick={()=>onImport('file')}>{t('data.import')}</button><button onClick={()=>onImport('text')}>{t('pasteTable')}</button><button onClick={()=>onTable(undefined,true)}>{t('data.manual')}</button><button disabled={(!s&&!d)||c?.status==='invalid'||c?.status==='outdated'} onClick={()=>onAnalysis(s?.id??(d?`dataset:${d.id}`:undefined))}>{t('data.calculate')}</button></div>}
  {tree.nodes.size>100&&<Field label={t('search')}><input aria-label={t('search')} value={query} onChange={e=>{setQuery(e.target.value);setScrollTop(0);if(scroller.current)scroller.current.scrollTop=0}}/></Field>}
  <div className="result-tree-tools"><div className="result-tree-buttons"><button onClick={()=>setCollapsed(new Set())}>{t('data.expand')}</button><button onClick={()=>setCollapsed(new Set(tree.nodes.keys()))}>{t('data.collapse')}</button></div><small className="result-tree-counts"><span>{t('data.datasets')}: {index.datasets.size}</span><span>{t('data.calculations')}: {index.calculations.size}</span></small></div>
  <div className="result-tree" style={{height:Math.max(1,rows.length)*rowHeight+2}} role="tree" aria-label={t('data.results')} aria-activedescendant={selected&&rows.slice(start,end).some(r=>r.key===selected)?`data-node-${selected}`:undefined} tabIndex={0} ref={scroller} onKeyDown={navigate} onScroll={e=>setScrollTop(e.currentTarget.scrollTop)}>
   <div style={{height:start*rowHeight}}/>{rows.slice(start,end).map(row=>{const n=tree.nodes.get(row.key)!,curve=n.seriesId?seriesIds.get(n.seriesId):undefined,data=n.datasetId?index.datasets.get(n.datasetId):undefined,calc=n.calculationId?index.calculations.get(n.calculationId):undefined;return <TreeItem key={row.key} row={row} name={nameFor(row.key)} description={row.key.startsWith('calculation:')?`${t(calc!.kind)}${calc!.resultDatasetId?'':` · ${t('data.noCurve')}`}`:`${t(row.key.startsWith('series:')?'data.curve':data&&importedSnapshot(p,data.id)?'data.importedResult':data?.role==='raw'?'data.raw':'data.derived')} · ${data?.points.length??0} ${t('points')}`} status={calc?.status} visible={curve?.visible??calc?.display?.visible} expanded={n.children.length?!collapsed.has(row.key):undefined} selected={selected===row.key} onPick={pick} onToggle={toggle} onVisible={visibility} onMenu={openMenu} t={t}/>})}<div style={{height:Math.max(0,rows.length-end)*rowHeight}}/>
   {!rows.length&&<p className="muted">{t('data.noResults')}</p>}
  </div>
  {node&&<div className="result-details" aria-label={t('data.properties')}>
   <strong title={nameFor(node.key)}>{nameFor(node.key)}</strong>
   {c?<small>{t(c.kind)} · {t(`data.${c.status}`)}</small>:d&&<small>{t(importedSnapshot(p,d.id)?'data.importedResult':d.role==='raw'?'data.raw':'data.derived')} · {d.points.length} {t('points')}</small>}
   {c?.display&&<div className="result-overlay-controls"><Check label={t('signal.showOverlay')} value={c.display.visible} onChange={visible=>display({visible})}/>{c.kind==='area'&&<><Check label={t('signal.showLabel')} value={c.display.label} onChange={label=>display({label})}/><NumberField label={t('signal.opacity')} value={c.display.opacity*100} min={0} max={100} onChange={opacity=>display({opacity:opacity/100})}/></>}<ColorPicker label={t('signal.overlayColor')} value={c.display.stroke} onChange={stroke=>display({stroke})} t={t}/></div>}
   <div className="result-selection-actions">
    {s&&<button onClick={()=>onProperties(s.id)}><SlidersHorizontal size={14}/>{t('data.properties')}</button>}
    {d?.role==='raw'&&<button onClick={()=>onTable(s?.id??`dataset:${d.id}`)}>{t('data.table')}</button>}
    {c&&<button onClick={()=>onAnalysis(undefined,c.id)}>{t('data.edit')}</button>}
   </div>
   {menu&&<div className="result-node-actions" ref={menuRef} role="menu" aria-label={t('data.menu')} onKeyDown={e=>{
    if(e.key==='Escape'){e.preventDefault();e.stopPropagation();setMenu(false);scroller.current?.focus({preventScroll:true});return}
    if(!['ArrowDown','ArrowUp','Home','End'].includes(e.key))return;e.preventDefault();e.stopPropagation();const items=[...e.currentTarget.querySelectorAll<HTMLButtonElement>('[role=menuitem]:not(:disabled)')],at=items.indexOf(document.activeElement as HTMLButtonElement);const next=e.key==='Home'?0:e.key==='End'?items.length-1:(at+(e.key==='ArrowDown'?1:-1)+items.length)%items.length;items[next]?.focus();
   }}>
    {s&&<button role="menuitem" onClick={()=>onProperties(s.id)}>{t('data.properties')}</button>}
    <button role="menuitem" onClick={()=>{setDraft(nameFor(node.key));setRenaming(true)}}>{t('data.rename')}</button>
    {(s||c?.display)&&<button role="menuitem" onClick={()=>visibility(node.key)}>{t((s?.visible??c?.display?.visible)?'data.hide':'data.show')}</button>}
    {c&&<><button role="menuitem" onClick={()=>onAnalysis(undefined,c.id)}>{t('data.edit')}</button><button role="menuitem" disabled={busy} onClick={()=>void recalculate(c.id)}>{t('recalculate')}</button></>}
    {(s||d)&&(!c||c.status==='valid')&&<button role="menuitem" onClick={()=>onAnalysis(s?.id??`dataset:${d!.id}`)}>{t('data.useSource')}</button>}
    {d?.role==='raw'&&<button role="menuitem" onClick={()=>onTable(s?.id??`dataset:${d.id}`)}>{t('data.table')}</button>}
    <button role="menuitem" className="danger" onClick={()=>setRemoving(true)}>{t('delete')}</button>
   </div>}
   {renaming&&<form onKeyDown={e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();setRenaming(false)}}} onSubmit={e=>{e.preventDefault();const name=draft.trim();if(!name)return;onChange('RenameDataNode',q=>node.key.startsWith('calculation:')?{...q,calculations:q.calculations.map(a=>a.id===c?.id?{...a,parameters:{...a.parameters,resultName:name}}:a)}:node.key.startsWith('series:')?{...q,series:q.series.map(a=>a.id===s?.id?{...a,name}:a)}:{...q,datasets:q.datasets.map(a=>a.id===d?.id?{...a,name}:a)});setRenaming(false)}}><Field label={t('name')}><input autoFocus maxLength={300} value={draft} onChange={e=>setDraft(e.target.value)}/></Field><button type="submit">{t('apply')}</button><button type="button" onClick={()=>setRenaming(false)}>{t('cancel')}</button></form>}
   {removing&&plan&&<div role="alertdialog" aria-label={t('delete')} onKeyDown={e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();setRemoving(false)}}}><p>{t('data.removeWarning')}</p><p>{t('data.datasets')}: {plan.datasets.size} · {t('data.calculations')}: {plan.calculations.size}</p>{plan.linked>0&&<p>{t('data.linkWarning')} {plan.linked}</p>}<button autoFocus onClick={()=>setRemoving(false)}>{t('cancel')}</button><button className="danger" onClick={()=>{const key=node.key;onChange('RemoveDataNode',q=>{const box=document.querySelector('.chart-host')?.getBoundingClientRect();return removeDataNode(q,key,true,createCoordinates(q,box?.width??1200,box?.height??800))});setRemoving(false);setMenu(false);setSelected(undefined);onSelect(undefined)}}>{t('confirm')}</button></div>}
   {c&&<div className="result-calculation-details"><small>{t('source')}: {c.sourceDatasetIds.map(did=>index.datasets.get(did)?.name??did).join(', ')}</small>{parameterText(c,t)&&<small>{parameterText(c,t)}</small>}{c.status!=='valid'&&<p className="analysis-note">{t('analysisRetained')}</p>}{typeof c.summary.errorCode==='string'&&<p className="analysis-error">{t(c.summary.errorCode)}</p>}{c.data?.peakFit?<PeakFitReport fit={c.data.peakFit} t={t}/>:<Summary summary={c.summary} t={t}/>}{!c.resultDatasetId&&<small>{t('unit')}: {scalarUnit}</small>}</div>}
  </div>}
  {p.calculations.some(c=>c.status!=='valid')&&<button disabled={busy} onClick={()=>void recalculate()}>{t('data.recalculateAll')}</button>}
  {busy&&<div role="status">{t('calculating')}<button onClick={()=>{client.current?.cancel();setBusy(false)}}>{t('cancel')}</button></div>}
  {error&&<p role="alert" className="analysis-error">{t(error)}</p>}
 </Panel>;
}
