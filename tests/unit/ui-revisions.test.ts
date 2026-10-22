import {describe,it,expect} from 'vitest';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {History} from '../../src/domain/commands';
import {addPairs,createProject,makeObject} from '../../src/domain/model';
import {calloutRoute,layoutText} from '../../src/domain/textGeometry';
import {zoomView} from '../../src/domain/navigation';
import {createCoordinates,snapIndex} from '../../src/domain/geometry';
import {serialize,deserialize} from '../../src/domain/project';
import {ChartScene} from '../../src/features/chart/ChartScene';

describe('document history and navigation',()=>{
 it('ignores equivalent values after repeated focus/blur and keeps the redo branch intact',()=>{
  const p=addPairs(createProject(),[{x:1,y:2}],'source'),history=new History(p);
  for(let i=0;i<40;i++)history.execute('SetSeriesStyle',q=>({...q,series:q.series.map(s=>({...s,style:{...s.style,strokeWidthPt:s.style.strokeWidthPt}}))}));
  expect(history.canUndo).toBe(false);expect(history.dirty).toBe(false);expect(history.current).toBe(p);
  history.execute('SetSeriesStyle',q=>({...q,series:q.series.map(s=>({...s,style:{...s.style,strokeWidthPt:5}}))}));history.undo();
  history.execute('SetSeriesStyle',q=>({...q,series:q.series.map(s=>({...s,style:{...s.style}}))}));expect(history.canRedo).toBe(true);history.redo();expect(history.current.series[0].style.strokeWidthPt).toBe(5);
 });
 it('navigation is persisted separately and consumes neither Undo nor saved state',()=>{
  const original=addPairs(createProject(),[{x:1.0000000000000002,y:3}],'source'),history=new History(original);
  history.navigate({xMin:-10,xMax:20,yMin:-5,yMax:30});
  expect(history.dirty).toBe(false);expect(history.canUndo).toBe(false);expect(history.current.datasets).toBe(original.datasets);
  expect(deserialize(serialize(history.current)).project.viewport).toEqual(history.current.viewport);
  history.execute('label',p=>({...p,project:{...p.project,title:'changed'}}));history.markSaved();
  history.navigate({xMin:0,xMax:1,yMin:0,yMax:1});expect(history.dirty).toBe(false);
  history.undo();expect(history.current.project.title).toBe(original.project.title);expect(history.dirty).toBe(true);
  history.redo();expect(history.dirty).toBe(false);
 });
 it('snapshots are shared, reversible, include redo states and branch after a jump',()=>{
  const history=new History(createProject());const initial=history.current;
  for(const title of ['first','second','third'])history.execute(title,p=>({...p,project:{...p.project,title}}));
  const current=history.current;expect(history.snapshot(1)?.project.title).toBe('first');expect(history.current).toBe(current);
  expect(history.snapshot(1)?.datasets).toBe(initial.datasets);history.jump(1);
  expect(history.current.project.title).toBe('first');expect(history.canRedo).toBe(true);expect(history.steps).toHaveLength(4);
  history.jump(3);expect(history.current).toBe(current);history.jump(1);
  history.execute('branch',p=>({...p,project:{...p.project,title:'branch'}}));expect(history.canRedo).toBe(false);expect(history.steps.map(s=>s.label)).toEqual(['historyInitial','first','branch']);
 });
 it('retains a bounded history and its true sequence numbers',()=>{
  const history=new History(createProject());for(let i=0;i<250;i++)history.execute('title',p=>({...p,project:{...p.project,title:String(i)}}));
  expect(history.steps).toHaveLength(201);expect(history.steps[0].number).toBe(50);history.jump(0);expect(history.current.project.title).toBe('49');
 });
 it('zoom in and out are symmetric and reject numerical collapse or overflow',()=>{
  const v={xMin:-10,xMax:20,yMin:-30,yMax:40},anchor={x:3,y:7},inside=zoomView(v,anchor,1/1.5)!;
  for(const [key,value] of Object.entries(v))expect(zoomView(inside,anchor,1.5)![key as keyof typeof v]).toBeCloseTo(value,12);
  expect(zoomView(v,anchor,Infinity)).toBeNull();expect(zoomView({xMin:1e308,xMax:1.1e308,yMin:0,yMax:10},{x:0,y:0},10)).toBeNull();
  expect(zoomView({xMin:1,xMax:1+Number.EPSILON,yMin:1,yMax:1+Number.EPSILON},{x:1,y:1},.5)).toBeNull();
 });
});

describe('callout geometry and marker visibility',()=>{
 it('joins every side of a multiline label without crossing its padded rectangle, including rotation',()=>{
  const box={x:0,y:-16,width:180,height:42},label={x:300,y:200};
  for(const angle of [0,30,90,-45])for(const tip of [{x:0,y:0},{x:600,y:0},{x:0,y:500},{x:600,y:500},{x:300,y:0},{x:300,y:500}]){
   const route=calloutRoute(tip,label,box,angle,6);expect(route.leader.length).toBeGreaterThan(1);
   const a=-angle*Math.PI/180,toLocal=(x:number,y:number)=>({x:(x-label.x)*Math.cos(a)-(y-label.y)*Math.sin(a),y:(x-label.x)*Math.sin(a)+(y-label.y)*Math.cos(a)});
   for(const path of [route.leader,route.shelf])for(let i=1;i<path.length;i++)for(let t=0;t<=1;t+=.05){const pt=toLocal(path[i-1].x+(path[i].x-path[i-1].x)*t,path[i-1].y+(path[i].y-path[i-1].y)*t);expect(pt.x<0||pt.x>180||pt.y<-16||pt.y>26).toBe(true)}
  }
  const inside=calloutRoute({x:320,y:200},label,box);expect(inside.arrowTip).toBeNull();expect(Math.hypot(inside.shelf[1].x-inside.shelf[0].x,inside.shelf[1].y-inside.shelf[0].y)).toBeGreaterThan(180);expect(inside.leader).toHaveLength(2);
 });
 it('measures multiline rich text and uses exactly the same label geometry in export',()=>{
  const p=createProject(),o=makeObject('callout',[{mode:'data',x:1,y:1},{mode:'data',x:5,y:5}],'Long label\nSecond line');p.objects=[o];
  const layout=layoutText(o);expect(layout.bounds.width).toBeGreaterThan(90);expect(layout.bounds.height).toBeGreaterThan(o.style.fontSizePt*4/3);
  const html=renderToStaticMarkup(createElement(ChartScene,{p,width:1200,height:800}));expect(html).toContain('Second line');expect(html).not.toContain('data-handle');
  expect(layoutText(o)).toBe(layout);
 });
 it('line-only survives aph, preserves numerical data and snapping, and stays marker-free in all exports',()=>{
  const p=addPairs(createProject(),[{x:1,y:2},{x:3,y:4}],'dense'),points=p.datasets[0].points;p.series[0].mode='line';
  const loaded=deserialize(serialize(p)).project;expect(loaded.datasets[0].points).toEqual(points);expect(loaded.series[0].mode).toBe('line');
  const c=createCoordinates(p,1200,800);expect(snapIndex(p,c)(c.x(1),c.y(2))[0].point).toBe(points[0]);
  for(const colorMode of ['original','grayscale','strict-bw'] as const){const html=renderToStaticMarkup(createElement(ChartScene,{p,width:1200,height:800,colorMode}));expect(html).not.toContain('data-point=');expect(html).toContain('data-series=')}
 });
});
