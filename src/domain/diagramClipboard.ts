import {createProject,id,schemaAtLeast,type DrawObject,type ProjectDocument} from './model';
import {anchorPixel,textRotation,type Coordinates} from './geometry';
import {validateProject} from './project';
const FORMAT='APIO_DIAGRAM_OBJECTS',rotations=new WeakMap<DrawObject[],Record<string,number>>();
/** Clipboard drawings carry no datasets or external point references. */
export function copyDiagramObjects(p:ProjectDocument,objects:DrawObject[],c:Coordinates):string{
 return JSON.stringify({format:FORMAT,version:1,rotations:Object.fromEntries(objects.map(o=>[o.id,textRotation(p,o.id)])),objects:objects.map(o=>({...o,anchors:o.anchors.map(a=>{if(a.mode==='page')return a;const at=anchorPixel(p,a,c);return{mode:'page',pageX:Math.max(0,Math.min(1,at.x/c.width)),pageY:Math.max(0,Math.min(1,at.y/c.height))}})}))});
}
export function pasteDiagramObjects(text:string):DrawObject[]|null{
 if(!text.trimStart().startsWith('{')||!text.slice(0,100).includes(FORMAT))return null;
 if(text.length>16*1024*1024)throw new Error('CLIPBOARD_OBJECT_LIMIT');
 const value=JSON.parse(text);if(value.format!==FORMAT||value.version!==1||!Array.isArray(value.objects)||!value.objects.length||value.objects.length>1000)throw new Error('CLIPBOARD_OBJECT_INVALID');
 const p=createProject();p.schemaVersion='1.3.0';p.objects=value.objects;if(validateProject(p).errors.length||p.objects.some(o=>o.anchors.some(a=>a.mode!=='page')))throw new Error('CLIPBOARD_OBJECT_INVALID');
 const objects=p.objects.map(o=>({...o,id:id(),anchors:o.anchors.map(a=>a.mode==='page'?{...a,pageX:Math.min(1,a.pageX+.015),pageY:Math.min(1,a.pageY+.015)}:a),...(o.table?{table:{...o.table,rows:o.table.rows.map(r=>({...r,id:id()})),columns:o.table.columns.map(c=>({...c,id:id()})),cells:o.table.cells.map(c=>({...c,id:id()}))}}:{})}));
 const angles:Record<string,number>={};for(let i=0;i<objects.length;i++){const angle=value.rotations?.[p.objects[i].id];if(angle===undefined)continue;if(typeof angle!=='number'||!Number.isFinite(angle)||Math.abs(angle)>360)throw new Error('CLIPBOARD_OBJECT_INVALID');if(angle)angles[objects[i].id]=angle}rotations.set(objects,angles);return objects;
}

export function appendDiagramObjects(p:ProjectDocument,objects:DrawObject[]):ProjectDocument{const angles=rotations.get(objects),old=p.extensions.textRotation;return{...p,schemaVersion:objects.some(o=>o.table)?schemaAtLeast(p.schemaVersion,objects.some(o=>o.table?.cells.some(c=>c.numberFormat))?'1.3.0':'1.2.0'):p.schemaVersion,objects:[...p.objects,...objects.map((o,i)=>({...o,zIndex:p.objects.reduce((n,o)=>Math.max(n,o.zIndex),0)+i+1}))],extensions:angles&&Object.keys(angles).length?{...p.extensions,textRotation:{...(old&&typeof old==='object'?old:{}),...angles}}:p.extensions}}
