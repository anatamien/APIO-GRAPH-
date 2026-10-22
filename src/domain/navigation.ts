import type {Viewport,XY} from './model';
export function validView(v:Viewport){return Object.values(v).every(Number.isFinite)&&v.xMin<v.xMax&&v.yMin<v.yMax}
/** Refuse overflow and spans too small to invert accurately at the current magnitude. */
export function zoomView(v:Viewport,anchor:XY,factor:number):Viewport|null{
 const next={xMin:anchor.x+(v.xMin-anchor.x)*factor,xMax:anchor.x+(v.xMax-anchor.x)*factor,yMin:anchor.y+(v.yMin-anchor.y)*factor,yMax:anchor.y+(v.yMax-anchor.y)*factor};
 if(!validView(next)||!(factor>0&&Number.isFinite(factor)))return null;
 for(const [min,max] of [[next.xMin,next.xMax],[next.yMin,next.yMax]])if(max/2-min/2<=Math.max(Math.abs(min),Math.abs(max),Number.MIN_VALUE)*Number.EPSILON*16)return null;
 return next;
}
