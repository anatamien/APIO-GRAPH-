import type {ProjectDocument,XY} from '../../domain/model';
import type {Coordinates} from '../../domain/geometry';

export interface SeriesFrame {project:ProjectDocument;coordinates:Coordinates;min:number;max:number;yMin:number;yMax:number;margin:number}
/** Prepare a margin so a pan can expose neighbours without rebuilding the trace. */
export function seriesFrame(project:ProjectDocument,coordinates:Coordinates,margin=.5):SeriesFrame {
 const {xMin,xMax}=project.viewport,extra=(xMax/2-xMin/2)*(margin*2);
 const {yMin,yMax}=project.viewport,extraY=(yMax/2-yMin/2)*(margin*2);
 return {project,coordinates,margin,min:Math.max(-Number.MAX_VALUE,xMin-extra),max:Math.min(Number.MAX_VALUE,xMax+extra),yMin:Math.max(-Number.MAX_VALUE,yMin-extraY),yMax:Math.min(Number.MAX_VALUE,yMax+extraY)};
}
/** Only reuse an exact screen translation: zoom/format/size/data changes reprepare. */
export function seriesTranslation(frame:SeriesFrame,p:ProjectDocument,c:Coordinates):XY|null {
 const source=frame.project,base=frame.coordinates;
 if(source.datasets!==p.datasets||source.series!==p.series||source.calculations!==p.calculations||source.axes!==p.axes||source.extensions.lineBreaks!==p.extensions.lineBreaks||source.extensions.seriesInterpolation!==p.extensions.seriesInterpolation||source.editor.showPointMarkers!==p.editor.showPointMarkers||source.extensions.seriesMarkers!==p.extensions.seriesMarkers||base.width!==c.width||base.height!==c.height||base.left!==c.left||base.right!==c.right||base.top!==c.top||base.bottom!==c.bottom||p.viewport.xMin<frame.min||p.viewport.xMax>frame.max||p.viewport.yMin<frame.yMin||p.viewport.yMax>frame.yMax)return null;
 const x=c.x(source.viewport.xMin)-base.left,y=c.y(source.viewport.yMin)-base.bottom;
 // Guard roundoff at extreme ranges and reject every genuine scale change.
 if(!Number.isFinite(x)||!Number.isFinite(y)||Math.abs(c.x(source.viewport.xMax)-base.right-x)>1e-7||Math.abs(c.y(source.viewport.yMax)-base.top-y)>1e-7)return null;
 return {x,y};
}
