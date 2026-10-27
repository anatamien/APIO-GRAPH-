import {TABLE_CELL_MIME,readTableCells} from '../../domain/tableClipboard';
import {useEffect,useLayoutEffect,useRef,useState,useId,type CSSProperties} from 'react';
import type {TextPart} from '../../domain/model';
import type {T} from '../../app/controls';
import {TextEditor} from '../inspector/TextEditor';
/** The editor occupies the cell itself; formatting uses the same rich runs as SVG/export. */
export function TableCellEditor({parts:initial,style,t,onCommit,onCancel,onNext,onPasteCells,onProperties,propertiesOpen}:{parts:TextPart[];style:CSSProperties;t:T;onCommit:(parts:TextPart[],enter?:boolean)=>void;onCancel:()=>void;onNext:(parts:TextPart[],direction:number)=>void;onPasteCells:(plain:string,rich:string)=>void;onProperties:()=>void;propertiesOpen:boolean}){
 const obscuredBy=useId();
 useLayoutEffect(()=>{if(!propertiesOpen)return;const panel=document.querySelector<HTMLElement>('.table-inspector'),editor=host.current;if(!panel||!editor)return;const measure=()=>{const a=editor.getBoundingClientRect(),b=panel.getBoundingClientRect(),overlap=Math.min(a.right,b.right)>Math.max(a.left,b.left)&&Math.min(a.bottom,b.bottom)>Math.max(a.top,b.top);if(overlap){panel.dataset.cellEditorObscured=obscuredBy;panel.inert=true}else if(panel.dataset.cellEditorObscured===obscuredBy){delete panel.dataset.cellEditorObscured;panel.inert=false}};measure();const observer=new ResizeObserver(measure);observer.observe(editor);observer.observe(panel);window.addEventListener('resize',measure);return()=>{observer.disconnect();window.removeEventListener('resize',measure);if(panel.dataset.cellEditorObscured===obscuredBy){delete panel.dataset.cellEditorObscured;panel.inert=false}}},[propertiesOpen]);
 const [parts,setParts]=useState(initial),host=useRef<HTMLDivElement>(null),draft=useRef(initial),finished=useRef(false),past=useRef<TextPart[][]>([]),future=useRef<TextPart[][]>([]);
 const update=(next:TextPart[])=>{if(JSON.stringify(next)===JSON.stringify(draft.current))return;past.current.push(draft.current);future.current=[];draft.current=next;setParts(next)};
 const commit=(enter=false)=>{if(finished.current)return;finished.current=true;onCommit(draft.current,enter)};
 useLayoutEffect(()=>{const input=host.current?.querySelector('textarea');input?.focus();input?.select()},[]);
 useEffect(()=>{const flush=()=>commit();window.addEventListener('apio:commit-editor',flush);return()=>window.removeEventListener('apio:commit-editor',flush)},[]);
 return <div ref={host} className="table-cell-editor" style={style} data-testid="table-cell-editor" onDoubleClick={e=>{e.stopPropagation();onProperties()}} onCopy={e=>{const input=host.current?.querySelector('textarea');if(input&&input.selectionStart===0&&input.selectionEnd===input.value.length){e.preventDefault();e.clipboardData.setData('text/plain',input.value);e.clipboardData.setData(TABLE_CELL_MIME,JSON.stringify({format:'APIO_TABLE_CELLS',version:1,rows:1,columns:1,cells:[draft.current]}))}}} onPaste={e=>{const rich=e.clipboardData.getData(TABLE_CELL_MIME),plain=e.clipboardData.getData('text/plain');if(rich){e.preventDefault();e.stopPropagation();try{const payload=readTableCells(rich);if(payload.rows===1&&payload.columns===1){update(payload.cells[0]);return}}catch{onPasteCells(plain,rich);return}finished.current=true;onPasteCells(plain,rich)}else if(plain.includes('\t')){e.preventDefault();e.stopPropagation();finished.current=true;onPasteCells(plain,'')}}} onPointerDown={e=>e.stopPropagation()} onMouseDown={e=>{if(!(e.target as Element).closest('textarea,input,button'))e.preventDefault()}} onBlur={e=>{if(e.currentTarget.contains(e.relatedTarget as Node)||e.relatedTarget instanceof Element&&e.relatedTarget.closest('.symbol-palette,.toolbar'))return;commit()}} onKeyDownCapture={e=>{
  if(e.nativeEvent.isComposing)return;
  if((e.ctrlKey||e.metaKey)&&(e.code==='KeyZ'||e.key.toLowerCase()==='z'||e.code==='KeyY')){
   e.preventDefault();e.stopPropagation();const redo=e.shiftKey||e.code==='KeyY',from=redo?future.current:past.current,to=redo?past.current:future.current,next=from.pop();
   if(next){to.push(draft.current);draft.current=next;setParts(next)}else if(!redo){finished.current=true;onCancel();window.dispatchEvent(new Event('apio:undo'))}return;
  }
  if(e.key==='Escape'){e.preventDefault();e.stopPropagation();finished.current=true;onCancel()}
  if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();e.stopPropagation();commit(true)}
  if(e.key==='Tab'){e.preventDefault();e.stopPropagation();finished.current=true;onNext(draft.current,e.shiftKey?-1:1)}
 }}><TextEditor parts={parts} onChange={update} t={t}/></div>;
}
