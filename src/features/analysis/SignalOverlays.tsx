import {areaCalculations} from '../../domain/plotAreas';
import {memo,useMemo} from 'react';
import type {ProjectDocument,Calculation} from '../../domain/model';
import type {Coordinates} from '../../domain/geometry';
import {dependencyIndex} from '../../domain/dependencies';
import {peakGeometry,regionGeometry} from './signalGeometry';
import {useSignalGrid} from './useSignalGrid';
import type {ColorMode} from '../chart/ChartScene';

const Overlay=memo(function Overlay({calculation:c,p,coordinates,screen,margin,color,mode}:{calculation:Calculation;p:ProjectDocument;coordinates:Coordinates;screen:boolean;margin:number;color:string;mode:ColorMode}){
 const source=dependencyIndex(p).datasets.get(c.sourceDatasetIds[0]),reference=typeof c.parameters.baselineDatasetId==='string'?dependencyIndex(p).datasets.get(c.parameters.baselineDatasetId):undefined;
 const gridRevision=useSignalGrid(source?.points,reference?.points,c.parameters,screen&&c.kind==='area');
 const path=useMemo(()=>c.kind==='peaks'?peakGeometry(c.data?.peaks??[],coordinates,p,screen,margin):source?regionGeometry(source.points,reference?.points,c.parameters,coordinates,p,screen,margin):'',[c.kind,c.data,source?.points,reference?.points,c.parameters,coordinates,p.viewport,screen,margin,gridRevision]);
 if(!path)return null;
 if(c.kind==='peaks')return <path data-signal-peaks={c.id} data-peak-count={c.data?.peaks?.length??0} d={path} stroke={color} strokeWidth={1.2} fill="none"/>;
 return <g data-signal-area={c.id}><path d={path} fill={mode==='strict-bw'?'url(#hatch)':color} fillOpacity={mode==='strict-bw'?1:c.display?.opacity??.18} stroke={color} strokeWidth={.8}/></g>;
});
/** Labels remain available to text-overflow preflight without any data arrays. */
export function SignalLabels({p,c,color}:{p:ProjectDocument;c:Coordinates;color:(value:string)=>string}){
 return <g data-signal-labels="true" pointerEvents="none">{areaCalculations(p).filter(a=>a.kind==='area'&&a.status==='valid'&&a.display?.visible&&a.display.label&&Array.isArray(a.parameters.range)).map((a,i)=>{const range=a.parameters.range as number[],unit=a.parameters.sourceUnits as {x?:string;y?:string}|undefined;return <text key={a.id} data-area-label={a.id} x={Math.max(c.left+4,Math.min(c.right-4,c.x(range[0]/2+range[1]/2)))} y={c.top+18+i*16} fill={color(a.display!.stroke)} fontSize={12} textAnchor="middle">{`∫ = ${a.summary.integral} ${unit?.x||'X'}·${unit?.y||'Y'}`}</text>})}</g>;
}
export const SignalOverlays=memo(function SignalOverlays({p,c,screen,margin,color,mode}:{p:ProjectDocument;c:Coordinates;screen:boolean;margin:number;color:(value:string)=>string;mode:ColorMode}){
 return <g data-signal-results="true" pointerEvents="none">{areaCalculations(p).filter(a=>a.status==='valid'&&a.display?.visible&&(a.kind==='area'||a.kind==='peaks')).map(a=><Overlay key={a.id} calculation={a} p={p} coordinates={c} screen={screen} margin={margin} color={color(a.display!.stroke)} mode={mode}/>)}</g>;
});
