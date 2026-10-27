import type {Calculation,ProjectDocument} from '../../domain/model';
import {dependencyIndex,seriesByDataset,type DataNodeKey} from '../../domain/dependencies';
export interface DataTreeNode {key:DataNodeKey;parent?:DataNodeKey;children:DataNodeKey[];datasetId?:string;calculationId?:string;seriesId?:string}
export interface DataTree {nodes:Map<DataNodeKey,DataTreeNode>;roots:DataNodeKey[]}
export function buildDataTree(p:ProjectDocument):DataTree{
 const index=dependencyIndex(p),curves=seriesByDataset(p.series),nodes=new Map<DataNodeKey,DataTreeNode>(),roots:DataNodeKey[]=[];
 for(const d of p.datasets){const key:DataNodeKey=`dataset:${d.id}`,producer=index.producers.get(d.id);nodes.set(key,{key,parent:producer?`calculation:${producer.id}`:undefined,children:[],datasetId:d.id,calculationId:producer?.id,seriesId:curves.get(d.id)?.[0]?.id});if(!producer)roots.push(key)}
 for(const c of p.calculations){const key:DataNodeKey=`calculation:${c.id}`,parent:DataNodeKey|undefined=c.sourceDatasetIds[0]?`dataset:${c.sourceDatasetIds[0]}`:undefined;nodes.set(key,{key,parent,children:[],calculationId:c.id,seriesId:c.resultDatasetId?curves.get(c.resultDatasetId)?.[0]?.id:undefined});if(!parent)roots.push(key)}
 for(const [did,series]of curves)if(series.length>1)for(const s of series){const key:DataNodeKey=`series:${s.id}`;nodes.set(key,{key,parent:`dataset:${did}`,children:[],datasetId:did,seriesId:s.id,calculationId:index.producers.get(did)?.id})}
 for(const node of nodes.values())if(node.parent){const parent=nodes.get(node.parent);if(parent)parent.children.push(node.key);else roots.push(node.key)}
 return {nodes,roots};
}
export interface TreeRow {key:DataNodeKey;depth:number;pos:number;size:number}
export function flattenDataTree(tree:DataTree,collapsed:ReadonlySet<DataNodeKey>,matches?:ReadonlySet<DataNodeKey>):TreeRow[]{
 const result:TreeRow[]=[],stack=tree.roots.map((key,i)=>({key,depth:1,pos:i+1,size:tree.roots.length})).reverse(),seen=new Set<DataNodeKey>();
 while(stack.length){const row=stack.pop()!;if(seen.has(row.key))continue;seen.add(row.key);if(matches&&!matches.has(row.key))continue;result.push(row);const node=tree.nodes.get(row.key)!;if(!collapsed.has(row.key)||matches)for(let i=node.children.length-1;i>=0;i--)stack.push({key:node.children[i],depth:row.depth+1,pos:i+1,size:node.children.length})}
 return result;
}
export function calculationName(p:ProjectDocument,c:Calculation,t:(key:string)=>string):string{
 const name=c.parameters.resultName;return typeof name==='string'&&name.trim()?name:dependencyIndex(p).datasets.get(c.resultDatasetId??'')?.name??t(c.kind);
}
export function parameterText(c:Calculation,t:(key:string)=>string):string{
 const parts:string[]=[];
 for(const key of ['method','window','degree','lambda','asymmetry','iterations','tolerance','prominence','distance','relativeHeight','fitRange','range','rowRange','step','duplicates','sortCopy','extrapolate']){
  const v=c.parameters[key];if(v===undefined||v===false)continue;
  const label=key==='fitRange'||key==='range'?'analysisXRange':key==='rowRange'?'analysisRows':['method','lambda','asymmetry','iterations','tolerance','prominence','distance','relativeHeight'].includes(key)?`signal.${key}`:key;
  parts.push(`${t(label)}: ${Array.isArray(v)?v.join('…'):typeof v==='boolean'?t('data.yes'):typeof v==='string'?t(key==='method'?`signal.${v}`:v):String(v)}`);
 }
 if(Array.isArray(c.parameters.xValues))parts.push(`${t('xValues')}: ${c.parameters.xValues.length}`);
 return parts.join(' · ');
}
