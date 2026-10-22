import type { CalculationKind, ProjectDocument } from '../../domain/model';
import { MathError, type CalculationResult, type XY } from '../../domain/math';
import {packCoordinates} from './pointBuffer';
export type AnalysisRequest = { type: 'preview'; kind: CalculationKind; points: readonly XY[]; parameters: Record<string, unknown> } | { type: 'recompute'; project: ProjectDocument };
export type WorkerRequest = (AnalysisRequest & { requestId: number })|{type:'preview';requestId:number;kind:CalculationKind;parameters:Record<string,unknown>;coordinates:Float64Array};
export type WorkerSuccess = { requestId: number; type: 'preview'; result: CalculationResult } | { requestId: number; type: 'recompute'; project: ProjectDocument };
export type WorkerResponse = WorkerSuccess | { requestId: number; type: 'error'; code: string; details: Record<string, number | string> };
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
      worker.onmessage = event => {
        const response = event.data;
        if (response.requestId !== requestId) return;
        if (response.type === 'error') finish(undefined, new MathError(response.code, response.details));
        else finish(response);
      };
      worker.onerror = event => { event.preventDefault?.(); finish(undefined, new MathError('MATH_WORKER_FAILURE')); };
      try {
        if(request.type==='preview'&&request.points.length>10000){const coordinates=packCoordinates(request.points);worker.postMessage({type:'preview',kind:request.kind,parameters:request.parameters,requestId,coordinates},[coordinates.buffer])}
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
