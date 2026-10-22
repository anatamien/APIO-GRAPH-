import {useEffect,useMemo,useRef,useState} from 'react';
import type {ProjectDocument} from '../../domain/model';
import {buildSvg} from './svgClient';
import {previewProject} from './previewProject';
import {rasterize} from './rasterRenderer';
import {saveImage} from '../../platform/files';
import {Panel,Select,NumberField,Check,type T} from '../../app/controls';
import {ColorPicker} from '../inspector/ColorPicker';
import type {ColorMode} from '../chart/ChartScene';
import {courierAvailable,textOverflow} from './preflight';
import {createExportSize,displayExportSize,editExportSide,setExportUnits,setExportDpi,lockExportAspect} from '../../domain/exportDimensions';
export function ExportPanel({project:p,t,onClose,onMessage}:{project:ProjectDocument;t:T;onClose:()=>void;onMessage:(s:string)=>void}){
 const [format,setFormat]=useState('png'),[mode,setMode]=useState<ColorMode>('original'),[size,setSize]=useState(()=>createExportSize(p.page.widthPx,p.page.heightPx)),[transparent,setTransparent]=useState(false),[background,setBackground]=useState(p.page.background),[quality,setQuality]=useState(92),[error,setError]=useState(''),[busy,setBusy]=useState(false),[url,setUrl]=useState(''),[fontAllowed,setFontAllowed]=useState(false);
 const fontFound=courierAvailable(),{units,dpi,locked:aspectLocked}=size,{width,height}=displayExportSize(size),w=Math.round(size.width),h=Math.round(size.height);
 const preview=useMemo(()=>previewProject(p),[p]);
 const job=useRef<AbortController|null>(null),[previewBusy,setPreviewBusy]=useState(true);
 useEffect(()=>()=>job.current?.abort(),[]);
 useEffect(()=>()=>{if(url)URL.revokeObjectURL(url)},[url]);
 useEffect(()=>{
  const controller=new AbortController();setPreviewBusy(true);
  const timer=window.setTimeout(()=>{void buildSvg({...preview,page:{...preview.page,background}},{width:w,height:h,dpi,colorMode:mode,transparent:transparent&&format!=='jpeg'},controller.signal).then(svg=>{if(controller.signal.aborted)return;const next=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));setUrl(next);setPreviewBusy(false)}).catch(e=>{if(!controller.signal.aborted){setError(String(e));setPreviewBusy(false)}})},80);
  return()=>{clearTimeout(timer);controller.abort()};
 },[preview,w,h,dpi,mode,transparent,format,background]);
 const save=async()=>{setError('');if(w<100||h<100||w>30000||h>30000||w*h>100_000_000){setError('100–30000 px · ≤100 MP');return}if(!fontFound&&!fontAllowed){setError(t('fontMissing'));return}const controller=new AbortController();job.current=controller;setBusy(true);try{const options={width:w,height:h,dpi,colorMode:mode,transparent:transparent&&format!=='jpeg'},project={...p,page:{...p.page,background}},layout=await buildSvg(previewProject(project,0),{...options,includeSeries:false},controller.signal),clipped=await textOverflow(layout);controller.signal.throwIfAborted();if(clipped.length){setError(t('clippedText')+'\n'+clipped.join('\n'));return}const svg=await buildSvg(project,options,controller.signal);controller.signal.throwIfAborted();const bytes=format==='svg'?new TextEncoder().encode(svg):await rasterize(svg,w,h,format as 'png'|'jpeg',quality/100,dpi,controller.signal);controller.signal.throwIfAborted();const path=await saveImage(bytes,format,controller.signal);if(path)onMessage(t('exported'))}catch(e){if(!controller.signal.aborted)setError(String(e))}finally{if(job.current===controller){job.current=null;setBusy(false)}}};
 return <Panel title={t('export')} t={t} onClose={onClose} className="export-panel">
  <div className="export-preview-slot" aria-busy={previewBusy}>{url&&<img className="export-preview" src={url} alt={t('preview')}/>}<span className="export-preview-status" role="status">{previewBusy?t('calculating'):''}</span></div>
  <Select label={t('format')} value={format} items={['png','jpeg','svg'].map(v=>[v,v.toUpperCase()])} onChange={setFormat}/>
  <Select label={t('colorMode')} value={mode} items={['original','grayscale','strict-bw'].map(v=>[v,t(v)])} onChange={v=>setMode(v as ColorMode)}/>
  <Select label={t('units')} value={units} items={['px','mm'].map(v=>[v,t(v)])} onChange={units=>setSize(s=>setExportUnits(s,units as 'px'|'mm'))}/>
  <div className="row"><NumberField label={t('width')} value={width} precision={units==='px'?0:3} step={units==='px'?1:0.1} min={units==='px'?1:0.001} max={units==='px'?30000:30000*25.4/dpi} onChange={value=>setSize(s=>editExportSide(s,'width',value))}/><NumberField label={t('height')} value={height} precision={units==='px'?0:3} step={units==='px'?1:0.1} min={units==='px'?1:0.001} max={units==='px'?30000:30000*25.4/dpi} onChange={value=>setSize(s=>editExportSide(s,'height',value))}/></div>
  <Check label={t('lockAspect')} value={aspectLocked} onChange={locked=>setSize(s=>lockExportAspect(s,locked))}/>
  <Select label={t('dpi')} value={String(dpi)} items={['96','150','300','600'].map(v=>[v,v])} onChange={v=>setSize(s=>setExportDpi(s,Number(v)))}/>
  <p className="muted">{w} × {h} px · {t('memory')}: {(w*h*4/1024/1024).toFixed(1)}</p>
  <Check label={t('transparent')} value={transparent} onChange={setTransparent}/>
  {transparent&&format==='jpeg'&&<p className="notice">{t('jpegBackground')}</p>}
  <ColorPicker label={t('background')} value={background} onChange={setBackground} t={t}/>
  {format==='jpeg'&&<NumberField label={t('quality')} value={quality} min={60} max={100} step={1} onChange={setQuality}/>}
  {!fontFound&&<><p className="notice">{t('fontMissing')}</p><Check label={t('fontSubstitute')} value={fontAllowed} onChange={setFontAllowed}/></>}
  {error&&<p role="alert" className="error">{error}</p>}
  <button className="primary full" disabled={busy} onClick={()=>void save()}>{busy?t('calculating'):t('saveImage')}</button>
  {busy&&<button className="full" onClick={()=>job.current?.abort()}>{t('cancel')}</button>}
 </Panel>
}
