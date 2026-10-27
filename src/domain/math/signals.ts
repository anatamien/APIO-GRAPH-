import {MathError,finite,interpolate,interpolateSegment,ordered,readRange,sum,trapezoidIntegral,validateInput,type CalculationResult,type Parameters,type XY} from './core';
import {fitPolynomial} from './regression';
import type {PeakMeasurement} from '../signalTypes';

function number(p:Parameters,key:string,fallback:number,min=-Infinity,max=Infinity,integer=false):number{
 const v=p[key]??fallback;if(typeof v!=='number'||!Number.isFinite(v)||v<min||v>max||(integer&&!Number.isInteger(v)))throw new MathError('SIGNAL_PARAMETER',{parameter:key});return v;
}
/** Already ordered unique coordinates need no per-point copy or Map. */
export function signalOrder(points:readonly XY[],p:Parameters):readonly XY[]{
 let strict=true;for(let i=1;i<points.length;i++)if(points[i].x<=points[i-1].x){strict=false;break}
 return strict?points:ordered(points,p);
}
function intervals(value:unknown):[number,number][]{
 if(!Array.isArray(value)||!value.length||value.length>64)throw new MathError('SIGNAL_BACKGROUND');
 const ranges=value.map(v=>{const r=readRange(v);if(!r)throw new MathError('SIGNAL_BACKGROUND');return [r[0],r[1]] as [number,number]}).sort((a,b)=>a[0]-b[0]);
 const merged:[number,number][]=[];for(const r of ranges){const last=merged.at(-1);if(last&&r[0]<=last[1])last[1]=Math.max(last[1],r[1]);else merged.push(r)}return merged;
}
function inIntervals(x:number,ranges:readonly [number,number][]):boolean{
 let lo=0,hi=ranges.length;while(lo<hi){const m=(lo+hi)>>>1;if(ranges[m][1]<x)lo=m+1;else hi=m}return lo<ranges.length&&ranges[lo][0]<=x;
}

/** Eilers/Boelens AsLS, equal-spaced observations, second-difference penalty.
 * Cholesky stores only three lower diagonals; no dense N by N matrix exists. */
function asls(points:readonly XY[],p:Parameters):{values:Float64Array;summary:CalculationResult['summary']} {
 const n=points.length;if(n<3)throw new MathError('MATH_POINTS',{required:3});
 const lambda=number(p,'lambda',1e5,1e-8,1e9),asymmetry=number(p,'asymmetry',.01,1e-6,1-1e-6),maximum=number(p,'iterations',30,1,200,true),tolerance=number(p,'tolerance',1e-6,1e-12,.1);
 const step=(points[n-1].x-points[0].x)/(n-1);if(!(step>0)||!Number.isFinite(step))throw new MathError('SIGNAL_ASLS_UNIFORM');
 for(let i=1;i<n;i++)if(Math.abs((points[i].x-points[i-1].x)-step)>Math.max(step*1e-3,Number.EPSILON*Math.abs(points[i].x)*2))throw new MathError('SIGNAL_ASLS_UNIFORM');
 let low=Infinity,high=-Infinity;for(const a of points){low=Math.min(low,a.y);high=Math.max(high,a.y)}
 const center=low/2+high/2,scale=Math.max(Math.abs(low-center),Math.abs(high-center));
 if(!scale)return{values:new Float64Array(n).fill(low),summary:{method:'asls-second-difference-banded-cholesky',iterations:0,relativeChange:0}};
 const y=Float64Array.from(points,a=>(a.y-center)/scale),weights=new Float64Array(n).fill(1),diagonal=new Float64Array(n),off=new Float64Array(n),l0=new Float64Array(n),l1=new Float64Array(n),l2=new Float64Array(n),rhs=new Float64Array(n),z=new Float64Array(n);
 for(let i=0;i<n-2;i++){diagonal[i]+=lambda;diagonal[i+1]+=4*lambda;diagonal[i+2]+=lambda;off[i+1]-=2*lambda;off[i+2]-=2*lambda}
 let used=0,change=Infinity,converged=false;
 for(let iteration=0;iteration<maximum;iteration++){
  for(let i=0;i<n;i++){
   l2[i]=i>1?lambda/l0[i-2]:0;l1[i]=i?(off[i]-l2[i]*l1[i-1])/l0[i-1]:0;
   const d=diagonal[i]+weights[i]-l1[i]*l1[i]-l2[i]*l2[i];if(!(d>0)||!Number.isFinite(d))throw new MathError('SIGNAL_ASLS_SYSTEM');
   l0[i]=Math.sqrt(d);rhs[i]=(weights[i]*y[i]-(i?l1[i]*rhs[i-1]:0)-(i>1?l2[i]*rhs[i-2]:0))/l0[i];
  }
  let delta=0,norm=0,changedWeights=0;
  for(let i=n-1;i>=0;i--){
   const next=(rhs[i]-(i+1<n?l1[i+1]*z[i+1]:0)-(i+2<n?l2[i+2]*z[i+2]:0))/l0[i];
   delta+=(next-z[i])**2;norm+=next*next;z[i]=finite(next);
  }
  for(let i=0;i<n;i++){const w=y[i]>z[i]?asymmetry:1-asymmetry;if(w!==weights[i])changedWeights++;weights[i]=w}
  used=iteration+1;change=Math.sqrt(delta/Math.max(norm,Number.MIN_VALUE));
  if(!changedWeights||(iteration>0&&change<=tolerance)){converged=true;break}
 }
 for(let i=0;i<n;i++)z[i]=finite(center+scale*z[i]);
 return{values:z,summary:{method:'asls-second-difference-banded-cholesky',iterations:used,relativeChange:change,...(!converged?{warning:'SIGNAL_ASLS_ITERATION_LIMIT'}:{})}};
}

