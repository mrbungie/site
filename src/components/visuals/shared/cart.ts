import type { Point2D } from './datasets';
import type { Rng } from './math';

export interface Bounds {
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}

export interface TreeNode {
  id: number;
  depth: number;
  n: number;
  n1: number;
  gini: number;
  bounds: Bounds;
  /** 0 = x, 1 = y. Undefined for leaves. */
  feature?: 0 | 1;
  threshold?: number;
  left?: TreeNode;
  right?: TreeNode;
}

export const gini = (n0: number, n1: number) => {
  const n = n0 + n1;
  if (n === 0) return 0;
  const p1 = n1 / n;
  return 1 - p1 * p1 - (1 - p1) * (1 - p1);
};

interface Options {
  maxDepth: number;
  minLeaf?: number;
  /** Number of features sampled at each split (1 or 2). Needs rng when < 2. */
  maxFeatures?: 1 | 2;
  rng?: Rng;
}

const ROOT_BOUNDS: Bounds = { x0: 0, x1: 100, y0: 0, y1: 100 };

/** Greedy CART with Gini impurity and exhaustive threshold search (midpoints between sorted values). */
export const buildTree = (points: Point2D[], options: Options): TreeNode => {
  const { maxDepth, minLeaf = 2, maxFeatures = 2, rng } = options;
  let counter = 0;

  const grow = (subset: Point2D[], depth: number, bounds: Bounds): TreeNode => {
    const n1 = subset.reduce((sum, p) => sum + p.label, 0);
    const n = subset.length;
    const node: TreeNode = { id: counter++, depth, n, n1, gini: gini(n - n1, n1), bounds };
    if (depth >= maxDepth || node.gini === 0 || n < 2 * minLeaf) return node;

    const features: (0 | 1)[] =
      maxFeatures === 2 || !rng ? [0, 1] : [rng() < 0.5 ? 0 : 1];

    let best: { feature: 0 | 1; threshold: number; impurity: number } | null = null;
    for (const feature of features) {
      const sorted = [...subset].sort((a, b) => (feature === 0 ? a.x - b.x : a.y - b.y));
      let left1 = 0;
      for (let i = 0; i < n - 1; i += 1) {
        left1 += sorted[i].label;
        const a = feature === 0 ? sorted[i].x : sorted[i].y;
        const b = feature === 0 ? sorted[i + 1].x : sorted[i + 1].y;
        const leftN = i + 1;
        const rightN = n - leftN;
        if (a === b || leftN < minLeaf || rightN < minLeaf) continue;
        const impurity =
          (leftN / n) * gini(leftN - left1, left1) + (rightN / n) * gini(rightN - (n1 - left1), n1 - left1);
        if (best === null || impurity < best.impurity - 1e-12) {
          best = { feature, threshold: (a + b) / 2, impurity };
        }
      }
    }
    if (!best || node.gini - best.impurity <= 1e-12) return node;

    const goesLeft = (p: Point2D) => (best!.feature === 0 ? p.x : p.y) <= best!.threshold;
    const leftBounds = { ...bounds };
    const rightBounds = { ...bounds };
    if (best.feature === 0) {
      leftBounds.x1 = best.threshold;
      rightBounds.x0 = best.threshold;
    } else {
      leftBounds.y1 = best.threshold;
      rightBounds.y0 = best.threshold;
    }
    node.feature = best.feature;
    node.threshold = best.threshold;
    node.left = grow(subset.filter(goesLeft), depth + 1, leftBounds);
    node.right = grow(subset.filter((p) => !goesLeft(p)), depth + 1, rightBounds);
    return node;
  };

  return grow(points, 0, ROOT_BOUNDS);
};

export const isLeaf = (node: TreeNode) => node.left === undefined;

/** Nodes visited from the root to the leaf that contains (x, y). */
export const decisionPath = (root: TreeNode, x: number, y: number): TreeNode[] => {
  const path = [root];
  let node = root;
  while (node.left && node.right && node.feature !== undefined && node.threshold !== undefined) {
    const value = node.feature === 0 ? x : y;
    node = value <= node.threshold ? node.left : node.right;
    path.push(node);
  }
  return path;
};

/** P(class 1) at the leaf containing (x, y). */
export const predictProbability = (root: TreeNode, x: number, y: number) => {
  const leaf = decisionPath(root, x, y).at(-1)!;
  return leaf.n === 0 ? 0.5 : leaf.n1 / leaf.n;
};

export const leaves = (root: TreeNode): TreeNode[] =>
  isLeaf(root) ? [root] : [...leaves(root.left!), ...leaves(root.right!)];

export const bootstrap = <T,>(items: T[], rng: Rng): T[] =>
  items.map(() => items[Math.min(items.length - 1, Math.floor(rng() * items.length))]);

export const FEATURE_NAMES = ['Ingreso', 'Deuda'] as const;
