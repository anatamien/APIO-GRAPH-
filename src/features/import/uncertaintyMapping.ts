import type {XY,Point} from '../../domain/model';
export interface MeasurementMapping {x:number;y:number;errorX?:number;errorY?:number}
export function uncertaintyIssue(values:readonly (number|null)[],mapping:MeasurementMapping):{column:number;code:string}|undefined{
 for(const key of ['errorX','errorY'] as const){const column=mapping[key];if(column===undefined)continue;const n=values[column];if(typeof n!=='number'||!Number.isFinite(n)||n<0)return{column:column+1,code:typeof n==='number'&&n<0?'uncertaintyNegative':'uncertaintyIncomplete'}}
}
export function measurementRow(values:readonly (number|null)[],mapping:MeasurementMapping):(XY&Pick<Point,'errorX'|'errorY'>)|null{
 const x=values[mapping.x],y=values[mapping.y];if(typeof x!=='number'||typeof y!=='number'||!Number.isFinite(x)||!Number.isFinite(y)||uncertaintyIssue(values,mapping))return null;
 return{x,y,...(mapping.errorX!==undefined?{errorX:values[mapping.errorX] as number}:{}),...(mapping.errorY!==undefined?{errorY:values[mapping.errorY] as number}:{})};
}
