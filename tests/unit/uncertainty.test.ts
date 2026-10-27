import {fitContent} from '../../src/domain/fitContent';
import {ownXYOrigin} from '../fixtures/origin';
import {convertOrigin} from '../../src/features/origin/convert';
import {it,expect} from 'vitest';
import {addPairs,createProject,id,makeSeries} from '../../src/domain/model';
import {editPointUncertainty,History} from '../../src/domain/commands';
import {uncertaintyBounds,pointUncertainty} from '../../src/domain/uncertainty';
import {autoRange} from '../../src/domain/geometry';
import {validateProject} from '../../src/domain/project';
import {encodePointBuffer,decodePointBuffer} from '../../src/features/workspace/pointBuffer';
import {readWorkspace,writeWorkspace} from '../../src/features/workspace/archive';
import {renderSvg} from '../../src/features/export/svgRenderer';
import {measurementRow,uncertaintyIssue} from '../../src/features/import/uncertaintyMapping';
import {writeFile} from 'node:fs/promises';
it('a mixed-version APIOPTS2 workspace is portable to the native archive validator',async()=>{
 const old=createProject(),p=addPairs(createProject(),[{x:-0,y:Number.MIN_VALUE,errorX:0,errorY:.25},{x:3,y:-4,errorX:1},{x:5,y:6}],'Own measurements'),a=id(),b=id(),bytes=await writeWorkspace({id:id(),activeId:b,tabs:[{id:a,label:'Legacy',project:old},{id:b,label:'Uncertainties',project:p}]}),loaded=await readWorkspace(bytes);expect(loaded.graph(a)).toEqual(old);expect(loaded.graph(b).datasets).toEqual(p.datasets);if(process.env.APIO_WORKSPACE_FIXTURE)await writeFile(process.env.APIO_WORKSPACE_FIXTURE,bytes);
});
it('symmetric absolute uncertainties round-trip with explicit missing flags, zero, negative zero and extreme binary64',async()=>{
 const p=addPairs(createProject(),[{x:1,y:2,errorX:0,errorY:.25},{x:3,y:4,errorY:-0},{x:5,y:6}],'Measurements'),points=p.datasets[0].points,bytes=encodePointBuffer(points);expect(new TextDecoder().decode(bytes.subarray(0,8))).toBe('APIOPTS2');expect(bytes.length).toBe(16+points.length*72);expect(decodePointBuffer(bytes)).toEqual(points);expect(Object.is(decodePointBuffer(bytes)[1].errorY,-0)).toBe(true);expect('errorX'in decodePointBuffer(bytes)[1]).toBe(false);const tab=id(),archive=await readWorkspace(await writeWorkspace({id:id(),activeId:tab,tabs:[{id:tab,label:'Errors',project:p}]}));expect(archive.manifest.required).toContain('points-2');expect(archive.manifest.required).toContain('graph-1.3');expect(archive.graph(tab).datasets).toEqual(p.datasets);
 for(const offset of [16+52,16+56,16+64]){const bad=bytes.slice(),v=new DataView(bad.buffer);if(offset===68)v.setUint32(offset,4,true);else v.setFloat64(offset,NaN,true);expect(()=>decodePointBuffer(bad)).toThrow('WORKSPACE_INVALID_POINTS')}
 expect(()=>encodePointBuffer([{id:id(),x:1,y:2,errorX:-1}])).toThrow('WORKSPACE_INVALID_POINTS');expect(()=>addPairs(createProject(),[{x:1,y:2,errorY:Infinity}],'Bad')).toThrow('UNCERTAINTY_INVALID');
});
it('point edits keep IDs and missing values, Undo once, and series constants remain independent',()=>{
 const p=addPairs(createProject(),[{x:1,y:2},{x:3,y:4}],'Raw'),h=new History(p),did=p.datasets[0].id,pid=p.datasets[0].points[1].id;h.execute('SetUncertainty',q=>editPointUncertainty(q,did,pid,'y',.3));expect(h.current.datasets[0].points[1]).toEqual({...p.datasets[0].points[1],errorY:.3});expect(h.current.schemaVersion).toBe('1.3.0');h.undo();expect(h.current).toBe(p);h.redo();const d=h.current.datasets[0],a={...h.current.series[0],uncertainty:{x:{mode:'constant' as const,value:.5},y:{mode:'constant' as const,value:2}}},b=makeSeries(did,'Other',1);expect(pointUncertainty(d,d.points[1],'y',a)).toBe(2);expect(pointUncertainty(d,d.points[1],'y',b)).toBe(.3);expect(pointUncertainty(d,d.points[0],'y',b)).toBeUndefined();expect(uncertaintyBounds(d,a)).toEqual({minX:.5,maxX:3.5,minY:0,maxY:6});expect(()=>editPointUncertainty(h.current,did,pid,'y',-.1)).toThrow('UNCERTAINTY_INVALID');const cleared=editPointUncertainty(h.current,did,pid,'y',undefined);expect('errorY'in cleared.datasets[0].points[1]).toBe(false);
});
it('export batches every original nonzero error interval and F9 includes its finite endpoints',()=>{
 const p=addPairs(createProject(),Array.from({length:10000},(_,i)=>({x:i,y:i%7,errorX:.2,errorY:.5})),'Errors');p.series[0].style.markerVisible=false;const svg=renderSvg(p,{width:1200,height:800});expect(svg).toContain('data-error-bars');const paths=svg.match(/<path/g)?.length??0;expect(paths).toBeLessThan(100);expect((svg.match(/M/g)??[]).length).toBeGreaterThan(60000);const bounds=autoRange(p);expect(bounds.xMin).toBeLessThan(-.2);expect(bounds.yMax).toBeGreaterThan(6.5);expect(validateProject(p).errors).toEqual([]);const overflow=addPairs(createProject(),[{x:Number.MAX_VALUE,y:1,errorX:Number.MAX_VALUE}],'Overflow');expect(validateProject(overflow).errors.join()).toContain('UNCERTAINTY_RANGE_OVERFLOW');
});
it('column mapping keeps row alignment, rejects negative/missing values and allows zero without filling gaps',()=>{
 const mapping={x:0,y:1,errorX:2,errorY:3};expect(measurementRow([1,2,0,.4],mapping)).toEqual({x:1,y:2,errorX:0,errorY:.4});expect(measurementRow([1,2,-.1,.4],mapping)).toBeNull();expect(uncertaintyIssue([1,2,null,.4],mapping)).toEqual({column:3,code:'uncertaintyIncomplete'});expect(measurementRow([1,2,null,.4],{x:0,y:1,errorY:3})).toEqual({x:1,y:2,errorY:.4});
});

it('F9 includes error endpoints and Origin mapping matches absolute source rows without guessing missing errors',async()=>{
 const origin=await ownXYOrigin(),result=convertOrigin(origin.model,origin.resources,{nodeId:'sheet',encoding:'utf-8',links:[{x:'x',y:'y',errorY:'z'}]}).project;expect(result.datasets[0].points.map(p=>[p.x,p.errorY])).toEqual([[-0,0],[1,2],[3,6],[4,8]]);expect(result.schemaVersion).toBe('1.3.0');expect(validateProject(result).errors).toEqual([]);const fit=fitContent(result,1200,800);expect(fit.yMax).toBeGreaterThan(24);const z=origin.model.columns.find(c=>c.nodeId==='z')!;origin.resources.get(z.tags)![1]=1;expect(()=>convertOrigin(origin.model,origin.resources,{nodeId:'sheet',encoding:'utf-8',links:[{x:'x',y:'y',errorY:'z'}]})).toThrow('UNCERTAINTY_ORIGIN_ROW:2');
});
