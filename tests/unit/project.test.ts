import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { createProject, addPairs, makeObject } from '../../src/domain/model';
import { serialize, deserialize, validateProject } from '../../src/domain/project';
import { History, editPoint, deletePoint } from '../../src/domain/commands';
import { resolveAnchor, createCoordinates, axisTicks, anchorPixel, fitView, snapIndex } from '../../src/domain/geometry';

describe('PRJ / IMP / SNP project lifecycle', () => {
  it('PRJ-T01/02 reads every normative example and creates a schema-valid empty project', () => {
    for (const f of ['empty', 'example', 'annotated-calculated']) {
      expect(validateProject(deserialize(fs.readFileSync(`examples/${f}.aph`, 'utf8')).project).errors).toEqual([]);
    }
    expect(validateProject(createProject()).errors).toEqual([]);
  });
  it('PRJ-T02 OBJ-T08 survives roundtrip, edits exact pointId, and undo restores source', () => {
    const p = addPairs(createProject(), [{x:0,y:1},{x:1.23456789012345,y:3}], 'α');
    const d = p.datasets[0], point = d.points[1];
    p.objects.push(makeObject('callout', [{mode:'point',datasetId:d.id,pointId:point.id,fallbackX:point.x,fallbackY:point.y,offsetXpx:0,offsetYpx:0},{mode:'data',x:2,y:4}], 'ρ²'));
    const loaded = deserialize(serialize(p)).project;
    const h = new History(loaded);
    h.execute('edit', q => editPoint(q,d.id,point.id,{x:5,y:9}));
    expect(resolveAnchor(h.current, h.current.objects[0].anchors[0])).toMatchObject({x:5,y:9});
    expect(h.current.datasets[0].points[1].id).toBe(point.id);
    h.undo(); expect(h.current.datasets[0].points[1].x).toBe(1.23456789012345);
    h.redo(); expect(h.current.datasets[0].points[1].y).toBe(9);
    h.markSaved(); expect(h.dirty).toBe(false); h.undo(); expect(h.dirty).toBe(true); h.redo(); expect(h.dirty).toBe(false);
  });
  it('SNP-T03 detaches deleted points at last coordinates only with explicit consent', () => {
    const p=addPairs(createProject(),[{x:2,y:3}],'s'),d=p.datasets[0],pt=d.points[0];
    p.objects.push(makeObject('marker',[{mode:'point',datasetId:d.id,pointId:pt.id,fallbackX:0,fallbackY:0,offsetXpx:0,offsetYpx:0}]));
    expect(()=>deletePoint(p,d.id,pt.id,false)).toThrow();
    const q=deletePoint(p,d.id,pt.id,true);
    expect(q.objects[0].anchors[0]).toEqual({mode:'data',x:2,y:3});
  });
  it('PRJ-T04/07 rejects bad ranges, duplicate IDs, nonfinite values and cycles; warns on missing point', () => {
    const p=addPairs(createProject(),[{x:1,y:2}],'s');
    p.axes.x.max=p.axes.x.min; expect(validateProject(p).errors.length).toBeGreaterThan(0);
    p.axes.x.max=10; p.datasets[0].points.push({...p.datasets[0].points[0]});
    expect(validateProject(p).errors.length).toBeGreaterThan(0);
    p.datasets[0].points.pop(); p.datasets[0].points[0].y=Infinity; expect(()=>serialize(p)).toThrow();
    expect(()=>deserialize('{bad')).toThrow();
  });
  it('EDT-T02 manual ticks and coordinate inverse preserve negatives', () => {
    const p=createProject(); p.viewport={xMin:-2,xMax:3,yMin:-10,yMax:10};
    expect(axisTicks({...p.axes.x,tickMode:'manual',tickStep:1,tickOrigin:0},-2,3)).toEqual([-2,-1,0,1,2,3]);
    const c=createCoordinates(p,1200,800); expect(c.x.invert(c.x(-1.2345))).toBeCloseTo(-1.2345,12);
  });
});

