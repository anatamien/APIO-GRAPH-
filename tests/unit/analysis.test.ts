import { describe, expect, it } from 'vitest';
import { addPairs, createProject, makeObject, type CalculationKind, type ProjectDocument } from '../../src/domain/model';
import { editPoint } from '../../src/domain/commands';
import { resolveAnchor } from '../../src/domain/geometry';
import { validateProject } from '../../src/domain/project';
import { addCalculation, calculatePreview, recomputeProject } from '../../src/features/analysis/operations';
import { AnalysisWorkerClient, type AnalysisWorker, type WorkerRequest, type WorkerResponse } from '../../src/features/analysis/workerClient';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { AnalysisPanel } from '../../src/features/analysis/AnalysisPanel';
import { translate } from '../../src/app/i18n';

const initial = () => addPairs(createProject(), [{ x: 0, y: 1 }, { x: 1, y: 3 }, { x: 2, y: 5 }], 'Input');
function add(p: ProjectDocument, kind: CalculationKind, parameters = {}, source = p.series[0].id) {
  const dataset = p.datasets.find(d => d.id === p.series.find(s => s.id === source)!.datasetId)!;
  return addCalculation(p, source, kind, parameters, calculatePreview(kind, dataset.points, parameters), kind);
}

describe('MTH calculated series lifecycle', () => {
  it('PRJ rejects a valid result that depends on an outdated or invalid parent',()=>{
    let p=add(initial(),'linear-fit');p=add(p,'derivative',{sort:true},p.series[1].id);
    for(const status of ['outdated','invalid'] as const){p.calculations[0].status=status;expect(validateProject(p).errors.some(e=>e.includes('STALE_DEPENDENCY'))).toBe(true)}
    p.calculations[1].status='outdated';expect(validateProject(p).errors).toEqual([]);
  });
  it('renders operation, source, parameter, and calculation controls without creating history', () => {
    const project = initial();
    let changes = 0;
    const markup = renderToStaticMarkup(createElement(AnalysisPanel, { project, onChange: () => { changes++; }, t: translate('en'), onClose: () => {} }));
    expect(markup).toContain('Source series');
    expect(markup).toContain('Input');
    expect(markup).toContain('Savitzky–Golay');
    expect(markup).toContain('Retain observations (OLS)');
    expect(markup).toContain('Calculate');
    expect(changes).toBe(0);
  });

  it('MTH-T15 preview and cancellation leave source project/history untouched', () => {
    const p = initial(), original = structuredClone(p);
    const result = calculatePreview('linear-fit', p.datasets[0].points, {});
    expect(result.summary.a).toBeCloseTo(2, 12);
    expect(p).toEqual(original);
    expect(p.calculations).toHaveLength(0);
  });

  it('records reproducible parameters and one schema-valid derived series', () => {
    const p = initial(), q = add(p, 'linear-fit');
    expect(q.datasets).toHaveLength(2);
    expect(q.series).toHaveLength(2);
    expect(q.calculations[0]).toMatchObject({ kind: 'linear-fit', status: 'valid', algorithmVersion: 1, sourceDatasetIds: [p.datasets[0].id], parameters: { sourceSeriesIds: [p.series[0].id] } });
    expect(typeof q.calculations[0].parameters.calculatedAt).toBe('string');
    expect(q.datasets[1]).toMatchObject({ role: 'derived', source: { kind: 'calculation', calculationId: q.calculations[0].id } });
    expect(validateProject(q).errors).toEqual([]);
    expect(p.calculations).toHaveLength(0);
  });

  it('stores scalar integral/statistics without duplicating the source curve', () => {
    for (const kind of ['integral', 'statistics'] as const) {
      const p = initial(), q = add(p, kind);
      expect(q.datasets).toHaveLength(1);
      expect(q.series).toHaveLength(1);
      expect(q.calculations[0].resultDatasetId).toBeNull();
      expect(validateProject(q).errors).toEqual([]);
    }
  });

  it('selects rows explicitly with one-based inclusive indices', () => {
    const points = [{ x: 0, y: 100 }, { x: 1, y: 3 }, { x: 2, y: 5 }, { x: 3, y: -100 }];
    expect(calculatePreview('linear-fit', points, { rowRange: [2, 3] }).summary.a).toBeCloseTo(2, 12);
    expect(() => calculatePreview('statistics', points, { rowRange: [0, 2] })).toThrow('MATH_ROW_RANGE');
    expect(() => calculatePreview('statistics', points, { rowRange: [2, 8] })).toThrow('MATH_ROW_RANGE');
  });

  it('MTH-T14 recomputes dependencies in topological order and preserves linked point IDs', () => {
    let p = add(initial(), 'linear-fit');
    p = add(p, 'derivative', {}, p.series[1].id);
    const derived = p.datasets[2], target = derived.points[100];
    p.objects.push(makeObject('marker', [{ mode: 'point', datasetId: derived.id, pointId: target.id, fallbackX: target.x, fallbackY: target.y, offsetXpx: 0, offsetYpx: 0 }]));
    for (const point of p.datasets[0].points) p = editPoint(p, p.datasets[0].id, point.id, { x: point.x, y: 4 * point.x + 3 });
    p = { ...p, calculations: [...p.calculations].reverse() };
    const q = recomputeProject(p);
    expect(q.calculations.every(c => c.status === 'valid')).toBe(true);
    expect(q.datasets[2].points[100].id).toBe(target.id);
    expect(resolveAnchor(q, q.objects[0].anchors[0]).y).toBeCloseTo(4, 9);
    expect(q.objects[0].anchors[0]).toMatchObject({ mode: 'point', pointId: target.id, fallbackY: expect.closeTo(4, 9) });
    expect(validateProject(q).errors).toEqual([]);
  });

  it('retains last results on calculation failure and invalidates dependent calculations', () => {
    let p = add(initial(), 'exponential-fit');
    p = add(p, 'statistics', {}, p.series[1].id);
    const old = structuredClone(p.datasets[1].points);
    p = editPoint(p, p.datasets[0].id, p.datasets[0].points[0].id, { x: 0, y: 0 });
    const q = recomputeProject(p);
    expect(q.calculations.map(c => c.status)).toEqual(['invalid', 'invalid']);
    expect(q.calculations[0].summary.errorCode).toBe('MATH_POSITIVE_Y');
    expect(q.calculations[1].summary.errorCode).toBe('MATH_DEPENDENCY_INVALID');
    expect(q.datasets[1].points).toEqual(old);
  });

  it('keeps linked last results invalid when a changed fit grid would remove their anchors', () => {
    let p = add(initial(), 'linear-fit');
    const d = p.datasets[1], point = d.points[1];
    p.objects.push(makeObject('marker', [{ mode: 'point', datasetId: d.id, pointId: point.id, fallbackX: point.x, fallbackY: point.y, offsetXpx: 0, offsetYpx: 0 }]));
    p = editPoint(p, p.datasets[0].id, p.datasets[0].points[0].id, { x: -1, y: 1 });
    const q = recomputeProject(p);
    expect(q.calculations[0].status).toBe('invalid');
    expect(q.calculations[0].summary.errorCode).toBe('MATH_ANCHORED_RESULT_SHAPE');
    expect(q.datasets[1].points).toEqual(d.points);
    expect(q.objects[0].anchors[0]).toMatchObject({ mode: 'point', pointId: point.id });
  });
});

