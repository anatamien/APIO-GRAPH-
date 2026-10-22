import type {ProjectDocument} from '../../domain/model';
import {effectiveMarkers,setProjectMarkers} from '../../domain/seriesDisplay';
import type {Settings} from './store';
import {Panel,Select,Check,NumberField,Field,type T} from '../../app/controls';
import {ColorPicker} from '../inspector/ColorPicker';
export function SettingsPanel({project:p,onChange,settings:s,setSettings,t,onClose}:{project:ProjectDocument;onChange:(label:string,fn:(p:ProjectDocument)=>ProjectDocument)=>void;settings:Settings;setSettings:(s:Settings)=>void;t:T;onClose:()=>void}){
 return <Panel title={t('settings')} t={t} onClose={onClose}>
 <Select label={t('language')} value={s.language} items={[["ru","Русский"],["en","English"]]} onChange={language=>setSettings({...s,language:language as Settings['language']})}/>
 <Select label={t('theme')} value={s.theme} items={['system','light','dark'].map(v=>[v,t(v)])} onChange={theme=>setSettings({...s,theme:theme as Settings['theme']})}/>
 <Check label={t('pin')} value={s.pinned} onChange={pinned=>setSettings({...s,pinned})}/><Check label={t('leftToolbar')} value={s.left} onChange={left=>setSettings({...s,left})}/><Check label={t('repeatTool')} value={s.repeatTool} onChange={repeatTool=>setSettings({...s,repeatTool})}/>
 <Select label={t('snapMode')} value={s.snap} items={['none','dataPoint','grid'].map(v=>[v,t(v)])} onChange={snap=>setSettings({...s,snap:snap as Settings['snap']})}/>
 <NumberField label={t('snapRadius')} value={s.snapRadius} min={4} max={20} step={1} onChange={snapRadius=>setSettings({...s,snapRadius})}/>
 <Check label={t('animations')} value={s.animations} onChange={animations=>setSettings({...s,animations})}/><Check label={t('largeUI')} value={s.largeUI} onChange={largeUI=>setSettings({...s,largeUI})}/>
 <h3>{t('pageSettings')}</h3>
 <Field label={t('title')}><input value={p.project.title} onChange={e=>onChange('ProjectTitle',q=>({...q,project:{...q.project,title:e.target.value}}))}/></Field>
 <div className="row"><NumberField label={t('width')} value={p.page.widthPx} min={100} max={30000} step={1} onChange={widthPx=>onChange('PageSize',q=>({...q,page:{...q.page,widthPx:Math.round(widthPx)}}))}/><NumberField label={t('height')} value={p.page.heightPx} min={100} max={30000} step={1} onChange={heightPx=>onChange('PageSize',q=>({...q,page:{...q.page,heightPx:Math.round(heightPx)}}))}/></div>
 <NumberField label={t('padding')} value={p.page.paddingPx} min={0} max={2000} onChange={paddingPx=>onChange('PagePadding',q=>({...q,page:{...q.page,paddingPx}}))}/>
 <ColorPicker label={t('background')} value={p.page.background} onChange={background=>onChange('PageBackground',q=>({...q,page:{...q.page,background}}))} t={t}/>
 <Check label={t('markers')} value={p.series.some(s=>effectiveMarkers(p,s))} onChange={show=>onChange('PointMarkers',q=>setProjectMarkers(q,show))}/>
 <Check label={t('showLegend')} value={p.legend.visible} onChange={visible=>onChange('Legend',q=>({...q,legend:{...q.legend,visible}}))}/>
 {p.legend.anchor.mode==='page'&&<div className="row"><NumberField label={t('legend')+' X (0–1)'} value={p.legend.anchor.pageX} min={0} max={1} onChange={pageX=>onChange('Legend',q=>({...q,legend:{...q.legend,anchor:{mode:'page',pageX,pageY:p.legend.anchor.mode==='page'?p.legend.anchor.pageY:0.1}}}))}/><NumberField label={t('legend')+' Y (0–1)'} value={p.legend.anchor.pageY} min={0} max={1} onChange={pageY=>onChange('Legend',q=>({...q,legend:{...q.legend,anchor:{mode:'page',pageY,pageX:p.legend.anchor.mode==='page'?p.legend.anchor.pageX:0.8}}}))}/></div>}
 </Panel>
}
