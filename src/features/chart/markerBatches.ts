import type {XY} from '../../domain/model';

const relativePaths=new Map<string,string>();
/** Convert D3's six symbol shapes to relative commands once. Each glyph starts
 * with its own absolute move, so batching never connects two observations.
 */
export function relativeMarkerPath(path:string):string{
 const cached=relativePaths.get(path);if(cached)return cached;
 let x=0,y=0,sx=0,sy=0,result='';
 for(const part of path.matchAll(/([a-zA-Z])([^a-zA-Z]*)/g)){
  const command=part[1],values=(part[2].match(/[-+]?(?:\d*\.\d+|\d+\.?\d*)(?:e[-+]?\d+)?/gi)??[]).map(Number);
  const n=[...values];
  if(command==='M'||command==='L'){n[0]-=x;n[1]-=y;x=values[0];y=values[1];if(command==='M'){sx=x;sy=y}}
  else if(command==='H'){n[0]-=x;x=values[0]}
  else if(command==='V'){n[0]-=y;y=values[0]}
  else if(command==='A'){n[5]-=x;n[6]-=y;x=values[5];y=values[6]}
  else if(command==='h')x+=values[0];else if(command==='v')y+=values[0];
  else if(command.toLowerCase()==='z'){x=sx;y=sy}
  else throw new Error('UNSUPPORTED_MARKER_PATH');
  result+=command.toLowerCase()+n.map(v=>Number(v.toFixed(8))).join(',');
 }
 if(relativePaths.size>=256)relativePaths.clear();relativePaths.set(path,result);return result;
}
export function markerBatches(pixels:readonly XY[],ids:readonly string[],symbolPath:string,chunkSize=128):{d:string;ids:string}[]{
 const glyph=relativeMarkerPath(symbolPath),result:{d:string;ids:string}[]=[];
 for(let i=0;i<pixels.length;i+=chunkSize){const end=Math.min(i+chunkSize,pixels.length);let d='';for(let j=i;j<end;j++)d+=`M${Number(pixels[j].x.toFixed(8))},${Number(pixels[j].y.toFixed(8))}${glyph}`;result.push({d,ids:ids.slice(i,end).join(' ')})}
 return result;
}
