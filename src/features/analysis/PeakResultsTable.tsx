import {useEffect,useRef,useState,type KeyboardEvent,type MouseEvent} from 'react';
import type {PeakMeasurement} from '../../domain/signalTypes';
import type {T} from '../../app/controls';
import {saveDataTable} from '../../platform/files';
import './signalTranslations';
export function peakTableText(peaks:readonly PeakMeasurement[],separator:'\t'|','='\t',rowNumbers?:readonly number[]):string{
 const num=(v:number|null)=>v===null?'':Object.is(v,-0)?'-0':String(v);
 const header=['number','X','Y','direction','prominence','width','left','right','incomplete'];
 return [header.join(separator),...peaks.map((p,i)=>[String(rowNumbers?.[i]??i+1),num(p.x),num(p.y),p.direction,num(p.prominence),num(p.width),num(p.left),num(p.right),String(p.incomplete)].join(separator))].join('\r\n')+'\r\n';
}
export function PeakResultsTable({peaks,t,onReveal}:{peaks:readonly PeakMeasurement[];t:T;onReveal?:(peak:PeakMeasurement)=>void}){
 const [selected,setSelected]=useState<Set<number>>(new Set()),[active,setActive]=useState(0),[scroll,setScroll]=useState(0),[height,setHeight]=useState(200),[notice,setNotice]=useState('');
 const scroller=useRef<HTMLDivElement>(null),anchor=useRef(0),rowHeight=32;
 useEffect(()=>{setSelected(new Set());setActive(0);setScroll(0);if(scroller.current)scroller.current.scrollTop=0},[peaks]);
 useEffect(()=>{const el=scroller.current;if(!el)return;const observer=new ResizeObserver(()=>setHeight(el.clientHeight));observer.observe(el);return()=>observer.disconnect()},[]);
 const first=Math.max(0,Math.floor(scroll/rowHeight)-2),last=Math.min(peaks.length,first+Math.ceil(height/rowHeight)+5);
 function pick(index:number,e?:Pick<MouseEvent,'shiftKey'|'ctrlKey'|'metaKey'>){
  setActive(index);setSelected(old=>{if(e?.shiftKey){const next=new Set(old);for(let i=Math.min(index,anchor.current);i<=Math.max(index,anchor.current);i++)next.add(i);return next}anchor.current=index;if(e?.ctrlKey||e?.metaKey){const next=new Set(old);if(next.has(index))next.delete(index);else next.add(index);return next}return new Set([index])});onReveal?.(peaks[index]);
 }
 const chosen=()=>selected.size?peaks.filter((_,i)=>selected.has(i)):peaks;
 async function copy(){try{const numbers=selected.size?[...selected].sort((a,b)=>a-b).map(i=>i+1):undefined;await navigator.clipboard.writeText(peakTableText(chosen(),'\t',numbers));setNotice(t('signal.copied'))}catch{setNotice(t('table.copyError'))}}
 async function save(extension:'csv'|'tsv'){try{await saveDataTable(new TextEncoder().encode(peakTableText(peaks,extension==='csv'?',':'\t')),extension)}catch(error){setNotice(String(error))}}
 function keyboard(e:KeyboardEvent){
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='c'){e.preventDefault();e.stopPropagation();void copy();return}
  let next=active;if(e.key==='ArrowDown')next=Math.min(peaks.length-1,active+1);else if(e.key==='ArrowUp')next=Math.max(0,active-1);else if(e.key==='Home')next=0;else if(e.key==='End')next=peaks.length-1;else return;
  e.preventDefault();e.stopPropagation();if(next<0)return;pick(next);const node=scroller.current;if(node){const top=next*rowHeight;if(top<node.scrollTop)node.scrollTop=top;else if(top+rowHeight>node.scrollTop+node.clientHeight-30)node.scrollTop=top+rowHeight-node.clientHeight+30}
 }
 const value=(n:number|null)=>n===null?t('undefined'):Object.is(n,-0)?'-0':String(n);
 return <section className="peak-results" aria-label={t('signal.peakTable')}>
  <h3>{t('signal.peakTable')} · {peaks.length}</h3>
  <p className="analysis-note">{t('signal.selectionHint')}</p>
  <div className="peak-commands"><button onClick={()=>setSelected(new Set(peaks.map((_,i)=>i)))}>{t('signal.selectAll')}</button><button disabled={!selected.size} onClick={()=>setSelected(new Set())}>{t('signal.clearSelection')}</button></div>
  <div className="peak-table-scroll" ref={scroller} tabIndex={0} onKeyDown={keyboard} onScroll={e=>setScroll(e.currentTarget.scrollTop)}>
   <table aria-label={t('signal.peakTable')}><thead><tr>{['#','X','Y',t('signal.direction'),t('signal.peakProminence'),t('signal.width'),t('signal.left'),t('signal.right')].map((label,i)=><th key={i}>{label}</th>)}</tr></thead><tbody>
    {first>0&&<tr aria-hidden="true" style={{height:first*rowHeight}}><td colSpan={8}/></tr>}
    {peaks.slice(first,last).map((p,offset)=>{const i=first+offset;return <tr key={i} data-peak-index={i} aria-selected={selected.has(i)} onClick={e=>pick(i,e)} title={p.incomplete?t('signal.incompleteHint'):undefined}><td>{i+1}</td><td>{value(p.x)}</td><td>{value(p.y)}</td><td>{t(p.direction==='min'?'signal.min':'signal.max')}</td><td>{value(p.prominence)}</td><td>{value(p.width)}</td><td>{value(p.left)}</td><td>{value(p.right)}</td></tr>})}
    {last<peaks.length&&<tr aria-hidden="true" style={{height:(peaks.length-last)*rowHeight}}><td colSpan={8}/></tr>}
   </tbody></table>
  </div>
  <div className="peak-commands"><button disabled={!peaks.length} onClick={()=>void copy()}>{t('signal.copy')}</button><button disabled={!peaks.length} onClick={()=>void save('csv')}>{t('signal.exportCsv')}</button><button disabled={!peaks.length} onClick={()=>void save('tsv')}>{t('signal.exportTsv')}</button></div>
  {!!selected.size&&<small className="muted">{selected.size} / {peaks.length}</small>}{notice&&<p role="status" className="analysis-note">{notice}</p>}
 </section>;
}
