import {it,expect} from 'vitest';
import {ownXYOrigin} from '../fixtures/origin';
import {originColumnUses} from '../../src/features/origin/columnMeaning';
import {makeDiagramTable,tableObject} from '../../src/domain/diagramTable';
it('derives display meanings only from resolved curve references and never changes stored column roles',async()=>{
 const o=await ownXYOrigin(),before=structuredClone(o.model),uses=originColumnUses(o.model,'utf-8');expect(uses.get('x')).toHaveLength(2);expect(uses.get('x')?.every(u=>u.label==='Time'&&u.axis==='x')).toBe(true);expect(uses.get('y')?.[0].label).toBe('Signal');expect(o.model).toEqual(before);
});
it('new diagram tables start with thin grid and frame without changing existing table data',()=>{const table=makeDiagramTable();expect(table.grid.widthPt).toBe(.35);expect(tableObject([{mode:'page',pageX:0,pageY:0}],table).style.strokeWidthPt).toBe(.4)});
