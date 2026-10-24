import { createRng, gaussian } from './math';

export type Label = 0 | 1;

export interface Point2D {
  id: number;
  x: number;
  y: number;
  label: Label;
}

const SIZE = 80;
const MARGIN = 10;

/** Two classes separated by a (noisy) oblique line. Coordinates in 10..90. */
export const linearSample = (sampleSize: number, version: number, overlap: number): Point2D[] => {
  const random = createRng(version + 101);
  return Array.from({ length: sampleSize }, (_, id) => {
    const x = MARGIN + random() * SIZE;
    const y = MARGIN + random() * SIZE;
    const noise = (random() - 0.5) * overlap * 22;
    return { id, x, y, label: (x - 50) * 0.92 - (y - 50) * 0.78 + noise >= 0 ? 1 : 0 };
  });
};

/** Class 1 outside a ring of radius 22, class 0 inside (needs a non-linear boundary). */
export const ringSample = (sampleSize: number, version: number, overlap: number): Point2D[] => {
  const random = createRng(version + 303);
  return Array.from({ length: sampleSize }, (_, id) => {
    const x = MARGIN + random() * SIZE;
    const y = MARGIN + random() * SIZE;
    const noise = (random() - 0.5) * overlap * 10;
    return { id, x, y, label: Math.hypot(x - 50, y - 50) + noise >= 22 ? 1 : 0 };
  });
};

/**
 * Synthetic credit data: x = income, y = debt ratio (both 0..100).
 * Approval depends on a noisy oblique rule, so axis-aligned trees must approximate it with steps.
 */
export const creditSample = (sampleSize: number, seed: number): Point2D[] => {
  const random = createRng(seed);
  return Array.from({ length: sampleSize }, (_, id) => {
    const x = 5 + random() * 90;
    const y = 5 + random() * 90;
    const noise = gaussian(random) * 9;
    return { id, x, y, label: x * 0.9 - y * 0.7 + noise >= 22 ? 1 : 0 };
  });
};

/** Example points for the regression canvas (y ≈ 18 + 0.62 x + noise). */
export const regressionExample = (seed = 7, count = 14): { x: number; y: number }[] => {
  const random = createRng(seed);
  return Array.from({ length: count }, () => {
    const x = 8 + random() * 84;
    return { x, y: clamp100(18 + 0.62 * x + gaussian(random) * 9) };
  });
};

const clamp100 = (v: number) => Math.min(96, Math.max(4, v));
