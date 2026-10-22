import {renderSvg} from './svgRenderer';
import type {ProjectDocument} from '../../domain/model';
import type {RenderOptions} from '../chart/ChartScene';
const scope=self as unknown as {onmessage:((e:MessageEvent<{project:ProjectDocument;options:RenderOptions}>)=>void)|null;postMessage:(result:{svg?:string;error?:string})=>void};
scope.onmessage=({data})=>{try{scope.postMessage({svg:renderSvg(data.project,data.options)})}catch(error){scope.postMessage({error:String(error)})}};
