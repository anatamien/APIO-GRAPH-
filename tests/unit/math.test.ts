import { describe, expect, it } from 'vitest';
import { calculate, fitPolynomial, type XY } from '../../src/domain/math';

const xy = (xs: number[], fn: (x: number) => number): XY[] => xs.map(x => ({ x, y: fn(x) }));
const uneven = [0, 0.5, 2, 4, 7, 11, 16];
const noisy = uneven.map((x, i) => ({ x, y: [3.2, 3.8, 10.1, 26.7, 65.5, 145.2, 290.4][i]! }));
const values = (result: ReturnType<typeof calculate>) => result.points.map(point => point.y);
function nearArray(actual: number[], expected: number[], digits = 10) {
  expect(actual).toHaveLength(expected.length);
  actual.forEach((value, i) => expect(value).toBeCloseTo(expected[i]!, digits));
}

describe('MTH regression', () => {
  it('MTH-T01 fits the linear reference and returns its complete summary', () => {
    const result = calculate('linear-fit', xy([0, 1, 2], x => 2 * x + 1), {});
    expect(result.summary.a).toBeCloseTo(2, 12);
    expect(result.summary.b).toBeCloseTo(1, 12);
    expect(result.summary.rSquared).toBeCloseTo(1, 12);
    expect(result.points[0]!.x).toBe(0);
    expect(result.points.at(-1)!.x).toBe(2);
  });

  it('MTH-T02 reproduces a quadratic and a cubic', () => {
    for (const degree of [2, 3]) {
      const fn = (x: number) => 1 + 2 * x + 3 * x ** 2 + (degree === 3 ? 0.5 * x ** 3 : 0);
      const fit = fitPolynomial(xy([-3, -1, 0, 1, 2, 4], fn), degree);
      nearArray(fit.coefficients, degree === 3 ? [1, 2, 3, 0.5] : [1, 2, 3]);
      expect(fit.predict(1.25)).toBeCloseTo(fn(1.25), 10);
    }
  });

  it('MTH-014 matches independent NumPy 2.4.0 polynomial.polyfit reference values', () => {
    nearArray(fitPolynomial(noisy, 2).coefficients, [2.788208214095936, 1.9059004374503965, 1.004355349657338]);
    nearArray(fitPolynomial(noisy, 3).coefficients, [2.835792801344758, 1.8381845684829403, 1.0164406100954677, -0.0005107126068125889]);
  });

  it('centers and scales large X while predictions remain accurate', () => {
    const fn = (x: number) => 7 - 3 * (x - 1e12) + 0.25 * (x - 1e12) ** 2;
    const fit = fitPolynomial(xy([0, 1, 2, 4, 7, 11, 16].map(x => x + 1e12), fn), 2);
    expect(fit.predict(1e12 + 5)).toBeCloseTo(fn(1e12 + 5), 10);
    expect(fit.rSquared).toBeCloseTo(1, 12);
  });

  it('MTH-T03 rejects insufficient distinct X and numerical rank deficiency', () => {
    expect(() => calculate('linear-fit', xy([1, 1, 1], () => 2), {})).toThrow('MATH_DISTINCT_X');
    expect(() => fitPolynomial(xy([0, 1, 2], x => x), 3)).toThrow('MATH_POINTS');
    expect(() => fitPolynomial(xy([0, 1e-15, 2e-15, 1], x => x), 3)).toThrow('MATH_ILL_CONDITIONED');
  });

  it('MTH-T04 reports undefined R² for constant Y', () => {
    expect(calculate('linear-fit', xy([0, 1, 2, 3], () => 5), {}).summary.rSquared).toBeNull();
  });

  it('uses every input observation instead of a display subsample', () => {
    const points = xy(Array.from({ length: 10_001 }, (_, i) => i), x => 2 * x + 1);
    points[5_001]!.y += 50_000;
    const result = calculate('linear-fit', points, {});
    expect(result.summary.n).toBe(10_001);
    expect(result.summary.b).toBeGreaterThan(5);
    expect(result.summary.rSquared).toBeLessThan(1);
  });

  it('fits only an explicit fitRange and does not mutate the source', () => {
    const points = [{ x: 2, y: 5 }, { x: 0, y: 1 }, { x: 1, y: 3 }, { x: 3, y: 100 }];
    const original = structuredClone(points);
    const result = calculate('linear-fit', points, { fitRange: [0, 2] });
    expect(result.summary.a).toBeCloseTo(2, 12);
    expect(result.summary.n).toBe(3);
    expect(result.points.at(-1)!.x).toBe(2);
    expect(points).toEqual(original);
  });

  it('fits exponentials and powers in log coordinates with original-Y R²', () => {
    const exponential = calculate('exponential-fit', xy([0, 1, 2, 3], x => 3 * Math.exp(0.4 * x)), {});
    expect(exponential.summary.A).toBeCloseTo(3, 12);
    expect(exponential.summary.B).toBeCloseTo(0.4, 12);
    const power = calculate('power-fit', xy([1, 2, 4, 8], x => 2.5 * x ** 1.7), {});
    expect(power.summary.A).toBeCloseTo(2.5, 12);
    expect(power.summary.B).toBeCloseTo(1.7, 12);
    const reference = calculate('exponential-fit', noisy, {});
    const predicted = noisy.map(p => Math.exp(1.6220231680397907 + 0.2857434621603816 * p.x));
    const mean = noisy.reduce((sum, p) => sum + p.y, 0) / noisy.length;
    const r2 = 1 - noisy.reduce((sum, p, i) => sum + (p.y - predicted[i]!) ** 2, 0) / noisy.reduce((sum, p) => sum + (p.y - mean) ** 2, 0);
    expect(reference.summary.rSquared).toBeCloseTo(r2, 11);
  });

  it('MTH-T13 rejects nonlinear model domains without dropping observations', () => {
    expect(() => calculate('exponential-fit', [{ x: 0, y: 1 }, { x: 1, y: 0 }], {})).toThrow('MATH_POSITIVE_Y');
    expect(() => calculate('power-fit', [{ x: 0, y: 1 }, { x: 1, y: 2 }], {})).toThrow('MATH_POSITIVE_X');
  });

  it('honors an explicitly selected duplicate refusal for regression', () => {
    const points = [{ x: 0, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 4 }, { x: 2, y: 5 }];
    expect(() => calculate('linear-fit', points, { duplicates: 'reject' })).toThrow('MATH_DUPLICATE_X');
    expect(calculate('linear-fit', points, { duplicates: 'mean' }).summary.n).toBe(3);
  });

  it('reports an unrepresentable nonlinear coefficient instead of silently replacing it by zero', () => {
    const points = [{ x: 1, y: Math.exp(-600) }, { x: 2, y: Math.exp(-300) }];
    expect(() => calculate('exponential-fit', points, {})).toThrow('MATH_NONFINITE_RESULT');
  });
});

