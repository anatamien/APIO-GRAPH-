import type {ScreenBounds} from './objectBounds';
export interface GapGuide {axis:'x'|'y';from:number;to:number;cross:number;distance:number}
interface GapTarget {axis:'x'|'y';position:number;low:number;high:number;segments:[number,number][];cross:number}
export interface AlignmentPlan {bounds:ScreenBounds;x:number[];y:number[];gaps:GapTarget[]}
export interface AlignmentResult {dx:number;dy:number;x?:number;y?:number;gaps:GapGuide[]}
export function unionBounds(boxes:ScreenBounds[]):ScreenBounds{return boxes.reduce((a,b)=>({left:Math.min(a.left,b.left),right:Math.max(a.right,b.right),top:Math.min(a.top,b.top),bottom:Math.max(a.bottom,b.bottom)}))}
/** Build once per gesture. Neighbour lookup is bounded; no point-array or DOM work per frame. */
export function prepareAlignment(bounds:ScreenBounds,others:ScreenBounds[],center:{x:number;y:number}):AlignmentPlan{
 const plan:AlignmentPlan={bounds,x:[center.x],y:[center.y],gaps:[]};
 for(const b of others){plan.x.push(b.left,(b.left+b.right)/2,b.right);plan.y.push(b.top,(b.top+b.bottom)/2,b.bottom)}
 for(const axis of ['x','y'] as const){
  const [lo,hi,crossLo,crossHi]=axis==='x'?['left','right','top','bottom'] as const:['top','bottom','left','right'] as const,width=bounds[hi]-bounds[lo],ordered=[...others].sort((a,b)=>a[lo]-b[lo]);
  for(let i=0;i<ordered.length-1;i++)for(let j=i+1;j<Math.min(ordered.length,i+9);j++){
   const a=ordered[i],b=ordered[j],low=Math.max(a[crossLo],b[crossLo]),high=Math.min(a[crossHi],b[crossHi]),gap=b[lo]-a[hi];if(gap<0||low>high)continue;
   const cross=(low+high)/2;
   if(gap>=width){const position=(a[hi]+b[lo]-width)/2;plan.gaps.push({axis,position,low,high,cross,segments:[[a[hi],position],[position+width,b[lo]]]})}
   plan.gaps.push({axis,position:b[hi]+gap,low,high,cross,segments:[[a[hi],b[lo]],[b[hi],b[hi]+gap]]},{axis,position:a[lo]-gap-width,low,high,cross,segments:[[a[lo]-gap,a[lo]],[a[hi],b[lo]]]});break;
  }
 }
 return plan;
}
export function alignObjects(plan:AlignmentPlan,dx:number,dy:number,tolerance=6):AlignmentResult{
 const b=plan.bounds,result:AlignmentResult={dx,dy,gaps:[]};
 for(const axis of ['x','y'] as const){const horizontal=axis==='x',low=horizontal?b.left:b.top,high=horizontal?b.right:b.bottom,delta=horizontal?dx:dy,other=horizontal?dy:dx,crossLow=(horizontal?b.top:b.left)+other,crossHigh=(horizontal?b.bottom:b.right)+other;let distance=tolerance,offset=0,guide:number|undefined,gap:GapTarget|undefined;
  for(const own of [low,(low+high)/2,high])for(const target of plan[axis]){const d=target-own-delta;if(Math.abs(d)<distance){distance=Math.abs(d);offset=d;guide=target;gap=undefined}}
  for(const target of plan.gaps){if(target.axis!==axis||crossHigh<target.low||crossLow>target.high)continue;const d=target.position-low-delta;if(Math.abs(d)<=distance){distance=Math.abs(d);offset=d;gap=target;guide=undefined}}
  if(horizontal)result.dx+=offset;else result.dy+=offset;result[axis]=guide;
  if(gap)for(const [from,to]of gap.segments)result.gaps.push({axis,from,to,cross:gap.cross,distance:to-from});
 }
 return result;
}
