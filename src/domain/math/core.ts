export interface XY { x: number; y: number }
export interface CalculationResult { points: XY[]; summary: Record<string, number | string | null> }
export type Parameters = Record<string, unknown>;
export type Range = readonly [number, number];
export const OUTPUT_LIMIT = 1_000_000;

/** Codes are stable; the presentation layer supplies translated explanations. */
export class MathError extends Error {
  constructor(public readonly code: string, public readonly details: Record<string, number | string> = {}) {
    super(code);
    this.name = 'MathError';
  }
}

export function finite(value: number): number {
  if (!Number.isFinite(value)) throw new MathError('MATH_NONFINITE_RESULT');
  return value;
}

export function validateInput(points: readonly XY[], parameters: Parameters): void {
  if (!points.length) throw new MathError('MATH_POINTS');
  for (let i = 0; i < points.length; i++) {
    if (!Number.isFinite(points[i].x) || !Number.isFinite(points[i].y)) {
      throw new MathError('MATH_NONFINITE_INPUT', { pointIndex: i });
    }
  }
  if (parameters.sortCopy !== undefined && typeof parameters.sortCopy !== 'boolean') {
    throw new MathError('MATH_SORT_PARAMETER');
  }
  if (parameters.duplicates !== undefined && (typeof parameters.duplicates !== 'string' || !['reject', 'mean', 'median'].includes(parameters.duplicates))) {
    throw new MathError('MATH_DUPLICATES_PARAMETER');
  }
}

export function readRange(value: unknown): Range | undefined {
  if (value === undefined || value === null) return undefined;
  let min: unknown;
  let max: unknown;
  if (Array.isArray(value) && value.length === 2) [min, max] = value;
  else if (typeof value === 'object' && value !== null) {
    ({ min, max } = value as Record<string, unknown>);
  }
  if (typeof min !== 'number' || typeof max !== 'number' || !Number.isFinite(min) || !Number.isFinite(max) || min > max) {
    throw new MathError('MATH_RANGE');
  }
  return [min, max];
}

export function selectRange(points: readonly XY[], range?: Range): XY[] {
  const selected = range ? points.filter(p => p.x >= range[0] && p.x <= range[1]) : points;
  if (!selected.length) throw new MathError('MATH_POINTS');
  return selected.map(p => ({ x: p.x, y: p.y }));
}

/** Neumaier summation retains small terms when signs or magnitudes differ. */
export function sum(values: Iterable<number>): number {
  let result = 0;
  let compensation = 0;
  for (const value of values) {
    const next = result + value;
    compensation += Math.abs(result) >= Math.abs(value) ? (result - next) + value : (value - next) + result;
    result = next;
  }
  return result + compensation;
}

export function extent(values: readonly number[]): Range {
  let min = Infinity;
  let max = -Infinity;
  for (const value of values) { min = Math.min(min, value); max = Math.max(max, value); }
  return [min, max];
}

export function normalization(values: readonly number[]): { center: number; scale: number; values: number[] } {
  const [min, max] = extent(values);
  const difference = max - min;
  const center = Number.isFinite(difference) ? min + difference / 2 : min / 2 + max / 2;
  const scale = Math.max(Math.abs(min - center), Math.abs(max - center)) || 1;
  return { center, scale, values: values.map(value => (value - center) / scale) };
}

export function mean(values: readonly number[]): number {
  const normalized = normalization(values);
  return finite(normalized.center + normalized.scale * (sum(normalized.values) / values.length));
}

export function midpoint(a: number, b: number): number {
  const total = a + b;
  return Number.isFinite(total) ? total / 2 : a / 2 + b / 2;
}

export function median(values: readonly number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : midpoint(sorted[middle - 1], sorted[middle]);
}

export function aggregateDuplicates(points: readonly XY[], strategy: unknown): XY[] {
  const groups = new Map<number, number[]>();
  for (const point of points) {
    const group = groups.get(point.x);
    if (group) group.push(point.y);
    else groups.set(point.x, [point.y]);
  }
  if (groups.size === points.length) return points.map(p => ({ ...p }));
  if (strategy !== 'mean' && strategy !== 'median') throw new MathError('MATH_DUPLICATE_X');
  return Array.from(groups, ([x, ys]) => ({ x, y: strategy === 'mean' ? mean(ys) : median(ys) }));
}

/** Sorting and aggregation always operate on copies, and require explicit choices. */
export function ordered(points: readonly XY[], parameters: Parameters): XY[] {
  let copy = points.map(p => ({ ...p }));
  if (parameters.sortCopy === true) copy.sort((a, b) => a.x - b.x);
  else {
    for (let i = 1; i < copy.length; i++) {
      if (copy[i].x < copy[i - 1].x) throw new MathError('MATH_SORT_REQUIRED', { pointIndex: i });
    }
  }
  copy = aggregateDuplicates(copy, parameters.duplicates);
  return copy;
}

export function rSquared(points: readonly XY[], predict: (x: number) => number): number | null {
  const ys = points.map(p => p.y);
  const [min, max] = extent(ys);
  if (min === max) return null;
  const normalized = normalization(ys);
  const average = sum(normalized.values) / points.length;
  const sst = sum(normalized.values.map(y => (y - average) ** 2));
  const sse = sum(points.map((p, i) => ((finite(predict(p.x)) - normalized.center) / normalized.scale - normalized.values[i]) ** 2));
  return finite(1 - sse / sst);
}

export function interpolate(points: readonly XY[], x: number, extrapolate = false): number {
  if (!Number.isFinite(x)) throw new MathError('MATH_NONFINITE_INPUT');
  const last = points.length - 1;
  if (!extrapolate && (x < points[0].x || x > points[last].x)) throw new MathError('MATH_EXTRAPOLATION');
  let low = 0;
  let high = last;
  while (high - low > 1) {
    const middle = Math.floor((low + high) / 2);
    if (points[middle].x <= x) low = middle;
    else high = middle;
  }
  const a = points[low];
  const b = points[high];
  if (x === a.x) return a.y;
  if (x === b.x) return b.y;
  if (a.y === b.y) return a.y;
  const ratio = (x - a.x) / (b.x - a.x);
  return finite((1 - ratio) * a.y + ratio * b.y);
}

export function validateResult(result: CalculationResult): CalculationResult {
  for (const p of result.points) { finite(p.x); finite(p.y); }
  for (const value of Object.values(result.summary)) if (typeof value === 'number') finite(value);
  return result;
}
