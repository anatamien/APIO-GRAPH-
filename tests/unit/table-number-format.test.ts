import {it,expect} from 'vitest';
import {formatDecimal,tableDisplayText} from '../../src/domain/tableNumberFormat';
import {makeDiagramTable,pasteTable,tableObject,layoutTable,tableTSV} from '../../src/domain/diagramTable';
import {createProject} from '../../src/domain/model';
import {serialize,deserialize,validateProject} from '../../src/domain/project';
import {copyTableCells,pasteTableCells} from '../../src/domain/tableClipboard';
it('decimal-string rounding keeps exact ties, large coefficients, sign, zero padding and scientific carry',()=>{
 for(const [text,digits,expected]of [['1.005',2,'1.01'],['-1.005',2,'-1.01'],['12345678901234567890.125',2,'12345678901234567890.13'],['8,7',3,'8,700'],['-0.0001',2,'-0.00'],['1e-10',12,'0.000000000100']] as const)expect(formatDecimal(text,{mode:'fixed',digits})).toBe(expected);
 expect(formatDecimal('9.999',{mode:'scientific',digits:2})).toBe('1.00e+1');expect(formatDecimal('0,0012',{mode:'scientific',digits:3})).toBe('1,200e-3');expect(formatDecimal('0',{mode:'scientific',digits:2})).toBe('0.00e+0');
});
it('formats a value ± uncertainty while retaining original records and chemical/rich labels',()=>{
 const t=pasteTable(makeDiagramTable(1,2),0,0,'40,52 ± 3,39\tH2O',false),parts=t.cells[0].text,format={mode:'fixed' as const,digits:1};expect(tableDisplayText(parts,format).map(p=>p.text).join('')).toBe('40,5 ± 3,4');expect(parts[0].text).toBe('40,52 ± 3,39');expect(tableDisplayText(t.cells[1].text,format)).toBe(t.cells[1].text);t.cells[0].numberFormat=format;const object=tableObject([]),layout=layoutTable(t,object.style);expect(layout.cells[0].runs.map(p=>p.text).join('')).toBe('40,5 ± 3,4');expect(tableTSV(t)).toBe('40,5 ± 3,4\tH2O');const p=createProject();p.schemaVersion='1.3.0';p.objects=[tableObject([{mode:'page',pageX:0,pageY:0}],t)];expect(validateProject(p).errors).toEqual([]);expect(deserialize(serialize(p)).project.objects[0].table!.cells[0].text).toEqual(parts);const copied=copyTableCells(t,0,1),pasted=pasteTableCells(makeDiagramTable(1,2),0,copied.plain,copied.rich);expect(pasted.cells[0].text).toEqual(parts);expect(pasted.cells[0].numberFormat).toEqual(format);
});
