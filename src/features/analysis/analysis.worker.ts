import { MathError } from '../../domain/math';
import { calculatePreview, recomputeProject } from './operations';
import type { WorkerRequest, WorkerResponse } from './workerClient';
import {unpackCoordinates} from './pointBuffer';

const scope = self as unknown as {
  onmessage: ((event: MessageEvent<WorkerRequest>) => void) | null;
  postMessage: (response: WorkerResponse) => void;
};
scope.onmessage = ({ data }) => {
  try {
    if (data.type === 'preview') scope.postMessage({ requestId: data.requestId, type: 'preview', result: calculatePreview(data.kind,'coordinates'in data?unpackCoordinates(data.coordinates):data.points, data.parameters) });
    else scope.postMessage({ requestId: data.requestId, type: 'recompute', project: recomputeProject(data.project) });
  } catch (error) {
    scope.postMessage({ requestId: data.requestId, type: 'error', code: error instanceof MathError ? error.code : 'MATH_WORKER_FAILURE', details: error instanceof MathError ? error.details : {} });
  }
};
