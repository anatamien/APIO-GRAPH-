import {analysisPreferences} from '../settings/toolPreferences';
import {useEffect,useMemo,useRef,useState} from 'react';
import {Plus,Trash2,ListTree} from 'lucide-react';
import {Panel,Field,Select,Check,NumberField,type T} from '../../app/controls';
import type {CalculationKind,ProjectDocument,XY} from '../../domain/model';
import {MathError,type CalculationResult} from '../../domain/math';
import {dependencyIndex,datasetUnits,seriesByDataset} from '../../domain/dependencies';
import {AnalysisWorkerClient} from './workerClient';
import {calculationInputsUnchanged} from './recalculation';
import {applySignalResult} from './signalOperations';
import {analysisOperations,Summary,type AnalysisPanelProps} from './AnalysisPanel';
import {PeakResultsTable} from './PeakResultsTable';
import './signalTranslations';
import './signals.css';

const parse=(text:string)=>{const value=Number(text.trim().replace(',','.'));if(!text.trim()||!Number.isFinite(value))throw new MathError('SIGNAL_PARAMETER');return value};
const parseIntervals=(text:string):[number,number][]=>text.split(/[\n;]+/).filter(line=>line.trim()).map(line=>{const values=line.trim().split(/\s+|:/);if(values.length!==2)throw new MathError('SIGNAL_BACKGROUND');return[parse(values[0]),parse(values[1])]});
const savedText=(value:unknown)=>typeof value==='number'?String(value):'';
function Nodes({nodes,onChange,t,bounds}:{nodes:XY[];onChange:(nodes:XY[])=>void;t:T;bounds:readonly number[]}){
 const [scroll,setScroll]=useState(0),first=Math.max(0,Math.floor(scroll/52)-1),last=Math.min(nodes.length,first+7);
 return <div className="signal-nodes"><div className="signal-node-head"><span>X</span><span>Y</span><span/></div>
  <div className="signal-node-scroll" onScroll={e=>setScroll(e.currentTarget.scrollTop)}><div style={{height:first*52}}/>{nodes.slice(first,last).map((n,at)=>{const i=first+at;return <div className="signal-node-row" key={i}><NumberField label={`X ${i+1}`} value={n.x} onChange={x=>onChange(nodes.map((a,j)=>j===i?{...a,x}:a))}/><NumberField label={`Y ${i+1}`} value={n.y} onChange={y=>onChange(nodes.map((a,j)=>j===i?{...a,y}:a))}/><button aria-label={`${t('signal.removeNode')} ${i+1}`} onClick={()=>onChange(nodes.filter((_,j)=>j!==i))}><Trash2 size={14}/></button></div>})}<div style={{height:(nodes.length-last)*52}}/></div>
  <button onClick={()=>onChange([...nodes,{x:nodes.length===0?bounds[0]:nodes.length===1?bounds[1]:(bounds[0]/2+bounds[1]/2),y:0}])}><Plus size={14}/>{t('signal.addNode')}</button>
 </div>;
}
interface SignalPreview {result:CalculationResult;parameters:Record<string,unknown>;snapshot:ProjectDocument}
export function SignalAnalysisPanel({project:p,onChange,t,onClose,sourceSeriesId,calculationId,onDataResults,interaction,onRevealPeak,operation,onOperation,onSourcePicked}:AnalysisPanelProps&{operation:'baseline'|'peaks'|'area';onOperation:(kind:CalculationKind)=>void}){
 const editing=p.calculations.find(c=>c.id===calculationId),saved=editing?.parameters??analysisPreferences(operation),index=dependencyIndex(p);
 const options=useMemo(()=>{const curves=seriesByDataset(p.series);return[...p.series.filter(s=>!index.producers.has(s.datasetId)||index.producers.get(s.datasetId)?.status==='valid').map(s=>[s.id,s.name] as [string,string]),...p.datasets.filter(d=>!curves.has(d.id)&&(!index.producers.has(d.id)||index.producers.get(d.id)?.status==='valid')).map(d=>[`dataset:${d.id}`,d.name] as [string,string])]},[p.series,p.datasets,index]);
 const initial=sourceSeriesId??(editing?`dataset:${editing.sourceDatasetIds[0]}`:options[0]?.[0])??'';
 const [sourceId,setSourceId]=useState(initial),series=p.series.find(s=>s.id===sourceId),dataset=index.datasets.get(series?.datasetId??sourceId.replace(/^dataset:/,''));
 const bounds=useMemo(()=>{let min=Infinity,max=-Infinity;for(const a of dataset?.points??[]){min=Math.min(min,a.x);max=Math.max(max,a.x)}return Number.isFinite(min)?[min,max] as const:[0,1] as const},[dataset?.points]);
 const [method,setMethod]=useState(String(saved.method??'manual')),[output,setOutput]=useState(String(saved.output??'corrected')),[nodes,setNodes]=useState<XY[]>(Array.isArray(saved.nodes)?structuredClone(saved.nodes) as XY[]:[]),[pickNodes,setPickNodes]=useState(true),[pickBackground,setPickBackground]=useState(false),[degree,setDegree]=useState(Number(saved.degree??1));
 const [background,setBackground]=useState(Array.isArray(saved.backgroundIntervals)?saved.backgroundIntervals.map(row=>Array.isArray(row)?row.join(' '):'').join('\n'):''),[extrapolate,setExtrapolate]=useState(saved.extrapolate===true);
 const [lambda,setLambda]=useState(Number(saved.lambda??1e5)),[asymmetry,setAsymmetry]=useState(Number(saved.asymmetry??.01)),[iterations,setIterations]=useState(Number(saved.iterations??30)),[tolerance,setTolerance]=useState(Number(saved.tolerance??1e-6));
 const [direction,setDirection]=useState(String(saved.direction??'max')),[heightText,setHeightText]=useState(savedText(saved.height)),[prominence,setProminence]=useState(Number(saved.prominence??0)),[distance,setDistance]=useState(Number(saved.distance??0)),[distanceUnit,setDistanceUnit]=useState(String(saved.distanceUnit??'x')),[relativeHeight,setRelativeHeight]=useState(Number(saved.relativeHeight??.5)),[minWidth,setMinWidth]=useState(savedText(saved.minWidth)),[maxWidth,setMaxWidth]=useState(savedText(saved.maxWidth)),[incomplete,setIncomplete]=useState(saved.includeIncomplete!==false);
 const range=Array.isArray(saved.range)?saved.range:bounds;
 const [rangeMode,setRangeMode]=useState(operation==='area'||Array.isArray(saved.range)),[minText,setMinText]=useState(String(range[0])),[maxText,setMaxText]=useState(String(range[1])),[baselineId,setBaselineId]=useState(String(saved.baselineDatasetId??'')),[zeroLevel,setZeroLevel]=useState(saved.baselineDatasetId?'dataset':'zero');
 const [sortCopy,setSortCopy]=useState(saved.sortCopy===true),[duplicates,setDuplicates]=useState(String(saved.duplicates??'reject')),[name,setName]=useState(String(saved.resultName??'')),[preview,setPreview]=useState<SignalPreview|null>(null),[busy,setBusy]=useState(false),[error,setError]=useState('');
 const [confirmedId,setConfirmedId]=useState(calculationId);
 const reference=zeroLevel==='dataset'?index.datasets.get(baselineId):undefined;
 const client=useRef<AnalysisWorkerClient|null>(null);if(!client.current)client.current=new AnalysisWorkerClient();
 const generation=useRef(0),running=useRef<ProjectDocument|null>(null),latest=useRef(p);latest.current=p;
 const cancel=()=>{generation.current++;client.current?.cancel();running.current=null;setBusy(false);setPreview(null)};
 useEffect(()=>{cancel();setError('')},[operation,sourceId,method,output,nodes,degree,background,extrapolate,lambda,asymmetry,iterations,tolerance,direction,heightText,prominence,distance,distanceUnit,relativeHeight,minWidth,maxWidth,incomplete,rangeMode,minText,maxText,baselineId,zeroLevel,sortCopy,duplicates]);
 useEffect(()=>{const snapshot=running.current??preview?.snapshot;if(snapshot&&!calculationInputsUnchanged(p,snapshot)){cancel();setError('MATH_PREVIEW_STALE')}},[p.datasets,p.calculations,p.axes.x.unit,p.axes.y.unit]);
 useEffect(()=>()=>{generation.current++;client.current?.cancel();interaction?.set(null)},[interaction]);
 const sourceBefore=useRef(sourceId);
 useEffect(()=>{if(sourceBefore.current!==sourceId){sourceBefore.current=sourceId;setConfirmedId(undefined);setMinText(String(bounds[0]));setMaxText(String(bounds[1]))}},[sourceId,bounds]);
 useEffect(()=>{
  if(!interaction||!dataset)return;
  let currentRange:readonly[number,number]|undefined;try{const a=parse(minText),b=parse(maxText);if(a<b)currentRange=[a,b]}catch{/* Numeric drafts are not scientific data. */}
  const current=preview?.result;
  interaction.set({mode:operation==='baseline'&&method==='manual'&&pickNodes?'nodes':operation==='baseline'&&method==='polynomial'&&pickBackground?'background':operation==='area'?'range':'none',sourceDatasetId:dataset.id,baselineDatasetId:operation==='area'&&zeroLevel==='dataset'?baselineId:undefined,orderParameters:{sortCopy,duplicates},nodes:operation==='baseline'&&method==='manual'?nodes:undefined,range:operation==='area'?currentRange:undefined,
   preview:current?{...(operation==='baseline'?(current.plot??(preview.parameters.output==='corrected'?{baseline:current.companion,corrected:current.points}:{baseline:current.points,corrected:current.companion})):{}),...(current.data?.peaks?{peaks:current.data.peaks}:{})}:undefined,
   onPick:point=>{if(method==='manual')setNodes(old=>[...old,point]);else setBackground(old=>`${old}${old.trim()?'\n':''}${point.x} ${point.x}`)},
   onMove:(at,point)=>{if(operation==='area'){const x=Math.max(bounds[0],Math.min(bounds[1],point.x));try{if(at===0&&x<parse(maxText))setMinText(String(x));if(at===1&&x>parse(minText))setMaxText(String(x))}catch{/* An incomplete numeric draft must not move a boundary. */}}else setNodes(old=>old.map((a,i)=>i===at?point:a))},
  });
 },[interaction,dataset?.id,operation,method,pickNodes,pickBackground,nodes,minText,maxText,preview,bounds,zeroLevel,baselineId,sortCopy,duplicates]);
 function parameters():Record<string,unknown>{
  const result:Record<string,unknown>={sortCopy,duplicates};
  if(operation==='baseline'){
   Object.assign(result,{method,output});if(method==='manual')Object.assign(result,{nodes:nodes.map(a=>({...a})).sort((a,b)=>a.x-b.x),extrapolate});
   if(method==='polynomial')Object.assign(result,{degree,backgroundIntervals:parseIntervals(background)});if(method==='asls')Object.assign(result,{lambda,asymmetry,iterations,tolerance});
  }else{
   if(rangeMode||operation==='area')result.range=[parse(minText),parse(maxText)];
   if(operation==='peaks'){Object.assign(result,{direction,prominence,distance,distanceUnit,relativeHeight,includeIncomplete:incomplete});if(heightText.trim())result.height=parse(heightText);if(minWidth.trim())result.minWidth=parse(minWidth);if(maxWidth.trim())result.maxWidth=parse(maxWidth)}
   else if(zeroLevel==='dataset'){if(!reference)throw new MathError('MATH_SOURCE_MISSING');const a=datasetUnits(p,dataset!.id),b=datasetUnits(p,reference.id);if(a.x!==b.x||a.y!==b.y)throw new MathError('SIGNAL_BASELINE_UNITS');result.baselineDatasetId=reference.id}
  }return result;
 }
 async function run(){
  if(document.querySelector('.signal-analysis-panel [aria-invalid=true]')){setError('SIGNAL_PARAMETER');return}
  if(!dataset){setError('MATH_SOURCE_MISSING');return}if(index.producers.has(dataset.id)&&index.producers.get(dataset.id)?.status!=='valid'){setError('MATH_DEPENDENCY_INVALID');return}
  const token=++generation.current,snapshot=latest.current;running.current=snapshot;setError('');setPreview(null);setBusy(true);
  try{const args=parameters();const response=await client.current!.run({type:'preview',kind:operation,points:dataset.points,parameters:operation==='baseline'?{...args,output:'both'}:args,reference:operation==='area'?reference?.points:undefined});if(generation.current!==token||response.type!=='preview')return;if(!calculationInputsUnchanged(latest.current,snapshot))throw new MathError('MATH_PREVIEW_STALE');running.current=null;const result=operation==='baseline'?{...response.result,points:args.output==='corrected'?response.result.companion!:response.result.points,companion:args.output==='corrected'?response.result.points:response.result.companion,summary:{...response.result.summary,output:String(args.output)}}:response.result;setPreview({result,parameters:args,snapshot})}
  catch(reason){if(generation.current===token&&(reason as Error)?.name!=='AbortError')setError(reason instanceof MathError?reason.code:'MATH_WORKER_FAILURE')}
  finally{if(generation.current===token){running.current=null;setBusy(false)}}
 }
 function apply(){if(!preview)return;try{if(document.querySelector('.signal-analysis-panel [aria-invalid=true]'))throw new MathError('SIGNAL_PARAMETER');if(!calculationInputsUnchanged(p,preview.snapshot))throw new MathError('MATH_PREVIEW_STALE');const title=name.trim()||`${t(operation)} · ${dataset?.name??''}`;let appliedId:string|undefined;onChange(editing?'UpdateCalculation':'AddSignalResult',q=>{if(!calculationInputsUnchanged(q,preview.snapshot))throw new MathError('MATH_PREVIEW_STALE');const next=applySignalResult(q,sourceId,operation,preview.parameters,preview.result,title,editing?.id);appliedId=editing?.id??next.calculations.at(-1)?.id;return next});if(appliedId)setConfirmedId(appliedId);cancel()}catch(reason){setError(reason instanceof MathError?reason.code:'MATH_WORKER_FAILURE')}}
 const confirmed=p.calculations.find(c=>c.id===confirmedId),peaks=preview?.result.data?.peaks??confirmed?.data?.peaks;
 return <Panel title={t('analysis')} className="analysis-panel signal-analysis-panel" t={t} onClose={onClose}>
  <div className="signal-parameters" onInputCapture={e=>{if(!(e.target as Element).closest('.signal-source-visibility')){cancel();setError('')}}}>
  {onDataResults&&<button className="signal-return" onClick={onDataResults}><ListTree size={15}/>{t('data.results')}</button>}
  {editing?<><p className="analysis-note">{t('data.edit')} · {t(operation)}</p><p className="signal-source">{t('source')}: {dataset?.name}</p></>:<><Select label={t('operation')} value={operation} items={analysisOperations.map(kind=>[kind,t(kind)])} onChange={value=>onOperation(value as CalculationKind)}/><Select label={t('sourceSeries')} value={sourceId} items={options.length?options:[['',t('noData')]]} onChange={id=>{setSourceId(id);onSourcePicked?.(id)}}/></>}
  {series&&<div className="signal-source-visibility"><Check label={t('analysisSourceVisibility')} value={series.visible} onChange={visible=>onChange('SetSeriesVisibility',q=>({...q,series:q.series.map(s=>s.id===series.id?{...s,visible}:s)}))}/></div>}
  {dataset&&<p className="analysis-note">{t('analysisSourceCount').replace('{n}',String(dataset.points.length))}</p>}
  {operation==='baseline'&&<>
   <Select label={t('signal.method')} value={method} items={['manual','polynomial','asls'].map(m=>[m,t(`signal.${m}`)])} onChange={setMethod}/>
   {method==='manual'&&<><p className="analysis-note">{t('signal.nodeHint')}</p><Check label={t('signal.pickNodes')} value={pickNodes} onChange={setPickNodes}/><Nodes nodes={nodes} onChange={setNodes} t={t} bounds={bounds}/><Check label={t('signal.extrapolate')} value={extrapolate} onChange={setExtrapolate}/></>}
   {method==='polynomial'&&<><NumberField label={t('degree')} value={degree} onChange={setDegree} min={0} max={3} step={1}/><Field label={t('signal.backgroundIntervals')}><textarea aria-label={t('signal.backgroundIntervals')} value={background} onChange={e=>setBackground(e.target.value)} placeholder={`${bounds[0]} ${bounds[0]}\n${bounds[1]} ${bounds[1]}`}/></Field><Check label={t('signal.pickBackground')} value={pickBackground} onChange={setPickBackground}/><p className="analysis-note">{t('signal.backgroundHint')}</p></>}
   {method==='asls'&&<><NumberField label={t('signal.lambda')} value={lambda} onChange={setLambda} min={1e-8} max={1e9}/><NumberField label={t('signal.asymmetry')} value={asymmetry} onChange={setAsymmetry} min={1e-6} max={1-1e-6}/><div className="analysis-grid"><NumberField label={t('signal.iterations')} value={iterations} onChange={setIterations} min={1} max={200} step={1}/><NumberField label={t('signal.tolerance')} value={tolerance} onChange={setTolerance} min={1e-12} max={.1}/></div><p className="analysis-note">{t('signal.aslsHint')}</p></>}
   <Select label={t('signal.output')} value={output} items={(editing?['baseline','corrected']:['baseline','corrected','both']).map(v=>[v,t(v==='both'?'signal.both':v==='baseline'?'signal.baselineOnly':'signal.correctedOnly')])} onChange={setOutput}/>
  </>}
  {operation==='peaks'&&<>
   <Select label={t('signal.direction')} value={direction} items={['max','min'].map(d=>[d,t(`signal.${d}`)])} onChange={setDirection}/><Field label={t(direction==='max'?'signal.minimumY':'signal.maximumY')}><input inputMode="decimal" value={heightText} onChange={e=>setHeightText(e.target.value)}/></Field><NumberField label={t('signal.prominence')} value={prominence} onChange={setProminence} min={0}/><p className="analysis-note">{t('signal.prominenceHint')}</p>
   <div className="analysis-grid"><NumberField label={t('signal.distance')} value={distance} onChange={setDistance} min={0}/><Select label={t('signal.distanceUnit')} value={distanceUnit} items={['x','samples'].map(v=>[v,t(v==='x'?'signal.xUnits':'signal.samples')])} onChange={setDistanceUnit}/></div><NumberField label={t('signal.relativeHeight')} value={relativeHeight} onChange={setRelativeHeight} min={.0001} max={2}/><div className="analysis-grid"><Field label={t('signal.minWidth')}><input inputMode="decimal" value={minWidth} onChange={e=>setMinWidth(e.target.value)}/></Field><Field label={t('signal.maxWidth')}><input inputMode="decimal" value={maxWidth} onChange={e=>setMaxWidth(e.target.value)}/></Field></div><Check label={t('signal.incomplete')} value={incomplete} onChange={setIncomplete}/><p className="analysis-note">{t('signal.incompleteHint')}</p><Check label={t('analysisXRange')} value={rangeMode} onChange={setRangeMode}/>
  </>}
  {operation==='area'&&<><p className="analysis-note">{t('signal.rangeHint')}</p><Select label={t('signal.level')} value={zeroLevel} items={['zero','dataset'].map(v=>[v,t(v==='zero'?'signal.zero':'signal.reference')])} onChange={setZeroLevel}/>{zeroLevel==='dataset'&&<Select label={t('signal.baselineSource')} value={baselineId} items={[['',t('noData')],...p.datasets.filter(d=>!index.producers.has(d.id)||index.producers.get(d.id)?.status==='valid').map(d=>[d.id,d.name] as [string,string])]} onChange={setBaselineId}/>}</>}
  {(operation==='area'||operation==='peaks'&&rangeMode)&&<div className="analysis-grid"><Field label={t('rangeMin')}><input aria-label={t('rangeMin')} inputMode="decimal" value={minText} onChange={e=>setMinText(e.target.value)}/></Field><Field label={t('rangeMax')}><input aria-label={t('rangeMax')} inputMode="decimal" value={maxText} onChange={e=>setMaxText(e.target.value)}/></Field></div>}
  {(operation!=='baseline'||method==='asls')&&<><Check label={t('sortCopy')} value={sortCopy} onChange={setSortCopy}/><Select label={t('duplicates')} value={duplicates} items={['reject','mean','median'].map(v=>[v,t(v)])} onChange={setDuplicates}/></>}
  <div className="analysis-actions"><button className="primary" disabled={busy||!dataset?.points.length||!!calculationId&&!editing} onClick={()=>void run()}>{t(busy?'calculating':'signal.preview')}</button><button onClick={busy?cancel:onClose}>{t('cancel')}</button></div>
  <p className="analysis-note">{t('signal.previewHint')}</p>{error&&<p role="alert" className="analysis-error">{t(error)}</p>}
  </div>
  {preview&&<div className="signal-preview" aria-label={t('preview')}><Summary summary={preview.result.summary} t={t}/><Field label={t('name')}><input value={name} onChange={e=>setName(e.target.value)} placeholder={`${t(operation)} · ${dataset?.name??''}`}/></Field><button className="primary" onClick={apply}>{t(editing?'apply':'addResult')}</button></div>}
  {operation==='area'&&!preview&&confirmed&&<div className="signal-preview"><p className="analysis-note">{t('signal.confirmed')} · {t(`data.${confirmed.status}`)}</p><Summary summary={confirmed.summary} t={t}/></div>}
  {operation==='area'&&(preview||confirmed)&&<p className="analysis-note">{t('unit')}: {dataset?`${datasetUnits(p,dataset.id).x||'X'} × ${datasetUnits(p,dataset.id).y||'Y'}`:'X × Y'}</p>}
  {peaks&&<>{!preview&&<p className="analysis-note">{t('signal.confirmed')}</p>}<PeakResultsTable peaks={peaks} t={t} onReveal={peak=>{const old=interaction?.getSnapshot();if(old)interaction?.set({...old,highlight:peak});onRevealPeak?.(peak)}}/></>}
 </Panel>;
}