describe('MTH local methods', () => {
  it('MTH-T05/06 reproduces uniform and uneven quadratics including edges', () => {
    for (const xs of [[0, 1, 2, 3, 4, 5, 6], uneven]) {
      const points = xy(xs, x => 3 + 2 * x + x ** 2);
      nearArray(values(calculate('savitzky-golay', points, { window: 5, degree: 2 })), points.map(p => p.y));
    }
  });

  it('MTH-014 matches independently computed NumPy local polynomial reference values', () => {
    nearArray(values(calculate('savitzky-golay', noisy, { window: 5, degree: 2 })), [2.8913379210170085, 4.013579983854069, 10.478359357884338, 26.517549732019248, 65.43517933679217, 145.43247236634318, 290.31861042183596], 9);
  });

  it('MTH-T07/08 rejects even, excessive, or invalid windows and degrees', () => {
    const points = xy(uneven, x => x);
    expect(() => calculate('savitzky-golay', points, { window: 4, degree: 2 })).toThrow('MATH_WINDOW_ODD');
    expect(() => calculate('savitzky-golay', points, { window: 9, degree: 2 })).toThrow('MATH_WINDOW_SIZE');
    expect(() => calculate('savitzky-golay', points, { window: 5, degree: 5 })).toThrow('MATH_DEGREE');
    expect(() => calculate('savitzky-golay', points, { window: 5, degree: 1.5 })).toThrow('MATH_DEGREE');
  });

  it('MTH-T11 differentiates quadratics at actual nonuniform X including endpoints', () => {
    const result = calculate('derivative', xy(uneven, x => 3 * x ** 2 + 2 * x + 1), {});
    nearArray(values(result), uneven.map(x => 6 * x + 2));
    nearArray(values(calculate('derivative', noisy, {})), [0.44999999999999973, 1.9499999999999988, 5.957142857142856, 10.153333333333332, 15.929761904761904, 23.97611111111111, 34.10388888888888], 10);
    expect(() => calculate('derivative', xy([0, 1], x => x), {})).toThrow('MATH_POINTS');
  });

  it('computes moving means with shifted interior windows at edges', () => {
    nearArray(values(calculate('moving-average', xy([0, 1, 2, 3, 4], x => x - 2), { window: 3 })), [-1, -1, 0, 1, 1]);
  });

  it('MTH-013 sorts only an explicitly requested copy', () => {
    const points = [{ x: 2, y: 4 }, { x: 0, y: 0 }, { x: 1, y: 1 }];
    const original = structuredClone(points);
    expect(() => calculate('derivative', points, {})).toThrow('MATH_SORT_REQUIRED');
    const result = calculate('derivative', points, { sortCopy: true });
    expect(result.points.map(p => p.x)).toEqual([0, 1, 2]);
    nearArray(values(result), [0, 2, 4]);
    expect(points).toEqual(original);
  });

  it('MTH-T09 requires explicit duplicate policy and supports mean and median', () => {
    const points = [{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 3 }, { x: 1, y: 20 }, { x: 2, y: 4 }];
    expect(() => calculate('interpolation', points, { xValues: [1] })).toThrow('MATH_DUPLICATE_X');
    expect(values(calculate('interpolation', points, { xValues: [1], duplicates: 'mean' }))[0]).toBe(8);
    expect(values(calculate('interpolation', points, { xValues: [1], duplicates: 'median' }))[0]).toBe(3);
    expect(points).toHaveLength(5);
  });
});

