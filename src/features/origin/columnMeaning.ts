import type {OriginModel} from './model';
import {originIndex,originName,originText} from './resolve';
import {originPlainText} from './convert';
export interface ColumnUse {axis:'x'|'y';pageId:string;page:string;layerId:string;layer:string;label:string;unit:string}
const cache=new WeakMap<OriginModel,Map<string,Map<string,ColumnUse[]>>>();
/** Display hints come from exact curve→column relations; stored names and roles stay original. */
export function originColumnUses(model:OriginModel,encoding:string):Map<string,ColumnUse[]>{
 const byEncoding=cache.get(model)??new Map<string,Map<string,ColumnUse[]>>();cache.set(model,byEncoding);const existing=byEncoding.get(encoding);if(existing)return existing;const index=originIndex(model),result=new Map<string,ColumnUse[]>();
 for(const r of model.relations){if(!r.resolved||!r.to||(r.kind!=='x'&&r.kind!=='y'))continue;const curve=index.nodes.get(r.from),column=index.nodes.get(r.to);if(curve?.kind!=='curve'||!column)continue;const layer=index.nodes.get(index.parents.get(curve.id)??curve.parentId??''),page=layer?index.nodes.get(index.parents.get(layer.id)??layer.parentId??''):undefined;if(layer?.kind!=='layer'||page?.kind!=='graph')continue;const axis=r.kind,unit=originPlainText(originText(column.properties.unitHex,encoding)),raw=originPlainText(originText(index.nodes.get(`${layer.id}:axis:${axis}`)?.properties.textHex,encoding)),label=raw&&!raw.includes('%(')?raw:originPlainText(originText(column.properties.longNameHex,encoding))||unit||axis.toUpperCase(),list=result.get(column.id)??[];if(!list.some(u=>u.layerId===layer.id&&u.axis===axis))list.push({axis,pageId:page.id,page:originName(page,encoding),layerId:layer.id,layer:originName(layer,encoding),label,unit});result.set(column.id,list)}
 byEncoding.set(encoding,result);return result;
}
