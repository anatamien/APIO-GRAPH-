import type {DrawObject} from '../../domain/model';
import {layoutTable} from '../../domain/diagramTable';
import {useTableSelection} from './tableSelection';
export function TableCellSelection({object:o,x,y}:{object:DrawObject;x:number;y:number}){
 const s=useTableSelection();if(!o.table||s?.objectId!==o.id)return null;
 const t=o.table,n=t.columns.length,l=layoutTable(t,o.style),sx=(o.geometry.widthPx??l.width)/l.width,sy=(o.geometry.heightPx??l.height)/l.height;
 const r0=Math.min(Math.floor(s.index/n),Math.floor(s.end/n)),r1=Math.max(Math.floor(s.index/n),Math.floor(s.end/n)),c0=Math.min(s.index%n,s.end%n),c1=Math.max(s.index%n,s.end%n);
 return <g className="table-cell-selection" pointerEvents="none" fill="#476E98" fillOpacity=".10" stroke="#476E98" strokeWidth="1.3">{l.cells.filter(c=>{const r=Math.floor(c.index/n),col=c.index%n,m=t.merges.find(m=>m.row===r&&m.column===col);return r<=r1&&r+(m?.rows??1)>r0&&col<=c1&&col+(m?.columns??1)>c0}).map(c=><rect key={c.index} data-selected-cell={c.index} x={x+c.x*sx+1} y={y+c.y*sy+1} width={Math.max(0,c.width*sx-2)} height={Math.max(0,c.height*sy-2)}/>)}</g>;
}
