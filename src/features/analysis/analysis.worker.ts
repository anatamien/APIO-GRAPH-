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
      const result=calculatePreview(data.kind,'coordinates'in data?unpackCoordinates(data.coordinates):data.points,data.parameters,'coordinates'in data?(data.referenceCoordinates?unpackCoordinates(data.referenceCoordinates):undefined):data.reference);
      // Scalar integration previews need only a display outline; the integral
      // has already used every original knot inside the Worker.
      if(data.kind==='area'&&result.points.length>4096)result.points=displayPoints(result.points,4096);
      if(result.points.length>10000||result.companion||result.data){
        const coordinates=packCoordinates(result.points),companion=result.companion?packCoordinates(result.companion):undefined,peaks=result.data?.peaks?packPeaks(result.data.peaks):undefined;
        // Initial indexing of two million-point preview lines must also stay
        // outside the UI thread. Full numerical outputs are transferred intact.
        const plot:{baseline?:Float64Array;corrected?:Float64Array}|undefined=data.kind==='baseline'&&result.points.length>4096?{
          ...(data.parameters.output==='both'||data.parameters.output==='baseline'?{baseline:packCoordinates(displayPoints(result.points,4096))}:{corrected:packCoordinates(displayPoints(result.points,4096))}),
          ...(result.companion?{corrected:packCoordinates(displayPoints(result.companion,4096))}:{}),
        }:undefined;
        scope.postMessage({type:'preview-packed',requestId:data.requestId,coordinates,companion,peaks,plot,summary:result.summary},[coordinates.buffer,...(companion?[companion.buffer]:[]),...(peaks?[peaks.buffer]:[]),...(plot?.baseline?[plot.baseline.buffer]:[]),...(plot?.corrected?[plot.corrected.buffer]:[])]);
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
