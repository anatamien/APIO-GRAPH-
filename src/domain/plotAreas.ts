import type {ProjectDocument,Viewport} from './model';
import check from './generated/aphValidator.js';

/** General page layout, independent of an import format. Coordinates describe plot rectangles. */
export interface AxisDisplay {x:{numbers:boolean;line:boolean;opposite:boolean};y:{numbers:boolean;line:boolean;opposite:boolean;omitMinimum?:boolean}}
export interface PlotArea {id:string;name:string;frame:[number,number,number,number];axes:ProjectDocument['axes'];viewport:Viewport;seriesIds:string[];objectIds:string[];legend:ProjectDocument['legend'];legendStyle?:{fontSizePt:number;lineHeightPx:number};axisDisplay?:AxisDisplay}
export interface PlotAreas {version:1;activeId:string;areas:PlotArea[]}
export function plotAreas(p:ProjectDocument):PlotAreas|undefined{return p.extensions.plotAreas as PlotAreas|undefined}
const selections=new WeakMap<object,WeakMap<string[],unknown[]>>();
function selected<T extends {id:string}>(all:T[],ids:string[]):T[]{let cache=selections.get(all);if(!cache){cache=new WeakMap();selections.set(all,cache)}let list=cache.get(ids);if(!list){const set=new Set(ids);list=all.filter(v=>set.has(v.id));cache.set(ids,list)}return list as T[]}
export function areaProject(p:ProjectDocument,a:PlotArea,frame=a.frame,bounds=[0,0,1,1]):ProjectDocument{
 const active=plotAreas(p)?.activeId===a.id;
 const joinedBelow=plotAreas(p)?.areas.some(b=>b!==a&&Math.abs(a.frame[3]-b.frame[1])<.002&&Math.abs(a.frame[0]-b.frame[0])<.002);
 const axisDisplay=joinedBelow&&a.axisDisplay?{...a.axisDisplay,y:{...a.axisDisplay.y,omitMinimum:true}}:a.axisDisplay;
 const local=(anchor:ProjectDocument['legend']['anchor'])=>anchor.mode==='page'?{...anchor,pageX:(anchor.pageX-bounds[0])/(bounds[2]-bounds[0]),pageY:(anchor.pageY-bounds[1])/(bounds[3]-bounds[1])}:anchor;
 return {...p,axes:active?p.axes:a.axes,viewport:active?p.viewport:a.viewport,series:selected(p.series,a.seriesIds),objects:selected(p.objects,a.objectIds).map(o=>({...o,anchors:o.anchors.map(local)})),legend:{...a.legend,anchor:local(a.legend.anchor)},extensions:{...p.extensions,plotAreas:undefined,plotAreaSeries:a.seriesIds,plotFrame:frame,legendStyle:a.legendStyle,axisDisplay}};
}
export function syncArea(p:ProjectDocument):ProjectDocument{
 const layout=plotAreas(p);if(!layout)return p;
 const series=new Set(p.series.map(s=>s.id)),objects=new Set(p.objects.map(o=>o.id));
 const ownedSeries=new Set(layout.areas.flatMap(a=>a.seriesIds)),ownedObjects=new Set(layout.areas.flatMap(a=>a.objectIds));
 const bySeries=new Map(p.series.map(s=>[s.id,s])),owners=new Map<string,string>();for(const a of layout.areas)for(const sid of a.seriesIds){const dataset=bySeries.get(sid)?.datasetId;if(dataset&&!owners.has(dataset))owners.set(dataset,a.id)}
 const additions=p.series.filter(s=>!ownedSeries.has(s.id)).map(s=>{const source=p.calculations.find(c=>c.resultDatasetId===s.datasetId)?.sourceDatasetIds[0],area=owners.get(s.datasetId)??(source?owners.get(source):undefined)??layout.activeId;owners.set(s.datasetId,area);return {id:s.id,area}});
 const keep=(before:string[],after:string[])=>before.length===after.length&&before.every((s,i)=>s===after[i])?before:after;
 const areas=layout.areas.map(a=>{const seriesIds=keep(a.seriesIds,[...a.seriesIds.filter(id=>series.has(id)),...additions.filter(s=>s.area===a.id).map(s=>s.id)]),objectIds=keep(a.objectIds,[...a.objectIds.filter(id=>objects.has(id)),...(a.id===layout.activeId?p.objects.filter(o=>!ownedObjects.has(o.id)).map(o=>o.id):[])]);if(seriesIds===a.seriesIds&&objectIds===a.objectIds&&(a.id!==layout.activeId||a.axes===p.axes&&a.viewport===p.viewport&&a.legend===p.legend))return a;return {...a,seriesIds,objectIds,...(a.id===layout.activeId?{axes:p.axes,viewport:p.viewport,legend:p.legend}:{})}});
 return {...p,extensions:{...p.extensions,plotAreas:{...layout,areas}}};
}
export function activateArea(p:ProjectDocument,id:string):ProjectDocument{
 const current=syncArea(p),layout=plotAreas(current),area=layout?.areas.find(a=>a.id===id);if(!area||!layout)return p;
 return {...current,axes:area.axes,viewport:area.viewport,legend:area.legend,extensions:{...current.extensions,plotAreas:{...layout,activeId:id}}};
}
export function applyArea(p:ProjectDocument,id:string,apply:(p:ProjectDocument)=>ProjectDocument,frame?:PlotArea['frame'],bounds=[0,0,1,1]):ProjectDocument{
 const base=activateArea(p,id),a=plotAreas(base)!.areas.find(a=>a.id===id)!,part=areaProject(base,a,frame??a.frame,bounds),next=apply(part);
 const global=(anchor:ProjectDocument['legend']['anchor'])=>anchor.mode==='page'?{...anchor,pageX:bounds[0]+anchor.pageX*(bounds[2]-bounds[0]),pageY:bounds[1]+anchor.pageY*(bounds[3]-bounds[1])}:anchor;
 return syncArea({...base,axes:next.axes,viewport:next.viewport,legend:{...next.legend,anchor:global(next.legend.anchor)},datasets:next.datasets,calculations:next.calculations,series:[...base.series.filter(s=>!a.seriesIds.includes(s.id)),...next.series],objects:[...base.objects.filter(o=>!a.objectIds.includes(o.id)),...next.objects.map(o=>({...o,anchors:o.anchors.map(global)}))],extensions:{...base.extensions,...next.extensions,plotAreas:plotAreas(base),plotFrame:undefined}});
}
export function validateAreas(p:ProjectDocument):string[]{
 const breaks=p.extensions.lineBreaks;if(breaks!==undefined&&(!breaks||typeof breaks!=='object'||Array.isArray(breaks)||Object.values(breaks).some(v=>!Array.isArray(v)||v.length>1000000||v.some(id=>typeof id!=='string'))))return ['/extensions/lineBreaks: INVALID_BREAKS'];
 const units=p.extensions.datasetUnits;if(units!==undefined&&(!units||typeof units!=='object'||Array.isArray(units)||Object.values(units).some(v=>!v||typeof v!=='object'||typeof v.x!=='string'||typeof v.y!=='string')))return ['/extensions/datasetUnits: INVALID_UNITS'];
 const validDisplay=(value:unknown)=>value===undefined||!!value&&typeof value==='object'&&['x','y'].every(dim=>{const item=(value as Record<string,unknown>)[dim] as Record<string,unknown>|undefined;return !!item&&typeof item==='object'&&['numbers','line','opposite'].every(k=>typeof item[k]==='boolean')&&(item.omitMinimum===undefined||typeof item.omitMinimum==='boolean')});
 const validLegend=(value:unknown)=>value===undefined||!!value&&typeof value==='object'&&Object.entries(value).length===2&&['fontSizePt','lineHeightPx'].every(k=>{const v=(value as Record<string,unknown>)[k];return typeof v==='number'&&Number.isFinite(v)&&v>0&&v<=1000});
 if(!validDisplay(p.extensions.axisDisplay)||!validLegend(p.extensions.legendStyle))return ['/extensions: INVALID_PAGE_STYLE'];
 const frame=p.extensions.plotFrame;if(frame!==undefined&&(!Array.isArray(frame)||frame.length!==4||!frame.every(v=>typeof v==='number'&&Number.isFinite(v))||!(frame[0]<frame[2]&&frame[1]<frame[3])))return ['/extensions/plotFrame: INVALID_FRAME'];
 const interpolation=p.extensions.seriesInterpolation;if(interpolation!==undefined&&(!interpolation||typeof interpolation!=='object'||Array.isArray(interpolation)||Object.values(interpolation).some(v=>!['basis','natural','step','step-before','step-after'].includes(String(v)))))return ['/extensions/seriesInterpolation: INVALID_METHOD'];
 const raw=p.extensions.plotAreas;if(raw===undefined)return [];
 const invalid=['/extensions/plotAreas: INVALID_LAYOUT'];
 if(!raw||typeof raw!=='object')return invalid;const l=raw as PlotAreas;
 if(l.version!==1||!Array.isArray(l.areas)||!l.areas.length||l.areas.length>1000||typeof l.activeId!=='string')return invalid;
 const ids=new Set<string>();for(const a of l.areas){if(!a||typeof a.id!=='string'||ids.has(a.id)||typeof a.name!=='string'||!Array.isArray(a.frame)||a.frame.length!==4||!a.frame.every(v=>typeof v==='number'&&Number.isFinite(v)&&v>=0&&v<=1)||!(a.frame[0]<a.frame[2]&&a.frame[1]<a.frame[3])||!a.axes?.x||!a.axes?.y||!a.viewport||!Object.values(a.viewport).every(Number.isFinite)||!(a.viewport.xMin<a.viewport.xMax&&a.viewport.yMin<a.viewport.yMax)||!Array.isArray(a.seriesIds)||!a.seriesIds.every(id=>p.series.some(s=>s.id===id))||!Array.isArray(a.objectIds)||!a.objectIds.every(id=>p.objects.some(o=>o.id===id))||!a.legend||!check({...p,datasets:[],series:[],objects:[],calculations:[],extensions:{},axes:a.axes,viewport:a.viewport,legend:a.legend}))return invalid;ids.add(a.id)}
 if(l.areas.some(a=>!validDisplay(a.axisDisplay)||!validLegend(a.legendStyle)))return invalid;return ids.has(l.activeId)?[]:invalid;
}

export function areaCalculations(p:ProjectDocument){const ids=p.extensions.plotAreaSeries as string[]|undefined;if(!ids)return p.calculations;const series=new Set(ids),datasets=new Set(p.series.map(s=>s.datasetId));return p.calculations.filter(c=>{const sources=c.parameters.sourceSeriesIds;return Array.isArray(sources)&&sources.length?series.has(String(sources[0])):datasets.has(c.sourceDatasetIds[0])})}
