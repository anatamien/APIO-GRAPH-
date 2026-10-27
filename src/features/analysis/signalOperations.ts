import type {CalculationKind,ProjectDocument} from '../../domain/model';
import type {CalculationResult} from '../../domain/math';
import {addCalculation} from './operations';
import {replaceCalculation} from './recalculation';
export const signalKinds:readonly CalculationKind[]=['baseline','peaks','area'];
export function isSignalKind(kind:CalculationKind):kind is 'baseline'|'peaks'|'area'{return signalKinds.includes(kind)}
export function applySignalResult(project:ProjectDocument,sourceId:string,kind:'baseline'|'peaks'|'area',parameters:Record<string,unknown>,result:CalculationResult,name:string,calculationId?:string):ProjectDocument{
 if(calculationId)return replaceCalculation(project,calculationId,parameters,result,name);
 if(kind==='baseline'&&parameters.output==='both'&&result.companion){
  const first=addCalculation(project,sourceId,kind,{...parameters,output:'baseline'},{points:result.points,summary:{...result.summary,output:'baseline'}},name);
  return addCalculation(first,sourceId,kind,{...parameters,output:'corrected'},{points:result.companion,summary:{...result.summary,output:'corrected'}},`${name} · ΔY`);
 }
 return addCalculation(project,sourceId,kind,parameters,result,name);
}
