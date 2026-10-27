import { MathError } from '../../domain/math';
import { calculatePreview } from './operations';
import {executeRecomputeJob} from './recalculation';
import type { WorkerRequest, WorkerResponse } from './workerClient';
import {packCoordinates,unpackCoordinates} from './pointBuffer';
import {packPeaks} from './signalBuffer';
import {displayPoints} from '../chart/displayPoints';

const scope = self as unknown as {
  onmessage: ((event: MessageEvent<WorkerRequest>) => void) | null;
  postMessage: (response: WorkerResponse,transfer?:Transferable[]) => void;
};
scope.onmessage = ({ data }) => {
  try {
    if (data.type === 'preview') {
      const input='coordinates'in data?unpackCoordinates(data.coordinates):data.points,result=calculatePreview(data.kind,input,data.parameters,'coordinates'in data?(data.referenceCoordinates?unpackCoordinates(data.referenceCoordinates):undefined):data.reference);if(data.kind==='peak-fit'){result.points=displayPoints(result.points,4096);result.plot={source:displayPoints(input as typeof result.points,4096),fit:result.points}}
      // Scalar integration previews need only a display outline; the integral
      // has already used every original knot inside the Worker.
      if(data.kind==='area'&&result.points.length>4096)result.points=displayPoints(result.points,4096);
      if(result.points.length>10000||result.companion||result.data){
        const outputs=result.outputs?.map(output=>({output:output.output,componentIndex:output.componentIndex,coordinates:packCoordinates(output.points)})),coordinates=packCoordinates(result.points),companion=result.companion?packCoordinates(result.companion):undefined,peaks=result.data?.peaks?packPeaks(result.data.peaks):undefined;
        // Initial indexing of two million-point preview lines must also stay
        // outside the UI thread. Full numerical outputs are transferred intact.
        const plot:{baseline?:Float64Array;corrected?:Float64Array;fit?:Float64Array;source?:Float64Array}|undefined=result.plot?.fit?{fit:packCoordinates(result.plot.fit),source:packCoordinates(result.plot.source??[])}:data.kind==='baseline'&&result.points.length>4096?{
          ...(data.parameters.output==='both'||data.parameters.output==='baseline'?{baseline:packCoordinates(displayPoints(result.points,4096))}:{corrected:packCoordinates(displayPoints(result.points,4096))}),
          ...(result.companion?{corrected:packCoordinates(displayPoints(result.companion,4096))}:{}),
        }:undefined;
        scope.postMessage({type:'preview-packed',requestId:data.requestId,coordinates,companion,peaks,plot,data:result.data?.peakFit?{peakFit:result.data.peakFit}:undefined,outputs,summary:result.summary},[coordinates.buffer,...(outputs?.map(output=>output.coordinates.buffer)??[]),...(companion?[companion.buffer]:[]),...(peaks?[peaks.buffer]:[]),...(plot?.baseline?[plot.baseline.buffer]:[]),...(plot?.corrected?[plot.corrected.buffer]:[]),...(plot?.fit?[plot.fit.buffer]:[]),...(plot?.source?[plot.source.buffer]:[])]);
      }else scope.postMessage({requestId:data.requestId,type:'preview',result});
    }
    else {
      const patches=executeRecomputeJob(data.job),transfer:Transferable[]=[];
      for(const patch of patches){if(patch.coordinates)transfer.push(patch.coordinates.buffer);if(patch.indices)transfer.push(patch.indices.buffer);if(patch.peakValues)transfer.push(patch.peakValues.buffer)}
      scope.postMessage({ requestId: data.requestId, type: 'recomputed', patches },transfer);
    }
  } catch (error) {
    scope.postMessage({ requestId: data.requestId, type: 'error', code: error instanceof MathError ? error.code : 'MATH_WORKER_FAILURE', details: error instanceof MathError ? error.details : {} });
  }
};
