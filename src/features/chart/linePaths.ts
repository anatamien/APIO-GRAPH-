import {line} from 'd3-shape';
import type {XY} from '../../domain/model';
import type {Coordinates} from '../../domain/geometry';

/** Short overlapping paths avoid the rasterizer's dense long-stroke cost.
 * Shared segments preserve joins; cumulative offsets preserve dash phase.
 * Used only for the screen. Vector export still includes one exact full trace.
 */
export function screenLinePaths(points:XY[],c?:Coordinates):{d:string;offset:number}[]{
 const pixels=c?points.map(pt=>({x:c.x(pt.x),y:c.y(pt.y)})):points,path=line<XY>().defined(pt=>Number.isFinite(pt.x)&&Number.isFinite(pt.y)).x(pt=>pt.x).y(pt=>pt.y).digits(8);
 if(pixels.length<=128)return [{d:path(pixels)??'',offset:0}];
 const distances=[0];for(let i=1;i<pixels.length;i++)distances.push(distances[i-1]+Math.hypot(pixels[i].x-pixels[i-1].x,pixels[i].y-pixels[i-1].y));
 const result:{d:string;offset:number}[]=[];
 for(let i=0;i<pixels.length-1;i+=62)result.push({d:path(pixels.slice(i,i+64))??'',offset:i&&Number.isFinite(distances[i])?-distances[i]:0});
 return result;
}
