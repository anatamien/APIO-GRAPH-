import type {ProjectDocument} from '../../domain/model';
import {plotAreas,areaProject} from '../../domain/plotAreas';
import {ChartScene,type RenderOptions} from './ChartScene';
export const isPageObject=(o:ProjectDocument['objects'][number])=>o.anchors.every(a=>a.mode==='page');
export function PageScene({p,...options}:{p:ProjectDocument}&RenderOptions){
 const layout=plotAreas(p);if(!layout)return <ChartScene p={p} {...options}/>;
 return <>{!options.transparent&&<rect width={options.width} height={options.height} fill={options.colorMode==='strict-bw'?'#FFFFFF':p.page.background}/>}{layout.areas.map(a=>{const part=areaProject(p,a);return <g key={a.id} data-plot-area={a.id}><ChartScene p={{...part,objects:part.objects.filter(o=>!isPageObject(o))}} {...options} transparent includeLegend={false}/><ChartScene p={part} {...options} transparent includeObjects={false} includeAxes={false} includeSeries={false}/></g>})}<ChartScene p={{...p,objects:p.objects.filter(isPageObject)}} {...options} transparent includeSeries={false} includeAxes={false} includeLegend={false}/></>;
}
