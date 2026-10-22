import {useRef,useState} from 'react';
import type {TextPart} from '../../domain/model';
import {formatTextRange,replaceText} from '../../domain/textEditing';
import {Field,type T} from '../../app/controls';
import {addTranslations} from '../../app/i18n';
addTranslations({subscript:['Нижний индекс','Subscript'],superscript:['Верхний индекс','Superscript'],normalText:['Обычный текст','Normal text'],selectedFormatting:['Формат выделенного текста','Selected text format'],selectTextHint:['Выделите символы, затем выберите индекс, жирный или курсив.','Select characters, then choose subscript, superscript, bold or italic.']});
export function TextEditor({parts,onChange,t}:{parts:TextPart[];onChange:(parts:TextPart[])=>void;t:T}){
 const node=useRef<HTMLTextAreaElement>(null),[selection,setSelection]=useState({start:0,end:0}),text=parts.map(p=>p.text).join('');
 const remember=()=>{const el=node.current;if(el)setSelection({start:el.selectionStart,end:el.selectionEnd})};
 const selected:TextPart[]=[];let offset=0;for(const p of parts){if(offset<selection.end&&offset+p.text.length>selection.start)selected.push(p);offset+=p.text.length}
 const apply=(patch:Partial<Pick<TextPart,'baseline'|'bold'|'italic'>>)=>{onChange(formatTextRange(parts,selection.start,selection.end,patch));requestAnimationFrame(()=>{node.current?.focus();node.current?.setSelectionRange(selection.start,selection.end)})};
 return <section className="text-editor"><Field label={t('content')}><textarea ref={node} aria-label={t('content')} value={text} onSelect={remember} onKeyUp={remember} onMouseUp={remember} onBlur={remember} onChange={e=>{onChange(replaceText(parts,e.target.value));remember()}} onKeyDown={e=>{if((e.ctrlKey||e.metaKey)&&['b','i'].includes(e.key.toLowerCase())){e.preventDefault();e.stopPropagation();const k=e.key.toLowerCase()==='b'?'bold':'italic';apply({[k]:!selected.every(p=>p[k])})}}}/></Field>
  <div className="text-format-tools" role="toolbar" aria-label={t('selectedFormatting')}>
   {(['sub','super','normal'] as const).map((baseline,i)=><button type="button" key={baseline} disabled={selection.start===selection.end} aria-label={t(['subscript','superscript','normalText'][i])} title={t(['subscript','superscript','normalText'][i])} aria-pressed={selected.length>0&&selected.every(p=>p.baseline===baseline)} onMouseDown={e=>e.preventDefault()} onClick={()=>apply({baseline})}>{['x₂','x²','x'][i]}</button>)}
   {(['bold','italic'] as const).map(key=><button type="button" key={key} disabled={selection.start===selection.end} aria-label={t(key)} title={t(key)} aria-pressed={selected.length>0&&selected.every(p=>p[key])} onMouseDown={e=>e.preventDefault()} onClick={()=>apply({[key]:!selected.every(p=>p[key])})} style={{fontWeight:key==='bold'?700:400,fontStyle:key==='italic'?'italic':undefined}}>{key==='bold'?'B':'I'}</button>)}
  </div><p className="muted">{t('selectTextHint')}</p>
 </section>;
}
