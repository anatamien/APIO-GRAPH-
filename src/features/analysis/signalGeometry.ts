import type {ProjectDocument,XY} from '../../domain/model';
import type {Coordinates} from '../../domain/geometry';
import {interpolate} from '../../domain/math/core';
import {signalOrder,areaGrid} from '../../domain/math/signals';
import {visiblePoints,displayPoints} from '../chart/displayPoints';
import {signalGrid} from './signalGrid';

export function lineGeometry(points:readonly XY[],c:Coordinates,p:ProjectDocument,screen:boolean,margin=0):string{
 const selected=screen?visiblePoints(points as XY[],p.viewport.xMin,p.viewport.xMax,Math.max(256,(c.right-c.left)*2),margin):points;
 let path='';for(const a of selected){const x=c.x(a.x),y=c.y(a.y);if(Number.isFinite(x)&&Number.isFinite(y))path+=`${path?'L':'M'}${x},${y}`}
 return path;
}
export function peakGeometry(points:readonly XY[],c:Coordinates,p:ProjectDocument,screen:boolean,margin=0):string{
 const selected=screen?visiblePoints(points as XY[],p.viewport.xMin,p.viewport.xMax,Math.max(128,(c.right-c.left)*2),margin):points;
 let path='';for(const a of selected){const x=c.x(a.x),y=c.y(a.y);if(Number.isFinite(x)&&Number.isFinite(y))path+=`M${x-4},${y}h8M${x},${y-4}v8`}
 return path;
}
export function regionGeometry(points:readonly XY[],reference:readonly XY[]|undefined,parameters:Record<string,unknown>,c:Coordinates,p:ProjectDocument,screen:boolean,margin=0):string{
 try{
  const range=parameters.range as readonly number[]|undefined;if(!range||range.length!==2)return '';
  const extra=(p.viewport.xMax/2-p.viewport.xMin/2)*(margin*2);
  const start=screen?Math.max(range[0],p.viewport.xMin-extra):range[0],end=screen?Math.min(range[1],p.viewport.xMax+extra):range[1];if(!(start<end))return '';
  // Large unordered/duplicate grids arrive asynchronously from the Worker.
  // Never thin acquisition rows before averaging repeated observations.
  const a=screen?signalGrid(points,parameters):signalOrder(points,parameters),b=reference?(screen?signalGrid(reference,parameters):signalOrder(reference,parameters)):undefined;
  if(!a||reference&&!b)return '';
  if(a.length<2||b&&b.length<2)return '';
  if(range[0]<a[0].x||range[1]>a.at(-1)!.x||b&&(range[0]<b[0].x||range[1]>b.at(-1)!.x))return '';
  // Invalid/obsolete drafts do not extrapolate visually either.
  if(start<a[0].x||end>a.at(-1)!.x||b&&(start<b[0].x||end>b.at(-1)!.x))return '';
  const outline=(items:readonly XY[])=>{
   const inner=screen?visiblePoints(items as XY[],start,end,Math.max(256,(c.right-c.left)*2)):items;
   return [{x:start,y:interpolate(items,start)},...inner.filter(v=>v.x>start&&v.x<end),{x:end,y:interpolate(items,end)}];
  };
  const upper=outline(a),lower=b?outline(b):[{x:start,y:0},{x:end,y:0}];
  return `${lineGeometry(upper,c,p,false)}${lower.slice().reverse().map(v=>`L${c.x(v.x)},${c.y(v.y)}`).join('')}Z`;
 }catch{return ''}
}
export function previewOutline(points:XY[],limit=4096):XY[]{return displayPoints(points,limit)}
// Kept as an explicit export for numerical/visual-grid correspondence tests.
export {areaGrid};
