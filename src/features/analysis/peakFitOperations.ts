import {id,makeSeries,schemaAtLeast,type Calculation,type ProjectDocument,type Point} from '../../domain/model';
import {MathError,type CalculationResult} from '../../domain/math';
import {datasetUnits,dependentCalculations,dependencyIndex} from '../../domain/dependencies';
import {addCalculation} from './operations';
import {replaceCalculation} from './recalculation';
const palette=['#476E98','#687E58','#967A42','#887197','#3F8D92','#B36544','#955168','#616A8B'];
export function applyPeakFit(p:ProjectDocument,sourceId:string,parameters:Record<string,unknown>,result:CalculationResult,name:string,labels:{component:string;residual:string;baseline:string},editingId?:string):ProjectDocument{
 if(!result.data?.peakFit||!result.outputs)throw new MathError('PEAK_FIT_RESULT_MISSING');
 const previous=editingId?p.calculations.find(c=>c.id===editingId&&c.kind==='peak-fit'):undefined;if(editingId&&!previous)throw new MathError('MATH_RESULT_MISSING');
 let next=previous?replaceCalculation(p,previous.id,parameters,result,name):addCalculation(p,sourceId,'peak-fit',parameters,result,name);
 const master=previous?next.calculations.find(c=>c.id===previous.id)!:next.calculations.at(-1)!,sourceDatasetId=master.sourceDatasetIds[0],oldOutputs=p.calculations.filter(c=>c.kind==='peak-fit-output'&&c.parameters.masterCalculationId===master.id),used=new Set<string>();
 for(const output of result.outputs){
  const old=oldOutputs.find(c=>c.parameters.output===output.output&&(output.output!=='component'||c.parameters.componentIndex===output.componentIndex)),caption=output.output==='component'?`${labels.component} ${(output.componentIndex??0)+1}`:labels[output.output],cid=old?.id??id(),did=old?.resultDatasetId??id(),oldDataset=old?next.datasets.find(d=>d.id===did):undefined;
  used.add(cid);const points=!oldDataset&&output.points.every(point=>'id'in point&&typeof point.id==='string')?output.points as Point[]:output.points.map((point,i)=>{const key=oldDataset?.points[i]?.x===point.x?oldDataset.points[i].id:'id'in point&&typeof point.id==='string'?point.id:id();return 'id'in point&&point.id===key?point as Point:{...point,id:key}});
  const attached=oldDataset?[...p.objects.flatMap(o=>o.anchors),p.legend.anchor].filter(a=>a.mode==='point'&&a.datasetId===did):[];if(attached.length){const ids=new Set(points.map(point=>point.id));if(attached.some(a=>a.mode==='point'&&!ids.has(a.pointId)))throw new MathError('MATH_ANCHORED_RESULT_SHAPE')}
  const calculation:Calculation={id:cid,kind:'peak-fit-output',sourceDatasetIds:[master.resultDatasetId!,sourceDatasetId],resultDatasetId:did,parameters:{masterCalculationId:master.id,output:output.output,...(output.componentIndex!==undefined?{componentIndex:output.componentIndex}:{}),sourceUnits:datasetUnits(p,sourceDatasetId),resultName:old?.parameters.resultName??`${name} · ${caption}`.slice(0,300),calculatedAt:new Date().toISOString()},algorithmVersion:1,status:'valid',summary:{n:points.length,output:output.output}};
  if(old){next={...next,calculations:next.calculations.map(c=>c.id===cid?calculation:c),datasets:next.datasets.map(d=>d.id===did?{...d,points}:d)}}
  else{const outputName=String(calculation.parameters.resultName),series=makeSeries(did,outputName,next.series.length),color=output.output==='residual'?'#A04E57':output.output==='baseline'?'#777D58':palette[((output.componentIndex??0)+1)%palette.length];series.style={...series.style,stroke:color,markerStroke:color,dash:output.output==='baseline'?'dash':'solid'};next={...next,calculations:[...next.calculations,calculation],datasets:[...next.datasets,{id:did,name:outputName,role:'derived',source:{kind:'calculation',calculationId:cid},points}],series:[...next.series,series]}}
 }
 const removed=oldOutputs.filter(c=>!used.has(c.id)),removedDatasets=new Set(removed.map(c=>c.resultDatasetId)),index=dependencyIndex(p);
 for(const c of removed){if(c.resultDatasetId&&(dependentCalculations(index,[c.resultDatasetId]).size||[...p.objects.flatMap(o=>o.anchors),p.legend.anchor].some(a=>a.mode==='point'&&a.datasetId===c.resultDatasetId)))throw new MathError('PEAK_FIT_OUTPUT_IN_USE')}
 if(removed.length){const ids=new Set(removed.map(c=>c.id));next={...next,calculations:next.calculations.filter(c=>!ids.has(c.id)),datasets:next.datasets.filter(d=>!removedDatasets.has(d.id)),series:next.series.filter(s=>!removedDatasets.has(s.datasetId))}}
 if(!previous)next={...next,series:next.series.map(s=>s.datasetId===master.resultDatasetId?{...s,style:{...s.style,stroke:palette[0],markerStroke:palette[0]}}:s)};
 return{...next,schemaVersion:schemaAtLeast(next.schemaVersion,'1.3.0')};
}
