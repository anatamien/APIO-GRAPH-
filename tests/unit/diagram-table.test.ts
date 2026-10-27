import {it,expect} from 'vitest';
import {makeDiagramTable,tableObject,resizeTableStructure,pasteTable,mergeTable,validateTable,layoutTable,tableTSV} from '../../src/domain/diagramTable';
import {createProject,id} from '../../src/domain/model';
import {validateProject,serialize,deserialize} from '../../src/domain/project';
import {History} from '../../src/domain/commands';
import {writeWorkspace,readWorkspace} from '../../src/features/workspace/archive';
it('strict tables are separate objects in schema 1.2 and round-trip all cells/IDs without any dataset',async()=>{
 const p=createProject();p.schemaVersion='1.2.0';const table=pasteTable(makeDiagramTable(),0,0,'ΔH\tμV\n−0\t2',false);table.cells[0].text=[{text:'H',baseline:'normal',bold:true,italic:false},{text:'2',baseline:'sub',bold:false,italic:false}];p.objects=[tableObject([{mode:'page',pageX:.1,pageY:.1},{mode:'page',pageX:.7,pageY:.5}],table)];expect(validateProject(p).errors).toEqual([]);expect(deserialize(serialize(p)).project.objects).toEqual(p.objects);const tab=id(),a=await readWorkspace(await writeWorkspace({id:id(),activeId:tab,tabs:[{id:tab,label:'Table',project:p}]}));expect(a.graph(tab).objects).toEqual(p.objects);expect(a.graph(tab).datasets).toEqual([]);expect(validateProject({...p,schemaVersion:'1.1.0'}).errors.length).toBeGreaterThan(0);
});
it('limits and reference validation reject oversized grids, duplicate IDs and overlapping/out of bounds merges',()=>{
 expect(()=>makeDiagramTable(51,20)).toThrow();expect(()=>makeDiagramTable(50,21)).toThrow();const t=makeDiagramTable(50,20);expect(t.cells).toHaveLength(1000);expect(validateTable(t)).toEqual([]);expect(validateTable({...t,cells:t.cells.slice(1)})).toContain('TABLE_CELL_COUNT');const p=createProject();p.schemaVersion='1.2.0';p.objects=[tableObject([{mode:'page',pageX:0,pageY:0},{mode:'page',pageX:1,pageY:1}],{...t,padding:Infinity})];expect(validateProject(p).errors.length).toBeGreaterThan(0);const merged=mergeTable(t,0,0,2,2);expect(()=>mergeTable(merged,1,1,2,2)).toThrow();expect(()=>mergeTable(t,49,19,2,2)).toThrow();
});
it('paste expands only explicitly and merges keep hidden values; row/column insertion preserves stable cells',()=>{
 const t=makeDiagramTable(1,1);expect(()=>pasteTable(t,0,0,'A\tB\nC\tD',false)).toThrow('TABLE_PASTE_EXPAND');const pasted=pasteTable(t,0,0,'A\tB\nC\tD',true);expect(tableTSV(pasted)).toBe('A\tB\nC\tD');const merged=mergeTable(pasted,0,0,2,2);expect(merged.cells).toBe(pasted.cells);expect(tableTSV({...merged,merges:[]})).toBe('A\tB\nC\tD');const inserted=resizeTableStructure(pasted,'rows',1);expect(inserted.cells[0].id).toBe(pasted.cells[0].id);expect(inserted.cells[4].id).toBe(pasted.cells[2].id);expect(tableTSV(resizeTableStructure(inserted,'rows',1,true))).toBe(tableTSV(pasted));
});
it('committed table edits undo once and layout is reused for placements and every pan frame',()=>{
 const p=createProject();p.schemaVersion='1.2.0';p.objects=[tableObject([{mode:'page',pageX:0,pageY:0},{mode:'page',pageX:.8,pageY:.8}],makeDiagramTable(50,20))];const h=new History(p),o=p.objects[0],layout=layoutTable(o.table!,o.style);for(let i=0;i<100;i++)expect(layoutTable(o.table!,o.style)).toBe(layout);h.execute('EditObject',q=>({...q,objects:[{...o,table:pasteTable(o.table!,0,0,'Scientific Δ μ',false)}]}));h.undo();expect(h.current).toBe(p);h.redo();expect(h.current.objects[0].table!.cells[0].text[0].text).toBe('Scientific Δ μ');expect(h.current.datasets).toBe(p.datasets);
});
