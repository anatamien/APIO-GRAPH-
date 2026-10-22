import type {ProjectDocument,Series} from './model';

/** Effective legacy rendering; reading a saved document never normalizes it. */
export function effectiveMarkers(p:ProjectDocument,s:Series):boolean{
 const overrides=p.extensions.seriesMarkers;
 const enabled=overrides&&typeof overrides==='object'&&Object.hasOwn(overrides,s.id)?(overrides as Record<string,unknown>)[s.id]===true:p.editor.showPointMarkers;
 return s.mode==='points'||(s.mode==='line-points'&&s.style.markerVisible&&enabled);
}
export function setSeriesMode(p:ProjectDocument,id:string,mode:Series['mode']):ProjectDocument{
 if(!p.series.some(s=>s.id===id))return p;
 const show=mode!=='line';
 // Existing opaque extensions keep the 1.0.0 schema and legacy global flag intact.
 // A local action never migrates or changes a neighbour's stored marker settings.
 const overrides=p.extensions.seriesMarkers;
 return {...p,extensions:show&&!p.editor.showPointMarkers?{...p.extensions,seriesMarkers:{...(overrides&&typeof overrides==='object'?overrides:{}),[id]:true}}:p.extensions,series:p.series.map(s=>s.id===id?{...s,mode,style:{...s.style,markerVisible:show}}:s)};
}
export function setSeriesPoints(p:ProjectDocument,id:string,show:boolean):ProjectDocument{
 const series=p.series.find(s=>s.id===id);if(!series)return p;
 return setSeriesMode(p,id,show?(series.mode==='points'?'points':'line-points'):'line');
}
/** A document-wide command explicitly changes all series, including points-only. */
export function setProjectMarkers(p:ProjectDocument,show:boolean):ProjectDocument{
 const extensions={...p.extensions};delete extensions.seriesMarkers;
 return {...p,extensions,editor:{...p.editor,showPointMarkers:show},series:p.series.map(s=>({...s,mode:show?(s.mode==='points'?'points':'line-points'):'line',style:{...s.style,markerVisible:show}}))};
}
