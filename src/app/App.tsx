import {useCallback,useEffect,useRef,useState} from 'react';
import {FolderOpen,Upload,Table2,Save,Download,Settings2,Undo2,Redo2,Scan,History as HistoryIcon,ChevronDown,Plus,TriangleAlert,Sigma,ListTree,X} from 'lucide-react';
import {WindowControls,macDesktop} from './WindowControls';
import {setWindowLayout} from '../platform/window';
import {HistoryPanel} from '../features/history/HistoryPanel';
import {id,type ProjectDocument} from '../domain/model';
import {type Transform} from '../domain/commands';
import {Workspace,graphName,graphFilename,type GraphTab} from '../domain/workspace';
import {SeriesPanel} from '../features/inspector/SeriesPanel';
import {ObjectPanel} from '../features/inspector/ObjectPanel';
import {deserialize,validateProject,validateEdit} from '../domain/project';
import {serializeAsync,serializeBytesAsync,retainSerializationCache} from '../platform/serialization';
import {createCoordinates,textRotation} from '../domain/geometry';
import {editViewport} from '../domain/editViewport';
import {fitContent} from '../domain/fitContent';
import {translate,addTranslations} from './i18n';
import {errorMessage} from './errors';
import {loadSettings,saveSettings,type Settings} from '../features/settings/store';
import {SettingsPanel} from '../features/settings/SettingsPanel';
import {ChartCanvas} from '../features/chart/ChartCanvas';
import {ToolBar,toolKeys,type Tool} from '../features/tools/ToolBar';
import {ImportPanel} from '../features/import/ImportPanel';
import {EncodingPanel} from '../features/import/EncodingPanel';
import {decodeText} from '../features/import/parser';
import {DataTable} from '../features/table/DataTable';
import {Inspector} from '../features/inspector/Inspector';
import {ExportPanel} from '../features/export/ExportPanel';
import {AnalysisPanel} from '../features/analysis/AnalysisPanel';
import {openFile,saveProject,readRecovery,writeRecovery,clearRecovery,initialFile,isDesktop,onDroppedFile,type OpenedFile} from '../platform/files';
addTranslations({manual:['Вручную','Manual'],AddObject:['Создать объект','Add object'],MoveObject:['Переместить объект','Move object'],EditObject:['Изменить объект','Edit object'],RemoveObject:['Удалить объект','Remove object'],SetAxis:['Изменить ось','Change axis'],SetSeriesStyle:['Оформить серию','Style series'],ImportBatch:['Импорт данных','Import data'],EditPoint:['Изменить точку','Edit point'],pan:['Перемещение','Pan'],zoom:['Увеличить масштаб','Zoom in'],markers:['Исходные маркеры','Source markers'],CopyObject:['Дублировать объект','Duplicate object'],RemoveSeries:['Удалить серию','Remove series'],PageSize:['Размер страницы','Page size'],PagePadding:['Поля страницы','Page padding'],PageBackground:['Фон страницы','Page background'],ProjectTitle:['Название проекта','Project title'],Legend:['Легенда','Legend']});
addTranslations({welcome:['Научные графики из ваших данных','Scientific charts from your data'],openProject:['Открыть проект','Open project'],newHint:['Откройте TXT, CSV, TSV, вставьте таблицу или введите точки вручную.','Open TXT, CSV, TSV, paste a table or enter points manually.'],openData:['Открыть файл данных','Open data file'],pasteTable:['Вставить таблицу','Paste a table'],seriesProperties:['Свойства графика','Graph properties'],hiddenSeries:['скрыта','hidden'],back:['Назад','Back']});
addTranslations({fitTickLimit:['F9: заданный шаг делений не допускает такой диапазон. Увеличьте шаг или выберите автоматические деления оси.','F9: the explicit tick step cannot support this range. Increase the step or choose automatic axis ticks.'],saveOptions:['Варианты сохранения','Save options'],graph:['График','Graph'],openGraphs:['Открытые графики','Open graphs'],closeGraph:['Закрыть график','Close graph'],unsavedChanges:['Есть несохранённые изменения','Unsaved changes']});
type PanelName='objects'|'series'|'none'|'import'|'table'|'analysis'|'export'|'settings'|'history';
interface Decision {message:string;buttons:{key:string;text:string}[];resolve:(s:string)=>void}
export function App(){
 const workspace=useRef(new Workspace()),recoveryQueue=useRef(Promise.resolve());const [,refresh]=useState(0);const render=()=>refresh(n=>n+1);
 const active=workspace.current.active,history=active.history,readOnly=active.readOnly;
 const [settings,setSettingsState]=useState(loadSettings),[panel,setPanel]=useState<PanelName>('none'),[selection,setSelection]=useState<string[]>([]),[tool,setTool]=useState<Tool>('select'),[sourceText,setSourceText]=useState(''),[sourceName,setSourceName]=useState(''),[notice,setNotice]=useState(''),[error,setError]=useState(''),[saveMenu,setSaveMenu]=useState(false),[decision,setDecision]=useState<Decision|null>(null);
 const [encodingFile,setEncodingFile]=useState<OpenedFile|null>(null);
 const [importSource,setImportSource]=useState<'file'|'text'>('text');
 const [importDestination,setImportDestination]=useState<'new'|'append'>('new'),[importSession,setImportSession]=useState(0);
 const [importLocked,setImportLocked]=useState(false);
 const [welcome,setWelcome]=useState<'start'|'new'|null>('start'),[preview,setPreview]=useState<number|null>(null),[startupReady,setStartupReady]=useState(!isDesktop());
 const launcher=welcome!==null;
 const windowLayout=launcher?(panel==='import'||encodingFile?'data':'welcome'):'editor';
 useEffect(()=>{if(startupReady)void setWindowLayout(windowLayout).catch(e=>setError(String(e)))},[windowLayout,startupReady]);
 useEffect(()=>setPreview(null),[panel]);
 const inputFile=useRef<HTMLInputElement>(null),actions=useRef({save:async(_as=false,_tab?:GraphTab)=>false,load:async(_file:OpenedFile,_destination?:'new'|'append')=>{},canDiscard:async(_tab?:GraphTab)=>true,canCloseAll:async()=>true,closing:false});
 const p=history.current,t=translate(settings.language),dirty=history.dirty;
 const setSettings=(s:Settings)=>{setSettingsState(s);saveSettings(s)};
 const choose=useCallback((message:string,buttons:Decision['buttons'])=>{setStartupReady(true);return new Promise<string>(resolve=>setDecision({message,buttons,resolve}))},[]);
 const navigate=(viewport:ProjectDocument['viewport'])=>{if(preview!==null)return;history.navigate(viewport);render()};
 const fitGraph=()=>{setPreview(null);const canvas=document.querySelector<HTMLElement>('.chart-host'),box=canvas?.getBoundingClientRect(),docked=document.querySelector<HTMLElement>('.panel[data-docked=true]:not(.collapsed)')?.getBoundingClientRect();const current=history.current,next=fitContent(current,box?.width??p.page.widthPx,box?.height??p.page.heightPx,docked&&box&&docked.left>box.left?{right:docked.left-box.left}:{});if(next===current.viewport&&(current.axes.x.tickMode==='manual'||current.axes.y.tickMode==='manual')&&(current.series.some(s=>s.visible)||current.objects.some(o=>o.visible&&o.type!=='line')))setNotice(t('fitTickLimit'));history.navigate(next);render()};
 const onChange: (label:string,apply:Transform)=>void = (label,apply)=>{if(preview!==null)return;if(readOnly){setNotice(t('readOnly'));return}try{history.execute(label,q=>{const next=editViewport(q,apply(q),label);const result=validateEdit(q,next);if(result.errors.length)throw new Error(result.errors.join('\n'));return next});if(history.dirty)active.placeholder=false;setWelcome(null);render()}catch(e){setError(String(e))}};
 const undo=()=>{setPreview(null);history.undo();setSelection([]);render()},redo=()=>{setPreview(null);history.redo();setSelection([]);render()};
 const persistRecovery=()=>{
  const data=workspace.current.dirty?workspace.current.recoveryDocument():null,path=workspace.current.recoveryPath();
  const retained=data??workspace.current.recoveryDocument();
  const next=recoveryQueue.current.catch(()=>{}).then(async()=>{if(data)await writeRecovery(isDesktop()?await serializeBytesAsync(data):await serializeAsync(data),path);else{await retainSerializationCache(retained);await clearRecovery()}});recoveryQueue.current=next;return next;
 };
 const resetEditor=()=>{setWelcome(null);setPanel('none');setSelection([]);setPreview(null);setTool('select');setEncodingFile(null);setSaveMenu(false);setSourceText('');setSourceName('');render()};
 const switchTab=(tabId:string)=>{if(decision||workspace.current.activeId===tabId)return;workspace.current.activate(tabId);resetEditor()};
 const save=async(saveAs=false,target:GraphTab=active):Promise<boolean>=>{
  if(target.readOnly){setNotice(t('readOnly'));return false}
  try{const confirmSaved=target.history.saveCheckpoint(),q=target.history.current,output={...q,project:{...q.project,updatedAt:new Date().toISOString()}},bytes=isDesktop()?await serializeBytesAsync(output,true):await serializeAsync(output,true),path=await saveProject(bytes,target.path??graphFilename(target,t('graph')),saveAs);if(!path)return false;workspace.current.savedPath(target,path);target.placeholder=false;confirmSaved();await persistRecovery();setNotice(t('saved'));render();return true}catch(e){setError(String(e));return false}
 };
 const canDiscard=async(target:GraphTab=workspace.current.active)=>{if(!target.history.dirty||target.readOnly)return true;const answer=await choose(`${graphName(target,t('graph'))}\n${t('unsaved')}`,[{key:'save',text:t('save')},{key:'discard',text:t('discard')},{key:'cancel',text:t('cancel')}]);if(answer==='save')return await save(false,target)&&!target.history.dirty;return answer==='discard'};
 const canCloseAll=async()=>{const approved=new Map<GraphTab,ProjectDocument>();for(const tab of [...workspace.current.tabs]){if(!(await canDiscard(tab)))return false;approved.set(tab,tab.history.current)}const unchanged=()=>workspace.current.tabs.length===approved.size&&workspace.current.tabs.every(tab=>approved.get(tab)===tab.history.current);if(!unchanged())return false;actions.current.closing=true;try{await recoveryQueue.current.catch(()=>{});if(!unchanged()){actions.current.closing=false;return false}await clearRecovery();if(!unchanged()){actions.current.closing=false;await persistRecovery();return false}return true}catch(e){actions.current.closing=false;setError(String(e));return false}};
 const closeTab=async(tabId:string)=>{const tab=workspace.current.tabs.find(item=>item.id===tabId);if(!tab||!(await canDiscard(tab)))return;const wasActive=workspace.current.activeId===tabId;workspace.current.close(tabId);if(wasActive){resetEditor();if(workspace.current.active.placeholder)setWelcome('start')}try{await persistRecovery()}catch(e){setError(String(e))}render()};
 const load=async(file:OpenedFile,destination?:'new'|'append')=>{setEncodingFile(null);try{
  if(file.name.toLowerCase().endsWith('.aph')){
   const text=decodeText(file.bytes);let readonly=false;let result:ReturnType<typeof deserialize>;
   try{result=deserialize(text)}catch(e){const raw=JSON.parse(text) as ProjectDocument;if(!/^\d+\./.test(raw.schemaVersion)||parseInt(raw.schemaVersion)<=1)throw e;result=deserialize(JSON.stringify({...raw,schemaVersion:'1.0.0'}));readonly=true}
   if(result.warnings.some(w=>w.includes('MISSING_POINT'))||readonly){const answer=await choose(t('safeMode')+'\n'+result.warnings.map(w=>errorMessage(w,t)+'\n'+w).join('\n'),[{key:'open',text:t('open')},{key:'cancel',text:t('cancel')}]);if(answer!=='open')return;readonly=true}
   workspace.current.add(result.project,{path:file.path,readOnly:readonly});resetEditor();if(result.warnings.some(w=>w.includes('MANY_TICKS')))setNotice(t('manyTicks'));if(workspace.current.dirty)await persistRecovery();
  }else{setImportSource('file');if(destination)setImportDestination(destination);else if(panel!=='import'){setImportDestination('new');setImportLocked(false)}let decoded:string;try{decoded=decodeText(file.bytes)}catch{setPanel('none');setSelection([]);setEncodingFile(file);return}setSourceName(file.name);setSourceText(decoded);setPanel('import')}
 }catch(e){setError(`${file.name}: ${String(e)}`)}};
 actions.current={save,load,canDiscard,canCloseAll,closing:actions.current.closing};
 const open=async()=>{try{const file=await openFile('all');if(file)await actions.current.load(file)}catch(e){setError(String(e))}};
 const beginImport=(destination:'new'|'append'='new')=>{setImportLocked(destination==='append');setImportSource('text');setImportDestination(destination);setImportSession(n=>n+1);setSourceText('');setSourceName('');setPanel('import')};
 const newProject=()=>{setSelection([]);setPreview(null);if(launcher){setWelcome('new');setPanel('none')}else beginImport('new')};
 const openData=async(destination:'new'|'append'='new')=>{try{const file=await openFile('data');if(file){setImportLocked(destination==='append');setImportDestination(destination);setImportSession(n=>n+1);await actions.current.load(file,destination)}}catch(e){setError(String(e))}};
 const acceptImport=async(next:ProjectDocument)=>{
  if(next.project.id!==history.current.project.id){const validation=validateProject(next);if(validation.errors.length){setError(validation.errors.join('\n'));return}workspace.current.add(next,{dirty:true});resetEditor();try{await persistRecovery()}catch(e){setError(String(e))}}
  else{onChange('ImportBatch',()=>next);setWelcome(null);setPanel('none');setSelection([]);setPreview(null)}
 };
 const title=graphName(active,t('graph'));
 useEffect(()=>{const tab=document.getElementById(`graph-tab-${active.id}`),list=tab?.closest('.tab-list');const reveal=()=>tab?.scrollIntoView({block:'nearest',inline:'nearest'});reveal();const observer=new ResizeObserver(reveal);if(list)observer.observe(list);return()=>observer.disconnect()},[active.id]);
 useEffect(()=>{document.documentElement.lang=settings.language;document.documentElement.dataset.theme=settings.theme;document.documentElement.dataset.motion=settings.animations?'on':'off';document.documentElement.dataset.ui=settings.largeUI?'large':'normal'},[settings]);
 useEffect(()=>{document.title=`${dirty?'• ':''}${title} — APIO GRAPH`;if(isDesktop())void import('@tauri-apps/api/window').then(m=>m.getCurrentWindow().setTitle(document.title)).catch(e=>setError(String(e)))},[dirty,title]);
 useEffect(()=>{if(!notice)return;const timer=setTimeout(()=>setNotice(''),5000);return()=>clearTimeout(timer)},[notice]);
 useEffect(()=>{
  let disposed=false;const unlisten:(()=>void)[]=[];
  const autosave=()=>{if(workspace.current.dirty&&!actions.current.closing)try{void persistRecovery().catch(e=>setError(String(e)))}catch(e){setError(String(e))}};
  const timer=setInterval(autosave,120000),blur=()=>autosave();window.addEventListener('blur',blur);
  const before=(e:BeforeUnloadEvent)=>{if(workspace.current.dirty&&!isDesktop()){e.preventDefault();e.returnValue=''}};window.addEventListener('beforeunload',before);
  if(isDesktop()){
   void onDroppedFile(file=>actions.current.load(file),e=>setError(String(e))).then(off=>{if(disposed)off();else unlisten.push(off)});
   void import('@tauri-apps/api/window').then(async m=>{const off=await m.getCurrentWindow().onCloseRequested(async e=>{e.preventDefault();if(await actions.current.canCloseAll())try{await m.getCurrentWindow().destroy()}catch(e){actions.current.closing=false;setError(String(e))}});if(disposed)off();else unlisten.push(off)});
   void import('@tauri-apps/api/event').then(async m=>{const off=await m.listen('apio://open-file',async()=>{const f=await initialFile();if(f)await actions.current.load(f)});if(disposed)off();else unlisten.push(off)});
  }
  return()=>{disposed=true;clearInterval(timer);window.removeEventListener('blur',blur);window.removeEventListener('beforeunload',before);unlisten.forEach(off=>off())};
 },[]);
 useEffect(()=>{let active=true;void (async()=>{try{const startup=await initialFile();if(startup){if(active)await actions.current.load(startup);return}const recovery=await readRecovery();if(!active||!recovery)return;setStartupReady(true);const answer=await choose(translate(loadSettings().language)('recovery'),[{key:'restore',text:translate(loadSettings().language)('restore')},{key:'discard',text:translate(loadSettings().language)('discard')}]);if(answer==='restore'){workspace.current.restore(recovery.text,recovery.path);resetEditor()}else await clearRecovery()}catch(e){setError(String(e))}finally{if(active)setStartupReady(true)}})();return()=>{active=false}},[choose]);
 useEffect(()=>{
  const keyboard=(e:KeyboardEvent)=>{
   const editing=e.target instanceof HTMLElement&&!!e.target.closest('input,textarea,select,[contenteditable]');const mod=e.ctrlKey||e.metaKey;
   if(e.key==='Escape'&&encodingFile){e.preventDefault();setEncodingFile(null);return}
   if(decision)return;
   if(mod&&e.key.toLowerCase()==='w'&&!launcher){e.preventDefault();void closeTab(active.id);return}
   if(mod&&e.key==='Tab'&&!launcher){e.preventDefault();const tabs=workspace.current.tabs,index=tabs.findIndex(tab=>tab.id===active.id);switchTab(tabs[(index+(e.shiftKey?tabs.length-1:1))%tabs.length].id);return}
   if(preview!==null){if(e.key==='Escape'){e.preventDefault();setPreview(null)}return}
   if(mod&&e.key.toLowerCase()==='s'){e.preventDefault();void save(e.shiftKey);return}
   if(e.key==='F9'&&!launcher&&!decision){e.preventDefault();fitGraph();return}
   if(launcher){if(mod&&e.key.toLowerCase()==='o'){e.preventDefault();void open()}return}
   if(editing)return;
   if(mod){const key=e.key.toLowerCase();if(['o','z','y','d','c'].includes(key))e.preventDefault();if(key==='o')void open();if(key==='z'){if(e.shiftKey)redo();else undo();}if(key==='y')redo();if(key==='d')duplicate();if(key==='c'){const objs=p.objects.filter(o=>selection.includes(`object:${o.id}`));if(objs.length)void navigator.clipboard.writeText(JSON.stringify(objs))}return}
   if(e.key==='Escape'){setPanel('none');setSelection([]);setTool('select');return}
   if(toolKeys[e.key.toLowerCase()])setTool(toolKeys[e.key.toLowerCase()]);
   if(['Delete','Backspace'].includes(e.key)&&selection.length){e.preventDefault();onChange('RemoveObject',q=>({...q,objects:q.objects.filter(o=>!selection.includes(`object:${o.id}`))}));setSelection([])}
   if(e.key.startsWith('Arrow')&&selection.length){e.preventDefault();const c=createCoordinates(p,document.querySelector('.chart-host')?.clientWidth??1200,document.querySelector('.chart-host')?.clientHeight??800),step=e.shiftKey?10:1,dx=e.key==='ArrowLeft'?-step:e.key==='ArrowRight'?step:0,dy=e.key==='ArrowUp'?-step:e.key==='ArrowDown'?step:0;onChange('MoveObject',q=>({...q,objects:q.objects.map(o=>selection.includes(`object:${o.id}`)&&!o.locked?{...o,anchors:o.anchors.map((a,i)=>o.type==='callout'&&i===0?a:a.mode==='data'?{...a,x:a.x+c.x.invert(dx)-c.x.invert(0),y:a.y+c.y.invert(dy)-c.y.invert(0)}:a.mode==='point'?{...a,offsetXpx:a.offsetXpx+dx,offsetYpx:a.offsetYpx+dy}:{...a,pageX:Math.max(0,Math.min(1,a.pageX+dx/c.width)),pageY:Math.max(0,Math.min(1,a.pageY+dy/c.height))})}:o)}))}
  };
  const paste=(e:ClipboardEvent)=>{if(e.target instanceof HTMLElement&&e.target.closest('input,textarea,[contenteditable]'))return;const text=e.clipboardData?.getData('text/plain');if(text){e.preventDefault();setImportLocked(false);setImportSource('text');setSourceText(text);setSourceName(t('paste'));setImportDestination('new');setImportSession(n=>n+1);setPanel('import')}};
  window.addEventListener('keydown',keyboard);window.addEventListener('paste',paste);return()=>{window.removeEventListener('keydown',keyboard);window.removeEventListener('paste',paste)};
 });
 const duplicate=()=>{const selected=p.objects.filter(o=>selection.includes(`object:${o.id}`)),copies=selected.map(o=>({...structuredClone(o),id:id(),zIndex:p.objects.length+1}));onChange('CopyObject',q=>({...q,objects:[...q.objects,...copies],extensions:{...q.extensions,textRotation:{...(q.extensions.textRotation&&typeof q.extensions.textRotation==='object'?q.extensions.textRotation:{}),...Object.fromEntries(copies.map((copy,i)=>[copy.id,textRotation(q,selected[i].id)]))}}}));setSelection(copies.map(o=>`object:${o.id}`))};
 return <div className={`app ${launcher?'launcher':''}`} onDragOver={e=>e.preventDefault()} onDrop={e=>{e.preventDefault();const file=e.dataTransfer.files[0];if(file)void file.arrayBuffer().then(bytes=>actions.current.load({name:file.name,path:file.name,bytes:new Uint8Array(bytes)})).catch(e=>setError(String(e)))}}>
  {launcher?<div className={`launcher-titlebar ${macDesktop()?'mac-titlebar':''}`} data-tauri-drag-region><span>APIO GRAPH</span><select className="launcher-language" aria-label={t('language')} value={settings.language} onChange={e=>setSettings({...settings,language:e.target.value as Settings['language']})}><option value="ru">RU</option><option value="en">EN</option></select><WindowControls compact t={t} onError={setError}/></div>:<>
  <header className={`app-header ${macDesktop()?'mac-titlebar':''}`}>

   <div className="document-tabs">
    <div className="tab-list" role="tablist" aria-label={t('openGraphs')} onKeyDown={e=>{if(!(e.target as Element).closest('[role=tab]'))return;const tabs=workspace.current.tabs,focused=(e.target as Element).closest('[role=tab]')!.id.replace('graph-tab-',''),index=tabs.findIndex(tab=>tab.id===focused);let next=index;if(e.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;else if(e.key==='ArrowRight')next=(index+1)%tabs.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=tabs.length-1;else return;e.preventDefault();e.stopPropagation();switchTab(tabs[next].id);requestAnimationFrame(()=>document.getElementById(`graph-tab-${tabs[next].id}`)?.focus())}}>
     {workspace.current.tabs.map(tab=><div className="document-tab" key={tab.id} data-active={tab.id===active.id}><button className="project-name" role="tab" id={`graph-tab-${tab.id}`} aria-controls="graph-editor" aria-selected={tab.id===active.id} aria-label={graphName(tab,t('graph'))} aria-description={tab.history.dirty?t('unsavedChanges'):undefined} tabIndex={tab.id===active.id?0:-1} title={tab.path??graphName(tab,t('graph'))} onClick={()=>switchTab(tab.id)}><span>{graphName(tab,t('graph'))}</span>{tab.history.dirty&&<b className="dirty-dot" aria-hidden="true">•</b>}</button><button className="tab-close" aria-label={`${t('closeGraph')}: ${graphName(tab,t('graph'))}`} title={t('closeGraph')} onClick={()=>void closeTab(tab.id)}><X size={12}/></button></div>)}
    </div>
    <button className="new-project-button" aria-label={t('new')} title={t('new')} onClick={newProject}><Plus size={18}/></button>
   </div>
   <div className="header-spacer titlebar-drag" data-tauri-drag-region/>
   <button aria-label={t('undo')} title={t('undo')} disabled={!history.canUndo} onClick={undo}><Undo2 size={18}/></button><button aria-label={t('redo')} title={t('redo')} disabled={!history.canRedo} onClick={redo}><Redo2 size={18}/></button>
   <button aria-label={t('fit')} title={`${t('fit')} · F9`} onClick={fitGraph}><Scan size={18}/></button><button aria-label={t('history')} title={t('history')} onClick={()=>{setPreview(null);setPanel(panel==='history'?'none':'history')}}><HistoryIcon size={18}/></button><span className="header-divider"/>
   <button aria-label={t('open')} title={t('open')} onClick={()=>void open()}><FolderOpen size={18}/></button>
   <button aria-label={t('import')} title={t('import')} onClick={()=>beginImport()}><Upload size={18}/></button>
   <button aria-label={t('seriesProperties')} title={t('seriesProperties')} onClick={()=>setPanel(panel==='series'?'none':'series')}><ListTree size={18}/></button>
   <button aria-label={t('table')} title={t('table')} onClick={()=>setPanel(panel==='table'?'none':'table')}><Table2 size={18}/></button>
   <button aria-label={t('analysis')} title={t('analysis')} onClick={()=>setPanel(panel==='analysis'?'none':'analysis')}><Sigma size={18}/></button>
   <button aria-label={t('save')} title={t('save')} onClick={()=>void save()}><Save size={18}/></button><button className="save-options" aria-label={t('saveOptions')} title={t('saveAs')} aria-haspopup="menu" aria-expanded={saveMenu} onClick={()=>setSaveMenu(!saveMenu)}><ChevronDown size={12}/></button>
   <button aria-label={t('export')} title={t('export')} onClick={()=>setPanel('export')}><Download size={18}/></button>
   <button aria-label={t('settings')} title={t('settings')} onClick={()=>setPanel('settings')}><Settings2 size={18}/></button>
   {p.calculations.some(c=>c.status!=='valid')&&<button className="analysis-alert" aria-label={t('outdated')} title={t('outdated')} onClick={()=>setPanel('analysis')}><TriangleAlert size={18}/></button>}<WindowControls t={t} onError={setError}/>
  </header>
  {saveMenu&&<div className="menu-dismiss" onPointerDown={()=>setSaveMenu(false)}><div className="save-menu glass-menu" role="menu" aria-label={t('saveOptions')} onPointerDown={e=>e.stopPropagation()} onKeyDown={e=>{if(e.key==='Escape'){e.preventDefault();e.stopPropagation();setSaveMenu(false);document.querySelector<HTMLButtonElement>('.save-options')?.focus()}}}><button autoFocus role="menuitem" onClick={()=>{setSaveMenu(false);void save(true)}}>{t('saveAs')}</button></div></div>}
  </>}
  <main key={active.id} className={settings.left?'tools-left':undefined} id="graph-editor" role={launcher?undefined:'tabpanel'} aria-labelledby={launcher?undefined:`graph-tab-${active.id}`}>
   {launcher?<section className="welcome-screen" aria-label="APIO GRAPH"><div className="welcome-card"><h1>APIO GRAPH</h1><p>{t(welcome==='start'?'welcome':'newHint')}</p>{welcome==='start'?<div className="welcome-actions"><button className="primary" onClick={()=>void newProject()}><Plus size={20}/>{t('new')}</button><button onClick={()=>void open()}><FolderOpen size={20}/>{t('openProject')}</button></div>:<><div className="welcome-actions"><button className="primary" onClick={()=>void openData()}><FolderOpen size={20}/>{t('openData')}</button><button onClick={()=>beginImport('new')}><Upload size={20}/>{t('pasteTable')}</button><button onClick={()=>{setWelcome(null);setPanel('table')}}><Table2 size={20}/>{t('manual')}</button></div><button onClick={()=>setWelcome('start')}>{t('back')}</button></>}</div></section>:<>

   <ChartCanvas project={preview===null?p:history.snapshot(preview)??p} tool={tool} setTool={setTool} selection={preview===null?selection:[]} onSelect={s=>{setSelection(s);if(s.length)setPanel(s[0].startsWith('series:')?'series':'none')}} onChange={onChange} onNavigate={navigate} previewing={preview!==null} settings={settings} t={t} onImport={()=>beginImport()} onManual={()=>setPanel('table')} readOnly={readOnly||preview!==null}/>
   <ToolBar tool={tool} setTool={setTool} settings={settings} setSettings={setSettings} t={t} onAnalysis={()=>setPanel('analysis')}/>
   </>}
   {preview!==null&&panel==='history'&&<div className="history-preview-banner" role="status">{t('historyPreview')} · {history.steps[preview]?.number}<button onClick={()=>setPreview(null)}>{t('cancel')}</button></div>}
   {encodingFile&&<EncodingPanel file={encodingFile} t={t} onClose={()=>setEncodingFile(null)} onAccept={(decoded)=>{setSourceName(encodingFile.name);setSourceText(decoded);setEncodingFile(null);setPanel('import')}}/>}
   {panel==='import'&&<ImportPanel key={importSession} source={importSource} standalone={launcher} lockDestination={importLocked} initialDestination={launcher?'new':importDestination} text={sourceText} setText={setSourceText} name={sourceName} project={p} onFile={file=>actions.current.load(file)} onImport={next=>{void acceptImport(next)}} t={t} onClose={()=>setPanel('none')}/>}
   {panel==='objects'&&<ObjectPanel project={p} t={t} onChange={onChange} onClose={()=>setPanel('none')} onSelect={id=>{setSelection([`object:${id}`]);setPanel('none')}}/>}
   {panel==='series'&&<SeriesPanel onObjects={()=>setPanel('objects')} project={p} selectedId={selection.find(s=>s.startsWith('series:'))?.slice(7)} t={t} onChange={onChange} onSelect={seriesId=>setSelection([`series:${seriesId}`])} onClose={()=>setPanel('none')}/>}
   {panel==='table'&&<DataTable key={active.id} project={p} onChange={onChange} t={t} onProperties={id=>{setSelection([`series:${id}`]);setPanel('series')}} onAddData={source=>source==='file'?void openData('append'):beginImport('append')} onClose={()=>setPanel('none')}/>}
   {panel==='analysis'&&<AnalysisPanel project={p} onChange={onChange} t={t} onClose={()=>setPanel('none')}/>}
   {panel==='export'&&<ExportPanel project={p} t={t} onClose={()=>setPanel('none')} onMessage={setNotice}/>}
   {panel==='settings'&&<SettingsPanel project={p} onChange={onChange} settings={settings} setSettings={setSettings} t={t} onClose={()=>setPanel('none')}/>}
   {panel==='none'&&selection.length>0&&!selection[0].startsWith('series:')&&!readOnly&&<Inspector key={selection[0]} project={p} selection={selection[0]} onChange={onChange} t={t} onClose={()=>setSelection([])}/>}
   {panel==='history'&&<HistoryPanel history={history} preview={preview} onPreview={setPreview} onJump={index=>{history.jump(index);setPreview(null);setSelection([]);render()}} t={t} onClose={()=>{setPreview(null);setPanel('none')}}/>}

  </main>

  <input ref={inputFile} type="file" accept=".aph,.txt,.csv,.tsv" hidden onChange={e=>{const file=e.target.files?.[0];if(file)void file.arrayBuffer().then(bytes=>actions.current.load({name:file.name,path:file.name,bytes:new Uint8Array(bytes)}));e.currentTarget.value=''}}/>
  {notice&&<div className="toast" role="status">{notice}</div>}
  {error&&<div className="modal-backdrop"><section className="dialog" role="alertdialog" aria-label={t('error')}><h2>{t('error')}</h2><p>{errorMessage(error,t)}</p><details><summary>{t('details')}</summary><pre>{error}</pre></details><button className="primary" onClick={()=>setError('')}>{t('close')}</button></section></div>}
  {decision&&<div className="modal-backdrop"><section className="dialog" role="dialog" aria-modal="true"><p style={{whiteSpace:'pre-wrap'}}>{decision.message}</p><div className="row">{decision.buttons.map((b,i)=><button key={b.key} autoFocus={i===0} className={i===0?'primary':''} onClick={()=>{decision.resolve(b.key);setDecision(null)}}>{b.text}</button>)}</div></section></div>}
 </div>
}
