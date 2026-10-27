import type {PeakMeasurement} from '../../domain/signalTypes';
/** Nullable characteristics use a NaN sentinel only inside transferable packets. */
export function packPeaks(peaks:readonly PeakMeasurement[]):Float64Array{
 const values=new Float64Array(peaks.length*10);
 for(let i=0;i<peaks.length;i++){const p=peaks[i],at=i*10;values[at]=p.index;values[at+1]=p.x;values[at+2]=p.y;values[at+3]=p.prominence??NaN;values[at+4]=p.width??NaN;values[at+5]=p.left??NaN;values[at+6]=p.right??NaN;values[at+7]=p.level??NaN;values[at+8]=Number(p.incomplete);values[at+9]=p.direction==='min'?-1:1}return values;
}
export function peakFromBuffer(values:Float64Array,i:number):PeakMeasurement{
 const at=i*10,nullable=(offset:number)=>Number.isNaN(values[at+offset])?null:values[at+offset];
 return{index:values[at],x:values[at+1],y:values[at+2],prominence:nullable(3),width:nullable(4),left:nullable(5),right:nullable(6),level:nullable(7),incomplete:values[at+8]===1,direction:values[at+9]===-1?'min':'max'};
}
