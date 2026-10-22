import { MathError, OUTPUT_LIMIT, aggregateDuplicates, extent, finite, interpolate, mean, median, midpoint, normalization, ordered, rSquared, readRange, selectRange, sum, validateInput, validateResult, type CalculationResult, type Parameters, type Range, type XY } from './core';
import { fitPolynomial } from './regression';
export { MathError, type XY, type CalculationResult } from './core';
export { fitPolynomial, type PolynomialFit } from './regression';

function regression(kind: string, points: readonly XY[], parameters: Parameters): CalculationResult {
  let selected = selectRange(points, readRange(parameters.fitRange ?? parameters.range));
  // Repeated observations are legitimate OLS weights unless aggregation was chosen.
  if (parameters.duplicates !== undefined) selected = aggregateDuplicates(selected, parameters.duplicates);
  const degree = kind === 'polynomial-fit' ? (parameters.degree ?? 2) : 1;
  if (typeof degree !== 'number' || !Number.isInteger(degree) || degree < 1 || degree > 3) throw new MathError('MATH_DEGREE');
  const nonlinear = kind === 'exponential-fit' || kind === 'power-fit';
  if (nonlinear && selected.some(p => p.y <= 0)) throw new MathError('MATH_POSITIVE_Y');
  if (kind === 'power-fit' && selected.some(p => p.x <= 0)) throw new MathError('MATH_POSITIVE_X');
  const training = nonlinear ? selected.map(p => ({ x: kind === 'power-fit' ? Math.log(p.x) : p.x, y: Math.log(p.y) })) : selected;
  const fit = fitPolynomial(training, degree);
  const predict = nonlinear ? (x: number) => finite(Math.exp(fit.predict(kind === 'power-fit' ? Math.log(x) : x))) : fit.predict;
  const [min, max] = extent(selected.map(p => p.x));
  const curve = Array.from({ length: 401 }, (_, i) => {
    const x = i === 400 ? max : min + (max - min) * (i / 400);
    return { x, y: predict(x) };
  });
  const summary: CalculationResult['summary'] = {
    n: selected.length, degree, rSquared: nonlinear ? rSquared(selected, predict) : fit.rSquared,
    method: nonlinear ? 'log-linear-least-squares' : 'scaled-householder-qr',
    conditionEstimate: fit.conditionEstimate,
  };
  if (fit.conditionEstimate > 1e8) summary.warning = 'MATH_ILL_CONDITIONED';
  if (summary.rSquared === null) summary.rSquaredReason = 'MATH_R_SQUARED_UNDEFINED';
  if (nonlinear) {
    summary.A = finite(Math.exp(fit.coefficients[0]));
    if (summary.A === 0) throw new MathError('MATH_NONFINITE_RESULT');
    summary.B = fit.coefficients[1];
  }
  else if (kind === 'linear-fit') { summary.a = fit.coefficients[1]; summary.b = fit.coefficients[0]; }
  else fit.coefficients.forEach((coefficient, i) => { summary[`c${i}`] = coefficient; });
  return { points: curve, summary };
}

function local(kind: string, points: readonly XY[], parameters: Parameters): CalculationResult {
  const selected = ordered(selectRange(points, readRange(parameters.range)), parameters);
  const window = kind === 'derivative' ? 3 : (parameters.window ?? 9);
  if (typeof window !== 'number' || !Number.isInteger(window) || window < (kind === 'savitzky-golay' ? 3 : 1)) throw new MathError('MATH_WINDOW_SIZE');
  if (kind === 'savitzky-golay' && window % 2 === 0) throw new MathError('MATH_WINDOW_ODD');
  if (selected.length < window) throw new MathError(kind === 'derivative' ? 'MATH_POINTS' : 'MATH_WINDOW_SIZE', { required: window });
  const degree = kind === 'derivative' ? 2 : (parameters.degree ?? 3);
  if (kind !== 'moving-average' && (typeof degree !== 'number' || !Number.isInteger(degree) || degree < 0 || degree >= window)) throw new MathError('MATH_DEGREE');
  const result: XY[] = [];
  let maximumCondition = 1;
  for (let i = 0; i < selected.length; i++) {
    const start = Math.max(0, Math.min(i - Math.floor(window / 2), selected.length - window));
    const neighbors = selected.slice(start, start + window);
    let y: number;
    if (kind === 'moving-average') y = mean(neighbors.map(p => p.y));
    else {
      try {
        const fit = fitPolynomial(neighbors.map(p => ({ x: p.x - selected[i].x, y: p.y })), degree as number);
        y = kind === 'derivative' ? fit.derivative(0) : fit.predict(0);
        maximumCondition = Math.max(maximumCondition, fit.conditionEstimate);
      } catch (error) {
        if (error instanceof MathError) throw new MathError(error.code, { ...error.details, pointIndex: i, window });
        throw error;
      }
    }
    result.push({ x: selected[i].x, y });
  }
  const summary: CalculationResult['summary'] = {
    n: result.length, window, edgeMode: 'local-fit',
    method: kind === 'moving-average' ? 'arithmetic-moving-average' : kind === 'derivative' ? 'three-point-quadratic-actual-x' : 'local-polynomial-actual-x',
  };
  if (kind !== 'moving-average') { summary.degree = degree as number; summary.conditionEstimate = maximumCondition; }
  if (maximumCondition > 1e8) summary.warning = 'MATH_ILL_CONDITIONED';
  return { points: result, summary };
}

