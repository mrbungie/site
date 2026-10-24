/** Pure numeric helpers shared by all visualizers (no DOM, SSR-safe). */

export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

/** Numerically stable logistic function. */
export const sigmoid = (z: number) => (z >= 0 ? 1 / (1 + Math.exp(-z)) : Math.exp(z) / (1 + Math.exp(z)));

/** Park–Miller LCG. Deterministic, returns floats in [0, 1). */
export const createRng = (seed: number) => {
  let value = Math.floor(Math.abs(seed)) % 2147483647;
  if (value <= 0) value += 2147483646;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
};
export type Rng = () => number;

/** Standard normal sample (Box–Muller). */
export const gaussian = (rng: Rng) => {
  let u = 0;
  while (u === 0) u = rng();
  const v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
};

export const mean = (values: number[]) => (values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0);

/** Format with a true minus sign (U+2212) and fixed decimals. */
export const fmt = (value: number, digits = 2) => {
  const text = Math.abs(value).toFixed(digits);
  return value < 0 && Number(text) !== 0 ? `−${text}` : text;
};
export const pct = (value: number, digits = 1) => `${(value * 100).toFixed(digits)}%`;

export interface XY {
  x: number;
  y: number;
}

/** Pearson correlation and ordinary least squares in one pass over centered data. */
export const linearStats = (points: XY[]) => {
  const n = points.length;
  const xMean = mean(points.map((p) => p.x));
  const yMean = mean(points.map((p) => p.y));
  let sxy = 0;
  let sxx = 0;
  let syy = 0;
  for (const p of points) {
    const dx = p.x - xMean;
    const dy = p.y - yMean;
    sxy += dx * dy;
    sxx += dx * dx;
    syy += dy * dy;
  }
  const slope = sxx > 1e-12 ? sxy / sxx : 0;
  const intercept = yMean - slope * xMean;
  const denominator = Math.sqrt(sxx * syy);
  const r = denominator > 1e-12 ? sxy / denominator : 0;
  return { n, xMean, yMean, sxx, syy, sxy, slope, intercept, r, ssTotal: syy, hasSpread: sxx > 1e-9 };
};

/** Sum of squared residuals for a line y = a + b x. */
export const sumSquaredResiduals = (points: XY[], intercept: number, slope: number) =>
  points.reduce((sum, p) => sum + (p.y - (intercept + slope * p.x)) ** 2, 0);

/** Fisher z-transform confidence interval for a Pearson r (needs n > 3). */
export const correlationInterval = (r: number, n: number, z = 1.96): [number, number] => {
  if (n <= 3) return [-1, 1];
  const rc = clamp(r, -0.999999, 0.999999);
  const center = Math.atanh(rc);
  const half = z / Math.sqrt(n - 3);
  return [Math.tanh(center - half), Math.tanh(center + half)];
};

/** Clip the line a·x + b·y + c = 0 to the square [lo, hi]². */
export const clipLine = (a: number, b: number, c: number, lo = 0, hi = 100): [XY, XY] | null => {
  const eps = 1e-9;
  const found: XY[] = [];
  if (Math.abs(b) > eps) {
    for (const x of [lo, hi]) {
      const y = -(a * x + c) / b;
      if (y >= lo - eps && y <= hi + eps) found.push({ x, y });
    }
  }
  if (Math.abs(a) > eps) {
    for (const y of [lo, hi]) {
      const x = -(b * y + c) / a;
      if (x >= lo - eps && x <= hi + eps) found.push({ x, y });
    }
  }
  const unique = found.filter((p, i) => found.findIndex((q) => Math.hypot(q.x - p.x, q.y - p.y) < 1e-6) === i);
  return unique.length >= 2 ? [unique[0], unique[1]] : null;
};

/**
 * Marching squares on a regular grid (values[row][col], row = y index).
 * Returns an SVG path of line segments for the iso-level, in 0..100 plot space (y NOT flipped).
 */
export const contourPath = (values: number[][], level: number, size = 100) => {
  const rows = values.length;
  const cols = values[0]?.length ?? 0;
  if (rows < 2 || cols < 2) return '';
  const sx = size / (cols - 1);
  const sy = size / (rows - 1);
  const lerp = (a: number, b: number) => (b === a ? 0.5 : (level - a) / (b - a));
  const segments: string[] = [];
  for (let r = 0; r < rows - 1; r += 1) {
    for (let c = 0; c < cols - 1; c += 1) {
      const v0 = values[r][c];
      const v1 = values[r][c + 1];
      const v2 = values[r + 1][c + 1];
      const v3 = values[r + 1][c];
      const index = (v0 > level ? 1 : 0) | (v1 > level ? 2 : 0) | (v2 > level ? 4 : 0) | (v3 > level ? 8 : 0);
      if (index === 0 || index === 15) continue;
      const top = { x: (c + lerp(v0, v1)) * sx, y: r * sy };
      const right = { x: (c + 1) * sx, y: (r + lerp(v1, v2)) * sy };
      const bottom = { x: (c + lerp(v3, v2)) * sx, y: (r + 1) * sy };
      const left = { x: c * sx, y: (r + lerp(v0, v3)) * sy };
      const pairs: Record<number, XY[][]> = {
        1: [[left, top]], 2: [[top, right]], 3: [[left, right]], 4: [[right, bottom]],
        5: [[left, top], [right, bottom]], 6: [[top, bottom]], 7: [[left, bottom]], 8: [[left, bottom]],
        9: [[top, bottom]], 10: [[top, right], [left, bottom]], 11: [[right, bottom]], 12: [[left, right]],
        13: [[top, right]], 14: [[left, top]],
      };
      for (const [p, q] of pairs[index]) {
        segments.push(`M${p.x.toFixed(2)} ${p.y.toFixed(2)}L${q.x.toFixed(2)} ${q.y.toFixed(2)}`);
      }
    }
  }
  return segments.join('');
};