export function baseline(points:readonly XY[],p:Parameters):CalculationResult{
 validateInput(points,p);const method=p.method??'manual',output=p.output??'corrected';
 if(p.extrapolate!==undefined&&typeof p.extrapolate!=='boolean')throw new MathError('SIGNAL_PARAMETER');
 if(!['baseline','corrected','both'].includes(String(output)))throw new MathError('SIGNAL_PARAMETER',{parameter:'output'});
 let evaluate:(a:XY,i:number)=>number,summary:CalculationResult['summary']={method:String(method)};
 if(method==='manual'){
  if(!Array.isArray(p.nodes)||p.nodes.length<2||p.nodes.length>10000||p.nodes.some(a=>!a||typeof a!=='object'||!Number.isFinite(a.x)||!Number.isFinite(a.y)))throw new MathError('SIGNAL_NODES');
  const nodes=p.nodes as XY[];validateInput(nodes,{});for(let i=1;i<nodes.length;i++)if(nodes[i].x<=nodes[i-1].x)throw new MathError('SIGNAL_NODES');
  evaluate=a=>{if(p.extrapolate!==true&&(a.x<nodes[0].x||a.x>nodes.at(-1)!.x))throw new MathError('SIGNAL_NODE_COVERAGE');return interpolate(nodes,a.x,p.extrapolate===true)};
  summary={method:'piecewise-linear-manual',nodes:nodes.length};
 }else if(method==='polynomial'){
  const degree=number(p,'degree',1,0,3,true),ranges=intervals(p.backgroundIntervals),background=points.filter(a=>inIntervals(a.x,ranges));
  if(background.length<degree+1)throw new MathError('SIGNAL_BACKGROUND');const fit=fitPolynomial(background,degree);
  evaluate=a=>fit.predict(a.x);summary={method:'scaled-householder-qr-background-only',degree,backgroundCount:background.length,conditionEstimate:fit.conditionEstimate};
 }else if(method==='asls'){
  const sorted=signalOrder(points,p),fitted=asls(sorted,p);summary=fitted.summary;
  const values=sorted===points?undefined:sorted.map((a,i)=>({x:a.x,y:fitted.values[i]}));evaluate=(a,i)=>values?interpolate(values,a.x):fitted.values[i];
 }else throw new MathError('SIGNAL_PARAMETER',{parameter:'method'});
 const result:CalculationResult={points:new Array(points.length),summary:{...summary,n:points.length,output:String(output)}};
 if(output==='both')result.companion=new Array(points.length);
 for(let i=0;i<points.length;i++){const a=points[i],b=finite(evaluate(a,i));result.points[i]={x:a.x,y:output==='corrected'?finite(a.y-b):b};if(result.companion)result.companion[i]={x:a.x,y:finite(a.y-b)}}
 return result;
}

