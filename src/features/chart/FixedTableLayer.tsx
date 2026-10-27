import {canvasViewBox} from '../../domain/sheetViewport';
import {TableCellSelection} from './TableCellSelection';
import {TableDividers} from './TableDividers';
import {memo,useMemo,type MutableRefObject,type PointerEvent,type MouseEvent} from 'react';
import type {DrawObject,ProjectDocument} from '../../domain/model';
import {createCoordinates,anchorPixel} from '../../domain/geometry';
import {layoutTable} from '../../domain/diagramTable';
import {ObjectGeometry} from './ChartScene';
export const isFixedTable=(o:DrawObject)=>o.type==='table'&&o.zIndex>=0&&o.anchors.every(a=>a.mode==='page');
export interface TableLayerEvents {down:(e:PointerEvent<SVGSVGElement>)=>void;move:(e:PointerEvent<SVGSVGElement>)=>void;up:(e:PointerEvent<SVGSVGElement>)=>void;double:(e:MouseEvent<SVGSVGElement>)=>void;cancel:()=>void}
/** A separate compositor surface keeps page-fixed table text out of every plot repaint. */
export const FixedTableLayer=memo(function FixedTableLayer({project:p,width,height,selection,editable,events}:{project:ProjectDocument;width:number;height:number;selection:string[];editable:boolean;events:MutableRefObject<TableLayerEvents>}){
 const c=useMemo(()=>createCoordinates(p,width,height),[p,width,height]);
 return <svg className="fixed-table-layer" width="100%" height="100%" viewBox={canvasViewBox(p,width,height)} onPointerDown={e=>events.current.down(e)} onPointerMove={e=>events.current.move(e)} onPointerUp={e=>events.current.up(e)} onPointerCancel={()=>events.current.cancel()} onDoubleClick={e=>events.current.double(e)} onMouseDown={e=>{if(e.button===1)e.preventDefault()}} onAuxClick={e=>{if(e.button===1)e.preventDefault()}}>
  {[...p.objects].filter(o=>o.visible).sort((a,b)=>a.zIndex-b.zIndex).map(o=>{const a=anchorPixel(p,o.anchors[0],c),layout=layoutTable(o.table!,o.style),w=o.geometry.widthPx??layout.width,h=o.geometry.heightPx??layout.height;return <g key={o.id} pointerEvents="visiblePainted"><g data-target={`object:${o.id}`} data-object={o.id}><ObjectGeometry p={p} o={o} c={c}/></g>{editable&&selection.includes(`object:${o.id}`)&&<g data-target={`object:${o.id}`} data-selected-object={o.id} fill="#FFFFFF" stroke="#476E98" strokeWidth="1.4"><TableCellSelection object={o} x={a.x} y={a.y}/><TableDividers object={o} x={a.x} y={a.y}/>{[[a.x,a.y],[a.x+w,a.y],[a.x+w,a.y+h],[a.x,a.y+h],[a.x+w/2,a.y+h/2]].map(([x,y],i)=><rect key={i} data-handle={i===4?'center':`corner-${i}`} x={x-4} y={y-4} width={8} height={8} cursor={o.locked?'default':i===4?'move':i%2?'nesw-resize':'nwse-resize'}/>)}</g>}</g>})}
 </svg>;
});
