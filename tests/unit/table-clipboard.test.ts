import {it,expect} from 'vitest';
import {makeDiagramTable,tableObject} from '../../src/domain/diagramTable';
import {copyTableCells,pasteTableCells,readTableCells} from '../../src/domain/tableClipboard';
import {copyDiagramObjects,pasteDiagramObjects,appendDiagramObjects} from '../../src/domain/diagramClipboard';
import {createProject} from '../../src/domain/model';
import {createCoordinates,textRotation} from '../../src/domain/geometry';
it('copies every cell of the full supported grid, including rich indices, without a viewport selection limit',()=>{
 const source=makeDiagramTable(50,20);source.cells=source.cells.map((cell,i)=>({...cell,text:[{text:String(i),baseline:i%2?'sub':'super',bold:i%3===0,italic:false}]}));const payload=copyTableCells(source,999,0);expect(readTableCells(payload.rich).cells.length).toBe(1000);const target=makeDiagramTable(50,20),pasted=pasteTableCells(target,0,payload.plain,payload.rich);expect(pasted.cells.map(c=>c.text)).toEqual(source.cells.map(c=>c.text));expect(pasted.cells.map(c=>c.id)).toEqual(target.cells.map(c=>c.id));expect(pasted.rows).toBe(target.rows);expect(pasted.columns).toBe(target.columns);
});
it('requires approval before expanding and rejects malformed rich clipboard text',()=>{
 const source=makeDiagramTable(2,2),payload=copyTableCells(source,0,3),target=makeDiagramTable(1,1);expect(()=>pasteTableCells(target,0,payload.plain,payload.rich)).toThrow('TABLE_PASTE_EXPAND');expect(pasteTableCells(target,0,payload.plain,payload.rich,true).cells).toHaveLength(4);const bad=JSON.parse(payload.rich);bad.cells[0]=[{text:'A',baseline:'invalid',bold:false,italic:false}];expect(()=>readTableCells(JSON.stringify(bad))).toThrow('TABLE_INVALID_CLIPBOARD');
});
it('object copies keep rotation and appearance, replace all identities and preserve destination measurements',()=>{
 const p=createProject(),o=tableObject([{mode:'page',pageX:.2,pageY:.2}]);p.schemaVersion='1.2.0';p.objects=[o];p.extensions.textRotation={[o.id]:25};const text=copyDiagramObjects(p,[o],createCoordinates(p,1200,800)),objects=pasteDiagramObjects(text)!,target=createProject(),result=appendDiagramObjects(target,objects);expect(result.datasets).toBe(target.datasets);expect(objects[0].id).not.toBe(o.id);expect(objects[0].table!.cells[0].id).not.toBe(o.table!.cells[0].id);expect(objects[0].table!.cells[0].text).toEqual(o.table!.cells[0].text);expect(textRotation(result,objects[0].id)).toBe(25);expect(textRotation(p,o.id)).toBe(25);expect(pasteDiagramObjects('1\t2')).toBeNull();
});
