import {describe,it,expect} from 'vitest';
import {baseline,findSignalPeaks,integrateSignal} from '../../src/domain/math/signals';
import reference from '../fixtures/signal-reference.json';
const code=(fn:()=>unknown,value:string)=>expect(fn).toThrow(value);
describe('scientific baseline correction',()=>{
 it('manual baseline follows exact nodes, preserves acquisition order and negative observations',()=>{
  const points=[{x:2,y:-1},{x:0,y:-3},{x:1,y:0}],snapshot=structuredClone(points);
  const result=baseline(points,{method:'manual',nodes:[{x:0,y:-3},{x:2,y:-1}],output:'both'});
  expect(result.points).toEqual([{x:2,y:-1},{x:0,y:-3},{x:1,y:-2}]);expect(result.companion).toEqual([{x:2,y:0},{x:0,y:0},{x:1,y:2}]);expect(points).toEqual(snapshot);
  code(()=>baseline(points,{nodes:[{x:1,y:0},{x:2,y:0}]}),'SIGNAL_NODE_COVERAGE');
  code(()=>baseline(points,{nodes:[{x:0,y:0},{x:0,y:1}]}),'SIGNAL_NODES');
  code(()=>baseline(points,{nodes:[null,{x:0,y:1}]}),'SIGNAL_NODES');
  expect(baseline(points,{nodes:[{x:1,y:0},{x:2,y:1}],extrapolate:true,output:'baseline'}).points[1].y).toBe(-1);
 });
 it('polynomial fits selected background observations, never the superimposed peak',()=>{
  const points=Array.from({length:41},(_,i)=>({x:1e12+i/4,y:3+.2*(i/4)+.03*(i/4)**2+(i===20?100:0)}));
  const p={method:'polynomial',degree:2,backgroundIntervals:[[1e12,1e12+4],[1e12+6,1e12+10]],output:'corrected'};
  const result=baseline(points,p);result.points.forEach((a,i)=>expect(a.y).toBeCloseTo(i===20?100:0,8));
  code(()=>baseline(points,{method:'polynomial',degree:2,backgroundIntervals:[]}), 'SIGNAL_BACKGROUND');
  expect(baseline([{x:0,y:7},{x:1,y:7}],{method:'polynomial',degree:0,backgroundIntervals:[[0,1]],output:'baseline'}).points[0].y).toBeCloseTo(7,12);
 });
 it('banded AsLS agrees with independently generated SciPy sparse-LU results',()=>{
  const r=baseline(reference.asls.points,reference.asls.parameters);r.points.forEach((p,i)=>expect(p.y).toBeCloseTo(reference.asls.expected[i],7));
  expect(r.summary.method).toContain('asls');expect(r.summary.iterations).toBeLessThan(40);
  expect(baseline([{x:0,y:-4},{x:1,y:-4},{x:2,y:-4}],{method:'asls',output:'baseline'}).points.map(a=>a.y)).toEqual([-4,-4,-4]);
 });
 it('invalid AsLS grids/parameters fail explicitly; a short iteration limit warns',()=>{
  code(()=>baseline([{x:0,y:0},{x:1,y:3},{x:3,y:1}],{method:'asls'}),'SIGNAL_ASLS_UNIFORM');
  code(()=>baseline(reference.asls.points,{method:'asls',lambda:-1}),'SIGNAL_PARAMETER');
  expect(baseline(reference.asls.points,{method:'asls',iterations:1}).summary.warning).toBe('SIGNAL_ASLS_ITERATION_LIMIT');
 });
});
describe('peak position, prominence and width',()=>{
 for(const c of reference.peaks)it(`matches SciPy for ${c.name}, including nonuniform X and equal maxima`,()=>{
  const result=findSignalPeaks(c.points,{includeIncomplete:false}),peaks=result.data!.peaks!;
  expect(peaks.map(a=>a.index)).toEqual(c.indices);peaks.forEach((p,i)=>{expect(p.x).toBe(c.points[c.indices[i]].x);expect(p.prominence).toBeCloseTo(c.prominence[i],11);expect(p.left).toBeCloseTo(c.left[i],11);expect(p.right).toBeCloseTo(c.right[i],11)});
 });
 it('minima retain original Y and incomplete edge peaks have undefined widths',()=>{
  const points=[{x:0,y:-4},{x:1,y:0},{x:2,y:-3},{x:3,y:0},{x:4,y:-2}];
  const result=findSignalPeaks(points,{direction:'min'}).data!.peaks!;expect(result).toHaveLength(3);
  expect(result[0]).toMatchObject({x:0,y:-4,incomplete:true,prominence:null,width:null,left:null,right:null});expect(result[1]).toMatchObject({x:2,y:-3,prominence:3,width:1});
 });
 it('distance uses the requested physical X or observation indices, without rounding',()=>{
  const points=[0,3,0,2,0,4,0].map((y,i)=>({x:i*.1,y}));
  expect(findSignalPeaks(points,{distance:.3,distanceUnit:'x'}).data!.peaks!.map(a=>a.index)).toEqual([1,5]);
  expect(findSignalPeaks(points,{distance:5,distanceUnit:'samples'}).data!.peaks!.map(a=>a.index)).toEqual([5]);
  code(()=>findSignalPeaks(points,{distance:.5,distanceUnit:'samples'}),'SIGNAL_PARAMETER');
 });
 it('unsupported levels and duplicate X are explicit, rather than guessed widths',()=>{
  const points=[0,1,0].map((y,x)=>({x,y}));expect(findSignalPeaks(points,{relativeHeight:2}).data!.peaks![0].width).toBeNull();
  code(()=>findSignalPeaks([{x:0,y:0},{x:0,y:1},{x:2,y:0}],{}),'MATH_DUPLICATE_X');
 });
 it('a dense equal-height spectrum keeps all results with bounded complexity',()=>{
  const points=Array.from({length:100001},(_,x)=>({x,y:x%2}));const result=findSignalPeaks(points,{});expect(result.data!.peaks).toHaveLength(50000);
 });
});
describe('signed integration on original piecewise-linear data',()=>{
 it('does not overflow interpolation across finite extreme X coordinates',()=>{
  const source=[{x:-1e308,y:-1},{x:1e308,y:1}];const r=integrateSignal(source,{range:[0,1e307]});expect(r.points[0].y).toBe(0);expect(r.points[1].y).toBeCloseTo(.1,14);expect(Number(r.summary.integral)/5e305).toBeCloseTo(1,13);
 });
 it('integrates exact linear boundaries and the union of different baseline grids',()=>{
  const source=[{x:0,y:0},{x:1,y:1},{x:2,y:2}];expect(integrateSignal(source,{range:[0,2]}).summary.integral).toBe(2);expect(integrateSignal(source,{range:[.25,1.75]}).summary.integral).toBe(1.5);
  const r=integrateSignal(source,{range:[0,2]},[{x:0,y:0},{x:.5,y:1},{x:2,y:0}]);expect(r.summary.integral).toBeCloseTo(1,12);expect(r.points.map(p=>p.x)).toEqual([0,.5,1,2]);
  code(()=>integrateSignal(source,{range:[-1,2]}),'MATH_RANGE_OUTSIDE');
 });
 it('preserves sign and distinguishes the integral of magnitude across a zero crossing',()=>{
  const r=integrateSignal([{x:0,y:-1},{x:2,y:1}],{});expect(r.summary.integral).toBe(0);expect(r.summary.absoluteIntegral).toBe(1);
  expect(integrateSignal([{x:0,y:-1},{x:2,y:-1}],{}).summary.integral).toBe(-2);
 });
 it('trapezoid error decreases with the expected quadratic convergence',()=>{
  const values=[11,21,41].map(n=>Number(integrateSignal(Array.from({length:n},(_,i)=>({x:i/(n-1),y:(i/(n-1))**2})),{}).summary.integral)-1/3);
  expect(values[0]/values[1]).toBeCloseTo(4,10);expect(values[1]/values[2]).toBeCloseTo(4,9);
 });
});