function integrate(points: readonly XY[], parameters: Parameters): CalculationResult {
  const selected = ordered(points, parameters);
  if (selected.length < 2) throw new MathError('MATH_POINTS', { required: 2 });
  const range = readRange(parameters.range) ?? [selected[0].x, selected.at(-1)!.x];
  if (range[0] >= range[1]) throw new MathError('MATH_RANGE');
  if (range[0] < selected[0].x || range[1] > selected.at(-1)!.x) throw new MathError('MATH_RANGE_OUTSIDE');
  const clipped = [
    { x: range[0], y: interpolate(selected, range[0]) },
    ...selected.filter(p => p.x > range[0] && p.x < range[1]),
    { x: range[1], y: interpolate(selected, range[1]) },
  ];
  const areas: number[] = [];
  for (let i = 1; i < clipped.length; i++) areas.push(finite((clipped[i].x - clipped[i - 1].x) * midpoint(clipped[i].y, clipped[i - 1].y)));
  return { points: clipped, summary: { integral: finite(sum(areas)), n: clipped.length, startX: range[0], endX: range[1], method: 'signed-trapezoids-linear-boundaries' } };
}

function grid(range: Range, step: unknown): number[] {
  if (typeof step !== 'number' || !Number.isFinite(step) || step <= 0) throw new MathError('MATH_STEP');
  const intervals = (range[1] - range[0]) / step;
  const count = Math.floor(intervals + Math.min(1e-8, 8 * Number.EPSILON * Math.abs(intervals))) + 1;
  if (!Number.isFinite(count) || count > OUTPUT_LIMIT) throw new MathError('MATH_OUTPUT_LIMIT', { limit: OUTPUT_LIMIT });
  const values = Array.from({ length: count }, (_, i) => range[0] + i * step);
  for (let i = 1; i < values.length; i++) if (values[i] <= values[i - 1]) throw new MathError('MATH_STEP_TOO_SMALL');
  const last = values.length - 1;
  if (values[last] > range[1]) values[last] = range[1];
  return values;
}

function interpolation(points: readonly XY[], parameters: Parameters): CalculationResult {
  const selected = ordered(points, parameters);
  if (selected.length < 2) throw new MathError('MATH_POINTS', { required: 2 });
  if (parameters.extrapolate !== undefined && typeof parameters.extrapolate !== 'boolean') throw new MathError('MATH_EXTRAPOLATE_PARAMETER');
  const range = readRange(parameters.range) ?? [selected[0].x, selected.at(-1)!.x];
  let xs: number[];
  if (parameters.xValues !== undefined) {
    if (!Array.isArray(parameters.xValues) || parameters.xValues.length === 0) throw new MathError('MATH_X_VALUES');
    if (parameters.xValues.length > OUTPUT_LIMIT) throw new MathError('MATH_OUTPUT_LIMIT', { limit: OUTPUT_LIMIT });
    xs = parameters.xValues as number[];
    if (xs.some(x => typeof x !== 'number' || !Number.isFinite(x))) throw new MathError('MATH_NONFINITE_INPUT');
  } else xs = grid(range, parameters.step ?? (range[1] - range[0]) / 400);
  return {
    points: xs.map(x => ({ x, y: interpolate(selected, x, parameters.extrapolate === true) })),
    summary: { n: xs.length, method: 'piecewise-linear', extrapolation: parameters.extrapolate === true ? 'enabled' : 'disabled' },
  };
}

function statistics(points: readonly XY[], parameters: Parameters): CalculationResult {
  const selected = selectRange(points, readRange(parameters.range));
  const xs = selected.map(p => p.x);
  const ys = selected.map(p => p.y);
  const [minX, maxX] = extent(xs);
  const [minY, maxY] = extent(ys);
  const xn = normalization(xs);
  const yn = normalization(ys);
  const xMean = sum(xn.values) / selected.length;
  const yMean = sum(yn.values) / selected.length;
  const sxx = sum(xn.values.map(x => (x - xMean) ** 2));
  const syy = sum(yn.values.map(y => (y - yMean) ** 2));
  const sxy = sum(xn.values.map((x, i) => (x - xMean) * (yn.values[i] - yMean)));
  const magnitude = Math.max(Math.abs(minY), Math.abs(maxY)) || 1;
  return { points: [], summary: {
    n: selected.length, minX, maxX, minY, maxY, rangeX: maxX - minX, rangeY: maxY - minY,
    meanY: yn.center + yn.scale * yMean, medianY: median(ys), sumY: magnitude * sum(ys.map(y => y / magnitude)),
    stdDevY: selected.length > 1 ? yn.scale * Math.sqrt(syy / (selected.length - 1)) : null,
    pearsonR: sxx > 0 && syy > 0 ? Math.max(-1, Math.min(1, sxy / Math.sqrt(sxx * syy))) : null,
  } };
}

/** Pure calculation entry point. Input arrays and point records are never changed. */
export function calculate(kind: string, points: readonly XY[], parameters: Parameters = {}): CalculationResult {
  validateInput(points, parameters);
  let result: CalculationResult;
  switch (kind) {
    case 'linear-fit': case 'polynomial-fit': case 'exponential-fit': case 'power-fit':
      result = regression(kind, points, parameters); break;
    case 'savitzky-golay': case 'moving-average': case 'derivative':
      result = local(kind, points, parameters); break;
    case 'integral': result = integrate(points, parameters); break;
    case 'interpolation': result = interpolation(points, parameters); break;
    case 'statistics': result = statistics(points, parameters); break;
    default: throw new MathError('MATH_OPERATION');
  }
  return validateResult(result);
}
