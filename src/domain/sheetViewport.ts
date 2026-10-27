import type {ProjectDocument} from './model';
/** Earlier sheets stored a graph viewport that never moved their page objects. */
export function migrateSheetViewport(p:ProjectDocument):ProjectDocument{return p.extensions.documentMode==='sheet'&&p.extensions.sheetCanvasVersion!==1?{...p,viewport:{xMin:0,xMax:10,yMin:0,yMax:10},extensions:{...p.extensions,sheetCanvasVersion:1}}:p}
export function sheetFrame(p:ProjectDocument,width:number,height:number){const v=p.viewport;return p.extensions.documentMode==='sheet'?{x:v.xMin/10*width,y:(10-v.yMax)/10*height,width:(v.xMax-v.xMin)/10*width,height:(v.yMax-v.yMin)/10*height}:{x:0,y:0,width,height}}
export function canvasViewBox(p:ProjectDocument,width:number,height:number):string{const b=sheetFrame(p,width,height);return `${b.x} ${b.y} ${b.width} ${b.height}`}
