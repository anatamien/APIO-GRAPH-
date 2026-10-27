import {memo} from 'react';
import type {DiagramTable} from '../../domain/diagramTable';
import {layoutTable} from '../../domain/diagramTable';
import type {DrawObject} from '../../domain/model';
import {outputColor,dashArray,type ColorMode} from './ChartScene';
export const DiagramTableGeometry=memo(function DiagramTableGeometry({table,style,mode}:{table:DiagramTable;style:DrawObject['style'];mode:ColorMode}){
 const layout=layoutTable(table,style),color=(value:string)=>outputColor(value,mode),fill=(value:string)=>mode==='strict-bw'?'#FFFFFF':color(value);
 return <g data-diagram-table="true" fontFamily="Courier New">
  {layout.cells.map(cell=><g key={cell.index} data-table-cell={cell.index}><rect x={cell.x} y={cell.y} width={cell.width} height={cell.height} fill={fill(cell.fill)} fillOpacity={mode==='strict-bw'?1:table.fillOpacity} pointerEvents="all"/><text pointerEvents="none" fill={color(cell.color)} style={{whiteSpace:'pre'}}>{cell.runs.map((run,i)=><tspan key={i} x={run.x} y={run.y} fontSize={run.size} fontWeight={run.bold?'bold':undefined} fontStyle={run.italic?'italic':undefined}>{run.text}</tspan>)}</text></g>)}
  {table.grid.visible&&<path d={layout.lines.filter(l=>l.x1===l.x2?table.grid.vertical:table.grid.horizontal).map(l=>`M${l.x1} ${l.y1}L${l.x2} ${l.y2}`).join('')} fill="none" stroke={color(table.grid.color)} strokeWidth={table.grid.widthPt*4/3} strokeDasharray={dashArray[table.grid.dash]}/>}
  <rect width={layout.width} height={layout.height} fill="none" stroke={color(style.stroke)} strokeWidth={style.strokeWidthPt*4/3} strokeOpacity={mode==='strict-bw'?1:style.strokeOpacity} strokeDasharray={dashArray[style.dash]}/>
 </g>;
});
