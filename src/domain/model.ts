import type {DiagramTable} from './diagramTable';
import metadata from '../../package.json' with {type:'json'};
import type {ScientificData,CalculationDisplay} from './signalTypes';
const {version}=metadata;
export type ID = string;
export interface XY { x: number; y: number }
export interface Point extends XY { id: ID }
export type Anchor = { mode: 'data'; x: number; y: number } | { mode: 'page'; pageX: number; pageY: number } | { mode: 'point'; datasetId: ID; pointId: ID; fallbackX: number; fallbackY: number; offsetXpx: number; offsetYpx: number };
export type Dash = 'solid' | 'dash' | 'dot' | 'dash-dot';
export type Marker = 'circle' | 'square' | 'triangle' | 'diamond' | 'cross' | 'plus';
export interface Axis { label: string; unit: string; scale: 'linear'; mode: 'auto' | 'manual'; min: number; max: number; tickMode: 'auto' | 'manual'; tickStep: number; tickOrigin: number; minorDivisions: number; grid: boolean; numberFormat: 'auto' | 'fixed' | 'scientific'; precision: number; strokeWidthPt: number; labelSizePt: number }
export interface Dataset { id: ID; name: string; role: 'raw' | 'derived'; source: { kind: 'import' | 'clipboard' | 'manual' | 'calculation'; displayName?: string; calculationId?: ID }; points: Point[] }
export interface SeriesStyle { stroke: string; strokeWidthPt: number; opacity: number; dash: Dash; markerShape: Marker; markerSizePt: number; markerFill: string; markerStroke: string; markerVisible: boolean }
export interface Series { id: ID; datasetId: ID; name: string; visible: boolean; includeInAutoRange: boolean; order: number; mode: 'line' | 'points' | 'line-points'; style: SeriesStyle }
export type ObjectType = 'text' | 'segment' | 'line' | 'arrow' | 'callout' | 'rectangle' | 'range-x' | 'range-y' | 'marker' | 'table';
export interface TextPart { text: string; baseline: 'normal' | 'sub' | 'super'; bold: boolean; italic: boolean }
export interface ObjectStyle { stroke: string; strokeWidthPt: number; dash: Dash; strokeOpacity: number; fill: string; fillOpacity: number; fontSizePt: number; fontFamily: 'Courier New'; arrowHead: 'none' | 'start' | 'end' | 'both'; markerShape: Marker; markerSizePt: number }
export interface DrawObject { table?:DiagramTable; id: ID; type: ObjectType; name: string; anchors: Anchor[]; geometry: { directionX?: number; directionY?: number; widthPx?:number;heightPx?:number }; text: TextPart[]; style: ObjectStyle; zIndex: number; visible: boolean; locked: boolean }
export type CalculationKind = 'linear-fit' | 'polynomial-fit' | 'exponential-fit' | 'power-fit' | 'savitzky-golay' | 'moving-average' | 'derivative' | 'integral' | 'interpolation' | 'statistics' | 'baseline' | 'peaks' | 'area';
export interface Calculation { id: ID; kind: CalculationKind; sourceDatasetIds: ID[]; resultDatasetId: ID | null; parameters: Record<string, unknown>; algorithmVersion: number; status: 'valid' | 'outdated' | 'invalid'; summary: Record<string, string | number | boolean | null>; data?:ScientificData; display?:CalculationDisplay }
export const PROJECT_SCHEMA_VERSION='1.1.0';
export interface Viewport { xMin: number; xMax: number; yMin: number; yMax: number }
export interface ProjectDocument { format: 'APIO_GRAPH_PROJECT'; schemaVersion: string; createdWith: { name: 'APIO GRAPH'; version: string }; project: { id: ID; title: string; createdAt: string; updatedAt: string }; page: { widthPx: number; heightPx: number; background: string; paddingPx: number }; axes: { x: Axis; y: Axis }; datasets: Dataset[]; series: Series[]; objects: DrawObject[]; calculations: Calculation[]; legend: { visible: boolean; anchor: Anchor }; viewport: Viewport; editor: { selectedObjectId: ID | null; showPointMarkers: boolean }; extensions: Record<string, unknown> }
export const id = (): ID => crypto.randomUUID();
export function createProject(): ProjectDocument {
  const date = new Date().toISOString();
  const axis = (label: string): Axis => ({label,unit:'',scale:'linear',mode:'auto',min:0,max:10,tickMode:'auto',tickStep:1,tickOrigin:0,minorDivisions:1,grid:true,numberFormat:'auto',precision:3,strokeWidthPt:0.8,labelSizePt:12});
  return {format:'APIO_GRAPH_PROJECT',schemaVersion:PROJECT_SCHEMA_VERSION,createdWith:{name:'APIO GRAPH',version},project:{id:id(),title:'Untitled',createdAt:date,updatedAt:date},page:{widthPx:1200,heightPx:800,background:'#FFFFFF',paddingPx:60},axes:{x:axis('X'),y:axis('Y')},datasets:[],series:[],objects:[],calculations:[],legend:{visible:true,anchor:{mode:'page',pageX:0.78,pageY:0.08}},viewport:{xMin:0,xMax:10,yMin:0,yMax:10},editor:{selectedObjectId:null,showPointMarkers:true},extensions:{}};
}
export function makeSeries(datasetId: ID, name: string, order: number): Series {
  const color='#000000';
  return {id:id(),datasetId,name,visible:true,includeInAutoRange:true,order,mode:'line',style:{stroke:color,strokeWidthPt:1.3,opacity:1,dash:'solid',markerShape:'circle',markerSizePt:3,markerFill:'#FFFFFF',markerStroke:color,markerVisible:false}};
}
export function addPairs(p: ProjectDocument, pairs: readonly XY[], name: string, source: Dataset['source']={kind:'manual'}): ProjectDocument {
  if(pairs.some(a=>!Number.isFinite(a.x)||!Number.isFinite(a.y))) throw new Error('INVALID_NUMBER');
  const d:Dataset={id:id(),name,role:'raw',source,points:pairs.map(a=>({...a,id:id()}))};
  return {...p,datasets:[...p.datasets,d],series:[...p.series,makeSeries(d.id,name,p.series.length)]};
}
export function makeObject(type: ObjectType, anchors: Anchor[], text=''): DrawObject {
  return {id:id(),type,name:type,anchors,geometry:type==='line'?{directionX:1,directionY:0}:{},text:text?[{text,baseline:'normal',bold:false,italic:false}]:[],style:{stroke:'#2F3339',strokeWidthPt:1,dash:'solid',strokeOpacity:1,fill:'#6686AA',fillOpacity:0.2,fontSizePt:13,fontFamily:'Courier New',arrowHead:type==='arrow'?'end':type==='callout'?'start':'none',markerShape:'circle',markerSizePt:4},zIndex:1,visible:true,locked:false};
}
