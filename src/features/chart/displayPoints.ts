import type {XY} from '../../domain/model';
interface Level {size:number;indices:Int32Array}
export interface DisplayIndex {direction:-1|0|1;verticalDirection:-1|0|1;strict:boolean;xMin:number;xMax:number;levels:Level[]}
interface Prepared extends DisplayIndex {selections:Map<string,XY[]>;markerTiles:Map<string,XY[]>}
const prepared=new WeakMap<XY[],Prepared>();
export const readDisplayIndex=(points:readonly XY[])=>prepared.get(points as XY[]);
export function adoptDisplayIndex(points:XY[],index:DisplayIndex){prepared.set(points,{...index,selections:new Map(),markerTiles:new Map()})}

function summary(points:XY[],indices:number[]):number[]{
 let lo=indices[0],hi=lo,lx=lo,hx=lo;
 for(const j of indices){if(points[j].y<points[lo].y)lo=j;if(points[j].y>points[hi].y)hi=j;if(points[j].x<points[lx].x)lx=j;if(points[j].x>points[hx].x)hx=j}
 return [indices[0],lo,hi,lx,hx,indices.at(-1)!];
}
function prepare(points:XY[]):Prepared{
 const cached=prepared.get(points);if(cached)return cached;
 let increasing=true,decreasing=true,strict=true,up=true,down=true,xMin=points[0].x,xMax=xMin;for(let i=1;i<points.length;i++){if(points[i].x<points[i-1].x)increasing=false;if(points[i].x>points[i-1].x)decreasing=false;if(points[i].x===points[i-1].x)strict=false;if(points[i].y<points[i-1].y)up=false;if(points[i].y>points[i-1].y)down=false;xMin=Math.min(xMin,points[i].x);xMax=Math.max(xMax,points[i].x)}
 const levels:Level[]=[];
 let size=8,indices=new Int32Array(Math.ceil(points.length/size)*6);
 for(let i=0;i<points.length;i+=size){const part=Array.from({length:Math.min(size,points.length-i)},(_,j)=>i+j);indices.set(summary(points,part),i/size*6)}
 levels.push({size,indices});
 while(Math.ceil(points.length/size)>1){const next=new Int32Array(Math.ceil(points.length/(size*2))*6);for(let i=0;i<indices.length;i+=12){const part=[...new Set(indices.slice(i,i+12))].sort((a,b)=>a-b);next.set(summary(points,part),i/12*6)}size*=2;indices=next;levels.push({size,indices})}
 const result:Prepared={direction:increasing?1:decreasing?-1:0,verticalDirection:up?1:down?-1:0,strict,xMin,xMax,levels,selections:new Map(),markerTiles:new Map()};prepared.set(points,result);return result;
}
function select(points:XY[],start:number,end:number,limit:number,cache:Prepared):XY[]{
 if(start===0&&end===points.length&&points.length<=limit)return points;
 const key=`${start}:${end}:${limit}`,cached=cache.selections.get(key);if(cached)return cached;
 let result:XY[];
 if(end-start<=limit)result=points.slice(start,end);
 else{
  const ideal=(end-start)*6/limit,level=cache.levels.find(v=>v.size>=ideal)??cache.levels.at(-1)!,chosen:number[]=[];
  const first=Math.ceil(start/level.size)*level.size,last=Math.floor(end/level.size)*level.size;
  const edge=(a:number,b:number)=>{if(a<b)chosen.push(...summary(points,Array.from({length:b-a},(_,i)=>a+i)))};
  if(first>=last)edge(start,end);else{edge(start,first);for(let i=first;i<last;i+=level.size)chosen.push(...level.indices.subarray(i/level.size*6,i/level.size*6+6));edge(last,end)}
  result=[...new Set(chosen)].sort((a,b)=>a-b).map(i=>points[i]);
 }
 if(cache.selections.size>=8)cache.selections.delete(cache.selections.keys().next().value!);cache.selections.set(key,result);return result;
}
/** Extrema at immutable acquisition-order levels, without replacing source arrays. */
export function displayPoints<T extends XY>(points:T[],limit:number):T[];
export function displayPoints(points:XY[],limit:number):XY[]{
 limit=Math.max(6,Math.floor(limit));if(points.length<=limit)return points;
 return select(points,0,points.length,limit,prepare(points));
}
/** Monotonic X supports exact range lookup, including neighbours across clip edges. */
export function visiblePoints<T extends XY>(points:T[],min:number,max:number,limit:number,margin?:number):T[];
export function visiblePoints(points:XY[],min:number,max:number,limit:number,margin=0):XY[]{
 if(!points.length)return points;limit=Math.max(6,Math.floor(limit));
 const cache=prepare(points);if(!cache.direction)return select(points,0,points.length,limit,cache);
 const direction=cache.direction,lower=direction===1?min:-max,upper=direction===1?max:-min;
 const bound=(target:number,inclusive:boolean)=>{let lo=0,hi=points.length;while(lo<hi){const mid=Math.floor((lo+hi)/2),value=points[mid].x*direction;if(value<target||(inclusive&&value===target))lo=mid+1;else hi=mid}return lo};
 const start=Math.max(0,bound(lower,false)-1),end=Math.min(points.length,bound(upper,true)+1);
 if(margin>0){
  const extra=(max/2-min/2)*(margin*2),first=Math.max(0,bound(Math.max(-Number.MAX_VALUE,lower-extra),false)-1),last=Math.min(points.length,bound(Math.min(Number.MAX_VALUE,upper+extra),true)+1);
  if(first===start&&last===end)return select(points,start,end,limit,cache);
  const key=`margin:${first}:${start}:${end}:${last}:${limit}:${margin}`,cached=cache.selections.get(key);if(cached)return cached;
  // Select the view independently: a dense offscreen cluster must never reduce its detail.
  const side=Math.max(6,Math.floor(limit*margin)),result=[...select(points,first,start,side,cache),...select(points,start,end,limit,cache),...select(points,end,last,side,cache)];
  if(cache.selections.size>=8)cache.selections.delete(cache.selections.keys().next().value!);cache.selections.set(key,result);return result;
 }
 return select(points,start,end,limit,cache);
}

