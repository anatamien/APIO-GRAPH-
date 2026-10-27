import {it,expect} from 'vitest';
import {prepareAlignment,alignObjects,unionBounds} from '../../src/domain/objectAlignment';
import {createProject,makeObject} from '../../src/domain/model';
import {tableObject,makeDiagramTable} from '../../src/domain/diagramTable';
import {createCoordinates,anchorPixel} from '../../src/domain/geometry';
import {fitContent} from '../../src/domain/fitContent';
import {validateProject,serialize,deserialize} from '../../src/domain/project';
import {id} from '../../src/domain/model';
import {writeWorkspace,readWorkspace} from '../../src/features/workspace/archive';
import {copyDiagramObjects,pasteDiagramObjects,appendDiagramObjects} from '../../src/domain/diagramClipboard';
import {renderSvg} from '../../src/features/export/svgRenderer';
it('legacy sheets ignore their former unused graph viewport in both APH containers without changing objects',async()=>{
 const p=createProject();p.schemaVersion='1.3.0';p.extensions.documentMode='sheet';p.viewport={xMin:100,xMax:110,yMin:-10,yMax:0};p.objects=[tableObject([{mode:'page',pageX:.2,pageY:.3}],makeDiagramTable())];const restored=deserialize(serialize(p)).project;expect(restored.viewport).toEqual({xMin:0,xMax:10,yMin:0,yMax:10});expect(restored.objects).toEqual(p.objects);expect(restored.extensions.sheetCanvasVersion).toBe(1);const tab=id(),archive=await readWorkspace(await writeWorkspace({id:id(),activeId:tab,tabs:[{id:tab,label:'Old sheet',project:p}]}));expect(archive.graph(tab).viewport).toEqual(restored.viewport);expect(archive.graph(tab).objects).toEqual(p.objects);
});
it('aligns mixed bounds by edges/centers and extends or inserts equal horizontal and vertical gaps',()=>{
 const box={left:300,right:400,top:20,bottom:80},others=[{left:0,right:100,top:20,bottom:80},{left:150,right:250,top:20,bottom:80}],plan=prepareAlignment(box,others,{x:1000,y:800});
 expect(alignObjects(plan,-147,3).dx).toBe(-150);const right=alignObjects(plan,4,0);expect(right.dx).toBe(0);expect(right.gaps).toHaveLength(2);expect(right.gaps.map(g=>g.distance)).toEqual([50,50]);
 const inserted=alignObjects(prepareAlignment({left:110,right:210,top:20,bottom:80},[{left:0,right:100,top:20,bottom:80},{left:300,right:400,top:20,bottom:80}],{x:1000,y:1000}),42,0);expect(inserted.dx).toBe(40);expect(inserted.gaps.map(g=>g.distance)).toEqual([50,50]);
 const vertical=prepareAlignment({left:20,right:80,top:302,bottom:402},[{left:20,right:80,top:0,bottom:100},{left:20,right:80,top:150,bottom:250}],{x:1000,y:1000});expect(alignObjects(vertical,0,0).dy).toBe(-2);expect(alignObjects(vertical,0,0).gaps.every(g=>g.axis==='y')).toBe(true);expect(unionBounds([box,...others])).toEqual({left:0,right:400,top:20,bottom:80});
});
it('a sheet fits data-anchored content beyond the original page, preserves old page anchors and scientific payloads',()=>{
 const p=createProject();p.schemaVersion='1.3.0';p.extensions.documentMode='sheet';p.extensions.sheetCanvasVersion=1;p.objects=[makeObject('text',[{mode:'data',x:-25,y:40}],'Outside'),tableObject([{mode:'page',pageX:.3,pageY:.4}],makeDiagramTable(2,2))];const c=createCoordinates(p,1200,800);expect(anchorPixel(p,p.objects[1].anchors[0],c)).toEqual({x:360,y:320});const view=fitContent(p,1200,800);expect(view.xMin).toBeLessThan(-25);expect(view.yMax).toBeGreaterThan(40);expect(validateProject({...p,viewport:view}).errors).toEqual([]);expect(deserialize(serialize({...p,viewport:view})).project.objects).toEqual(p.objects);expect(p.datasets).toHaveLength(0);
});
it('sheet clipboard uses the current camera and finite-view SVG preserves off-page text and table content',()=>{
 const p=createProject();p.schemaVersion='1.3.0';p.extensions={documentMode:'sheet',sheetCanvasVersion:1};p.viewport={xMin:20,xMax:30,yMin:-10,yMax:0};const a=makeObject('text',[{mode:'data',x:22,y:-2}],'Far text'),b=tableObject([{mode:'data',x:24,y:-4}],makeDiagramTable(2,2));p.objects=[a,b];const copy=pasteDiagramObjects(copyDiagramObjects(p,p.objects,createCoordinates(p,1200,800)))!,target={...p,viewport:{xMin:-40,xMax:-30,yMin:20,yMax:30},objects:[]},next=appendDiagramObjects(target,copy);expect(next.objects[0].anchors[0]).toEqual({mode:'data',x:-37.85,y:27.85});expect(next.objects[1].anchors[0]).toEqual({mode:'data',x:-35.85,y:25.85});expect(validateProject(next).errors).toEqual([]);const svg=renderSvg(p,{width:1200,height:800});expect(svg).toContain('viewBox="2400 800 1200 800"');expect(svg).toContain('Far text');expect(svg).not.toContain('data-axis-label');expect(p.objects[0]).toBe(a);expect(p.objects[1]).toBe(b);
});
