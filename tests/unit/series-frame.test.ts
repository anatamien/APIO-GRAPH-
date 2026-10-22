import {it,expect} from 'vitest';
import {createProject,addPairs} from '../../src/domain/model';
import {createCoordinates} from '../../src/domain/geometry';
import {seriesFrame,seriesTranslation} from '../../src/features/chart/seriesFrame';

it('reuses translation within prepared coverage and maps every source point to its current pixel',()=>{
 const p=addPairs(createProject(),[{x:2,y:3},{x:8,y:9}],'source'),c=createCoordinates(p,1200,800),frame=seriesFrame(p,c);
 for(const distance of [-4,-2,0,2,4]){
  const next={...p,viewport:{xMin:distance,xMax:10+distance,yMin:distance,yMax:10+distance}},current=createCoordinates(next,1200,800),shift=seriesTranslation(frame,next,current);
  expect(shift).not.toBeNull();for(const point of p.datasets[0].points){expect(c.x(point.x)+shift!.x).toBeCloseTo(current.x(point.x),7);expect(c.y(point.y)+shift!.y).toBeCloseTo(current.y(point.y),7)}
 }
 expect(seriesTranslation(frame,{...p,viewport:{...p.viewport,xMin:6,xMax:16}},createCoordinates({...p,viewport:{...p.viewport,xMin:6,xMax:16}},1200,800))).toBeNull();
 expect(seriesTranslation(frame,{...p,viewport:{...p.viewport,yMin:6,yMax:16}},createCoordinates({...p,viewport:{...p.viewport,yMin:6,yMax:16}},1200,800))).toBeNull();
});

it('invalidates source edits, axes, resizing, zoom and marker changes without mutating the document',()=>{
 const p=createProject(),c=createCoordinates(p,1200,800),frame=seriesFrame(p,c);
 for(const next of [{...p,datasets:[...p.datasets]},{...p,series:[...p.series]},{...p,calculations:[...p.calculations]},{...p,axes:{...p.axes}},{...p,editor:{...p.editor,showPointMarkers:false}},{...p,viewport:{...p.viewport,xMax:11}}])expect(seriesTranslation(frame,next,createCoordinates(next,1200,800))).toBeNull();
 expect(seriesTranslation(frame,p,createCoordinates(p,1000,800))).toBeNull();expect(p.viewport).toEqual({xMin:0,xMax:10,yMin:0,yMax:10});
});

it('keeps prepared bounds finite for extreme valid scientific ranges',()=>{
 const p=createProject();p.viewport={xMin:-Number.MAX_VALUE,xMax:Number.MAX_VALUE,yMin:-1e-300,yMax:1e-300};
 const c=createCoordinates(p,1200,800),frame=seriesFrame(p,c);expect(frame.min).toBe(-Number.MAX_VALUE);expect(frame.max).toBe(Number.MAX_VALUE);expect(seriesTranslation(frame,p,c)).toEqual({x:0,y:0});
});
