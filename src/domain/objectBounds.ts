import type {DrawObject,ProjectDocument,XY} from './model';
import {anchorPixel,textRotation,type Coordinates} from './geometry';
import {layoutText,calloutRoute} from './textGeometry';
export interface ScreenBounds {left:number;top:number;right:number;bottom:number}
export function boundsOf(points:XY[],padding=0):ScreenBounds{return {left:Math.min(...points.map(a=>a.x))-padding,right:Math.max(...points.map(a=>a.x))+padding,top:Math.min(...points.map(a=>a.y))-padding,bottom:Math.max(...points.map(a=>a.y))+padding}}
/** Shares exact text layout and leader routing with the scientific SVG renderer. */
export function objectBounds(p:ProjectDocument,o:DrawObject,c:Coordinates):ScreenBounds{
 const a=anchorPixel(p,o.anchors[0],c),b=anchorPixel(p,o.anchors[1]??o.anchors[0],c),points:XY[]=[],pad=o.style.strokeWidthPt*2/3+1;
 if(o.type==='text'||o.type==='callout'){
  const at=o.type==='text'?a:{x:b.x+6,y:b.y-6},box=layoutText(o).bounds,angle=textRotation(p,o.id),r=angle*Math.PI/180,cos=Math.cos(r),sin=Math.sin(r);
  for(const x of [box.x,box.x+box.width])for(const y of [box.y,box.y+box.height])points.push({x:at.x+x*cos-y*sin,y:at.y+x*sin+y*cos});
  if(o.type==='callout'){const route=calloutRoute(a,at,box,angle,12+o.style.strokeWidthPt*2/3);points.push(...route.leader,...route.shelf);if(route.arrowTip&&['start','both'].includes(o.style.arrowHead))points.push({x:a.x-11,y:a.y-11},{x:a.x+11,y:a.y+11})}
  return boundsOf(points,pad);
 }
 if(o.type==='line')return {left:c.left,top:c.top,right:c.right,bottom:c.bottom};
 if(o.type==='marker')return boundsOf([a],o.style.markerSizePt+pad);
 if(o.type==='range-x')return {left:Math.min(a.x,b.x)-pad,right:Math.max(a.x,b.x)+pad,top:c.top,bottom:c.bottom};
 if(o.type==='range-y')return {left:c.left,right:c.right,top:Math.min(a.y,b.y)-pad,bottom:Math.max(a.y,b.y)+pad};
 return boundsOf([a,b],pad+(o.type==='arrow'&&o.style.arrowHead!=='none'?11:0));
}
/** Explicit document edit for an unreachable object; F9 itself never calls this. */
export function returnObjectToCanvas(p:ProjectDocument,o:DrawObject,c:Coordinates,right=c.width):DrawObject{
 if(o.locked)return o;const margin=18,room=Math.max(50,right-margin),at=anchorPixel(p,o.anchors[0],c),b=o.type==='line'?boundsOf([at],2):objectBounds(p,o,c),dx=o.type==='line'?(c.left+Math.min(c.right,room))/2-at.x:b.right>room?room-b.right:b.left<margin?margin-b.left:0,dy=o.type==='line'?(c.top+c.bottom)/2-at.y:b.top<margin?margin-b.top:b.bottom>c.height-margin?c.height-margin-b.bottom:0;
 if(!dx&&!dy)return o;
 return {...o,anchors:o.anchors.map(a=>a.mode==='page'?{...a,pageX:Math.max(0,Math.min(1,a.pageX+dx/c.width)),pageY:Math.max(0,Math.min(1,a.pageY+dy/c.height))}:a.mode==='point'?{...a,offsetXpx:a.offsetXpx+dx,offsetYpx:a.offsetYpx+dy}:{...a,x:c.x.invert(c.x(a.x)+dx),y:c.y.invert(c.y(a.y)+dy)})};
}