describe('MTH integral, interpolation and statistics', () => {
  it('MTH-T10 integrates by trapezoids and interpolates selected boundaries', () => {
    const points = xy([0, 1, 2], x => 2 * x);
    expect(calculate('integral', points, {}).summary.integral).toBeCloseTo(4, 12);
    const clipped = calculate('integral', points, { range: [0.25, 1.5] });
    expect(clipped.summary.integral).toBeCloseTo(2.1875, 12);
    expect(clipped.points).toEqual([{ x: 0.25, y: 0.5 }, { x: 1, y: 2 }, { x: 1.5, y: 3 }]);
    expect(calculate('integral', xy([0, 1, 2], () => -2), {}).summary.integral).toBe(-4);
  });

  it('MTH-T12 linearly interpolates explicit X or an equidistant grid', () => {
    const points = [{ x: 0, y: 0 }, { x: 2, y: 4 }];
    expect(calculate('interpolation', points, { xValues: [1] }).points).toEqual([{ x: 1, y: 2 }]);
    expect(calculate('interpolation', points, { step: 0.5 }).points).toEqual(xy([0, 0.5, 1, 1.5, 2], x => 2 * x));
    expect(() => calculate('interpolation', points, { xValues: [-1] })).toThrow('MATH_EXTRAPOLATION');
    expect(calculate('interpolation', points, { xValues: [-1], extrapolate: true }).points).toEqual([{ x: -1, y: -2 }]);
  });

  it('rejects too many output points, unusable step, out-of-range integration, and nonfinite inputs', () => {
    const points = xy([0, 1, 2], x => x);
    expect(() => calculate('interpolation', points, { step: 1e-9 })).toThrow('MATH_OUTPUT_LIMIT');
    expect(() => calculate('interpolation', points, { step: 0 })).toThrow('MATH_STEP');
    expect(() => calculate('integral', points, { range: [-1, 1] })).toThrow('MATH_RANGE_OUTSIDE');
    expect(() => calculate('statistics', [{ x: 0, y: NaN }], {})).toThrow('MATH_NONFINITE_INPUT');
    expect(() => calculate('statistics', [], {})).toThrow('MATH_POINTS');
    expect(() => calculate('statistics', points, { sortCopy: 'yes' })).toThrow('MATH_SORT_PARAMETER');
    expect(() => calculate('statistics', points, { duplicates: 'drop' })).toThrow('MATH_DUPLICATES_PARAMETER');
  });

  it('computes statistics over every selected value with sample deviation', () => {
    const result = calculate('statistics', [{ x: 0, y: -2 }, { x: 1, y: 2 }, { x: 2, y: 3 }, { x: 3, y: 9 }], {});
    expect(result.summary).toMatchObject({ n: 4, minX: 0, maxX: 3, minY: -2, maxY: 9, meanY: 3, medianY: 2.5, sumY: 12, rangeX: 3, rangeY: 11 });
    expect(result.summary.stdDevY).toBeCloseTo(Math.sqrt(62 / 3), 12);
    expect(calculate('statistics', [{ x: 2, y: 7 }], {}).summary).toMatchObject({ n: 1, stdDevY: null, pearsonR: null });
    expect(calculate('statistics', xy([0, 1, 2, 3], x => 2 * x + 1), { range: [1, 2] }).summary).toMatchObject({ n: 2, meanY: 4, pearsonR: 1 });
  });

  it('reports stable codes for unsupported operations and malformed ranges', () => {
    expect(() => calculate('unknown', xy([0, 1], x => x), {})).toThrow('MATH_OPERATION');
    expect(() => calculate('statistics', xy([0, 1], x => x), { range: [2, 1] })).toThrow('MATH_RANGE');
  });

  it('retains representable small ordinates in medians, interpolation, and integration', () => {
    const points = [{ x: 0, y: Number.MIN_VALUE }, { x: 1, y: Number.MIN_VALUE }];
    expect(calculate('statistics', points, {}).summary.medianY).toBe(Number.MIN_VALUE);
    expect(calculate('interpolation', points, { xValues: [0.5] }).points[0]!.y).toBe(Number.MIN_VALUE);
    expect(calculate('integral', points, {}).summary.integral).toBe(Number.MIN_VALUE);
  });
});
