import type {ProjectDocument,Calculation} from '../../domain/model';
import type {PeakMeasurement} from '../../domain/signalTypes';
import {pointIndex} from '../../domain/geometry';
import {displayPoints} from '../chart/displayPoints';

/** Export only numerical geometry, visible summaries and styling, no provenance. */
export function renderProject(p:ProjectDocument):ProjectDocument{
 const extensions=Object.fromEntries(['textRotation','plotAreas','lineBreaks','seriesInterpolation','canvasTheme'].filter(key=>p.extensions[key]!==undefined).map(key=>[key,p.extensions[key]]));
 return {...p,extensions,calculations:p.calculations.map((c):Calculation=>({...c,parameters:c.kind==='area'?Object.fromEntries(['range','baselineDatasetId','sortCopy','duplicates','sourceUnits'].filter(key=>key in c.parameters).map(key=>[key,c.parameters[key]])):{},summary:c.kind==='area'?{integral:c.summary.integral}:{}}))};
}

/** A disposable display snapshot; never use it for saving or final export. */
export function previewProject(p:ProjectDocument,limit=5000):ProjectDocument{
 const linked=new Map<string,Set<string>>();
 for(const anchor of [...p.objects.flatMap(o=>o.anchors),p.legend.anchor])if(anchor.mode==='point'){let ids=linked.get(anchor.datasetId);if(!ids){ids=new Set();linked.set(anchor.datasetId,ids)}ids.add(anchor.pointId)}
 const rendered=renderProject(p),sourceBreaks=p.extensions.lineBreaks as Record<string,string[]>|undefined,previewBreaks:Record<string,string[]>={};
 return {...rendered,calculations:rendered.calculations.map(c=>c.data?.peaks?{...c,data:{peaks:limit>0?displayPoints(c.data.peaks,limit) as PeakMeasurement[]:[]}}:c),datasets:p.datasets.map(d=>{
  let points=limit>0?displayPoints(d.points,limit):[];const ids=linked.get(d.id);
  if(ids?.size){const index=pointIndex(d.points),selected=new Set(points);for(const id of ids){const i=index.get(id);if(i!==undefined)selected.add(d.points[i])}points=[...selected].sort((a,b)=>index.get(a.id)!-index.get(b.id)!)}
  const cuts=sourceBreaks?.[d.id];if(cuts?.length){if(points===d.points)previewBreaks[d.id]=cuts;else{const index=pointIndex(d.points),positions=cuts.map(id=>index.get(id)).filter((n):n is number=>n!==undefined).sort((a,b)=>a-b);let cut=0,previous=-1;for(const point of points){const at=index.get(point.id)!;while(cut<positions.length&&positions[cut]<=previous)cut++;if(cut<positions.length&&positions[cut]<=at)(previewBreaks[d.id]??=[]).push(point.id);previous=at}}}
  return points===d.points?d:{...d,points};
 }),extensions:sourceBreaks?{...rendered.extensions,lineBreaks:previewBreaks}:rendered.extensions};
}
