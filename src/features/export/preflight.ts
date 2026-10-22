export function courierAvailable():boolean {
 const context=document.createElement('canvas').getContext('2d');if(!context)return false;
 const sample='MWil 019αЖ';
 return ['serif','sans-serif','monospace'].some(fallback=>{context.font=`16px ${fallback}`;const base=context.measureText(sample).width;context.font=`16px "Courier New",${fallback}`;return Math.abs(base-context.measureText(sample).width)>0.01});
}
export async function textOverflow(svgText:string):Promise<string[]>{
 await document.fonts.ready;
 const parsed=new DOMParser().parseFromString(svgText,'image/svg+xml');
 const svg=document.importNode(parsed.documentElement,true) as unknown as SVGSVGElement;
 const holder=document.createElement('div');holder.style.cssText='position:fixed;left:-100000px;top:0;visibility:hidden;pointer-events:none';holder.append(svg);document.body.append(holder);
 try{const root=svg.getScreenCTM();if(!root)return [];const inverse=root.inverse(),box=svg.viewBox.baseVal;const overflow:string[]=[];
  for(const text of svg.querySelectorAll('text')){const matrix=text.getScreenCTM();if(!matrix)continue;const transform=inverse.multiply(matrix),b=text.getBBox();const points=[[b.x,b.y],[b.x+b.width,b.y],[b.x,b.y+b.height],[b.x+b.width,b.y+b.height]].map(([x,y])=>new DOMPoint(x,y).matrixTransform(transform));if(points.some(p=>p.x<box.x-0.5||p.y<box.y-0.5||p.x>box.x+box.width+0.5||p.y>box.y+box.height+0.5))overflow.push(text.textContent??'')}
  return overflow;
 }finally{holder.remove()}
}
