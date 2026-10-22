import {describe,it,expect} from 'vitest';
import {History} from '../../src/domain/commands';
import {addPairs,createProject} from '../../src/domain/model';

describe('visual journal as a stable projection of complete document history',()=>{
 it('names visibility by result and retains hidden style and metadata in Undo/Redo',()=>{
  const p=addPairs(createProject(),[{x:1,y:2}],'Measured'),h=new History(p);
  const visible=(v:boolean)=>h.execute('SetSeriesVisibility',q=>({...q,series:q.series.map(s=>({...s,visible:v}))}));
  visible(false);h.execute('ProjectTitle',q=>({...q,project:{...q.project,title:'Metadata'}}));
  h.execute('SetSeriesStyle',q=>({...q,series:q.series.map(s=>({...s,style:{...s.style,stroke:'#FF0000'}}))}));
  visible(true);
  expect(h.steps).toHaveLength(5);expect(h.visualSteps.map(s=>[s.index,s.label])).toEqual([[0,'historyInitial'],[1,'CurveHidden'],[4,'CurveShown']]);
  expect(h.visualSteps[1].curveName).toBe('Measured');h.markSaved();h.undo();expect(h.current.series[0].visible).toBe(false);expect(h.dirty).toBe(true);
  h.undo();expect(h.current.series[0].style.stroke).toBe(p.series[0].style.stroke);h.redo();h.redo();expect(h.dirty).toBe(false);
  h.jump(h.visualSteps[1].index);expect(h.current.project.title).toBe('Untitled');expect(h.current.series[0].visible).toBe(false);
  expect(h.snapshot(h.visualSteps[2].index)?.series[0].visible).toBe(true);
 });
 it('skips no-ops and navigation and hidden markers; visible legend/curve changes remain',()=>{
  const p=addPairs(createProject(),[{x:1,y:2}],'Measured'),h=new History(p);
  h.execute('same',q=>({...q}));h.navigate({...p.viewport,xMax:20});expect(h.visualSteps).toHaveLength(1);
  h.execute('SetSeriesStyle',q=>({...q,series:q.series.map(s=>({...s,style:{...s.style,markerSizePt:12}}))}));
  expect(h.steps).toHaveLength(2);expect(h.visualSteps).toHaveLength(1);
  h.execute('Legend',q=>({...q,legend:{...q.legend,visible:false}}));expect(h.visualSteps.at(-1)?.index).toBe(2);
  h.execute('SetSeriesStyle',q=>({...q,series:q.series.map(s=>({...s,style:{...s.style,stroke:'#AA0000'}}))}));expect(h.visualSteps.at(-1)?.index).toBe(3);
 });
 it('keeps exact indices through trimming, branches and redo',()=>{
  const h=new History(addPairs(createProject(),[{x:1,y:2}],'A'));
  for(let i=0;i<210;i++)h.execute('Legend',q=>({...q,legend:{...q.legend,visible:!q.legend.visible}}));
  expect(h.visualSteps[0]).toMatchObject({number:10,index:0});const last=h.visualSteps.at(-1)!;
  h.jump(last.index-1);expect(h.canRedo).toBe(true);expect(h.snapshot(last.index)?.legend.visible).toBe(true);h.redo();expect(h.index).toBe(last.index);
  h.jump(0);h.execute('ProjectTitle',q=>({...q,project:{...q.project,title:'Branch'}}));expect(h.canRedo).toBe(false);expect(h.visualSteps).toHaveLength(1);expect(h.steps).toHaveLength(2);
 });
 it('records a viewport changed by an edit without treating navigation as an edit',()=>{
  const h=new History(addPairs(createProject(),[{x:1,y:2}],'A'));
  h.navigate({xMin:-10,xMax:20,yMin:-5,yMax:30});
  h.execute('ProjectTitle',q=>({...q,project:{...q.project,title:'Metadata after navigation'}}));expect(h.visualSteps).toHaveLength(1);
  h.execute('SetSeriesStyle',q=>({...q,viewport:{xMin:0,xMax:2,yMin:1,yMax:3},series:q.series.map(s=>({...s,includeInAutoRange:false}))}));
  expect(h.visualSteps.at(-1)).toMatchObject({index:2,label:'SetSeriesStyle'});h.undo();expect(h.current.viewport).toEqual({xMin:-10,xMax:20,yMin:-5,yMax:30});
 });
});
