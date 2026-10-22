import type {ProjectDocument} from '../../domain/model';
import {pointIndex} from '../../domain/geometry';
import {displayPoints} from '../chart/displayPoints';

/** Only rotation is rendered; provenance and recovery data never enter export jobs. */
export function renderProject(p:ProjectDocument):ProjectDocument{
 return {...p,extensions:p.extensions.textRotation===undefined?{}:{textRotation:p.extensions.textRotation},calculations:p.calculations.map(c=>({...c,parameters:{},summary:{}}))};
}

/** A disposable display snapshot; never use it for saving or final export. */
export function previewProject(p:ProjectDocument,limit=5000):ProjectDocument{
 const linked=new Map<string,Set<string>>();
 for(const anchor of [...p.objects.flatMap(o=>o.anchors),p.legend.anchor])if(anchor.mode==='point'){let ids=linked.get(anchor.datasetId);if(!ids){ids=new Set();linked.set(anchor.datasetId,ids)}ids.add(anchor.pointId)}
 return {...renderProject(p),datasets:p.datasets.map(d=>{
  let points=limit>0?displayPoints(d.points,limit):[];const ids=linked.get(d.id);
  if(ids?.size){const index=pointIndex(d.points),selected=new Set(points);for(const id of ids){const i=index.get(id);if(i!==undefined)selected.add(d.points[i])}points=[...selected].sort((a,b)=>index.get(a.id)!-index.get(b.id)!)}
  return points===d.points?d:{...d,points};
 })};
}