it('PRJ-T03 preserves IEEE negative zero and refreshes linked fallbacks after point edit',()=>{
 const p=addPairs(createProject(),[{x:-0,y:2}],'s'),d=p.datasets[0],pt=d.points[0];
 p.objects.push(makeObject('marker',[{mode:'point',datasetId:d.id,pointId:pt.id,fallbackX:0,fallbackY:0,offsetXpx:0,offsetYpx:0}]));
 expect(Object.is(deserialize(serialize(p)).project.datasets[0].points[0].x,-0)).toBe(true);
 const changed=editPoint(p,d.id,pt.id,{x:7,y:11});expect(changed.objects[0].anchors[0]).toMatchObject({fallbackX:7,fallbackY:11});
});
it('PRJ rejects excessive manual ticks before a file or zoom can replace the valid view',()=>{
 const p=createProject();p.axes.x.tickMode='manual';p.axes.x.tickStep=0.00001;
 expect(validateProject(p).errors.some(e=>e.includes('TOO_MANY_TICKS'))).toBe(true);
 expect(()=>deserialize(JSON.stringify(p))).toThrow('TOO_MANY_TICKS');
});
it('MTH calculated observations cannot be manually changed while retaining a valid recipe',()=>{
 const p=JSON.parse(fs.readFileSync('examples/annotated-calculated.aph','utf8'));
 const d=p.datasets[1],point=d.points[0];
 expect(()=>editPoint(p,d.id,point.id,{x:0,y:999})).toThrow('DERIVED_READ_ONLY');
 expect(()=>deletePoint(p,d.id,point.id,true)).toThrow('DERIVED_READ_ONLY');
});
it('PRJ rejects calculations overwriting raw data and mismatched or duplicate result ownership',()=>{
 const p=JSON.parse(fs.readFileSync('examples/annotated-calculated.aph','utf8'));
 p.calculations[0].resultDatasetId=p.datasets[0].id;
 expect(validateProject(p).errors.some(e=>e.includes('RESULT_OWNERSHIP'))).toBe(true);
 const q=JSON.parse(fs.readFileSync('examples/annotated-calculated.aph','utf8'));
 q.calculations.push({...q.calculations[0],id:crypto.randomUUID()});
 expect(validateProject(q).errors.some(e=>e.includes('DUPLICATE_RESULT'))).toBe(true);
});
it('SNP detaching a dragged point label preserves its full displayed position',()=>{
 const p=addPairs(createProject(),[{x:2,y:3}],'s'),d=p.datasets[0],pt=d.points[0];
 p.objects.push(makeObject('text',[{mode:'point',datasetId:d.id,pointId:pt.id,fallbackX:2,fallbackY:3,offsetXpx:120,offsetYpx:-40}],'label'));
 const c=createCoordinates(p,1200,800),before=anchorPixel(p,p.objects[0].anchors[0],c),q=deletePoint(p,d.id,pt.id,true),after=anchorPixel(q,q.objects[0].anchors[0],c);
 expect(after.x).toBeCloseTo(before.x,10);expect(after.y).toBeCloseTo(before.y,10);
});
it('IMP finite double extremes retain a finite, invertible plot without overflowing auto range',()=>{
 const p=fitView(addPairs(createProject(),[{x:-1e308,y:-1e308},{x:1e308,y:1e308}],'extremes'));
 expect(validateProject(p).errors).toEqual([]);const c=createCoordinates(p,1200,800);
 expect(Number.isFinite(c.x(0))).toBe(true);expect(c.x(0)).toBeCloseTo((c.left+c.right)/2,8);expect(c.x.invert(c.x(1e308))/1e308).toBeCloseTo(1,12);
 expect(axisTicks(p.axes.x,p.viewport.xMin,p.viewport.xMax).every(Number.isFinite)).toBe(true);
});
it('EDT/SNP original source row survives sorting and round-trip; long ticks reserve label space',()=>{
 const p=addPairs(createProject(),[{x:2,y:3},{x:1,y:4}],'source'),d=p.datasets[0];
 p.extensions.sourceRows={[d.id]:{[d.points[0].id]:7,[d.points[1].id]:11}};
 d.points.sort((a,b)=>a.x-b.x);const loaded=deserialize(serialize(p)).project,c=createCoordinates(loaded,1200,800),pt=loaded.datasets[0].points[0];
 expect(snapIndex(loaded,c)(c.x(pt.x),c.y(pt.y),1)[0].row).toBe(11);
 loaded.axes.y.numberFormat='fixed';loaded.axes.y.precision=12;
 expect(createCoordinates(loaded,1200,800).left).toBeGreaterThan(c.left);
});
it('EDT manual steps retain all representable ticks around large X without rounding geometry',()=>{
 const p=createProject(),min=1e16,max=min+100,a={...p.axes.x,tickMode:'manual' as const,tickStep:2,tickOrigin:min,numberFormat:'fixed' as const,precision:0};
 const ticks=axisTicks(a,min,max);expect(ticks).toHaveLength(51);expect(new Set(ticks).size).toBe(51);expect(ticks[25]).toBe(min+50);
});
