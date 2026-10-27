import {ScientificStyleEditor} from './ScientificStyleEditor';
import {UncertaintyEditor} from './UncertaintyEditor';
import {Fragment,useEffect} from 'react';
import {Shapes} from 'lucide-react';
import {Panel,Field,NumberField,Check,Select,SegmentControl,type T} from '../../app/controls';
import type {ProjectDocument,Series,Dash,Marker} from '../../domain/model';
import {effectiveMarkers,setSeriesMode,setSeriesPoints} from '../../domain/seriesDisplay';
import {ColorPicker} from './ColorPicker';
import {addTranslations} from '../../app/i18n';
import {removeDataNode} from '../../domain/dependencies';
addTranslations({graphProperties:['Свойства графика','Graph properties'],currentSeries:['Текущая серия','Current series'],displayGroup:['Отображение','Display'],lineGroup:['Линия','Line'],markerGroup:['Маркеры','Markers'],advancedGroup:['Дополнительные свойства','Advanced properties'],modeLine:['Линия','Line'],modePoints:['Точки','Points'],modeBoth:['Оба','Both'],showPoints:['Показывать точки','Show points']});
addTranslations({chooseSeries:['Выберите серию','Choose a series'],seriesUnavailable:['Результат недоступен:','Result unavailable:'],seriesOutdated:['нужен перерасчёт','recalculation required'],seriesInvalid:['ошибка расчёта','calculation error'],seriesColorHint:['Цвет линии и контура маркеров. Заливка настраивается ниже.','Line and marker outline color. Set the fill below.']});
export function SeriesPanel({project:p,t,onSelect,onClose,onChange,selectedId,onObjects,onDataResults}:{project:ProjectDocument;t:T;onSelect:(id:string)=>void;onClose:()=>void;onChange:(label:string,fn:(p:ProjectDocument)=>ProjectDocument)=>void;selectedId?:string;onObjects?:()=>void;onDataResults?:()=>void}){
 const s=p.series.find(s=>s.id===selectedId);
 useEffect(()=>{if(selectedId===undefined&&p.series[0])onSelect(p.series[0].id)},[selectedId,p.series,onSelect]);
 const update=(patch:Partial<Series>)=>{if(s)onChange('SetSeriesStyle',q=>({...q,series:q.series.map(a=>a.id===s.id?{...a,...patch}:a)}))};
 const markers=!!s&&effectiveMarkers(p,s);
 const calculation=p.calculations.find(calc=>calc.resultDatasetId===s?.datasetId);
 return <Panel title={t('graphProperties')} className="inspector graph-properties" t={t} onClose={onClose}>
  {onDataResults&&<button className="object-list-button" onClick={onDataResults}>{t('data.results')}</button>}
  {onObjects&&<button className="object-list-button" aria-label={t('graphObjects')} onClick={onObjects}><Shapes size={17}/>{t('graphObjects')} ({p.objects.length})</button>}
  {p.series.length>0&&<Select label={t('currentSeries')} value={s?.id??''} items={[...(!s?[["",t('chooseSeries')] as [string,string]]:[]),...p.series.map(s=>[s.id,s.name+(s.visible?'':` · ${t('hiddenSeries')}`)] as [string,string])]} onChange={onSelect}/>}
  <ScientificStyleEditor project={p} series={s} onChange={onChange} t={t}/>
  {s?<>
   <small className="muted series-identity" title={s.id}>ID · {s.id}</small>
   {calculation&&calculation.status!=='valid'&&<p role="status" className="notice">{t('seriesUnavailable')} {t(calculation.status==='outdated'?'seriesOutdated':'seriesInvalid')}{typeof calculation.summary.errorCode==='string'?` · ${calculation.summary.errorCode}`:''}</p>}
   <Fragment key={s.id}>
   <section className="control-section"><h3>{t('displayGroup')}</h3>
    <Check label={t('showPoints')} value={markers} onChange={show=>onChange('PointMarkers',q=>setSeriesPoints(q,s.id,show))}/>
    <Check label={t('showLegend')} value={p.legend.visible} onChange={visible=>onChange('Legend',q=>({...q,legend:{...q.legend,visible}}))}/>
    <SegmentControl label={t('mode')} value={markers?s.mode:'line'} items={[["line",t('modeLine')],["points",t('modePoints')],["line-points",t('modeBoth')]]} onChange={mode=>onChange('SetSeriesStyle',q=>setSeriesMode(q,s.id,mode as Series['mode']))}/>
    <Check label={t('visible')} value={s.visible} onChange={visible=>update({visible})}/>
   </section>
   <section className="control-section"><h3>{t('lineGroup')}</h3>
    <ColorPicker label={t('color')} value={s.style.stroke} onChange={stroke=>update({style:{...s.style,stroke,markerStroke:stroke}})} t={t}/>
    {markers&&<small className="muted">{t('seriesColorHint')}</small>}
    <div className="row"><NumberField label={t('strokeWidth')} value={s.style.strokeWidthPt} min={0.5} max={12} onChange={strokeWidthPt=>update({style:{...s.style,strokeWidthPt}})}/>
    <Select label={t('dash')} value={s.style.dash} items={['solid','dash','dot','dash-dot'].map(a=>[a,t(a==='dash'?'dashLine':a)])} onChange={dash=>update({style:{...s.style,dash:dash as Dash}})}/></div>
    <NumberField label={t('opacity')+', %'} value={s.style.opacity*100} min={0} max={100} onChange={opacity=>update({style:{...s.style,opacity:opacity/100}})}/>
   </section>
   {p.datasets.find(d=>d.id===s.datasetId)&&<UncertaintyEditor project={p} dataset={p.datasets.find(d=>d.id===s.datasetId)!} series={s} onChange={onChange} t={t}/>}
   <details className="control-section marker-settings" open={markers||undefined} key={s.id+':'+markers}><summary>{t('markerGroup')}</summary>
    <Select label={t('markerShape')} value={s.style.markerShape} items={['circle','square','triangle','diamond','cross','plus'].map(a=>[a,t(a)])} onChange={markerShape=>update({style:{...s.style,markerShape:markerShape as Marker}})}/>
    <NumberField label={t('markerSize')} value={s.style.markerSizePt} min={0} max={32} onChange={markerSizePt=>update({style:{...s.style,markerSizePt}})}/>
    <ColorPicker label={t('markerFill')} value={s.style.markerFill} t={t} onChange={markerFill=>update({style:{...s.style,markerFill}})}/>
    <ColorPicker label={t('markerStroke')} value={s.style.markerStroke} t={t} onChange={markerStroke=>update({style:{...s.style,markerStroke}})}/>
   </details>
   <section className="control-section"><h3>{t('advancedGroup')}</h3>
    <Field label={t('name')}><input aria-label={t('name')} value={s.name} onChange={e=>update({name:e.target.value})}/></Field>
    <Check label={t('includeAuto')} value={s.includeInAutoRange} onChange={includeInAutoRange=>update({includeInAutoRange})}/>
    <NumberField label={t('order')} value={s.order} min={0} step={1} onChange={order=>update({order:Math.floor(order)})}/>
    <button className="danger" onClick={()=>onChange('RemoveSeries',q=>removeDataNode(q,`series:${s.id}`,true))}>{t('delete')}</button>
   </section>
   </Fragment>
  </>:<p className="muted">{t('emptyHint')}</p>}
 </Panel>;
}