/** Minimum queries and first threshold crossings in O(log N), including ties. */
class MinTree{
 readonly size:number;readonly tree:Float64Array;
 constructor(readonly values:Float64Array){let size=1;while(size<values.length)size*=2;this.size=size;this.tree=new Float64Array(size*2).fill(Infinity);this.tree.set(values,size);for(let i=size-1;i;i--)this.tree[i]=Math.min(this.tree[i*2],this.tree[i*2+1])}
 min(from:number,to:number):number{let v=Infinity;for(let l=from+this.size,r=to+this.size+1;l<r;l>>=1,r>>=1){if(l&1)v=Math.min(v,this.tree[l++]);if(r&1)v=Math.min(v,this.tree[--r])}return v}
 crossing(from:number,to:number,level:number,rightmost:boolean,node=1,lo=0,hi=this.size-1):number{
  if(hi<from||lo>to||this.tree[node]>level)return -1;if(lo===hi)return lo;
  const mid=(lo+hi)>>>1;
  const first=rightmost?this.crossing(from,to,level,true,node*2+1,mid+1,hi):this.crossing(from,to,level,false,node*2,lo,mid);
  return first>=0?first:rightmost?this.crossing(from,to,level,true,node*2,lo,mid):this.crossing(from,to,level,false,node*2+1,mid+1,hi);
 }
}
function bound(values:readonly number[],value:number,strict=false):number{let l=0,r=values.length;while(l<r){const m=(l+r)>>>1;if(values[m]<value||(strict&&values[m]===value))l=m+1;else r=m}return l}

export function findSignalPeaks(points:readonly XY[],p:Parameters):CalculationResult{
 if(p.includeIncomplete!==undefined&&typeof p.includeIncomplete!=='boolean')throw new MathError('SIGNAL_PARAMETER');
 validateInput(points,p);const all=signalOrder(points,p),range=readRange(p.range),data=range?all.filter(a=>a.x>=range[0]&&a.x<=range[1]):all,n=data.length;
 if(n<3)throw new MathError('MATH_POINTS',{required:3});const direction=p.direction??'max';if(direction!=='max'&&direction!=='min')throw new MathError('SIGNAL_PARAMETER',{parameter:'direction'});
 const sign=direction==='min'?-1:1,y=Float64Array.from(data,a=>a.y*sign),minimum=number(p,'prominence',0,0),distance=number(p,'distance',0,0),relative=number(p,'relativeHeight',.5,Number.EPSILON,2);
 const height=p.height===undefined?undefined:number(p,'height',0),minWidth=p.minWidth===undefined?undefined:number(p,'minWidth',0,0),maxWidth=p.maxWidth===undefined?undefined:number(p,'maxWidth',0,0);
 if(minWidth!==undefined&&maxWidth!==undefined&&minWidth>maxWidth)throw new MathError('SIGNAL_PARAMETER',{parameter:'width'});
 if(p.distanceUnit!==undefined&&!['x','samples'].includes(String(p.distanceUnit)))throw new MathError('SIGNAL_PARAMETER',{parameter:'distanceUnit'});
 if(p.distanceUnit==='samples'&&!Number.isInteger(distance))throw new MathError('SIGNAL_PARAMETER',{parameter:'distance'});
 const left=new Int32Array(n),right=new Int32Array(n),stack=new Int32Array(n);let used=0;
 for(let i=0;i<n;i++){while(used&&y[stack[used-1]]<=y[i])used--;left[i]=used?stack[used-1]:0;stack[used++]=i}
 used=0;for(let i=n-1;i>=0;i--){while(used&&y[stack[used-1]]<=y[i])used--;right[i]=used?stack[used-1]:n-1;stack[used++]=i}
 const tree=new MinTree(y),candidates:PeakMeasurement[]=[];let excludedUndefined=0,excludedFilters=0;
 for(let start=0;start<n;){
  let end=start;while(end+1<n&&y[end+1]===y[start])end++;
  const edge=start===0||end===n-1,apex=(start+end)>>>1,local=(start===0||y[start]>y[start-1])&&(end===n-1||y[end]>y[end+1])&&!(start===0&&end===n-1);
  if(local&&(!edge||p.includeIncomplete!==false)){
   const a=data[apex];if(height!==undefined&&(direction==='max'?a.y<height:a.y>height)){excludedFilters++;start=end+1;continue}
   const prominence=edge?null:finite(y[apex]-Math.max(tree.min(left[apex],apex),tree.min(apex,right[apex])));
   const level=prominence===null?null:finite(y[apex]-prominence*relative);
   let lx:number|null=null,rx:number|null=null;
   if(level!==null&&prominence!==null&&prominence>0){
    const l=tree.crossing(left[apex],start-1,level,true),r=tree.crossing(end+1,right[apex],level,false);
    if(l>=0){const f=(level-y[l])/(y[l+1]-y[l]);lx=finite(data[l].x+(data[l+1].x-data[l].x)*f)}
    if(r>=0){const f=(level-y[r-1])/(y[r]-y[r-1]);rx=finite(data[r-1].x+(data[r].x-data[r-1].x)*f)}
   }
   const width=lx!==null&&rx!==null?finite(rx-lx):null;
   if((prominence!==null&&prominence<minimum)||(width!==null&&((minWidth!==undefined&&width<minWidth)||(maxWidth!==undefined&&width>maxWidth))))excludedFilters++;
   else if(width===null&&(minWidth!==undefined||maxWidth!==undefined))excludedUndefined++;
   else candidates.push({index:apex,x:a.x,y:a.y,direction,prominence,width,left:lx,right:rx,level:level===null?null:level*sign,incomplete:edge});
  }
  start=end+1;
 }
 let peaks=candidates;
 if(distance>0&&candidates.length>1){
  const positions=candidates.map(a=>p.distanceUnit==='samples'?a.index:a.x),bit=new Int32Array(candidates.length+1),selected=new Uint8Array(candidates.length);
  const count=(index:number)=>{let n=0;for(let i=index;i>0;i-=i&-i)n+=bit[i];return n};
  const priority=candidates.map((a,i)=>({i,height:a.y*sign})).sort((a,b)=>b.height-a.height||a.i-b.i);
  for(const {i}of priority){const lo=bound(positions,positions[i]-distance,true),hi=bound(positions,positions[i]+distance);if(count(hi)-count(lo)){excludedFilters++;continue}selected[i]=1;for(let j=i+1;j<bit.length;j+=j&-j)bit[j]++}
  peaks=candidates.filter((_,i)=>selected[i]);
 }
 return{points:[],data:{peaks},summary:{n,peakCount:peaks.length,incompleteCount:peaks.filter(a=>a.incomplete).length,excludedFilters,excludedUndefined,method:'topographic-prominence-half-prominence-width',relativeHeight:relative}};
}

