import {describe,it,expect} from 'vitest';
import {addPairs,createProject,makeSeries} from '../../src/domain/model';
import {createCoordinates,resolveAnchor,snapIndex} from '../../src/domain/geometry';
import {displayPoints,markerPath} from '../../src/features/chart/ChartScene';

describe('measurement caches preserve scientific selection',()=>{
 it('lazily merges dense groups with ordinary neighbours in acquisition order at distance ties',()=>{
  const p=createProject(),did=crypto.randomUUID(),points=Array.from({length:2001},(_,i)=>({id:String(i),x:i===1000?1.001:i%2?0.99:1.01,y:2}));
  p.datasets=[{id:did,name:'mixed',role:'raw',source:{kind:'manual'},points}];p.series=[makeSeries(did,'mixed',0)];const c=createCoordinates(p,1200,800);let reads=0;
  for(const point of points){const id=point.id;Object.defineProperty(point,'id',{get:()=>{reads++;return id}})}
  const query=snapIndex(p,c);reads=0;const near=query(c.x(1),c.y(2),10);expect(near).toHaveLength(2001);expect(reads).toBeLessThan(20);
  expect(near[0].point).toBe(points[1000]);const expected=points.filter((_,i)=>i!==1000).sort((a,b)=>Math.abs(c.x(a.x)-c.x(1))-Math.abs(c.x(b.x)-c.x(1))||Number(a.id)-Number(b.id));
  expect(near.slice(1).map(n=>n.point)).toEqual(expected);
 });
 it('keeps overlapping dense series lazy and cycles them in stable series order',()=>{
  const p=createProject(),did=crypto.randomUUID();p.datasets=[{id:did,name:'shared',role:'raw',source:{kind:'manual'},points:Array.from({length:500000},(_,i)=>({id:String(i),x:1,y:2}))}];p.series=[makeSeries(did,'first',0),makeSeries(did,'second',1)];
  const c=createCoordinates(p,1200,800),query=snapIndex(p,c),start=performance.now();
  for(let i=0;i<5;i++){const near=query(c.x(1)+i,c.y(2),10);expect(near).toHaveLength(1000000);expect(near[499999].seriesId).toBe(p.series[0].id);expect(near[500000].seriesId).toBe(p.series[1].id);expect(near.at(-1)?.point.id).toBe('499999');expect(near.slice(0,3).map(c=>c.point.id)).toEqual(['0','1','2'])}
  expect(performance.now()-start).toBeLessThan(50);
 });
 it('can inspect and cycle a million coincident observations without materializing them on every hover',()=>{
  const p=createProject(),datasetId=crypto.randomUUID();p.datasets=[{id:datasetId,name:'coincident',role:'raw',source:{kind:'manual'},points:Array.from({length:1000000},(_,i)=>({id:String(i),x:1,y:2}))}];
  p.series=[{id:'series',datasetId,name:'coincident',visible:true,includeInAutoRange:true,order:0,mode:'points',style:{stroke:'#123456',strokeWidthPt:1,opacity:1,dash:'solid',markerShape:'circle',markerSizePt:3,markerFill:'#FFFFFF',markerStroke:'#123456',markerVisible:true}}];
  const c=createCoordinates(p,1200,800),query=snapIndex(p,c),start=performance.now();
  for(let i=0;i<5;i++){const near=query(c.x(1)+i,c.y(2),10);expect(near).toHaveLength(1000000);expect(near[0].point.id).toBe('0');expect(near.at(-1)?.point.id).toBe('999999')}
  expect(performance.now()-start).toBeLessThan(50);
 });
 it('does not read all measurements again when navigating, formatting or recoloring',()=>{
  const p=addPairs(createProject(),Array.from({length:10000},(_,x)=>({x,y:x%17})),'source');let reads=0;
  for(const point of p.datasets[0].points){const x=point.x;Object.defineProperty(point,'x',{get:()=>{reads++;return x},enumerable:true})}
  snapIndex(p,createCoordinates(p,1200,800));reads=0;
  for(let i=0;i<20;i++){const next={...p,viewport:{...p.viewport,xMax:100+i},series:p.series.map(s=>({...s,style:{...s.style,stroke:'#123456'}}))};snapIndex(next,createCoordinates(next,1200,800))}
  expect(reads).toBeLessThan(100);
 });
 it('finds the nearest point in pixels on anisotropic axes and keeps coincident candidates',()=>{
  const p=addPairs(createProject(),[{x:100,y:0},{x:0,y:1},{x:0,y:1}],'source');p.viewport={xMin:-1000,xMax:1000,yMin:-2,yMax:2};
  const c=createCoordinates(p,1200,800),near=snapIndex(p,c)(c.x(0),c.y(0),400);
  expect(near.map(v=>v.row)).toEqual([1,2,3]);expect(near[1].point.id).not.toBe(near[2].point.id);
  expect(snapIndex(p,c)(c.x(0),c.y(1),1).map(v=>v.row)).toEqual([2,3]);
 });
 it('invalidates spatial lookup for edited arrays, visibility and stale calculations',()=>{
  const p=addPairs(createProject(),[{x:1,y:2}],'source'),c=createCoordinates(p,1200,800);expect(snapIndex(p,c)(c.x(1),c.y(2),1)).toHaveLength(1);
  const edited={...p,datasets:p.datasets.map(d=>({...d,points:d.points.map(pt=>({...pt,x:4}))}))};
  expect(snapIndex(edited,c)(c.x(1),c.y(2),1)).toHaveLength(0);expect(snapIndex(edited,c)(c.x(4),c.y(2),1)).toHaveLength(1);
  expect(snapIndex({...p,series:p.series.map(s=>({...s,visible:false}))},c)(c.x(1),c.y(2),1)).toHaveLength(0);
 });
 it('resolves a linked point without rescanning IDs on each redraw and refreshes edited data',()=>{
  const p=addPairs(createProject(),Array.from({length:10000},(_,x)=>({x,y:x})),'source'),points=p.datasets[0].points,last=points.at(-1)!;
  const a={mode:'point' as const,datasetId:p.datasets[0].id,pointId:last.id,fallbackX:-1,fallbackY:-1,offsetXpx:0,offsetYpx:0};let reads=0;
  for(const pt of points){const id=pt.id;Object.defineProperty(pt,'id',{get:()=>{reads++;return id},enumerable:true})}
  expect(resolveAnchor(p,a)).toEqual({x:9999,y:9999});reads=0;for(let i=0;i<100;i++)resolveAnchor(p,a);expect(reads).toBeLessThan(10);
  const edited={...p,datasets:p.datasets.map(d=>({...d,points:d.points.map(pt=>pt===last?{...pt,x:7}:pt)}))};expect(resolveAnchor(edited,a)).toEqual({x:7,y:9999});
 });
 it('reuses the display selection while preserving acquisition order and extrema',()=>{
  const points=Array.from({length:20000},(_,i)=>({id:String(i),x:i%11,y:i===7777?1e6:i===8888?-1e6:0}));
  const selected=displayPoints(points,1000);expect(displayPoints(points,1000)).toBe(selected);
  expect(selected).toContain(points[7777]);expect(selected).toContain(points[8888]);expect(selected.map(p=>Number(p.id))).toEqual(selected.map(p=>Number(p.id)).sort((a,b)=>a-b));expect(points).toHaveLength(20000);
  expect(markerPath('circle',2)).toBe(markerPath('circle',2));
 });
});
