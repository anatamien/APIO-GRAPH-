import {useEffect,useMemo,useRef,useState,type PointerEvent,type MouseEvent} from 'react';
import type {ProjectDocument,Anchor,DrawObject,XY} from '../../domain/model';
import {makeObject} from '../../domain/model';
import {createCoordinates,anchorPixel,snapIndex,sameCandidates,pointAnchor,axisTicks,assertAxisRange,textRotation,type Candidate} from '../../domain/geometry';
import {ChartScene,ObjectGeometry} from './ChartScene';
import type {Tool} from '../tools/ToolBar';
import type {Settings} from '../settings/store';
import type {T} from '../../app/controls';
import {validView,zoomView} from '../../domain/navigation';
import {layoutText} from '../../domain/textGeometry';
import {replaceText} from '../../domain/textEditing';
import {frameQueue} from '../../domain/frameQueue';
export interface ChartProps {project:ProjectDocument;tool:Tool;setTool:(t:Tool)=>void;selection:string[];onSelect:(s:string[])=>void;onChange:(label:string,fn:(p:ProjectDocument)=>ProjectDocument)=>void;onNavigate:(viewport:ProjectDocument['viewport'])=>void;previewing?:boolean;settings:Settings;t:T;onImport:()=>void;onManual:()=>void;readOnly:boolean}
interface Gesture {kind:'draw'|'move'|'handle'|'pan';start:XY;anchor:Anchor;object?:DrawObject;handle?:string;fixed?:Anchor;pointerId:number;before:ProjectDocument}
type PointerInput=Pick<PointerEvent<SVGSVGElement>,'clientX'|'clientY'|'buttons'|'altKey'|'shiftKey'|'pointerId'>;
function direction(start:XY,end:XY):XY|null {
 const scale=Math.max(Math.abs(start.x),Math.abs(start.y),Math.abs(end.x),Math.abs(end.y),Number.MIN_VALUE);
 const dx=end.x/scale-start.x/scale,dy=end.y/scale-start.y/scale,n=Math.hypot(dx,dy);
 return n>0&&Number.isFinite(n)?{x:dx/n,y:dy/n}:null;
}
function orthogonal(start:XY,end:XY):XY{return Math.abs(end.x-start.x)>=Math.abs(end.y-start.y)?{x:end.x,y:start.y}:{x:start.x,y:end.y}}
function logSpan(min:number,max:number):number {const scale=Math.max(Math.abs(min),Math.abs(max),Number.MIN_VALUE);return Math.log(scale)+Math.log(max/scale-min/scale)}
export function ChartCanvas({project:p,tool,setTool,selection,onSelect,onChange,onNavigate,previewing=false,settings,t,onImport,onManual,readOnly}:ChartProps){
 const host=useRef<HTMLDivElement>(null),svg=useRef<SVGSVGElement>(null),gesture=useRef<Gesture|null>(null),panLatest=useRef<ProjectDocument['viewport']|null>(null);
 const [size,setSize]=useState({width:1200,height:760}),[draft,setDraft]=useState<DrawObject|null>(null),[panView,setPanView]=useState<ProjectDocument['viewport']|null>(null),[hover,setHover]=useState<Candidate[]>([]),[candidateIndex,setCandidateIndex]=useState(0),[textDraft,setTextDraft]=useState<{anchor:Anchor;position:XY;object?:DrawObject;existingId?:string;value:string}|null>(null),[axisDraft,setAxisDraft]=useState<{axis:'x'|'y';position:XY;value:string}|null>(null),[space,setSpace]=useState(false);
 useEffect(()=>{const h=host.current;if(!h)return;const r=new ResizeObserver(entries=>{const {width,height}=entries[0].contentRect;setSize({width:Math.max(300,width),height:Math.max(250,height)})});r.observe(h);return()=>r.disconnect()},[]);
 const draftLatest=useRef<DrawObject|null>(null),pointerHandler=useRef<(e:PointerInput)=>void>(()=>{});
 const pointerFrames=useMemo(()=>frameQueue<PointerInput>(e=>pointerHandler.current(e)),[]);
 const updateDraft=(value:DrawObject|null)=>{draftLatest.current=value;setDraft(value)};
 const shown=useMemo(()=>panView?{...p,viewport:panView}:p,[p,panView]);
 const c=useMemo(()=>createCoordinates(shown,size.width,size.height),[shown.viewport,p.axes,size.width,size.height,p.page.paddingPx]);
 const find=useMemo(()=>snapIndex(p,c),[p.datasets,p.series,p.calculations,p.extensions.sourceRows,c]);
 const pixel=(e:{clientX:number;clientY:number})=>{const node=svg.current;if(!node)return{x:0,y:0};const m=node.getScreenCTM();if(!m)return{x:0,y:0};const pt=new DOMPoint(e.clientX,e.clientY).matrixTransform(m.inverse());return{x:pt.x,y:pt.y}};
 const anchorAt=(pos:XY,alt=false):Anchor=>{
  if(!alt&&settings.snap==='dataPoint'){const candidates=find(pos.x,pos.y,settings.snapRadius);if(candidates.length)return pointAnchor(candidates[candidateIndex%candidates.length])}
  let x=c.x.invert(pos.x),y=c.y.invert(pos.y);
  if(!alt&&settings.snap==='grid'){const xs=axisTicks(p.axes.x,p.viewport.xMin,p.viewport.xMax),ys=axisTicks(p.axes.y,p.viewport.yMin,p.viewport.yMax);x=xs.reduce((best,v)=>Math.abs(c.x(v)-pos.x)<Math.abs(c.x(best)-pos.x)?v:best,xs[0]??x);y=ys.reduce((best,v)=>Math.abs(c.y(v)-pos.y)<Math.abs(c.y(best)-pos.y)?v:best,ys[0]??y)}
  return {mode:'data',x,y};
 };
 const clear=()=>{pointerFrames.cancel();const g=gesture.current;gesture.current=null;if(g&&svg.current?.hasPointerCapture(g.pointerId))svg.current.releasePointerCapture(g.pointerId);panLatest.current=null;updateDraft(null);setPanView(null)};
 const finishPan=()=>{if(gesture.current?.kind!=='pan')return;if(panLatest.current)onNavigate(panLatest.current);clear()};
 useEffect(()=>{const down=(e:KeyboardEvent)=>{if(e.target instanceof HTMLElement&&e.target.closest('input,textarea,select,[contenteditable]'))return;if(e.code==='Space'){e.preventDefault();setSpace(true)}if(e.key==='Escape'){clear();setTextDraft(null);setAxisDraft(null)}if(e.key==='Tab'&&hover.length>1){e.preventDefault();setCandidateIndex(i=>(i+1)%hover.length)}};const up=(e:KeyboardEvent)=>{if(e.code==='Space')setSpace(false)};const blur=()=>{clear();setSpace(false)};window.addEventListener('keydown',down);window.addEventListener('keyup',up);window.addEventListener('blur',blur);return()=>{window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('blur',blur)}},[hover.length]);
 // A non-passive listener consumes wheel input only over the chart, not over panels.
 const wheelState=useRef({p,size,previewing,onNavigate,pixel});wheelState.current={p,size,previewing,onNavigate,pixel};
 useEffect(()=>{
  const node=svg.current;if(!node)return;let view:ProjectDocument['viewport']|null=null;
  const frames=frameQueue<ProjectDocument['viewport']>(next=>{wheelState.current.onNavigate(next);view=null});
  const wheel=(e:WheelEvent)=>{
   const {p,size,previewing,pixel}=wheelState.current;
   if(previewing||gesture.current||e.deltaY===0)return;e.preventDefault();setHover(prev=>prev.length?[]:prev);
   const current=view??p.viewport,pos=pixel(e),coords=createCoordinates({...p,viewport:current},size.width,size.height);
   const delta=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?size.height:1),next=zoomView(current,{x:coords.x.invert(pos.x),y:coords.y.invert(pos.y)},Math.exp(Math.max(-1,Math.min(1,delta*0.002))));
   if(next){view=next;frames.push(next)}
  };
  node.addEventListener('wheel',wheel,{passive:false});return()=>{frames.cancel();node.removeEventListener('wheel',wheel)};
 },[]);
 useEffect(()=>()=>pointerFrames.cancel(),[pointerFrames]);
 const moveAnchor=(a:Anchor,dx:number,dy:number):Anchor=>a.mode==='page'?{...a,pageX:Math.max(0,Math.min(1,a.pageX+dx/size.width)),pageY:Math.max(0,Math.min(1,a.pageY+dy/size.height))}:a.mode==='point'?{...a,offsetXpx:a.offsetXpx+dx,offsetYpx:a.offsetYpx+dy}:{mode:'data',x:a.x+(c.x.invert(dx)-c.x.invert(0)),y:a.y+(c.y.invert(dy)-c.y.invert(0))};
 const rectangleCorners=(o:DrawObject):XY[]=>{const a=anchorPixel(p,o.anchors[0],c),b=anchorPixel(p,o.anchors[1]??o.anchors[0],c),left=Math.min(a.x,b.x),right=Math.max(a.x,b.x),top=Math.min(a.y,b.y),bottom=Math.max(a.y,b.y);return[{x:left,y:top},{x:right,y:top},{x:right,y:bottom},{x:left,y:bottom}]};
 const fixedCorner=(o:DrawObject,index:number):Anchor=>{const pos=rectangleCorners(o)[(index+2)%4];const existing=o.anchors.find(a=>{const pt=anchorPixel(p,a,c);return Math.hypot(pt.x-pos.x,pt.y-pos.y)<1e-6});return existing??(o.anchors.every(a=>a.mode==='page')?{mode:'page',pageX:pos.x/size.width,pageY:pos.y/size.height}:{mode:'data',x:c.x.invert(pos.x),y:c.y.invert(pos.y)})};
 const lineHandle=(o:DrawObject):XY=>{
  const origin=anchorPixel(p,o.anchors[0],c),vx=o.geometry.directionX??1,vy=o.geometry.directionY??0;
  const lx=vx===0?-Infinity:Math.log(Math.abs(vx))+Math.log(c.right-c.left)-logSpan(p.viewport.xMin,p.viewport.xMax),ly=vy===0?-Infinity:Math.log(Math.abs(vy))+Math.log(c.bottom-c.top)-logSpan(p.viewport.yMin,p.viewport.yMax),largest=Math.max(lx,ly);
  const dx=Math.sign(vx)*Math.exp(lx-largest),dy=-Math.sign(vy)*Math.exp(ly-largest),n=Math.hypot(dx,dy)||1;
  return{x:origin.x+dx/n*72,y:origin.y+dy/n*72};
 };
 const cycleTarget=(e:PointerEvent<SVGSVGElement>):string|undefined=>{
  const hits=new Set(document.elementsFromPoint(e.clientX,e.clientY).map(node=>node.closest('[data-object]')?.getAttribute('data-object')??node.closest('[data-target]')?.getAttribute('data-target')?.replace(/^object:/,'')).filter((value):value is string=>!!value));
  const candidates=p.objects.map((o,index)=>({o,index})).filter(({o})=>o.visible&&hits.has(o.id)).sort((a,b)=>b.o.zIndex-a.o.zIndex||b.index-a.index).map(({o})=>`object:${o.id}`);
  if(!candidates.length)return;
  const current=candidates.findIndex(value=>selection.includes(value));return candidates[(current+1)%candidates.length];
 };
 const pointerDown=(e:PointerEvent<SVGSVGElement>)=>{
  if(previewing)return;const pos=pixel(e);
  if(e.button===1||(e.button===0&&(tool==='pan'||space))){e.preventDefault();clear();setHover([]);gesture.current={kind:'pan',start:pos,anchor:anchorAt(pos,true),pointerId:e.pointerId,before:p};e.currentTarget.setPointerCapture(e.pointerId);return}
  if(e.button!==0||textDraft||axisDraft)return;const hit=document.elementFromPoint(e.clientX,e.clientY)??e.target as Element;let target=hit.closest('[data-target]')?.getAttribute('data-target');
  const handle=(e.target as Element).closest('[data-handle]')?.getAttribute('data-handle');
  const axis=hit.closest('[data-axis-label]')?.getAttribute('data-axis-label');if(axis==='x'||axis==='y'){onSelect([`axis:${axis}`]);return}
  if(tool==='pan')return;
  if(tool==='select'){
   if(e.altKey){target=cycleTarget(e)??target;if(target)onSelect([target]);return}
   if(!handle&&!target?.startsWith('object:')){const near=find(pos.x,pos.y,Math.max(10,settings.snapRadius));if(near.length)target=`series:${near[candidateIndex%near.length].seriesId}`}
   if(target){onSelect(e.shiftKey?(selection.includes(target)?selection.filter(value=>value!==target):[...selection,target]):[target]);if(e.shiftKey)return;const object=p.objects.find(o=>`object:${o.id}`===target);if(object&&!object.locked&&!readOnly){const isHandle=handle!==undefined&&handle!==null&&handle!=='center';gesture.current={kind:isHandle?'handle':'move',start:pos,anchor:anchorAt(pos,true),object,handle:handle??undefined,fixed:object.type==='rectangle'&&handle?.startsWith('corner-')?fixedCorner(object,Number(handle.slice(7))):undefined,pointerId:e.pointerId,before:p};e.currentTarget.setPointerCapture(e.pointerId)}}else if(!e.shiftKey)onSelect([]);return;
  }
  if(tool==='zoom'||tool==='zoom-out'){const out=(tool==='zoom-out')!==e.shiftKey,next=zoomView(p.viewport,{x:c.x.invert(pos.x),y:c.y.invert(pos.y)},out?1.5:1/1.5);if(next)onNavigate(next);return}
  if(readOnly)return;
  const inside=pos.x>=c.left&&pos.x<=c.right&&pos.y>=c.top&&pos.y<=c.bottom;
  if(!inside&&tool!=='text')return;
  const a=!inside?{mode:'page' as const,pageX:pos.x/size.width,pageY:pos.y/size.height}:anchorAt(pos,e.altKey);
  if(tool==='text'){setTextDraft({anchor:a,position:pos,value:''});return}
  const o={...makeObject(tool,[a,...(tool==='marker'?[]:[a])]),name:t(tool)};if(tool==='line')o.anchors=[a];
  gesture.current={kind:'draw',start:pos,anchor:a,object:o,pointerId:e.pointerId,before:p};updateDraft(o);e.currentTarget.setPointerCapture(e.pointerId);
 };
 const pointerMove=(e:PointerInput)=>{
  const pos=pixel(e),g=gesture.current;if(!g){const near=find(pos.x,pos.y,settings.snapRadius);setHover(prev=>sameCandidates(prev,near)?prev:near);if(near[0]?.point.id!==hover[0]?.point.id)setCandidateIndex(0);return}
  const dx=pos.x-g.start.x,dy=pos.y-g.start.y;
  if(g.kind==='pan'){const start=createCoordinates(g.before,size.width,size.height),v={xMin:g.before.viewport.xMin-(start.x.invert(dx)-start.x.invert(0)),xMax:g.before.viewport.xMax-(start.x.invert(dx)-start.x.invert(0)),yMin:g.before.viewport.yMin-(start.y.invert(dy)-start.y.invert(0)),yMax:g.before.viewport.yMax-(start.y.invert(dy)-start.y.invert(0))};if(validView(v)){try{assertAxisRange(p.axes.x,v.xMin,v.xMax);assertAxisRange(p.axes.y,v.yMin,v.yMax)}catch{return}panLatest.current=v;setPanView(v)}if(!(e.buttons&5))finishPan();return}
  const o=g.object!;
  if(g.kind==='move'){updateDraft({...o,anchors:o.anchors.map((a,i)=>o.type==='callout'&&i===0?a:moveAnchor(a,dx,dy))});return}
  if(g.kind==='handle'){
   if(o.type==='rectangle'&&g.fixed){updateDraft({...o,anchors:[anchorAt(pos,e.altKey),g.fixed]});return}
   if(o.type==='line'&&g.handle==='direction'){const origin=anchorPixel(p,o.anchors[0],c),end=e.shiftKey?orthogonal(origin,pos):anchorPixel(p,anchorAt(pos,e.altKey),c),vector=direction({x:c.x.invert(origin.x),y:c.y.invert(origin.y)},{x:c.x.invert(end.x),y:c.y.invert(end.y)});if(vector)updateDraft({...o,geometry:{...o.geometry,directionX:vector.x,directionY:vector.y}});return}
   const anchors=[...o.anchors],index=Number(g.handle??0),locked=e.shiftKey&&['segment','arrow'].includes(o.type);anchors[index]=anchorAt(locked?orthogonal(anchorPixel(p,anchors[index===0?1:0],c),pos):pos,locked||e.altKey);updateDraft({...o,anchors});return;
  }
  const locked=e.shiftKey&&['line','segment','arrow'].includes(o.type),origin=anchorPixel(p,g.anchor,c),endPosition=locked?orthogonal(origin,pos):pos,b=anchorAt(endPosition,locked||e.altKey);
  if(o.type==='line'){const vector=direction({x:c.x.invert(origin.x),y:c.y.invert(origin.y)},{x:c.x.invert(endPosition.x),y:c.y.invert(endPosition.y)});if(vector)updateDraft({...o,geometry:{directionX:vector.x,directionY:vector.y}})}
  else {let end=b;if(e.shiftKey&&o.type==='rectangle'){const d=Math.max(Math.abs(dx),Math.abs(dy));end=anchorAt({x:g.start.x+Math.sign(dx)*d,y:g.start.y+Math.sign(dy)*d},true)}updateDraft({...o,anchors:o.type==='marker'?[b]:[g.anchor,end]})}
 };
 pointerHandler.current=pointerMove;
 const pointerUp=(e:PointerEvent<SVGSVGElement>)=>{
  const g=gesture.current;if(!g)return;const pos=pixel(e);pointerFrames.flush({clientX:e.clientX,clientY:e.clientY,pointerId:e.pointerId,buttons:g.kind==='pan'?1:e.buttons,altKey:e.altKey,shiftKey:e.shiftKey});
  if(g.kind==='pan'){finishPan();return}
  const o=draftLatest.current??g.object!;
  if(g.kind!=='draw'&&Math.hypot(pos.x-g.start.x,pos.y-g.start.y)<0.5){clear();return}
  if(g.kind==='draw'&&Math.hypot(pos.x-g.start.x,pos.y-g.start.y)<3&&o.type!=='marker'){clear();return}
  if(g.kind==='draw'&&o.type==='callout'){setTextDraft({anchor:o.anchors[1],position:pos,object:o,value:''});clear();return}
  onChange(g.kind==='draw'?'AddObject':'MoveObject',q=>({...q,objects:g.kind==='draw'?[...q.objects,{...o,zIndex:q.objects.length+1}]:q.objects.map(a=>a.id===o.id?o:a)}));onSelect([`object:${o.id}`]);if(!settings.repeatTool)setTool('select');clear();
 };
 const finishText=()=>{if(!textDraft)return;const value=textDraft.value;if(value.trim()){const o={...(textDraft.object??{...makeObject('text',[textDraft.anchor]),name:t('text')})};o.text=replaceText(o.text,value);onChange(textDraft.existingId?'EditObject':'AddObject',q=>({...q,objects:textDraft.existingId?q.objects.map(a=>a.id===textDraft.existingId?o:a):[...q.objects,{...o,zIndex:q.objects.length+1}]}));onSelect([]);if(!settings.repeatTool)setTool('select')}setTextDraft(null)};
 const finishAxis=()=>{if(!axisDraft||readOnly)return;const{axis,value}=axisDraft;if(value!==p.axes[axis].label)onChange('SetAxis',q=>({...q,axes:{...q.axes,[axis]:{...q.axes[axis],label:value}}}));setAxisDraft(null)};
 const doubleClick=(e:MouseEvent<SVGSVGElement>)=>{
  const hit=document.elementFromPoint(e.clientX,e.clientY)??e.target as Element;
  const axis=hit.closest('[data-axis-label]')?.getAttribute('data-axis-label');
  if(axis==='x'||axis==='y'){if(readOnly)return;clear();setTextDraft(null);setAxisDraft({axis,position:pixel(e),value:p.axes[axis].label});onSelect(['axis:'+axis]);return}
  const target=hit.closest('[data-target]')?.getAttribute('data-target');if(target)onSelect([target]);
  const o=p.objects.find(a=>'object:'+a.id===target);if(!readOnly&&o&&!o.locked&&['text','callout'].includes(o.type))setTextDraft({anchor:o.anchors[o.type==='callout'?1:0],position:anchorPixel(p,o.anchors[o.type==='callout'?1:0],c),value:o.text.map(a=>a.text).join(''),object:o,existingId:o.id});
 };
 const selectionHandles=(original:DrawObject)=>{
  const o=draft?.id===original.id?draft:original;
  const handle=(key:string|number,pt:XY,cursor='crosshair')=><rect key={key} data-handle={key} x={pt.x-4} y={pt.y-4} width={8} height={8} cursor={readOnly||o.locked?'default':cursor}/>;
  let handles;
  if(o.type==='text'){const a=anchorPixel(p,o.anchors[0],c),b=layoutText(o).bounds;return <g key={o.id} data-target={'object:'+o.id} data-selected-object={o.id} transform={`translate(${a.x} ${a.y}) rotate(${textRotation(p,o.id)})`} fill="none" stroke="#476E98"><rect x={b.x-4} y={b.y-4} width={b.width+8} height={b.height+8} strokeDasharray="3 3" pointerEvents="none"/><circle data-handle="center" cx={b.x-12} cy={b.y+b.height/2} r={4} fill="white" cursor="move"/></g>}
  if(o.type==='rectangle'){const corners=rectangleCorners(o);handles=<>{corners.map((pt,index)=>handle('corner-'+index,pt,index%2?'nesw-resize':'nwse-resize'))}{handle('center',{x:(corners[0].x+corners[2].x)/2,y:(corners[0].y+corners[2].y)/2},'move')}</>}
  else if(o.type==='line'){const start=anchorPixel(p,o.anchors[0],c),end=lineHandle(o);handles=<><line x1={start.x} y1={start.y} x2={end.x} y2={end.y} strokeDasharray="3 3" pointerEvents="none"/>{handle(0,start,'move')}{handle('direction',end)}</>}
  else handles=o.anchors.map((a,index)=>handle(index,anchorPixel(p,a,c)));
  return <g key={o.id} data-target={'object:'+o.id} data-selected-object={o.id} fill="#FFFFFF" stroke="#476E98" strokeWidth="1.4">{handles}</g>;
 };
 const sceneProject=useMemo(()=>draft?{...shown,objects:shown.objects.some(o=>o.id===draft.id)?shown.objects.map(o=>o.id===draft.id?draft:o):shown.objects}:shown,[shown,draft]);
 const candidate=hover[candidateIndex%Math.max(1,hover.length)];
 return <div className={`chart-host tool-${tool}`} ref={host} inert={previewing}>
  <svg ref={svg} data-canvas-themed={sceneProject.page.background.toUpperCase()==='#FFFFFF'||undefined} role="img" aria-label="APIO GRAPH" data-testid="chart" data-raw-point-count={p.datasets.filter(d=>d.role==='raw').reduce((n,d)=>n+d.points.length,0)} width="100%" height="100%" viewBox={`0 0 ${size.width} ${size.height}`} onPointerDown={pointerDown} onPointerMove={e=>pointerFrames.push({clientX:e.clientX,clientY:e.clientY,pointerId:e.pointerId,buttons:e.buttons,altKey:e.altKey,shiftKey:e.shiftKey})} onPointerUp={pointerUp} onPointerCancel={clear} onLostPointerCapture={()=>{if(gesture.current)clear()}} onPointerLeave={()=>{if(!gesture.current)pointerFrames.cancel();setHover(prev=>prev.length?[]:prev)}} onMouseDown={e=>{if(e.button===1)e.preventDefault()}} onAuxClick={e=>{if(e.button===1)e.preventDefault()}} onDoubleClick={doubleClick}>
   <ChartScene p={sceneProject} {...size} screen panning={gesture.current?.kind==='pan'}/>
   {draft&&gesture.current?.kind==='draw'&&<g opacity={0.7} pointerEvents="none"><ObjectGeometry p={p} o={draft} c={c}/></g>}
   {tool==='select'&&!previewing&&p.objects.filter(o=>o.visible&&selection.includes(`object:${o.id}`)).map(selectionHandles)}
   {candidate&&<circle cx={candidate.px} cy={candidate.py} r={6} fill="none" stroke="#476E98" strokeWidth="1.5" pointerEvents="none"/>}
  </svg>
  {!p.series.length&&!p.objects.length&&tool==='select'&&<div className="empty-state"><h1>{t('emptyTitle')}</h1><p>{t('emptyHint')}</p><div className="row"><button className="primary" onClick={onImport}>{t('import')}</button><button onClick={onManual}>{t('manual')}</button></div></div>}
  {textDraft&&<div className="inline-text" style={{left:Math.min(size.width-240,textDraft.position.x),top:Math.min(size.height-150,textDraft.position.y)}}><textarea autoFocus aria-label={t('content')} placeholder={t('newText')} value={textDraft.value} onChange={e=>setTextDraft({...textDraft,value:e.target.value})} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();finishText()}if(e.key==='Escape')setTextDraft(null)}}/><div className="row"><button className="primary" onClick={finishText}>{t('apply')}</button><button onClick={()=>setTextDraft(null)}>{t('cancel')}</button></div></div>}
  {axisDraft&&<div className="inline-text inline-axis" style={{left:Math.max(4,Math.min(size.width-244,axisDraft.position.x-120)),top:Math.max(4,Math.min(size.height-60,axisDraft.position.y-18))}}><input autoFocus aria-label={t('label')+' '+axisDraft.axis.toUpperCase()} value={axisDraft.value} onFocus={e=>e.target.select()} onChange={e=>setAxisDraft({...axisDraft,value:e.target.value})} onKeyDown={e=>{e.stopPropagation();if(e.key==='Enter'){e.preventDefault();finishAxis()}if(e.key==='Escape'){e.preventDefault();setAxisDraft(null)}}}/></div>}
  {candidate&&!gesture.current&&<div role="tooltip" className="point-tooltip" style={{left:Math.min(size.width-220,candidate.px+15),top:Math.max(6,candidate.py-68)}}><strong>{candidate.name}</strong><div>X {candidate.point.x} · Y {candidate.point.y}</div><small>{t('row')} {candidate.row}{hover.length>1?` · ${candidateIndex+1}/${hover.length} · Tab`:''}</small></div>}
 </div>
}
