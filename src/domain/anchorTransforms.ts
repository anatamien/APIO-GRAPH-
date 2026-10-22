import type {Anchor,ProjectDocument} from './model';
import {anchorPixel,detachAnchor,pointIndex,type Coordinates} from './geometry';
export function convertAnchor(p:ProjectDocument,a:Anchor,mode:'data'|'page',c:Coordinates):Anchor{
 if(mode===a.mode)return a;if(mode==='data')return detachAnchor(p,a,c);const pixel=anchorPixel(p,a,c);if(pixel.x<0||pixel.y<0||pixel.x>c.width||pixel.y>c.height)return a;return {mode:'page',pageX:pixel.x/c.width,pageY:pixel.y/c.height};
}
export function anchorLinked(p:ProjectDocument,a:Anchor):boolean{if(a.mode!=='point')return true;const points=p.datasets.find(d=>d.id===a.datasetId)?.points;return !!points&&pointIndex(points).has(a.pointId)}
export function bindAnchorPoint(p:ProjectDocument,a:Anchor,datasetId:string,pointId:string,c:Coordinates,keepPosition:boolean):Anchor{
 const points=p.datasets.find(d=>d.id===datasetId)?.points,index=points?pointIndex(points).get(pointId):undefined,pt=index===undefined?undefined:points![index];if(!pt)throw Error('POINT_NOT_FOUND');const current=anchorPixel(p,a,c);
 return {mode:'point',datasetId,pointId,fallbackX:pt.x,fallbackY:pt.y,offsetXpx:keepPosition?current.x-c.x(pt.x):0,offsetYpx:keepPosition?current.y-c.y(pt.y):0};
}
