import type {ProjectDocument} from './model';
/** Foreign calculation outputs are editable observations, never executable APIO calculations. */
export function importedSnapshot(p:ProjectDocument,datasetId:string):boolean{
 const value=p.extensions.importedSnapshots;return !!value&&typeof value==='object'&&Object.hasOwn(value,datasetId);
}
