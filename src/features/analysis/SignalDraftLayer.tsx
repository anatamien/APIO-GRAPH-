import {useEffect,useMemo,useRef,useSyncExternalStore,type PointerEvent} from 'react';
import type {ProjectDocument,XY} from '../../domain/model';
import type {Coordinates} from '../../domain/geometry';
import type {T} from '../../app/controls';
import {frameQueue} from '../../domain/frameQueue';
import {dependencyIndex} from '../../domain/dependencies';
import {SignalInteractionStore} from './signalInteraction';
import {useSignalGrid} from './useSignalGrid';
import {lineGeometry,peakGeometry,regionGeometry} from './signalGeometry';

export function SignalDraftLayer({store,p,c,enabled,t,clipId}:{clipId:string;store:SignalInteractionStore;p:ProjectDocument;c:Coordinates;enabled:boolean;t:T}){
 const state=useSyncExternalStore(store.subscribe,store.getSnapshot),latest=useRef({state,c});latest.current={state,c};
 const frames=useMemo(()=>frameQueue<{index:number;point:XY}>(({index,point})=>latest.current.state?.onMove?.(index,point)),[]);
 useEffect(()=>()=>frames.cancel(),[frames]);
 const point=(e:PointerEvent<SVGElement>):XY=>{const m=e.currentTarget.ownerSVGElement?.getScreenCTM(),pixel=m?new DOMPoint(e.clientX,e.clientY).matrixTransform(m.inverse()):{x:0,y:0};return{x:c.x.invert(pixel.x),y:c.y.invert(pixel.y)}};
 const start=(e:PointerEvent<SVGElement>)=>{if(e.button!==0||!enabled)return;e.preventDefault();e.stopPropagation();e.currentTarget.setPointerCapture(e.pointerId)};
 const move=(e:PointerEvent<SVGElement>,index:number)=>{if(!e.currentTarget.hasPointerCapture(e.pointerId))return;e.stopPropagation();const next=point(e);if(Number.isFinite(next.x)&&Number.isFinite(next.y))frames.push({index,point:next})};
 const finish=(e:PointerEvent<SVGElement>,index:number)=>{if(!e.currentTarget.hasPointerCapture(e.pointerId))return;e.stopPropagation();frames.flush({index,point:point(e)});e.currentTarget.releasePointerCapture(e.pointerId)};
 const handlers=(index:number)=>({onPointerDown:start,onPointerMove:(e:PointerEvent<SVGElement>)=>move(e,index),onPointerUp:(e:PointerEvent<SVGElement>)=>finish(e,index),onPointerCancel:()=>frames.cancel(),onLostPointerCapture:()=>frames.cancel()});
 const datasets=dependencyIndex(p).datasets,gridRevision=useSignalGrid(state?datasets.get(state.sourceDatasetId)?.points:undefined,state?.baselineDatasetId?datasets.get(state.baselineDatasetId)?.points:undefined,state?.orderParameters,!!state?.range);
 const previews=useMemo(()=>{
  if(!state)return null;const draft=state.preview,source=dependencyIndex(p).datasets.get(state.sourceDatasetId),reference=state.baselineDatasetId?dependencyIndex(p).datasets.get(state.baselineDatasetId):undefined;
  return <g clipPath={`url(#${clipId})`} pointerEvents="none" opacity={.7}>
   {draft?.baseline&&<path data-signal-preview="baseline" d={lineGeometry(draft.baseline,c,p,true)} stroke="#000000" strokeDasharray="7 4" fill="none"/>}
   {draft?.corrected&&<path data-signal-preview="corrected" d={lineGeometry(draft.corrected,c,p,true)} stroke="#000000" strokeWidth={1.6} fill="none"/>}
   {draft?.peaks&&<path data-signal-preview="peaks" d={peakGeometry(draft.peaks,c,p,true)} stroke="#000000" fill="none"/>}
   {state.range&&source&&<path data-signal-preview="area" d={regionGeometry(source.points,reference?.points,{...state.orderParameters,range:state.range},c,p,true)} fill="#000000" fillOpacity={.12}/>}
  </g>;
 },[state,p.datasets,p.viewport,c,gridRevision,clipId]);
 if(!state)return null;
 return <g data-signal-draft="true">{previews}
  <g clipPath={`url(#${clipId})`} fill="var(--plot-paper, #FFFFFF)" stroke="var(--plot-ink, #000000)" strokeWidth={1.3}>
   {state.nodes&&<path d={lineGeometry([...state.nodes].sort((a,b)=>a.x-b.x),c,p,true)} fill="none" strokeDasharray="4 4" pointerEvents="none"/>}
   {state.nodes?.map((a,i)=><circle key={i} data-signal-node={i} aria-label={`${t('signal.manual')} ${i+1}`} cx={c.x(a.x)} cy={c.y(a.y)} r={5} cursor={enabled?'move':'default'} style={{pointerEvents:enabled?'all':'none',touchAction:'none'}} {...handlers(i)}/>)}
   {state.range?.map((x,i)=><g key={i} data-signal-boundary={i} aria-label={t(i?'rangeMax':'rangeMin')} style={{pointerEvents:enabled?'all':'none',touchAction:'none'}} cursor="ew-resize" {...handlers(i)}><line x1={c.x(x)} x2={c.x(x)} y1={c.top} y2={c.bottom} strokeDasharray="5 4"/><line x1={c.x(x)} x2={c.x(x)} y1={c.top} y2={c.bottom} stroke="transparent" strokeWidth={16}/><rect x={c.x(x)-5} y={c.top+2} width={10} height={16} rx={3}/></g>)}
  </g>
  {state.highlight&&<circle data-highlighted-peak="true" cx={c.x(state.highlight.x)} cy={c.y(state.highlight.y)} r={9} fill="none" stroke="var(--plot-ink, #000000)" strokeWidth={2} pointerEvents="none"/>}
 </g>;
}
