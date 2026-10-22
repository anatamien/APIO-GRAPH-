import { MathError, finite, normalization, rSquared, sum, validateInput, type XY } from './core';

export interface PolynomialFit {
  /** Ascending powers of original X: c0 + c1*x + ... . */
  coefficients: number[];
  predict: (x: number) => number;
  derivative: (x: number) => number;
  rSquared: number | null;
  conditionEstimate: number;
}

/** Householder QR of the scaled Vandermonde matrix. No normal equations. */
function leastSquares(matrix: Float64Array, rhs: Float64Array, rows: number, columns: number): { coefficients: number[]; conditionEstimate: number } {
  let largestDiagonal = 0;
  let smallestDiagonal = Infinity;
  for (let k = 0; k < columns; k++) {
    let norm = 0;
    for (let i = k; i < rows; i++) norm = Math.hypot(norm, matrix[i * columns + k]);
    const alpha = matrix[k * columns + k] >= 0 ? -norm : norm;
    if (norm <= 1e-12 * largestDiagonal || norm === 0) throw new MathError('MATH_ILL_CONDITIONED');
    const vector = new Float64Array(rows - k);
    for (let i = k; i < rows; i++) vector[i - k] = matrix[i * columns + k];
    vector[0] -= alpha;
    const beta = 2 / sum(Array.from(vector, value => value * value));
    for (let j = k + 1; j < columns; j++) {
      let projection = 0;
      for (let i = k; i < rows; i++) projection += vector[i - k] * matrix[i * columns + j];
      projection *= beta;
      for (let i = k; i < rows; i++) matrix[i * columns + j] -= projection * vector[i - k];
    }
    let projection = 0;
    for (let i = k; i < rows; i++) projection += vector[i - k] * rhs[i];
    projection *= beta;
    for (let i = k; i < rows; i++) rhs[i] -= projection * vector[i - k];
    matrix[k * columns + k] = alpha;
    for (let i = k + 1; i < rows; i++) matrix[i * columns + k] = 0;
    largestDiagonal = Math.max(largestDiagonal, Math.abs(alpha));
    smallestDiagonal = Math.min(smallestDiagonal, Math.abs(alpha));
  }
  const coefficients = new Array<number>(columns).fill(0);
  for (let i = columns - 1; i >= 0; i--) {
    let value = rhs[i];
    for (let j = i + 1; j < columns; j++) value -= matrix[i * columns + j] * coefficients[j];
    coefficients[i] = finite(value / matrix[i * columns + i]);
  }
  return { coefficients, conditionEstimate: largestDiagonal / smallestDiagonal };
}

function horner(coefficients: readonly number[], x: number): number {
  let value = 0;
  for (let i = coefficients.length - 1; i >= 0; i--) value = value * x + coefficients[i];
  return value;
}

/** The returned predictor retains the normalized basis even for very large X. */
export function fitPolynomial(points: readonly XY[], degree: number): PolynomialFit {
  validateInput(points, {});
  if (!Number.isInteger(degree) || degree < 0) throw new MathError('MATH_DEGREE');
  if (points.length < degree + 1) throw new MathError('MATH_POINTS', { required: degree + 1 });
  if (new Set(points.map(p => p.x)).size < degree + 1) throw new MathError('MATH_DISTINCT_X', { required: degree + 1 });
  const x = normalization(points.map(p => p.x));
  const y = normalization(points.map(p => p.y));
  const columns = degree + 1;
  const matrix = new Float64Array(points.length * columns);
  for (let i = 0; i < points.length; i++) {
    let power = 1;
    for (let j = 0; j < columns; j++) { matrix[i * columns + j] = power; power *= x.values[i]; }
  }
  const qr = leastSquares(matrix, Float64Array.from(y.values), points.length, columns);
  const normalizedCoefficients = qr.coefficients;
  const predict = (at: number) => {
    if (!Number.isFinite(at)) throw new MathError('MATH_NONFINITE_INPUT');
    return finite(y.center + y.scale * horner(normalizedCoefficients, (at - x.center) / x.scale));
  };
  const derivativeCoefficients = normalizedCoefficients.slice(1).map((value, i) => value * (i + 1));
  const derivative = (at: number) => finite((y.scale / x.scale) * horner(derivativeCoefficients, (at - x.center) / x.scale));
  // Compose q((X-center)/scale) recursively, avoiding powers of large X.
  let coefficients = [normalizedCoefficients[degree] * y.scale];
  const shift = -x.center / x.scale;
  for (let i = degree - 1; i >= 0; i--) {
    const next = new Array<number>(coefficients.length + 1).fill(0);
    for (let j = 0; j < coefficients.length; j++) {
      next[j] += shift * coefficients[j];
      next[j + 1] += coefficients[j] / x.scale;
    }
    next[0] += normalizedCoefficients[i] * y.scale;
    coefficients = next;
  }
  coefficients[0] += y.center;
  coefficients.forEach(finite);
  return { coefficients, predict, derivative, rSquared: rSquared(points, predict), conditionEstimate: qr.conditionEstimate };
}
