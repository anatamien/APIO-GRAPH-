import {DiagramTableGeometry} from './DiagramTableGeometry';
import {layoutTable} from '../../domain/diagramTable';
import type {AxisDisplay} from '../../domain/plotAreas';
import {traceGaps} from './traceGaps';
import {memo,useMemo,useState,useId} from 'react';
import {line,curveLinear,curveBasis,curveNatural,curveStep,curveStepBefore,curveStepAfter,symbol,symbolCircle,symbolSquare,symbolTriangle,symbolDiamond,symbolCross,symbolPlus} from 'd3-shape';
import type {ProjectDocument,Series,Marker,DrawObject,XY,Dash,Point,Viewport} from '../../domain/model';
import {dependencyIndex} from '../../domain/dependencies';
import {createCoordinates,minorTicks,visibleTicks,formatNumber,anchorPixel,textRotation} from '../../domain/geometry';
import type {Coordinates} from '../../domain/geometry';
import {layoutText,calloutRoute} from '../../domain/textGeometry';
import {screenLinePaths} from './linePaths';
import {visiblePoints,visibleMarkerPoints} from './displayPoints';
import {seriesFrame,seriesTranslation} from './seriesFrame';
import {effectiveMarkers} from '../../domain/seriesDisplay';
import {markerBatches} from './markerBatches';
import {SignalOverlays,SignalLabels} from '../analysis/SignalOverlays';
export {displayPoints} from './displayPoints';
export type ColorMode='original'|'grayscale'|'strict-bw';
export interface RenderOptions {width:number;height:number;colorMode?:ColorMode;transparent?:boolean;screen?:boolean;dpi?:number;includeSeries?:boolean;panning?:boolean;includeAxes?:boolean;includeObjects?:boolean;includeLegend?:boolean;clipId?:string}
export const dashArray:Record<Dash,string>={solid:'',dash:'8 5',dot:'2 4','dash-dot':'9 4 2 4'};
const shapes={circle:symbolCircle,square:symbolSquare,triangle:symbolTriangle,diamond:symbolDiamond,cross:symbolCross,plus:symbolPlus};
const markerPaths=new Map<string,string>();
export function markerPath(shape:Marker,size:number){const key=shape+':'+size,cached=markerPaths.get(key);if(cached!==undefined)return cached;const path=symbol(shapes[shape],Math.max(0.1,size*size*3.14))()??'';if(markerPaths.size>=256)markerPaths.clear();markerPaths.set(key,path);return path}
export function outputColor(color:string,mode:ColorMode){if(mode==='strict-bw')return '#000000';if(mode==='grayscale'){const rgb=[1,3,5].map(i=>parseInt(color.slice(i,i+2),16));const v=Math.round(rgb[0]*0.2126+rgb[1]*0.7152+rgb[2]*0.0722).toString(16).padStart(2,'0');return '#'+v.repeat(3)}return color}
export function outputStyle(s:Series,index:number,mode:ColorMode){if(mode==='strict-bw')return {...s.style,stroke:'#000000',markerStroke:'#000000',markerFill:'#FFFFFF',opacity:1,dash:(['solid','dash','dot','dash-dot'] as const)[index%4],markerShape:(['circle','square','triangle','diamond','cross','plus'] as const)[index%6]};return {...s.style,stroke:outputColor(s.style.stroke,mode),markerStroke:outputColor(s.style.markerStroke,mode),markerFill:outputColor(s.style.markerFill,mode)}}
interface SeriesProps {p:ProjectDocument;c:Coordinates;mode:ColorMode;screen:boolean}
const SeriesTrace=memo(function SeriesTrace({s,all,c,view,mode,screen,margin,budget,markers,index,dense,breakIds,interpolation}:{interpolation?:string;breakIds?:string[];s:Series;all:Point[];c:Coordinates;view:Viewport;mode:ColorMode;screen:boolean;margin:number;budget:number;markers:boolean;index:number;dense:boolean}){
 const pointMode=s.mode==='points',st=outputStyle(s,index,mode);
 const {path,paths,markerPoints,markerPixels}=useMemo(()=>{
  const {xMin,xMax,yMin,yMax}=view;
  const pts=screen?(pointMode?visibleMarkerPoints(all,xMin,xMax,budget,margin,[yMin,yMax]):visiblePoints(all,xMin,xMax,budget,margin)):all;
  const curve=({basis:curveBasis,natural:curveNatural,step:curveStep,'step-before':curveStepBefore,'step-after':curveStepAfter} as Record<string,typeof curveLinear>)[interpolation??'']??curveLinear;
  const projected=screen||!!breakIds?.length||!!interpolation,pixels=projected?pts.map(pt=>({x:c.x(pt.x),y:c.y(pt.y)})):[],trace=traceGaps(all,pts,pixels,breakIds),path=pointMode?'':projected?line<XY>().curve(curve).defined(a=>Number.isFinite(a.x)&&Number.isFinite(a.y)).x(a=>a.x).y(a=>a.y).digits(8)(trace)??'':line<XY>().x(a=>c.x(a.x)).y(a=>c.y(a.y)).digits(8)(pts)??'';
  const paths=pointMode?[]:screen&&!interpolation?screenLinePaths(trace):[{d:path,offset:0}];
  const markerPoints=screen&&!pointMode&&markers?visibleMarkerPoints(all,xMin,xMax,budget,margin,[yMin,yMax]):pts;
  const markerPixels=screen?(markerPoints===pts?pixels:markerPoints.map(pt=>({x:c.x(pt.x),y:c.y(pt.y)}))):[];
  return {path,paths,markerPoints,markerPixels};
 },[all,c,view,screen,pointMode,markers,budget,margin,breakIds,interpolation]);
 const batch=screen&&mode!=='strict-bw'&&markers&&markerPoints.length>(dense?64:512);
 const batches=useMemo(()=>batch?markerBatches(markerPixels,markerPoints.map(pt=>pt.id),markerPath(st.markerShape,st.markerSizePt*.85)):[],[batch,markerPixels,markerPoints,st.markerShape,st.markerSizePt]);
 return <g data-series={s.id} data-target={`series:${s.id}`} opacity={st.opacity} style={screen?{willChange:'transform'}:undefined}>
  {!pointMode&&<>{paths.map((part,i)=><path key={i} d={part.d} stroke={st.stroke} strokeWidth={st.strokeWidthPt*4/3} strokeDasharray={dashArray[st.dash]} strokeDashoffset={part.offset} fill="none"/>)}{screen&&<path d={path} stroke="transparent" strokeWidth={14} fill="none"/>}</>}
  {batch?batches.map((part,i)=><path key={i} data-marker-ids={part.ids} d={part.d} fill={st.markerFill} stroke={st.markerStroke} strokeWidth={.9}/>):markers&&markerPoints.map((pt,j)=><path key={pt.id} data-point={pt.id} d={markerPath(st.markerShape,st.markerSizePt*0.85)} transform={`translate(${screen?markerPixels[j].x:c.x(pt.x)},${screen?markerPixels[j].y:c.y(pt.y)})`} fill={st.markerFill} stroke={st.markerStroke} strokeWidth={0.9} visibility={mode==='strict-bw'&&markerPoints.length>80&&j%Math.ceil(markerPoints.length/80)!==0?'hidden':undefined}/>)}
 </g>;
});
const SeriesGeometry=memo(function SeriesGeometry({p,c,mode,screen,margin}:SeriesProps&{margin:number}){
 const index=dependencyIndex(p),visible=p.series.filter(s=>s.visible&&(!index.producers.has(s.datasetId)||index.producers.get(s.datasetId)?.status==='valid')).sort((a,b)=>a.order-b.order);
 // Share pixel detail across overlaid traces; local zoom still restores raw points.
 const budget=Math.max(1000,(c.right-c.left)*4/Math.max(1,visible.length));
 return <>{visible.map(s=><SeriesTrace key={s.id} s={s} all={index.datasets.get(s.datasetId)?.points??[]} c={c} view={p.viewport} mode={mode} screen={screen} margin={margin} budget={budget} markers={effectiveMarkers(p,s)} index={mode==='strict-bw'?p.series.indexOf(s):0} dense={visible.length>8} interpolation={(p.extensions.seriesInterpolation as Record<string,string>|undefined)?.[s.id]} breakIds={(p.extensions.lineBreaks as Record<string,string[]>|undefined)?.[s.datasetId]}/>)}<SignalOverlays p={p} c={c} screen={screen} margin={margin} color={value=>outputColor(value,mode)} mode={mode}/></>;
},(a,b)=>a.p.datasets===b.p.datasets&&a.p.series===b.p.series&&a.p.calculations===b.p.calculations&&a.p.extensions.lineBreaks===b.p.extensions.lineBreaks&&a.p.extensions.seriesInterpolation===b.p.extensions.seriesInterpolation&&a.p.editor.showPointMarkers===b.p.editor.showPointMarkers&&a.c===b.c&&a.mode===b.mode&&a.screen===b.screen&&a.margin===b.margin);
function SeriesLayer({p,c,mode,screen,panning,clipId}:SeriesProps&{panning:boolean;clipId:string}){
 const [prepared,setPrepared]=useState(()=>seriesFrame(p,c,0));
 const translation=screen&&(!panning||prepared.margin>0)?seriesTranslation(prepared,p,c):null,frame=translation?prepared:seriesFrame(p,c,panning?.5:0);
 if(screen&&!translation)setPrepared(frame);
 return <g clipPath={`url(#${clipId})`}><g data-series-translation="true" transform={translation?`translate(${translation.x} ${translation.y})`:undefined}>
  <SeriesGeometry p={screen?frame.project:p} c={screen?frame.coordinates:c} mode={mode} screen={screen} margin={frame.margin}/>
 </g></g>;
}
export function ObjectGeometry({p,o,c,mode='original',hitOnly=false}:{p:ProjectDocument;o:DrawObject;c:Coordinates;mode?:ColorMode;hitOnly?:boolean}){
 const a=anchorPixel(p,o.anchors[0],c),b=anchorPixel(p,o.anchors[1]??o.anchors[0],c),st=o.style;
 const stroke=outputColor(st.stroke,mode),common={stroke,strokeWidth:hitOnly?14:st.strokeWidthPt*4/3,strokeDasharray:dashArray[st.dash],strokeOpacity:mode==='strict-bw'?1:st.strokeOpacity};
 const text=(x:number,y:number)=><text x={x} y={y} transform={textRotation(p,o.id)?`rotate(${textRotation(p,o.id)} ${x} ${y})`:undefined} fill={stroke} fillOpacity={mode==='strict-bw'?1:st.strokeOpacity} fontSize={st.fontSizePt*4/3} fontFamily="Courier New" style={{whiteSpace:'pre'}}>{layoutText(o).runs.map((run,i)=><tspan key={i} x={x+run.x} y={y+run.y} fontSize={run.size} fontWeight={run.bold?'bold':undefined} fontStyle={run.italic?'italic':undefined}>{run.text}</tspan>)}</text>;
 if(o.type==='table'&&o.table){const layout=layoutTable(o.table,o.style),w=o.geometry.widthPx??layout.width,h=o.geometry.heightPx??layout.height;return <g transform={`translate(${a.x} ${a.y}) scale(${w/layout.width} ${h/layout.height})`}><DiagramTableGeometry table={o.table} style={o.style} mode={mode}/></g>}
 if(o.type==='text')return text(a.x,a.y);
 if(o.type==='marker')return <path d={markerPath(st.markerShape,st.markerSizePt)} transform={`translate(${a.x},${a.y})`} {...common} fill={outputColor(st.fill,mode)}/>;
 if(['rectangle','range-x','range-y'].includes(o.type)){const x=o.type==='range-y'?c.left:Math.min(a.x,b.x),y=o.type==='range-x'?c.top:Math.min(a.y,b.y),w=o.type==='range-y'?c.right-c.left:Math.abs(b.x-a.x),h=o.type==='range-x'?c.bottom-c.top:Math.abs(b.y-a.y);return <rect x={x} y={y} width={w} height={h} {...common} fill={mode==='strict-bw'?'url(#hatch)':outputColor(st.fill,mode)} fillOpacity={mode==='strict-bw'?1:st.fillOpacity}/>}
 let start=a,end=b;
 if(o.type==='callout'){
  const route=calloutRoute(a,{x:b.x+6,y:b.y-6},layoutText(o).bounds,textRotation(p,o.id),12+st.strokeWidthPt*2/3),first=route.leader[0],next=route.leader[1],shelfStart=route.shelf[0],shelfEnd=route.shelf[1];
  const head=(at:typeof a,toward:typeof a)=> <path d="M -10 -4 L 0 0 L -10 4" transform={`translate(${at.x},${at.y}) rotate(${Math.atan2(at.y-toward.y,at.x-toward.x)*180/Math.PI})`} {...common} fill="none"/>;
  return <><g data-callout-leader="true">{route.leader.slice(1).map((point,i)=><line key={i} x1={route.leader[i].x} y1={route.leader[i].y} x2={point.x} y2={point.y} {...common}/>)}<line data-callout-shelf="true" x1={shelfStart.x} y1={shelfStart.y} x2={shelfEnd.x} y2={shelfEnd.y} {...common}/>{route.arrowTip&&['start','both'].includes(st.arrowHead)&&head(first,next)}{['end','both'].includes(st.arrowHead)&&head(shelfEnd,shelfStart)}</g>{!hitOnly&&text(b.x+6,b.y-6)}</>;
 }
 if(o.type==='line'){
  const logSpan=(min:number,max:number)=>{const scale=Math.max(Math.abs(min),Math.abs(max),Number.MIN_VALUE);return Math.log(scale)+Math.log(max/scale-min/scale)};
  const dx=o.geometry.directionX??1,dy=o.geometry.directionY??0,lx=dx===0?-Infinity:Math.log(Math.abs(dx))+Math.log(c.right-c.left)-logSpan(p.viewport.xMin,p.viewport.xMax),ly=dy===0?-Infinity:Math.log(Math.abs(dy))+Math.log(c.bottom-c.top)-logSpan(p.viewport.yMin,p.viewport.yMax),largest=Math.max(lx,ly);
  const vx=Math.sign(dx)*Math.exp(lx-largest),vy=-Math.sign(dy)*Math.exp(ly-largest);
  const candidates:number[]=[];if(vx!==0)for(const x of[c.left,c.right]){const t=(x-a.x)/vx,yy=a.y+t*vy;if(yy>=c.top-0.01&&yy<=c.bottom+0.01)candidates.push(t)}if(vy!==0)for(const y of[c.top,c.bottom]){const t=(y-a.y)/vy,xx=a.x+t*vx;if(xx>=c.left-0.01&&xx<=c.right+0.01)candidates.push(t)}if(candidates.length<2)return null;start={x:a.x+Math.min(...candidates)*vx,y:a.y+Math.min(...candidates)*vy};end={x:a.x+Math.max(...candidates)*vx,y:a.y+Math.max(...candidates)*vy};
 }
 const arrow=(x:number,y:number,angle:number)=><path d="M -10 -4 L 0 0 L -10 4" transform={`translate(${x},${y}) rotate(${angle})`} {...common} fill="none"/>;
 const angle=Math.atan2(end.y-start.y,end.x-start.x)*180/Math.PI;
 return <><line x1={start.x} y1={start.y} x2={end.x} y2={end.y} {...common}/>{o.type==='arrow'&&<>{['start','both'].includes(st.arrowHead)&&arrow(start.x,start.y,angle+180)}{['end','both'].includes(st.arrowHead)&&arrow(end.x,end.y,angle)}</>}</>;
}
export const ChartScene=memo(function ChartScene({p,width,height,colorMode='original',transparent=false,screen=false,includeSeries=true,panning=false,includeAxes=true,includeObjects=true,includeLegend=true,clipId:suppliedClipId}:{p:ProjectDocument}&RenderOptions){
 const generatedClipId=useId().replace(/:/g,''),clipId=suppliedClipId??generatedClipId;
 const c=useMemo(()=>createCoordinates(p,width,height),[p.viewport,p.axes,p.page.paddingPx,width,height]),xt=screen?visibleTicks(c.xTicks,Math.floor((c.right-c.left)/Math.max(36,c.xLabelWidth+14))):c.xTicks,yt=screen?visibleTicks(c.yTicks,Math.floor((c.bottom-c.top)/25)):c.yTicks;
 const themed=p.extensions.canvasTheme!=='source'&&screen&&colorMode==='original'&&p.page.background.toUpperCase()==='#FFFFFF';
 const objs=includeObjects?[...p.objects].filter(o=>o.visible).sort((a,b)=>a.zIndex-b.zIndex):[];const axisDisplay=p.extensions.axisDisplay as AxisDisplay|undefined;const legendStyle=p.extensions.legendStyle as {fontSizePt:number;lineHeightPx:number}|undefined;
 const object=(o:DrawObject)=><g key={o.id} data-target={`object:${o.id}`} data-object={o.id}><ObjectGeometry p={p} o={o} c={c} mode={colorMode}/>{screen&&['segment','arrow','line','callout'].includes(o.type)&&<g opacity={0} strokeWidth={14}><ObjectGeometry p={p} o={o} hitOnly c={c}/></g>}</g>;
 return <>
  <defs><clipPath data-plot-clip="true" id={clipId}><rect x={c.left} y={c.top} width={c.right-c.left} height={c.bottom-c.top}/></clipPath><pattern id="hatch" width="9" height="9" patternUnits="userSpaceOnUse"><path d="M-2 2L2-2 M0 9L9 0 M7 11L11 7" stroke="#000000" strokeWidth="0.5" fill="none"/></pattern></defs>
  {!transparent&&<rect data-canvas-paper={themed||undefined} width={width} height={height} fill={colorMode==='strict-bw'?'#FFFFFF':outputColor(p.page.background,colorMode)}/>}
  <g data-canvas-ink={themed||undefined} fontFamily="Courier New" fontSize="12" fill={colorMode==='strict-bw'?'#000000':'#363C43'} color={colorMode==='strict-bw'?'#000000':'#363C43'}>
   {objs.filter(o=>o.zIndex<0).map(object)}
   <g data-canvas-grid={themed||undefined} stroke={colorMode==='strict-bw'?'#000000':'#E9EDF0'} strokeWidth={colorMode==='strict-bw'?0.4:0.7} strokeDasharray={colorMode==='strict-bw'?'1 5':undefined} pointerEvents="none">
    {includeAxes&&p.axes.x.grid&&xt.map(v=><line key={v} x1={c.x(v)} x2={c.x(v)} y1={c.top} y2={c.bottom}/>)}{includeAxes&&p.axes.y.grid&&yt.map(v=><line key={v} y1={c.y(v)} y2={c.y(v)} x1={c.left} x2={c.right}/>)}
   </g>
   {includeSeries&&<SeriesLayer p={p} c={c} mode={colorMode} screen={screen} panning={screen&&panning} clipId={clipId}/>}
   {objs.filter(o=>o.zIndex>=0&&o.type!=='table').map(object)}
   {includeAxes&&<SignalLabels p={p} c={c} color={value=>outputColor(value,colorMode)}/>}
   {includeAxes&&<>{axisDisplay?.x.opposite&&<path d={`M${c.left},${c.top}H${c.right}`} fill="none" stroke="currentColor"/>}{axisDisplay?.y.opposite&&<path d={`M${c.right},${c.top}V${c.bottom}`} fill="none" stroke="currentColor"/>}<g data-target="axis:x"><path visibility={axisDisplay?.x.line===false?'hidden':undefined} d={`M${c.left},${c.bottom}H${c.right}`} stroke="currentColor" strokeWidth={p.axes.x.strokeWidthPt*4/3} fill="none"/>{screen&&<path d={`M${c.left},${c.bottom}H${c.right}`} stroke="transparent" strokeWidth={14}/>}
    <g data-minor-axis="x" stroke="currentColor">{minorTicks(c.xTicks,p.axes.x.minorDivisions,screen?(c.right-c.left)/4:Infinity).map((v,i)=><path key={i} d={`M${c.x(v)},${c.bottom}v3`}/>)}</g>
    {axisDisplay?.x.numbers!==false&&xt.map(v=><g key={v}><path d={`M${c.x(v)},${c.bottom}v5`} stroke="currentColor"/><text x={c.x(v)} y={c.bottom+20} textAnchor="middle">{formatNumber(v,p.axes.x)}</text></g>)}
    <text data-axis-label="x" x={(c.left+c.right)/2} y={height-10} textAnchor="middle" fontSize={p.axes.x.labelSizePt*4/3}>{p.axes.x.label}</text>
   </g>
   <g data-target="axis:y"><path visibility={axisDisplay?.y.line===false?'hidden':undefined} d={`M${c.left},${c.top}V${c.bottom}`} stroke="currentColor" strokeWidth={p.axes.y.strokeWidthPt*4/3} fill="none"/>{screen&&<path d={`M${c.left},${c.top}V${c.bottom}`} stroke="transparent" strokeWidth={14}/>}
    <g data-minor-axis="y" stroke="currentColor">{minorTicks(c.yTicks,p.axes.y.minorDivisions,screen?(c.bottom-c.top)/4:Infinity).map((v,i)=><path key={i} d={`M${c.left},${c.y(v)}h-3`}/>)}</g>
    {axisDisplay?.y.numbers!==false&&yt.filter(v=>!axisDisplay?.y.omitMinimum||Math.abs(v-p.viewport.yMin)>Math.abs(p.viewport.yMax-p.viewport.yMin)*1e-10).map(v=><g key={v}><path d={`M${c.left},${c.y(v)}h-5`} stroke="currentColor"/><text x={c.left-10} y={c.y(v)+4} textAnchor="end">{formatNumber(v,p.axes.y)}</text></g>)}
    <text data-axis-label="y" transform={`translate(17 ${(c.top+c.bottom)/2}) rotate(-90)`} textAnchor="middle" fontSize={p.axes.y.labelSizePt*4/3}>{p.axes.y.label}</text>
   </g></>}
   {objs.filter(o=>o.zIndex>=0&&o.type==='table').map(object)}
   {includeLegend&&p.legend.visible&&<g data-target="legend" fontSize={legendStyle?legendStyle.fontSizePt*4/3:undefined} transform={`translate(${anchorPixel(p,p.legend.anchor,c).x},${anchorPixel(p,p.legend.anchor,c).y})`}>{[...p.series].filter(s=>s.visible&&!p.calculations.some(calc=>calc.resultDatasetId===s.datasetId&&calc.status!=='valid')).sort((a,b)=>a.order-b.order).map((s,i)=>{const st=outputStyle(s,p.series.indexOf(s),colorMode);return <g key={s.id} data-target={`series:${s.id}`} transform={`translate(0 ${i*(legendStyle?.lineHeightPx??23)})`}>{s.mode!=='points'&&<line x1={0} x2={26} stroke={st.stroke} strokeWidth={st.strokeWidthPt*4/3} strokeDasharray={dashArray[st.dash]}/>} {effectiveMarkers(p,s)&&<path d={markerPath(st.markerShape,2.5)} transform="translate(13 0)" fill={st.markerFill} stroke={st.markerStroke}/>}<text x={34} y={4}>{s.name}</text></g>})}</g>}
  </g>
 </>
});
