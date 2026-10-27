import type { CalculationKind, ProjectDocument,Point } from '../../domain/model';
import { MathError, type CalculationResult, type XY } from '../../domain/math';
import {packCoordinates,unpackCoordinates} from './pointBuffer';
import {applyCalculationPatches,createRecomputeJob,type RecomputeJob,type NumericPatch,type CalculationPatch} from './recalculation';
import {dependencyIndex} from '../../domain/dependencies';
import {peakFromBuffer} from './signalBuffer';
import type {PeakMeasurement} from '../../domain/signalTypes';
export type AnalysisRequest = { type: 'preview'; kind: CalculationKind; points: readonly XY[]; parameters: Record<string, unknown>;reference?:readonly XY[] } | { type: 'recompute'; project: ProjectDocument; targets?:readonly string[] };
export type WorkerRequest = (Extract<AnalysisRequest,{type:'preview'}> & { requestId: number })|{type:'recompute';requestId:number;job:RecomputeJob}|{type:'preview';requestId:number;kind:CalculationKind;parameters:Record<string,unknown>;coordinates:Float64Array;referenceCoordinates?:Float64Array};
export type WorkerSuccess = { requestId: number; type: 'preview'; result: CalculationResult } | { requestId: number; type: 'recompute'; project: ProjectDocument; patches?:CalculationPatch[] };
export type WorkerResponse = WorkerSuccess | {requestId:number;type:'recomputed';patches:NumericPatch[]} | {requestId:number;type:'preview-packed';coordinates:Float64Array;companion?:Float64Array;peaks?:Float64Array;plot?:{baseline?:Float64Array;corrected?:Float64Array};summary:CalculationResult['summary']} | { requestId: number; type: 'error'; code: string; details: Record<string, number | string> };
const yieldTask=()=>new Promise<void>(resolve=>{const channel=new MessageChannel();channel.port1.onmessage=()=>{channel.port1.close();channel.port2.close();resolve()};channel.port2.postMessage(null)});
export interface AnalysisWorker {
  onmessage: ((event: MessageEvent<WorkerResponse>) => void) | null;
  onerror: ((event: ErrorEvent) => void) | null;
  postMessage(request:WorkerRequest):void;
  postMessage(request:WorkerRequest,transfer:Transferable[]):void;
  terminate: () => void;
}
export class AnalysisWorkerClient {
  private generation = 0;
  private active?: { worker: AnalysisWorker; requestId: number; reject: (error: Error) => void };
  constructor(private readonly factory: () => AnalysisWorker = () => new Worker(new URL('./analysis.worker.ts', import.meta.url), { type: 'module' })) {}
  run(request: AnalysisRequest): Promise<WorkerSuccess> {
    this.cancel();
    const requestId = ++this.generation;
    return new Promise((resolve, reject) => {
      let worker: AnalysisWorker;
      try { worker = this.factory(); }
      catch { reject(new MathError('MATH_WORKER_FAILURE')); return; }
      this.active = { worker, requestId, reject };
      const finish = (response?: WorkerSuccess, error?: Error) => {
        if (this.generation !== requestId || this.active?.requestId !== requestId) return;
        worker.onmessage = null;
        worker.onerror = null;
        worker.terminate();
        this.active = undefined;
        if (error) reject(error); else resolve(response!);
      };
      worker.onmessage = async event => {
        const response = event.data;
        if (response.requestId !== requestId) return;
        const check=()=>{if(this.generation!==requestId)throw new DOMException('Calculation cancelled','AbortError')};
        const peaks=async(values:Float64Array):Promise<PeakMeasurement[]>=>{const result=new Array<PeakMeasurement>(values.length/10);let start=performance.now();for(let i=0;i<result.length;i++){result[i]=peakFromBuffer(values,i);if((i&2047)===0&&performance.now()-start>3){await yieldTask();check();start=performance.now()}}return result};
        const coordinates=async(values:Float64Array):Promise<Point[]>=>{
          const result=new Array<Point>(values.length/2);let start=performance.now();
          for(let i=0;i<result.length;i++){const source=request.type==='preview'?request.points[i]:undefined,keep=source&&source.x===values[i*2]&&'id'in source&&typeof source.id==='string';result[i]={x:values[i*2],y:values[i*2+1],id:keep?source.id as string:crypto.randomUUID()};if((i&4095)===0&&performance.now()-start>3){await yieldTask();check();start=performance.now()}}return result;
        };
        if(response.type==='preview-packed'){
          try{const result:CalculationResult={points:await coordinates(response.coordinates),summary:response.summary};if(response.companion)result.companion=await coordinates(response.companion);if(response.peaks)result.data={peaks:await peaks(response.peaks)};if(response.plot)result.plot={...(response.plot.baseline?{baseline:unpackCoordinates(response.plot.baseline)}:{}),...(response.plot.corrected?{corrected:unpackCoordinates(response.plot.corrected)}:{})};check();finish({type:'preview',requestId,result})}catch(error){if((error as Error)?.name!=='AbortError')finish(undefined,new MathError('MATH_WORKER_FAILURE'))}
        }
        else if(response.type==='recomputed'&&request.type==='recompute'){
          try{
            const index=dependencyIndex(request.project),patches:CalculationPatch[]=[];let sliceStart=performance.now();
            for(const patch of response.patches){
              const previous=patch.datasetId?index.datasets.get(patch.datasetId)?.points:undefined;
              const points=patch.coordinates?new Array<import('../../domain/model').Point>(patch.coordinates.length/2):undefined;
              if(points&&patch.coordinates&&patch.indices)for(let i=0;i<points.length;i++){
                points[i]={x:patch.coordinates[i*2],y:patch.coordinates[i*2+1],id:patch.indices[i]>=0?previous![patch.indices[i]].id:crypto.randomUUID()};
                if((i&4095)===0&&performance.now()-sliceStart>3){await yieldTask();if(this.generation!==requestId)return;sliceStart=performance.now()}
              }
              const calculation=patch.peakValues?{...patch.calculation,data:{peaks:await peaks(patch.peakValues)}}:patch.calculation;
              check();patches.push({calculation,datasetId:patch.datasetId,points});
            }
            finish({requestId,type:'recompute',project:applyCalculationPatches(request.project,request.project,patches),patches});
          }catch{finish(undefined,new MathError('MATH_WORKER_FAILURE'))}
        }
        else if (response.type === 'error') finish(undefined, new MathError(response.code, response.details));
        else if(response.type==='recomputed')finish(undefined,new MathError('MATH_WORKER_FAILURE'));
        else finish(response);
      };
      worker.onerror = event => { event.preventDefault?.(); finish(undefined, new MathError('MATH_WORKER_FAILURE')); };
      try {
        if(request.type==='recompute'){
          const job=createRecomputeJob(request.project,request.targets),transfer=[...job.sources.map(d=>d.coordinates.buffer),...job.previous.map(d=>d.x.buffer)];
          worker.postMessage({type:'recompute',requestId,job},transfer);
        }
        else if(request.type==='preview'&&(request.points.length>10000||(request.reference?.length??0)>10000)){const coordinates=packCoordinates(request.points),referenceCoordinates=request.reference?packCoordinates(request.reference):undefined;worker.postMessage({type:'preview',kind:request.kind,parameters:request.parameters,requestId,coordinates,referenceCoordinates},[coordinates.buffer,...(referenceCoordinates?[referenceCoordinates.buffer]:[])])}
        else worker.postMessage({ ...request, requestId });
      }
      catch(error) { finish(undefined, error instanceof MathError?error:new MathError('MATH_WORKER_FAILURE')); }
    });
  }
  cancel(): void {
    this.generation++;
    if (!this.active) return;
    const { worker, reject } = this.active;
    this.active = undefined;
    worker.onmessage = null;
    worker.onerror = null;
    worker.terminate();
    reject(new DOMException('Calculation cancelled', 'AbortError'));
  }
}
