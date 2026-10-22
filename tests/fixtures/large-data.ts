import {createProject,makeSeries,type Point,type ProjectDocument} from '../../src/domain/model';

/** Repeatable numerical input. Fixture creation is excluded from application timings. */
export function largePoints(count:number,seed=12345):Point[]{
 const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32};
 return Array.from({length:count},(_,i)=>({id:`00000000-0000-4000-8000-${i.toString(16).padStart(12,'0')}`,x:i,y:Math.sin(i/110)+random()*.01}));
}
export function largeProject(count:number):ProjectDocument{
 const p=createProject(),datasetId='10000000-0000-4000-8000-000000000000';
 p.datasets=[{id:datasetId,name:'Benchmark',role:'raw',source:{kind:'manual'},points:largePoints(count)}];
 p.series=[makeSeries(datasetId,'Benchmark',0)];
 p.viewport={xMin:0,xMax:count,yMin:-2,yMax:2};
 p.axes.x={...p.axes.x,mode:'manual',min:0,max:count};p.axes.y={...p.axes.y,mode:'manual',min:-2,max:2};
 return p;
}
