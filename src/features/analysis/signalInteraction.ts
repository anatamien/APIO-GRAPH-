import type {XY} from '../../domain/model';
import type {PeakMeasurement} from '../../domain/signalTypes';
export interface SignalInteraction {
 mode:'nodes'|'background'|'range'|'none';
 sourceDatasetId:string;
 baselineDatasetId?:string;
 orderParameters?:Record<string,unknown>;
 nodes?:readonly XY[];
 range?:readonly [number,number];
 preview?:{baseline?:readonly XY[];corrected?:readonly XY[];peaks?:readonly PeakMeasurement[];region?:{upper:readonly XY[];lower:readonly XY[]}};
 highlight?:XY;
 onPick?:(point:XY)=>void;
 onMove?:(index:number,point:XY)=>void;
}
/** UI-only bridge. Editing a field updates the draft SVG layer, never the
 * scientific scene or project history. Heavy arrays are shared by reference. */
export class SignalInteractionStore {
 private value:SignalInteraction|null=null;
 private listeners=new Set<()=>void>();
 getSnapshot=()=>this.value;
 subscribe=(listener:()=>void)=>{this.listeners.add(listener);return()=>{this.listeners.delete(listener)}};
 set(value:SignalInteraction|null){if(value===this.value)return;this.value=value;for(const listener of this.listeners)listener()}
}
