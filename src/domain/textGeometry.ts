import type {DrawObject,XY} from './model';
export interface TextBounds {x:number;y:number;width:number;height:number}
interface Run {text:string;x:number;y:number;size:number;bold:boolean;italic:boolean}
const cache=new WeakMap<DrawObject,{runs:Run[];bounds:TextBounds}>();
let context:CanvasRenderingContext2D|OffscreenCanvasRenderingContext2D|null|undefined;
/** The renderer uses these same explicit run positions in screen and standalone SVG. */
export function layoutText(o:DrawObject){
 const cached=cache.get(o);if(cached)return cached;
 if(context===undefined){if(typeof document!=='undefined')context=document.createElement('canvas').getContext('2d');else if(typeof OffscreenCanvas!=='undefined')context=new OffscreenCanvas(1,1).getContext('2d')}
 const font=o.style.fontSizePt*4/3,runs:Run[]=[];let x=0,lineY=0,left=Infinity,top=Infinity,right=-Infinity,bottom=-Infinity;
 for(const part of o.text)for(const [index,text] of part.text.split('\n').entries()){
  if(index){x=0;lineY+=font*1.25}
  const size=part.baseline==='normal'?font:font*0.7,y=lineY+(part.baseline==='super'?-font*0.4:part.baseline==='sub'?font*0.2:0);
  if(context)context.font=`${part.italic?'italic ':''}${part.bold?'bold ':''}${size}px "Courier New"`;
  const metrics=context?.measureText(text),advance=metrics?.width??text.length*size*0.601;
  if(text){left=Math.min(left,x-(metrics?.actualBoundingBoxLeft??0));right=Math.max(right,x+(metrics?.actualBoundingBoxRight??advance));top=Math.min(top,y-(metrics?.actualBoundingBoxAscent??size*0.85));bottom=Math.max(bottom,y+(metrics?.actualBoundingBoxDescent??size*0.25))}
  runs.push({text,x,y,size,bold:part.bold,italic:part.italic});x+=advance;
 }
 const result={runs,bounds:Number.isFinite(left)?{x:left,y:top,width:Math.max(1,right-left),height:Math.max(1,bottom-top)}:{x:0,y:-font,width:1,height:font}};
 cache.set(o,result);return result;
}
/** A shelf beneath the label and an outside route keep the text fixed and the leader visible. */
export function calloutRoute(tip:XY,label:XY,box:TextBounds,angle=0,gap=12){
 const radians=angle*Math.PI/180,cos=Math.cos(radians),sin=Math.sin(radians),dx=tip.x-label.x,dy=tip.y-label.y;
 const local={x:dx*cos+dy*sin,y:-dx*sin+dy*cos},left=box.x-gap,right=box.x+box.width+gap,top=box.y-gap,bottom=box.y+box.height+gap;
 const side=local.x<(left+right)/2?-1:1,sideX=side<0?left:right,inside=local.x>=left&&local.x<=right&&local.y>=top&&local.y<=bottom;
 const start=inside?{x:sideX+side*14,y:Math.max(top,Math.min(bottom,local.y))}:local,points:XY[]=[start];
 if(start.y<top&&start.x>left&&start.x<right)points.push({x:sideX,y:start.y});
 points.push({x:sideX,y:bottom});
 const world=(p:XY):XY=>({x:label.x+p.x*cos-p.y*sin,y:label.y+p.x*sin+p.y*cos});
 return {leader:points.map(world),shelf:[world({x:sideX,y:bottom}),world({x:side<0?right:left,y:bottom})],arrowTip:inside?null:tip};
}
