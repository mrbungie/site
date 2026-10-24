import { createRng } from './math';

export type KernelName = 'linear' | 'rbf';

export interface SvmModel {
  kernel: KernelName;
  gamma: number;
  /** Training inputs (already scaled). */
  inputs: number[][];
  targets: (1 | -1)[];
  alphas: number[];
  bias: number;
  /** Primal weights, linear kernel only. */
  weights: [number, number] | null;
  decision: (x: number, y: number) => number;
  supportIndices: number[];
}

const dot = (a: number[], b: number[]) => a[0] * b[0] + a[1] * b[1];

const kernelFn = (kernel: KernelName, gamma: number) =>
  kernel === 'linear'
    ? dot
    : (a: number[], b: number[]) => Math.exp(-gamma * ((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2));

/**
 * Soft-margin SVM trained with the simplified SMO algorithm (Platt 1998 / CS229 notes).
 * Maximizes  Σα − ½ΣΣ αᵢαⱼ yᵢyⱼ K(xᵢ,xⱼ)  subject to 0 ≤ αᵢ ≤ C and Σ αᵢyᵢ = 0.
 * Decision function f(x) = Σ αᵢ yᵢ K(xᵢ, x) + b; margins are the level sets f = ±1.
 */
export const trainSvm = (
  inputs: number[][],
  targets: (1 | -1)[],
  { C, kernel, gamma, seed = 1 }: { C: number; kernel: KernelName; gamma: number; seed?: number },
): SvmModel => {
  const n = inputs.length;
  const k = kernelFn(kernel, gamma);
  const gram = inputs.map((a) => inputs.map((b) => k(a, b)));
  const alphas = new Array<number>(n).fill(0);
  let b = 0;
  const rng = createRng(seed);
  const tol = 1e-3;
  const f = (i: number) => {
    let s = b;
    for (let j = 0; j < n; j += 1) if (alphas[j] !== 0) s += alphas[j] * targets[j] * gram[j][i];
    return s;
  };

  let passes = 0;
  let iterations = 0;
  while (passes < 8 && iterations < 400) {
    iterations += 1;
    let changed = 0;
    for (let i = 0; i < n; i += 1) {
      const Ei = f(i) - targets[i];
      if ((targets[i] * Ei < -tol && alphas[i] < C) || (targets[i] * Ei > tol && alphas[i] > 0)) {
        let j = Math.floor(rng() * (n - 1));
        if (j >= i) j += 1;
        const Ej = f(j) - targets[j];
        const ai = alphas[i];
        const aj = alphas[j];
        let L: number;
        let H: number;
        if (targets[i] !== targets[j]) {
          L = Math.max(0, aj - ai);
          H = Math.min(C, C + aj - ai);
        } else {
          L = Math.max(0, ai + aj - C);
          H = Math.min(C, ai + aj);
        }
        if (L === H) continue;
        const eta = 2 * gram[i][j] - gram[i][i] - gram[j][j];
        if (eta >= 0) continue;
        let ajNew = aj - (targets[j] * (Ei - Ej)) / eta;
        ajNew = Math.min(H, Math.max(L, ajNew));
        if (Math.abs(ajNew - aj) < 1e-5) continue;
        const aiNew = ai + targets[i] * targets[j] * (aj - ajNew);
        const b1 =
          b - Ei - targets[i] * (aiNew - ai) * gram[i][i] - targets[j] * (ajNew - aj) * gram[i][j];
        const b2 =
          b - Ej - targets[i] * (aiNew - ai) * gram[i][j] - targets[j] * (ajNew - aj) * gram[j][j];
        b = aiNew > 0 && aiNew < C ? b1 : ajNew > 0 && ajNew < C ? b2 : (b1 + b2) / 2;
        alphas[i] = aiNew;
        alphas[j] = ajNew;
        changed += 1;
      }
    }
    passes = changed === 0 ? passes + 1 : 0;
  }

  const supportIndices = alphas.flatMap((a, i) => (a > 1e-6 ? [i] : []));
  const weights: [number, number] | null =
    kernel === 'linear'
      ? supportIndices.reduce<[number, number]>(
          (w, i) => [w[0] + alphas[i] * targets[i] * inputs[i][0], w[1] + alphas[i] * targets[i] * inputs[i][1]],
          [0, 0],
        )
      : null;

  const bias = b;
  const decision = (x: number, y: number) => {
    const p = [x, y];
    let s = bias;
    for (const i of supportIndices) s += alphas[i] * targets[i] * k(inputs[i], p);
    return s;
  };

  return { kernel, gamma, inputs, targets, alphas, bias, weights, decision, supportIndices };
};
