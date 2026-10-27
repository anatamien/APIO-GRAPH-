import {uncertaintyBounds} from './uncertainty';
import type {ProjectDocument,Viewport,XY} from './model';
import {anchorPixel,createCoordinates,resolveAnchor,textRotation} from './geometry';
import {objectBounds,type ScreenBounds} from './objectBounds';
import {layoutText} from './textGeometry';

/** Fixed page geometry cannot be brought into view by changing a data scale. */
function movableBounds(p:ProjectDocument,o:ProjectDocument['objects'][number],c:ReturnType<typeof createCoordinates>):ScreenBounds{
 if(!o.anchors.some(a=>a.mode==='page'))return objectBounds(p,o,c);
 const moving=o.anchors.find(a=>a.mode!=='page')!;
 if(o.type==='callout'&&o.anchors[1]?.mode==='page')return objectBounds(p,{...o,type:'marker',anchors:[moving],style:{...o.style,markerSizePt:12}},c);
 return objectBounds(p,{...o,anchors:o.anchors.map(a=>a.mode==='page'?moving:a)},c);
}

/** One data scan, then a bounded pixel-space refinement; never edits scientific data. */
export function fitContent(p:ProjectDocument,width:number,height:number,available:Partial<ScreenBounds>={}):Viewport{
 let xMin=Infinity,xMax=-Infinity,yMin=Infinity,yMax=-Infinity;
 const add=(a:XY)=>{if(Number.isFinite(a.x)&&Number.isFinite(a.y)){xMin=Math.min(xMin,a.x);xMax=Math.max(xMax,a.x);yMin=Math.min(yMin,a.y);yMax=Math.max(yMax,a.y)}};
 let markerRadius=2;
 for(const s of p.series)if(s.visible&&!p.calculations.some(c=>c.resultDatasetId===s.datasetId&&c.status!=='valid')){
  markerRadius=Math.max(markerRadius,s.mode==='line'?s.style.strokeWidthPt:s.style.markerSizePt);
  const d=p.datasets.find(d=>d.id===s.datasetId);if(d){const bounds=uncertaintyBounds(d,s);add({x:bounds.minX,y:bounds.minY});add({x:bounds.maxX,y:bounds.maxY})}
 }
 const objects=p.objects.filter(o=>o.visible&&o.type!=='line'&&o.type!=='table'&&o.anchors.some(a=>a.mode!=='page'));
 const glyphSizes=new Map(objects.filter(o=>['text','callout'].includes(o.type)&&o.anchors[o.type==='callout'?1:0]?.mode!=='page').map(o=>{const b=layoutText(o).bounds,r=textRotation(p,o.id)*Math.PI/180;return [o.id,{width:Math.abs(b.width*Math.cos(r))+Math.abs(b.height*Math.sin(r)),height:Math.abs(b.width*Math.sin(r))+Math.abs(b.height*Math.cos(r))}]}));
 for(const o of objects)for(const a of o.anchors)if(a.mode!=='page'){const at=resolveAnchor(p,a);if(o.type!=='range-y'&&Number.isFinite(at.x)){xMin=Math.min(xMin,at.x);xMax=Math.max(xMax,at.x)}if(o.type!=='range-x'&&Number.isFinite(at.y)){yMin=Math.min(yMin,at.y);yMax=Math.max(yMax,at.y)}}
 if(p.legend.visible&&p.legend.anchor.mode!=='page')add(resolveAnchor(p,p.legend.anchor));
 const hasX=Number.isFinite(xMin),hasY=Number.isFinite(yMin);if(!hasX&&!hasY)return p.viewport;
 if(!hasX){xMin=p.viewport.xMin;xMax=p.viewport.xMax}if(!hasY){yMin=p.viewport.yMin;yMax=p.viewport.yMax}
 const finite=(n:number)=>Math.max(-Number.MAX_VALUE,Math.min(Number.MAX_VALUE,n));
 const span=(a:number,b:number)=>b/2-a/2;
 const pad=(a:number,b:number)=>a===b?(Math.abs(a)*.05||.5):span(a,b)*.12;
 let view:Viewport={xMin:finite(xMin-(hasX?pad(xMin,xMax):0)),xMax:finite(xMax+(hasX?pad(xMin,xMax):0)),yMin:finite(yMin-(hasY?pad(yMin,yMax):0)),yMax:finite(yMax+(hasY?pad(yMin,yMax):0))};
 if(!(view.xMin<view.xMax&&view.yMin<view.yMax))return p.viewport;
 for(let iteration=0;iteration<32;iteration++){
  const q={...p,viewport:view,axes:{x:{...p.axes.x,tickMode:'auto' as const},y:{...p.axes.y,tickMode:'auto' as const}}},c=createCoordinates(q,width,height);
  const safe={left:Math.max(c.left,available.left??0)+12,right:Math.min(c.right,available.right??width)-12,top:Math.max(c.top,available.top??0)+12,bottom:Math.min(c.bottom,available.bottom??height)-12};
  if(safe.right-safe.left<24||safe.bottom-safe.top<24)return p.viewport;
  const bounds:ScreenBounds={left:hasX?c.x(xMin)-markerRadius:safe.left,right:hasX?c.x(xMax)+markerRadius:safe.right,top:hasY?c.y(yMax)-markerRadius:safe.top,bottom:hasY?c.y(yMin)+markerRadius:safe.bottom};
  // Scaling cannot make fixed-size glyphs smaller. Fit their anchors on an
  // impossible axis, leaving font size and all scientific coordinates intact.
  for(const o of objects){const b=movableBounds(p,o,c),glyph=glyphSizes.get(o.id);if(o.type!=='range-y'&&(!glyph||glyph.width<=safe.right-safe.left)){bounds.left=Math.min(bounds.left,b.left);bounds.right=Math.max(bounds.right,b.right)}if(o.type!=='range-x'&&(!glyph||glyph.height<=safe.bottom-safe.top)){bounds.top=Math.min(bounds.top,b.top);bounds.bottom=Math.max(bounds.bottom,b.bottom)}}
  if(p.legend.visible&&p.legend.anchor.mode!=='page'){const a=anchorPixel(p,p.legend.anchor,c);bounds.left=Math.min(bounds.left,a.x);bounds.top=Math.min(bounds.top,a.y-10);bounds.right=Math.max(bounds.right,a.x+34+Math.max(0,...p.series.filter(s=>s.visible).map(s=>s.name.length*7.21)));bounds.bottom=Math.max(bounds.bottom,a.y+p.series.filter(s=>s.visible).length*23)}
  const left=Math.max(0,safe.left-bounds.left),right=Math.max(0,bounds.right-safe.right),top=Math.max(0,safe.top-bounds.top),bottom=Math.max(0,bounds.bottom-safe.bottom);
  if(Math.max(left,right,top,bottom)<.1)break;
  const sx=span(view.xMin,view.xMax)*2/(safe.right-safe.left),sy=span(view.yMin,view.yMax)*2/(safe.bottom-safe.top);
  const next={xMin:finite(view.xMin-left*sx*1.08),xMax:finite(view.xMax+right*sx*1.08),yMin:finite(view.yMin-bottom*sy*1.08),yMax:finite(view.yMax+top*sy*1.08)};
  if(!Object.values(next).every(Number.isFinite)||!(next.xMin<next.xMax&&next.yMin<next.yMax))break;view=next;
 }
 // Existing explicit tick settings must remain valid at the navigated range.
 try{createCoordinates({...p,viewport:view},width,height)}catch{return p.viewport}
 return view;
}
