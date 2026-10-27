import type {TableNumberFormat} from './tableNumberFormat';
import {makeDiagramTable,pasteTable,tableObject,tableTSV,type DiagramTable} from './diagramTable';
import {createProject,type TextPart} from './model';
import {validateProject} from './project';
export const TABLE_CELL_MIME='application/x-apio-table-cells';
export interface TableCellPayload {format:'APIO_TABLE_CELLS';version:1;rows:number;columns:number;cells:TextPart[][];formats?:(TableNumberFormat|null)[]}
export function copyTableCells(t:DiagramTable,first:number,last=first):{plain:string;rich:string}{
 const n=t.columns.length,r0=Math.min(Math.floor(first/n),Math.floor(last/n)),r1=Math.max(Math.floor(first/n),Math.floor(last/n)),c0=Math.min(first%n,last%n),c1=Math.max(first%n,last%n),cells:TextPart[][]=[],formats:(TableNumberFormat|null)[]=[];
 for(let r=r0;r<=r1;r++)for(let c=c0;c<=c1;c++){cells.push(t.cells[r*n+c].text);formats.push(t.cells[r*n+c].numberFormat??null)}
 return{plain:tableTSV(t,first,last),rich:JSON.stringify({format:'APIO_TABLE_CELLS',version:1,rows:r1-r0+1,columns:c1-c0+1,cells,formats} satisfies TableCellPayload)};
}
export function readTableCells(rich:string):TableCellPayload{
 if(rich.length>16*1024*1024)throw new Error('TABLE_SIZE_LIMIT');const p=JSON.parse(rich) as TableCellPayload;
 if(p.format!=='APIO_TABLE_CELLS'||p.version!==1||!Array.isArray(p.cells)||p.cells.length!==p.rows*p.columns)throw new Error('TABLE_INVALID_CLIPBOARD');
 if(p.formats&&(!Array.isArray(p.formats)||p.formats.length!==p.cells.length))throw new Error('TABLE_INVALID_CLIPBOARD');const table=makeDiagramTable(p.rows,p.columns);table.cells=table.cells.map((c,i)=>({...c,text:p.cells[i],...(p.formats?.[i]?{numberFormat:p.formats[i]!}:{})}));const doc=createProject();doc.schemaVersion='1.3.0';doc.objects=[tableObject([{mode:'page',pageX:0,pageY:0}],table)];if(validateProject(doc).errors.length)throw new Error('TABLE_INVALID_CLIPBOARD');return p;
}
export function pasteTableCells(t:DiagramTable,index:number,plain:string,rich:string,expand=false):DiagramTable{
 const payload=rich?readTableCells(rich):null,row=Math.floor(index/t.columns.length),column=index%t.columns.length;
 const text=payload?tableTSV({...makeDiagramTable(payload.rows,payload.columns),cells:payload.cells.map((text,i)=>({...t.cells[0],id:String(i),text}))}):plain;
 let next=pasteTable(t,row,column,text,expand);if(payload){const cells=[...next.cells];for(let r=0;r<payload.rows;r++)for(let c=0;c<payload.columns;c++){const at=(row+r)*next.columns.length+column+c;const from=r*payload.columns+c;cells[at]={...cells[at],text:payload.cells[from],...(payload.formats?.[from]?{numberFormat:payload.formats[from]!}:{})}}next={...next,cells}}return next;
}
