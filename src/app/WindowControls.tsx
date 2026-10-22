import {useEffect,useState} from 'react';
import {Minus,Square,Copy,X} from 'lucide-react';
import {isDesktop} from '../platform/files';
import {addTranslations} from './i18n';
import type {T} from './controls';
addTranslations({minimizeWindow:['Свернуть окно','Minimize window'],maximizeWindow:['Развернуть окно','Maximize window'],restoreWindow:['Восстановить размер окна','Restore window'],closeWindow:['Закрыть окно','Close window']});
export const macDesktop=()=>isDesktop()&&/Mac/.test(navigator.platform);
export function WindowControls({t,onError,compact=false}:{t:T;onError:(error:string)=>void;compact?:boolean}){
 const [maximized,setMaximized]=useState(false);
 useEffect(()=>{if(!isDesktop())return;let off:(()=>void)|undefined,disposed=false;void import('@tauri-apps/api/window').then(async({getCurrentWindow})=>{const win=getCurrentWindow();setMaximized(await win.isMaximized());const unlisten=await win.onResized(()=>void win.isMaximized().then(setMaximized));if(disposed)unlisten();else off=unlisten}).catch(e=>onError(String(e)));return()=>{disposed=true;off?.()}},[onError]);
 if(!isDesktop()||macDesktop())return null;
 const act=(action:'minimize'|'toggleMaximize'|'close')=>void import('@tauri-apps/api/window').then(m=>m.getCurrentWindow()[action]()).catch(e=>onError(String(e)));
 return <div className="window-controls"><button aria-label={t('minimizeWindow')} title={t('minimizeWindow')} onClick={()=>act('minimize')}><Minus size={16}/></button>{!compact&&<button aria-label={t(maximized?'restoreWindow':'maximizeWindow')} title={t(maximized?'restoreWindow':'maximizeWindow')} onClick={()=>act('toggleMaximize')}>{maximized?<Copy size={14}/>:<Square size={14}/>}</button>}<button className="window-close" aria-label={t('closeWindow')} title={t('closeWindow')} onClick={()=>act('close')}><X size={18}/></button></div>
}
