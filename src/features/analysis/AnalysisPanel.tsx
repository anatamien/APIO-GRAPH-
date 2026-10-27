import {PeakFitPanel} from './PeakFitPanel';
import {analysisPreferences} from '../settings/toolPreferences';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, Field, NumberField, Panel, Select } from '../../app/controls';
import { addTranslations } from '../../app/i18n';
import { makeObject, type CalculationKind, type Point, type ProjectDocument, type XY } from '../../domain/model';
import { MathError, type CalculationResult } from '../../domain/math';
import { addCalculation } from './operations';
import { AnalysisWorkerClient } from './workerClient';
import {dependencyIndex,seriesByDataset} from '../../domain/dependencies';
import {applyCalculationPatches,calculationInputsUnchanged,replaceCalculation} from './recalculation';
import { analysisTranslations } from './errors';
import './analysis.css';
import {SignalAnalysisPanel} from './SignalAnalysisPanel';
import {isSignalKind} from './signalOperations';
import type {SignalInteractionStore} from './signalInteraction';

addTranslations(analysisTranslations);
export interface AnalysisPanelProps { project: ProjectDocument; onChange: (label: string, transform: (p: ProjectDocument) => ProjectDocument) => void; t: (key: string) => string; onClose: () => void; sourceSeriesId?:string;calculationId?:string;onDataResults?:()=>void;interaction?:SignalInteractionStore;onRevealPeak?:(point:XY)=>void;onSourcePicked?:(id:string)=>void }

export const analysisOperations: CalculationKind[] = ['linear-fit', 'polynomial-fit', 'exponential-fit', 'power-fit', 'savitzky-golay', 'moving-average', 'derivative', 'integral', 'interpolation', 'statistics','baseline','peaks','area','peak-fit'];
const isFit = (kind: string) => kind.endsWith('-fit');
const number = (value: number) => Number(value.toPrecision(6)).toString();
const labels: Record<string, string> = { peakCount:'signal.peakCount',incompleteCount:'signal.incompleteCount',excludedFilters:'signal.excludedFilters',excludedUndefined:'signal.excludedUndefined',relativeHeight:'signal.relativeHeight',absoluteIntegral:'signal.absoluteIntegral',backgroundCount:'signal.backgroundCount',relativeChange:'signal.relativeChange',iterations:'signal.usedIterations', n: 'mathN', degree: 'degree', window: 'window', minX: 'mathMinX', maxX: 'mathMaxX', minY: 'mathMinY', maxY: 'mathMaxY', meanY: 'mathMeanY', medianY: 'mathMedianY', stdDevY: 'mathStdDevY', sumY: 'mathSumY', rangeX: 'mathRangeX', rangeY: 'mathRangeY', pearsonR: 'mathPearsonR', integral: 'integral', startX: 'rangeMin', endX: 'rangeMax' };
const coefficient = /^(a|b|A|B|c[0-9]+)$/;

export function Summary({ summary, t }: { summary: Record<string, unknown>; t: AnalysisPanelProps['t'] }) {
  return <>
    <dl className="analysis-summary">{Object.entries(summary).filter(([key]) => labels[key] || key === 'rSquared' || coefficient.test(key)).map(([key, value]) => <div key={key} style={{ display: 'contents' }}><dt>{key === 'rSquared' ? 'R²' : labels[key] ? t(labels[key]) : key}</dt><dd>{value === null ? t('undefined') : typeof value === 'number' ? number(value) : String(value)}</dd></div>)}</dl>
    {typeof summary.rSquaredReason === 'string' && <p className="analysis-note">{t(summary.rSquaredReason)}</p>}
    {typeof summary.warning === 'string' && <p className="analysis-error" role="status">{t(summary.warning)}</p>}
  </>;
}

