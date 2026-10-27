import {tableTemplate,validTableTemplate,applyTableTemplate,type TableTemplate} from '../../domain/diagramTable';
import {createProject,addPairs,makeObject,type ProjectDocument,type ObjectType,type ObjectStyle,type SeriesStyle,type Series,type Axis,type CalculationKind} from '../../domain/model';
import type {ExportSize} from '../../domain/exportDimensions';
import check from '../../domain/generated/aphValidator.js';

type AxisStyle=Pick<Axis,'grid'|'numberFormat'|'precision'|'minorDivisions'|'strokeWidthPt'|'labelSizePt'|'tickMode'|'tickStep'>;
export interface ExportPreferences {format:'png'|'jpeg'|'svg';mode:'original'|'grayscale'|'strict-bw';size:ExportSize;quality:number;transparent:boolean}
interface Typeface {bold:boolean;italic:boolean}
export interface ToolPreferences {version:1;enabled:boolean;table?:TableTemplate;objects:Partial<Record<ObjectType,ObjectStyle>>;typefaces:Partial<Record<ObjectType,Typeface>>;series?:{style:SeriesStyle;mode:Series['mode']};axes:Partial<Record<'x'|'y',AxisStyle>>;analysis:Partial<Record<CalculationKind,Record<string,number|string|boolean>>>;export?:ExportPreferences}
const key='apio.tool-preferences.v1',types:ObjectType[]=['text','segment','line','arrow','callout','rectangle','range-x','range-y','marker','table'];
const axisKeys=['grid','numberFormat','precision','minorDivisions','strokeWidthPt','labelSizePt','tickMode','tickStep'] as const;
let cache:ToolPreferences|undefined,rangeNotice=false;
const blank=():ToolPreferences=>({version:1,enabled:true,objects:{},typefaces:{},axes:{},analysis:{}});
function safeAnalysis(kind:CalculationKind,parameters:unknown):Record<string,number|string|boolean>{
 const source=parameters&&typeof parameters==='object'?parameters as Record<string,unknown>:{},result:Record<string,number|string|boolean>={};
 const keys:Partial<Record<CalculationKind,string[]>>={'polynomial-fit':['degree'],'savitzky-golay':['degree','window'],'moving-average':['window'],baseline:['degree','lambda','asymmetry','iterations','tolerance'],peaks:['direction','relativeHeight','includeIncomplete']};
 for(const key of keys[kind]??[]){const value=source[key];if(key==='direction'){if(value==='max'||value==='min')result[key]=value}else if(key==='includeIncomplete'){if(typeof value==='boolean')result[key]=value}else if(typeof value==='number'&&Number.isFinite(value)){
  const valid=key==='degree'?Number.isInteger(value)&&value>=(kind==='polynomial-fit'?1:0)&&value<=(kind==='polynomial-fit'?3:12):key==='window'?Number.isInteger(value)&&value>=1&&value<=100001&&value%2===1:key==='iterations'?Number.isInteger(value)&&value>=1&&value<=1000:key==='asymmetry'?value>0&&value<1:key==='relativeHeight'?value>0&&value<=1:value>0&&value<=1e15;
  if(valid)result[key]=value;
 }}return result;
}
const axisStyle=(axis:Axis):AxisStyle=>Object.fromEntries(axisKeys.map(k=>[k,axis[k]])) as AxisStyle;
const equal=(a:unknown,b:unknown)=>a===b||JSON.stringify(a)===JSON.stringify(b);
function validExport(raw:unknown):raw is ExportPreferences{
 if(!raw||typeof raw!=='object')return false;const e=raw as ExportPreferences,s=e.size;
 return ['png','jpeg','svg'].includes(e.format)&&['original','grayscale','strict-bw'].includes(e.mode)&&typeof e.transparent==='boolean'&&typeof e.quality==='number'&&e.quality>=60&&e.quality<=100&&!!s&&typeof s==='object'&&['width','height','dpi','ratio'].every(k=>Number.isFinite(s[k as keyof ExportSize]))&&s.width>=100&&s.height>=100&&s.width<=30000&&s.height<=30000&&s.width*s.height<=100000000&&s.dpi>=36&&s.dpi<=2400&&s.ratio>0&&['px','mm'].includes(s.units)&&typeof s.locked==='boolean';
}
/** Local device settings contain styling only. Never store coordinates, names, IDs or measurements. */
export function loadToolPreferences():ToolPreferences{
 if(cache)return cache;const result=blank();
 try{
  const text=localStorage.getItem(key);if(!text||text.length>128000)return cache=result;const raw=JSON.parse(text);if(!raw||raw.version!==1)return cache=result;
  if(validTableTemplate(raw.table))result.table={padding:raw.table.padding,fillOpacity:raw.table.fillOpacity,fill:raw.table.fill,headerFill:raw.table.headerFill,grid:{...raw.table.grid},rowSizes:[...raw.table.rowSizes],columnSizes:[...raw.table.columnSizes]};
  result.enabled=typeof raw.enabled==='boolean'?raw.enabled:true;
  const template=addPairs(createProject(),[{x:0,y:0}],'Style validation'),object=makeObject('text',[{mode:'page',pageX:.1,pageY:.1}]);
  for(const type of types){const style=raw.objects?.[type];if(style&&check({...template,objects:[{...object,style}]}))result.objects[type]=style;const face=raw.typefaces?.[type];if(face&&typeof face.bold==='boolean'&&typeof face.italic==='boolean')result.typefaces[type]={bold:face.bold,italic:face.italic}}
  if(raw.series&&check({...template,series:[{...template.series[0],style:raw.series.style,mode:raw.series.mode}]}))result.series={style:raw.series.style,mode:raw.series.mode};
  for(const dim of ['x','y'] as const){const style=raw.axes?.[dim];if(style&&typeof style==='object'&&Object.keys(style).every(k=>(axisKeys as readonly string[]).includes(k))&&check({...template,axes:{...template.axes,[dim]:{...template.axes[dim],...style}}}))result.axes[dim]=style}
  for(const kind of ['polynomial-fit','savitzky-golay','moving-average','baseline','peaks'] as CalculationKind[]){const values=safeAnalysis(kind,raw.analysis?.[kind]);if(Object.keys(values).length)result.analysis[kind]=values}
  if(validExport(raw.export))result.export={format:raw.export.format,mode:raw.export.mode,size:{width:raw.export.size.width,height:raw.export.size.height,dpi:raw.export.size.dpi,units:raw.export.size.units,locked:raw.export.size.locked,ratio:raw.export.size.ratio},quality:raw.export.quality,transparent:raw.export.transparent};
 }catch{/* Missing/corrupt device preferences never block a document. */}
 return cache=result;
}
function write(value:ToolPreferences){cache=value;try{localStorage.setItem(key,JSON.stringify(value))}catch{/* Editing remains available when optional storage is full. */}}
export function reloadToolPreferences(){cache=undefined;rangeNotice=false}
export function enableToolPreferences(enabled:boolean){write({...loadToolPreferences(),enabled})}
export function resetToolPreferences(){write({...blank(),enabled:loadToolPreferences().enabled})}
export function consumePreferenceNotice(){const result=rangeNotice;rangeNotice=false;return result}

