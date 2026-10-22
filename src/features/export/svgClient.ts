import type {ProjectDocument} from '../../domain/model';
import type {RenderOptions} from '../chart/ChartScene';
import {renderProject} from './previewProject';
export async function buildSvg(project:ProjectDocument,options:RenderOptions,signal:AbortSignal):Promise<string>{
 signal.throwIfAborted();
 project=renderProject(project);
 if(typeof Worker==='undefined'){const {renderSvg}=await import('./svgRenderer');signal.throwIfAborted();return renderSvg(project,options)}
 return new Promise((resolve,reject)=>{
  const worker=new Worker(new URL('./svg.worker.ts',import.meta.url),{type:'module'});
  const clean=()=>{worker.terminate();signal.removeEventListener('abort',abort)};
  const abort=()=>{clean();reject(new DOMException('Export cancelled','AbortError'))};
  signal.addEventListener('abort',abort,{once:true});
  worker.onmessage=(event:MessageEvent<{svg?:string;error?:string}>)=>{clean();if(event.data.error)reject(new Error(event.data.error));else if(typeof event.data.svg==='string')resolve(event.data.svg);else reject(new Error('EXPORT_FAILED'))};
  worker.onerror=event=>{clean();reject(new Error(event.message||'EXPORT_FAILED'))};
  try{worker.postMessage({project,options})}catch(error){clean();reject(error)}
 });
}
