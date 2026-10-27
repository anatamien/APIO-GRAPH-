import {fitPeaks,peakFitOutput,type PeakFitData} from '../../domain/math/peakFit';
import { id, makeSeries, PROJECT_SCHEMA_VERSION, schemaAtLeast, type Anchor, type Calculation, type CalculationKind, type Dataset, type Point, type ProjectDocument } from '../../domain/model';
import { calculate, MathError, type CalculationResult, type XY } from '../../domain/math';
import {dependencyIndex,datasetUnits} from '../../domain/dependencies';
import {baseline,findSignalPeaks,integrateSignal} from '../../domain/math/signals';

export function calculatePreview(kind: CalculationKind, points: readonly XY[], parameters: Record<string, unknown>,reference?:readonly XY[]): CalculationResult {
  let selected = points;
  if (parameters.rowRange !== undefined) {
    const rows = parameters.rowRange;
    if (!Array.isArray(rows) || rows.length !== 2 || rows.some(n => typeof n !== 'number' || !Number.isInteger(n)) || rows[0] < 1 || rows[1] < rows[0] || rows[1] > points.length) throw new MathError('MATH_ROW_RANGE');
    selected = points.slice(rows[0] - 1, rows[1]);
  }
  if(kind==='peak-fit')return fitPeaks(selected,parameters);
  if(kind==='peak-fit-output'){const fit=parameters.fit as PeakFitData;if(!fit||fit.version!==1)throw new MathError('PEAK_FIT_RESULT_MISSING');if(parameters.output==='all')return{points:peakFitOutput(selected,fit,'sum'),summary:{n:fit.n,sse:fit.sse,rmse:fit.rmse,rSquared:fit.rSquared,iterations:fit.iterations,conditionEstimate:fit.condition,method:fit.method,parameterUncertainty:'not-estimated-no-noise-model'},data:{peakFit:fit},outputs:[...fit.components.map((_,componentIndex)=>({output:'component' as const,componentIndex,points:peakFitOutput(selected,fit,'component',componentIndex)})),{output:'residual',points:peakFitOutput(selected,fit,'residual')},...(fit.baseline.mode!=='none'?[{output:'baseline' as const,points:peakFitOutput(selected,fit,'baseline')}]:[])]};if(!['component','residual','baseline'].includes(String(parameters.output)))throw new MathError('PEAK_FIT_COMPONENT');return{points:peakFitOutput(selected,fit,parameters.output as 'component'|'residual'|'baseline',Number(parameters.componentIndex??0)),summary:{n:fit.n}}}
  if(kind==='baseline')return baseline(selected,parameters);
  if(kind==='peaks')return findSignalPeaks(selected,parameters);
  if(kind==='area')return integrateSignal(selected,parameters,reference);
  return calculate(kind, selected, parameters);
}

export function addCalculation(project: ProjectDocument, sourceSeriesId: string, kind: CalculationKind, parameters: Record<string, unknown>, result: CalculationResult, name: string): ProjectDocument {
  const source = project.series.find(s => s.id === sourceSeriesId);
  const dataset = project.datasets.find(d => d.id === (source?.datasetId??sourceSeriesId.replace(/^dataset:/,'')));
  if (!dataset) throw new MathError('MATH_SOURCE_MISSING');
  if (project.calculations.some(c => c.resultDatasetId === dataset.id && c.status !== 'valid')) throw new MathError('MATH_DEPENDENCY_INVALID');
  const calculationId = id();
  const scalar = kind === 'integral' || kind === 'statistics' || kind==='peaks' || kind==='area';
  const baselineId=kind==='area'&&typeof parameters.baselineDatasetId==='string'?parameters.baselineDatasetId:undefined;
  if(baselineId&&!project.datasets.some(d=>d.id===baselineId))throw new MathError('MATH_SOURCE_MISSING');
  const resultDatasetId = scalar ? null : id();
  const calculation: Calculation = {
    id: calculationId, kind, sourceDatasetIds: baselineId&&baselineId!==dataset.id?[dataset.id,baselineId]:[dataset.id], resultDatasetId,
    parameters: { ...structuredClone(parameters),...(kind==='area'&&parameters.range===undefined?{range:[result.summary.startX,result.summary.endX]}:{}), resultName:name, sourceUnits:datasetUnits(project,dataset.id), sourceSeriesIds: source?[source.id]:[], calculatedAt: new Date().toISOString() },
    summary: { ...result.summary }, status: 'valid', algorithmVersion: 1,
    ...(result.data?{data:result.data}:{}),...(['area','peaks'].includes(kind)?{display:{visible:true,stroke:'#000000',opacity:.18,label:kind==='area'}}:{}),
  };
  if (scalar) return { ...project,schemaVersion:schemaAtLeast(project.schemaVersion,PROJECT_SCHEMA_VERSION), calculations: [...project.calculations, calculation] };
  const derived: Dataset = {
    id: resultDatasetId!, name, role: 'derived', source: { kind: 'calculation', calculationId },
    points: result.points.every(p=>'id'in p&&typeof p.id==='string')?result.points as Point[]:result.points.map(p => ({ x: p.x, y: p.y, id: id() })),
  };
  const series = makeSeries(derived.id, name, project.series.length);
  series.mode = 'line';
  series.style.markerVisible = false;
  if(kind==='baseline'&&parameters.output==='baseline')series.style.dash='dash';
  return { ...project,schemaVersion:schemaAtLeast(project.schemaVersion,kind==='peak-fit'?'1.3.0':PROJECT_SCHEMA_VERSION), calculations: [...project.calculations, calculation], datasets: [...project.datasets, derived], series: [...project.series, series] };
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
  const index=dependencyIndex(project);if(index.errors.length)throw new MathError(index.errors[0]);
  const order = index.order;
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
      const reference=original.kind==='area'&&typeof original.parameters.baselineDatasetId==='string'?datasets.get(original.parameters.baselineDatasetId):undefined;
      if(original.kind==='area'&&original.parameters.baselineDatasetId&&!reference)throw new MathError('MATH_SOURCE_MISSING');
      if(reference){const a=datasetUnits(project,sources[0].id),b=datasetUnits(project,reference.id);if(a.x!==b.x||a.y!==b.y)throw new MathError('SIGNAL_BASELINE_UNITS')}
      const master=original.kind==='peak-fit-output'?calculations.get(String(original.parameters.masterCalculationId)):undefined;const result = calculatePreview(original.kind,original.kind==='peak-fit-output'?sources[1].points:original.kind==='area'?sources[0].points:sources.flatMap(d=>d.points),master?{...original.parameters,fit:master.data?.peakFit}:original.parameters,reference?.points);
      if (original.resultDatasetId) {
        const previous = datasets.get(original.resultDatasetId);
        if (!previous) throw new MathError('MATH_RESULT_MISSING');
        if (previous.role !== 'derived' || previous.source.kind !== 'calculation' || previous.source.calculationId !== original.id) throw new MathError('MATH_RESULT_OWNERSHIP');
        const points = preservePointIds(previous.points, result.points, original.kind);
        const surviving = new Set(points.map(p => p.id));
        if (anchors.some(a => a.mode === 'point' && a.datasetId === previous.id && !surviving.has(a.pointId))) throw new MathError('MATH_ANCHORED_RESULT_SHAPE');
        datasets.set(previous.id, { ...previous, points });
      }
      calculations.set(original.id, { ...current, status: 'valid', summary: { ...result.summary },...(result.data?{data:result.data}:{}), parameters: { ...current.parameters, calculatedAt: attempt }, algorithmVersion: 1 });
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