function equationFor(kind: CalculationKind, summary: CalculationResult['summary']): string {
  if (kind === 'linear-fit') return `y = ${number(summary.a as number)}*x ${Number(summary.b) < 0 ? '−' : '+'} ${number(Math.abs(Number(summary.b)))}`;
  if (kind === 'exponential-fit') return `y = ${number(summary.A as number)}*exp(${number(summary.B as number)}*x)`;
  if (kind === 'power-fit') return `y = ${number(summary.A as number)}*x^${number(summary.B as number)}`;
  if (kind !== 'polynomial-fit') return '';
  const terms: string[] = [];
  for (let i = 0; i <= Number(summary.degree); i++) {
    const value = Number(summary[`c${i}`]);
    const term = `${number(Math.abs(value))}${i ? `*x${i > 1 ? `^${i}` : ''}` : ''}`;
    terms.push(`${i ? value < 0 ? ' − ' : ' + ' : value < 0 ? '−' : ''}${term}`);
  }
  return `y = ${terms.join('')}`;
}

/** Only the SVG preview is reduced; the worker always receives full input arrays. */
export function PreviewPlot({ source, points, t }: { source: readonly XY[]; points: readonly XY[]; t: AnalysisPanelProps['t'] }) {
  const paths = useMemo(() => {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const values of [source, points]) for (const p of values) { minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x); minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y); }
    const spanX = maxX - minX || 1, spanY = maxY - minY || 1;
    const path = (values: readonly XY[]) => {
      const sampled: XY[] = [];
      const size = Math.max(1, Math.ceil(values.length / 500));
      for (let i = 0; i < values.length; i += size) {
        const end = Math.min(values.length, i + size);
        let lo = i, hi = i;
        for (let j = i + 1; j < end; j++) { if (values[j].y < values[lo].y) lo = j; if (values[j].y > values[hi].y) hi = j; }
        for (const index of [...new Set([i, lo, hi, end - 1])].sort((a, b) => a - b)) sampled.push(values[index]);
      }
      return sampled.map((p, i) => `${i ? 'L' : 'M'}${(32 + 286 * ((p.x - minX) / spanX)).toFixed(2)},${(148 - 128 * ((p.y - minY) / spanY)).toFixed(2)}`).join(' ');
    };
    return { source: path(source), result: path(points), minX, maxX };
  }, [source, points]);
  return <svg className="analysis-preview" viewBox="0 0 340 178" role="img" aria-label={t('preview')}>
    <title>{t('preview')}</title><path d="M32 16V148H322" fill="none" stroke="#a8adb4" strokeWidth="0.8" />
    <path d={paths.source} fill="none" stroke="#a8adb4" strokeWidth="1" strokeDasharray="3 3" />
    <path d={paths.result} fill="none" stroke="#476e98" strokeWidth="1.8" />
    <g fontSize="10" fontFamily="Courier New" fill="currentColor"><text x="32" y="166">{number(paths.minX)}</text><text x="318" y="166" textAnchor="end">{number(paths.maxX)}</text></g>
  </svg>;
}

interface Preview { result: CalculationResult; kind: CalculationKind; parameters: Record<string, unknown>; sourceSeriesId: string; sourceDatasetId: string; sourcePoints: Point[] }

