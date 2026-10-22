import {useEffect,useState} from 'react';
import {Palette} from 'lucide-react';
import type {T} from '../../app/controls';
import {addTranslations} from '../../app/i18n';
addTranslations({chooseColor:['Выбрать цвет','Choose color']});
const palette=['#252A30','#FFFFFF','#476E98','#698464','#C62828','#EF6C00','#9276A2','#41898E'];
export function ColorPicker({label,value,onChange,t}:{label:string;value:string;onChange:(c:string)=>void;t:T}){
 const [draft,setDraft]=useState(value),[error,setError]=useState(false),[recent,setRecent]=useState<string[]>(()=>{try{return JSON.parse(localStorage.getItem('apio.colors')??'[]')}catch{return []}});
 useEffect(()=>{setDraft(value);setError(false)},[value]);
 const apply=(s:string)=>{if(!/^#[0-9a-f]{6}$/i.test(s)){setError(true);return}const c=s.toUpperCase();if(c!==value.toUpperCase())onChange(c);setDraft(c);setError(false);const list=[c,...recent.filter(a=>a!==c)].slice(0,8);setRecent(list);localStorage.setItem('apio.colors',JSON.stringify(list))};
 const rgb=[1,3,5].map(i=>parseInt((/^#[0-9a-f]{6}$/i.test(draft)?draft:value).slice(i,i+2),16));
 return <fieldset className="color-picker"><legend>{label}</legend><div className="swatches">{palette.map(c=><button key={c} type="button" style={{background:c}} className={value.toUpperCase()===c?'selected':''} aria-label={`${label} ${c}`} title={c} onClick={()=>apply(c)}/>)}<label className="color-dialog-button" title={t('chooseColor')}><Palette size={17}/><input type="color" aria-label={`${label}: ${t('chooseColor')}`} value={value} onChange={e=>apply(e.target.value)}/></label></div>
  <details><summary><span>HEX / RGB</span> <span className="color-value" style={{borderColor:value}}>{value}</span></summary><div className="row"><input aria-label={`${label} HEX`} value={draft} aria-invalid={error} onChange={e=>setDraft(e.target.value)} onBlur={()=>apply(draft)} onKeyDown={e=>{if(e.key==='Enter')apply(draft);if(e.key==='Escape'){setDraft(value);setError(false)}}}/></div>
  <div className="row rgb">{rgb.map((v,i)=><label key={i}>{['R','G','B'][i]}<input aria-label={`${label} ${['R','G','B'][i]}`} type="number" min={0} max={255} defaultValue={v} key={`${i}-${value}`} onBlur={e=>{const n=Number(e.target.value);if(!Number.isInteger(n)||n<0||n>255){setError(true);return}const next=[...rgb];next[i]=n;apply('#'+next.map(a=>a.toString(16).padStart(2,'0')).join(''))}}/></label>)}</div>
  {error&&<p className="error">#RRGGBB · RGB 0…255</p>}{recent.length>0&&<div className="swatches recent" aria-label={t('recentColors')}>{recent.map(c=><button key={c} aria-label={`${t('recentColors')} ${c}`} title={c} style={{background:c}} onClick={()=>apply(c)}/>)}</div>}</details>
 </fieldset>
}
