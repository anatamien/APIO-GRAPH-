import {useEffect,useMemo,useRef,useState,type ReactNode} from 'react';
import {PanelRightClose,PanelRightOpen} from 'lucide-react';
import {addTranslations} from './i18n';
import {frameQueue} from '../domain/frameQueue';
addTranslations({collapsePanel:['Свернуть панель','Collapse panel'],expandPanel:['Развернуть панель','Expand panel'],movePanel:['Перемещение панели: стрелки; Esc — закрепить справа','Move panel: arrow keys; Esc docks on the right']});
export type T=(key:string)=>string;
export function Field({label,children}:{label:string;children:ReactNode}){return <label className="field"><span>{label}</span>{children}</label>}
export function NumberField({label,value,onChange,min,max,step='any',precision}:{label:string;value:number;onChange:(n:number)=>void;min?:number;max?:number;step?:number|'any';precision?:number}){
 const [draft,setDraft]=useState(String(value)),[bad,setBad]=useState(false);
 useEffect(()=>{setDraft(String(value));setBad(false)},[value]);
 const commit=(text:string,showError=false)=>{const parsed=Number(text),n=precision===undefined?parsed:Number(parsed.toFixed(precision)),valid=text.trim()!==''&&Number.isFinite(n)&&(min===undefined||n>=min)&&(max===undefined||n<=max);if(showError||valid)setBad(!valid);if(valid){if(n!==parsed)setDraft(String(n));if(n!==value)onChange(n)}};
 return <Field label={label}><input aria-label={label} type="number" value={draft} min={min} max={max} step={step} aria-invalid={bad} onChange={e=>{setDraft(e.target.value);commit(e.target.value)}} onBlur={()=>commit(draft,true)} onKeyDown={e=>{if(e.key==='Enter')e.currentTarget.blur();if(e.key==='Escape'){setDraft(String(value));setBad(false)}}}/></Field>
}
export function Check({label,value,onChange}:{label:string;value:boolean;onChange:(n:boolean)=>void}){return <label className="check"><input type="checkbox" checked={value} onChange={e=>onChange(e.target.checked)}/><span>{label}</span></label>}
export function Select({label,value,items,onChange}:{label:string;value:string;items:[string,string][];onChange:(v:string)=>void}){return <Field label={label}><select aria-label={label} value={value} onChange={e=>onChange(e.target.value)}>{items.map(([key,text])=><option key={key} value={key}>{text}</option>)}</select></Field>}
export function SegmentControl({label,value,items,onChange}:{label:string;value:string;items:[string,string][];onChange:(v:string)=>void}){
 return <div className="segment-field"><span>{label}</span><div className="segments" role="radiogroup" aria-label={label} onKeyDown={e=>{const step=e.key==='ArrowLeft'||e.key==='ArrowUp'?-1:e.key==='ArrowRight'||e.key==='ArrowDown'?1:0;if(!step&&e.key!=='Home'&&e.key!=='End')return;e.preventDefault();e.stopPropagation();const index=e.key==='Home'?0:e.key==='End'?items.length-1:(items.findIndex(([k])=>k===value)+step+items.length)%items.length;onChange(items[index][0]);e.currentTarget.querySelectorAll<HTMLButtonElement>('button')[index]?.focus()}}>{items.map(([key,text])=><button type="button" role="radio" aria-checked={key===value} tabIndex={key===value?0:-1} key={key} onClick={()=>onChange(key)}>{text}</button>)}</div></div>;
}
export function Panel({title,onClose,t,children,className=''}:{title:string;onClose:()=>void;t:T;children:ReactNode;className?:string}){
 const node=useRef<HTMLElement>(null),drag=useRef<{x:number;y:number;left:number;top:number}|null>(null);
 const [position,setPosition]=useState<{left:number;top:number}|null>(null);
 const positionRef=useRef(position),bounds=useRef({width:0,height:0,panelWidth:0,panelHeight:0});
 const place=(value:typeof position)=>{positionRef.current=value;setPosition(value)};
 const frames=useMemo(()=>frameQueue<{left:number;top:number}>(value=>{positionRef.current=value;setPosition(value)}),[]);
 const [collapsed,setCollapsed]=useState(false);
 const measure=()=>{const n=node.current,parent=n?.parentElement;if(n&&parent)bounds.current={width:parent.clientWidth,height:parent.clientHeight,panelWidth:n.offsetWidth,panelHeight:n.offsetHeight}};
 const clamp=(left:number,top:number)=>{const b=bounds.current;return {left:Math.max(0,Math.min(b.width-b.panelWidth,left)),top:Math.max(0,Math.min(b.height-b.panelHeight,top))}};
 useEffect(()=>{const n=node.current,parent=n?.parentElement;if(!n||!parent)return;const observer=new ResizeObserver(()=>{measure();setPosition(pos=>{if(!pos)return pos;const next=clamp(pos.left,pos.top);positionRef.current=next;return next.left===pos.left&&next.top===pos.top?pos:next})});observer.observe(parent);observer.observe(n);return()=>{frames.cancel();observer.disconnect()}},[frames]);
 useEffect(()=>{measure();setPosition(pos=>{const next=pos?clamp(pos.left,pos.top):pos;positionRef.current=next;return next})},[collapsed]);
 const toggleCollapsed=()=>{const n=node.current;if(n&&!position)place({left:n.offsetLeft,top:n.offsetTop});setCollapsed(value=>!value)};
 return <section ref={node} className={`panel ${className} ${position?'floating':''} ${collapsed?'collapsed':''}`} data-docked={!position} data-collapsed={collapsed} aria-label={title} style={position?{left:0,top:0,right:'auto',bottom:'auto',transform:`translate(${position.left}px,${position.top}px)`}:undefined}>
  <div className="panel-header draggable" tabIndex={0} aria-label={`${title}. ${t('movePanel')}`} onKeyDown={e=>{if(e.target!==e.currentTarget)return;if(e.key==='Escape'){e.preventDefault();e.stopPropagation();frames.cancel();drag.current=null;place(null)}if(e.key.startsWith('Arrow')){e.preventDefault();e.stopPropagation();const n=node.current;if(n){measure();const pos=positionRef.current??{left:n.offsetLeft,top:n.offsetTop};place(clamp(pos.left+(e.key==='ArrowLeft'?-16:e.key==='ArrowRight'?16:0),pos.top+(e.key==='ArrowUp'?-16:e.key==='ArrowDown'?16:0)))}}}}
   onPointerDown={e=>{if(e.button!==0||(e.target as Element).closest('button'))return;const n=node.current!;measure();const pos=positionRef.current??{left:n.offsetLeft,top:n.offsetTop};drag.current={x:e.clientX,y:e.clientY,...pos};e.currentTarget.setPointerCapture(e.pointerId)}}
   onPointerMove={e=>{const d=drag.current;if(d&&Math.hypot(e.clientX-d.x,e.clientY-d.y)>3)frames.push(clamp(d.left+e.clientX-d.x,d.top+e.clientY-d.y))}}
   onPointerUp={e=>{const d=drag.current;if(!d)return;if(Math.hypot(e.clientX-d.x,e.clientY-d.y)>3)frames.flush(clamp(d.left+e.clientX-d.x,d.top+e.clientY-d.y));else frames.cancel();drag.current=null;if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId)}} onPointerCancel={()=>{frames.cancel();drag.current=null}} onLostPointerCapture={()=>{frames.cancel();drag.current=null}}>
   <h2>{title}</h2><div className="panel-actions"><button title={t(collapsed?'expandPanel':'collapsePanel')} aria-label={t(collapsed?'expandPanel':'collapsePanel')} aria-expanded={!collapsed} onClick={toggleCollapsed}>{collapsed?<PanelRightClose size={16}/>:<PanelRightOpen size={16}/>}</button><button title={t('close')} aria-label={t('close')} onClick={onClose}>×</button></div>
  </div><div className="panel-body" hidden={collapsed} inert={collapsed}>{children}</div></section>
}