class FakeWorker implements AnalysisWorker {
  onmessage: ((event: MessageEvent<WorkerResponse>) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;
  requests: WorkerRequest[] = [];
  terminated = false;
  postMessage(request: WorkerRequest) { this.requests.push(request); }
  terminate() { this.terminated = true; }
  respond(response: WorkerResponse) { this.onmessage?.(new MessageEvent('message', { data: response })); }
}

describe('MTH cancellable worker client', () => {
  const request = { type: 'preview' as const, kind: 'statistics' as const, points: [{ x: 1, y: 2 }], parameters: {} };
  it('terminates the previous worker and ignores its queued response', async () => {
    const workers: FakeWorker[] = [];
    const client = new AnalysisWorkerClient(() => { const worker = new FakeWorker(); workers.push(worker); return worker; });
    const first = client.run(request);
    const cancelled = expect(first).rejects.toMatchObject({ name: 'AbortError' });
    const staleHandler = workers[0].onmessage;
    const second = client.run(request);
    expect(workers[0].terminated).toBe(true);
    staleHandler?.(new MessageEvent<WorkerResponse>('message', { data: { requestId: workers[0].requests[0].requestId, type: 'preview', result: { points: [], summary: { n: 100 } } } }));
    workers[1].respond({ requestId: workers[1].requests[0].requestId, type: 'preview', result: { points: [], summary: { n: 1 } } });
    await cancelled;
    expect(await second).toMatchObject({ type: 'preview', result: { summary: { n: 1 } } });
    expect(workers[1].terminated).toBe(true);
  });

  it('cancels immediately and turns worker failures into stable math errors', async () => {
    const workers: FakeWorker[] = [];
    const client = new AnalysisWorkerClient(() => { const worker = new FakeWorker(); workers.push(worker); return worker; });
    const first = client.run(request);
    const cancelled = expect(first).rejects.toMatchObject({ name: 'AbortError' });
    client.cancel();
    await cancelled;
    expect(workers[0].terminated).toBe(true);
    const second = client.run(request);
    workers[1].respond({ requestId: workers[1].requests[0].requestId, type: 'error', code: 'MATH_DUPLICATE_X', details: { pointIndex: 2 } });
    await expect(second).rejects.toMatchObject({ code: 'MATH_DUPLICATE_X', details: { pointIndex: 2 } });
  });
});
