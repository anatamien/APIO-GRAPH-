import {useEffect,useReducer} from 'react';
import type {XY} from '../../domain/model';
import {observeSignalGrid} from './signalGrid';
export function useSignalGrid(points:readonly XY[]|undefined,reference:readonly XY[]|undefined,parameters:Record<string,unknown>|undefined,enabled:boolean){
 const [revision,refresh]=useReducer(n=>n+1,0),sortCopy=parameters?.sortCopy,duplicates=parameters?.duplicates;
 useEffect(()=>{if(!enabled||!points)return;const p={sortCopy,duplicates},off=observeSignalGrid(points,p,refresh),offReference=reference?observeSignalGrid(reference,p,refresh):undefined;return()=>{off();offReference?.()}},[points,reference,sortCopy,duplicates,enabled]);return revision;
}
