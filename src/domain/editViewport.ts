import type {ProjectDocument} from './model';
import {autoRange} from './geometry';

/** Appearance changes never navigate. Data edits follow auto axes only while the
 * corresponding view still follows its previous automatic range. F9 is explicit.
 */
export function editViewport(before:ProjectDocument,next:ProjectDocument,label:string):ProjectDocument{
 if(next===before||next.datasets===before.datasets||label==='ImportBatch')return next;
 const old=autoRange(before),range=autoRange(next),view={...next.viewport};
 for(const axis of ['x','y'] as const){
  const min=axis==='x'?'xMin':'yMin',max=axis==='x'?'xMax':'yMax';
  // autoRange is deterministic and JSON preserves these IEEE values exactly.
  // Any changed bound represents navigation, even at extreme offsets/scales.
  if(next.axes[axis].mode==='auto'&&before.viewport[min]===old[min]&&before.viewport[max]===old[max]){view[min]=range[min];view[max]=range[max]}
 }
 return Object.keys(view).every(k=>view[k as keyof typeof view]===next.viewport[k as keyof typeof view])?next:{...next,viewport:view};
}