/** Markers use fixed data-space tiles, rather than a level chosen by the moving
 * viewport's point count. A pan cannot replace interior observations when a dense
 * cluster enters the edge. Each tile retains acquisition-order extrema; sparse
 * tiles restore every original point independently of neighbouring dense tiles.
 */
export function visibleMarkerPoints<T extends XY>(points:T[],min:number,max:number,limit:number,margin?:number,vertical?:readonly [number,number]):T[];
export function visibleMarkerPoints(points:XY[],min:number,max:number,limit:number,margin=0,vertical?:readonly [number,number]):XY[]{
 if(!points.length)return points;
 const xMin=min,xMax=max;
 const cache=prepare(points),useY=vertical&&cache.verticalDirection!==0&&cache.xMax-cache.xMin<(max-min)/32&&cache.xMin>=min-(max-min)*margin&&cache.xMax<=max+(max-min)*margin;
 const axis=useY?'y':'x',direction=useY?cache.verticalDirection:cache.direction;
 if(useY){min=vertical[0];max=vertical[1]}
 const fallback=()=>{
  if(axis==='x')return visiblePoints(points,xMin,xMax,limit,margin);
  const extra=(max/2-min/2)*(margin*2),lower=(direction===1?min:-max)-extra,upper=(direction===1?max:-min)+extra;
  const bound=(value:number,inclusive:boolean)=>{let lo=0,hi=points.length;while(lo<hi){const mid=Math.floor((lo+hi)/2),at=points[mid][axis]*direction;if(at<value||(inclusive&&at===value))lo=mid+1;else hi=mid}return lo};
  return select(points,Math.max(0,bound(lower,false)-1),Math.min(points.length,bound(upper,true)+1),limit,cache);
 };
 const span=max-min,tile=2**Math.floor(Math.log2(span/32));
 if(!direction||!(tile>0)||!Number.isFinite(span))return fallback();
 const lo=min-span*margin,hi=max+span*margin,first=Math.floor(lo/tile),last=Math.floor(hi/tile);
 if(!Number.isSafeInteger(first)||!Number.isSafeInteger(last)||last-first>256)return fallback();
 const bound=(target:number)=>{let a=0,b=points.length;while(a<b){const mid=Math.floor((a+b)/2),value=points[mid][axis]*direction;if(value<target||(direction===-1&&value===target))a=mid+1;else b=mid}return a};
 const bounds=(a:number,b:number)=>[bound(direction===1?a:-b),bound(direction===1?b:-a)] as const;
 const baseBudget=Math.max(6,Math.floor(limit*(tile/span))),result:XY[]=[];
 for(let index=0;index<=last-first;index++){
  const i=direction===1?first+index:last-index;
  const key=`${axis}:${tile}:${i}:${limit/span}`;let selected=cache.markerTiles.get(key);
  if(!selected){
   const [start,end]=bounds(i*tile,(i+1)*tile),parent=Math.floor(i/64)*64,[parentStart,parentEnd]=bounds(parent*tile,(parent+64)*tile);
   // Fixed parent occupancy distributes spare detail to narrow/vertical traces.
   // Both boundaries are independent of pan, so interior identities stay stable.
   const budget=Math.max(baseBudget,Math.floor(limit*(tile/span)*64*((end-start)/Math.max(1,parentEnd-parentStart))));
   selected=start===end?[]:select(points,start,end,budget,cache);if(cache.markerTiles.size>=256)cache.markerTiles.delete(cache.markerTiles.keys().next().value!);cache.markerTiles.set(key,selected)
  }
  result.push(...selected);
 }
 return result;
}
