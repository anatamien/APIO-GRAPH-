import {useEffect,useRef,useState} from 'react';
import {ChevronLeft,ChevronRight,List,Plus,X} from 'lucide-react';
import {graphName,tabDirty,type GraphTab} from '../domain/workspace';
import {addTranslations} from './i18n';
import type {T} from './controls';
import './document-tabs.css';

addTranslations({allGraphs:['Все открытые графики','All open graphs'],findGraph:['Найти график','Find graph'],previousTabs:['Прокрутить вкладки влево','Scroll tabs left'],nextTabs:['Прокрутить вкладки вправо','Scroll tabs right'],renameTab:['Переименовать вкладку','Rename tab'],noGraphsFound:['Графики не найдены','No graphs found']});

export function DocumentTabs({tabs,activeId,t,onSelect,onClose,onNew,onRename}:{tabs:GraphTab[];activeId:string;t:T;onSelect:(id:string)=>void;onClose:(id:string)=>void;onNew:()=>void;onRename:(id:string,name:string)=>void}){
 const list=useRef<HTMLDivElement>(null),menuButton=useRef<HTMLButtonElement>(null),[overflow,setOverflow]=useState({left:false,right:false}),[open,setOpen]=useState(false),[query,setQuery]=useState(''),[renaming,setRenaming]=useState<{id:string;name:string}|null>(null),renameCancelled=useRef(false);
 const measure=()=>{const el=list.current;if(!el)return;const next={left:el.scrollLeft>1,right:el.scrollLeft+el.clientWidth<el.scrollWidth-1};setOverflow(old=>old.left===next.left&&old.right===next.right?old:next)};
 useEffect(()=>{
  const el=list.current;if(!el)return;const observer=new ResizeObserver(measure);observer.observe(el);for(const child of el.children)observer.observe(child);
  const wheel=(event:WheelEvent)=>{if(el.scrollWidth<=el.clientWidth)return;event.preventDefault();event.stopPropagation();el.scrollLeft+=Math.abs(event.deltaX)>Math.abs(event.deltaY)?event.deltaX:event.deltaY;measure()};
  el.addEventListener('wheel',wheel,{passive:false});measure();return()=>{observer.disconnect();el.removeEventListener('wheel',wheel)};
 },[tabs.length]);
 useEffect(()=>{document.getElementById(`graph-tab-${activeId}`)?.scrollIntoView({block:'nearest',inline:'nearest'});measure()},[activeId,tabs.length,overflow.left||overflow.right]);
 const pick=(id:string)=>{onSelect(id);setOpen(false);setQuery('');requestAnimationFrame(()=>document.getElementById(`graph-tab-${id}`)?.focus())};
 const closeMenu=()=>{setOpen(false);menuButton.current?.focus()};
 const matches=tabs.filter(tab=>graphName(tab,t('graph')).toLocaleLowerCase().includes(query.toLocaleLowerCase()));
 const scroll=(direction:number)=>{const el=list.current;if(el){el.scrollLeft+=direction*Math.max(90,el.clientWidth*.75);measure()}};
 const rename=(tab:GraphTab)=>{if(tab.readOnly)return;renameCancelled.current=false;setRenaming({id:tab.id,name:graphName(tab,t('graph'))})};
 const finishRename=()=>{if(!renaming)return;const name=renaming.name.trim();if(!renameCancelled.current&&name)onRename(renaming.id,name);setRenaming(null)};
 const overflowing=overflow.left||overflow.right;
 return <div className="document-tabs" data-tabs-menu-open={open||undefined}>
  {tabs.length>1&&<button ref={menuButton} className="all-graphs-button" aria-label={t('allGraphs')} title={t('allGraphs')} aria-expanded={open} aria-haspopup="dialog" onClick={()=>{setQuery('');setOpen(!open)}}><List size={17}/></button>}
  {overflowing&&<button className="tab-scroll" aria-label={t('previousTabs')} title={t('previousTabs')} disabled={!overflow.left} onClick={()=>scroll(-1)}><ChevronLeft size={14}/></button>}
  <div ref={list} className="tab-list" role="tablist" aria-label={t('openGraphs')} onScroll={measure} onKeyDown={e=>{
   if(e.target instanceof HTMLInputElement)return;const button=(e.target as Element).closest('[role=tab]');if(!button)return;const index=tabs.findIndex(tab=>`graph-tab-${tab.id}`===button.id);let next=index;
   if(e.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;else if(e.key==='ArrowRight')next=(index+1)%tabs.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=tabs.length-1;else return;
   e.preventDefault();e.stopPropagation();pick(tabs[next].id);
  }}>
   {tabs.map(tab=>{const name=graphName(tab,t('graph')),extension=name.match(/\.[a-z0-9]{1,5}$/i)?.[0]??'',base=extension?name.slice(0,-extension.length):name;return <div className="document-tab" key={tab.id} data-active={tab.id===activeId}>
    {renaming?.id===tab.id?<input autoFocus className="tab-rename" maxLength={300} aria-label={t('renameTab')} value={renaming.name} onFocus={e=>e.target.select()} onChange={e=>setRenaming({...renaming,name:e.target.value})} onBlur={finishRename} onKeyDown={e=>{e.stopPropagation();if(e.key==='Enter'){e.preventDefault();finishRename()}if(e.key==='Escape'){e.preventDefault();renameCancelled.current=true;setRenaming(null)}}}/>:<button className="project-name" role="tab" id={`graph-tab-${tab.id}`} aria-controls="graph-editor" aria-selected={tab.id===activeId} aria-label={name} aria-description={tabDirty(tab)?t('unsavedChanges'):undefined} tabIndex={tab.id===activeId?0:-1} title={tab.path??name} onDoubleClick={()=>rename(tab)} onKeyDown={e=>{if(e.key==='F2'){e.preventDefault();e.stopPropagation();rename(tab)}}} onClick={()=>onSelect(tab.id)}><span className="tab-base">{base}</span>{extension&&<span className="tab-extension">{extension}</span>}{tabDirty(tab)&&<b className="dirty-dot" aria-hidden="true">•</b>}</button>}
    <button className="tab-close" aria-label={`${t('closeGraph')}: ${name}`} title={t('closeGraph')} onClick={()=>onClose(tab.id)}><X size={12}/></button>
   </div>})}
  </div>
  {overflowing&&<button className="tab-scroll" aria-label={t('nextTabs')} title={t('nextTabs')} disabled={!overflow.right} onClick={()=>scroll(1)}><ChevronRight size={14}/></button>}
  <button className="new-project-button" aria-label={t('new')} title={t('new')} onClick={onNew}><Plus size={18}/></button>

  {open&&<div className="tabs-dismiss" onPointerDown={closeMenu}><section role="dialog" aria-label={t('allGraphs')} className="all-graphs-menu glass-menu" onPointerDown={e=>e.stopPropagation()} onKeyDown={e=>{
   if(e.key==='Escape'){e.preventDefault();e.stopPropagation();closeMenu();return}
   if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();e.stopPropagation();const items=[...e.currentTarget.querySelectorAll<HTMLButtonElement>('[role=option]')],at=items.indexOf(document.activeElement as HTMLButtonElement);items[(at+(e.key==='ArrowDown'?1:-1)+items.length)%items.length]?.focus()}
   if(e.key==='Enter'&&e.target instanceof HTMLInputElement&&matches[0]){e.preventDefault();pick(matches[0].id)}
  }}><input autoFocus aria-label={t('findGraph')} placeholder={t('findGraph')} value={query} onChange={e=>setQuery(e.target.value)}/><div role="listbox" aria-label={t('openGraphs')}>{matches.map(tab=><button key={tab.id} role="option" aria-selected={tab.id===activeId} onClick={()=>pick(tab.id)}>{graphName(tab,t('graph'))}{tabDirty(tab)&&<span aria-label={t('unsavedChanges')}>•</span>}</button>)}{!matches.length&&<p>{t('noGraphsFound')}</p>}</div></section></div>}
 </div>;
}