/** Apply templates exclusively to newly created IDs, never to existing project objects. */
export function applyCreationPreferences(before:ProjectDocument,next:ProjectDocument):ProjectDocument{
 const prefs=loadToolPreferences();if(!prefs.enabled)return next;const oldObjects=new Set(before.objects.map(o=>o.id)),oldSeries=new Set(before.series.map(s=>s.id));let changed=false;
 const objects=next.objects.map(o=>{if(oldObjects.has(o.id))return o;const style=prefs.objects[o.type],face=prefs.typefaces[o.type],table=o.table&&prefs.table?applyTableTemplate(o.table,prefs.table):o.table;if(!style&&!face&&table===o.table)return o;changed=true;return {...o,...(table?{table}:{}),style:style?{...o.style,...style}:o.style,text:face?o.text.map(part=>({...part,...face})):o.text}});
 const series=next.series.map(s=>{if(oldSeries.has(s.id)||!prefs.series)return s;changed=true;return {...s,style:{...s.style,...prefs.series.style},mode:prefs.series.mode}});
 return changed?{...next,objects,series}:next;
}
/** Used only for a newly created graph; loading .aph and Origin bypasses this path. */
export function applyGraphPreferences(project:ProjectDocument):ProjectDocument{
 const prefs=loadToolPreferences();if(!prefs.enabled)return project;const next=applyCreationPreferences({...project,objects:[],series:[]},project),axes={...next.axes};
 for(const dim of ['x','y'] as const){const style=prefs.axes[dim];if(!style)continue;let axis={...axes[dim],...style};const min=dim==='x'?next.viewport.xMin:next.viewport.yMin,max=dim==='x'?next.viewport.xMax:next.viewport.yMax;
  if(axis.tickMode==='manual'&&(!(axis.tickStep>0)||(max-min)/axis.tickStep>10000||min+axis.tickStep===min||max-axis.tickStep===max)){axis={...axis,tickMode:'auto',tickStep:axes[dim].tickStep};rangeNotice=true}axes[dim]=axis;
 }
 return {...next,axes};
}
/** Called only after the project command successfully passes validation. */
export function rememberAppliedPreferences(before:ProjectDocument,after:ProjectDocument){
 if(before===after)return;const current=loadToolPreferences();if(!current.enabled)return;const next={...current,objects:{...current.objects},typefaces:{...current.typefaces},axes:{...current.axes},analysis:{...current.analysis}},oldObjects=new Map(before.objects.map(o=>[o.id,o])),oldSeries=new Map(before.series.map(s=>[s.id,s]));let changed=false;
 for(const object of after.objects){const previous=oldObjects.get(object.id);if(object.table&&previous?.table!==object.table){const template=tableTemplate(object.table);if(!equal(next.table,template)){next.table=template;changed=true}}if(previous?.style!==object.style&&!equal(previous?.style,object.style)&&!equal(next.objects[object.type],object.style)){next.objects[object.type]={...object.style};changed=true}
  if(previous?.text!==object.text&&object.text.length&&object.text.every(p=>p.bold===object.text[0].bold&&p.italic===object.text[0].italic)){const face={bold:object.text[0].bold,italic:object.text[0].italic};if(!equal(next.typefaces[object.type],face)){next.typefaces[object.type]=face;changed=true}}
 }
 for(const series of after.series){const previous=oldSeries.get(series.id);if((previous?.style!==series.style||previous?.mode!==series.mode)&&(!equal(previous?.style,series.style)||previous?.mode!==series.mode)){const value={style:{...series.style},mode:series.mode};if(!equal(next.series,value)){next.series=value;changed=true}}}
 for(const dim of ['x','y']as const)if(before.axes[dim]!==after.axes[dim]){const style=axisStyle(after.axes[dim]);if(!equal(axisStyle(before.axes[dim]),style)&&!equal(next.axes[dim],style)){next.axes[dim]=style;changed=true}}
 const oldCalculations=new Map(before.calculations.map(c=>[c.id,c]));for(const calculation of after.calculations)if(calculation.status==='valid'&&oldCalculations.get(calculation.id)?.parameters!==calculation.parameters){const values=safeAnalysis(calculation.kind,calculation.parameters);if(Object.keys(values).length&&!equal(next.analysis[calculation.kind],values)){next.analysis[calculation.kind]=values;changed=true}}
 if(changed)write(next);
}
export function exportPreferences():ExportPreferences|undefined{const prefs=loadToolPreferences();return prefs.enabled?prefs.export:undefined}
export function rememberExportPreferences(value:ExportPreferences){if(loadToolPreferences().enabled&&validExport(value))write({...loadToolPreferences(),export:structuredClone(value)})}
/** Range, sorting, source references, amplitude thresholds and result names are deliberately excluded. */
export function analysisPreferences(kind:CalculationKind,pointCount?:number):Record<string,unknown>{const prefs=loadToolPreferences(),result={...(prefs.enabled?prefs.analysis[kind]:{})};if(pointCount!==undefined&&typeof result.window==='number'&&result.window>pointCount){const max=Math.max(1,pointCount-(pointCount%2===0?1:0));result.window=Math.min(9,max);if(typeof result.degree==='number')result.degree=Math.min(result.degree,Math.max(0,Number(result.window)-1))}return result}
