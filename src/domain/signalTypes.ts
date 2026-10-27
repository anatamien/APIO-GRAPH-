/** Full numerical peak results. Display thinning never changes this table. */
export interface PeakMeasurement {
 index:number;
 x:number;
 y:number;
 direction:'max'|'min';
 prominence:number|null;
 width:number|null;
 left:number|null;
 right:number|null;
 level:number|null;
 incomplete:boolean;
}
export interface ScientificData {peaks?:PeakMeasurement[];peakFit?:import('./math/peakFit').PeakFitData}
export interface CalculationDisplay {visible:boolean;stroke:string;opacity:number;label:boolean}
