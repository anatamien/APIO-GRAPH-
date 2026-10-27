import {useSyncExternalStore} from 'react';
/** Transient cell selection is shared by the canvas and inspector, never saved as scientific data. */
export interface TableSelection {objectId:string;index:number;end:number}
let selection:TableSelection|null=null;
const listeners=new Set<()=>void>();
export const getTableSelection=()=>selection;
export function selectTableCells(objectId:string,index:number,end=index){
 if(selection?.objectId===objectId&&selection.index===index&&selection.end===end)return;
 selection={objectId,index,end};for(const listener of listeners)listener();
}
export function useTableSelection(){return useSyncExternalStore(listener=>{listeners.add(listener);return()=>listeners.delete(listener)},getTableSelection)}

export function clearTableCellSelection(){if(!selection)return;selection=null;for(const listener of listeners)listener()}
