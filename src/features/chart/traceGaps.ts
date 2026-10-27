import type {Point,XY} from '../../domain/model';
import {pointIndex} from '../../domain/geometry';
const cache=new WeakMap<Point[],WeakMap<string[],number[]>>();
/** Insert pen-up sentinels after display reduction, without joining across missing source rows. */
export function traceGaps(all:Point[],chosen:Point[],pixels:XY[],breakIds?:string[]):XY[]{
 if(!breakIds?.length)return pixels;let byBreak=cache.get(all);if(!byBreak){byBreak=new WeakMap();cache.set(all,byBreak)}let cuts=byBreak.get(breakIds);const index=pointIndex(all);
 if(!cuts){cuts=breakIds.map(id=>index.get(id)).filter((v):v is number=>v!==undefined).sort((a,b)=>a-b);byBreak.set(breakIds,cuts)}
 const result:XY[]=[];let previous=-1;for(let i=0;i<chosen.length;i++){const at=index.get(chosen[i].id)!;let lo=0,hi=cuts.length;while(lo<hi){const mid=(lo+hi)>>>1;if(cuts[mid]<=Math.min(previous,at))lo=mid+1;else hi=mid}if(i&&lo<cuts.length&&cuts[lo]<=Math.max(previous,at))result.push({x:NaN,y:NaN});result.push(pixels[i]);previous=at}return result;
}
