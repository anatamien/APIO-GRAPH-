import {useEffect,useId,useRef,useState} from 'react';
import {MousePointer2,Hand,ZoomIn,ZoomOut,Type,Minus,MoveUpRight,ArrowUpRight,MessageSquare,RectangleHorizontal,Magnet,ChartNoAxesCombined,Pin,Ellipsis,Dot,BetweenHorizontalStart,BetweenVerticalStart,Omega,Table2} from 'lucide-react';
import type {ObjectType} from '../../domain/model';
import type {Settings} from '../settings/store';
import type {T} from '../../app/controls';
import {addTranslations} from '../../app/i18n';
import {showSymbols} from '../inspector/symbols';
addTranslations({moreTools:['Другие инструменты','More tools'],zoom:['Увеличить масштаб','Zoom in'], 'zoom-out':['Уменьшить масштаб','Zoom out']});
export type Tool='select'|'pan'|'zoom'|'zoom-out'|ObjectType;
export const toolKeys:Record<string,Tool>={v:'select',h:'pan',z:'zoom',x:'zoom-out',t:'text',l:'segment',a:'arrow',c:'callout',r:'rectangle'};
const basic=[['select',MousePointer2],['pan',Hand],['zoom',ZoomIn],['zoom-out',ZoomOut],['text',Type],['segment',Minus],['line',MoveUpRight],['arrow',ArrowUpRight],['callout',MessageSquare],['rectangle',RectangleHorizontal],['table',Table2]] as const;
const additional=[['range-x',BetweenHorizontalStart],['range-y',BetweenVerticalStart],['marker',Dot]] as const;
export function ToolBar({tool,setTool,settings,setSettings,t,onAnalysis}:{tool:Tool;setTool:(v:Tool)=>void;settings:Settings;setSettings:(s:Settings)=>void;t:T;onAnalysis:()=>void}){
 const [open,setOpen]=useState(false),[more,setMore]=useState(false);const timer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined);
 const itemsId=useId(),moreId=useId(),itemsRef=useRef<HTMLDivElement>(null);const ActiveIcon=[...basic,...additional].find(([key])=>key===tool)?.[1]??MousePointer2;
 useEffect(()=>()=>clearTimeout(timer.current),[]);
 const expanded=open||settings.pinned||more;
 const change=(isOpen:boolean)=>{clearTimeout(timer.current);if(isOpen)setOpen(true);else timer.current=setTimeout(()=>{setOpen(false);setMore(false)},60)};
 const toolButton=([key,Icon]:typeof basic[number])=><button key={key} data-tool={key} aria-label={t(key==='table'?'diagramTable':key)} aria-pressed={tool===key} title={`${t(key==='table'?'diagramTable':key)}${Object.entries(toolKeys).find(([,v])=>v===key)?.[0]?' · '+Object.entries(toolKeys).find(([,v])=>v===key)![0].toUpperCase():''}`} tabIndex={expanded?0:-1} className={tool===key?'active':''} onClick={()=>setTool(key)}><Icon size={19}/></button>;
 const focusTools=()=>itemsRef.current?.querySelectorAll<HTMLButtonElement>('.tool-items button');
 return <div ref={itemsRef} className={`toolbar ${expanded?'expanded':''} ${settings.left?'left':''}`} role="toolbar" aria-label={t('tools')} onPointerEnter={()=>change(true)} onPointerLeave={e=>{if(!e.currentTarget.querySelector(':focus-visible'))change(false)}} onFocus={e=>{clearTimeout(timer.current);if(!(e.target as Element).closest('.tool-trigger'))setOpen(true)}} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node))change(false)}} onKeyDown={e=>{if(e.key==='Escape'){e.stopPropagation();clearTimeout(timer.current);setMore(false);setOpen(false);const trigger=e.currentTarget.querySelector<HTMLButtonElement>('.tool-trigger');requestAnimationFrame(()=>settings.pinned?focusTools()?.[0]?.focus():trigger?.focus())}if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)){e.preventDefault();e.stopPropagation();const buttons=Array.from(focusTools()??[]),index=buttons.indexOf(document.activeElement as HTMLButtonElement);buttons[(index+(['ArrowLeft','ArrowUp'].includes(e.key)?buttons.length-1:1))%buttons.length]?.focus()}}}>
  <button aria-label={`${t('tools')}: ${t(tool)}`} title={t(tool)} aria-expanded={expanded} aria-hidden={expanded} tabIndex={expanded?-1:0} aria-controls={itemsId} className="tool-trigger active" onClick={()=>{clearTimeout(timer.current);setOpen(true);requestAnimationFrame(()=>focusTools()?.[0]?.focus())}}><ActiveIcon size={19}/></button>
  <div id={itemsId} className="tool-wings" aria-hidden={!expanded} inert={!expanded}>
  <div className="tool-reveal tool-wing-before"><div className="tool-items">{basic.slice(0,7).map(toolButton)}</div></div>
  <div className="tool-reveal tool-wing-after"><div className="tool-items">{basic.slice(7).map(toolButton)}
  <button aria-label={t('snap')} title={t('snap')} aria-pressed={settings.snap!=='none'} className={settings.snap!=='none'?'active':''} tabIndex={expanded?0:-1} onClick={()=>setSettings({...settings,snap:settings.snap==='none'?'dataPoint':'none'})}><Magnet size={19}/></button>
  <button aria-label={t('analysis')} title={t('analysis')} tabIndex={expanded?0:-1} onClick={onAnalysis}><ChartNoAxesCombined size={19}/></button>
  <button aria-label={t('pin')} title={t('pin')} tabIndex={expanded?0:-1} aria-pressed={settings.pinned} className={settings.pinned?'active':''} onClick={()=>setSettings({...settings,pinned:!settings.pinned})}><Pin size={17}/></button>
  <button aria-label={t('moreTools')} title={t('moreTools')} aria-expanded={more} aria-controls={moreId} tabIndex={expanded?0:-1} onClick={()=>setMore(!more)}><Ellipsis size={19}/></button>
  </div></div></div>
  {more&&<div id={moreId} className="tool-more">{additional.map(([key,Icon])=><button key={key} aria-pressed={tool===key} onClick={()=>{setTool(key);setMore(false)}}><Icon size={18}/>{t(key)}</button>)}<button onClick={()=>{setMore(false);showSymbols()}}><Omega size={18}/>{t('symbols')}</button><button onClick={()=>setSettings({...settings,left:!settings.left})}>{t('leftToolbar')}</button></div>}
 </div>
}
