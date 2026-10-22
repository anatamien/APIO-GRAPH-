import { id, makeSeries, type Anchor, type Calculation, type CalculationKind, type Dataset, type Point, type ProjectDocument } from '../../domain/model';
import { calculate, MathError, type CalculationResult, type XY } from '../../domain/math';

export function calculatePreview(kind: CalculationKind, points: readonly XY[], parameters: Record<string, unknown>): CalculationResult {
  let selected = points;
  if (parameters.rowRange !== undefined) {
    const rows = parameters.rowRange;
    if (!Array.isArray(rows) || rows.length !== 2 || rows.some(n => typeof n !== 'number' || !Number.isInteger(n)) || rows[0] < 1 || rows[1] < rows[0] || rows[1] > points.length) throw new MathError('MATH_ROW_RANGE');
    selected = points.slice(rows[0] - 1, rows[1]);
  }
  return calculate(kind, selected, parameters);
}

export function addCalculation(project: ProjectDocument, sourceSeriesId: string, kind: CalculationKind, parameters: Record<string, unknown>, result: CalculationResult, name: string): ProjectDocument {
  const source = project.series.find(s => s.id === sourceSeriesId);
  const dataset = project.datasets.find(d => d.id === source?.datasetId);
  if (!source || !dataset) throw new MathError('MATH_SOURCE_MISSING');
  if (project.calculations.some(c => c.resultDatasetId === dataset.id && c.status !== 'valid')) throw new MathError('MATH_DEPENDENCY_INVALID');
  const calculationId = id();
  const scalar = kind === 'integral' || kind === 'statistics';
  const resultDatasetId = scalar ? null : id();
  const calculation: Calculation = {
    id: calculationId, kind, sourceDatasetIds: [dataset.id], resultDatasetId,
    parameters: { ...structuredClone(parameters), sourceSeriesIds: [sourceSeriesId], calculatedAt: new Date().toISOString() },
    summary: { ...result.summary }, status: 'valid', algorithmVersion: 1,
  };
  if (scalar) return { ...project, calculations: [...project.calculations, calculation] };
  const derived: Dataset = {
    id: resultDatasetId!, name, role: 'derived', source: { kind: 'calculation', calculationId },
    points: result.points.map(p => ({ x: p.x, y: p.y, id: id() })),
  };
  const series = makeSeries(derived.id, name, project.series.length);
  series.mode = 'line';
  series.style.markerVisible = false;
  return { ...project, calculations: [...project.calculations, calculation], datasets: [...project.datasets, derived], series: [...project.series, series] };
}

function topologicalOrder(calculations: readonly Calculation[]): Calculation[] {
  const producers = new Map(calculations.filter(c => c.resultDatasetId).map(c => [c.resultDatasetId!, c]));
  const visited = new Set<string>();
  const active = new Set<string>();
  const result: Calculation[] = [];
  function visit(calculation: Calculation) {
    if (active.has(calculation.id)) throw new MathError('MATH_DEPENDENCY_CYCLE');
    if (visited.has(calculation.id)) return;
    active.add(calculation.id);
    for (const source of calculation.sourceDatasetIds) { const parent = producers.get(source); if (parent) visit(parent); }
    active.delete(calculation.id);
    visited.add(calculation.id);
    result.push(calculation);
  }
  calculations.forEach(visit);
  return result;
}

function preservePointIds(previous: readonly Point[], points: readonly XY[], kind: CalculationKind): Point[] {
  const observations = kind === 'savitzky-golay' || kind === 'moving-average' || kind === 'derivative';
  if (observations && previous.length === points.length) return points.map((p, i) => ({ ...p, id: previous[i].id }));
  const byX = new Map<number, Point[]>();
  for (const point of previous) {
    const group = byX.get(point.x);
    if (group) group.push(point); else byX.set(point.x, [point]);
  }
  return points.map(p => ({ ...p, id: byX.get(p.x)?.shift()?.id ?? id() }));
}

/** Computes a complete replacement snapshot; the UI applies it as one history entry. */
export function recomputeProject(project: ProjectDocument): ProjectDocument {
  const order = topologicalOrder(project.calculations);
  const calculations = new Map(project.calculations.map(c => [c.id, { ...c }]));
  const datasets = new Map(project.datasets.map(d => [d.id, d]));
  const producers = new Map(project.calculations.filter(c => c.resultDatasetId).map(c => [c.resultDatasetId!, c.id]));
  const dirty = new Set(project.calculations.filter(c => c.status !== 'valid').map(c => c.id));
  for (const c of order) if (c.sourceDatasetIds.some(source => dirty.has(producers.get(source) ?? ''))) dirty.add(c.id);
  if (!dirty.size) return project;
  const anchors = [...project.objects.flatMap(o => o.anchors), project.legend.anchor];
  const attempt = new Date().toISOString();
  for (const original of order) {
    if (!dirty.has(original.id)) continue;
    const current = calculations.get(original.id)!;
    try {
      const sources = original.sourceDatasetIds.map(source => {
        const producer = producers.get(source);
        if (producer && calculations.get(producer)?.status !== 'valid') throw new MathError('MATH_DEPENDENCY_INVALID');
        const dataset = datasets.get(source);
        if (!dataset) throw new MathError('MATH_SOURCE_MISSING');
        return dataset;
      });
      const result = calculatePreview(original.kind, sources.flatMap(d => d.points), original.parameters);
      if (original.resultDatasetId) {
        const previous = datasets.get(original.resultDatasetId);
        if (!previous) throw new MathError('MATH_RESULT_MISSING');
        if (previous.role !== 'derived' || previous.source.kind !== 'calculation' || previous.source.calculationId !== original.id) throw new MathError('MATH_RESULT_OWNERSHIP');
        const points = preservePointIds(previous.points, result.points, original.kind);
        const surviving = new Set(points.map(p => p.id));
        if (anchors.some(a => a.mode === 'point' && a.datasetId === previous.id && !surviving.has(a.pointId))) throw new MathError('MATH_ANCHORED_RESULT_SHAPE');
        datasets.set(previous.id, { ...previous, points });
      }
      calculations.set(original.id, { ...current, status: 'valid', summary: { ...result.summary }, parameters: { ...current.parameters, calculatedAt: attempt }, algorithmVersion: 1 });
    } catch (error) {
      const code = error instanceof MathError ? error.code : 'MATH_WORKER_FAILURE';
      calculations.set(original.id, { ...current, status: 'invalid', summary: { ...current.summary, errorCode: code }, parameters: { ...current.parameters, lastAttemptAt: attempt } });
    }
  }
  const refresh = (anchor: Anchor): Anchor => {
    if (anchor.mode !== 'point') return anchor;
    const point = datasets.get(anchor.datasetId)?.points.find(p => p.id === anchor.pointId);
    return point ? { ...anchor, fallbackX: point.x, fallbackY: point.y } : anchor;
  };
  return { ...project, calculations: project.calculations.map(c => calculations.get(c.id)!), datasets: project.datasets.map(d => datasets.get(d.id)!), objects: project.objects.map(o => ({ ...o, anchors: o.anchors.map(refresh) })), legend: { ...project.legend, anchor: refresh(project.legend.anchor) } };
}
