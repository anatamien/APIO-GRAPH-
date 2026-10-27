import type {Dataset,Point,Series,ErrorBarStyle} from './model';
export const defaultErrorBars=(s:Series):ErrorBarStyle=>s.errorBars??{x:true,y:true,capSizePt:3,widthPt:.75,color:s.style.stroke};
export function pointUncertainty(d:Dataset,p:Point,axis:'x'|'y',s?:Series):number|undefined{const option=s?.uncertainty?.[axis]??d.uncertainty?.[axis];return option?.mode==='none'?undefined:option?.mode==='constant'?option.value:axis==='x'?p.errorX:p.errorY}
interface ErrorExtent {minX:number;maxX:number;minY:number;maxY:number;errorMinX:number;errorMaxX:number;errorMinY:number;errorMaxY:number;xCount:number;yCount:number;xZero:number;yZero:number}
const extents=new WeakMap<readonly Point[],ErrorExtent>();
/** Full source measurement extents/coverage are indexed once per immutable point array, never per frame. */
export function uncertaintyExtent(points:readonly Point[]):ErrorExtent{
 const cached=extents.get(points);if(cached)return cached;const result:ErrorExtent={minX:Infinity,maxX:-Infinity,minY:Infinity,maxY:-Infinity,errorMinX:Infinity,errorMaxX:-Infinity,errorMinY:Infinity,errorMaxY:-Infinity,xCount:0,yCount:0,xZero:0,yZero:0};
 for(const p of points){result.minX=Math.min(result.minX,p.x);result.maxX=Math.max(result.maxX,p.x);result.minY=Math.min(result.minY,p.y);result.maxY=Math.max(result.maxY,p.y);const x=p.errorX??0,y=p.errorY??0;result.errorMinX=Math.min(result.errorMinX,p.x-x);result.errorMaxX=Math.max(result.errorMaxX,p.x+x);result.errorMinY=Math.min(result.errorMinY,p.y-y);result.errorMaxY=Math.max(result.errorMaxY,p.y+y);if(p.errorX!==undefined){result.xCount++;if(x===0)result.xZero++}if(p.errorY!==undefined){result.yCount++;if(y===0)result.yZero++}}
 extents.set(points,result);return result;
}
export function uncertaintyBounds(d:Dataset,s?:Series){
 const b=uncertaintyExtent(d.points),st=s?defaultErrorBars(s):{x:true,y:true},axis=(a:'x'|'y')=>{const option=s?.uncertainty?.[a]??d.uncertainty?.[a],lo=a==='x'?b.minX:b.minY,hi=a==='x'?b.maxX:b.maxY;if(!st[a]||option?.mode==='none')return[lo,hi];if(option?.mode==='constant')return[lo-option.value!,hi+option.value!];return a==='x'?[b.errorMinX,b.errorMaxX]:[b.errorMinY,b.errorMaxY]};const [minX,maxX]=axis('x'),[minY,maxY]=axis('y');return{minX,maxX,minY,maxY};
}
export function hasUncertainty(d:Dataset):boolean{return !!d.uncertainty||uncertaintyExtent(d.points).xCount+uncertaintyExtent(d.points).yCount>0}