export function AnalysisPanel(props:AnalysisPanelProps){
 const [operation,setOperation]=useState<CalculationKind>(()=>props.project.calculations.find(c=>c.id===props.calculationId)?.kind??'linear-fit');
 const [source,setSource]=useState(props.sourceSeriesId);
 return operation==='peak-fit'?<PeakFitPanel key={operation} {...props} sourceSeriesId={source} onSourcePicked={setSource} onOperation={setOperation}/>:isSignalKind(operation)?<SignalAnalysisPanel key={operation} {...props} sourceSeriesId={source} onSourcePicked={setSource} operation={operation} onOperation={setOperation}/>:<LegacyAnalysisPanel key={operation} {...props} sourceSeriesId={source} onSourcePicked={setSource} operation={operation} onOperation={setOperation}/>;
}
function LegacyAnalysisPanel({ project, onChange, t, onClose,sourceSeriesId,calculationId,onDataResults,operation,onOperation,onSourcePicked }: AnalysisPanelProps&{operation:CalculationKind;onOperation:(kind:CalculationKind)=>void}) {
  const editing=project.calculations.find(c=>c.id===calculationId),initialDataset=project.datasets.find(d=>d.id===(project.series.find(s=>s.id===sourceSeriesId)?.datasetId??sourceSeriesId?.replace(/^dataset:/,'')))??project.datasets[0],saved=editing?.parameters??analysisPreferences(operation,initialDataset?.points.length),initialRange=saved.fitRange??saved.range;
  const originalSource=Array.isArray(saved.sourceSeriesIds)?project.series.find(s=>saved.sourceSeriesIds instanceof Array&&saved.sourceSeriesIds.includes(s.id)&&s.datasetId===editing?.sourceDatasetIds[0]):undefined;
  const kind=editing?.kind??operation;
  const [sourceId, setSourceId] = useState(sourceSeriesId??(editing?originalSource?.id??seriesByDataset(project.series).get(editing.sourceDatasetIds[0])?.[0]?.id??`dataset:${editing.sourceDatasetIds[0]}`:project.series[0]?.id)??'');
  const [windowSize, setWindowSize] = useState(Number(saved.window??9)), [polyDegree, setPolyDegree] = useState(Number(saved.degree??2)), [sgDegree, setSgDegree] = useState(Number(saved.degree??3));
  const [sortCopy, setSortCopy] = useState(saved.sortCopy===true), [duplicates, setDuplicates] = useState(String(saved.duplicates??'default'));
  const [selection, setSelection] = useState(saved.rowRange?'rows':initialRange?'x':'all'), [minText, setMinText] = useState(Array.isArray(initialRange)?String(initialRange[0]):''), [maxText, setMaxText] = useState(Array.isArray(initialRange)?String(initialRange[1]):'');
  const [rowFrom, setRowFrom] = useState(Array.isArray(saved.rowRange)?String(saved.rowRange[0]):'1'), [rowTo, setRowTo] = useState(Array.isArray(saved.rowRange)?String(saved.rowRange[1]):'');
  const [stepText, setStepText] = useState(saved.step===undefined?'':String(saved.step)), [xText, setXText] = useState(Array.isArray(saved.xValues)?saved.xValues.join(' '):''), [extrapolate, setExtrapolate] = useState(saved.extrapolate===true);
  const [preview, setPreview] = useState<Preview | null>(null), [error, setError] = useState(''), [busy, setBusy] = useState(false);
  const [resultName, setResultName] = useState(typeof saved.resultName==='string'?saved.resultName:project.datasets.find(d=>d.id===editing?.resultDatasetId)?.name??''), [equation, setEquation] = useState('');
  const client = useRef<AnalysisWorkerClient | null>(null);
  if (!client.current) client.current = new AnalysisWorkerClient();
  const version = useRef(0), latest = useRef(project);
  latest.current = project;
  const index=dependencyIndex(project);
  const sources = useMemo(() => project.series.filter(s => index.datasets.has(s.datasetId) && (!index.producers.has(s.datasetId)||index.producers.get(s.datasetId)?.status==='valid')), [project.series,index]);
  const sourceOptions=useMemo(()=>{const curves=seriesByDataset(project.series);return [...sources.map(s=>[s.id,s.name] as [string,string]),...project.datasets.filter(d=>!curves.has(d.id)&&(!index.producers.has(d.id)||index.producers.get(d.id)?.status==='valid')).map(d=>[`dataset:${d.id}`,d.name] as [string,string])]},[sources,project.datasets,project.series,index]);
  const series = sources.find(s => s.id === sourceId);
  const dataset = project.datasets.find(d => d.id === (series?.datasetId??sourceId.replace(/^dataset:/,'')));
  const bounds = useMemo(() => {
    let min = Infinity, max = -Infinity;
    for (const p of dataset?.points ?? []) { min = Math.min(min, p.x); max = Math.max(max, p.x); }
    return [min, max] as const;
  }, [dataset?.points]);
  useEffect(() => { if (!editing&&!sourceOptions.some(([id])=>id===sourceId)) setSourceId(sourceOptions[0]?.[0] ?? ''); }, [sourceOptions, sourceId,editing]);
  useEffect(() => {
    version.current++;
    client.current?.cancel();
    setBusy(false); setPreview(null); setEquation(''); setError('');
  }, [dataset?.points,project.calculations,project.axes.x.unit,project.axes.y.unit, kind, sourceId, windowSize, polyDegree, sgDegree, sortCopy, duplicates, selection, minText, maxText, rowFrom, rowTo, stepText, xText, extrapolate]);
  useEffect(() => () => { version.current++; client.current?.cancel(); }, []);

  function parameters(): Record<string, unknown> {
    const parse = (text: string, code: string, fallback?: number) => {
      if (!text.trim() && fallback !== undefined) return fallback;
      const value = Number(text.trim().replace(',', '.'));
      if (!text.trim() || !Number.isFinite(value)) throw new MathError(code);
      return value;
    };
    const result: Record<string, unknown> = { sortCopy };
    if (kind !== 'statistics' && (duplicates !== 'default' || !isFit(kind))) result.duplicates = duplicates === 'default' ? 'reject' : duplicates;
    if (kind === 'polynomial-fit') result.degree = polyDegree;
    if (kind === 'savitzky-golay') { result.window = windowSize; result.degree = sgDegree; }
    if (kind === 'moving-average') result.window = windowSize;
    if (selection === 'x') result[isFit(kind) ? 'fitRange' : 'range'] = [parse(minText, 'MATH_RANGE', bounds[0]), parse(maxText, 'MATH_RANGE', bounds[1])];
    if (selection === 'rows') result.rowRange = [parse(rowFrom, 'MATH_ROW_RANGE'), parse(rowTo, 'MATH_ROW_RANGE', dataset?.points.length)];
    if (kind === 'interpolation') {
      result.extrapolate = extrapolate;
      if (xText.trim()) result.xValues = xText.trim().split(/[\s;]+/).map(value => parse(value, 'MATH_X_VALUES'));
      else if (stepText.trim()) result.step = parse(stepText, 'MATH_STEP');
    }
    return result;
  }
  const showError = (reason: unknown) => { if (!(reason instanceof Error && reason.name === 'AbortError')) setError(reason instanceof MathError ? reason.code : 'MATH_WORKER_FAILURE'); };
  function cancel() { version.current++; client.current?.cancel(); setBusy(false); setPreview(null); setEquation(''); }
  async function run() {
    if (!dataset) { setError('MATH_SOURCE_MISSING'); return; }
    if(index.producers.has(dataset.id)&&index.producers.get(dataset.id)?.status!=='valid'){setError('MATH_DEPENDENCY_INVALID');return}
    const token = ++version.current;
    try {
      const args = parameters();
      setError(''); setPreview(null); setBusy(true);
      const response = await client.current!.run({ type: 'preview', kind, points: dataset.points, parameters: args });
      if (version.current !== token || response.type !== 'preview') return;
      setPreview({ result: response.result, kind, parameters: args, sourceSeriesId: sourceId, sourceDatasetId: dataset.id, sourcePoints: dataset.points });
      setEquation(equationFor(kind, response.result.summary));
    } catch (reason) { if (version.current === token) showError(reason); }
    finally { if (version.current === token) setBusy(false); }
  }
  async function recompute() {
    const snapshot = project, token = ++version.current;
    setError(''); setPreview(null); setBusy(true);
    try {
      const response = await client.current!.run({ type: 'recompute', project: snapshot });
      if (version.current !== token || response.type !== 'recompute') return;
      if (!calculationInputsUnchanged(latest.current,snapshot)) throw new MathError('MATH_PREVIEW_STALE');
      onChange('recalculate', p => response.patches?applyCalculationPatches(p,snapshot,response.patches):p);
    } catch (reason) { if (version.current === token) showError(reason); }
    finally { if (version.current === token) setBusy(false); }
  }
  function addResult() {
    if (!preview) return;
    if (project.datasets.find(d => d.id === preview.sourceDatasetId)?.points !== preview.sourcePoints) { setError('MATH_PREVIEW_STALE'); return; }
    const name = resultName.trim() || `${t(preview.kind)} · ${series?.name ?? dataset?.name ?? ''}`;
    if(editing){
      const snapshot=project;
      onChange('UpdateCalculation',p=>{if(!calculationInputsUnchanged(p,snapshot))throw new MathError('MATH_PREVIEW_STALE');return replaceCalculation(p,editing.id,preview.parameters,preview.result,name)});
    }else onChange('addResult', p => p.datasets.find(d => d.id === preview.sourceDatasetId)?.points === preview.sourcePoints ? addCalculation(p, preview.sourceSeriesId, preview.kind, preview.parameters, preview.result, name) : p);
    cancel();
  }
  function addEquation() {
    if (!equation.trim() || !preview) return;
    onChange('addEquation', p => {
      const object = makeObject('text', [{ mode: 'page', pageX: 0.15, pageY: 0.12 }], equation);
      object.name = t('equation');
      object.zIndex = Math.max(0, ...p.objects.map(o => o.zIndex)) + 1;
      return { ...p, objects: [...p.objects, object], editor: { ...p.editor, selectedObjectId: object.id } };
    });
    cancel();
  }
  const dirty = project.calculations.filter(c => c.status !== 'valid');
  return <Panel title={t('analysis')} onClose={onClose} t={t} className="analysis-panel">
    {onDataResults&&<button onClick={onDataResults}>{t('data.results')}</button>}
    {editing?<><p className="analysis-note">{t('data.edit')} · {t(kind)}</p><p>{t('source')}: {project.datasets.find(d=>d.id===editing.sourceDatasetIds[0])?.name}</p></>:<><Select label={t('operation')} value={kind} items={analysisOperations.map(value => [value, t(value)])} onChange={value => onOperation(value as CalculationKind)} />
    <Select label={t('sourceSeries')} value={sourceId} items={sourceOptions.length ? sourceOptions : [['', t('noData')]]} onChange={id=>{setSourceId(id);onSourcePicked?.(id)}} /></>}
    {series && <Check label={t('analysisSourceVisibility')} value={series.visible} onChange={visible => onChange('SetSeriesVisibility', p => ({ ...p, series: p.series.map(s => s.id === sourceId ? { ...s, visible } : s) }))} />}
    {dataset && <p className="analysis-note">{t('analysisSourceCount').replace('{n}', String(dataset.points.length))}</p>}
    <Select label={t('analysisSelection')} value={selection} items={['all', 'x', 'rows'].map(value => [value, t(value === 'all' ? 'analysisAll' : value === 'x' ? 'analysisXRange' : 'analysisRows')])} onChange={setSelection} />
    {selection === 'x' && <div className="analysis-grid"><Field label={t('rangeMin')}><input type="text" inputMode="decimal" aria-label={t('rangeMin')} placeholder={Number.isFinite(bounds[0]) ? number(bounds[0]) : ''} value={minText} onChange={e => setMinText(e.target.value)} /></Field><Field label={t('rangeMax')}><input type="text" inputMode="decimal" aria-label={t('rangeMax')} placeholder={Number.isFinite(bounds[1]) ? number(bounds[1]) : ''} value={maxText} onChange={e => setMaxText(e.target.value)} /></Field></div>}
    {selection === 'rows' && <div className="analysis-grid"><Field label={t('analysisRowFrom')}><input type="number" min="1" step="1" aria-label={t('analysisRowFrom')} value={rowFrom} onChange={e => setRowFrom(e.target.value)} /></Field><Field label={t('analysisRowTo')}><input type="number" min="1" step="1" aria-label={t('analysisRowTo')} placeholder={String(dataset?.points.length ?? '')} value={rowTo} onChange={e => setRowTo(e.target.value)} /></Field></div>}
    {(kind === 'savitzky-golay' || kind === 'moving-average') && <NumberField label={t('window')} value={windowSize} min={1} step={1} onChange={setWindowSize} />}
    {kind === 'polynomial-fit' && <NumberField label={t('degree')} value={polyDegree} min={1} max={3} step={1} onChange={setPolyDegree} />}
    {kind === 'savitzky-golay' && <NumberField label={t('degree')} value={sgDegree} min={0} step={1} onChange={setSgDegree} />}
    {kind !== 'statistics' && <><Check label={t('sortCopy')} value={sortCopy} onChange={setSortCopy} /><Select label={t('duplicates')} value={!isFit(kind) && duplicates === 'default' ? 'reject' : duplicates} items={(isFit(kind) ? ['default', 'reject', 'mean', 'median'] : ['reject', 'mean', 'median']).map(value => [value, t(value === 'default' ? 'analysisRetainDuplicates' : value)])} onChange={setDuplicates} /></>}
    {kind === 'interpolation' && <><Field label={t('step')}><input aria-label={t('step')} type="text" inputMode="decimal" placeholder={t('auto')} value={stepText} onChange={e => setStepText(e.target.value)} disabled={!!xText.trim()} /></Field><Field label={t('xValues')}><input aria-label={t('xValues')} type="text" value={xText} onChange={e => setXText(e.target.value)} /></Field><Check label={t('extrapolate')} value={extrapolate} onChange={setExtrapolate} /><p className="analysis-note">{t('analysisExtrapolation')}</p></>}
    {['exponential-fit', 'power-fit', 'savitzky-golay', 'derivative', 'integral', 'moving-average'].includes(kind) && <p className="analysis-note">{t(kind === 'exponential-fit' ? 'logMethod' : kind === 'power-fit' ? 'analysisPowerMethod' : kind === 'savitzky-golay' ? 'calculationMethod' : kind === 'derivative' ? 'analysisDerivativeMethod' : kind === 'integral' ? 'analysisIntegralMethod' : 'analysisMovingMethod')}</p>}
    {kind === 'derivative' && <p className="analysis-note">{t('unit')}: {project.axes.y.unit || 'Y'}/{project.axes.x.unit || 'X'}</p>}
    {kind === 'integral' && <p className="analysis-note">{t('unit')}: {project.axes.x.unit || 'X'} × {project.axes.y.unit || 'Y'}</p>}
    <div className="analysis-actions"><button className="primary" disabled={busy || !dataset?.points.length} onClick={() => void run()}>{t(busy ? 'calculating' : 'calculate')}</button><button onClick={busy ? cancel : onClose}>{t('cancel')}</button></div>
    {error && <p className="analysis-error" role="alert">{t(error)}</p>}
    {preview ? <div aria-label={t('preview')}>
      <p className="analysis-note">{t('analysisPreviewStyle')}</p>
      {preview.result.points.length > 0 && <PreviewPlot source={series?.visible ? preview.sourcePoints : []} points={preview.result.points} t={t} />}
      <Summary summary={preview.result.summary} t={t} />
      {preview.kind !== 'integral' && preview.kind !== 'statistics' && <Field label={t('name')}><input aria-label={t('name')} value={resultName} placeholder={`${t(preview.kind)} · ${series?.name ?? ''}`} onChange={e => setResultName(e.target.value)} /></Field>}
      <div className="analysis-actions"><button className="primary" onClick={addResult}>{t(editing?'apply':'addResult')}</button></div>
      {isFit(preview.kind) && <><Field label={t('equation')}><textarea className="analysis-equation" aria-label={t('equation')} value={equation} onChange={e => setEquation(e.target.value)} /></Field><button disabled={!equation.trim()} onClick={addEquation}>{t('addEquation')}</button></>}
    </div> : !busy && <p className="analysis-note">{t('analysisPreviewHint')}</p>}
    {project.calculations.length > 0 && <div className="analysis-pending">
      {dirty.length > 0 && <><p className="analysis-note">{t('outdated')} ({dirty.length})</p><button disabled={busy} onClick={() => void recompute()}>{t('recalculate')}</button></>}
      {project.calculations.slice(-30).map(c => <details key={c.id} style={{ marginTop: 10 }}><summary className="analysis-status">{project.series.find(s => s.datasetId === c.resultDatasetId)?.name ?? t(c.kind)} · {t(c.status === 'valid' ? 'analysisValid' : c.status === 'outdated' ? 'outdated' : 'error')}</summary>
        {c.status !== 'valid' && <p className="analysis-note">{t('analysisRetained')}</p>}
        {typeof c.summary.errorCode === 'string' && <p className="analysis-error" role="status">{t(c.summary.errorCode)}</p>}
        <Summary summary={c.summary} t={t} />
      </details>)}
      {project.calculations.length>30&&onDataResults&&<button onClick={onDataResults}>{t('data.results')} ({project.calculations.length})</button>}
    </div>}
  </Panel>;
}

export default AnalysisPanel;
