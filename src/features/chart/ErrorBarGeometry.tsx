import {memo,useMemo} from 'react';
import type {Dataset,Series,Viewport} from '../../domain/model';
import type {Coordinates} from '../../domain/geometry';
import {defaultErrorBars,pointUncertainty,uncertaintyExtent} from '../../domain/uncertainty';
import {visibleMarkerPoints} from './displayPoints';
export const ErrorBarGeometry=memo(function ErrorBarGeometry({dataset:d,series:s,coordinates:c,view,screen,margin,budget,color}:{dataset:Dataset;series:Series;coordinates:Coordinates;view:Viewport;screen:boolean;margin:number;budget:number;color:string}){
 const st=defaultErrorBars(s),paths=useMemo(()=>{
  if(!st.x&&!st.y)return [];
  if(!d.uncertainty&&!s.uncertainty&&!s.errorBars){const extent=uncertaintyExtent(d.points);if(!extent.xCount&&!extent.yCount)return []}
  const points=screen?visibleMarkerPoints(d.points,view.xMin,view.xMax,budget,margin,[view.yMin,view.yMax]):d.points,result:string[]=[];let path='',count=0;
  const cap=st.capSizePt*2/3,segment=(x1:number,y1:number,x2:number,y2:number)=>{if([x1,y1,x2,y2].every(Number.isFinite))path+=`M${x1} ${y1}L${x2} ${y2}`};
  for(const p of points){const x=c.x(p.x),y=c.y(p.y),dx=st.x?pointUncertainty(d,p,'x',s):undefined,dy=st.y?pointUncertainty(d,p,'y',s):undefined;
   if(dx&&dx>0){const a=c.x(p.x-dx),b=c.x(p.x+dx);segment(a,y,b,y);if(cap){segment(a,y-cap,a,y+cap);segment(b,y-cap,b,y+cap)}}
   if(dy&&dy>0){const a=c.y(p.y-dy),b=c.y(p.y+dy);segment(x,a,x,b);if(cap){segment(x-cap,a,x+cap,a);segment(x-cap,b,x+cap,b)}}
   if(++count%256===0&&path){result.push(path);path=''}
  }if(path)result.push(path);return result;
 },[d.points,d.uncertainty,s.uncertainty,s.errorBars,st.x,st.y,st.capSizePt,c,view,screen,margin,budget]);
 if(!paths.length)return null;
 return <g data-error-bars={s.id} fill="none" stroke={color} strokeWidth={st.widthPt*4/3} pointerEvents="none">{paths.map((path,i)=><path key={i} d={path}/>)}</g>;
});
