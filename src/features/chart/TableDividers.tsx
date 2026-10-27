import type {DrawObject} from '../../domain/model';
import {layoutTable} from '../../domain/diagramTable';
export function TableDividers({object:o,x,y}:{object:DrawObject;x:number;y:number}){
 if(!o.table||o.locked)return null;const t=o.table,l=layoutTable(t,o.style),sx=(o.geometry.widthPx??l.width)/l.width,sy=(o.geometry.heightPx??l.height)/l.height;let column=0,row=0;
 return <g stroke="transparent" strokeWidth={8} fill="none">{t.columns.slice(0,-1).map((c,i)=>{column+=c.size;const at=x+column*sx;return <line className="table-divider" pointerEvents="stroke" key={'c'+i} data-handle={`column-${i}`} x1={at} x2={at} y1={y} y2={y+l.height*sy} cursor="col-resize"/>})}{t.rows.slice(0,-1).map((r,i)=>{row+=r.size;const at=y+row*sy;return <line className="table-divider" pointerEvents="stroke" key={'r'+i} data-handle={`row-${i}`} x1={x} x2={x+l.width*sx} y1={at} y2={at} cursor="row-resize"/>})}</g>;
}