/** Union of both piecewise-linear grids, with no extrapolation or hidden shift. */
export function areaGrid(points:readonly XY[],p:Parameters,reference?:readonly XY[],outlines=true):{upper:XY[];lower:XY[];difference:XY[]}{
 const a=signalOrder(points,p),b=reference?signalOrder(reference,p):undefined;if(a.length<2||b&&b.length<2)throw new MathError('MATH_POINTS',{required:2});
 const range=readRange(p.range)??[a[0].x,a.at(-1)!.x];if(!(range[0]<range[1]))throw new MathError('MATH_RANGE');
 if(range[0]<a[0].x||range[1]>a.at(-1)!.x||b&&(range[0]<b[0].x||range[1]>b.at(-1)!.x))throw new MathError('MATH_RANGE_OUTSIDE');
 const xs:number[]=[range[0]];let i=0,j=0;
 while(i<a.length&&a[i].x<=range[0])i++;while(b&&j<b.length&&b[j].x<=range[0])j++;
 while(true){const x=Math.min(i<a.length?a[i].x:Infinity,b&&j<b.length?b[j].x:Infinity);if(x>=range[1])break;xs.push(x);while(i<a.length&&a[i].x<=x)i++;while(b&&j<b.length&&b[j].x<=x)j++}
 xs.push(range[1]);i=0;j=0;const upper:XY[]=[],lower:XY[]=[],difference:XY[]=[];
 const value=(items:readonly XY[],at:number,k:number):[number,number]=>{while(k+1<items.length-1&&items[k+1].x<at)k++;return[interpolateSegment(items[k],items[k+1],at),k]};
 for(const x of xs){const va=value(a,x,i);i=va[1];const vb=b?value(b,x,j):[0,0];j=vb[1];if(outlines){upper.push({x,y:va[0]});lower.push({x,y:vb[0]})}difference.push({x,y:finite(va[0]-vb[0])})}
 return{upper,lower,difference};
}
export function integrateSignal(points:readonly XY[],p:Parameters,reference?:readonly XY[]):CalculationResult{
 validateInput(points,p);if(reference)validateInput(reference,p);const grid=areaGrid(points,p,reference,false);
 function* absolute(){for(let i=1;i<grid.difference.length;i++){
  const a=grid.difference[i-1],b=grid.difference[i],dx=b.x-a.x;
  if(Math.sign(a.y)*Math.sign(b.y)<0){const scale=Math.max(Math.abs(a.y),Math.abs(b.y)),ratio=(Math.abs(a.y)/scale)/(Math.abs(a.y)/scale+Math.abs(b.y)/scale);yield finite(dx*(Math.abs(a.y)/2*ratio+Math.abs(b.y)/2*(1-ratio)))}else yield finite(dx*(Math.abs(a.y)/2+Math.abs(b.y)/2));
 }}
 return{points:grid.difference,summary:{integral:trapezoidIntegral(grid.difference),absoluteIntegral:finite(sum(absolute())),n:grid.difference.length,startX:grid.difference[0].x,endX:grid.difference.at(-1)!.x,method:reference?'signed-trapezoids-union-grid-baseline':'signed-trapezoids-linear-boundaries'}};
}
