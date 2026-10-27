import type {OriginColumn,OriginModel,OriginNode} from './model';
import type {T} from '../../app/controls';
import {decodeOriginString} from './resources';
export function originName(n:OriginNode,encoding:string,t?:T):string{const name=decodeOriginString(n.nameHex,typeof n.properties.nameEncoding==='string'?n.properties.nameEncoding:encoding)?.replace(/\0+$/,'');if(name)return name;const suffix=n.sourceId??n.id.split(':').pop(),number=Number(suffix);return `${t?t(`originKind.${n.kind}`):n.kind} ${Number.isSafeInteger(number)&&number>=0?number+1:suffix}`}
export function originText(value:unknown,encoding:string):string{return typeof value==='string'?decodeOriginString(value,encoding)?.replace(/\0+$/,'')??'':''}
export interface OriginIndex {nodes:Map<string,OriginNode>;parents:Map<string,string>;children:Map<string|null,OriginNode[]>;columns:Map<string,OriginColumn>;links:Map<string,Map<string,string>>}
const indices=new WeakMap<OriginModel,OriginIndex>();
export function originIndex(model:OriginModel):OriginIndex{
 let result=indices.get(model);if(result)return result;
 const nodes=new Map(model.nodes.map(n=>[n.id,n])),parents=new Map(model.relations.filter(r=>r.kind==='contains'&&r.to).map(r=>[r.to!,r.from])),children=new Map<string|null,OriginNode[]>(),links=new Map<string,Map<string,string>>();
 for(const n of model.nodes){const parent=parents.get(n.id)??n.parentId,list=children.get(parent)??[];list.push(n);children.set(parent,list)}
 for(const r of model.relations){if(!r.to)continue;const map=links.get(r.from)??new Map();map.set(r.kind,r.to);links.set(r.from,map)}
 for(const n of model.nodes)if(n.parentId&&!parents.has(n.id))parents.set(n.id,n.parentId);
 result={nodes,parents,children,links,columns:new Map(model.columns.map(c=>[c.nodeId,c]))};indices.set(model,result);return result;
}
export function sheetColumns(model:OriginModel,selected:OriginNode):OriginColumn[]{const index=originIndex(model);return model.columns.filter(c=>c.nodeId===selected.id||index.nodes.get(c.nodeId)?.parentId===selected.id).sort((a,b)=>Number(index.nodes.get(a.nodeId)?.properties.columnOrder??-1)-Number(index.nodes.get(b.nodeId)?.properties.columnOrder??-1))}
export interface XYLink {curveId?:string;layerId?:string;x:string|null;y:string;errorX?:string;errorY?:string;rowIndex?:boolean}
export interface PageResolution {graph:OriginNode;layers:OriginNode[];links:XYLink[];issues:{nodeId:string;code:string}[]}
export function resolvePage(model:OriginModel,id:string):PageResolution{
 const index=originIndex(model);let graph=index.nodes.get(id);while(graph&&graph.kind!=='graph')graph=graph.parentId?index.nodes.get(graph.parentId):undefined;if(!graph)throw new Error('ORIGIN_PAGE_MISSING');
 const layers=(index.children.get(graph.id)??[]).filter(n=>n.kind==='layer'),links:XYLink[]=[],issues:PageResolution['issues']=[];
 for(const layer of layers){const axes=[layer.properties.xAxis,layer.properties.yAxis] as ({scale?:number;min?:number;max?:number}|undefined)[];
  const unsupported=graph.properties.is3D===true||layer.properties.exchangedAxes===true||layer.properties.waterfall===true||axes.some(a=>!a||a.scale!==0||!Number.isFinite(a.min)||!Number.isFinite(a.max)||!(Number(a.min)<Number(a.max)));
  if(unsupported){issues.push({nodeId:layer.id,code:'ORIGIN_LAYER_UNSUPPORTED'});continue}
  for(const curve of index.children.get(layer.id)??[]){if(curve.kind!=='curve')continue;const rel=index.links.get(curve.id),x=rel?.get('x'),y=rel?.get('y');
   if(!x||!y||!index.columns.has(x)||!index.columns.has(y)){issues.push({nodeId:curve.id,code:'ORIGIN_XY_UNRESOLVED'});continue}
   if(![200,201,202].includes(Number(curve.properties.plotType))||![0,1,8,9,11,12,13,14].includes(Number(curve.properties.lineConnect??1))){issues.push({nodeId:curve.id,code:'ORIGIN_PLOT_UNSUPPORTED'});continue}
   links.push({curveId:curve.id,layerId:layer.id,x,y});
  }
 }
 if(!layers.length)issues.push({nodeId:graph.id,code:'ORIGIN_LAYER_UNSUPPORTED'});return {graph,layers,links,issues};
}
export function diagnosticReport(model:OriginModel):string{
 const kinds:Record<string,number>={};for(const n of model.nodes)kinds[n.kind]=(kinds[n.kind]??0)+1;
 return JSON.stringify({source:{sha256:model.source.sha256,size:model.source.size,format:model.source.detected},decoder:model.decoder,counts:kinds,columns:model.columns.length,relations:{resolved:model.relations.filter(r=>r.resolved).length,unresolved:model.relations.filter(r=>!r.resolved).length},coverage:model.coverage,diagnostics:model.diagnostics,rendering:{supported:'2D linear XY: line, scatter, line + symbols; page layer rectangles',unverified:['other generations','OPJU decoding','3D','nonlinear axes','Origin formula execution','exact Origin typography']}},null,2);
}
