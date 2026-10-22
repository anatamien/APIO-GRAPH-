import type {ProjectDocument} from './model';
import {effectiveMarkers} from './seriesDisplay';

const cache=new WeakMap<ProjectDocument,unknown>();
/** Only canvas-affecting state. Shared immutable point arrays are never copied. */
export function visualState(p:ProjectDocument):unknown{
 const cached=cache.get(p);if(cached)return cached;
 const series=p.series.filter(s=>s.visible&&!p.calculations.some(c=>c.resultDatasetId===s.datasetId&&c.status!=='valid')).sort((a,b)=>a.order-b.order);
 const objects=p.objects.filter(o=>o.visible).sort((a,b)=>a.zIndex-b.zIndex);
 const state={page:p.page,axes:p.axes,viewport:p.viewport,series:series.map(s=>({id:s.id,points:p.datasets.find(d=>d.id===s.datasetId)?.points,mode:s.mode==='points'?'points':'line',line:s.mode==='points'?null:{stroke:s.style.stroke,width:s.style.strokeWidthPt,dash:s.style.dash},opacity:s.style.opacity,markers:effectiveMarkers(p,s)?{shape:s.style.markerShape,size:s.style.markerSizePt,fill:s.style.markerFill,stroke:s.style.markerStroke}:null})),objects:objects.map(o=>({...o,name:undefined,locked:undefined})),rotation:objects.map(o=>{const rotations=p.extensions.textRotation;return rotations&&typeof rotations==='object'?(rotations as Record<string,unknown>)[o.id]:undefined}),legend:p.legend.visible?{anchor:p.legend.anchor,series:series.map(s=>({id:s.id,name:s.name,stroke:s.style.stroke,width:s.style.strokeWidthPt,dash:s.style.dash,mode:s.mode==='points'?'points':'line',marker:effectiveMarkers(p,s)?{shape:s.style.markerShape,fill:s.style.markerFill,stroke:s.style.markerStroke}:null}))}:null};
 cache.set(p,state);return state;
}
export function visibilityDescription(before:ProjectDocument,after:ProjectDocument):{label:string;curveName:string}|undefined{
 const changed=after.series.filter(s=>{const old=before.series.find(b=>b.id===s.id);return old&&old.visible!==s.visible});
 if(changed.length&&changed.every(s=>s.visible===changed[0].visible))return {label:changed[0].visible?'CurveShown':'CurveHidden',curveName:changed.map(s=>s.name).join(', ')};
}
