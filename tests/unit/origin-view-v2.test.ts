import {describe,it,expect} from 'vitest';
import {ownXYOrigin} from '../fixtures/origin';
import {convertOrigin} from '../../src/features/origin/convert';
import {resolvePage,sheetColumns,diagnosticReport} from '../../src/features/origin/resolve';
import {validateProject,serialize,deserialize} from '../../src/domain/project';
import {plotAreas,activateArea,areaProject,applyArea,syncArea} from '../../src/domain/plotAreas';
import {History} from '../../src/domain/commands';
import {renderSvg} from '../../src/features/export/svgRenderer';
import {renderProject,previewProject} from '../../src/features/export/previewProject';
import {appendOrigin} from '../../src/features/origin/append';
import {createProject,addPairs,makeSeries,id} from '../../src/domain/model';
import {importedSnapshot} from '../../src/domain/importedSnapshots';
import {datasetUnits} from '../../src/domain/dependencies';
import {detectOrigin} from '../../src/features/origin/detector';
import {originTextFrame} from '../../src/features/origin/textFrame';
describe('general Origin view and editable page',()=>{
 it('places rotated text using the reference corner and preserves a scientific label that crosses the unrotated page edge',async()=>{
  expect(originTextFrame([10,100,30,160],0)).toEqual([10,100,30,160]);expect(originTextFrame([10,100,30,160],90)).toEqual([10,40,30,100]);expect(originTextFrame([10,100,30,160],180)).toEqual([-10,40,10,100]);expect(originTextFrame([10,100,30,160],270)).toEqual([-10,100,10,160]);
  const {model,resources}=await ownXYOrigin(),base=model.nodes[0];model.nodes.push({...base,id:'rotated',kind:'text',parentId:'area1',properties:{textHex:'64286d2f6d5c2d283029292f64742028312f6d696e29',frame:[30,780,70,950],rotation:90,fontSize:20,shown:true}});
  const {project:p,issues}=convertOrigin(model,resources,{nodeId:'page',encoding:'utf-8'});expect(p.objects).toHaveLength(1);expect(p.objects[0].text.some(part=>part.baseline==='sub'&&part.text==='0')).toBe(true);expect(p.objects[0].text.map(part=>part.text).join('')).toBe('d(m/m0)/dt (1/min)');expect(issues.some(i=>i.code==='ORIGIN_TEXT_OUTSIDE_PAGE_ARCHIVED')).toBe(false);
 });
 it('resolves actual IDs, preserves arbitrary sheet order, shared X and passive results',async()=>{
  const {model,resources}=await ownXYOrigin(),before=JSON.stringify(model),resolved=resolvePage(model,'curve1');expect(resolved.layers).toHaveLength(2);expect(resolved.links.map(l=>[l.x,l.y])).toEqual([['x','y'],['x','z']]);expect(sheetColumns(model,model.nodes[0]).map(c=>c.nodeId)).toEqual(['y','x','z']);
  const {project:p}=convertOrigin(model,resources,{nodeId:'page',encoding:'utf-8'});expect(validateProject(p).errors).toEqual([]);expect(p.datasets.map(d=>d.points.length)).toEqual([4,5]);expect(Object.is(p.datasets[0].points[0].x,-0)).toBe(true);expect(p.datasets[0].points[2]).toMatchObject({x:3,y:9});expect(p.calculations).toEqual([]);expect(datasetUnits(p,p.datasets[1].id)).toEqual({x:'s',y:'mV'});expect(JSON.stringify(model)).toBe(before);
  const reopened=deserialize(serialize(p)).project;expect(Object.is(reopened.datasets[0].points[0].x,-0)).toBe(true);expect(reopened.extensions).toEqual(p.extensions);expect(plotAreas(reopened)?.areas).toHaveLength(2);
 });
 it('edits and navigates one area without losing the other or measurement identity; undo restores it',async()=>{
  const {model,resources}=await ownXYOrigin(),p=convertOrigin(model,resources,{nodeId:'page',encoding:'utf-8'}).project,h=new History(p),first=plotAreas(p)!.areas[0];h.activateArea('area1');expect(h.dirty).toBe(false);h.navigate({xMin:1,xMax:4,yMin:0,yMax:20});expect(plotAreas(h.current)!.areas[0]).toBe(first);expect(h.current.datasets).toBe(p.datasets);
  h.execute('Axis',q=>syncArea({...q,axes:{...q.axes,y:{...q.axes.y,label:'Changed'}}}));expect(plotAreas(h.current)!.areas[1].axes.y.label).toBe('Changed');h.undo();expect(plotAreas(h.current)!.areas[1].axes.y.label).toBe('Signal');h.redo();expect(h.current.axes.y.label).toBe('Changed');
  const scoped=applyArea(p,'area1',q=>({...q,objects:[],series:q.series.map(s=>({...s,visible:false}))}));expect(scoped.series.find(s=>s.id===p.series[0].id)?.visible).toBe(true);expect(areaProject(activateArea(scoped,'area0'),first).series).toHaveLength(1);
 });
 it('converts non-integral source page ratios to a valid editable document without rounding measurements',async()=>{
  const {model,resources}=await ownXYOrigin();model.nodes.find(n=>n.id==='page')!.properties.widthOriginUnits=1001;const p=convertOrigin(model,resources,{nodeId:'page',encoding:'utf-8'}).project;expect(Number.isInteger(p.page.heightPx)).toBe(true);expect(validateProject(p).errors).toEqual([]);expect(Object.is(p.datasets[0].points[0].x,-0)).toBe(true);
 });
 it('retains source tick precision and avoids two labels at a shared plot boundary',async()=>{
  const {model,resources}=await ownXYOrigin(),layer=model.nodes.find(n=>n.id==='area0')!;layer.properties.yAxis={...(layer.properties.yAxis as object),min:-.018,max:0,step:.005,tickDecimals:-1,tickFormat:0};const p=convertOrigin(model,resources,{nodeId:'page',encoding:'utf-8'}).project;expect(p.axes.y.numberFormat).toBe('fixed');expect(p.axes.y.precision).toBe(3);expect(renderSvg(p,{width:1200,height:960})).toContain('0.000');
  const layout=plotAreas(p)!;layout.areas[0].frame=[.13,.1,.93,.45];layout.areas[1].frame=[.13,.45,.93,.8];expect((areaProject(p,layout.areas[0]).extensions.axisDisplay as {y:{omitMinimum?:boolean}}).y.omitMinimum).toBe(true);expect(validateProject(p).errors).toEqual([]);
 });
 it('exports distinct clipping areas, exact XY and pen-up gaps with the same scene renderer',async()=>{
  const {model,resources}=await ownXYOrigin(),p=convertOrigin(model,resources,{nodeId:'page',encoding:'utf-8'}).project,svg=renderSvg(renderProject(p),{width:1000,height:800});expect((svg.match(/data-plot-area=/g)??[])).toHaveLength(2);const clips=[...svg.matchAll(/<clipPath\b[^>]*\bid="([^"]+)"/g)].map(m=>m[1]);expect(new Set(clips).size).toBe(clips.length);expect(clips.length).toBeGreaterThanOrEqual(2);expect(svg).toContain('data-series=');expect(svg).not.toContain('NaN');expect(svg).toContain('#336699');expect(p.extensions.lineBreaks).toEqual({[p.datasets[0].id]:[p.datasets[0].points[2].id],[p.datasets[1].id]:[]});expect(renderProject(p).extensions.originImport).toBeUndefined();expect(previewProject(p).extensions.plotAreas).toEqual(p.extensions.plotAreas);
 });
 it('requires explicit X or explicit row-index consent and rejects unresolved relations',async()=>{
  const {model,resources}=await ownXYOrigin();expect(()=>convertOrigin(model,resources,{nodeId:'sheet',encoding:'utf-8',links:[{x:null,y:'z'}]})).toThrow('ORIGIN_X_REQUIRED');const p=convertOrigin(model,resources,{nodeId:'sheet',encoding:'utf-8',links:[{x:null,y:'z',rowIndex:true}]}).project;expect(p.datasets[0].points[0].x).toBe(1);expect(p.axes.x.label).toBe('Row index');const broken=structuredClone(model);broken.relations[0].to=null;broken.relations[0].resolved=false;expect(resolvePage(broken,'page').issues[0].code).toBe('ORIGIN_XY_UNRESOLVED');
 });
 it('retains unsupported pages context without fabricating geometry or points',async()=>{
  const {model,resources}=await ownXYOrigin();model.nodes.find(n=>n.id==='page')!.properties.is3D=true;expect(resolvePage(model,'page').links).toEqual([]);expect(()=>convertOrigin(model,resources,{nodeId:'page',encoding:'utf-8'})).toThrow('ORIGIN_LAYER_UNSUPPORTED');expect(diagnosticReport(model)).not.toContain('commandHex');expect(diagnosticReport(model)).not.toContain('Own synthetic');
 });
 it('appends twice without ID collisions, preserving old data, provenance and one-step undo',async()=>{
  const {model,resources}=await ownXYOrigin(),source=convertOrigin(model,resources,{nodeId:'page',encoding:'utf-8'}).project,base=addPairs(createProject(),[{x:7,y:8}],'Kept'),h=new History(base);h.execute('ImportBatch',p=>appendOrigin(p,source));h.execute('ImportBatch',p=>appendOrigin(p,source));expect(validateProject(h.current).errors).toEqual([]);expect(h.current.datasets[0]).toBe(base.datasets[0]);expect(new Set(h.current.series.map(s=>s.id)).size).toBe(5);h.undo();expect(h.current.series).toHaveLength(3);h.undo();expect(h.current).toBe(base);
 });
 it('rejects corrupt layout and interpolation at the project trust boundary',async()=>{
  const {model,resources}=await ownXYOrigin(),p=convertOrigin(model,resources,{nodeId:'page',encoding:'utf-8'}).project;const bad=structuredClone(p);plotAreas(bad)!.areas[0].axes.y.tickStep=0;expect(validateProject(bad).errors.length).toBeGreaterThan(0);expect(validateProject({...p,extensions:{...p.extensions,plotFrame:[0,0,0,1]}}).errors.length).toBeGreaterThan(0);expect(validateProject({...p,extensions:{...p.extensions,seriesInterpolation:{a:'execute'}}}).errors.length).toBeGreaterThan(0);
 });
 it('assigns new calculations to their source area and keeps imported results explicitly passive',async()=>{
  const {model,resources}=await ownXYOrigin(),p=convertOrigin(model,resources,{nodeId:'page',encoding:'utf-8'}).project,source=p.datasets[1],did=id(),cid=id(),result=makeSeries(did,'Computed',2);
  expect(importedSnapshot(p,source.id)).toBe(true);expect(p.calculations).toHaveLength(0);
  const next=syncArea({...p,datasets:[...p.datasets,{...source,id:did,role:'derived',source:{kind:'calculation',calculationId:cid}}],series:[...p.series,result],calculations:[{id:cid,kind:'moving-average',sourceDatasetIds:[source.id],resultDatasetId:did,parameters:{window:3},algorithmVersion:1,status:'valid',summary:{}}]});
  expect(validateProject(next).errors).toEqual([]);expect(plotAreas(next)!.areas[1].seriesIds).toContain(result.id);expect(plotAreas(next)!.areas[0].seriesIds).not.toContain(result.id);expect(datasetUnits(next,did)).toEqual({x:'s',y:'mV'});expect(importedSnapshot(deserialize(serialize(p)).project,source.id)).toBe(true);
 });
 for(const [build,version]of [[2878,8.0724],[3116,9.200272],[3168,9.300226],[3478,9.850212],[3522,9.900225],[3551,9.950167]])it(`detects exercised profile ${build} without accepting another generation`,()=>{
  const prefix=new TextEncoder().encode(`CPYA 4.${build} 123 #\n`),bytes=new Uint8Array(prefix.length+5+40+1),v=new DataView(bytes.buffer);bytes.set(prefix);v.setUint32(prefix.length,40,true);bytes[prefix.length+4]=10;bytes[bytes.length-1]=10;v.setFloat64(prefix.length+5+27,version,true);expect(detectOrigin(bytes).canDecode).toBe(true);v.setFloat64(prefix.length+5+27,version+.01,true);expect(detectOrigin(bytes).canDecode).toBe(false);
 });
});
