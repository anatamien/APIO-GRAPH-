import { scaleLinear } from 'd3-scale';
import { quadtree } from 'd3-quadtree';
import type { Anchor, Axis, ProjectDocument, XY, Point, Viewport } from './model';
// Documents are edited immutably. Weak keys release caches with closed tabs/history.
const pointIndices=new WeakMap<Point[],Map<string,number>>();
export function pointIndex(points:Point[]):Map<string,number>{
 let index=pointIndices.get(points);if(!index){index=new Map();for(let i=0;i<points.length;i++)index.set(points[i].id,i);pointIndices.set(points,index)}return index;
}
export function resolveAnchor(p:ProjectDocument,a:Anchor):XY {
  if(a.mode==='data')return {x:a.x,y:a.y};
  if(a.mode==='page')return {x:a.pageX,y:a.pageY};
  const points=p.datasets.find(d=>d.id===a.datasetId)?.points,index=points?pointIndex(points).get(a.pointId):undefined,pt=index===undefined?undefined:points![index];
  return {x:pt?.x??a.fallbackX,y:pt?.y??a.fallbackY};
}
export function autoRange(p:ProjectDocument):Viewport {
  let xMin=Infinity,xMax=-Infinity,yMin=Infinity,yMax=-Infinity;
  for(const s of p.series)if(s.visible&&s.includeInAutoRange&&!p.calculations.some(c=>c.resultDatasetId===s.datasetId&&c.status!=='valid'))for(const pt of p.datasets.find(d=>d.id===s.datasetId)?.points??[]){xMin=Math.min(xMin,pt.x);xMax=Math.max(xMax,pt.x);yMin=Math.min(yMin,pt.y);yMax=Math.max(yMax,pt.y)}
  if(!Number.isFinite(xMin))return {xMin:0,xMax:10,yMin:0,yMax:10};
  const pad=(a:number,b:number)=>a===b?Math.max(Math.abs(a)*0.05,0.5):(b/2-a/2)*0.1;
  const finite=(n:number)=>Math.max(-Number.MAX_VALUE,Math.min(Number.MAX_VALUE,n));
  const px=pad(xMin,xMax),py=pad(yMin,yMax);return {xMin:finite(xMin-px),xMax:finite(xMax+px),yMin:finite(yMin-py),yMax:finite(yMax+py)};
}
export function fitView(p:ProjectDocument):ProjectDocument {const v=autoRange(p);return {...p,viewport:v,axes:{x:{...p.axes.x,mode:'auto',min:v.xMin,max:v.xMax},y:{...p.axes.y,mode:'auto',min:v.yMin,max:v.yMax}}}}
interface CoordinateScale {(value:number):number;invert:(value:number)=>number}
export interface Coordinates {x:CoordinateScale;y:CoordinateScale;left:number;right:number;top:number;bottom:number;width:number;height:number;xTicks:number[];yTicks:number[];xLabelWidth:number}
const coordinateCache=new WeakMap<Viewport,Map<string,Coordinates>>();
export function createCoordinates(p:ProjectDocument,width:number,height:number):Coordinates{
  const key=JSON.stringify([width,height,p.page.paddingPx,...Object.values(p.viewport),p.extensions.plotFrame,...[p.axes.x,p.axes.y].flatMap(a=>[a.tickMode,a.tickStep,a.tickOrigin,a.numberFormat,a.precision])]);
  let cache=coordinateCache.get(p.viewport);const cached=cache?.get(key);if(cached)return cached;
  const pad=p.page.paddingPx;
  const xTicks=axisTicks(p.axes.x,p.viewport.xMin,p.viewport.xMax),yTicks=axisTicks(p.axes.y,p.viewport.yMin,p.viewport.yMax);
  const yLabels=yTicks.map(value=>formatNumber(value,p.axes.y));
  const xLabels=xTicks.map(value=>formatNumber(value,p.axes.x));
  // Courier New has fixed advance; reserve its measured CSS-size equivalent
  // in both screen and standalone export without depending on DOM layout.
  const labelWidth=(labels:string[])=>Math.max(0,...labels.map(label=>label.length*7.21));
  const xLabelWidth=labelWidth(xLabels),defaultLeft=Math.max(62,pad,44+labelWidth(yLabels)),defaultRight=Math.max(defaultLeft+10,width-Math.max(22,pad/2,12+xLabelWidth/2)),defaultTop=Math.max(22,pad/2),defaultBottom=Math.max(defaultTop+10,height-Math.max(54,pad));
  const f=p.extensions.plotFrame as number[]|undefined,left=f?f[0]*width:defaultLeft,right=f?f[2]*width:defaultRight,top=f?f[1]*height:defaultTop,bottom=f?f[3]*height:defaultBottom;
  const linear=(min:number,max:number,start:number,end:number)=>{const unit=Math.max(Math.abs(min),Math.abs(max))||1;const scale=scaleLinear().domain([min/unit,max/unit]).range([start,end]);return Object.assign((value:number)=>scale(value/unit),{invert:(value:number)=>scale.invert(value)*unit})};
  const x=linear(p.viewport.xMin,p.viewport.xMax,left,right),y=linear(p.viewport.yMin,p.viewport.yMax,bottom,top);
  const result={x,y,left,right,top,bottom,width,height,xTicks,yTicks,xLabelWidth};if(!cache){cache=new Map();coordinateCache.set(p.viewport,cache)}if(cache.size>=8)cache.delete(cache.keys().next().value!);cache.set(key,result);return result;
}
export function anchorPixel(p:ProjectDocument,a:Anchor,c:Coordinates):XY{if(a.mode==='page')return {x:a.pageX*c.width,y:a.pageY*c.height};const pos=resolveAnchor(p,a);return {x:c.x(pos.x)+(a.mode==='point'?a.offsetXpx:0),y:c.y(pos.y)+(a.mode==='point'?a.offsetYpx:0)}}
export function detachAnchor(p:ProjectDocument,a:Anchor,c:Coordinates=createCoordinates(p,p.page.widthPx,p.page.heightPx)):Anchor{if(a.mode==='data')return a;const pixel=anchorPixel(p,a,c),raw=resolveAnchor(p,a);return {mode:'data',x:a.mode==='point'&&a.offsetXpx===0?raw.x:c.x.invert(pixel.x),y:a.mode==='point'&&a.offsetYpx===0?raw.y:c.y.invert(pixel.y)}}
export function axisTicks(axis:Axis,min:number,max:number):number[]{
  if(axis.tickMode==='auto'){const unit=Math.max(Math.abs(min),Math.abs(max))||1;if(!Number.isFinite(max-min)||unit>1e200||unit<1e-200)return scaleLinear().domain([min/unit,max/unit]).ticks(8).map(v=>v*unit).filter(Number.isFinite);return scaleLinear().domain([min,max]).ticks(8)}
  const {first,last}=assertAxisRange(axis,min,max);
  const base=first*axis.tickStep+axis.tickOrigin;
  return Array.from({length:Math.max(0,last-first+1)},(_,i)=>base+i*axis.tickStep);
}
export function assertAxisRange(axis:Axis,min:number,max:number):{first:number;last:number}{
 if(axis.tickMode==='auto')return {first:0,last:0};
 if(!(axis.tickStep>0&&Number.isFinite(axis.tickStep)))throw new Error('INVALID_STEP');
 const first=Math.ceil((min-axis.tickOrigin)/axis.tickStep-1e-10),last=Math.floor((max-axis.tickOrigin)/axis.tickStep+1e-10);
 if(!Number.isFinite(last-first)||last-first>10000)throw new Error('TOO_MANY_TICKS');
 if(min+axis.tickStep===min||max-axis.tickStep===max)throw new Error('STEP_BELOW_PRECISION');return {first,last};
}
export function visibleTicks(ticks:number[],limit:number):number[]{const stride=Math.max(1,Math.ceil(ticks.length/Math.max(2,limit)));if(stride===1)return ticks;const result:number[]=[];for(let i=0;i<ticks.length;i+=stride)result.push(ticks[i]);return result}
export function minorTicks(major:number[],count:number,limit=Infinity):number[]{
  const result:number[]=[];const n=Math.max(0,Math.min(20,Math.floor(count)));
  const total=Math.max(0,major.length-1)*n,stride=Math.max(1,Math.ceil(total/Math.max(1,limit)));
  for(let k=0;k<total;k+=stride){const i=Math.floor(k/n)+1,j=k%n+1,t=j/(n+1),value=major[i-1]*(1-t)+major[i]*t;if(Number.isFinite(value))result.push(value)}
  return result;
}
export function textRotation(p:ProjectDocument,objectId:string):number {
  const values=p.extensions.textRotation;
  const value=values&&typeof values==='object'?(values as Record<string,unknown>)[objectId]:0;
  return typeof value==='number'&&Number.isFinite(value)?value%360:0;
}
export function formatNumber(value:number,a:Axis):string {return a.numberFormat==='fixed'?value.toFixed(a.precision):a.numberFormat==='scientific'?value.toExponential(a.precision):Number(value.toPrecision(8)).toString()}
export interface Candidate {px:number;py:number;point:Point;datasetId:string;seriesId:string;name:string;row:number}
function sourceRow(p:ProjectDocument,datasetId:string,pointId:string,fallback:number):number {
 const rows=p.extensions.sourceRows as Record<string,Record<string,unknown>>|undefined;
 const value=rows?.[datasetId]?.[pointId];return typeof value==='number'&&Number.isInteger(value)&&value>0?value:fallback;
}
const spatialIndices=new WeakMap<Point[],{tree:ReturnType<typeof quadtree<Point>>;xUnit:number;yUnit:number;clusters:WeakMap<object,Point[]>}>();
const clusterRows=new WeakMap<Point[],Uint32Array>();
function spatialIndex(points:Point[]){
 let index=spatialIndices.get(points);if(index)return index;
 let xUnit=0,yUnit=0;for(const pt of points){xUnit=Math.max(xUnit,Math.abs(pt.x));yUnit=Math.max(yUnit,Math.abs(pt.y))}xUnit||=1;yUnit||=1;
 const tree=quadtree<Point>().x(pt=>pt.x/xUnit).y(pt=>pt.y/yUnit).addAll(points),clusters=new WeakMap<object,Point[]>();
 pointIndex(points);
 tree.visit(node=>{if(!node.length&&node.next){const x=node.data.x,y=node.data.y;let leaf:typeof node|undefined=node,count=0,equal=true;do{count++;if(leaf.data.x!==x||leaf.data.y!==y){equal=false;break}leaf=leaf.next}while(leaf);if(equal&&count>512){const cluster:Point[]=[];leaf=node;do{cluster.push(leaf.data);leaf=leaf.next}while(leaf);cluster.reverse();if(count!==points.length)clusterRows.set(cluster,Uint32Array.from(cluster,point=>(pointIndex(points).get(point.id)??0)+1));clusters.set(node,count===points.length?points:cluster)}}return false});
 index={tree,xUnit,yUnit,clusters};spatialIndices.set(points,index);return index;
}
interface DenseCandidates {points:Point[];seriesId:string;datasetId:string;name:string;rows:unknown;px:number;py:number}
const denseCandidates=new WeakMap<Candidate[],DenseCandidates>();
const lazyCandidateLists=new WeakSet<Candidate[]>();
export function sameCandidates(a:Candidate[],b:Candidate[]):boolean{
 if(a===b)return true;if(a.length!==b.length)return false;
 const x=denseCandidates.get(a),y=denseCandidates.get(b);
 if(x||y)return !!x&&!!y&&x.points===y.points&&x.seriesId===y.seriesId&&x.datasetId===y.datasetId&&x.name===y.name&&x.rows===y.rows&&x.px===y.px&&x.py===y.py;
 if(lazyCandidateLists.has(a)||lazyCandidateLists.has(b))return false;
 return a.every((v,i)=>v.point===b[i].point&&v.seriesId===b[i].seriesId&&v.datasetId===b[i].datasetId&&v.name===b[i].name&&v.row===b[i].row&&v.px===b[i].px&&v.py===b[i].py);
}
/** A coincident group has one screen distance. Resolve only the candidates inspected. */
function lazyCandidateList(length:number,get:(index:number)=>Candidate):Candidate[]{
 const cache=new Map<number,Candidate>(),target:Candidate[]=[];
 const index=(key:PropertyKey)=>typeof key==='string'&&/^(0|[1-9]\d*)$/.test(key)?Number(key):-1;
 const list=new Proxy(target,{get(array,key,receiver){if(key==='length')return length;const i=index(key);if(i<0||i>=length)return Reflect.get(array,key,receiver);let value=cache.get(i);if(!value){value=get(i);if(cache.size>=1024)cache.clear();cache.set(i,value)}return value},has(array,key){const i=index(key);return i>=0&&i<length||Reflect.has(array,key)}});
 lazyCandidateLists.add(list);return list;
}
function lazyCandidates(meta:DenseCandidates,make:(point:Point)=>Candidate):Candidate[]{
 const list=lazyCandidateList(meta.points.length,index=>make(meta.points[index]));
 denseCandidates.set(list,meta);return list;
}
export function snapIndex(p:ProjectDocument,c:Coordinates){
 const denseCache=new WeakMap<Point[],Map<string,Candidate[]>>();
 let previousGroups:{keys:unknown[][];list:Candidate[]}|null=null;
 const sources=p.series.flatMap((s,order)=>{
  if(!s.visible||p.calculations.some(calc=>calc.resultDatasetId===s.datasetId&&calc.status!=='valid'))return [];
  const d=p.datasets.find(d=>d.id===s.datasetId);return d?[{s,d,order,index:spatialIndex(d.points)}]:[];
 });
 return (x:number,y:number,radius=10):Candidate[]=>{
  if(!Number.isFinite(x)||!Number.isFinite(y)||!(radius>=0&&Number.isFinite(radius)))return [];
  const out:{candidate:Candidate;distance:number;order:number;row:number}[]=[];
  const dense:{points:Point[];make:(point:Point)=>Candidate;meta:DenseCandidates;distance:number;order:number}[]=[];
  for(const {s,d,order,index:{tree,xUnit,yUnit,clusters}} of sources){
   const xa=c.x.invert(x-radius)/xUnit,xb=c.x.invert(x+radius)/xUnit,ya=c.y.invert(y-radius)/yUnit,yb=c.y.invert(y+radius)/yUnit;
   const left=Math.min(xa,xb),right=Math.max(xa,xb),top=Math.min(ya,yb),bottom=Math.max(ya,yb);
   tree.visit((node,x0,y0,x1,y1)=>{
    if(x0>right||x1<left||y0>bottom||y1<top)return true;
    if(!node.length){const points=clusters.get(node);if(points){const px=c.x(points[0].x),py=c.y(points[0].y),distance=Math.hypot(px-x,py-y);if(distance<=radius)dense.push({points,distance,order,meta:{points,px,py,seriesId:s.id,datasetId:d.id,name:s.name,rows:p.extensions.sourceRows},make:point=>({px,py,point,datasetId:d.id,seriesId:s.id,name:s.name,row:sourceRow(p,d.id,point.id,(pointIndex(d.points).get(point.id)??0)+1)})});return false}let leaf:typeof node|undefined=node;do{const point=leaf.data,px=c.x(point.x),py=c.y(point.y),distance=Math.hypot(px-x,py-y);if(distance<=radius){const row=(pointIndex(d.points).get(point.id)??0)+1;out.push({candidate:{px,py,point,datasetId:d.id,seriesId:s.id,name:s.name,row:sourceRow(p,d.id,point.id,row)},distance,order,row})}leaf=leaf.next}while(leaf)}return false;
   });
  }
  if(dense.length===1&&!out.length){const hit=dense[0];let lists=denseCache.get(hit.points);if(!lists){lists=new Map();denseCache.set(hit.points,lists)}let list=lists.get(hit.meta.seriesId);if(!list){list=lazyCandidates(hit.meta,hit.make);lists.set(hit.meta.seriesId,list)}return list}
  if(dense.length){
   // Merge sorted acquisition rows by rank. Dense clusters remain lazy even
   // when ordinary neighbours or equally distant clusters share the radius.
   const groups=[...dense.map(hit=>{const rows=clusterRows.get(hit.points);return {length:hit.points.length,distance:hit.distance,order:hit.order,rowAt:(i:number)=>rows?.[i]??i+1,get:(i:number)=>hit.make(hit.points[i]),key:[hit.points,hit.meta.seriesId,hit.meta.datasetId,hit.meta.name,hit.meta.px,hit.meta.py,hit.meta.rows]}}),...out.map(hit=>({length:1,distance:hit.distance,order:hit.order,rowAt:()=>hit.row,get:()=>hit.candidate,key:[hit.candidate.point,hit.candidate.seriesId,hit.candidate.datasetId,hit.candidate.name,hit.candidate.px,hit.candidate.py,p.extensions.sourceRows]}))];
   groups.sort((a,b)=>a.distance-b.distance||a.order-b.order);
   const keys=groups.map((g,i)=>[...g.key,i>0&&g.distance===groups[i-1].distance&&g.order===groups[i-1].order]);
   if(previousGroups&&previousGroups.keys.length===keys.length&&keys.every((key,i)=>key.every((v,j)=>v===previousGroups!.keys[i][j])))return previousGroups.list;
   const blocks:{end:number;get:(index:number)=>Candidate}[]=[];let count=0;
   for(let i=0;i<groups.length;){let end=i+1;while(end<groups.length&&groups[end].distance===groups[i].distance&&groups[end].order===groups[i].order)end++;const tied=groups.slice(i,end),length=tied.reduce((n,g)=>n+g.length,0);
    const upper=(g:typeof groups[number],row:number)=>{let lo=0,hi=g.length;while(lo<hi){const mid=Math.floor((lo+hi)/2);if(g.rowAt(mid)<=row)lo=mid+1;else hi=mid}return lo};
    const get=tied.length===1?tied[0].get:(index:number)=>{let lo=1,hi=tied.reduce((max,g)=>Math.max(max,g.rowAt(g.length-1)),1);while(lo<hi){const mid=Math.floor((lo+hi)/2),n=tied.reduce((n,g)=>n+upper(g,mid),0);if(n>index)hi=mid;else lo=mid+1}for(const g of tied){const at=upper(g,lo)-1;if(at>=0&&g.rowAt(at)===lo)return g.get(at)}throw new Error('CANDIDATE_RANK_INVALID')};
    count+=length;blocks.push({end:count,get});i=end;
   }
   const list=lazyCandidateList(count,index=>{let lo=0,hi=blocks.length-1;while(lo<hi){const mid=Math.floor((lo+hi)/2);if(index<blocks[mid].end)hi=mid;else lo=mid+1}return blocks[lo].get(index-(lo?blocks[lo-1].end:0))});previousGroups={keys,list};return list;
  }
  out.sort((a,b)=>a.distance-b.distance||a.order-b.order||a.row-b.row);return out.map(v=>v.candidate);
 };
}
export function pointAnchor(a:Candidate):Anchor{return {mode:'point',datasetId:a.datasetId,pointId:a.point.id,fallbackX:a.point.x,fallbackY:a.point.y,offsetXpx:0,offsetYpx:0}}
