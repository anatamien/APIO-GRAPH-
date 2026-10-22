import {it,expect} from 'vitest';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {addPairs,createProject,type ProjectDocument} from '../../src/domain/model';
import {History,editPoint} from '../../src/domain/commands';
import {deserialize,serialize} from '../../src/domain/project';
import {autoRange,fitView} from '../../src/domain/geometry';
import {editViewport} from '../../src/domain/editViewport';
import {setSeriesMode,effectiveMarkers} from '../../src/domain/seriesDisplay';
import {addCalculation,calculatePreview,recomputeProject} from '../../src/features/analysis/operations';
import {renderSvg} from '../../src/features/export/svgRenderer';
import {SeriesPanel} from '../../src/features/inspector/SeriesPanel';
import {translate} from '../../src/app/i18n';
function source(){let p=addPairs(createProject(),Array.from({length:31},(_,x)=>({x,y:x*x+Math.sin(x)})),'A');for(const kind of ['moving-average','derivative'] as const){const d=p.datasets.at(-1)!;p=addCalculation(p,p.series.at(-1)!.id,kind,kind==='moving-average'?{window:5}:{sort:true},calculatePreview(kind,d.points,kind==='moving-average'?{window:5}:{sort:true}),kind)}return fitView(p)}
it('never changes another series or viewport in either hide order across legacy flags, legend, modes and axes',()=>{
 for(const mode of ['line','points','line-points'] as const)for(const legacy of [true,false])for(const legend of [true,false])for(const axis of ['auto','manual'] as const)for(const order of [[0,1,1,0],[1,0,0,1],[0,2,2,0],[1,2,2,1],[2,0,0,2],[2,1,1,2],[0,1,2,2,1,0]]){
  const original=source();original.series.forEach(s=>{s.mode=mode;s.style.markerVisible=true});original.editor.showPointMarkers=legacy;original.legend.visible=legend;original.axes.x.mode=axis;original.axes.y.mode=axis;
  const h=new History(original);h.navigate({xMin:-30,xMax:100,yMin:-40,yMax:1000});const view=h.current.viewport;
  for(const i of order){const before=h.current;h.execute('SetSeriesStyle',p=>editViewport(p,{...p,series:p.series.map((s,j)=>j===i?{...s,visible:!s.visible}:s)},'SetSeriesStyle'));expect(h.current.viewport).toBe(view);before.series.forEach((s,j)=>{if(j!==i)expect(h.current.series[j]).toBe(s)});expect(h.current.calculations).toBe(before.calculations)}
  const reopened=deserialize(serialize(h.current)).project;expect(reopened.series).toEqual(h.current.series);expect(reopened.datasets).toEqual(original.datasets);expect(reopened.calculations.every(c=>c.status==='valid')).toBe(true);
  h.undo();h.redo();expect(h.current.series.map(s=>s.visible)).toEqual([true,true,true]);
 }
});
it('follows real data edits only on auto axes that still follow the automatic range',()=>{
 const p=source(),changed=editPoint(p,p.datasets[0].id,p.datasets[0].points[0].id,{x:-500,y:-800});
 expect(editViewport(p,changed,'EditPoint').viewport).toEqual(autoRange(changed));
 const moved={...p,viewport:{...p.viewport,xMin:-90,xMax:90}},manual={...changed,axes:{...changed.axes,y:{...changed.axes.y,mode:'manual' as const}}};
 expect(editViewport(moved,{...manual,viewport:moved.viewport},'EditPoint').viewport).toEqual(moved.viewport);
 expect(editViewport(p,addPairs(p,[{x:1000,y:1000}],'append'),'ImportBatch').viewport).toBe(p.viewport);
});
it('keeps per-result color and point outline after source edits, chained recompute, save and exact export',()=>{
 let p=source();const colors=['#000000','#C62828','#698464'];p={...p,series:p.series.map((s,i)=>({...s,style:{...s.style,stroke:colors[i],markerStroke:colors[i]}}))};
 const points=p.datasets[0].points;const changed=editPoint(p,p.datasets[0].id,points[3].id,{x:points[3].x,y:99});const styled=recomputeProject(changed),plain=recomputeProject({...changed,series:source().series.map((s,i)=>({...s,id:p.series[i].id,datasetId:p.series[i].datasetId}))});
 expect(styled.datasets.map(d=>d.points.map(pt=>[pt.x,pt.y]))).toEqual(plain.datasets.map(d=>d.points.map(pt=>[pt.x,pt.y])));expect(styled.series).toBe(p.series);
 for(const mode of ['line','points','line-points'] as const){let shown:ProjectDocument=styled;for(const s of styled.series)shown=setSeriesMode(shown,s.id,mode);const reopened=deserialize(serialize(shown)).project;const svg=renderSvg(reopened,{width:1200,height:800});for(const color of colors)expect(svg).toContain(`stroke="${color}"`);expect(reopened.series.map(s=>s.style.stroke)).toEqual(colors);if(mode!=='line')expect(reopened.series.every(s=>effectiveMarkers(reopened,s))).toBe(true)}
});
it('an invalid selected ID displays no editable first-series controls',()=>{
 const p=source(),markup=renderToStaticMarkup(createElement(SeriesPanel,{project:p,selectedId:'missing',t:translate('en'),onSelect:()=>{},onChange:()=>{throw Error('unexpected edit')},onClose:()=>{}}));
 expect(markup).toContain('Choose a series');expect(markup).not.toContain('aria-label="Name"');
});
it('preserves manual navigation at scientific scales far below one',()=>{
 const p=fitView(addPairs(createProject(),[{x:1e-20,y:2e-20},{x:2e-20,y:4e-20}],'tiny'));
 const moved={...p,viewport:{xMin:1e-22,xMax:9e-22,yMin:1e-22,yMax:9e-22}},next=editPoint(moved,p.datasets[0].id,p.datasets[0].points[0].id,{x:3e-20,y:5e-20});
 expect(editViewport(moved,next,'EditPoint').viewport).toBe(moved.viewport);
});
it('preserves a narrow manually chosen view at a large coordinate offset',()=>{
 const p=fitView(addPairs(createProject(),[{x:1e16,y:1},{x:1e16+1000,y:2}],'offset'));
 const moved={...p,viewport:{...p.viewport,xMin:1e16+300,xMax:1e16+400}},next=editPoint(moved,p.datasets[0].id,p.datasets[0].points[0].id,{x:1e16,y:3});
 const view=editViewport(moved,next,'EditPoint').viewport;expect(view.xMin).toBe(moved.viewport.xMin);expect(view.xMax).toBe(moved.viewport.xMax);expect(view.yMin).toBe(autoRange(next).yMin);expect(view.yMax).toBe(autoRange(next).yMax);
});
