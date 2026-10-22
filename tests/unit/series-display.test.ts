import {describe,it,expect} from 'vitest';
import {addPairs,createProject,makeObject} from '../../src/domain/model';
import {effectiveMarkers,setSeriesMode,setSeriesPoints,setProjectMarkers} from '../../src/domain/seriesDisplay';
import {deserialize,serialize} from '../../src/domain/project';

describe('measurement display without changing source data',()=>{
 it('creates a line without markers while retaining the legend and every source point',()=>{
  const p=addPairs(createProject(),[{x:2,y:7},{x:1,y:8},{x:2,y:7}],'Raw');
  expect(p.series[0]).toMatchObject({mode:'line',style:{markerVisible:false,stroke:'#000000',markerStroke:'#000000'}});
  expect(p.legend.visible).toBe(true);expect(effectiveMarkers(p,p.series[0])).toBe(false);
  expect(p.datasets[0].points.map(({x,y})=>({x,y}))).toEqual([{x:2,y:7},{x:1,y:8},{x:2,y:7}]);
 });
 it('reflects legacy contradictory flags without rewriting the document',()=>{
  const p=addPairs(createProject(),[{x:1,y:2}],'Old');p.series[0].mode='line-points';p.series[0].style.markerVisible=true;p.editor.showPointMarkers=false;
  expect(effectiveMarkers(p,p.series[0])).toBe(false);expect(p.series[0].style.markerVisible).toBe(true);
  p.series[0].mode='points';expect(effectiveMarkers(p,p.series[0])).toBe(true);
 });
 it('enables one series despite a global legacy flag without revealing the other series',()=>{
  const p=addPairs(addPairs(createProject(),[{x:1,y:2}],'A'),[{x:3,y:4}],'B');
  p.editor.showPointMarkers=false;p.series.forEach(s=>{s.mode='line-points';s.style.markerVisible=true});
  const next=setSeriesPoints(p,p.series[0].id,true);
  expect(effectiveMarkers(next,next.series[0])).toBe(true);expect(effectiveMarkers(next,next.series[1])).toBe(false);
  expect(next.datasets).toBe(p.datasets);expect(next.legend).toBe(p.legend);expect(next.viewport).toBe(p.viewport);
  expect(next.series[1]).toBe(p.series[1]);expect(next.editor).toBe(p.editor);
  const reopened=deserialize(serialize(next)).project;
  expect(effectiveMarkers(reopened,reopened.series[0])).toBe(true);expect(effectiveMarkers(reopened,reopened.series[1])).toBe(false);
 });
 it('all modes and global controls agree, including points-only, without touching marker annotations',()=>{
  const p=addPairs(createProject(),[{x:1,y:2}],'A');p.objects=[makeObject('marker',[{mode:'data',x:1,y:2}])];
  const points=setSeriesMode(p,p.series[0].id,'points');expect(effectiveMarkers(points,points.series[0])).toBe(true);
  const off=setProjectMarkers(points,false);expect(off.series[0].mode).toBe('line');expect(effectiveMarkers(off,off.series[0])).toBe(false);
  const on=setProjectMarkers(off,true);expect(on.series[0].mode).toBe('line-points');expect(effectiveMarkers(on,on.series[0])).toBe(true);
  expect(on.datasets).toBe(p.datasets);expect(on.objects).toBe(p.objects);
 });
 it('does nothing for a stale series ID even in a legacy document',()=>{
  const p=addPairs(createProject(),[{x:1,y:2}],'A');p.editor.showPointMarkers=false;
  expect(setSeriesMode(p,'missing','line-points')).toBe(p);
 });
});
