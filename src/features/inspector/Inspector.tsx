import {AxisCopyButton,ObjectTransfer,type AxisLabelSource,type ObjectTransferProps} from './DocumentActions';
import {DiagramTableEditor} from './DiagramTableEditor';
import {useState} from 'react';
import type {ProjectDocument,Axis,DrawObject,Dash,Marker} from '../../domain/model';
import {axisTicks,textRotation,autoRange} from '../../domain/geometry';
import {Field,NumberField,Check,Select,Panel,type T} from '../../app/controls';
import {ColorPicker} from './ColorPicker';
import {addTranslations} from '../../app/i18n';
import {SeriesPanel} from './SeriesPanel';
import {AnchorEditor} from './AnchorEditor';
import {TextEditor} from './TextEditor';
addTranslations({showPoints:['Показывать точки','Show points'],lineMode:['Только линия','Line only'],pointsMode:['Только точки','Points only']});
export interface InspectorProps extends ObjectTransferProps {axisLabelSource?:AxisLabelSource;project:ProjectDocument;selection:string;onChange:(label:string,fn:(p:ProjectDocument)=>ProjectDocument)=>void;t:T;onClose:()=>void}
const dashItems=(t:T):[string,string][]=>['solid','dash','dot','dash-dot'].map(a=>[a,t(a==='dash'?'dashLine':a)]);
const markerItems=(t:T):[string,string][]=>['circle','square','triangle','diamond','cross','plus'].map(a=>[a,t(a)]);
export function Inspector({project:p,selection,onChange,t,onClose,axisLabelSource,destinations,onSendObject}:InspectorProps){
 const [error,setError]=useState('');
 const [kind,id]=selection.split(':');const axis=id==='y'?'y':'x';const s=p.series.find(a=>a.id===id),o=p.objects.find(a=>a.id===id);
 const objectText=o?.text.length?o.text:[{text:'',baseline:'normal' as const,bold:false,italic:false}];
 const setAxis=(patch:Partial<Axis>)=>{const range=patch.mode==='auto'?autoRange(p):null;const next={...p.axes[axis],...patch,...(range?{min:range[axis==='x'?'xMin':'yMin'],max:range[axis==='x'?'xMax':'yMax']}:{})};if(!(next.min<next.max&&next.tickStep>0)){setError(t('invalidRange'));return}let ticks:number[];try{ticks=axisTicks(next,next.min,next.max)}catch(error){setError(t(error instanceof Error&&error.message==='STEP_BELOW_PRECISION'?'STEP_BELOW_PRECISION':'manyTicks'));return}setError(ticks.length>50?t('manyTicks'):'');onChange('SetAxis',q=>({...q,axes:{...q.axes,[axis]:next},viewport:{...q.viewport,[axis==='x'?'xMin':'yMin']:next.min,[axis==='x'?'xMax':'yMax']:next.max}}))};
 const setObject=(patch:Partial<DrawObject>)=>onChange('EditObject',q=>({...q,objects:q.objects.map(a=>a.id===id?{...a,...patch}:a)}));
 const a=p.axes[axis];
 if(kind==='series')return <SeriesPanel project={p} selectedId={id} onSelect={()=>{}} onChange={onChange} t={t} onClose={onClose}/>;
 if(kind==='object'&&o?.type==='table'&&o.table)return <Panel title={t('diagramTable')} t={t} onClose={onClose} className="inspector table-inspector"><ObjectTransfer objectId={o.id} destinations={destinations} onSendObject={onSendObject} t={t}/><DiagramTableEditor key={o.id} object={o} project={p} onChange={next=>setObject(next)} t={t} appearance={<><ColorPicker label={t('stroke')} value={o.style.stroke} onChange={stroke=>setObject({style:{...o.style,stroke}})} t={t}/><NumberField label={t('strokeWidth')} value={o.style.strokeWidthPt} min={.1} max={24} onChange={strokeWidthPt=>setObject({style:{...o.style,strokeWidthPt}})}/><Select label={t('dash')} value={o.style.dash} items={dashItems(t)} onChange={dash=>setObject({style:{...o.style,dash:dash as Dash}})}/><NumberField label={t('fontSize')} value={o.style.fontSizePt} min={6} max={72} onChange={fontSizePt=>setObject({style:{...o.style,fontSizePt}})}/></>} placement={<><Field label={t('name')}><input value={o.name} onChange={e=>setObject({name:e.target.value})}/></Field><AnchorEditor p={p} anchor={o.anchors[0]} label={t('anchorPosition')} t={t} onChange={anchor=>setObject({anchors:[anchor]})}/><NumberField label={t('zIndex')} value={o.zIndex} step={1} onChange={zIndex=>setObject({zIndex:Math.floor(zIndex)})}/><Check label={t('locked')} value={o.locked} onChange={locked=>setObject({locked})}/><Check label={t('visible')} value={o.visible} onChange={visible=>setObject({visible})}/><button className="danger" onClick={()=>{onChange('RemoveObject',q=>({...q,objects:q.objects.filter(a=>a.id!==id)}));onClose()}}>{t('delete')}</button></>}/></Panel>;

 return <Panel title={kind==='axis'?`${t('label')} ${axis.toUpperCase()}`:kind==='series'?s?.name??'':o?t(o.type):t('legend')} t={t} onClose={onClose} className="inspector">
 {error&&<p className="error" role="alert">{error}</p>}
 {kind==='legend'&&<><Check label={t('showLegend')} value={p.legend.visible} onChange={visible=>onChange('Legend',q=>({...q,legend:{...q.legend,visible}}))}/><AnchorEditor p={p} anchor={p.legend.anchor} label={t('legend')} t={t} onChange={anchor=>onChange('Legend',q=>({...q,legend:{...q.legend,anchor}}))}/></>}
 {kind==='axis'&&<>
  <Field label={t('label')}><input data-symbol-target="axis-label" aria-label={t('label')} value={a.label} onChange={e=>setAxis({label:e.target.value})}/></Field>
  <AxisCopyButton axis={axis} source={axisLabelSource} t={t} onApply={label=>onChange('SetAxis',q=>({...q,axes:{...q.axes,[axis]:{...q.axes[axis],label}}}))}/>
  <Field label={t('unit')}><input value={a.unit} onChange={e=>setAxis({unit:e.target.value})}/></Field>
  <Select label={t('rangeMode')} value={a.mode} items={['auto','manual'].map(x=>[x,t(x)])} onChange={v=>setAxis({mode:v as Axis['mode']})}/>
  <div className="row"><NumberField label={t('min')} value={a.min} onChange={min=>setAxis({min,mode:'manual'})}/><NumberField label={t('max')} value={a.max} onChange={max=>setAxis({max,mode:'manual'})}/></div>
  <Select label={t('tickMode')} value={a.tickMode} items={['auto','manual'].map(x=>[x,t(x)])} onChange={v=>setAxis({tickMode:v as Axis['tickMode']})}/>
  <NumberField label={t('tickStep')} value={a.tickStep} min={Number.MIN_VALUE} onChange={tickStep=>setAxis({tickStep,tickMode:'manual'})}/>
  <NumberField label={t('tickOrigin')} value={a.tickOrigin} onChange={tickOrigin=>setAxis({tickOrigin})}/>
  <Select label={t('numberFormat')} value={a.numberFormat} items={['auto','fixed','scientific'].map(x=>[x,t(x)])} onChange={v=>setAxis({numberFormat:v as Axis['numberFormat']})}/>
  <NumberField label={t('precision')} value={a.precision} min={0} max={15} step={1} onChange={precision=>setAxis({precision:Math.floor(precision)})}/>
  <NumberField label={t('minorDivisions')} value={a.minorDivisions} min={0} max={20} step={1} onChange={minorDivisions=>setAxis({minorDivisions:Math.floor(minorDivisions)})}/>
  <NumberField label={t('strokeWidth')} value={a.strokeWidthPt} min={0.1} max={24} onChange={strokeWidthPt=>setAxis({strokeWidthPt})}/>
  <NumberField label={t('labelSize')} step={1} value={a.labelSizePt} min={6} max={72} onChange={labelSizePt=>setAxis({labelSizePt})}/>
  <Check label={t('grid')} value={a.grid} onChange={grid=>setAxis({grid})}/>
 </>}
 {kind==='object'&&o&&<>
  <ObjectTransfer objectId={o.id} destinations={destinations} onSendObject={onSendObject} t={t}/>
  <Field label={t('name')}><input value={o.name} onChange={e=>setObject({name:e.target.value})}/></Field>
  {o.anchors.map((anchor,i)=><AnchorEditor key={i} p={p} anchor={anchor} label={t(o.type==='callout'?(i===0?'anchorTip':'anchorLabel'):o.anchors.length===1?'anchorPosition':i===0?'anchorStart':'anchorEnd')} t={t} onChange={next=>setObject({anchors:o.anchors.map((a,j)=>i===j?next:a)})}/>)}
  {o.type==='table'&&o.table&&<DiagramTableEditor key={o.id} object={o} project={p} onChange={next=>setObject(next)} t={t}/>}
  {['text','callout'].includes(o.type)&&<>
   <TextEditor parts={objectText} onChange={text=>setObject({text})} t={t}/>
   <NumberField label={t('fontSize')} step={1} value={o.style.fontSizePt} min={6} max={72} onChange={fontSizePt=>setObject({style:{...o.style,fontSizePt}})}/>
   <NumberField label={t('rotation')} value={textRotation(p,o.id)} min={-360} max={360} onChange={angle=>onChange('EditObject',q=>({...q,extensions:{...q.extensions,textRotation:{...(typeof q.extensions.textRotation==='object'&&q.extensions.textRotation!==null?q.extensions.textRotation:{}),[o.id]:angle}}}))}/>
  </>}
  {o.type==='line'&&<div className="row"><NumberField label={t('directionX')} value={o.geometry.directionX??1} onChange={directionX=>{if(directionX===0&&!o.geometry.directionY)return;setObject({geometry:{...o.geometry,directionX}})}}/><NumberField label={t('directionY')} value={o.geometry.directionY??0} onChange={directionY=>{if(directionY===0&&!o.geometry.directionX)return;setObject({geometry:{...o.geometry,directionY}})}}/></div>}
  <ColorPicker label={t(o.type==='text'?'color':'stroke')} value={o.style.stroke} onChange={stroke=>setObject({style:{...o.style,stroke}})} t={t}/>
  {o.type!=='text'&&<><NumberField label={t('strokeWidth')} value={o.style.strokeWidthPt} min={0.1} max={24} onChange={strokeWidthPt=>setObject({style:{...o.style,strokeWidthPt}})}/>
  <Select label={t('dash')} value={o.style.dash} items={dashItems(t)} onChange={dash=>setObject({style:{...o.style,dash:dash as Dash}})}/></>}
  <NumberField label={t('opacity')+', %'} value={o.style.strokeOpacity*100} min={0} max={100} onChange={strokeOpacity=>setObject({style:{...o.style,strokeOpacity:strokeOpacity/100}})}/>
  {['rectangle','range-x','range-y','marker'].includes(o.type)&&<><ColorPicker label={t('fill')} value={o.style.fill} onChange={fill=>setObject({style:{...o.style,fill}})} t={t}/><NumberField label={t('fillOpacity')+', %'} value={o.style.fillOpacity*100} min={0} max={100} onChange={fillOpacity=>setObject({style:{...o.style,fillOpacity:fillOpacity/100}})}/></>}
  {['arrow','callout'].includes(o.type)&&<Select label={t('arrowHead')} value={o.style.arrowHead} items={['none','start','end','both'].map(a=>[a,t(a)])} onChange={arrowHead=>setObject({style:{...o.style,arrowHead:arrowHead as DrawObject['style']['arrowHead']}})}/>}
  {o.type==='marker'&&<><Select label={t('markerShape')} value={o.style.markerShape} items={markerItems(t)} onChange={markerShape=>setObject({style:{...o.style,markerShape:markerShape as Marker}})}/><NumberField label={t('markerSize')} value={o.style.markerSizePt} min={0} max={32} onChange={markerSizePt=>setObject({style:{...o.style,markerSizePt}})}/></>}
  <NumberField label={t('zIndex')} value={o.zIndex} step={1} onChange={zIndex=>setObject({zIndex:Math.floor(zIndex)})}/><Check label={t('locked')} value={o.locked} onChange={locked=>setObject({locked})}/><Check label={t('visible')} value={o.visible} onChange={visible=>setObject({visible})}/>
  <button className="danger" onClick={()=>{onChange('RemoveObject',q=>({...q,objects:q.objects.filter(a=>a.id!==id)}));onClose()}}>{t('delete')}</button>
 </>}
 </Panel>
}
