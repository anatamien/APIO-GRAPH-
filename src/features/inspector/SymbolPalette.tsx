import {useEffect,useRef,useState} from 'react';
import {Star,X} from 'lucide-react';
import type {T} from '../../app/controls';
import {addTranslations,type Language} from '../../app/i18n';
import {scientificSymbols,saveSymbolPreferences,symbolPreferences,SYMBOLS_EVENT,type SymbolGroup} from './symbols';
import './symbols.css';
addTranslations({symbols:['Символы','Symbols'],symbolSearch:['Поиск символа','Find symbol'],symbolGreek:['Греческие','Greek'],symbolMath:['Математика','Mathematics'],symbolUnits:['Единицы и знаки','Units and signs'],symbolArrows:['Стрелки','Arrows'],symbolRecent:['Недавние','Recent'],symbolFavorites:['Избранные','Favorites'],symbolFavorite:['Изменить избранные символы','Toggle favorite symbol'],copySymbol:['Скопировать символ','Copy symbol'],symbolCopied:['Символ скопирован','Symbol copied'],symbolSelect:['Выберите символ для копирования','Choose a symbol to copy'],symbolTarget:['Вставить в поле','Insert into field'],symbolPlainHint:['Индексы и начертание доступны в редакторе форматированного текста. В простых полях вставляется Unicode.','Subscripts and styling are available in the rich text editor. Plain fields accept Unicode.']});
type TextInput=HTMLInputElement|HTMLTextAreaElement;
function textInput(value:unknown):value is TextInput{return (value instanceof HTMLTextAreaElement||value instanceof HTMLInputElement&&['text','search','url','email','tel'].includes(value.type))&&!value.readOnly&&!value.disabled}
export function SymbolPalette({t,language}:{t:T;language:Language}){
 const [open,setOpen]=useState(false),[query,setQuery]=useState(''),[group,setGroup]=useState<SymbolGroup|'recent'|'favorites'>('greek'),[prefs,setPrefs]=useState(symbolPreferences),[chosen,setChosen]=useState(''),[status,setStatus]=useState(''),[position,setPosition]=useState({left:16,top:90});
 const panel=useRef<HTMLElement>(null),target=useRef<{input:TextInput;start:number;end:number}|null>(null);
 const remember=()=>{const el=document.activeElement;if(el instanceof Element&&el.closest('.symbol-palette'))return;if(textInput(el))target.current={input:el,start:el.selectionStart??el.value.length,end:el.selectionEnd??el.value.length};else if(el instanceof HTMLInputElement||el instanceof HTMLTextAreaElement)target.current=null};
 useEffect(()=>{
  const clearTarget=(event:PointerEvent)=>{if(event.target instanceof Element&&!textInput(event.target)&&!event.target.closest('.toolbar,.text-editor,.symbol-palette'))target.current=null};
  const show=()=>{remember();const rect=target.current?.input.isConnected?target.current.input.getBoundingClientRect():null,width=Math.min(360,innerWidth-32);setPosition({left:Math.max(16,Math.min(innerWidth-width-16,rect?(rect.left>width+28?rect.left-width-12:rect.right+12):innerWidth-width-16)),top:Math.max(60,Math.min(innerHeight-300,rect?.top??90))});setStatus('');setQuery('');setOpen(true)};
  document.addEventListener('pointerdown',clearTarget,true);document.addEventListener('focusin',remember);document.addEventListener('selectionchange',remember);document.addEventListener('select',remember,true);window.addEventListener(SYMBOLS_EVENT,show);
  return()=>{document.removeEventListener('pointerdown',clearTarget,true);document.removeEventListener('focusin',remember);document.removeEventListener('selectionchange',remember);document.removeEventListener('select',remember,true);window.removeEventListener(SYMBOLS_EVENT,show)};
 },[]);
 const close=()=>{setOpen(false);const current=target.current;if(current?.input.isConnected){current.input.focus();current.input.setSelectionRange(current.start,current.end)}};
 useEffect(()=>{if(!open)return;const escape=(e:KeyboardEvent)=>{if(e.key==='Escape'){e.preventDefault();e.stopImmediatePropagation();close()}};window.addEventListener('keydown',escape,true);return()=>window.removeEventListener('keydown',escape,true)},[open]);
 const changePrefs=(next:typeof prefs)=>{setPrefs(next);saveSymbolPreferences(next)};
 const insert=(value:string)=>{
  setChosen(value);const current=target.current;
  if(current?.input.isConnected&&textInput(current.input)){
   const {input,start,end}=current,next=input.value.slice(0,start)+value+input.value.slice(end),prototype=input instanceof HTMLTextAreaElement?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;
   Object.getOwnPropertyDescriptor(prototype,'value')!.set!.call(input,next);input.dispatchEvent(new Event('input',{bubbles:true}));target.current={input,start:start+value.length,end:start+value.length};changePrefs({...prefs,recent:[value,...prefs.recent.filter(s=>s!==value)].slice(0,16)});setOpen(false);requestAnimationFrame(()=>{if(input.isConnected){input.focus();input.setSelectionRange(start+value.length,start+value.length)}});
  }
 };
 if(!open)return null;
 const items=scientificSymbols.filter(s=>query?(s.value+s.ru+s.en).toLocaleLowerCase().includes(query.toLocaleLowerCase()):group==='recent'?prefs.recent.includes(s.value):group==='favorites'?prefs.favorites.includes(s.value):s.group===group),canInsert=!!target.current?.input.isConnected;
 return <div className="symbols-dismiss" onPointerDown={close}><section ref={panel} role="dialog" aria-label={t('symbols')} className="symbol-palette glass-menu" style={{left:position.left,top:position.top,right:'auto',maxHeight:`calc(100dvh - ${position.top+12}px)`}} onPointerDown={e=>e.stopPropagation()} onKeyDown={e=>{
  if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)&&!(e.target instanceof HTMLInputElement)){e.preventDefault();e.stopPropagation();const buttons=[...e.currentTarget.querySelectorAll<HTMLButtonElement>('.symbol-grid button')],index=buttons.indexOf(document.activeElement as HTMLButtonElement),delta=e.key==='ArrowLeft'?-1:e.key==='ArrowRight'?1:e.key==='ArrowUp'?-8:8;buttons[(index+delta+buttons.length)%buttons.length]?.focus()}
  if(e.key==='Enter'&&e.target instanceof HTMLInputElement&&items[0]){e.preventDefault();insert(items[0].value)}
 }}>
  <div className="symbol-header"><strong>{t('symbols')}</strong><button aria-label={t('close')} onClick={close}><X size={16}/></button></div>
  <input autoFocus aria-label={t('symbolSearch')} placeholder={t('symbolSearch')} value={query} onChange={e=>setQuery(e.target.value)}/>
  <select aria-label={t('symbols')} value={group} onChange={e=>{setGroup(e.target.value as typeof group);setQuery('')}}>{(['greek','math','units','arrows','recent','favorites'] as const).map((key,i)=><option key={key} value={key}>{t(['symbolGreek','symbolMath','symbolUnits','symbolArrows','symbolRecent','symbolFavorites'][i])}</option>)}</select>
  <p className="muted symbol-target">{canInsert?`${t('symbolTarget')}: ${target.current!.input.getAttribute('aria-label')??target.current!.input.closest('label')?.textContent??''}`:t('symbolSelect')}</p>
  <div className="symbol-grid" role="group" aria-label={t('symbols')}>{items.map(s=><button key={s.value} title={`${s.value} · ${s[language]}`} aria-label={`${s.value} · ${s[language]}`} onFocus={()=>setChosen(s.value)} onClick={()=>insert(s.value)}>{s.value}</button>)}</div>
  <div className="symbol-footer"><button disabled={!chosen} aria-label={t('symbolFavorite')} aria-pressed={prefs.favorites.includes(chosen)} onClick={()=>changePrefs({...prefs,favorites:prefs.favorites.includes(chosen)?prefs.favorites.filter(s=>s!==chosen):[...prefs.favorites,chosen]})}><Star size={16}/></button>{!canInsert&&<button disabled={!chosen} onClick={()=>void (async()=>{try{await navigator.clipboard.writeText(chosen);changePrefs({...prefs,recent:[chosen,...prefs.recent.filter(s=>s!==chosen)].slice(0,16)});setStatus(t('symbolCopied'))}catch{setStatus(chosen)}})()}>{t('copySymbol')}</button>}<span role="status" style={{userSelect:'text'}}>{status}</span></div><p className="muted">{t('symbolPlainHint')}</p>
 </section></div>;
}
