import {useEffect,useRef,useState} from 'react';
import {Copy,Send} from 'lucide-react';
import type {T} from '../../app/controls';
import {addTranslations} from '../../app/i18n';
addTranslations({axisPrevious:['Из предыдущей вкладки','From previous tab'],axisPreviousError:['Не удалось прочитать подпись из выбранной вкладки.','Could not read the label from that tab.'],objectDestination:['Отправить во вкладку','Send to tab'],objectSendCopy:['Отправить копию','Send a copy'],objectChooseTab:['Выберите вкладку','Choose a tab'],objectSendHint:['Копия независима; исходный объект останется в этой вкладке.','The copy is independent; the original stays in this tab.'],objectSendError:['Не удалось отправить объект в выбранную вкладку.','Could not send the object to the selected tab.'],objectTabReadOnly:['только просмотр','read only']});
export interface AxisLabelSource {name:string;read:(axis:'x'|'y')=>Promise<string>}
export function AxisCopyButton({axis,source,onApply,t,disabled=false}:{axis:'x'|'y';source?:AxisLabelSource;onApply:(label:string)=>void;t:T;disabled?:boolean}){
 const [busy,setBusy]=useState(false),[error,setError]=useState(false),alive=useRef(true);useEffect(()=>{alive.current=true;return()=>{alive.current=false}},[]);
 return <><button type="button" className="axis-copy-button" disabled={!source||disabled||busy} title={source?`${t('axisPrevious')}: ${source.name}`:t('axisPrevious')} onClick={()=>{if(!source)return;setBusy(true);setError(false);void source.read(axis).then(label=>{if(alive.current)onApply(label)}).catch(()=>{if(alive.current)setError(true)}).finally(()=>{if(alive.current)setBusy(false)})}}><Copy size={14}/>{t('axisPrevious')}</button>{error&&<small role="alert">{t('axisPreviousError')}</small>}</>;
}
export interface ObjectDestination {id:string;name:string;disabled:boolean}
export interface ObjectTransferProps {destinations?:ObjectDestination[];onSendObject?:(objectId:string,tabId:string)=>Promise<void>}
export function ObjectTransfer({objectId,destinations,onSendObject,t}:ObjectTransferProps&{objectId:string;t:T}){
 const [tab,setTab]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState(false),alive=useRef(true);useEffect(()=>{alive.current=true;return()=>{alive.current=false}},[]);
 if(!onSendObject||!destinations)return null;
 return <details className="object-transfer"><summary>{t('objectDestination')}</summary><p className="muted">{t('objectSendHint')}</p><div className="row"><select aria-label={t('objectDestination')} value={tab} onChange={e=>setTab(e.target.value)}><option value="">{t('objectChooseTab')}</option>{destinations.map(d=><option key={d.id} value={d.id} disabled={d.disabled}>{d.name}{d.disabled?` · ${t('objectTabReadOnly')}`:''}</option>)}</select><button type="button" disabled={!tab||busy} title={t('objectSendCopy')} aria-label={t('objectSendCopy')} onClick={()=>{setBusy(true);setError(false);void onSendObject(objectId,tab).catch(()=>{if(alive.current)setError(true)}).finally(()=>{if(alive.current)setBusy(false)})}}><Send size={16}/></button></div>{error&&<p role="alert">{t('objectSendError')}</p>}</details>;
}
