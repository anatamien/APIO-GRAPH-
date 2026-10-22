import {MathError,type XY} from '../../domain/math';
/** Copy numbers into a new transferable buffer; the source project stays intact. */
export function packCoordinates(points:readonly XY[]):Float64Array{
 const values=new Float64Array(points.length*2);
 for(let i=0;i<points.length;i++){const {x,y}=points[i];if(typeof x!=='number'||typeof y!=='number')throw new MathError('MATH_NONFINITE_INPUT',{pointIndex:i});values[i*2]=x;values[i*2+1]=y}
 return values;
}
export function unpackCoordinates(values:Float64Array):XY[]{
 if(!(values instanceof Float64Array)||values.length%2)throw new MathError('MATH_WORKER_FAILURE');
 return Array.from({length:values.length/2},(_,i)=>({x:values[i*2],y:values[i*2+1]}));
}
